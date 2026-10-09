/**
 * BULT — Purple-Team Security Assessment & Detection Header
 * Target: C> (C-Greater) Systems Architecture & ISO C11 FFI
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#ifndef BULT_SECURITY_H
#define BULT_SECURITY_H

#include "core.h"

#ifdef __cplusplus
extern "C" {
#endif

/* --- RED TEAM --- */
typedef struct {
    char rule_id[32];
    char target_path[256];
    char unsafe_api_name[64];
    size_t line_number;
    bult_severity_t severity;
    char context_snippet[128];
    char remediation[256];
} bult_red_code_finding_t;

typedef struct {
    size_t total_scanned_files;
    size_t unsafe_api_count;
    size_t credential_leak_count;
    size_t integer_overflow_risk_count;
    size_t permission_defect_count;
    bult_red_code_finding_t findings[64];
    size_t finding_count;
} bult_red_audit_summary_t;

typedef struct {
    size_t total_iterations;
    size_t crash_count;
    size_t hang_count;
    size_t unique_paths;
    char last_crash_payload[128];
} bult_fuzz_result_t;

bult_status_t bult_red_audit_source(const char *source_text, bult_red_audit_summary_t *out_summary);
bult_status_t bult_red_audit_file(const char *filepath, bult_red_audit_summary_t *out_summary);
bult_status_t bult_red_audit_system_posture(bult_red_audit_summary_t *out_summary);
bult_status_t bult_red_fuzz_parser(const char *target_name, size_t iterations, bult_fuzz_result_t *out_result);

/* --- BLUE TEAM --- */
typedef struct {
    char filepath[256];
    char expected_sha256[BULT_MAX_HASH_LEN];
    char actual_sha256[BULT_MAX_HASH_LEN];
    bool matches;
} bult_integrity_entry_t;

typedef struct {
    char rule_id[32];
    char name[64];
    char pattern[128];
    bult_severity_t severity;
    char description[256];
} bult_detection_rule_t;

typedef struct {
    char alert_id[32];
    char rule_id[32];
    int64_t timestamp;
    char source_event[256];
    bult_severity_t severity;
    char evidence_ref[64];
} bult_blue_alert_t;

typedef struct {
    size_t verified_files;
    size_t modified_files;
    size_t missing_files;
    bult_integrity_entry_t entries[64];
    size_t entry_count;
} bult_integrity_report_t;

bult_status_t bult_blue_verify_manifest(const char *manifest_path, bult_integrity_report_t *out_report);
bult_status_t bult_blue_evaluate_event(const char *event_log_line, bult_blue_alert_t *out_alerts, size_t max_alerts, size_t *out_count);
bult_status_t bult_blue_parse_timeline(const char *log_content, size_t *out_event_count);

/* --- PURPLE TEAM --- */
typedef struct {
    char red_finding_id[32];
    char blue_rule_id[32];
    bool is_covered;
    double detection_confidence;
    char gap_analysis[256];
} bult_purple_correlation_t;

typedef struct {
    size_t total_red_findings;
    size_t covered_findings;
    size_t uncovered_findings;
    double coverage_percentage; /* e.g. 75.0% */
    bult_purple_correlation_t correlations[64];
    size_t correlation_count;
} bult_purple_coverage_report_t;

bult_status_t bult_purple_correlate(const bult_red_audit_summary_t *red, const bult_detection_rule_t *rules, size_t rule_count, bult_purple_coverage_report_t *out_report);
bult_status_t bult_purple_export_markdown(const bult_purple_coverage_report_t *report, char *out_buffer, size_t max_len);

#ifdef __cplusplus
}
#endif

#endif /* BULT_SECURITY_H */
