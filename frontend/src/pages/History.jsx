import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import {
    History as HistoryIcon, Clock, ArrowLeft, GitBranch,
    ExternalLink, Loader2, RefreshCw, BarChart3
} from 'lucide-react';

function MiniGauge({ score, size = 36 }) {
    const radius = (size - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const color =
        score >= 86 ? '#22c55e' :
            score >= 71 ? '#eab308' :
                score >= 51 ? '#f97316' :
                    '#ef4444';

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset} />
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
    const navigate = useNavigate();

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const API_URL = getApiUrl();
            const res = await fetch(`${API_URL}/history?limit=50`);
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

    // Aggregate stats
    const totalRuns = runs.length;
    const avgScore = totalRuns > 0
        ? Math.round(runs.reduce((sum, r) => sum + (r.score || 0), 0) / totalRuns)
        : 0;
    const totalFixed = runs.reduce((sum, r) => sum + (r.fixes_applied || 0), 0);

    return (
        <div className="min-h-screen bg-background text-white">
            <div className="border-b border-white/5 bg-surface/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-secondary hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="w-5 h-5 text-violet-400" />
                        <h1 className="text-lg font-bold">Run History</h1>
                    </div>
                    <button onClick={fetchHistory} disabled={loading}
                        className="flex items-center gap-1.5 text-secondary hover:text-white text-sm cursor-pointer">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
                        <div className="text-4xl font-bold text-white">{totalRuns}</div>
                        <div className="text-secondary text-sm mt-1 flex items-center justify-center gap-1.5">
                            <BarChart3 className="w-4 h-4" />Total Runs
                        </div>
                    </div>
                    <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
                        <div className="text-4xl font-bold text-emerald-400">{avgScore}%</div>
                        <div className="text-secondary text-sm mt-1">Average Score</div>
                    </div>
                    <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
                        <div className="text-4xl font-bold text-violet-400">{totalFixed}</div>
                        <div className="text-secondary text-sm mt-1">Total Issues Fixed</div>
                    </div>
                </div>

                {/* History Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                ) : runs.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[.02]">
                        <HistoryIcon className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">No History Yet</h3>
                        <p className="text-secondary text-sm">
                            Run an analysis and it will appear here.
                            {' '}
                            <span className="text-white/30">(Requires Supabase DB configuration)</span>
                        </p>
                    </div>
                ) : (
                    <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-secondary border-b border-white/5 bg-white/[.02]">
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Repository</th>
                                        <th className="px-4 py-3 font-medium">Score</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Fixed</th>
                                        <th className="px-4 py-3 font-medium">Duration</th>
                                        <th className="px-4 py-3 font-medium">PR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {runs.map((run, i) => {
                                        const repoName = run.repo_url
                                            ? run.repo_url.replace('https://github.com/', '').replace('.git', '')
                                            : 'Unknown';

                                        return (
                                            <tr key={run.id || i}
                                                className="border-b border-white/5 last:border-0 hover:bg-white/[.02] transition-colors">
                                                <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    {formatDate(run.created_at)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <a href={run.repo_url} target="_blank" rel="noopener noreferrer"
                                                        className="text-violet-300 hover:text-violet-200 transition-colors font-mono text-xs flex items-center gap-1 truncate max-w-[200px]">
                                                        <GitBranch className="w-3 h-3 flex-shrink-0" />
                                                        {repoName}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <MiniGauge score={run.score || 0} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${run.status === 'PASSED'
                                                            ? 'bg-emerald-500/20 text-emerald-300'
                                                            : 'bg-amber-500/20 text-amber-300'
                                                        }`}>
                                                        {run.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-white/60">
                                                    {run.fixes_applied}/{run.total_failures}
                                                </td>
                                                <td className="px-4 py-3 text-white/40 text-xs">{run.duration}</td>
                                                <td className="px-4 py-3">
                                                    {run.pr_url ? (
                                                        <a href={run.pr_url} target="_blank" rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 cursor-pointer">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-white/10">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
