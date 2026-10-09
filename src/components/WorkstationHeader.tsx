/**
 * BULT — Workstation Window Header & Menu Bar
 * Tactical Desktop OS Theme
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { 
  Radio, Shield, ShieldAlert, Crosshair, Cpu, 
  Terminal, FolderGit2, FileText, FlaskConical, Atom, 
  Settings, CheckCircle2, Download
} from 'lucide-react';
import { Case } from '../types/bult';

interface Props {
  activeWorkspace: string;
  onSelectWorkspace: (ws: string) => void;
  activeCase: Case;
  onExportRepo: () => void;
}

export const WorkstationHeader: React.FC<Props> = ({
  activeWorkspace,
  onSelectWorkspace,
  activeCase,
  onExportRepo,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'Active Case Status', action: () => onSelectWorkspace('forensics') },
        { label: 'Download GitHub Repository (.zip)', action: onExportRepo },
        { label: 'Export Case Markdown Report', action: () => onSelectWorkspace('forensics') },
      ],
    },
    {
      id: 'intel',
      label: 'RF Intel',
      items: [
        { label: 'Spectrum Analyzer & Waterfall', action: () => onSelectWorkspace('rf') },
        { label: 'RF-DNA Fingerprint Analysis', action: () => onSelectWorkspace('rfdna') },
        { label: 'Direction Finding & TDoA', action: () => onSelectWorkspace('df') },
      ],
    },
    {
      id: 'security',
      label: 'Security',
      items: [
        { label: 'Red Team: Static Code Audit & Fuzzer', action: () => onSelectWorkspace('red') },
        { label: 'Blue Team: Integrity & Event Detections', action: () => onSelectWorkspace('blue') },
        { label: 'Purple Team: Correlation & Coverage', action: () => onSelectWorkspace('purple') },
      ],
    },
    {
      id: 'science',
      label: 'Science',
      items: [
        { label: 'Physical & EM Analysis', action: () => onSelectWorkspace('physics') },
        { label: 'Chemical Forensics & Spectroscopy', action: () => onSelectWorkspace('chemistry') },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { label: 'Interactive Terminal Shell (BULT >)', action: () => onSelectWorkspace('terminal') },
        { label: 'Native C> Source Repository Tree', action: () => onSelectWorkspace('repo') },
      ],
    },
  ];

  return (
    <div className="bg-[#0f141c] border-b border-slate-800 text-xs select-none">
      {/* OS Window Frame Titlebar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#090d14] border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          {/* Native Window Controls */}
          <div className="flex space-x-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 cursor-pointer" title="Close" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer" title="Minimize" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer" title="Maximize" />
          </div>
          <span className="font-mono font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            BULT
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono text-[11px]">
            Desktop Intelligence Workstation v1.0.0
          </span>
          <span className="text-slate-600 font-mono text-[10px] hidden md:inline">
            [Target: C&gt; Language (black-210/C-)]
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <div className="flex items-center text-slate-400 gap-1">
            <span className="text-slate-500">Case:</span>
            <span className="text-amber-400 font-semibold">{activeCase.id}</span>
          </div>
          <div className="flex items-center text-emerald-400 gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Rx-Only Armed</span>
          </div>
          <button
            onClick={onExportRepo}
            className="flex items-center gap-1 px-2.5 py-0.5 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 rounded transition-colors"
            title="Download complete native C> repository archive"
          >
            <Download className="w-3 h-3" />
            <span>GitHub Repo .zip</span>
          </button>
        </div>
      </div>

      {/* Desktop Menu Bar */}
      <div className="flex items-center px-2 py-1 bg-[#121824] border-b border-slate-800 relative z-30">
        <div className="flex items-center space-x-1">
          {menus.map((m) => (
            <div key={m.id} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === m.id ? null : m.id)}
                className={`px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors ${
                  activeMenu === m.id ? 'bg-slate-800 text-white' : ''
                }`}
              >
                {m.label}
              </button>
              {activeMenu === m.id && (
                <div 
                  className="absolute left-0 top-full mt-1 w-64 bg-[#141b27] border border-slate-700 rounded shadow-2xl py-1 z-50 text-slate-200"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {m.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-cyan-950/60 hover:text-cyan-300 text-[11px] font-mono transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-3 w-[1px] bg-slate-700 mx-2" />

        {/* Quick Workspace Switcher Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          {[
            { id: 'rf', label: 'RF Spectrum & Waterfall', icon: Radio },
            { id: 'rfdna', label: 'RF-DNA Fingerprint', icon: Cpu },
            { id: 'df', label: 'Direction Finding', icon: Crosshair },
            { id: 'red', label: 'Red Team', icon: ShieldAlert },
            { id: 'blue', label: 'Blue Team', icon: Shield },
            { id: 'purple', label: 'Purple Team', icon: CheckCircle2 },
            { id: 'physics', label: 'Physics & EM', icon: Atom },
            { id: 'chemistry', label: 'Chemistry & Spectra', icon: FlaskConical },
            { id: 'forensics', label: 'Case Vault', icon: FileText },
            { id: 'terminal', label: 'BULT > Terminal', icon: Terminal },
            { id: 'repo', label: 'C> Source Tree', icon: FolderGit2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeWorkspace === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectWorkspace(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
