/**
 * BULT — RF Intelligence & Signal Processing Header
 * Target: C> (C-Greater) Systems Architecture & ISO C11 FFI
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#ifndef BULT_RF_H
#define BULT_RF_H

#include "core.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    float i;
    float q;
} bult_complex_f32_t;

typedef enum {
    BULT_IQ_FORMAT_INT16 = 0,
    BULT_IQ_FORMAT_FLOAT32,
    BULT_IQ_FORMAT_FLOAT64
} bult_iq_format_t;

typedef enum {
    BULT_WINDOW_RECTANGULAR = 0,
    BULT_WINDOW_HANN,
    BULT_WINDOW_HAMMING,
    BULT_WINDOW_BLACKMAN
} bult_window_type_t;

typedef struct {
    char filepath[256];
    bult_iq_format_t format;
    double sample_rate_hz;
    double center_freq_hz;
    size_t sample_count;
    double duration_sec;
    bult_complex_f32_t *samples;
} bult_iq_capture_t;

typedef struct {
    double noise_floor_db;
    double peak_power_db;
    double peak_freq_hz;
    double snr_db;
    double bandwidth_3db_hz;
    double bandwidth_10db_hz;
    double dc_offset_i;
    double dc_offset_q;
    double amp_imbalance_db;
    double phase_error_deg;
    size_t fft_size;
    float *psd_db;
} bult_spectrum_result_t;

/* RF-DNA Feature Vector (Statistical Fingerprint) */
typedef struct {
    double amp_mean;
    double amp_variance;
    double amp_skewness;
    double amp_kurtosis;
    double phase_variance;
    double phase_trajectory_derivative;
    double spectral_entropy;
    double spectral_centroid;
    double spectral_rolloff;
    double spectral_flatness;
} bult_rfdna_features_t;

/* Direction Finding & Localization */
typedef struct {
    double latitude;
    double longitude;
    double bearing_deg;       /* True North degrees */
    double confidence_weight;
} bult_df_bearing_t;

typedef struct {
    double latitude;
    double longitude;
    double timestamp_sec;
} bult_tdoa_station_t;

typedef struct {
    double est_latitude;
    double est_longitude;
    double uncertainty_semi_major_m;
    double uncertainty_semi_minor_m;
    double orientation_deg;
    double confidence_score;
    size_t stations_used;
    bool   sufficient_data;
    char   limitation_notes[256];
} bult_localization_result_t;

/* RF Engine API */
bult_status_t bult_rf_generate_synthetic(bult_iq_capture_t *capture, size_t sample_count, double sample_rate, double center_freq, const char *modulation);
bult_status_t bult_rf_load_iq_file(const char *filepath, bult_iq_format_t format, double sample_rate, double center_freq, bult_iq_capture_t *out_capture);
void          bult_rf_free_capture(bult_iq_capture_t *capture);

bult_status_t bult_rf_fft(bult_complex_f32_t *in_out, size_t n, bool inverse);
bult_status_t bult_rf_spectrum_analyze(const bult_iq_capture_t *capture, size_t fft_size, bult_window_type_t window, bult_spectrum_result_t *out_result);
void          bult_rf_free_spectrum(bult_spectrum_result_t *result);

/* RF-DNA Extraction & Comparison */
bult_status_t bult_rfdna_extract(const bult_iq_capture_t *capture, bult_rfdna_features_t *out_feat);
double        bult_rfdna_similarity(const bult_rfdna_features_t *f1, const bult_rfdna_features_t *f2);

/* Localization Solvers */
bult_status_t bult_rf_triangulate_bearings(const bult_df_bearing_t *bearings, size_t count, bult_localization_result_t *out_result);
bult_status_t bult_rf_tdoa_solve(const bult_tdoa_station_t *stations, size_t count, bult_localization_result_t *out_result);

#ifdef __cplusplus
}
#endif

#endif /* BULT_RF_H */
