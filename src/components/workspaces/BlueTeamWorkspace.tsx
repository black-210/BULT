/**
 * BULT — Blue Team Detection Engine & Event Timeline
 * SHA-256 Integrity Verification & Detection Rules
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertOctagon, FileCheck, Search, Clock } from 'lucide-react';
import { verifyManifestBaseline, evaluateBlueEvent, DEFAULT_DETECTION_RULES } from '../../engine/bultEngine';
import { IntegrityReport, BlueAlert } from '../../types/bult';

export const BlueTeamWorkspace: React.FC = () => {
  const [manifestData] = useState([
    { path: 'include/bult/core.h', expected: '0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a', actual: '0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a' },
    { path: 'include/bult/rf.h', expected: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', actual: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e' },
    { path: 'fixtures/iq_sample.raw', expected: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', actual: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { path: '/etc/bult/audit.conf', expected: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d', actual: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b' },
  ]);

  const [integrityReport] = useState<IntegrityReport>(() => verifyManifestBaseline(manifestData));
  const [eventInput, setEventInput] = useState<string>('logger: Process invoked strcpy(dest, untrusted_payload) at memory offset 0x4010a0');
  const [alerts, setAlerts] = useState<BlueAlert[]>(() => evaluateBlueEvent(eventInput));

  const handleEvaluateEvent = () => {
    setAlerts(evaluateBlueEvent(eventInput));
  };

  const timelineEvents = [
    { time: '02:14:10 UTC', source: 'auditd', event: 'Baseline manifest check executed across 4 target stores', type: 'INFO' },
    { time: '02:18:22 UTC', source: 'kernel', event: 'File integrity drift detected on /etc/bult/audit.conf', type: 'ALERT' },
    { time: '02:22:05 UTC', source: 'rf_ingest', event: 'Passive IQ frame sync acquired on 433.920 MHz (2048 samples)', type: 'INFO' },
    { time: '02:26:41 UTC', source: 'bult_sec', event: 'Detection rule BLUE-RULE-01 triggered: Unsafe strcpy execution', type: 'CRITICAL' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-950/60 text-blue-400 rounded border border-blue-800/40">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Blue Team Detection Engine &amp; Defensive Forensics</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/50">
                Integrity &amp; Telemetry
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              SHA-256 baseline manifest verification, signature rule evaluation, and incident timeline reconstruction.
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Integrity Manifest & Event Rule Matcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: SHA-256 Manifest Verification */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              Cryptographic File Integrity Manifest
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-emerald-400 font-bold">{integrityReport.verifiedFiles} OK</span>
              <span className="text-rose-400 font-bold">{integrityReport.modifiedFiles} DRIFT</span>
            </div>
          </div>

          <div className="space-y-2">
            {integrityReport.entries.map((e, idx) => (
              <div key={idx} className="p-2 bg-[#070b10] rounded border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-200 font-semibold">{e.filepath}</span>
                  {e.matches ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> MATCHED
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold text-[10px]">
                      <AlertOctagon className="w-3 h-3" /> DRIFT DETECTED
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Exp: {e.expectedSha256.substring(0, 32)}...
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  Act: {e.actualSha256.substring(0, 32)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Defensive Event Rule Matcher */}
        <div className="space-y-4">
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                Live Defensive Event Rule Evaluator
              </span>
              <button
                onClick={handleEvaluateEvent}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-[10px]"
              >
                Evaluate Event
              </button>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] mb-1">Simulated Ingested Event / Log Line</label>
              <textarea
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                rows={2}
                className="w-full bg-[#070b10] text-slate-200 p-2 rounded border border-slate-700 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Generated Alerts */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 block">Evaluated Alerts:</span>
              {alerts.length > 0 ? (
                alerts.map((a, idx) => (
                  <div key={idx} className="p-2 bg-rose-950/30 border border-rose-800/40 rounded text-[10px] space-y-0.5 text-rose-300">
                    <div className="flex justify-between font-bold">
                      <span>[{a.alertId}] Rule: {a.ruleId}</span>
                      <span>{a.severity}</span>
                    </div>
                    <div>{a.sourceEvent}</div>
                  </div>
                ))
              ) : (
                <div className="p-2 bg-[#070b10] rounded text-[10px] text-slate-500 border border-slate-800">
                  No defensive rules triggered on input event.
                </div>
              )}
            </div>
          </div>

          {/* Active Rule Catalog */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2 text-[11px]">
            <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
              Armed Detection Rules ({DEFAULT_DETECTION_RULES.length})
            </span>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {DEFAULT_DETECTION_RULES.map((r, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] bg-[#070b10] p-1.5 rounded border border-slate-800">
                  <span className="text-cyan-400 font-semibold">{r.ruleId}</span>
                  <span className="text-slate-300 truncate max-w-xs">{r.name}</span>
                  <span className="text-slate-500 font-mono">{r.pattern}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reconstructed Incident Timeline */}
      <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 font-bold text-slate-200 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Reconstructed Defensive Forensic Event Timeline
        </div>
        <div className="space-y-1.5">
          {timelineEvents.map((ev, idx) => (
            <div key={idx} className="flex items-center gap-3 p-1.5 bg-[#070b10] rounded border border-slate-800 text-[11px]">
              <span className="text-slate-500 font-mono text-[10px]">{ev.time}</span>
              <span className="text-cyan-400 font-semibold text-[10px] w-20">[{ev.source}]</span>
              <span className="text-slate-200 flex-1">{ev.event}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                ev.type === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                ev.type === 'ALERT' ? 'bg-amber-950 text-amber-300' :
                'bg-slate-800 text-slate-400'
              }`}>
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
