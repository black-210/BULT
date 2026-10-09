/**
 * BULT — Purple Team Correlation & Detection Validation
 * Mathematically Verified Coverage % & Gap Analysis
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, AlertTriangle, FileDown, BookmarkPlus } from 'lucide-react';
import { 
  auditSourceCode, 
  correlateRedWithBlue, 
  addFindingToActiveCase 
} from '../../engine/bultEngine';
import { PurpleCoverageReport } from '../../types/bult';

export const PurpleTeamWorkspace: React.FC = () => {
  const [sourceCode] = useState<string>(
    `/* BULT Core Test Vectors */
strcpy(dest, untrusted);
gets(user_buf);
const char *sec = "password123";
malloc(items * sizeof(int));
`
  );

  const [purpleReport, setPurpleReport] = useState<PurpleCoverageReport>(() => {
    const red = auditSourceCode(sourceCode);
    return correlateRedWithBlue(red);
  });

  const [addedFinding, setAddedFinding] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleRecalculate = () => {
    const red = auditSourceCode(sourceCode);
    setPurpleReport(correlateRedWithBlue(red));
  };

  const handleRegisterFinding = () => {
    addFindingToActiveCase({
      subsystem: 'PURPLE',
      severity: purpleReport.uncoveredFindings > 0 ? 'HIGH' : 'LOW',
      confidence: 0.99,
      title: `Purple-Team Coverage Assessment: ${purpleReport.coveragePercentage.toFixed(1)}% Verified`,
      description: `Tested ${purpleReport.totalRedFindings} attack vectors. ${purpleReport.coveredFindings} covered, ${purpleReport.uncoveredFindings} gap vectors identified.`,
      evidenceId: 'EV-001',
      remediation: 'Deploy custom Blue-Team auditd and eBPF detection rules for integer allocation multiplier gaps.',
    });
    setAddedFinding(true);
    setTimeout(() => setAddedFinding(false), 2500);
  };

  const handleExportMarkdown = () => {
    const md = [
      `# BULT Purple-Team Detection Coverage Report`,
      `**Total Tested Attack Vectors**: ${purpleReport.totalRedFindings}`,
      `**Defended by Blue Rules**: ${purpleReport.coveredFindings}`,
      `**Uncovered Detection Gaps**: ${purpleReport.uncoveredFindings}`,
      `**Mathematical Coverage Metric**: ${purpleReport.coveragePercentage.toFixed(2)}%`,
      `\n## Correlation Matrix\n`,
      `| Red Finding ID | Blue Detection Rule | Status | Confidence | Gap Analysis |`,
      `| -------------- | ------------------- | ------ | ---------- | ------------ |`,
      ...purpleReport.correlations.map(
        c => `| ${c.redFindingId} | ${c.blueRuleId} | ${c.isCovered ? 'COVERED' : 'GAP'} | ${(c.detectionConfidence * 100).toFixed(0)}% | ${c.gapAnalysis} |`
      ),
    ].join('\n');

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/60 text-purple-400 rounded border border-purple-800/40">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Purple Team Correlation &amp; Detection Validation</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/50">
                Mathematical Verification
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Correlates Red assessment findings with Blue detection rules; calculates authentic mathematical coverage percentages.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copiedMd ? 'Copied Markdown!' : 'Export Markdown'}</span>
          </button>
          <button
            onClick={handleRegisterFinding}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              addedFinding
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-purple-600 hover:bg-purple-500 text-white font-bold'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{addedFinding ? 'Finding Registered!' : 'Record Case Finding'}</span>
          </button>
        </div>
      </div>

      {/* Coverage Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block mb-1">Total Assessed Vectors</span>
          <div className="text-2xl font-bold text-slate-100">{purpleReport.totalRedFindings}</div>
          <span className="text-[10px] text-slate-500">From Red-Team Static Fixture</span>
        </div>

        <div className="bg-[#0d1420] p-3 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block mb-1">Covered by Detections</span>
          <div className="text-2xl font-bold text-emerald-400">{purpleReport.coveredFindings}</div>
          <span className="text-[10px] text-emerald-500/80">Active Blue Alert Rules</span>
        </div>

        <div className="bg-[#0d1420] p-3 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block mb-1">Uncovered Gaps</span>
          <div className="text-2xl font-bold text-rose-400">{purpleReport.uncoveredFindings}</div>
          <span className="text-[10px] text-rose-500/80">Requires Rule Remediation</span>
        </div>

        <div className="bg-[#0d1420] p-3 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block mb-1">Detection Coverage Metric</span>
          <div className="text-2xl font-bold text-purple-400">
            {purpleReport.coveragePercentage.toFixed(1)}%
          </div>
          <span className="text-[10px] text-purple-300/80">Strict Mathematical Ratio</span>
        </div>
      </div>

      {/* Correlation Matrix Table */}
      <div className="bg-[#0d1420] rounded border border-slate-800 overflow-hidden">
        <div className="px-4 py-2.5 bg-[#111a29] border-b border-slate-800 font-bold text-slate-200 flex justify-between items-center text-[11px]">
          <span>Red-to-Blue Correlation Matrix</span>
          <button
            onClick={handleRecalculate}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 underline"
          >
            Re-evaluate Matrix
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] bg-[#0c121c]">
              <th className="p-2.5">Red Finding ID</th>
              <th className="p-2.5">Blue Detection Rule</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Confidence</th>
              <th className="p-2.5">Gap Analysis &amp; Remediation Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {purpleReport.correlations.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20">
                <td className="p-2.5 font-mono text-cyan-300 font-semibold">{c.redFindingId}</td>
                <td className="p-2.5 font-mono text-slate-200">{c.blueRuleId}</td>
                <td className="p-2.5">
                  {c.isCovered ? (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                      COVERED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded text-[10px] font-bold">
                      UNCOVERED GAP
                    </span>
                  )}
                </td>
                <td className="p-2.5 font-mono text-slate-300">{(c.detectionConfidence * 100).toFixed(0)}%</td>
                <td className="p-2.5 text-slate-300 text-[10px]">{c.gapAnalysis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purple Team Methodology Notice */}
      <div className="p-3 bg-purple-950/20 rounded border border-purple-900/40 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-purple-300">Non-Fabricated Metrics Policy: </span>
          Detection coverage is computed strictly as the ratio of validated defensive rule triggers against the full set of empirical findings identified by the Red module (C = covered / total × 100%). No arbitrary or cosmetic percentages are generated.
        </div>
      </div>
    </div>
  );
};
