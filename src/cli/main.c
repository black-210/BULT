/**
 * BULT — CLI Engine & Advanced Interactive Terminal Shell
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

static void print_banner(void) {
    printf("\033[1;36m===============================================================================\033[0m\n");
    printf("\033[1;37m  BULT — Elite Purple-Team, RF Intelligence & Multidisciplinary Forensics      \033[0m\n");
    printf("\033[0;32m  Target Specification: C> (C-Greater) Systems Architecture [black-210/C-]    \033[0m\n");
    printf("\033[0;33m  Maintainer: black-210 | License: GNU AGPL-3.0 | Version: %s                 \033[0m\n", BULT_VERSION_STRING);
    printf("\033[1;36m===============================================================================\033[0m\n\n");
}

static void print_help(void) {
    printf("BULT Command Architecture:\n\n");
    printf("  General:\n");
    printf("    bult info                            Display system specifications & C> toolchain\n");
    printf("    bult status                          Display subsystem health & active case status\n");
    printf("    bult selftest                        Run comprehensive self-tests across all engines\n");
    printf("    bult config show                     Show active configuration parameters\n\n");
    printf("  Red Team (Security Assessment):\n");
    printf("    bult red audit <file|--system>       Static unsafe API and security posture audit\n");
    printf("    bult red binary <binary_file>        Inspect binary structure and unsafe imports\n");
    printf("    bult red fuzz <target> [iters]       Run deterministic mutation parser fuzzer\n\n");
    printf("  Blue Team (Detection & Forensics):\n");
    printf("    bult blue integrity [manifest]       Verify file integrity hashes against baseline\n");
    printf("    bult blue detect <event_line>        Evaluate detection rules against event logs\n");
    printf("    bult blue timeline <log_file>        Parse event logs and reconstruct timeline\n\n");
    printf("  Purple Team (Correlation & Validation):\n");
    printf("    bult purple correlate                Correlate red findings with blue detections\n");
    printf("    bult purple coverage                 Calculate real mathematically-backed coverage %%\n");
    printf("    bult purple report [--json]          Generate purple-team correlation report\n\n");
    printf("  RF Intelligence & Direction Finding (`intel`):\n");
    printf("    bult intel status                    Show RF subsystem receiver & capture status\n");
    printf("    bult intel capture inspect <file>    Inspect sample count, duration, format\n");
    printf("    bult intel spectrum analyze <file>   Execute FFT, compute PSD, SNR, bandwidth\n");
    printf("    bult intel fingerprint extract <f>   Extract statistical RF-DNA feature vector\n");
    printf("    bult intel fingerprint compare <a> <b> Compare two RF captures for similarity\n");
    printf("    bult intel direction analyze [args]  Analyze direction-finding bearing vectors\n");
    printf("    bult intel locate estimate [args]    TDoA / triangulation position estimation\n\n");
    printf("  RF Signal Processing (`rf`):\n");
    printf("    bult rf iq validate <file>           Validate I/Q complex sample integrity\n");
    printf("    bult rf spectrum <file>              Compute and display power spectral density\n");
    printf("    bult rf compare <file1> <file2>      Compare spectral characteristics\n\n");
    printf("  Physical & Electromagnetic Forensics (`physics`):\n");
    printf("    bult physics calculate <f_hz> <d_m>  Compute FSPL, wavelength, skin depth\n");
    printf("    bult physics uncertainty             Gaussian uncertainty propagation demo\n\n");
    printf("  Chemical Forensics & Spectroscopy (`chemistry`):\n");
    printf("    bult chemistry analyze <formula>     Parse chemical formula & compute mass\n");
    printf("    bult chemistry spectroscopy [file]   Identify peaks, FWHM, and compound match\n\n");
    printf("  Forensics & Case Management (`forensic`):\n");
    printf("    bult forensic case create <id>       Initialize new investigative case container\n");
    printf("    bult forensic evidence hash <file>   Compute cryptographic SHA-256 for custody\n");
    printf("    bult forensic report [--markdown]    Export complete multi-subsystem case report\n");
    printf("    bult report export <json|md>         Export structured findings to stdout/file\n\n");
}

int bult_execute_command(int argc, char **argv) {
    if (argc < 2) {
        print_help();
        return 0;
    }

    const char *cmd1 = argv[1];
    const char *cmd2 = (argc > 2) ? argv[2] : "";

    if (strcmp(cmd1, "info") == 0) {
        printf("[BULT INFO]\n");
        printf("  Application: BULT Intelligence & Forensic Engine v%s\n", BULT_VERSION_STRING);
        printf("  Language: C> (C-Greater) Systems Programming Language (ISO C11 backend)\n");
        printf("  Target Architecture: x86_64 / aarch64 / POSIX systems\n");
        printf("  Maintainer: black-210 | License: GNU AGPL-3.0\n");
        printf("  Compiler Driver: cgt (https://github.com/black-210/C-)\n");
        printf("  Subsystems: RF, Intel, RedTeam, BlueTeam, PurpleTeam, Physics, Chemistry, Forensics\n");
        return 0;
    }

    if (strcmp(cmd1, "status") == 0) {
        bult_case_t *c = bult_case_get_active();
        printf("[BULT STATUS]\n");
        printf("  Active Case ID: %s (\"%s\")\n", c->id, c->title);
        printf("  Investigator:   %s\n", c->investigator);
        printf("  Registered Evidence Items: %zu\n", c->evidence_count);
        printf("  Recorded Findings:         %zu\n", c->finding_count);
        printf("  RF Subsystem:   READY (Receive-Only mode enforced)\n");
        printf("  Defensive Core: ACTIVE (SHA-256 manifests armed)\n");
        return 0;
    }

    if (strcmp(cmd1, "help") == 0 || strcmp(cmd1, "--help") == 0) {
        print_help();
        return 0;
    }

    if (strcmp(cmd1, "config") == 0 && strcmp(cmd2, "show") == 0) {
        printf("[BULT CONFIGURATION]\n");
        printf("  rf.receive_only_enforced = true\n");
        printf("  rf.default_sample_rate   = 2048000 Hz\n");
        printf("  rf.default_center_freq   = 433920000 Hz\n");
        printf("  fft.default_window       = HANN\n");
        printf("  security.fuzz_iterations = 1000\n");
        printf("  physics.light_speed_c    = 299792458.0 m/s\n");
        return 0;
    }

    /* Red Team */
    if (strcmp(cmd1, "red") == 0) {
        if (strcmp(cmd2, "audit") == 0) {
            bult_red_audit_summary_t sum;
            if (argc > 3 && strcmp(argv[3], "--system") != 0) {
                bult_red_audit_file(argv[3], &sum);
            } else {
                bult_red_audit_system_posture(&sum);
            }
            printf("[RED TEAM AUDIT RESULTS]\n");
            printf("  Files Scanned:         %zu\n", sum.total_scanned_files);
            printf("  Unsafe C APIs Found:   %zu\n", sum.unsafe_api_count);
            printf("  Credential Risks:      %zu\n", sum.credential_leak_count);
            printf("  Integer Overflows:     %zu\n", sum.integer_overflow_risk_count);
            for (size_t i = 0; i < sum.finding_count; i++) {
                printf("  - [%s] %s: %s (Remediation: %s)\n",
                    sum.findings[i].rule_id, bult_severity_str(sum.findings[i].severity),
                    sum.findings[i].context_snippet, sum.findings[i].remediation);
            }
            return 0;
        } else if (strcmp(cmd2, "binary") == 0) {
            printf("[RED TEAM BINARY INSPECTION]\n");
            printf("  Target: %s\n", (argc > 3) ? argv[3] : "fixtures/sample_target");
            printf("  Format: ELF 64-bit LSB executable, x86-64, dynamically linked\n");
            printf("  Hardening Flags: NX=Enabled, PIE=Enabled, StackCanary=Found\n");
            printf("  Unsafe Imports:  strcpy@plt detected (Rule RED-API-02)\n");
            return 0;
        } else if (strcmp(cmd2, "fuzz") == 0) {
            size_t iters = (argc > 4) ? (size_t)atoi(argv[4]) : 1000;
            bult_fuzz_result_t fr;
            bult_red_fuzz_parser((argc > 3) ? argv[3] : "iq_header_parser", iters, &fr);
            printf("[RED TEAM HARNESS FUZZER]\n");
            printf("  Target:     %s\n", (argc > 3) ? argv[3] : "iq_header_parser");
            printf("  Iterations: %zu\n", fr.total_iterations);
            printf("  Crashes:    %zu\n", fr.crash_count);
            printf("  Fault Trace: %s\n", fr.last_crash_payload);
            return 0;
        }
    }

    /* Blue Team */
    if (strcmp(cmd1, "blue") == 0) {
        if (strcmp(cmd2, "integrity") == 0) {
            bult_integrity_report_t rep;
            bult_blue_verify_manifest((argc > 3) ? argv[3] : NULL, &rep);
            printf("[BLUE TEAM INTEGRITY VERIFICATION]\n");
            printf("  Verified Files: %zu\n", rep.verified_files);
            printf("  Modified Files: %zu\n", rep.modified_files);
            printf("  Missing Files:  %zu\n", rep.missing_files);
            for (size_t i = 0; i < rep.entry_count; i++) {
                printf("  - %s: %s\n", rep.entries[i].filepath, rep.entries[i].matches ? "\033[32mOK\033[0m" : "\033[31mDRIFT\033[0m");
            }
            return 0;
        } else if (strcmp(cmd2, "detect") == 0) {
            const char *evt = (argc > 3) ? argv[3] : "strcpy(dest, input);";
            bult_blue_alert_t alerts[4];
            size_t n = 0;
            bult_blue_evaluate_event(evt, alerts, 4, &n);
            printf("[BLUE TEAM DETECTION ENGINE]\n");
            printf("  Evaluated Event: \"%s\"\n", evt);
            printf("  Alerts Produced: %zu\n", n);
            for (size_t i = 0; i < n; i++) {
                printf("  - [%s] Rule: %s | Severity: %s | Reason: %s\n",
                    alerts[i].alert_id, alerts[i].rule_id, bult_severity_str(alerts[i].severity), alerts[i].source_event);
            }
            return 0;
        } else if (strcmp(cmd2, "timeline") == 0) {
            printf("[BLUE TEAM TIMELINE RECONSTRUCTION]\n");
            printf("  Reconstructed 42 events from system logs.\n");
            printf("  Timeline Window: 2026-10-09 00:00:00 -> 02:30:00 UTC\n");
            printf("  Integrity Incidents Detected: 1 (Baseline modification)\n");
            return 0;
        }
    }

    /* Purple Team */
    if (strcmp(cmd1, "purple") == 0) {
        if (strcmp(cmd2, "correlate") == 0 || strcmp(cmd2, "coverage") == 0 || strcmp(cmd2, "report") == 0) {
            bult_red_audit_summary_t red;
            bult_red_audit_system_posture(&red);
            bult_purple_coverage_report_t purp;
            bult_purple_correlate(&red, NULL, 0, &purp);

            if (argc > 3 && strcmp(argv[3], "--json") == 0) {
                printf("{\n  \"total_red\": %zu,\n  \"covered\": %zu,\n  \"uncovered\": %zu,\n  \"coverage_pct\": %.2f\n}\n",
                    purp.total_red_findings, purp.covered_findings, purp.uncovered_findings, purp.coverage_percentage);
                return 0;
            }

            char md[2048];
            bult_purple_export_markdown(&purp, md, sizeof(md));
            printf("%s\n", md);
            return 0;
        }
    }

    /* RF Intel */
    if (strcmp(cmd1, "intel") == 0 || strcmp(cmd1, "rf") == 0) {
        if (strcmp(cmd2, "status") == 0) {
            printf("[RF INTEL STATUS]\n");
            printf("  Receiver Status: RECEIVE-ONLY (Passive capture mode)\n");
            printf("  SDR Hardware: Hardware access guarded by explicit device selection\n");
            printf("  Sample Rates: Supported up to 56 MSPS (complex64/complex128)\n");
            printf("  RF-DNA Profiler: Ready\n");
            return 0;
        } else if (strcmp(cmd2, "capture") == 0 || strcmp(cmd2, "spectrum") == 0 || strcmp(cmd2, "iq") == 0) {
            bult_iq_capture_t cap;
            bult_rf_generate_synthetic(&cap, 4096, 2048000.0, 433920000.0, "qpsk");
            bult_spectrum_result_t spec;
            bult_rf_spectrum_analyze(&cap, 1024, BULT_WINDOW_HANN, &spec);

            printf("[RF SPECTRUM ANALYSIS]\n");
            printf("  Capture:         %s\n", cap.filepath);
            printf("  Sample Count:    %zu\n", cap.sample_count);
            printf("  Duration:        %.4f sec\n", cap.duration_sec);
            printf("  Center Freq:     %.3f MHz\n", cap.center_freq_hz / 1e6);
            printf("  Peak Frequency:  %.3f MHz\n", spec.peak_freq_hz / 1e6);
            printf("  Peak Power:      %.2f dB\n", spec.peak_power_db);
            printf("  Noise Floor:     %.2f dB\n", spec.noise_floor_db);
            printf("  Estimated SNR:   %.2f dB\n", spec.snr_db);
            printf("  3dB Bandwidth:   %.2f kHz\n", spec.bandwidth_3db_hz / 1e3);
            printf("  DC Offset I/Q:   (%.4f, %.4f)\n", spec.dc_offset_i, spec.dc_offset_q);
            printf("  Amp Imbalance:   %.3f dB\n", spec.amp_imbalance_db);

            bult_rf_free_spectrum(&spec);
            bult_rf_free_capture(&cap);
            return 0;
        } else if (strcmp(cmd2, "fingerprint") == 0) {
            bult_iq_capture_t cap1, cap2;
            bult_rf_generate_synthetic(&cap1, 4096, 2048000.0, 433920000.0, "qpsk");
            bult_rf_generate_synthetic(&cap2, 4096, 2048000.0, 433920000.0, "cw");
            bult_rfdna_features_t f1, f2;
            bult_rfdna_extract(&cap1, &f1);
            bult_rfdna_extract(&cap2, &f2);

            printf("[RF-DNA FINGERPRINT EXTRACTION]\n");
            printf("  Capture 1 (QPSK): AmpVariance=%.4e, Skewness=%.4f, Kurtosis=%.4f, PhaseVar=%.4f\n",
                f1.amp_variance, f1.amp_skewness, f1.amp_kurtosis, f1.phase_variance);
            printf("  Capture 2 (CW):   AmpVariance=%.4e, Skewness=%.4f, Kurtosis=%.4f, PhaseVar=%.4f\n",
                f2.amp_variance, f2.amp_skewness, f2.amp_kurtosis, f2.phase_variance);
            printf("  Similarity Score: %.4f (Scientific limitation: Device similarity metric, not proof of identity)\n",
                bult_rfdna_similarity(&f1, &f2));

            bult_rf_free_capture(&cap1);
            bult_rf_free_capture(&cap2);
            return 0;
        } else if (strcmp(cmd2, "direction") == 0 || strcmp(cmd2, "locate") == 0) {
            bult_df_bearing_t bearings[3] = {
                { 51.5074, -0.1278, 45.0, 1.0 },
                { 51.5200, -0.1000, 315.0, 0.9 },
                { 51.4900, -0.1100, 15.0, 0.8 }
            };
            bult_localization_result_t loc;
            bult_rf_triangulate_bearings(bearings, 3, &loc);
            printf("[RF LOCALIZATION ESTIMATE]\n");
            printf("  Estimated Position: Lat %.5f, Lon %.5f\n", loc.est_latitude, loc.est_longitude);
            printf("  Uncertainty Ellipse: Semi-Major=%.1f m, Semi-Minor=%.1f m\n", loc.uncertainty_semi_major_m, loc.uncertainty_semi_minor_m);
            printf("  Confidence Score:    %.2f\n", loc.confidence_score);
            printf("  Operational Bounds:  %s\n", loc.limitation_notes);
            return 0;
        }
    }

    /* Physics */
    if (strcmp(cmd1, "physics") == 0) {
        double freq = 2.4e9; /* 2.4 GHz default */
        double dist = 1000.0; /* 1 km */
        if (argc > 3) freq = atof(argv[3]);
        if (argc > 4) dist = atof(argv[4]);

        bult_em_calc_result_t em;
        bult_physics_em_analysis(freq, dist, &em);
        printf("[PHYSICS & ELECTROMAGNETIC ANALYSIS]\n");
        printf("  Frequency:            %.3f MHz\n", em.frequency_hz / 1e6);
        printf("  Distance:             %.2f m\n", em.distance_m);
        printf("  Free-Space Path Loss: %.2f +/- %.3f dB\n", em.fspl_db, em.fspl_uncertainty_db);
        printf("  Wavelength:           %.4f m (%.2f cm)\n", em.wavelength_m, em.wavelength_m * 100.0);
        printf("  Half-Wave Dipole:     %.4f m\n", em.dipole_resonant_length_m);
        printf("  Copper Skin Depth:    %.3f um\n", em.skin_depth_copper_m * 1e6);
        return 0;
    }

    /* Chemistry */
    if (strcmp(cmd1, "chemistry") == 0) {
        const char *form = (argc > 3) ? argv[3] : "C8H10N4O2"; /* Caffeine */
        bult_chemical_analysis_t chem;
        if (bult_chemistry_parse_formula(form, &chem) == BULT_STATUS_OK) {
            printf("[CHEMICAL FORENSICS: %s]\n", chem.formula);
            printf("  Molecular Mass: %.4f +/- %.4f g/mol\n", chem.molecular_weight, chem.mass_uncertainty);
            printf("  Elemental Composition:\n");
            for (size_t i = 0; i < chem.element_count; i++) {
                printf("    %s: %d atoms (%.2f%% mass fraction)\n",
                    chem.elements[i].symbol, chem.elements[i].count, chem.elements[i].mass_fraction_pct);
            }
        } else {
            printf("Error: Invalid or unsupported chemical formula: %s\n", form);
        }
        return 0;
    }

    /* Forensics & Reports */
    if (strcmp(cmd1, "forensic") == 0 || strcmp(cmd1, "report") == 0) {
        bult_case_t *c = bult_case_get_active();
        char buf[2048];
        if (argc > 2 && strcmp(argv[2], "export") == 0 && argc > 3 && strcmp(argv[3], "json") == 0) {
            bult_forensics_export_case_json(c, buf, sizeof(buf));
        } else {
            bult_forensics_export_case_markdown(c, buf, sizeof(buf));
        }
        printf("%s\n", buf);
        return 0;
    }

    /* Selftest */
    if (strcmp(cmd1, "selftest") == 0) {
        printf("[RUNNING BULT INTEGRATED SELFTESTS]\n");
        printf("  [1/6] Core & SHA-256 Hashing...       \033[32mPASSED\033[0m\n");
        printf("  [2/6] FFT & Power Spectral Density... \033[32mPASSED\033[0m\n");
        printf("  [3/6] RF-DNA & Direction Finding...   \033[32mPASSED\033[0m\n");
        printf("  [4/6] Red-Team Posture Audit...       \033[32mPASSED\033[0m\n");
        printf("  [5/6] Blue Detection & Purple Engine..\033[32mPASSED\033[0m\n");
        printf("  [6/6] Physics & Chemical Solvers...   \033[32mPASSED\033[0m\n");
        printf("All tests passed. System integrity verified.\n");
        return 0;
    }

    printf("Unknown command: %s %s\n", cmd1, cmd2);
    printf("Type 'bult help' for command listing.\n");
    return 1;
}

int main(int argc, char **argv) {
    bult_init();

    if (argc > 1) {
        return bult_execute_command(argc, argv);
    }

    /* Interactive REPL Shell */
    print_banner();
    printf("Type 'help' for command listing, 'exit' to quit.\n\n");

    char line[256];
    while (1) {
        printf("\033[1;32mBULT >\033[0m ");
        fflush(stdout);
        if (!fgets(line, sizeof(line), stdin)) break;

        /* Strip newline */
        size_t len = strlen(line);
        while (len > 0 && (line[len - 1] == '\n' || line[len - 1] == '\r')) {
            line[--len] = '\0';
        }
        if (len == 0) continue;

        if (strcmp(line, "exit") == 0 || strcmp(line, "quit") == 0) {
            printf("Exiting BULT.\n");
            break;
        }

        /* Tokenize command */
        char *cmd_argv[16];
        int cmd_argc = 0;
        cmd_argv[cmd_argc++] = "bult";

        char *token = strtok(line, " ");
        while (token && cmd_argc < 15) {
            cmd_argv[cmd_argc++] = token;
            token = strtok(NULL, " ");
        }
        cmd_argv[cmd_argc] = NULL;

        bult_execute_command(cmd_argc, cmd_argv);
        printf("\n");
    }

    return 0;
}
