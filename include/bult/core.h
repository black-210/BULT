/**
 * BULT — Core Systems Engine Header
 * Target: C> (C-Greater) Systems Architecture & ISO C11 FFI
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#ifndef BULT_CORE_H
#define BULT_CORE_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define BULT_VERSION_STRING "1.0.0"
#define BULT_MAX_NAME_LEN    128
#define BULT_MAX_DESC_LEN    512
#define BULT_MAX_HASH_LEN    65
#define BULT_MAX_FINDINGS    256
#define BULT_MAX_EVIDENCE    128

typedef enum {
    BULT_SEV_INFO = 0,
    BULT_SEV_LOW,
    BULT_SEV_MEDIUM,
    BULT_SEV_HIGH,
    BULT_SEV_CRITICAL
} bult_severity_t;

typedef enum {
    BULT_STATUS_OK = 0,
    BULT_STATUS_ERROR,
    BULT_STATUS_INVALID_ARG,
    BULT_STATUS_FILE_NOT_FOUND,
    BULT_STATUS_INSUFFICIENT_DATA,
    BULT_STATUS_UNSUPPORTED
} bult_status_t;

typedef struct {
    char id[32];
    char subsystem[32];
    bult_severity_t severity;
    double confidence;      /* 0.0 to 1.0 */
    char title[BULT_MAX_NAME_LEN];
    char description[BULT_MAX_DESC_LEN];
    char evidence_id[32];
    char remediation[BULT_MAX_DESC_LEN];
    int64_t timestamp;
} bult_finding_t;

typedef struct {
    char id[32];
    char filepath[256];
    char sha256[BULT_MAX_HASH_LEN];
    size_t size_bytes;
    int64_t acquisition_timestamp;
    char instrument[64];
    char custodian[64];
    char notes[256];
} bult_evidence_t;

typedef struct {
    char id[32];
    char title[BULT_MAX_NAME_LEN];
    char investigator[64];
    int64_t created_timestamp;
    size_t evidence_count;
    bult_evidence_t evidence[BULT_MAX_EVIDENCE];
    size_t finding_count;
    bult_finding_t findings[BULT_MAX_FINDINGS];
} bult_case_t;

/* Core system API */
bult_status_t bult_init(void);
const char*   bult_version(void);
int64_t       bult_timestamp_now(void);
const char*   bult_severity_str(bult_severity_t sev);

/* SHA-256 computation */
bult_status_t bult_sha256_buffer(const uint8_t *data, size_t len, char *out_hex);
bult_status_t bult_sha256_file(const char *filepath, char *out_hex);

/* Case and Finding management */
bult_case_t*  bult_case_get_active(void);
bult_status_t bult_case_create(const char *case_id, const char *title, const char *investigator);
bult_status_t bult_case_add_finding(const bult_finding_t *finding);
bult_status_t bult_case_add_evidence(const bult_evidence_t *evidence);

#ifdef __cplusplus
}
#endif

#endif /* BULT_CORE_H */
