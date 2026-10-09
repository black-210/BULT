/**
 * BULT — Advanced Interactive Terminal Console
 * Prompt: BULT >
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import { executeCliCommand } from '../engine/bultEngine';

interface LogEntry {
  command?: string;
  output: string;
  timestamp: string;
  isError?: boolean;
}

export const TerminalConsole: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      output: [
        '===============================================================================',
        '  BULT — Elite Purple-Team, RF Intelligence & Multidisciplinary Forensics      ',
        '  Language Specification: C> (C-Greater) Systems Architecture [black-210/C-]   ',
        '  Maintainer: black-210 | License: GNU AGPL-3.0 | Target: Linux/POSIX Native    ',
        '===============================================================================',
        'Interactive Terminal Shell ready. Type "help" or run any BULT command.',
      ].join('\n'),
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleRunCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    if (trimmed === 'clear' || trimmed === 'cls') {
      setLogs([]);
      setInput('');
      return;
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeCliCommand(trimmed);

    setLogs((prev) => [
      ...prev,
      {
        command: trimmed,
        output: result,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  const handleCopyLog = () => {
    const text = logs.map((l) => (l.command ? `BULT > ${l.command}\n${l.output}` : l.output)).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleCommands = [
    'bult info',
    'bult status',
    'bult selftest',
    'bult intel spectrum analyze fixtures/iq_sample.raw',
    'bult intel fingerprint extract fixtures/iq_sample.raw',
    'bult intel locate estimate',
    'bult red audit --system',
    'bult red fuzz iq_header_parser 1000',
    'bult blue integrity',
    'bult purple coverage',
    'bult physics calculate 2400000000 1000',
    'bult chemistry analyze C8H10N4O2',
    'bult forensic report',
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0e14] font-mono text-xs select-text">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0e131d] border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wider">BULT TACTICAL CONSOLE</span>
          <span className="text-[10px] text-slate-500 font-normal">
            (POSIX Virtual Pty / C&gt; Runtime Shell)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLog}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 rounded border border-slate-700 transition-colors"
            title="Copy console transcript"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 rounded border border-slate-700 transition-colors"
            title="Clear console screen"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1018] border-b border-slate-800/60 overflow-x-auto text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-cyan-500" /> Quick:
        </span>
        {sampleCommands.slice(0, 6).map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => handleRunCommand(cmd)}
            className="px-2 py-0.5 bg-slate-900 hover:bg-cyan-950/70 hover:text-cyan-300 hover:border-cyan-700/60 text-slate-300 rounded border border-slate-800 transition-colors whitespace-nowrap"
          >
            {cmd.replace('bult ', '')}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono leading-relaxed bg-[#070b10]">
        {logs.map((log, index) => (
          <div key={index} className="space-y-1">
            {log.command && (
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <span className="text-emerald-400">BULT &gt;</span>
                <span>{log.command}</span>
                <span className="text-[10px] text-slate-600 ml-auto font-normal">{log.timestamp}</span>
              </div>
            )}
            <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[11px] bg-[#0c121c]/40 p-2.5 rounded border border-slate-800/50">
              {log.output}
            </pre>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command Input Field */}
      <div className="p-3 bg-[#0d121b] border-t border-slate-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold text-sm tracking-wider">BULT &gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter BULT command (e.g. 'bult intel spectrum analyze' or 'bult help')..."
          className="flex-1 bg-[#080c12] text-slate-100 placeholder-slate-600 px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-cyan-500 text-xs font-mono"
          autoFocus
        />
        <button
          onClick={() => handleRunCommand(input)}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-1 transition-colors text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Execute</span>
        </button>
      </div>
    </div>
  );
};
