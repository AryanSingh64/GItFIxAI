import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAgentSocket } from '../hooks/useAgentSocket';
import {
    GitBranch, Search, Wrench, Upload, CheckCircle,
    ArrowLeft, FileCode, ExternalLink, Clock, Shield,
    Zap, AlertTriangle, ChevronDown, ChevronRight
} from 'lucide-react';

const PIPELINE = [
    { key: 'CLONE', label: 'Clone', icon: GitBranch },
    { key: 'SCAN', label: 'Scan', icon: Search },
    { key: 'FIX', label: 'Fix', icon: Wrench },
    { key: 'PUSH', label: 'Push', icon: Upload },
    { key: 'DONE', label: 'Done', icon: CheckCircle },
];

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
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${status === 'done' ? 'border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-400/20' :
                                    status === 'active' ? 'border-violet-400 bg-violet-400/20 animate-pulse shadow-lg shadow-violet-400/20' :
                                        status === 'error' ? 'border-red-400 bg-red-400/20' :
                                            'border-white/10 bg-white/5'
                                    }`}>
                                    <Icon className={`w-5 h-5 ${status === 'done' ? 'text-emerald-400' :
                                        status === 'active' ? 'text-violet-400' :
                                            status === 'error' ? 'text-red-400' :
                                                'text-white/20'
                                        }`} />
                                </div>
                                <span className={`text-xs font-medium ${status === 'done' ? 'text-emerald-400' :
                                    status === 'active' ? 'text-violet-400' :
                                        'text-white/30'
                                    }`}>{stage.label}</span>
                            </div>
                            {i < PIPELINE.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-3 rounded transition-all duration-500 ${status === 'done' ? 'bg-emerald-400' : 'bg-white/10'
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
                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
                {open ? <ChevronDown className="w-4 h-4 text-secondary" /> : <ChevronRight className="w-4 h-4 text-secondary" />}
                <FileCode className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-mono text-white/80 truncate">{diff.file}</span>
                <span className="text-xs text-white/30 ml-auto">L{diff.line}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${diff.method === 'ai' ? 'bg-violet-500/20 text-violet-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>{diff.method === 'ai' ? '🧠 AI' : '⚡ Auto'}</span>
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

function LogEntry({ log }) {
    const color = {
        INFO: 'text-blue-300/70',
        SUCCESS: 'text-emerald-400',
        WARNING: 'text-amber-400',
        ERROR: 'text-red-400',
        ACTION: 'text-violet-400',
    }[log.type] || 'text-white/50';

    return (
        <div className={`flex gap-3 text-sm font-mono py-0.5 ${color}`}>
            <span className="text-white/20 flex-shrink-0">[{log.time}]</span>
            <span className="break-all">{log.message}</span>
        </div>
    );
}

function ResultsPanel({ result, prUrl }) {
    if (!result) return null;
    const s = result.summary;
    const score = result.score;
    const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
    const scoreBg = score >= 80 ? 'from-emerald-500/20' : score >= 50 ? 'from-amber-500/20' : 'from-red-500/20';

    return (
        <div className="bg-surface rounded-2xl border border-white/5 p-6 mb-6">
            <h3 className="text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className={`rounded-xl p-4 bg-gradient-to-br ${scoreBg} to-transparent border border-white/5 text-center`}>
                    <div className={`text-3xl font-bold ${scoreColor}`}>{score}%</div>
                    <div className="text-xs text-secondary mt-1">Health Score</div>
                </div>
                <div className="rounded-xl p-4 bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-white">{s.totalFailures}</div>
                    <div className="text-xs text-secondary mt-1">Issues Found</div>
                </div>
                <div className="rounded-xl p-4 bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{s.fixesApplied}</div>
                    <div className="text-xs text-secondary mt-1">Fixed</div>
                </div>
                <div className="rounded-xl p-4 bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-amber-400">{s.remainingIssues}</div>
                    <div className="text-xs text-secondary mt-1">Remaining</div>
                </div>
                <div className="rounded-xl p-4 bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-white flex items-center justify-center gap-1"><Clock className="w-5 h-5" />{s.duration}</div>
                    <div className="text-xs text-secondary mt-1">Duration</div>
                </div>
            </div>

            {(prUrl || s.prUrl) && (
                <a
                    href={prUrl || s.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all cursor-pointer shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30"
                >
                    <ExternalLink className="w-5 h-5" />
                    View Pull Request on GitHub
                </a>
            )}

            {s.branchName && !prUrl && !s.prUrl && (
                <div className="text-center text-sm text-secondary mt-2">
                    Branch: <code className="text-violet-400">{s.branchName}</code>
                </div>
            )}
        </div>
    );
}


export default function AgentView() {
    const location = useLocation();
    const navigate = useNavigate();
    const { repoUrl, teamName, leaderName, accessToken } = location.state || {};

    const [started, setStarted] = useState(false);
    const { logs, stages, diffs, result, prUrl, clearAll } = useAgentSocket();
    const logsEndRef = useRef(null);

    useEffect(() => {
        if (!repoUrl) {
            navigate('/dashboard');
            return;
        }
        if (started) return;
        setStarted(true);

        clearAll();
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repo_url: repoUrl,
                team_name: teamName,
                leader_name: leaderName,
                access_token: accessToken
            })
        }).catch(e => {
            console.error(e);
            alert("Failed to connect to backend");
        });
    }, [repoUrl]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const isRunning = !result;

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Header */}
            <div className="border-b border-white/5 bg-surface/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-secondary hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-violet-400" />
                        <h1 className="text-lg font-bold">Agent Analysis</h1>
                    </div>
                    <div className="flex items-center gap-2 text-secondary text-sm">
                        <Shield className="w-4 h-4" />
                        {isRunning ? <span className="animate-pulse text-violet-400">Running...</span> : <span className="text-emerald-400">Complete</span>}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Pipeline Progress */}
                <PipelineProgress stages={stages} />

                {/* Results (shown when done) */}
                <ResultsPanel result={result} prUrl={prUrl} />

                {/* Main Content: Logs + Diffs side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Logs Panel */}
                    <div className="bg-surface rounded-2xl border border-white/5 flex flex-col" style={{ maxHeight: '500px' }}>
                        <div className="p-4 border-b border-white/5 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-violet-400 animate-pulse' : 'bg-emerald-400'}`} />
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Live Logs</h3>
                            <span className="text-xs text-white/20 ml-auto">{logs.length} entries</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-0.5 scrollbar-thin">
                            {logs.map((log, i) => <LogEntry key={i} log={log} />)}
                            <div ref={logsEndRef} />
                        </div>
                    </div>

                    {/* Diffs Panel */}
                    <div className="bg-surface rounded-2xl border border-white/5 flex flex-col" style={{ maxHeight: '500px' }}>
                        <div className="p-4 border-b border-white/5 flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-violet-400" />
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Code Changes</h3>
                            <span className="text-xs text-white/20 ml-auto">{diffs.length} fixes</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {diffs.length === 0 ? (
                                <div className="text-center text-white/20 py-12">
                                    {isRunning ? (
                                        <div className="animate-pulse">
                                            <Wrench className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-sm">Waiting for fixes...</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm">No code changes</p>
                                    )}
                                </div>
                            ) : (
                                diffs.map((diff, i) => <DiffCard key={i} diff={diff} index={i} />)
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixes Table */}
                {result && result.fixes && result.fixes.length > 0 && (
                    <div className="bg-surface rounded-2xl border border-white/5 p-6 mt-6">
                        <h3 className="text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">All Fixes ({result.fixes.length})</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-secondary border-b border-white/5">
                                        <th className="pb-3 pr-4">File</th>
                                        <th className="pb-3 pr-4">Type</th>
                                        <th className="pb-3 pr-4">Line</th>
                                        <th className="pb-3 pr-4">Agent</th>
                                        <th className="pb-3">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.fixes.map((fix, i) => (
                                        <tr key={i} className="border-b border-white/5 last:border-0">
                                            <td className="py-2 pr-4 font-mono text-xs text-violet-300">{fix.file}</td>
                                            <td className="py-2 pr-4">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${fix.type === 'SECURITY' ? 'bg-red-500/20 text-red-300' :
                                                    fix.type === 'LOGIC' ? 'bg-amber-500/20 text-amber-300' :
                                                        'bg-blue-500/20 text-blue-300'
                                                    }`}>{fix.type}</span>
                                            </td>
                                            <td className="py-2 pr-4 text-white/40">L{fix.line}</td>
                                            <td className="py-2 pr-4 text-white/60">{fix.agent}</td>
                                            <td className="py-2">
                                                <span className={`text-xs ${fix.method === 'ai' ? 'text-violet-400' : 'text-blue-400'}`}>
                                                    {fix.method === 'ai' ? '🧠 AI' : '⚡ Heuristic'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
