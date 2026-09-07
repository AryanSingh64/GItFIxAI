'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  History as HistoryIcon, Clock, ArrowLeft, GitBranch,
  ExternalLink, Loader2, RefreshCw, BarChart3, CheckCircle2, AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

function MiniGauge({ score, size = 36 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 86 ? '#22c55e' :
    score >= 71 ? '#eab308' :
    score >= 51 ? '#f97316' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color, fontSize: size * 0.28 }}>
        {score}
      </span>
    </div>
  );
}

export default function HistoryPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history?limit=50');
      const data = await res.json();
      setRuns(data.runs || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const totalRuns = runs.length;
  const avgScore = totalRuns > 0
    ? Math.round(runs.reduce((sum, r) => sum + (r.score || 0), 0) / totalRuns)
    : 0;
  const totalFixed = runs.reduce((sum, r) => sum + (r.fixes_applied || 0), 0);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#050507] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <HistoryIcon className="w-6 h-6 text-violet-400" /> Analysis & CI Healing History
              </h1>
              <p className="text-secondary text-sm mt-1">
                Persistent audit trail powered by Cloud Firestore (Zero auto-pausing).
              </p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-secondary hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
              <div className="text-4xl font-bold text-white">{totalRuns}</div>
              <div className="text-secondary text-sm mt-1 flex items-center justify-center gap-1.5">
                <BarChart3 className="w-4 h-4" /> Total Remediation Runs
              </div>
            </div>
            <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
              <div className="text-4xl font-bold text-emerald-400">{avgScore}</div>
              <div className="text-secondary text-sm mt-1">Average Health Score</div>
            </div>
            <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
              <div className="text-4xl font-bold text-blue-400">{totalFixed}</div>
              <div className="text-secondary text-sm mt-1">Total Issues Remediated</div>
            </div>
          </div>

          {/* Run Cards */}
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-secondary">Loading history records...</p>
            </div>
          ) : runs.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-white/5 p-12 text-center">
              <HistoryIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No Past Runs Recorded</h3>
              <p className="text-secondary text-sm mb-6">Launch an analysis from Mission Control to create your first report.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
              >
                Go to Mission Control
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {runs.map((run, i) => (
                <div
                  key={run.id || i}
                  className="bg-surface rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <MiniGauge score={run.score || 0} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm truncate max-w-md">
                          {run.repo_url ? run.repo_url.replace('https://github.com/', '') : 'Repository Analysis'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          run.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {run.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-secondary mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {formatDate(run.created_at)}
                        </span>
                        <span>·</span>
                        <span>{run.fixes_applied || 0} fixes applied</span>
                        <span>·</span>
                        <span>Duration: {run.duration || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    {run.pr_url && (
                      <a
                        href={run.pr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Pull Request
                      </a>
                    )}
                    {run.branch_name && (
                      <span className="text-xs font-mono text-white/30 bg-white/5 px-2.5 py-1.5 rounded-lg">
                        {run.branch_name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
