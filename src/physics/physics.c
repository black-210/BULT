/**
 * BULT — Physics & Electromagnetic Analysis Implementation
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#include "bult/science.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

bult_status_t bult_physics_fspl(double freq_hz, double dist_m, double freq_unc, double dist_unc, bult_measurement_t *out) {
    if (freq_hz <= 0.0 || dist_m <= 0.0 || !out) return BULT_STATUS_INVALID_ARG;

    /* FSPL(dB) = 20 * log10(d) + 20 * log10(f) + 20 * log10(4*pi / c) */
    double constant_term = 20.0 * log10((4.0 * M_PI) / BULT_SPEED_OF_LIGHT);
    double fspl = 20.0 * log10(dist_m) + 20.0 * log10(freq_hz) + constant_term;

    /* Uncertainty propagation: d(FSPL)/dd = 20 / (d * ln(10)), d(FSPL)/df = 20 / (f * ln(10)) */
    double k = 20.0 / log(10.0);
    double var_dist = (k / dist_m) * (k / dist_m) * (dist_unc * dist_unc);
    double var_freq = (k / freq_hz) * (k / freq_hz) * (freq_unc * freq_unc);
    double sigma = sqrt(var_dist + var_freq);

    out->value = fspl;
    out->uncertainty = sigma > 0.0 ? sigma : 0.05;
    snprintf(out->unit, sizeof(out->unit), "dB");
    return BULT_STATUS_OK;
}

bult_status_t bult_physics_em_analysis(double freq_hz, double dist_m, bult_em_calc_result_t *out) {
    if (freq_hz <= 0.0 || dist_m <= 0.0 || !out) return BULT_STATUS_INVALID_ARG;
    memset(out, 0, sizeof(*out));

    out->frequency_hz = freq_hz;
    out->distance_m = dist_m;

    bult_measurement_t fspl_meas;
    bult_physics_fspl(freq_hz, dist_m, freq_hz * 0.001, dist_m * 0.01, &fspl_meas);
    out->fspl_db = fspl_meas.value;
    out->fspl_uncertainty_db = fspl_meas.uncertainty;

    out->wavelength_m = BULT_SPEED_OF_LIGHT / freq_hz;
    out->dipole_resonant_length_m = (out->wavelength_m / 2.0) * 0.95;

    /* Copper conductivity: 5.8e7 S/m */
    double sigma_cu = 5.8e7;
    out->skin_depth_copper_m = 1.0 / sqrt(M_PI * freq_hz * BULT_VACUUM_PERMEABILITY * sigma_cu);

    return BULT_STATUS_OK;
}

bult_status_t bult_physics_skin_depth(double freq_hz, double conductivity_s_m, double rel_permeability, bult_measurement_t *out) {
    if (freq_hz <= 0.0 || conductivity_s_m <= 0.0 || rel_permeability <= 0.0 || !out) return BULT_STATUS_INVALID_ARG;
    double mu = rel_permeability * BULT_VACUUM_PERMEABILITY;
    double delta = 1.0 / sqrt(M_PI * freq_hz * mu * conductivity_s_m);

    out->value = delta;
    out->uncertainty = delta * 0.02; /* 2% measurement uncertainty */
    snprintf(out->unit, sizeof(out->unit), "meters");
    return BULT_STATUS_OK;
}
