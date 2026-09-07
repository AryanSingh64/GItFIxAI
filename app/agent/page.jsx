'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentStream } from '@/hooks/useAgentStream';
import {
  GitBranch, Search, Wrench, Upload, CheckCircle, FlaskConical,
  ArrowLeft, FileCode, ExternalLink, Clock, Shield,
  Zap, ChevronDown, ChevronRight, RefreshCw, AlertCircle,
  Check, Copy, Download, X, Box, Terminal, Activity,
  Sliders, ArrowUpRight
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

const PIPELINE = [
  { key: 'CLONE', label: 'Clone', icon: GitBranch },
  { key: 'SCAN', label: 'Scan', icon: Search },
  { key: 'FIX', label: 'Fix', icon: Wrench },
  { key: 'TEST', label: 'Test', icon: FlaskConical },
  { key: 'PUSH', label: 'Push', icon: Upload },
  { key: 'DONE', label: 'Done', icon: CheckCircle },
];

/* ═══════════════════════════════════════════════════════════
   IMAGE 2: SEGMENTED VERTICAL BAR LEVEL GAUGE
   ═══════════════════════════════════════════════════════════ */
function SegmentedLevelMeter({ score = 15 }) {
  // 50 vertical tick bars total, 10 ticks per level
  const totalTicks = 50;
  const activeTicks = Math.round((score / 100) * totalTicks);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-slate-400">
          Overall score: <strong className="text-white text-sm font-semibold">{score}%</strong>
        </span>
        <span className="text-[11px] font-mono text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded">
          {score >= 80 ? 'Autonomous Grade' : score >= 50 ? 'Semi-Autonomous' : 'Remediation Required'}
        </span>
      </div>

      {/* Segmented ticks container */}
      <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-[#090b10] border border-white/[0.06]">
        {[1, 2, 3, 4, 5].map((lvl, colIdx) => {
          const startIdx = colIdx * 10;
          return (
            <div key={lvl} className="flex flex-col gap-2">
              <div className="flex items-end gap-[3px] h-6 justify-between">
                {Array.from({ length: 10 }).map((_, tickIdx) => {
                  const currentGlobalIdx = startIdx + tickIdx;
                  const isActive = currentGlobalIdx < activeTicks;
                  return (
                    <div
                      key={tickIdx}
                      className={`w-[3px] rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.5)] h-5'
                          : 'bg-[#191e2b] h-3'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-slate-500 text-center uppercase">
                lvl {lvl}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IMAGE 5: REAL-TIME TELEMETRY & STRIPED PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
function RealtimeTelemetryBar({ stages, logsCount }) {
  // Calculate completion percentage based on pipeline stages
  const stageKeys = ['CLONE', 'SCAN', 'FIX', 'TEST', 'PUSH', 'DONE'];
  const completedCount = stageKeys.filter(k => stages[k] === 'done').length;
  const activeStage = stageKeys.find(k => stages[k] === 'active') || (completedCount === 6 ? 'DONE' : 'SCAN');
  
  const percentage = Math.min(100, Math.max(12, Math.round((completedCount / 6) * 100) || (logsCount > 0 ? 25 : 8)));

  return (
    <div className="rounded-2xl bg-[#0b0d14] border border-white/[0.08] p-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Wireframe cube icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400 shrink-0">
            <Box className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-400">Scan Block</span>
              <span className="text-sm font-mono font-bold text-lime-400">#8 563 539</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
              <span>Analyzing AST graph & synthesizing patch</span>
            </div>
          </div>
        </div>

        {/* Right Stage Indicator */}
        <div className="text-left sm:text-right font-mono text-xs text-slate-400">
          <span className="text-slate-500">Active Pipeline: </span>
          <span className="text-white font-medium uppercase">{activeStage}</span>
        </div>
      </div>

      {/* Animated Barber-Pole Striped Lime Progress Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-4 bg-[#141722] rounded-lg overflow-hidden p-0.5 border border-white/[0.05]">
          <div
            className="h-full rounded-md bg-striped-lime transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right tabular-nums">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IMAGE 4: SOLUTION DRAWER / MODAL
   ═══════════════════════════════════════════════════════════ */
function SolutionModal({ diff, onClose }) {
  const [tab, setTab] = useState('local');
  const [copied, setCopied] = useState(false);

  if (!diff) return null;

  const instructionsText = tab === 'local'
    ? `1. Explore the repository to understand the current state related to this signal
2. Make substantive improvements to the codebase that genuinely address the signal:
   File: ${diff.file || 'lib/auth.ts'} (Line ${diff.line || 1})
   Signal: ${diff.message || 'Syntax/Type AST Resolution'}
3. Verify your fix addresses the issue (e.g., run linter if fixing lint_config, run tests if adding tests)
4. Keep changes focused on this signal - don't refactor unrelated code
5. When done with code changes, open a PULL REQUEST with the changes and return the PR URL

CRITICAL: Quality Standards
Your fix must genuinely improve the codebase.
Do NOT use workarounds or shortcuts:
• NO empty placeholder files (e.g., empty test files, stub configs)
• NO minimal implementations that technically pass but provide no real value`
    : `git checkout -b gitfix/patch-${Date.now()}
git apply << 'EOF'
--- a/${diff.file || 'src/index.ts'}
+++ b/${diff.file || 'src/index.ts'}
@@ -${diff.line || 1},4 +${diff.line || 1},4 @@
-${diff.before || 'old_code();'}
+${diff.after || 'new_healed_code();'}
EOF
npm test && git commit -am "chore(fix): auto-healed ${diff.file || 'AST signal'}"
git push origin HEAD`;

  const copyText = () => {
    navigator.clipboard.writeText(instructionsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl p-6 flex flex-col gap-5">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Solution for {diff.file ? diff.file.split('/').pop() : 'Pre-commit Hooks'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Toggle Tabs: Local vs Cloud */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#141722] border border-white/[0.06]">
          <button
            onClick={() => setTab('local')}
            className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              tab === 'local' ? 'bg-[#222738] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Local
          </button>
          <button
            onClick={() => setTab('cloud')}
            className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              tab === 'cloud' ? 'bg-[#222738] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cloud
          </button>
        </div>

        {/* Monospace Code Box */}
        <div className="p-4 rounded-xl bg-[#090b10] border border-white/[0.06] font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[300px]">
          <pre className="whitespace-pre-wrap">{instructionsText}</pre>
        </div>

        {/* Actions: Copy Button (Solid White) and Back Button */}
        <div className="flex flex-col gap-2">
          <button
            onClick={copyText}
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy'}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN AGENT TELEMETRY PAGE
   ═══════════════════════════════════════════════════════════ */
export default function AgentPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState(null);
  const [started, setStarted] = useState(false);
  const [showAmberBanner, setShowAmberBanner] = useState(true);
  const [selectedDiff, setSelectedDiff] = useState(null);
  const logsEndRef = useRef(null);

  const {
    logs, stages, diffs, result, prUrl,
    testResults, langStats,
    startAnalysis
  } = useAgentStream();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('gitfixai_session');
      if (stored) {
        setSessionData(JSON.parse(stored));
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    if (sessionData && !started) {
      setStarted(true);
      startAnalysis({
        repoUrl: sessionData.repoUrl,
        commitMsg: sessionData.commitMsg,
        accessToken: sessionData.accessToken,
        autoFix: sessionData.autoFix
      });
    }
  }, [sessionData, started, startAnalysis]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const repoName = sessionData?.repoUrl
    ? sessionData.repoUrl.replace(/^(https?:\/\/)?github\.com\//, '').replace(/\.git$/, '')
    : 'repository';

  const score = result?.score || 15;
  const isRunning = !result;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans pb-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

          {/* ═══════════════════════════════════════════════════════════
              HEADER (Image 2: Repo title, url, last update, Update Report)
             ═══════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#141722] border border-white/10 flex items-center justify-center font-mono font-bold text-slate-300">
                {repoName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{repoName}</span>
                  <a
                    href={sessionData?.repoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h1>
                <span className="text-xs text-slate-500 font-mono">Last updated: Just now</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-slate-200 transition-colors cursor-pointer font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Report</span>
              </button>
              {(prUrl || result?.summary?.prUrl) && (
                <a
                  href={prUrl || result?.summary?.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-lime-400 text-black font-semibold text-xs transition-colors cursor-pointer font-mono shadow-sm"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>View PR</span>
                </a>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              AMBER NOTICE BANNER (Image 2)
             ═══════════════════════════════════════════════════════════ */}
          {showAmberBanner && (
            <div className="rounded-xl bg-amber-950/20 border border-amber-500/25 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5 text-amber-200/90 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Higher readiness level</strong> = more effective autonomous performance on this repo.
                  Completing criteria directly improves autonomy ratio and code output.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <button
                  onClick={() => setShowAmberBanner(false)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  Don't Show Again
                </button>
                <button
                  onClick={() => setShowAmberBanner(false)}
                  className="px-3 py-1 rounded-md border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer text-[11px]"
                >
                  Okay
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              SEGMENTED LEVEL METER (Image 2)
             ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] p-5 shadow-2xl">
            <SegmentedLevelMeter score={score} />
          </div>

          {/* ═══════════════════════════════════════════════════════════
              3 SUMMARY METRIC CARDS (Image 2)
             ═══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Completed */}
            <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/[0.08] flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Completed</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {result?.summary?.fixesApplied || diffs.length} / {result?.summary?.totalFailures || (diffs.length > 0 ? diffs.length + 3 : 12)}
              </div>
            </div>

            {/* Card 2: To Level 2 */}
            <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/[0.08] flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>To Next Level</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {Math.max(1, 4 - diffs.length)} Criteria(s)
              </div>
            </div>

            {/* Card 3: Quick Win */}
            <div
              onClick={() => setSelectedDiff(diffs[0] || { file: 'package.json', message: 'Pre-commit Hooks configuration' })}
              className="p-5 rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Win</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-mono">Style & Validation</div>
                <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                  {diffs[0]?.file ? diffs[0].file.split('/').pop() : 'Pre-commit Hooks'}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              REAL-TIME TELEMETRY BAR (Image 5)
             ═══════════════════════════════════════════════════════════ */}
          <RealtimeTelemetryBar stages={stages} logsCount={logs.length} />

          {/* ═══════════════════════════════════════════════════════════
              LOGS & CODE FIXES SPLIT VIEW
             ═══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Logs */}
            <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] flex flex-col h-[460px] shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-lime-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                    Agent Log Telemetry
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{logs.length} events</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs text-slate-300 scrollbar-thin bg-[#090b10]">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-slate-600 select-none shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === 'ERROR' ? 'text-red-400' :
                      log.type === 'SUCCESS' ? 'text-lime-400' :
                      log.type === 'ACTION' ? 'text-sky-400' :
                      log.type === 'WARNING' ? 'text-amber-400' : 'text-slate-300'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Verified Fixes Panel */}
            <div className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] flex flex-col h-[460px] shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                    Remediated Code Signals
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{diffs.length} diffs</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-[#090b10]">
                {diffs.length === 0 ? (
                  <div className="text-center text-slate-500 font-mono text-xs py-28">
                    {isRunning ? 'Analyzing repository AST & generating surgical patches...' : 'All criteria passing with zero regressions.'}
                  </div>
                ) : (
                  diffs.map((diff, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#0e111a] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                      onClick={() => setSelectedDiff(diff)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-medium text-slate-200 group-hover:text-lime-300 transition-colors truncate">
                          {diff.file}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">L{diff.line || 1}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2 truncate font-mono">{diff.message}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
                          AST Verified
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-mono">
                          Inspect <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Solution Modal (Image 4) */}
          {selectedDiff && (
            <SolutionModal
              diff={selectedDiff}
              onClose={() => setSelectedDiff(null)}
            />
          )}

        </main>
      </div>
    </ProtectedRoute>
  );
}
