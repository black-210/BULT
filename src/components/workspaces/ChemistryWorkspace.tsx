/**
 * BULT — Chemical Forensics & Spectroscopy Workspace
 * IUPAC Stoichiometry & Peak Detection Analysis
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Search, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { parseChemicalFormula, analyzeSpectra, addFindingToActiveCase } from '../../engine/bultEngine';
import { ChemicalAnalysis, SpectroscopyResult } from '../../types/bult';

export const ChemistryWorkspace: React.FC = () => {
  const [formula, setFormula] = useState<string>('C8H10N4O2'); // Caffeine
  const [analysis, setAnalysis] = useState<ChemicalAnalysis>(() => parseChemicalFormula(formula));
  const [addedFinding, setAddedFinding] = useState(false);

  // Generate synthetic FTIR absorbance spectrum
  const [spectralPoints] = useState<{ x: number; y: number }[]>(() => {
    const pts: { x: number; y: number }[] = [];
    for (let wn = 400; wn <= 4000; wn += 10) {
      let val = 0.04 + (Math.random() - 0.5) * 0.01;
      // Carbonyl stretch at 1650 cm^-1
      if (Math.abs(wn - 1650) < 60) val += 0.85 * Math.exp(-((wn - 1650) ** 2) / 450);
      // Aliphatic C-H at 2920 cm^-1
      if (Math.abs(wn - 2920) < 70) val += 0.65 * Math.exp(-((wn - 2920) ** 2) / 650);
      // Hydrogen bonding at 3350 cm^-1
      if (Math.abs(wn - 3350) < 90) val += 0.45 * Math.exp(-((wn - 3350) ** 2) / 900);
      pts.push({ x: wn, y: val });
    }
    return pts;
  });

  const [spectroscopy, setSpectroscopy] = useState<SpectroscopyResult>(() => analyzeSpectra(spectralPoints));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleParse = (fText: string) => {
    setFormula(fText);
    setAnalysis(parseChemicalFormula(fText));
  };

  // Draw 2D Spectroscopy Curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#142030';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // FTIR Convention: Invert X axis (4000 cm^-1 on left, 400 cm^-1 on right)
    const minWn = 400;
    const maxWn = 4000;
    const wnToX = (wn: number) => {
      return width - ((wn - minWn) / (maxWn - minWn)) * width;
    };
    const yToCanvas = (val: number) => {
      return height - (val / 1.1) * height;
    };

    // Draw Spectrum Path
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    spectralPoints.forEach((p, idx) => {
      const x = wnToX(p.x);
      const y = yToCanvas(p.y);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Mark Detected Peaks
    spectroscopy.peaks.forEach((peak) => {
      const px = wnToX(peak.position);
      const py = yToCanvas(peak.intensity);

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fda4af';
      ctx.font = '10px monospace';
      ctx.fillText(`${peak.position} cm⁻¹`, px - 25, py - 8);
    });
  }, [spectralPoints, spectroscopy]);

  const handleRegisterFinding = () => {
    addFindingToActiveCase({
      subsystem: 'CHEMISTRY',
      severity: 'INFO',
      confidence: 0.95,
      title: `Chemical Analysis: ${analysis.formula} (${analysis.molecularWeight.toFixed(2)} g/mol)`,
      description: `Identified ${spectroscopy.peaks.length} spectral peaks. Matched: ${spectroscopy.matchedCompound}.`,
      evidenceId: 'EV-002',
      remediation: 'Log certified IUPAC molecular weights in evidence registry.',
    });
    setAddedFinding(true);
    setTimeout(() => setAddedFinding(false), 2500);
  };

  const sampleFormulas = [
    { label: 'Caffeine', formula: 'C8H10N4O2' },
    { label: 'RDX Explosive', formula: 'C3H6N6O6' },
    { label: 'Sulfuric Acid', formula: 'H2SO4' },
    { label: 'Aspirin', formula: 'C9H8O4' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded border border-cyan-800/40">
            <FlaskConical className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Chemical Forensics &amp; Infrared Spectroscopy</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                IUPAC 2021/2026 Standards
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Elemental stoichiometry, molecular mass determination, and FTIR/Raman absorption peak characterization.
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

      {/* Formula Input & Quick Presets */}
      <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={formula}
              onChange={(e) => handleParse(e.target.value)}
              placeholder="Enter chemical formula (e.g. C8H10N4O2)..."
              className="w-full bg-[#070b10] text-slate-100 border border-slate-700 rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 mr-1">Presets:</span>
            {sampleFormulas.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleParse(p.formula)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors"
              >
                {p.label} ({p.formula})
              </button>
            ))}
          </div>
        </div>

        {/* Stoichiometric Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div className="bg-[#070b10] p-2.5 rounded border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Molecular Mass</span>
            <span className="text-lg font-bold text-cyan-300 font-mono">
              {analysis.molecularWeight.toFixed(4)} g/mol
            </span>
            <span className="text-[10px] text-slate-500 block">
              +/- {analysis.massUncertainty.toFixed(4)} g/mol
            </span>
          </div>

          {analysis.elements.slice(0, 3).map((e, idx) => (
            <div key={idx} className="bg-[#070b10] p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Element: {e.symbol}</span>
              <span className="text-lg font-bold text-slate-200 font-mono">
                {e.massFractionPct.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block">
                {e.count} atom{e.count > 1 ? 's' : ''} in formula
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spectroscopy Curve & Peak Detection */}
      <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-bold text-slate-200">
            Infrared Absorbance Spectrum (FTIR Wavenumber 4000 – 400 cm⁻¹)
          </span>
          <span className="text-cyan-400 font-semibold">{spectroscopy.matchedCompound}</span>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 rounded border border-slate-800 bg-[#060a12]"
        />

        {/* Identified Peaks Table */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-300 block">
            Identified Absorption Bands &amp; Functional Group Assignments
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {spectroscopy.peaks.map((p, idx) => (
              <div key={idx} className="p-2 bg-[#070b10] rounded border border-slate-800 text-[10px] space-y-1">
                <div className="flex justify-between text-cyan-300 font-bold">
                  <span>{p.position} cm⁻¹</span>
                  <span>SNR: {p.snr.toFixed(1)}</span>
                </div>
                <div className="text-slate-300 font-semibold">{p.assignment}</div>
                <div className="text-slate-500">FWHM: {p.fwhm.toFixed(1)} cm⁻¹</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
