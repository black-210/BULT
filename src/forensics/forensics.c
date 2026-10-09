/**
 * BULT — Digital Forensics & Case Report Generator
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#include "bult/core.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

bult_status_t bult_forensics_export_case_json(const bult_case_t *c, char *out_buf, size_t max_len) {
    if (!c || !out_buf || max_len == 0) return BULT_STATUS_INVALID_ARG;

    int written = snprintf(out_buf, max_len,
        "{\n"
        "  \"case_id\": \"%s\",\n"
        "  \"title\": \"%s\",\n"
        "  \"investigator\": \"%s\",\n"
        "  \"timestamp\": %ld,\n"
        "  \"evidence_count\": %zu,\n"
        "  \"findings_count\": %zu,\n"
        "  \"findings\": [\n",
        c->id, c->title, c->investigator, (long)c->created_timestamp, c->evidence_count, c->finding_count);

    for (size_t i = 0; i < c->finding_count && written < (int)max_len - 512; i++) {
        const bult_finding_t *f = &c->findings[i];
        written += snprintf(out_buf + written, max_len - written,
            "    {\n"
            "      \"id\": \"%s\",\n"
            "      \"subsystem\": \"%s\",\n"
            "      \"severity\": \"%s\",\n"
            "      \"confidence\": %.2f,\n"
            "      \"title\": \"%s\",\n"
            "      \"description\": \"%s\"\n"
            "    }%s\n",
            f->id, f->subsystem, bult_severity_str(f->severity), f->confidence, f->title, f->description,
            (i + 1 < c->finding_count) ? "," : "");
    }

    snprintf(out_buf + written, max_len - written, "  ]\n}\n");
    return BULT_STATUS_OK;
}

bult_status_t bult_forensics_export_case_markdown(const bult_case_t *c, char *out_buf, size_t max_len) {
    if (!c || !out_buf || max_len == 0) return BULT_STATUS_INVALID_ARG;

    int written = snprintf(out_buf, max_len,
        "# BULT Forensic Case Report: %s\n\n"
        "- **Case Title**: %s\n"
        "- **Lead Investigator**: %s\n"
        "- **Creation Epoch**: %ld\n"
        "- **Evidence Items Registered**: %zu\n"
        "- **Security & Scientific Findings**: %zu\n\n"
        "## Evidence Register & Custody\n\n"
        "| Evidence ID | Path | SHA-256 Hash | Custodian |\n"
        "| ----------- | ---- | ------------ | --------- |\n",
        c->id, c->title, c->investigator, (long)c->created_timestamp, c->evidence_count, c->finding_count);

    for (size_t i = 0; i < c->evidence_count && written < (int)max_len - 512; i++) {
        const bult_evidence_t *ev = &c->evidence[i];
        written += snprintf(out_buf + written, max_len - written,
            "| %s | %s | `%s` | %s |\n",
            ev->id, ev->filepath, ev->sha256, ev->custodian);
    }

    written += snprintf(out_buf + written, max_len - written,
        "\n## Subsystem Findings\n\n"
        "| ID | Subsystem | Severity | Confidence | Title |\n"
        "| -- | --------- | -------- | ---------- | ----- |\n");

    for (size_t i = 0; i < c->finding_count && written < (int)max_len - 256; i++) {
        const bult_finding_t *f = &c->findings[i];
        written += snprintf(out_buf + written, max_len - written,
            "| %s | %s | **%s** | %.2f | %s |\n",
            f->id, f->subsystem, bult_severity_str(f->severity), f->confidence, f->title);
    }

    return BULT_STATUS_OK;
}
