/**
 * BULT — Experimental RF-DNA Feature Extraction & Fingerprint Comparison
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { Cpu, GitCompare, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { generateSyntheticIQ, extractRfDnaFeatures, compareRfDna } from '../../engine/bultEngine';
import { RfDnaFeatures } from '../../types/bult';

export const RfDnaWorkspace: React.FC = () => {
  const [capTypeA, setCapTypeA] = useState<'qpsk' | 'cw' | 'fsk'>('qpsk');
  const [capTypeB, setCapTypeB] = useState<'qpsk' | 'cw' | 'fsk'>('qpsk');

  const [featuresA, setFeaturesA] = useState<RfDnaFeatures>(() =>
    extractRfDnaFeatures(generateSyntheticIQ(2048, 2048000, 433920000, capTypeA))
  );
  const [featuresB, setFeaturesB] = useState<RfDnaFeatures>(() =>
    extractRfDnaFeatures(generateSyntheticIQ(2048, 2048000, 433920000, capTypeB))
  );

  const recompute = () => {
    setFeaturesA(extractRfDnaFeatures(generateSyntheticIQ(2048, 2048000, 433920000, capTypeA)));
    setFeaturesB(extractRfDnaFeatures(generateSyntheticIQ(2048, 2048000, 433920000, capTypeB)));
  };

  const similarityScore = compareRfDna(featuresA, featuresB);

  const featureRows = [
    { label: 'Instantaneous Amplitude Variance', valA: featuresA.ampVariance.toExponential(4), valB: featuresB.ampVariance.toExponential(4), desc: 'Envelope dispersion metric' },
    { label: 'Amplitude Skewness', valA: featuresA.ampSkewness.toFixed(4), valB: featuresB.ampSkewness.toFixed(4), desc: 'Envelope asymmetry moment' },
    { label: 'Amplitude Kurtosis', valA: featuresA.ampKurtosis.toFixed(4), valB: featuresB.ampKurtosis.toFixed(4), desc: 'Tail heaviness & burst impulsiveness' },
    { label: 'Instantaneous Phase Variance', valA: featuresA.phaseVariance.toFixed(4), valB: featuresB.phaseVariance.toFixed(4), desc: 'Phase trajectory stability' },
    { label: 'Phase Trajectory Derivative', valA: featuresA.phaseTrajectoryDerivative.toFixed(4), valB: featuresB.phaseTrajectoryDerivative.toFixed(4), desc: 'Instantaneous frequency slew' },
    { label: 'Spectral Entropy', valA: featuresA.spectralEntropy.toFixed(3), valB: featuresB.spectralEntropy.toFixed(3), desc: 'Shannon disorder in spectral distribution' },
    { label: 'Spectral Centroid', valA: featuresA.spectralCentroid.toFixed(3), valB: featuresB.spectralCentroid.toFixed(3), desc: 'Spectral center of mass (normalized)' },
    { label: 'Spectral Rolloff (85%)', valA: featuresA.spectralRolloff.toFixed(3), valB: featuresB.spectralRolloff.toFixed(3), desc: 'High frequency power cutoff point' },
    { label: 'Spectral Flatness', valA: featuresA.spectralFlatness.toFixed(3), valB: featuresB.spectralFlatness.toFixed(3), desc: 'Tone vs noise character ratio' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded border border-cyan-800/40">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Experimental RF-DNA Feature Extraction &amp; Comparison</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                Statistical Fingerprinting
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Moment-based feature extraction over instantaneous envelope, phase trajectory, and power spectral moments.
            </div>
          </div>
        </div>

        <button
          onClick={recompute}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Extract &amp; Compare Features</span>
        </button>
      </div>

      {/* Capture Selectors & Match Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Capture A */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
          <span className="font-bold text-cyan-400 text-[11px] block">Capture Sample Alpha</span>
          <select
            value={capTypeA}
            onChange={(e) => { setCapTypeA(e.target.value as any); }}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="qpsk">Profile A: QPSK Telemetry Burst</option>
            <option value="cw">Profile B: Continuous Wave Tone (CW)</option>
            <option value="fsk">Profile C: 2-FSK Shift Modulation</option>
          </select>
          <div className="text-[10px] text-slate-500">
            Source: 2048 complex samples @ 2.048 MSPS (Passive Capture)
          </div>
        </div>

        {/* Capture B */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
          <span className="font-bold text-amber-400 text-[11px] block">Capture Sample Bravo</span>
          <select
            value={capTypeB}
            onChange={(e) => { setCapTypeB(e.target.value as any); }}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="qpsk">Profile A: QPSK Telemetry Burst</option>
            <option value="cw">Profile B: Continuous Wave Tone (CW)</option>
            <option value="fsk">Profile C: 2-FSK Shift Modulation</option>
          </select>
          <div className="text-[10px] text-slate-500">
            Source: 2048 complex samples @ 2.048 MSPS (Passive Capture)
          </div>
        </div>

        {/* Similarity Score Card */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 flex flex-col justify-center items-center text-center space-y-1">
          <span className="text-slate-400 text-[10px]">Statistical Similarity Metric</span>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {(similarityScore * 100).toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            {similarityScore > 0.85 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> High Waveform Correlation
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <GitCompare className="w-3.5 h-3.5" /> Divergent Emission Profiles
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-[#0d1420] rounded border border-slate-800 overflow-hidden">
        <div className="px-4 py-2.5 bg-[#111a29] border-b border-slate-800 font-bold text-slate-200 flex justify-between items-center text-[11px]">
          <span>RF-DNA Statistical Moment Matrix</span>
          <span className="text-[10px] text-slate-400 font-normal">Calculated across 4096-sample time-frequency window</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] bg-[#0c121c]">
              <th className="p-2.5">Extracted Feature</th>
              <th className="p-2.5">Capture Alpha</th>
              <th className="p-2.5">Capture Bravo</th>
              <th className="p-2.5">Statistical Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {featureRows.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20">
                <td className="p-2.5 font-semibold text-slate-200">{r.label}</td>
                <td className="p-2.5 text-cyan-300 font-mono">{r.valA}</td>
                <td className="p-2.5 text-amber-300 font-mono">{r.valB}</td>
                <td className="p-2.5 text-slate-400 text-[10px]">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scientific Limitation & Forensic Disclaimer */}
      <div className="p-3 bg-amber-950/20 rounded border border-amber-900/40 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-amber-300">Scientific Boundary &amp; Forensic Admissibility: </span>
          RF-DNA feature vectors evaluate statistical similarity of instantaneous modulation and envelope characteristics across discrete observations. A high similarity score indicates congruent physical-layer emission signatures, but does not provide definitive transmitter hardware identification unless verified by calibrated lab instruments under invariant environmental conditions.
        </div>
      </div>
    </div>
  );
};
