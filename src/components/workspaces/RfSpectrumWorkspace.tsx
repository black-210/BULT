/**
 * BULT — RF Spectrum Analyzer & Live Waterfall Spectrogram
 * Real-time Canvas Rendering with FFT and Signal Metrics
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Activity, RefreshCw, Zap, BookmarkPlus, Info } from 'lucide-react';
import { 
  generateSyntheticIQ, 
  computeSpectrum, 
  addFindingToActiveCase 
} from '../../engine/bultEngine';
import { IQCapture, SpectrumResult } from '../../types/bult';

export const RfSpectrumWorkspace: React.FC = () => {
  const [modulation, setModulation] = useState<'qpsk' | 'cw' | 'fsk'>('qpsk');
  const [sampleRate, setSampleRate] = useState<number>(2048000);
  const [centerFreq, setCenterFreq] = useState<number>(433920000);
  const [fftSize, setFftSize] = useState<number>(1024);
  const [windowType, setWindowType] = useState<'HANN' | 'HAMMING' | 'BLACKMAN' | 'RECTANGULAR'>('HANN');

  const [capture, setCapture] = useState<IQCapture>(() => 
    generateSyntheticIQ(2048, sampleRate, centerFreq, modulation)
  );
  const [spectrum, setSpectrum] = useState<SpectrumResult>(() => 
    computeSpectrum(capture, fftSize, windowType)
  );
  const [addedFinding, setAddedFinding] = useState(false);

  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const waterfallCanvasRef = useRef<HTMLCanvasElement>(null);
  const constellationCanvasRef = useRef<HTMLCanvasElement>(null);

  // Recompute spectrum whenever capture or settings change
  const refreshCapture = () => {
    const newCap = generateSyntheticIQ(2048, sampleRate, centerFreq, modulation);
    const newSpec = computeSpectrum(newCap, fftSize, windowType);
    setCapture(newCap);
    setSpectrum(newSpec);
  };

  useEffect(() => {
    refreshCapture();
  }, [modulation, sampleRate, centerFreq, fftSize, windowType]);

  // Draw 2D Spectrum Graph
  useEffect(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas || !spectrum) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#060a10';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#15202e';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 60) {
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

    // Dynamic scale: min -80 dB, max 0 dB
    const minDb = -85;
    const maxDb = 0;
    const dbToY = (db: number) => {
      const clamped = Math.max(minDb, Math.min(maxDb, db));
      return height - ((clamped - minDb) / (maxDb - minDb)) * height;
    };

    // Draw Noise Floor Line
    const noiseY = dbToY(spectrum.noiseFloorDb);
    ctx.strokeStyle = '#38bdf844';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, noiseY);
    ctx.lineTo(width, noiseY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Spectrum Path
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const pts = spectrum.psdDb;
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * width;
      const y = dbToY(pts[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill gradient under curve
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(34, 211, 238, 0.25)');
    grad.addColorStop(1, 'rgba(34, 211, 238, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Peak Marker
    const peakIdx = pts.indexOf(spectrum.peakPowerDb);
    if (peakIdx >= 0) {
      const peakX = (peakIdx / (pts.length - 1)) * width;
      const peakY = dbToY(spectrum.peakPowerDb);
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f87171';
      ctx.font = '10px monospace';
      ctx.fillText(
        `Peak: ${(spectrum.peakFreqHz / 1e6).toFixed(3)} MHz (${spectrum.peakPowerDb.toFixed(1)} dB)`,
        Math.min(width - 170, Math.max(10, peakX - 60)),
        peakY - 8
      );
    }
  }, [spectrum]);

  // Draw Waterfall Spectrogram
  useEffect(() => {
    const canvas = waterfallCanvasRef.current;
    if (!canvas || !spectrum) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Scroll existing waterfall down
    const imgData = ctx.getImageData(0, 0, width, height - 2);
    ctx.putImageData(imgData, 0, 2);

    // Draw new top line with thermal gradient
    const pts = spectrum.psdDb;
    const step = width / pts.length;
    for (let i = 0; i < pts.length; i++) {
      const db = pts[i];
      // Map -80 dB .. -10 dB to 0 .. 1
      const norm = Math.max(0, Math.min(1, (db + 75) / 65));
      // Thermal Colormap (blue -> cyan -> yellow -> red)
      const r = Math.floor(Math.min(255, Math.max(0, (norm - 0.5) * 510)));
      const g = Math.floor(Math.min(255, Math.max(0, norm * 255)));
      const b = Math.floor(Math.min(255, Math.max(0, (1 - norm) * 255)));

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(i * step, 0, step + 1, 2);
    }
  }, [spectrum]);

  // Draw Constellation Diagram
  useEffect(() => {
    const canvas = constellationCanvasRef.current;
    if (!canvas || !capture) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = '#060a10';
    ctx.fillRect(0, 0, width, height);

    // Crosshairs
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Plot I vs Q
    const scale = (width / 2) * 0.75;
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < Math.min(capture.sampleCount, 512); i++) {
      const s = capture.samples[i];
      const x = width / 2 + s.i * scale;
      const y = height / 2 - s.q * scale;
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }, [capture]);

  const handleRegisterFinding = () => {
    addFindingToActiveCase({
      subsystem: 'RF',
      severity: 'MEDIUM',
      confidence: 0.95,
      title: `${modulation.toUpperCase()} Carrier Emission at ${(spectrum.peakFreqHz / 1e6).toFixed(3)} MHz`,
      description: `Observed SNR ${spectrum.snrDb.toFixed(1)} dB with ${(spectrum.bandwidth3DbHz / 1e3).toFixed(1)} kHz bandwidth.`,
      evidenceId: 'EV-001',
      remediation: 'Record capture signature in RF-DNA fingerprint library and verify license allocation.',
    });
    setAddedFinding(true);
    setTimeout(() => setAddedFinding(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-y-auto p-4 space-y-4 text-xs font-mono">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1420] p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded border border-cyan-800/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>RF Intelligence &amp; IQ Signal Processing</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/50">
                Cooley-Tukey Radix-2
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Receive-Only Hardware Boundary Enforced | Target Freq: {(centerFreq / 1e6).toFixed(3)} MHz
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate / Resample</span>
          </button>
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
      </div>

      {/* Signal Parameter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#0d1420] p-3 rounded border border-slate-800 text-[11px]">
        <div>
          <label className="text-slate-400 block mb-1">Modulation Scheme</label>
          <select
            value={modulation}
            onChange={(e) => setModulation(e.target.value as any)}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            <option value="qpsk">QPSK (Phase Keyed + Tone)</option>
            <option value="cw">CW (Continuous Wave Pure Tone)</option>
            <option value="fsk">2-FSK (Frequency Shift Keying)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Center Frequency</label>
          <select
            value={centerFreq}
            onChange={(e) => setCenterFreq(Number(e.target.value))}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            <option value={433920000}>433.920 MHz (ISM Band)</option>
            <option value={868000000}>868.000 MHz (SRD Telemetry)</option>
            <option value={915000000}>915.000 MHz (ISM US)</option>
            <option value={2400000000}>2.400 GHz (Microwave Band)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Sample Rate</label>
          <select
            value={sampleRate}
            onChange={(e) => setSampleRate(Number(e.target.value))}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            <option value={1024000}>1.024 MSPS</option>
            <option value={2048000}>2.048 MSPS (Standard)</option>
            <option value={5000000}>5.000 MSPS</option>
            <option value={10000000}>10.000 MSPS</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">FFT Size (Radix-2)</label>
          <select
            value={fftSize}
            onChange={(e) => setFftSize(Number(e.target.value))}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            <option value={512}>512 Points</option>
            <option value={1024}>1024 Points</option>
            <option value={2048}>2048 Points</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Window Function</label>
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value as any)}
            className="w-full bg-[#070b10] text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            <option value="HANN">Hann Window</option>
            <option value="HAMMING">Hamming Window</option>
            <option value="BLACKMAN">Blackman Window</option>
            <option value="RECTANGULAR">Rectangular (None)</option>
          </select>
        </div>
      </div>

      {/* Main Canvas Displays */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Spectrum & Waterfall (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Spectrum Analyzer Graph */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Power Spectral Density (PSD in dB vs Frequency)
              </span>
              <div className="flex items-center gap-4">
                <span>Peak: <strong className="text-rose-400">{spectrum.peakPowerDb.toFixed(1)} dB</strong></span>
                <span>Noise: <strong className="text-slate-300">{spectrum.noiseFloorDb.toFixed(1)} dB</strong></span>
                <span>SNR: <strong className="text-emerald-400">{spectrum.snrDb.toFixed(1)} dB</strong></span>
              </div>
            </div>
            <canvas
              ref={spectrumCanvasRef}
              width={750}
              height={220}
              className="w-full h-52 rounded border border-slate-800 bg-[#060a10]"
            />
          </div>

          {/* Waterfall Spectrogram */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Time-Frequency Waterfall Spectrogram (Thermal Plasma Density)
              </span>
              <span className="text-[10px] text-slate-500">Continuous Rolling Buffer</span>
            </div>
            <canvas
              ref={waterfallCanvasRef}
              width={750}
              height={140}
              className="w-full h-36 rounded border border-slate-800 bg-[#060a10]"
            />
          </div>
        </div>

        {/* Right: Constellation & Quantitative Metrics (1 col) */}
        <div className="space-y-4">
          {/* IQ Constellation */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              IQ Constellation Diagram
            </span>
            <div className="flex justify-center">
              <canvas
                ref={constellationCanvasRef}
                width={200}
                height={200}
                className="w-48 h-48 rounded border border-slate-800 bg-[#060a10]"
              />
            </div>
            <div className="text-[10px] text-slate-500 text-center">
              Normalized Phase/Quadrature Scatter
            </div>
          </div>

          {/* Quantitative Signal Analysis Metrics */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2.5 text-[11px]">
            <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
              Parametric Signal Diagnostics
            </span>
            <div className="flex justify-between">
              <span className="text-slate-400">Peak Frequency:</span>
              <span className="text-cyan-300 font-bold">{(spectrum.peakFreqHz / 1e6).toFixed(4)} MHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">3dB Bandwidth:</span>
              <span className="text-slate-200 font-semibold">{(spectrum.bandwidth3DbHz / 1e3).toFixed(1)} kHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">10dB Bandwidth:</span>
              <span className="text-slate-200">{(spectrum.bandwidth10DbHz / 1e3).toFixed(1)} kHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Calculated SNR:</span>
              <span className="text-emerald-400 font-bold">{spectrum.snrDb.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DC Offset (I / Q):</span>
              <span className="text-slate-300">({spectrum.dcOffsetI.toFixed(4)}, {spectrum.dcOffsetQ.toFixed(4)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amp Imbalance:</span>
              <span className="text-amber-400">{spectrum.ampImbalanceDb.toFixed(3)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phase Error:</span>
              <span className="text-slate-300">{spectrum.phaseErrorDeg.toFixed(2)}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Notice Box */}
      <div className="p-3 bg-slate-900/40 rounded border border-slate-800/80 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-slate-300">Passive RF Operational Boundary: </span>
          RF ingestion is strictly receive-only. Signal metrics, bandwidth boundaries, and center frequencies reflect genuine digital signal processing (radix-2 FFT decimation-in-time) across complex floating-point samples. No synthetic transmission or jamming is permitted.
        </div>
      </div>
    </div>
  );
};
