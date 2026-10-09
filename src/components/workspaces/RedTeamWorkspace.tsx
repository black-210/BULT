/**
 * BULT — Red Team Security Assessment Workspace
 * Static Source/Binary Auditor & Deterministic Mutation Fuzzer
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Bug, Play, CheckCircle2, BookmarkPlus, AlertTriangle } from 'lucide-react';
import { auditSourceCode, runParserFuzzer, addFindingToActiveCase } from '../../engine/bultEngine';
import { RedAuditSummary, FuzzResult } from '../../types/bult';

export const RedTeamWorkspace: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>(
    `/* BULT Red-Team Assessment Fixture (C11 Target) */
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *API_KEY = "PRIVATE_KEY_SECRET_9841";

void parse_iq_header(const char *input_buffer, size_t count) {
    char local_stack[64];
    // Insecure bounded memory copy
    strcpy(local_stack, input_buffer);
    gets(local_stack);

    // Unchecked multiplication allocation
    void *ptr = malloc(count * sizeof(int));

    system("logger -t BULT_CAPTURE 'Ingested header'");
}
`
  );

  const [auditSummary, setAuditSummary] = useState<RedAuditSummary>(() => auditSourceCode(sourceCode));
  const [fuzzTarget, setFuzzTarget] = useState<string>('iq_header_parser');
  const [fuzzIterations, setFuzzIterations] = useState<number>(1000);
  const [fuzzResult, setFuzzResult] = useState<FuzzResult | null>(null);
  const [isFuzzing, setIsFuzzing] = useState<boolean>(false);
  const [addedFinding, setAddedFinding] = useState<boolean>(false);

  const handleRunAudit = () => {
    setAuditSummary(auditSourceCode(sourceCode));
  };

  const handleRunFuzzer = () => {
    setIsFuzzing(true);
    setTimeout(() => {
      setFuzzResult(runParserFuzzer(fuzzTarget, fuzzIterations));
      setIsFuzzing(false);
    }, 400);
  };

  const handleRegisterAllFindings = () => {
    auditSummary.findings.forEach((f) => {
      addFindingToActiveCase({
        subsystem: 'RED',
        severity: f.severity,
        confidence: 0.98,
        title: `Red Audit: ${f.unsafeApiName} Detected (${f.ruleId})`,
        description: `${f.contextSnippet} on line ${f.lineNumber}.`,
        evidenceId: 'EV-001',
        remediation: f.remediation,
      });
    });
    setAddedFinding(true);
    setTimeout(() => setAddedFinding(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-950/60 text-rose-400 rounded border border-rose-800/40">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Red Team Security Assessment &amp; Mutation Fuzzer</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/50">
                Authorized Local Audit Only
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Heuristic static analysis of unsafe APIs, credential exposures, integer overflow risks, and parser stress tests.
            </div>
          </div>
        </div>

        <button
          onClick={handleRegisterAllFindings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
            addedFinding
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              : 'bg-rose-600 hover:bg-rose-500 text-white font-bold'
          }`}
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>{addedFinding ? 'Findings Recorded!' : 'Push Findings to Case'}</span>
        </button>
      </div>

      {/* Main Grid: Code Editor on Left, Audit Results & Fuzzer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Interactive Source Code Inspector */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-slate-200">Supplied Target Source / Disassembly Input</span>
            <button
              onClick={handleRunAudit}
              className="flex items-center gap-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors text-[10px]"
            >
              <Play className="w-3 h-3" />
              <span>Run Heuristic Audit</span>
            </button>
          </div>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            rows={14}
            className="w-full flex-1 bg-[#060a10] text-emerald-300 font-mono text-[11px] p-3 rounded border border-slate-700 focus:outline-none focus:border-cyan-500"
            spellCheck={false}
          />
          <div className="text-[10px] text-slate-500">
            Inspects C11/C&gt; source text against static CVE rule catalogues and memory safety checks.
          </div>
        </div>

        {/* Right: Audit Findings & Mutation Fuzzer */}
        <div className="space-y-4">
          {/* Static Findings Ledger */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="font-bold text-slate-200 text-[11px]">Static Vulnerability Audit Findings</span>
              <span className="text-[10px] text-rose-400 font-bold">
                {auditSummary.findings.length} Defects Found
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {auditSummary.findings.map((f, idx) => (
                <div key={idx} className="p-2 bg-[#080d14] rounded border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-semibold">{f.ruleId} ({f.unsafeApiName})</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      f.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      f.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {f.severity}
                    </span>
                  </div>
                  <div className="text-slate-300 text-[10px]">{f.contextSnippet}</div>
                  <div className="text-emerald-400 text-[10px]">Fix: {f.remediation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Parser Mutation Fuzzer */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2.5 text-[11px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-amber-400" />
                Local Parser Mutation Fuzzer Harness
              </span>
              <span className="text-[10px] text-slate-400">Offline Stress Test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Target Parser</label>
                <input
                  type="text"
                  value={fuzzTarget}
                  onChange={(e) => setFuzzTarget(e.target.value)}
                  className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Iterations</label>
                <input
                  type="number"
                  value={fuzzIterations}
                  onChange={(e) => setFuzzIterations(Number(e.target.value))}
                  className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleRunFuzzer}
              disabled={isFuzzing}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isFuzzing ? 'Fuzzing in Progress...' : 'Start Mutation Fuzzer'}</span>
            </button>

            {fuzzResult && (
              <div className="p-2.5 bg-[#070b10] rounded border border-slate-800 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Executions:</span>
                  <span className="text-slate-200 font-mono">{fuzzResult.totalIterations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Parser Crashes:</span>
                  <span className="text-rose-400 font-bold font-mono">{fuzzResult.crashCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unique Code Paths:</span>
                  <span className="text-cyan-400 font-mono">{fuzzResult.uniquePaths}</span>
                </div>
                <div className="text-slate-300 font-mono bg-slate-900/60 p-1.5 rounded mt-1 border border-slate-800">
                  {fuzzResult.lastCrashPayload}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Defensive Ethics Disclaimer */}
      <div className="p-3 bg-slate-900/40 rounded border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-slate-200">Authorized Assessment Scope: </span>
          BULT Red Team audits are restricted to explicitly supplied files, parsers, and local system configurations. No automated weaponization, unauthorized credential harvesting, malware deployment, or destructive exploitation is performed.
        </div>
      </div>
    </div>
  );
};
