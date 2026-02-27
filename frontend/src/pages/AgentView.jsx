import React, { useEffect, useRef, useState, useMemo } from 'react';
import { getApiUrl } from '../lib/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAgentSocket } from '../hooks/useAgentSocket';
import {
    GitBranch, Search, Wrench, Upload, CheckCircle, FlaskConical,
    ArrowLeft, FileCode, ExternalLink, Clock, Shield,
    Zap, ChevronDown, ChevronRight, Volume2, VolumeX,
    TestTube2, Languages
} from 'lucide-react';
import { IconSuccess, IconBrain, IconZap } from '../components/AnimatedIcons';

// ─── Pipeline stages ────────────────────────────────────────────────
const PIPELINE = [
    { key: 'CLONE', label: 'Clone', icon: GitBranch },
    { key: 'SCAN', label: 'Scan', icon: Search },
    { key: 'FIX', label: 'Fix', icon: Wrench },
    { key: 'TEST', label: 'Test', icon: FlaskConical },
    { key: 'PUSH', label: 'Push', icon: Upload },
    { key: 'DONE', label: 'Done', icon: CheckCircle },
];

// ─── Animated Score Gauge (SVG circular) ─────────────────────────────
function ScoreGauge({ score, size = 180 }) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    useEffect(() => {
        let raf;
        let start = null;
        const duration = 2000;
        const from = 0;
        const to = score;

        const animate = (ts) => {
            if (!start) start = ts;
            const elapsed = ts - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setAnimatedScore(Math.round(from + (to - from) * eased));
            if (progress < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [score]);

    const color =
        animatedScore >= 96 ? '#a855f7' :  // purple = perfect
            animatedScore >= 86 ? '#22c55e' :   // green
                animatedScore >= 71 ? '#eab308' :   // yellow
                    animatedScore >= 51 ? '#f97316' :   // orange
                        '#ef4444';                           // red

    const label =
        animatedScore >= 96 ? '💎 Perfect' :
            animatedScore >= 86 ? 'Excellent' :
                animatedScore >= 71 ? 'Good' :
                    animatedScore >= 51 ? 'Needs Work' :
                        'Critical';

    return (
        <div className="relative flex flex-col items-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background ring */}
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                {/* Score ring */}
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.3s' }}
                />
                {/* Glowing ring */}
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth="12"
                    strokeLinecap="round" opacity="0.3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    filter="blur(8px)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tabular-nums" style={{ color }}>
                    {animatedScore}
                </span>
                <span className="text-xs text-secondary uppercase tracking-widest mt-1">{label}</span>
            </div>
        </div>
    );
}

// ─── Confetti burst ──────────────────────────────────────────────────
function useConfetti() {
    const canvasRef = useRef(null);

    const fire = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = 'block';

        const particles = [];
        const colors = ['#a855f7', '#22c55e', '#eab308', '#3b82f6', '#ef4444', '#ec4899', '#f97316'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 18 - 5,
                size: Math.random() * 8 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.3,
                life: 1,
            });
        }

        let frame;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // gravity
                p.rotation += p.rotSpeed;
                p.life -= 0.012;
                if (p.life <= 0) continue;
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }
            if (alive) frame = requestAnimationFrame(animate);
            else canvas.style.display = 'none';
        };
        frame = requestAnimationFrame(animate);
    };

    return { canvasRef, fire };
}

// ─── Sound Effects ───────────────────────────────────────────────────
function useSound() {
    const audioCtx = useRef(null);
    const [muted, setMuted] = useState(() => localStorage.getItem('agent_muted') === 'true');

    const getCtx = () => {
        if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx.current;
    };

    const playTone = (freq, duration = 0.15, type = 'sine', volume = 0.15) => {
        if (muted) return;
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch { /* ignore */ }
    };

    const playSuccess = () => {
        playTone(523, 0.15); // C5
        setTimeout(() => playTone(659, 0.15), 150); // E5
        setTimeout(() => playTone(784, 0.3), 300);  // G5
    };

    const playError = () => playTone(220, 0.4, 'square', 0.08);
    const playNotify = () => playTone(880, 0.1, 'sine', 0.1);

    const toggleMute = () => {
        const next = !muted;
        setMuted(next);
        localStorage.setItem('agent_muted', String(next));
    };

    return { playSuccess, playError, playNotify, muted, toggleMute };
}

// ─── Language Stats Chart ────────────────────────────────────────────
function LanguageChart({ langStats }) {
    if (!langStats?.languages) return null;
    const langs = Object.entries(langStats.languages).slice(0, 6);
    if (langs.length === 0) return null;

    const COLORS = {
        python: '#3572A5', javascript: '#f1e05a', typescript: '#3178c6',
        go: '#00ADD8', java: '#b07219', rust: '#dea584',
        ruby: '#701516', php: '#4F5D95', css: '#563d7c',
        html: '#e34c26', shell: '#89e051',
    };

    return (
        <div className="bg-surface rounded-2xl border border-white/5 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Languages className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">
                    Language Distribution
                </h3>
                <span className="text-xs text-white/20 ml-auto">
                    {langStats.total_files} files · {langStats.total_lines.toLocaleString()} lines
                </span>
            </div>
            {/* Stacked bar */}
            <div className="flex rounded-full overflow-hidden h-4 mb-4 bg-white/5">
                {langs.map(([lang, data]) => (
                    <div key={lang} title={`${lang}: ${data.percentage}%`}
                        style={{
                            width: `${Math.max(data.percentage, 2)}%`,
                            backgroundColor: COLORS[lang] || '#6b7280',
                        }}
                        className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {langs.map(([lang, data]) => (
                    <div key={lang} className="flex items-center gap-1.5 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: COLORS[lang] || '#6b7280' }} />
                        <span className="text-white capitalize">{lang}</span>
                        <span className="text-white/30">{data.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Test Results Panel ──────────────────────────────────────────────
function TestResultsPanel({ testResults }) {
    if (!testResults?.detected) return null;
    const s = testResults.summary;
    const allPassed = s.failed === 0 && s.total > 0;

    return (
        <div className="bg-surface rounded-2xl border border-white/5 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <TestTube2 className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">
                    Test Results
                </h3>
                {allPassed && (
                    <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        All Passing <IconSuccess size={14} />
                    </span>
                )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="rounded-xl p-3 bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-white">{s.total}</div>
                    <div className="text-xs text-secondary">Total</div>
                </div>
                <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{s.passed}</div>
                    <div className="text-xs text-secondary">Passed</div>
                </div>
                <div className={`rounded-xl p-3 border text-center ${s.failed > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
                    <div className={`text-2xl font-bold ${s.failed > 0 ? 'text-red-400' : 'text-white/30'}`}>{s.failed}</div>
                    <div className="text-xs text-secondary">Failed</div>
                </div>
                <div className="rounded-xl p-3 bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-white/30">{s.skipped}</div>
                    <div className="text-xs text-secondary">Skipped</div>
                </div>
            </div>

            {/* Framework breakdown */}
            {testResults.results?.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-t border-white/5 text-sm">
                    <span className="text-white font-medium">{r.framework}</span>
                    <span className="text-secondary text-xs capitalize">{r.language}</span>
                    <span className="ml-auto text-xs">
                        <span className="text-emerald-400">{r.passed}✓</span>
                        {r.failed > 0 && <span className="text-red-400 ml-2">{r.failed}✗</span>}
                    </span>
                </div>
            ))}

            {/* Show failures */}
            {testResults.results?.some(r => r.failures?.length > 0) && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Failing Tests</h4>
                    {testResults.results.flatMap(r => r.failures || []).slice(0, 5).map((f, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                            <div className="text-xs font-mono text-red-300 truncate">{f.test}</div>
                            {f.message && (
                                <div className="text-xs text-red-200/50 mt-1 font-mono truncate">{f.message.slice(0, 150)}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Pipeline Progress ───────────────────────────────────────────────
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
                                <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${status === 'done' ? 'bg-emerald-400' : 'bg-white/10'
                                    }`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Diff Card ───────────────────────────────────────────────────────
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
                    }`}>{diff.method === 'ai' ? <><IconBrain size={12} /> AI</> : <><IconZap size={12} /> Auto</>}</span>
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

// ─── Log Entry ───────────────────────────────────────────────────────
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

// ─── Results Panel with Animated Gauge ───────────────────────────────
function ResultsPanel({ result, prUrl }) {
    if (!result) return null;
    const s = result.summary || { totalFailures: 0, fixesApplied: 0, remainingIssues: 0, duration: '0s' };
    const score = result.score;

    return (
        <div className="bg-surface rounded-2xl border border-white/5 p-6 mb-6">
            <h3 className="text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">Results</h3>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Animated Score Gauge */}
                <div className="flex-shrink-0">
                    <ScoreGauge score={score} />
                </div>

                {/* Stats Grid */}
                <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
                            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                                <Clock className="w-5 h-5" />{s.duration}
                            </div>
                            <div className="text-xs text-secondary mt-1">Duration</div>
                        </div>
                    </div>

                    {(prUrl || s.prUrl) && (
                        <a href={prUrl || s.prUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all cursor-pointer shadow-lg shadow-violet-600/20">
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
            </div>
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function AgentView() {
    const location = useLocation();
    const navigate = useNavigate();
    const { repoUrl, commitMsg, autoFix, accessToken } = location.state || {};

    const [started, setStarted] = useState(false);
    const {
        logs, stages, diffs, result, prUrl,
        testResults, langStats,
        clearAll, isConnected, startConnection,
        sessionId
    } = useAgentSocket();
    const logsEndRef = useRef(null);

    const { canvasRef, fire: fireConfetti } = useConfetti();
    const { playSuccess, playNotify, muted, toggleMute } = useSound();
    const confettiFired = useRef(false);

    // Fire confetti + sound on completion
    useEffect(() => {
        if (result && !confettiFired.current) {
            confettiFired.current = true;
            if (result.score >= 80) {
                fireConfetti();
                playSuccess();
            } else {
                playNotify();
            }
        }
    }, [result]);

    useEffect(() => {
        if (!repoUrl) {
            navigate('/dashboard');
            return;
        }
        if (started) return;
        setStarted(true);

        clearAll();

        const API_URL = getApiUrl();

        const startAnalysis = async () => {
            try {
                console.log('Waking up backend...');
                await fetch(`${API_URL}/docs`, { method: 'GET' }).catch(() => { });

                await new Promise(resolve => setTimeout(resolve, 1500));
                startConnection();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('Starting analysis...');
                const resp = await fetch(`${API_URL}/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        repo_url: repoUrl,
                        session_id: sessionId,
                        commit_msg: commitMsg || 'Fixed {issues_count} issues in {files_changed} files',
                        access_token: accessToken
                    })
                });

                if (!resp.ok) {
                    const errText = await resp.text();
                    throw new Error(`Backend error: ${resp.status} - ${errText}`);
                }
                console.log('Analysis request accepted');
            } catch (e) {
                console.error('Analysis failed:', e);
                alert(`Failed to connect to backend: ${e.message}`);
                setStarted(false);
            }
        };

        startAnalysis();
    }, [repoUrl]);

    useEffect(() => {
        const container = logsEndRef.current?.parentElement;
        if (container) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            if (isNearBottom || logs.length < 5) {
                logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [logs]);

    const isRunning = !result;

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Confetti Canvas */}
            <canvas ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-50"
                style={{ display: 'none' }}
            />

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
                    <div className="flex items-center gap-3">
                        <button onClick={toggleMute} className="text-secondary hover:text-white transition-colors cursor-pointer"
                            title={muted ? 'Unmute' : 'Mute'}>
                            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center gap-2 text-secondary text-sm">
                            <Shield className="w-4 h-4" />
                            {isRunning ? <span className="animate-pulse text-violet-400">Running...</span> : <span className="text-emerald-400">Complete</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Pipeline Progress */}
                <PipelineProgress stages={stages} />

                {/* Language Stats */}
                <LanguageChart langStats={langStats} />

                {/* Test Results */}
                <TestResultsPanel testResults={testResults} />

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
                                                    {fix.method === 'ai' ? <><IconBrain size={12} /> AI</> : <><IconZap size={12} /> Heuristic</>}
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
