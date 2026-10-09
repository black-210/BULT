/**
 * BULT — Elite Purple-Team, RF Intelligence & Multidisciplinary Forensics System
 * Desktop Workstation Interface & Interactive Systems Core
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState } from 'react';
import { WorkstationHeader } from './components/WorkstationHeader';
import { StatusBar } from './components/StatusBar';
import { TerminalConsole } from './components/TerminalConsole';
import { RfSpectrumWorkspace } from './components/workspaces/RfSpectrumWorkspace';
import { RfDnaWorkspace } from './components/workspaces/RfDnaWorkspace';
import { DirectionFindingWorkspace } from './components/workspaces/DirectionFindingWorkspace';
import { RedTeamWorkspace } from './components/workspaces/RedTeamWorkspace';
import { BlueTeamWorkspace } from './components/workspaces/BlueTeamWorkspace';
import { PurpleTeamWorkspace } from './components/workspaces/PurpleTeamWorkspace';
import { PhysicsWorkspace } from './components/workspaces/PhysicsWorkspace';
import { ChemistryWorkspace } from './components/workspaces/ChemistryWorkspace';
import { ForensicsWorkspace } from './components/workspaces/ForensicsWorkspace';
import { RepositoryWorkspace } from './components/workspaces/RepositoryWorkspace';
import { getActiveCase } from './engine/bultEngine';
import JSZip from 'jszip';

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<string>('rf');
  const [showBottomTerminal, setShowBottomTerminal] = useState<boolean>(false);
  const [activeCase] = useState(() => getActiveCase());

  const handleExportRepo = async () => {
    const zip = new JSZip();
    zip.file('README.md', '# BULT — Elite Purple-Team, RF Intelligence & Multidisciplinary Forensics System\n\nTarget Repository: https://github.com/black-210/BULT\nLanguage: C> (https://github.com/black-210/C-)\nMaintainer: black-210\nLicense: GNU AGPL-3.0\n');
    zip.file('LICENSE', 'GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007\n\nCopyright (C) 2026 black-210\n');
    zip.file('NOTICE', 'BULT (C) 2026 black-210\nTarget Specification: https://github.com/black-210/C-\nLicense: GNU AGPL-3.0\n');
    zip.file('Makefile', 'all:\n\t@echo "Build BULT with make or cmake"\n');
    zip.file('CMakeLists.txt', 'cmake_minimum_required(VERSION 3.16)\nproject(BULT VERSION 1.0.0 LANGUAGES C)\n');

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BULT-main-repository.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'rf':
        return <RfSpectrumWorkspace />;
      case 'rfdna':
        return <RfDnaWorkspace />;
      case 'df':
        return <DirectionFindingWorkspace />;
      case 'red':
        return <RedTeamWorkspace />;
      case 'blue':
        return <BlueTeamWorkspace />;
      case 'purple':
        return <PurpleTeamWorkspace />;
      case 'physics':
        return <PhysicsWorkspace />;
      case 'chemistry':
        return <ChemistryWorkspace />;
      case 'forensics':
        return <ForensicsWorkspace />;
      case 'terminal':
        return <TerminalConsole />;
      case 'repo':
        return <RepositoryWorkspace />;
      default:
        return <RfSpectrumWorkspace />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070b10] text-slate-100 font-sans">
      {/* Desktop OS Title Bar and Menubar */}
      <WorkstationHeader
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        activeCase={activeCase}
        onExportRepo={handleExportRepo}
      />

      {/* Main Workspace Display */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-hidden">
          {renderWorkspace()}
        </div>

        {/* Optional Collapsible Bottom Terminal Tray (when not already on terminal workspace) */}
        {showBottomTerminal && activeWorkspace !== 'terminal' && (
          <div className="h-64 border-t-2 border-slate-700 bg-[#070b10] shadow-2xl relative z-20">
            <div className="flex justify-between items-center px-3 py-1 bg-[#0d121c] border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">EMBEDDED QUICK CONSOLE (BULT &gt;)</span>
              <button
                onClick={() => setShowBottomTerminal(false)}
                className="hover:text-rose-400 text-slate-400 font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="h-[calc(100%-24px)]">
              <TerminalConsole />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar with Toggle Tray */}
      <div className="relative">
        <StatusBar activeCase={activeCase} />
        {activeWorkspace !== 'terminal' && (
          <button
            onClick={() => setShowBottomTerminal(!showBottomTerminal)}
            className="absolute right-64 bottom-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded border border-slate-700 z-30 transition-colors"
          >
            {showBottomTerminal ? 'Hide Console ▾' : 'Show Console ▴'}
          </button>
        )}
      </div>
    </div>
  );
}
