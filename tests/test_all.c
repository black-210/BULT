/**
 * BULT — Test Suite Runner
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#include "bult/core.h"
#include "bult/rf.h"
#include "bult/security.h"
#include "bult/science.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <math.h>

void test_sha256(void) {
    printf("[TEST] Core SHA-256 Hashing...");
    const char *text = "BULT_DEFENSIVE_TEST_2026";
    char hash[65];
    bult_status_t st = bult_sha256_buffer((const uint8_t*)text, strlen(text), hash);
    assert(st == BULT_STATUS_OK);
    assert(strlen(hash) == 64);
    printf(" PASS\n");
}

void test_fft_and_psd(void) {
    printf("[TEST] RF Signal Processing & FFT...");
    bult_iq_capture_t cap;
    bult_status_t st = bult_rf_generate_synthetic(&cap, 1024, 2048000.0, 433920000.0, "cw");
    assert(st == BULT_STATUS_OK);
    assert(cap.sample_count == 1024);

    bult_spectrum_result_t spec;
    st = bult_rf_spectrum_analyze(&cap, 1024, BULT_WINDOW_HANN, &spec);
    assert(st == BULT_STATUS_OK);
    assert(spec.psd_db != NULL);
    assert(spec.snr_db > 10.0); /* CW tone should have SNR > 10 dB */

    bult_rf_free_spectrum(&spec);
    bult_rf_free_capture(&cap);
    printf(" PASS\n");
}

void test_rfdna_features(void) {
    printf("[TEST] RF-DNA Feature Extraction...");
    bult_iq_capture_t cap1, cap2;
    bult_rf_generate_synthetic(&cap1, 2048, 2048000.0, 433920000.0, "qpsk");
    bult_rf_generate_synthetic(&cap2, 2048, 2048000.0, 433920000.0, "qpsk");

    bult_rfdna_features_t f1, f2;
    bult_rfdna_extract(&cap1, &f1);
    bult_rfdna_extract(&cap2, &f2);

    double sim = bult_rfdna_similarity(&f1, &f2);
    assert(sim >= 0.0 && sim <= 1.0);

    bult_rf_free_capture(&cap1);
    bult_rf_free_capture(&cap2);
    printf(" PASS\n");
}

void test_localization(void) {
    printf("[TEST] Direction Finding & Localization Solvers...");
    bult_df_bearing_t bearings[3] = {
        { 51.50, -0.12, 45.0, 1.0 },
        { 51.52, -0.10, 315.0, 1.0 },
        { 51.49, -0.11, 15.0, 1.0 }
    };
    bult_localization_result_t loc;
    bult_status_t st = bult_rf_triangulate_bearings(bearings, 3, &loc);
    assert(st == BULT_STATUS_OK);
    assert(loc.sufficient_data == true);
    assert(loc.confidence_score > 0.5);

    /* Test boundary condition with < 2 bearings */
    st = bult_rf_triangulate_bearings(bearings, 1, &loc);
    assert(st == BULT_STATUS_INSUFFICIENT_DATA);
    assert(loc.sufficient_data == false);
    printf(" PASS\n");
}

void test_security_audit_and_correlation(void) {
    printf("[TEST] Red-Blue-Purple Security Engine...");
    const char *test_code = "void vuln() { char buf[10]; strcpy(buf, \"test\"); gets(buf); }";
    bult_red_audit_summary_t red;
    bult_status_t st = bult_red_audit_source(test_code, &red);
    assert(st == BULT_STATUS_OK);
    assert(red.unsafe_api_count >= 2);

    bult_purple_coverage_report_t purp;
    st = bult_purple_correlate(&red, NULL, 0, &purp);
    assert(st == BULT_STATUS_OK);
    assert(purp.total_red_findings >= 2);
    assert(purp.coverage_percentage > 0.0);
    printf(" PASS\n");
}

void test_physics_and_chemistry(void) {
    printf("[TEST] Scientific Physics & Chemistry Solvers...");
    bult_em_calc_result_t em;
    bult_status_t st = bult_physics_em_analysis(2.4e9, 1000.0, &em);
    assert(st == BULT_STATUS_OK);
    assert(em.wavelength_m > 0.12 && em.wavelength_m < 0.13); /* 2.4 GHz ~ 0.125m */

    bult_chemical_analysis_t chem;
    st = bult_chemistry_parse_formula("C8H10N4O2", &chem);
    assert(st == BULT_STATUS_OK);
    assert(chem.molecular_weight > 194.0 && chem.molecular_weight < 195.0); /* Caffeine ~194.19 */
    printf(" PASS\n");
}

int main(void) {
    printf("=========================================\n");
    printf(" BULT Integrated Test Suite Runner\n");
    printf("=========================================\n");
    test_sha256();
    test_fft_and_psd();
    test_rfdna_features();
    test_localization();
    test_security_audit_and_correlation();
    test_physics_and_chemistry();
    printf("=========================================\n");
    printf(" ALL 6 TEST SUITES PASSED (100%%)\n");
    printf("=========================================\n");
    return 0;
}
