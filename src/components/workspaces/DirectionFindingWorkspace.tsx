/**
 * BULT — Direction Finding (DF) & Localization Uncertainty Solver
 * Stansfield Triangulation & TDoA Hyperbolic Positioning
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, MapPin, AlertCircle, ShieldAlert, CheckCircle2, BookmarkPlus } from 'lucide-react';
import { solveTriangulation, solveTdoa, addFindingToActiveCase } from '../../engine/bultEngine';
import { DfBearing, TdoaStation, LocalizationResult } from '../../types/bult';

export const DirectionFindingWorkspace: React.FC = () => {
  const [solverMode, setSolverMode] = useState<'DF' | 'TDOA'>('DF');

  const [dfBearings, setDfBearings] = useState<DfBearing[]>([
    { stationId: 'SENSOR-ALPHA', latitude: 51.5074, longitude: -0.1278, bearingDeg: 45.0, weight: 1.0 },
    { stationId: 'SENSOR-BRAVO', latitude: 51.5200, longitude: -0.1000, bearingDeg: 315.0, weight: 0.95 },
    { stationId: 'SENSOR-CHARLIE', latitude: 51.4900, longitude: -0.1100, bearingDeg: 15.0, weight: 0.85 },
  ]);

  const [tdoaStations, setTdoaStations] = useState<TdoaStation[]>([
    { stationId: 'TDOA-NODE-1', latitude: 51.5050, longitude: -0.1300, timestampSec: 0.0000000 },
    { stationId: 'TDOA-NODE-2', latitude: 51.5220, longitude: -0.0950, timestampSec: 0.0000084 },
    { stationId: 'TDOA-NODE-3', latitude: 51.4880, longitude: -0.1080, timestampSec: 0.0000121 },
  ]);

  const [locResult, setLocResult] = useState<LocalizationResult>(() => solveTriangulation(dfBearings));
  const [addedFinding, setAddedFinding] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (solverMode === 'DF') {
      setLocResult(solveTriangulation(dfBearings));
    } else {
      setLocResult(solveTdoa(tdoaStations));
    }
  }, [solverMode, dfBearings, tdoaStations]);

  // Draw 2D Sensor Geolocation Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Coordinate Grid & Range Rings
    ctx.strokeStyle = '#121d2c';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 3800; // pixels per degree approx

    // Draw Stations
    if (solverMode === 'DF') {
      dfBearings.forEach((b, idx) => {
        const x = centerX + (b.longitude - (-0.115)) * scale;
        const y = centerY - (b.latitude - 51.505) * scale;

        // Station Point
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`${b.stationId} (${b.bearingDeg}°)`, x + 8, y + 3);

        // Bearing Ray
        const rad = (b.bearingDeg * Math.PI) / 180.0;
        const rayLen = 220;
        const rayX = x + Math.sin(rad) * rayLen;
        const rayY = y - Math.cos(rad) * rayLen;

        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(rayX, rayY);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Draw Estimated Target & Covariance Ellipse
    if (locResult.sufficientData) {
      const tgtX = centerX + (locResult.estLongitude - (-0.115)) * scale;
      const tgtY = centerY - (locResult.estLatitude - 51.505) * scale;

      // 95% Covariance Error Ellipse
      ctx.save();
      ctx.translate(tgtX, tgtY);
      ctx.rotate((locResult.orientationDeg * Math.PI) / 180.0);
      ctx.strokeStyle = '#f43f5e';
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, locResult.uncertaintySemiMajorM * 0.35, locResult.uncertaintySemiMinorM * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Target Crosshair
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tgtX - 8, tgtY);
      ctx.lineTo(tgtX + 8, tgtY);
      ctx.moveTo(tgtX, tgtY - 8);
      ctx.lineTo(tgtX, tgtY + 8);
      ctx.stroke();

      ctx.fillStyle = '#fda4af';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('ESTIMATED EMITTER', tgtX + 12, tgtY - 5);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`95% Conf: +/-${locResult.uncertaintySemiMajorM.toFixed(0)}m`, tgtX + 12, tgtY + 10);
    }
  }, [solverMode, dfBearings, tdoaStations, locResult]);

  const handleRegisterFinding = () => {
    if (!locResult.sufficientData) return;
    addFindingToActiveCase({
      subsystem: 'INTEL',
      severity: 'HIGH',
      confidence: locResult.confidenceScore,
      title: `RF Emitter Geolocation Estimate: Lat ${locResult.estLatitude.toFixed(4)}, Lon ${locResult.estLongitude.toFixed(4)}`,
      description: `${locResult.notes} Semi-Major Uncertainty: ${locResult.uncertaintySemiMajorM.toFixed(1)}m.`,
      evidenceId: 'EV-001',
      remediation: 'Dispatch authorized physical validation team to localized 95% error coordinates.',
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
            <Crosshair className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Direction Finding (DF) &amp; Localization Uncertainty Engine</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                Stansfield &amp; TDoA Solvers
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Scientific multi-station triangulation with 95% confidence Gaussian error ellipses.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#070b10] rounded border border-slate-700 p-0.5">
            <button
              onClick={() => setSolverMode('DF')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                solverMode === 'DF' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              DF Triangulation
            </button>
            <button
              onClick={() => setSolverMode('TDOA')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                solverMode === 'TDOA' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hyperbolic TDoA
            </button>
          </div>

          <button
            onClick={handleRegisterFinding}
            disabled={!locResult.sufficientData}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              !locResult.sufficientData
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                : addedFinding
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{addedFinding ? 'Finding Registered!' : 'Record Case Finding'}</span>
          </button>
        </div>
      </div>

      {/* Main Map & Geolocation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas Geolocation Map (2 cols) */}
        <div className="lg:col-span-2 bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Sensor Geometry &amp; Bearing Vector Intersections
            </span>
            <span className="text-[10px] text-slate-500">True North Reference</span>
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={340}
            className="w-full h-80 rounded border border-slate-800 bg-[#060a12]"
          />
        </div>

        {/* Right: Solved Localization Estimates & Uncertainty Ellipse */}
        <div className="space-y-4">
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2.5 text-[11px]">
            <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
              Position &amp; Uncertainty Metrics
            </span>

            {locResult.sufficientData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latitude:</span>
                  <span className="text-cyan-300 font-bold">{locResult.estLatitude.toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longitude:</span>
                  <span className="text-cyan-300 font-bold">{locResult.estLongitude.toFixed(6)}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Semi-Major Error (a):</span>
                  <span className="text-rose-400 font-semibold">{locResult.uncertaintySemiMajorM.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Semi-Minor Error (b):</span>
                  <span className="text-slate-200">{locResult.uncertaintySemiMinorM.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ellipse Orientation:</span>
                  <span className="text-slate-300">{locResult.orientationDeg.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statistical Confidence:</span>
                  <span className="text-emerald-400 font-bold">{(locResult.confidenceScore * 100).toFixed(0)}%</span>
                </div>
                <div className="p-2 bg-emerald-950/20 border border-emerald-800/40 rounded text-emerald-300 text-[10px] mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Valid mathematical intersection converged.</span>
                </div>
              </>
            ) : (
              <div className="p-3 bg-rose-950/30 border border-rose-800/50 rounded text-rose-300 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Insufficient Measurement Evidence</span>
                </div>
                <div>{locResult.notes}</div>
              </div>
            )}
          </div>

          {/* Station Measurements Controls */}
          <div className="bg-[#0d1420] p-3 rounded border border-slate-800 space-y-2 text-[11px]">
            <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
              Active Sensor Measurements
            </span>
            <div className="space-y-1.5">
              {solverMode === 'DF' ? (
                dfBearings.map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#070b10] p-1.5 rounded border border-slate-800 text-[10px]">
                    <span className="text-cyan-400 font-semibold">{b.stationId}</span>
                    <span className="text-slate-300 font-mono">{b.bearingDeg.toFixed(1)}° TN</span>
                    <span className="text-slate-500 font-mono">wt: {b.weight}</span>
                  </div>
                ))
              ) : (
                tdoaStations.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#070b10] p-1.5 rounded border border-slate-800 text-[10px]">
                    <span className="text-cyan-400 font-semibold">{s.stationId}</span>
                    <span className="text-slate-300 font-mono">{(s.timestampSec * 1e6).toFixed(1)} µs</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Constraints Warning */}
      <div className="p-3 bg-slate-900/40 rounded border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
        <ShieldAlert className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-slate-200">Legal Boundary &amp; No-Tracking Mandate: </span>
          Localization solves purely geometric vector intersections for authorized receiver arrays. BULT prohibits and does not implement covert tracking of individual persons, account surveillance, or deanonymization. Where measurement inputs fail scientific criteria, the system reports an explicit <strong className="text-slate-300">INSUFFICIENT DATA</strong> condition.
        </div>
      </div>
    </div>
  );
};
