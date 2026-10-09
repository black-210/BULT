/**
 * BULT — Workstation Status Bar
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React from 'react';
import { Radio, Cpu, HardDrive, ShieldCheck, Scale } from 'lucide-react';
import { Case } from '../types/bult';

interface Props {
  activeCase: Case;
}

export const StatusBar: React.FC<Props> = ({ activeCase }) => {
  return (
    <div className="bg-[#0a0e16] border-t border-slate-800 px-3 py-1 text-[11px] font-mono text-slate-400 flex items-center justify-between select-none z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Radio className="w-3.5 h-3.5" />
          <span>RF RECEIVER: PASSIVE RX-ONLY (433.920 MHz @ 2.048 MSPS)</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-800" />
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>INTEGRITY: SHA-256 SYNCED ({activeCase.evidence.length} VAULT ITEMS)</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-800" />
        <div className="flex items-center gap-1 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>DSP LOAD: 1.4% (FFT 1024-PT RADIX-2)</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-slate-500">
        <div className="flex items-center gap-1">
          <HardDrive className="w-3.5 h-3.5" />
          <span>RAM: 42.8 MB</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-800" />
        <div className="flex items-center gap-1 text-slate-400 hover:text-slate-300">
          <Scale className="w-3.5 h-3.5 text-cyan-500" />
          <span>GNU AGPL-3.0 | black-210</span>
        </div>
      </div>
    </div>
  );
};
