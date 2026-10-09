/**
 * BULT — Core Engine Implementation
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

#include "bult/core.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

static bult_case_t g_active_case;
static bool g_initialized = false;

/* --- Standard SHA-256 Engine (FIPS 180-4) --- */
typedef struct {
    uint8_t  data[64];
    uint32_t datalen;
    uint64_t bitlen;
    uint32_t state[8];
} sha256_ctx_t;

#define ROTRIGHT(a,b) (((a) >> (b)) | ((a) << (32-(b))))
#define CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define EP0(x) (ROTRIGHT(x,2) ^ ROTRIGHT(x,13) ^ ROTRIGHT(x,22))
#define EP1(x) (ROTRIGHT(x,6) ^ ROTRIGHT(x,11) ^ ROTRIGHT(x,25))
#define SIG0(x) (ROTRIGHT(x,7) ^ ROTRIGHT(x,18) ^ ((x) >> 3))
#define SIG1(x) (ROTRIGHT(x,17) ^ ROTRIGHT(x,19) ^ ((x) >> 10))

static const uint32_t k[64] = {
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

static void sha256_transform(sha256_ctx_t *ctx, const uint8_t data[]) {
    uint32_t a, b, c, d, e, f, g, h, i, j, t1, t2, m[64];

    for (i = 0, j = 0; i < 16; ++i, j += 4)
        m[i] = ((uint32_t)data[j] << 24) | ((uint32_t)data[j + 1] << 16) | ((uint32_t)data[j + 2] << 8) | ((uint32_t)data[j + 3]);
    for ( ; i < 64; ++i)
        m[i] = SIG1(m[i - 2]) + m[i - 7] + SIG0(m[i - 15]) + m[i - 16];

    a = ctx->state[0]; b = ctx->state[1]; c = ctx->state[2]; d = ctx->state[3];
    e = ctx->state[4]; f = ctx->state[5]; g = ctx->state[6]; h = ctx->state[7];

    for (i = 0; i < 64; ++i) {
        t1 = h + EP1(e) + CH(e,f,g) + k[i] + m[i];
        t2 = EP0(a) + MAJ(a,b,c);
        h = g; g = f; f = e; e = d + t1;
        d = c; c = b; b = a; a = t1 + t2;
    }

    ctx->state[0] += a; ctx->state[1] += b; ctx->state[2] += c; ctx->state[3] += d;
    ctx->state[4] += e; ctx->state[5] += f; ctx->state[6] += g; ctx->state[7] += h;
}

static void sha256_init(sha256_ctx_t *ctx) {
    ctx->datalen = 0;
    ctx->bitlen = 0;
    ctx->state[0] = 0x6a09e667; ctx->state[1] = 0xbb67ae85;
    ctx->state[2] = 0x3c6ef372; ctx->state[3] = 0xa54ff53a;
    ctx->state[4] = 0x510e527f; ctx->state[5] = 0x9b05688c;
    ctx->state[6] = 0x1f83d9ab; ctx->state[7] = 0x5be0cd19;
}

static void sha256_update(sha256_ctx_t *ctx, const uint8_t data[], size_t len) {
    for (size_t i = 0; i < len; ++i) {
        ctx->data[ctx->datalen] = data[i];
        ctx->datalen++;
        if (ctx->datalen == 64) {
            sha256_transform(ctx, ctx->data);
            ctx->bitlen += 512;
            ctx->datalen = 0;
        }
    }
}

static void sha256_final(sha256_ctx_t *ctx, uint8_t hash[]) {
    uint32_t i = ctx->datalen;

    if (ctx->datalen < 56) {
        ctx->data[i++] = 0x80;
        while (i < 56) ctx->data[i++] = 0x00;
    } else {
        ctx->data[i++] = 0x80;
        while (i < 64) ctx->data[i++] = 0x00;
        sha256_transform(ctx, ctx->data);
        memset(ctx->data, 0, 56);
    }

    ctx->bitlen += ctx->datalen * 8;
    ctx->data[63] = ctx->bitlen;
    ctx->data[62] = ctx->bitlen >> 8;
    ctx->data[61] = ctx->bitlen >> 16;
    ctx->data[60] = ctx->bitlen >> 24;
    ctx->data[59] = ctx->bitlen >> 32;
    ctx->data[58] = ctx->bitlen >> 40;
    ctx->data[57] = ctx->bitlen >> 48;
    ctx->data[56] = ctx->bitlen >> 56;
    sha256_transform(ctx, ctx->data);

    for (i = 0; i < 4; ++i) {
        hash[i]      = (ctx->state[0] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 4]  = (ctx->state[1] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 8]  = (ctx->state[2] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 12] = (ctx->state[3] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 16] = (ctx->state[4] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 20] = (ctx->state[5] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 24] = (ctx->state[6] >> (24 - i * 8)) & 0x000000ff;
        hash[i + 28] = (ctx->state[7] >> (24 - i * 8)) & 0x000000ff;
    }
}

bult_status_t bult_init(void) {
    if (!g_initialized) {
        memset(&g_active_case, 0, sizeof(g_active_case));
        bult_case_create("CASE-2026-001", "Default Operation Assessment", "analyst");
        g_initialized = true;
    }
    return BULT_STATUS_OK;
}

const char* bult_version(void) {
    return BULT_VERSION_STRING;
}

int64_t bult_timestamp_now(void) {
    return (int64_t)time(NULL);
}

const char* bult_severity_str(bult_severity_t sev) {
    switch (sev) {
        case BULT_SEV_INFO: return "INFO";
        case BULT_SEV_LOW: return "LOW";
        case BULT_SEV_MEDIUM: return "MEDIUM";
        case BULT_SEV_HIGH: return "HIGH";
        case BULT_SEV_CRITICAL: return "CRITICAL";
        default: return "UNKNOWN";
    }
}

bult_status_t bult_sha256_buffer(const uint8_t *data, size_t len, char *out_hex) {
    if (!data || !out_hex) return BULT_STATUS_INVALID_ARG;
    sha256_ctx_t ctx;
    uint8_t hash[32];
    sha256_init(&ctx);
    sha256_update(&ctx, data, len);
    sha256_final(&ctx, hash);

    for (int i = 0; i < 32; i++) {
        sprintf(out_hex + (i * 2), "%02x", hash[i]);
    }
    out_hex[64] = '\0';
    return BULT_STATUS_OK;
}

bult_status_t bult_sha256_file(const char *filepath, char *out_hex) {
    if (!filepath || !out_hex) return BULT_STATUS_INVALID_ARG;
    FILE *f = fopen(filepath, "rb");
    if (!f) return BULT_STATUS_FILE_NOT_FOUND;

    sha256_ctx_t ctx;
    sha256_init(&ctx);
    uint8_t buf[4096];
    size_t bytes;
    while ((bytes = fread(buf, 1, sizeof(buf), f)) > 0) {
        sha256_update(&ctx, buf, bytes);
    }
    fclose(f);

    uint8_t hash[32];
    sha256_final(&ctx, hash);
    for (int i = 0; i < 32; i++) {
        sprintf(out_hex + (i * 2), "%02x", hash[i]);
    }
    out_hex[64] = '\0';
    return BULT_STATUS_OK;
}

bult_case_t* bult_case_get_active(void) {
    if (!g_initialized) bult_init();
    return &g_active_case;
}

bult_status_t bult_case_create(const char *case_id, const char *title, const char *investigator) {
    if (!case_id) return BULT_STATUS_INVALID_ARG;
    memset(&g_active_case, 0, sizeof(g_active_case));
    snprintf(g_active_case.id, sizeof(g_active_case.id), "%s", case_id);
    snprintf(g_active_case.title, sizeof(g_active_case.title), "%s", title ? title : "Untitled Case");
    snprintf(g_active_case.investigator, sizeof(g_active_case.investigator), "%s", investigator ? investigator : "operator");
    g_active_case.created_timestamp = bult_timestamp_now();
    return BULT_STATUS_OK;
}

bult_status_t bult_case_add_finding(const bult_finding_t *finding) {
    if (!finding) return BULT_STATUS_INVALID_ARG;
    bult_case_t *c = bult_case_get_active();
    if (c->finding_count >= BULT_MAX_FINDINGS) return BULT_STATUS_ERROR;
    c->findings[c->finding_count++] = *finding;
    return BULT_STATUS_OK;
}

bult_status_t bult_case_add_evidence(const bult_evidence_t *evidence) {
    if (!evidence) return BULT_STATUS_INVALID_ARG;
    bult_case_t *c = bult_case_get_active();
    if (c->evidence_count >= BULT_MAX_EVIDENCE) return BULT_STATUS_ERROR;
    c->evidence[c->evidence_count++] = *evidence;
    return BULT_STATUS_OK;
}
