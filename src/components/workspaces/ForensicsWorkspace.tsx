/**
 * BULT — Digital Forensics, Case Ledger & Evidence Vault
 * Cryptographic Chain of Custody & Multi-Subsystem Reports
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Hash, Download, Lock, CheckCircle2, 
  Copy, Check, FileDown 
} from 'lucide-react';
import { 
  getActiveCase, 
  computeSha256, 
  addEvidenceToActiveCase, 
  exportCaseMarkdown, 
  exportCaseJson 
} from '../../engine/bultEngine';
import { Case } from '../../types/bult';

export const ForensicsWorkspace: React.FC = () => {
  const [caseData, setCaseData] = useState<Case>(() => getActiveCase());
  const [hasherInput, setHasherInput] = useState<string>('RAW_EVIDENCE_CAPTURE_BUFFER_TRACE_#4912');
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [reportFormat, setReportFormat] = useState<'MD' | 'JSON'>('MD');

  const handleComputeHash = async () => {
    const hash = await computeSha256(hasherInput);
    setCalculatedHash(hash);
  };

  const handleAddHashedEvidence = () => {
    if (!calculatedHash) return;
    addEvidenceToActiveCase({
      filepath: 'recovered_artifact.bin',
      sha256: calculatedHash,
      sizeBytes: hasherInput.length,
      instrument: 'Forensic Hash Ingestion Unit',
      custodian: 'Lead Forensic Examiner',
      notes: 'Cryptographic SHA-256 seal generated in BULT Case Vault',
    });
    setCaseData({ ...getActiveCase() });
  };

  const handleCopyReport = () => {
    const text = reportFormat === 'MD' ? exportCaseMarkdown(caseData) : exportCaseJson(caseData);
    navigator.clipboard.writeText(text);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = reportFormat === 'MD' ? exportCaseMarkdown(caseData) : exportCaseJson(caseData);
    const blob = new Blob([text], { type: reportFormat === 'MD' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseData.id}_report.${reportFormat.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded border border-cyan-800/40">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Digital Forensics &amp; Evidence Vault</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/50">
                Immutable Custody Log
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Active Case: <strong className="text-amber-400">{caseData.id}</strong> — {caseData.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied!' : 'Copy Report'}</span>
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {reportFormat}</span>
          </button>
        </div>
      </div>

      {/* Case Metadata & Quick Cryptographic Hasher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Case Info (1 col) */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2 text-[11px]">
          <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
            Active Investigative Container
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Case Identifier:</span>
              <span className="text-amber-400 font-bold">{caseData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Investigator:</span>
              <span className="text-slate-200 font-semibold">{caseData.investigator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Case Status:</span>
              <span className="text-emerald-400 font-bold">{caseData.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Evidence Count:</span>
              <span className="text-cyan-300 font-bold">{caseData.evidence.length} Artifacts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recorded Findings:</span>
              <span className="text-purple-300 font-bold">{caseData.findings.length} Findings</span>
            </div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Evidence Hasher Tool (2 cols) */}
        <div className="lg:col-span-2 bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1 text-[11px]">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              Cryptographic SHA-256 Custody Seal Generator
            </span>
            <button
              onClick={handleComputeHash}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-[10px]"
            >
              Compute Hash
            </button>
          </div>

          <input
            type="text"
            value={hasherInput}
            onChange={(e) => setHasherInput(e.target.value)}
            placeholder="Input artifact string or file buffer..."
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 text-xs font-mono"
          />

          {calculatedHash && (
            <div className="p-2 bg-[#070b10] rounded border border-slate-800 space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">SHA-256 Digest:</span>
                <button
                  onClick={handleAddHashedEvidence}
                  className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold hover:bg-emerald-900"
                >
                  Append to Case Evidence Vault
                </button>
              </div>
              <div className="text-emerald-300 font-mono break-all">{calculatedHash}</div>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Items Ledger */}
      <div className="bg-[#0d1420] rounded border border-slate-800 overflow-hidden">
        <div className="px-4 py-2 bg-[#111a29] border-b border-slate-800 font-bold text-slate-200 flex justify-between items-center text-[11px]">
          <span>Registered Evidence Artifacts ({caseData.evidence.length})</span>
          <span className="text-[10px] text-slate-400 font-normal">SHA-256 Authenticated</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] bg-[#0c121c]">
              <th className="p-2.5">Evidence ID</th>
              <th className="p-2.5">Source Path</th>
              <th className="p-2.5">SHA-256 Hash</th>
              <th className="p-2.5">Acquisition Instrument</th>
              <th className="p-2.5">Custodian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {caseData.evidence.map((ev, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20">
                <td className="p-2.5 font-mono text-cyan-300 font-semibold">{ev.id}</td>
                <td className="p-2.5 text-slate-200">{ev.filepath}</td>
                <td className="p-2.5 font-mono text-emerald-400 text-[10px]">
                  {ev.sha256.substring(0, 24)}...
                </td>
                <td className="p-2.5 text-slate-300">{ev.instrument}</td>
                <td className="p-2.5 text-slate-400">{ev.custodian}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Case Findings Ledger */}
      <div className="bg-[#0d1420] rounded border border-slate-800 overflow-hidden">
        <div className="px-4 py-2 bg-[#111a29] border-b border-slate-800 font-bold text-slate-200 flex justify-between items-center text-[11px]">
          <span>Subsystem Findings Ledger ({caseData.findings.length})</span>
          <span className="text-[10px] text-slate-400 font-normal">Cross-Correlated Intelligence</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] bg-[#0c121c]">
              <th className="p-2.5">Finding ID</th>
              <th className="p-2.5">Subsystem</th>
              <th className="p-2.5">Severity</th>
              <th className="p-2.5">Confidence</th>
              <th className="p-2.5">Title &amp; Remediation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {caseData.findings.map((f, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20">
                <td className="p-2.5 font-mono text-cyan-300 font-semibold">{f.id}</td>
                <td className="p-2.5 font-mono text-slate-300">{f.subsystem}</td>
                <td className="p-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    f.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    f.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    f.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {f.severity}
                  </span>
                </td>
                <td className="p-2.5 font-mono text-slate-200">{(f.confidence * 100).toFixed(0)}%</td>
                <td className="p-2.5">
                  <div className="font-semibold text-slate-200">{f.title}</div>
                  <div className="text-[10px] text-slate-400">{f.description}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Remediation: {f.remediation}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Case Report Preview Section */}
      <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-bold text-slate-200">Exportable Case Report Preview</span>
          <div className="flex gap-2">
            <button
              onClick={() => setReportFormat('MD')}
              className={`px-2 py-0.5 rounded text-[10px] ${reportFormat === 'MD' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Markdown
            </button>
            <button
              onClick={() => setReportFormat('JSON')}
              className={`px-2 py-0.5 rounded text-[10px] ${reportFormat === 'JSON' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              JSON
            </button>
          </div>
        </div>

        <pre className="p-3 bg-[#060a10] rounded border border-slate-800 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
          {reportFormat === 'MD' ? exportCaseMarkdown(caseData) : exportCaseJson(caseData)}
        </pre>
      </div>
    </div>
  );
};
