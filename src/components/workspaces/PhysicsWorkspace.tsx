/**
 * BULT — Physical Forensics & Electromagnetic Analysis Workspace
 * Dimensional Analysis & Gaussian Error Propagation
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { Atom, Calculator, BookmarkPlus, Info } from 'lucide-react';
import { computeEmAnalysis, addFindingToActiveCase, SPEED_OF_LIGHT, VACUUM_PERMEABILITY, VACUUM_PERMITTIVITY } from '../../engine/bultEngine';
import { EmCalcResult } from '../../types/bult';

export const PhysicsWorkspace: React.FC = () => {
  const [freqHz, setFreqHz] = useState<number>(2400000000); // 2.4 GHz
  const [distM, setDistM] = useState<number>(1000); // 1 km
  const [result, setResult] = useState<EmCalcResult>(() => computeEmAnalysis(freqHz, distM));
  const [addedFinding, setAddedFinding] = useState(false);

  const handleCalculate = () => {
    setResult(computeEmAnalysis(freqHz, distM));
  };

  const handleRegisterFinding = () => {
    addFindingToActiveCase({
      subsystem: 'PHYSICS',
      severity: 'INFO',
      confidence: 0.99,
      title: `EM Propagation Model: ${(freqHz / 1e6).toFixed(1)} MHz over ${distM}m`,
      description: `Predicted FSPL ${result.fsplDb.toFixed(2)} +/- ${result.fsplUncertaintyDb.toFixed(3)} dB. Wavelength ${(result.wavelengthM * 100).toFixed(2)} cm.`,
      evidenceId: 'EV-001',
      remediation: 'Calibrate receiver LNA dynamic range against calculated free-space attenuation.',
    });
    setAddedFinding(true);
    setTimeout(() => setAddedFinding(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded border border-cyan-800/40">
            <Atom className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Physical Forensics &amp; Electromagnetic Analysis</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                CODATA 2022 Physical Constants
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Free-space path loss (FSPL), covariance error propagation, skin depth, and dipole resonance calculus.
            </div>
          </div>
        </div>

        <button
          onClick={handleRegisterFinding}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
            addedFinding
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold'
          }`}
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>{addedFinding ? 'Finding Registered!' : 'Record Case Finding'}</span>
        </button>
      </div>

      {/* Input Parameters & Constants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EM Calculation Inputs */}
        <div className="md:col-span-2 bg-[#0d1420] p-3 rounded border border-slate-800 space-y-3">
          <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1 text-[11px]">
            Propagation Parameter Inputs
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <label className="text-slate-400 block mb-1">Carrier Frequency (Hz)</label>
              <input
                type="number"
                value={freqHz}
                onChange={(e) => setFreqHz(Number(e.target.value))}
                className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {(freqHz / 1e6).toFixed(3)} MHz / {(freqHz / 1e9).toFixed(3)} GHz
              </span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Propagation Distance (Meters)</label>
              <input
                type="number"
                value={distM}
                onChange={(e) => setDistM(Number(e.target.value))}
                className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {(distM / 1000).toFixed(2)} Kilometers
              </span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Execute Dimensional Calculus</span>
          </button>
        </div>

        {/* Fundamental Physical Constants Reference */}
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2 text-[11px]">
          <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
            Standard Physical Constants
          </span>
          <div className="space-y-1.5 text-[10px]">
            <div>
              <span className="text-slate-400 block">Speed of Light in Vacuum (c):</span>
              <span className="text-cyan-300 font-mono">{SPEED_OF_LIGHT.toLocaleString()} m/s</span>
            </div>
            <div>
              <span className="text-slate-400 block">Vacuum Permittivity (ε₀):</span>
              <span className="text-cyan-300 font-mono">{VACUUM_PERMITTIVITY.toExponential(6)} F/m</span>
            </div>
            <div>
              <span className="text-slate-400 block">Vacuum Permeability (μ₀):</span>
              <span className="text-cyan-300 font-mono">{VACUUM_PERMEABILITY.toExponential(6)} H/m</span>
            </div>
            <div>
              <span className="text-slate-400 block">Copper Conductivity (σ_Cu):</span>
              <span className="text-cyan-300 font-mono">5.80 × 10⁷ S/m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Physical Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px]">Free-Space Path Loss (FSPL)</span>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            {result.fsplDb.toFixed(2)} dB
          </div>
          <span className="text-[10px] text-slate-500">
            Uncertainty: +/- {result.fsplUncertaintyDb.toFixed(3)} dB (1σ)
          </span>
        </div>

        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px]">Electromagnetic Wavelength (λ)</span>
          <div className="text-xl font-bold text-emerald-300 font-mono">
            {(result.wavelengthM * 100).toFixed(2)} cm
          </div>
          <span className="text-[10px] text-slate-500">
            {result.wavelengthM.toFixed(4)} meters
          </span>
        </div>

        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px]">Resonant Half-Wave Dipole</span>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {(result.dipoleResonantLengthM * 100).toFixed(2)} cm
          </div>
          <span className="text-[10px] text-slate-500">
            VF = 0.95 end-effect factor
          </span>
        </div>

        <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px]">Copper Skin Depth (δ)</span>
          <div className="text-xl font-bold text-purple-300 font-mono">
            {(result.skinDepthCopperM * 1e6).toFixed(2)} µm
          </div>
          <span className="text-[10px] text-slate-500">
            Conductor attenuation depth
          </span>
        </div>
      </div>

      {/* Analytical Documentation Box */}
      <div className="p-3 bg-slate-900/40 rounded border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-slate-200">Uncertainty Propagation Calculus: </span>
          Free-space path loss uncertainty is derived using first-order Taylor expansion error propagation:
          <span className="text-cyan-300 font-mono block mt-1">
            σ_FSPL = √[ (20 / (d·ln10))² σ_d² + (20 / (f·ln10))² σ_f² ]
          </span>
          All calculations distinguish empirical physical boundaries from idealized theoretical assertions.
        </div>
      </div>
    </div>
  );
};
