/**
 * BULT — Native C> Source Tree & GitHub Repository Exporter
 * Bundles the genuine native C> (C-Greater) repository
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { FolderGit2, FileCode, Download, Check, Sparkles, Terminal } from 'lucide-react';
import JSZip from 'jszip';

interface RepoFile {
  path: string;
  lang: string;
  content: string;
}

export const RepositoryWorkspace: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const repoFiles: RepoFile[] = [
    {
      path: 'src/core/bult_core.cgt',
      lang: 'C> (C-Greater)',
      content: `/**
 * BULT — Core Intelligence Engine
 * Language: C> (C-Greater) Systems Programming Language Specification
 * Target: black-210/C-
 * License: GNU AGPL-3.0
 */

module bult::core;

struct Finding {
    id: str,
    subsystem: str,
    severity: i32,
    confidence: f64,
    title: str,
    description: str,
    evidence_id: str,
    remediation: str,
}

struct Evidence {
    id: str,
    filepath: str,
    sha256: str,
    size_bytes: u64,
    custodian: str,
}

struct Case {
    id: str,
    title: str,
    investigator: str,
    findings_count: u32,
    evidence_count: u32,
}

fn create_finding(id: str, sub: str, sev: i32, conf: f64, title: str, desc: str) -> own<Finding> {
    let f: own<Finding> = Finding {
        id: id,
        subsystem: sub,
        severity: sev,
        confidence: conf,
        title: title,
        description: desc,
        evidence_id: "EV-NONE",
        remediation: "Verify finding against local baseline",
    };
    return move(f);
}
`,
    },
    {
      path: 'src/rf/bult_rf.cgt',
      lang: 'C> (C-Greater)',
      content: `/**
 * BULT — RF Signal Processing & RF-DNA Subsystem
 * Language: C> (C-Greater) Systems Programming Language Specification
 * Target: black-210/C-
 * License: GNU AGPL-3.0
 */

module bult::rf;

struct ComplexSample {
    i: f32,
    q: f32,
}

struct IQCapture {
    filepath: str,
    format: i32,
    sample_rate_hz: f64,
    center_freq_hz: f64,
    sample_count: u64,
    duration_sec: f64,
}

struct SpectrumMetrics {
    noise_floor_db: f64,
    peak_power_db: f64,
    peak_freq_hz: f64,
    snr_db: f64,
    bandwidth_3db_hz: f64,
    dc_offset_i: f64,
    dc_offset_q: f64,
    amp_imbalance_db: f64,
    phase_error_deg: f64,
}

struct RfDnaFeatures {
    amp_variance: f64,
    amp_skewness: f64,
    amp_kurtosis: f64,
    phase_variance: f64,
    spectral_entropy: f64,
    spectral_centroid: f64,
}

fn compute_snr(peak_db: f64, noise_db: f64) -> f64 {
    return peak_db - noise_db;
}
`,
    },
    {
      path: 'src/intel/bult_intel.cgt',
      lang: 'C> (C-Greater)',
      content: `/**
 * BULT — RF Intelligence, Direction Finding & Localization
 * Language: C> (C-Greater) Systems Programming Language Specification
 * Target: black-210/C-
 * License: GNU AGPL-3.0
 */

module bult::intel;

struct DfBearing {
    latitude: f64,
    longitude: f64,
    bearing_deg: f64,
    weight: f64,
}

struct TdoaStation {
    latitude: f64,
    longitude: f64,
    timestamp_sec: f64,
}

struct LocalizationEstimate {
    latitude: f64,
    longitude: f64,
    uncertainty_semi_major_m: f64,
    uncertainty_semi_minor_m: f64,
    confidence_score: f64,
    sufficient_evidence: bool,
    notes: str,
}

fn evaluate_df_sufficiency(station_count: u32) -> bool {
    if (station_count >= 2) {
        return true;
    }
    return false;
}
`,
    },
    {
      path: 'src/red_team/bult_red.cgt',
      lang: 'C> (C-Greater)',
      content: `/**
 * BULT — Red Team Security Assessment
 * Language: C> (C-Greater) Systems Programming Language Specification
 * Target: black-210/C-
 * License: GNU AGPL-3.0
 */

module bult::red;

struct UnsafeApiRule {
    api_name: str,
    severity: i32,
    remediation: str,
}

struct RedAuditReport {
    scanned_items: u32,
    unsafe_api_count: u32,
    credential_leak_count: u32,
    integer_overflow_count: u32,
    critical_count: u32,
}

fn evaluate_unsafe_pattern(name: str) -> i32 {
    if (name == "gets") { return 4; }
    if (name == "strcpy") { return 3; }
    if (name == "sprintf") { return 3; }
    if (name == "system") { return 4; }
    return 1;
}
`,
    },
    {
      path: 'src/blue_team/bult_blue.cgt',
      lang: 'C> (C-Greater)',
      content: `/**
 * BULT — Blue Team Detection Engine & Timeline Analysis
 * Language: C> (C-Greater) Systems Programming Language Specification
 * Target: black-210/C-
 * License: GNU AGPL-3.0
 */

module bult::blue;

struct DetectionRule {
    rule_id: str,
    name: str,
    pattern: str,
    severity: i32,
}

struct BlueAlert {
    alert_id: str,
    rule_id: str,
    source_event: str,
    severity: i32,
    timestamp: i64,
}
`,
    },
    {
      path: 'src/purple_team/bult_purple.cgt',
      lang: 'C> (C-Greater)',
      content: `/**
 * BULT — Purple Team Correlation & Coverage Verification
 * Language: C> (C-Greater) Systems Programming Language Specification
 * Target: black-210/C-
 * License: GNU AGPL-3.0
 */

module bult::purple;

struct PurpleCorrelation {
    red_id: str,
    blue_id: str,
    is_covered: bool,
    confidence: f64,
}

struct CoverageSummary {
    total_findings: u32,
    covered_findings: u32,
    uncovered_findings: u32,
    coverage_percentage: f64,
}

fn calculate_coverage(total: u32, covered: u32) -> own<CoverageSummary> {
    let mut pct: f64 = 0.0;
    if (total > 0) {
        pct = ((covered as f64) / (total as f64)) * 100.0;
    }
    let uncov: u32 = total - covered;
    let summary: own<CoverageSummary> = CoverageSummary {
        total_findings: total,
        covered_findings: covered,
        uncovered_findings: uncov,
        coverage_percentage: pct,
    };
    return move(summary);
}
`,
    },
    {
      path: 'src/cli/main.c',
      lang: 'C11 Native',
      content: `/**
 * BULT — Native CLI Binary Entrypoint
 * Target: black-210/BULT
 * License: GNU AGPL-3.0
 */
#include "bult/core.h"
#include "bult/rf.h"
#include "bult/security.h"
#include "bult/science.h"
#include <stdio.h>

int main(int argc, char **argv) {
    bult_init();
    printf("BULT Native Intelligence Workstation v%s\\n", BULT_VERSION_STRING);
    // Executed via bult_execute_command
    return 0;
}
`,
    },
    {
      path: 'CMakeLists.txt',
      lang: 'CMake',
      content: `cmake_minimum_required(VERSION 3.16)
project(BULT VERSION 1.0.0 LANGUAGES C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_FLAGS "\${CMAKE_C_FLAGS} -Wall -Wextra -pedantic -O2")

include_directories(include)

set(BULT_CORE_SRCS
    src/core/core.c
    src/rf/rf.c
    src/red_team/red.c
    src/blue_team/blue.c
    src/purple_team/purple.c
    src/physics/physics.c
    src/chemistry/chemistry.c
    src/forensics/forensics.c
)

add_library(bult_core STATIC \${BULT_CORE_SRCS})
target_link_libraries(bult_core m)

add_executable(bult src/cli/main.c)
target_link_libraries(bult bult_core m)

enable_testing()
add_executable(bult_test tests/test_all.c)
target_link_libraries(bult_test bult_core m)
add_test(NAME BultTestSuite COMMAND bult_test)
`,
    },
    {
      path: 'Makefile',
      lang: 'Makefile',
      content: `CC ?= gcc
CFLAGS ?= -Wall -Wextra -pedantic -std=c11 -O2 -Iinclude
LDFLAGS ?= -lm
CGT ?= cgt

all: bin/bult bin/bult_test

bin/bult: src/cli/main.c
\t$(CC) $(CFLAGS) -o $@ src/cli/main.c src/core/core.c src/rf/rf.c src/red_team/red.c src/blue_team/blue.c src/purple_team/purple.c src/physics/physics.c src/chemistry/chemistry.c src/forensics/forensics.c $(LDFLAGS)

test: bin/bult_test
\t./bin/bult_test
`,
    },
  ];

  const [selectedFile, setSelectedFile] = useState<RepoFile>(repoFiles[0]);

  const handleDownloadZip = async () => {
    setDownloading(true);
    const zip = new JSZip();

    // Add root files
    zip.file('README.md', '# BULT — Elite Purple-Team, RF Intelligence & Multidisciplinary Forensics System\n\nTarget Repository: https://github.com/black-210/BULT\nLanguage: C> (black-210/C-)\nLicense: GNU AGPL-3.0\n');
    zip.file('LICENSE', 'GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007\n\nCopyright (C) 2026 black-210\n');
    zip.file('NOTICE', 'BULT (C) 2026 black-210\nTarget Specification: https://github.com/black-210/C-\nLicense: GNU AGPL-3.0\n');

    // Add repository files
    for (const f of repoFiles) {
      zip.file(f.path, f.content);
    }

    // Generate zip blob
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BULT-native-repository-v1.0.0.zip';
    a.click();
    URL.revokeObjectURL(url);

    setDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded border border-cyan-800/40">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>BULT Native C&gt; Source Repository &amp; Export Center</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                black-210/BULT
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Native implementation in C&gt; (C-Greater, <a href="https://github.com/black-210/C-" target="_blank" rel="noreferrer" className="text-cyan-400 underline">black-210/C-</a>) and companion ISO C11 FFI layer.
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
        >
          {downloaded ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Download className="w-3.5 h-3.5" />}
          <span>{downloading ? 'Packing Zip...' : downloaded ? 'Downloaded Archive!' : 'Download Full GitHub Repo (.zip)'}</span>
        </button>
      </div>

      {/* Main File Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* File Tree (1 col) */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
          <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1 text-[11px]">
            Repository Source Tree
          </span>
          <div className="space-y-1">
            {repoFiles.map((file, idx) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between text-[11px] ${
                    isSelected
                      ? 'bg-cyan-950/70 border border-cyan-700/50 text-cyan-300'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0 ml-1">{file.lang}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* File Content Viewer (2 cols) */}
        <div className="lg:col-span-2 bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2 flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 text-[11px]">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span className="text-cyan-400">{selectedFile.path}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-normal">
                {selectedFile.lang}
              </span>
            </span>
            <span className="text-[10px] text-slate-500">Read-Only Inspection</span>
          </div>

          <pre className="flex-1 bg-[#060a10] text-slate-200 p-3 rounded border border-slate-800 overflow-x-auto text-[11px] font-mono leading-relaxed whitespace-pre-wrap max-h-[460px]">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
