/**
 * BULT — Physics & Chemistry Scientific Forensics Headers
 * Target: C> (C-Greater) Systems Architecture & ISO C11 FFI
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#ifndef BULT_SCIENCE_H
#define BULT_SCIENCE_H

#include "core.h"

#ifdef __cplusplus
extern "C" {
#endif

/* Physical Constants (CODATA 2022) */
#define BULT_SPEED_OF_LIGHT       299792458.0      /* m/s */
#define BULT_VACUUM_PERMITTIVITY  8.8541878128e-12 /* F/m (epsilon_0) */
#define BULT_VACUUM_PERMEABILITY  1.25663706212e-6 /* H/m (mu_0) */
#define BULT_BOLTZMANN_CONSTANT   1.380649e-23     /* J/K */

typedef struct {
    double value;
    double uncertainty; /* 1-sigma */
    char unit[16];
} bult_measurement_t;

/* Physics Engine */
typedef struct {
    double frequency_hz;
    double distance_m;
    double fspl_db;
    double fspl_uncertainty_db;
    double wavelength_m;
    double skin_depth_copper_m;
    double dipole_resonant_length_m;
} bult_em_calc_result_t;

bult_status_t bult_physics_fspl(double freq_hz, double dist_m, double freq_unc, double dist_unc, bult_measurement_t *out_fspl);
bult_status_t bult_physics_em_analysis(double freq_hz, double dist_m, bult_em_calc_result_t *out_result);
bult_status_t bult_physics_skin_depth(double freq_hz, double conductivity_s_m, double rel_permeability, bult_measurement_t *out_depth);

/* Chemistry & Spectroscopy Engine */
typedef struct {
    char formula[64];
    double molecular_weight;       /* g/mol */
    double mass_uncertainty;
    size_t element_count;
    struct {
        char symbol[4];
        int count;
        double mass_fraction_pct;  /* % by weight */
    } elements[16];
} bult_chemical_analysis_t;

typedef struct {
    double position_wavenumber;    /* cm^-1 or nm */
    double intensity;
    double fwhm;                   /* Full width at half max */
    double snr;
    char assignment[64];
} bult_spectral_peak_t;

typedef struct {
    size_t total_peaks;
    bult_spectral_peak_t peaks[32];
    double baseline_noise;
    char matched_compound[64];
    double confidence_score;
} bult_spectroscopy_result_t;

bult_status_t bult_chemistry_parse_formula(const char *formula, bult_chemical_analysis_t *out_analysis);
bult_status_t bult_chemistry_analyze_spectrum(const double *x_vals, const double *y_vals, size_t count, bult_spectroscopy_result_t *out_result);

#ifdef __cplusplus
}
#endif

#endif /* BULT_SCIENCE_H */
