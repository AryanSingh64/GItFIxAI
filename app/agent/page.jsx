'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentStream } from '@/hooks/useAgentStream';
import {
  GitBranch, Search, Wrench, Upload, CheckCircle, FlaskConical,
  ArrowLeft, FileCode, ExternalLink, Clock, Shield,
  Zap, ChevronDown, ChevronRight, Volume2, VolumeX,
  Languages, Loader2
} from 'lucide-react';
import { IconBrain, IconZap } from '@/components/AnimatedIcons';
import ProtectedRoute from '@/components/ProtectedRoute';

const PIPELINE = [
  { key: 'CLONE', label: 'Clone', icon: GitBranch },
  { key: 'SCAN', label: 'Scan', icon: Search },
  { key: 'FIX', label: 'Fix', icon: Wrench },
  { key: 'TEST', label: 'Test', icon: FlaskConical },
  { key: 'PUSH', label: 'Push', icon: Upload },
  { key: 'DONE', label: 'Done', icon: CheckCircle },
];

function ScoreGauge({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let raf;
    let start = null;
    const duration = 2000;
    const to = score;

    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(to * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const color =
    animatedScore >= 96 ? '#a855f7' :
    animatedScore >= 86 ? '#22c55e' :
    animatedScore >= 71 ? '#eab308' :
    animatedScore >= 51 ? '#f97316' : '#ef4444';

  const label =
    animatedScore >= 96 ? '💎 Perfect' :
    animatedScore >= 86 ? 'Excellent' :
    animatedScore >= 71 ? 'Good' :
    animatedScore >= 51 ? 'Needs Work' : 'Critical';

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.3s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tabular-nums" style={{ color }}>{animatedScore}</span>
        <span className="text-xs text-secondary uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
}

function PipelineProgress({ stages }) {
  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-6 mb-6">
      <h3 className="text-sm font-semibold text-secondary mb-5 uppercase tracking-wider">Pipeline Progress</h3>
      <div className="flex items-center">
        {PIPELINE.map((stage, i) => {
          const status = stages[stage.key] || 'pending';
          const Icon = stage.icon;
          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  status === 'done' ? 'border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-400/20' :
                  status === 'active' ? 'border-violet-400 bg-violet-400/20 animate-pulse shadow-lg shadow-violet-400/20' :
                  status === 'error' ? 'border-red-400 bg-red-400/20' : 'border-white/10 bg-white/5'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    status === 'done' ? 'text-emerald-400' :
                    status === 'active' ? 'text-violet-400' :
                    status === 'error' ? 'text-red-400' : 'text-white/20'
                  }`} />
                </div>
                <span className={`text-xs font-medium ${
                  status === 'done' ? 'text-emerald-400' :
                  status === 'active' ? 'text-violet-400' : 'text-white/30'
                }`}>{stage.label}</span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${
                  status === 'done' ? 'bg-emerald-400' : 'bg-white/10'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function DiffCard({ diff, index }) {
  const [open, setOpen] = useState(index < 3);
  return (
    <div className="bg-surface rounded-xl border border-white/5 overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        {open ? <ChevronDown className="w-4 h-4 text-secondary" /> : <ChevronRight className="w-4 h-4 text-secondary" />}
        <FileCode className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="text-sm font-mono text-white/80 truncate">{diff.file}</span>
        <span className="text-xs text-white/30 ml-auto shrink-0">L{diff.line}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
          diff.method === 'ai' ? 'bg-violet-500/20 text-violet-300' : 'bg-blue-500/20 text-blue-300'
        }`}>
          {diff.method === 'ai' ? 'AI Auto-Healed' : 'Heuristic'}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3">
          <p className="text-xs text-secondary mb-2">{diff.message}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <div className="text-xs text-red-400 mb-1 font-semibold">— Before</div>
              <code className="text-xs text-red-300/80 block overflow-x-auto whitespace-pre font-mono">{diff.before || '(empty)'}</code>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <div className="text-xs text-emerald-400 mb-1 font-semibold">+ After</div>
              <code className="text-xs text-emerald-300/80 block overflow-x-auto whitespace-pre font-mono">{diff.after || '(empty)'}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsPanel({ result, prUrl }) {
  if (!result) return null;
  const s = result.summary || {};
  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-6 mb-6">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <ScoreGauge score={result.score || 0} />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              s.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>{s.status}</span>
            <span className="text-sm text-secondary">Autonomous CI/CD Healing Complete</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-3 bg-white/5 text-center">
              <div className="text-xl font-bold text-white">{s.totalFailures || 0}</div>
              <div className="text-xs text-secondary mt-0.5">Issues Found</div>
            </div>
            <div className="rounded-xl p-3 bg-white/5 text-center">
              <div className="text-xl font-bold text-emerald-400">{s.fixesApplied || 0}</div>
              <div className="text-xs text-secondary mt-0.5">Remediated</div>
            </div>
            <div className="rounded-xl p-3 bg-white/5 text-center">
              <div className="text-xl font-bold text-amber-400">{s.remainingIssues || 0}</div>
              <div className="text-xs text-secondary mt-0.5">Remaining</div>
            </div>
            <div className="rounded-xl p-3 bg-white/5 text-center">
              <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />{s.duration}
              </div>
              <div className="text-xs text-secondary mt-0.5">Duration</div>
            </div>
          </div>

          {(prUrl || s.prUrl) && (
            <a
              href={prUrl || s.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all cursor-pointer shadow-lg shadow-violet-600/20"
            >
              <ExternalLink className="w-5 h-5" />
              View Pull Request on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgentPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState(null);
  const [started, setStarted] = useState(false);
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

  const isRunning = !result;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050507] text-white">
        {/* Header */}
        <div className="border-b border-white/5 bg-[#0c0c10]/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-secondary hover:text-white transition-colors cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Mission Control
            </button>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <h1 className="text-base font-bold">Autonomous Remediation Stream</h1>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-secondary" />
              {isRunning ? (
                <span className="flex items-center gap-1.5 text-violet-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" /> Running
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">Complete</span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Pipeline Progress */}
          <PipelineProgress stages={stages} />

          {/* Results Panel when complete */}
          <ResultsPanel result={result} prUrl={prUrl} />

          {/* Logs and Code Diffs Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Logs */}
            <div className="bg-surface rounded-2xl border border-white/5 flex flex-col h-[500px]">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-violet-400 animate-pulse' : 'bg-emerald-400'}`} />
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">Live Agent Telemetry</h3>
                <span className="text-xs text-white/20 ml-auto">{logs.length} entries</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-xs scrollbar-thin">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-secondary shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === 'ERROR' ? 'text-red-400' :
                      log.type === 'SUCCESS' ? 'text-emerald-400' :
                      log.type === 'ACTION' ? 'text-blue-400' :
                      log.type === 'WARNING' ? 'text-amber-400' : 'text-gray-300'
                    }>{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Diffs Panel */}
            <div className="bg-surface rounded-2xl border border-white/5 flex flex-col h-[500px]">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">Verified Code Fixes</h3>
                <span className="text-xs text-white/20 ml-auto">{diffs.length} fixes</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                {diffs.length === 0 ? (
                  <div className="text-center text-white/20 py-20">
                    {isRunning ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm">Agent inspecting code and preparing verified diffs...</p>
                      </div>
                    ) : (
                      <p className="text-sm">No code changes required</p>
                    )}
                  </div>
                ) : (
                  diffs.map((diff, i) => <DiffCard key={i} diff={diff} index={i} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
