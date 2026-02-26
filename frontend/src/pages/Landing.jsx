import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
    LangPython, LangJavaScript, LangTypeScript, LangGo,
    IconError, IconSuccess, IconBot, IconCheckCircle, IconChart, IconTestTube, IconHeart,
} from '../components/AnimatedIcons';
import {
    ArrowRight, ChevronDown, Github, Twitter, Linkedin, Mail,
    Rocket, BookOpen, Code2, Shield, FlaskConical,
    GitPullRequest, CheckCircle, Sparkles, Zap, Globe, ArrowUp,
    Terminal, Bug, TestTube2, ChevronRight,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   LOGO COMPONENT — Animated SVG Octocat at Desk
   ═══════════════════════════════════════════════════════════ */
function AnimatedLogo({ size = 120 }) {
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox="0 0 120 120" width={size} height={size} className="drop-shadow-2xl">
                {/* Desk */}
                <rect x="20" y="85" width="80" height="6" rx="3" fill="#1a1d23" stroke="#7c3aed" strokeWidth="0.5" />
                <rect x="40" y="91" width="6" height="16" rx="2" fill="#1a1d23" />
                <rect x="74" y="91" width="6" height="16" rx="2" fill="#1a1d23" />
                {/* Laptop base */}
                <rect x="35" y="72" width="50" height="14" rx="3" fill="#24292e" stroke="#30363d" strokeWidth="0.5" />
                {/* Laptop screen */}
                <rect x="38" y="48" width="44" height="26" rx="2" fill="#0d1117" stroke="#30363d" strokeWidth="0.5" />
                {/* Screen glow */}
                <rect x="40" y="50" width="40" height="22" rx="1" fill="#0f1419" opacity="0.9" />
                {/* Code lines on screen */}
                <g className="animate-pulse">
                    <rect x="43" y="53" width="18" height="2" rx="1" fill="#7c3aed" opacity="0.8">
                        <animate attributeName="width" values="0;18;18" dur="2s" repeatCount="indefinite" />
                    </rect>
                    <rect x="43" y="57" width="25" height="2" rx="1" fill="#0066ff" opacity="0.7">
                        <animate attributeName="width" values="0;25;25" dur="2s" begin="0.3s" repeatCount="indefinite" />
                    </rect>
                    <rect x="43" y="61" width="14" height="2" rx="1" fill="#10b981" opacity="0.7">
                        <animate attributeName="width" values="0;14;14" dur="2s" begin="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="43" y="65" width="20" height="2" rx="1" fill="#f59e0b" opacity="0.6">
                        <animate attributeName="width" values="0;20;20" dur="2s" begin="0.9s" repeatCount="indefinite" />
                    </rect>
                </g>
                {/* Octocat body */}
                <ellipse cx="60" cy="52" rx="18" ry="20" fill="#24292e" />
                {/* Octocat head */}
                <circle cx="60" cy="32" r="16" fill="#24292e" />
                {/* Eyes */}
                <circle cx="54" cy="30" r="4" fill="white" />
                <circle cx="66" cy="30" r="4" fill="white" />
                <circle cx="55" cy="30" r="2" fill="#0d1117">
                    <animate attributeName="cx" values="55;56;55" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="67" cy="30" r="2" fill="#0d1117">
                    <animate attributeName="cx" values="67;68;67" dur="3s" repeatCount="indefinite" />
                </circle>
                {/* Smile */}
                <path d="M55 37 Q60 42 65 37" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                {/* Ears/tentacles */}
                <circle cx="46" cy="22" r="5" fill="#24292e" />
                <circle cx="74" cy="22" r="5" fill="#24292e" />
                {/* Arms typing */}
                <g>
                    <path d="M45 55 Q40 65 42 72" fill="none" stroke="#24292e" strokeWidth="5" strokeLinecap="round">
                        <animate attributeName="d" values="M45 55 Q40 65 42 72;M45 55 Q38 63 44 72;M45 55 Q40 65 42 72" dur="0.6s" repeatCount="indefinite" />
                    </path>
                    <path d="M75 55 Q80 65 78 72" fill="none" stroke="#24292e" strokeWidth="5" strokeLinecap="round">
                        <animate attributeName="d" values="M75 55 Q80 65 78 72;M75 55 Q82 63 76 72;M75 55 Q80 65 78 72" dur="0.6s" begin="0.3s" repeatCount="indefinite" />
                    </path>
                </g>
                {/* Sparkles */}
                <g>
                    <circle cx="30" cy="40" r="2" fill="#7c3aed" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="40;30" dur="2s" begin="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="88" cy="38" r="1.5" fill="#0066ff" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1.5s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="38;28" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </circle>
                    <path d="M92 45 l2 -4 l2 4 l-2 4z" fill="#10b981" opacity="0">
                        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="2s" repeatCount="indefinite" />
                    </path>
                </g>
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   LOGO TEXT — "Git" "Fix" "AI" styled
   ═══════════════════════════════════════════════════════════ */
function LogoText({ className = '' }) {
    return (
        <span className={`font-['Inter',sans-serif] ${className}`}>
            <span className="font-normal">Git</span>
            <span className="font-bold">Fix</span>
            <span className="font-bold bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">AI</span>
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════
   FLOATING CODE PARTICLES (Background)
   ═══════════════════════════════════════════════════════════ */
function FloatingParticles() {
    const symbols = ['{ }', '< />', '( )', '[ ]', '=> ', '&&', '||', '# ', '// ', '++;', 'fn()', '::'];
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {symbols.map((s, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/[0.04] font-mono text-sm select-none"
                    initial={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
                        x: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    }}
                    transition={{
                        duration: 20 + Math.random() * 15,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {s}
                </motion.div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER TEXT
   ═══════════════════════════════════════════════════════════ */
function TypewriterText({ text, className = '', delay = 0 }) {
    const words = text.split(' ');
    return (
        <span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay + i * 0.12, duration: 0.4, ease: 'easeOut' }}
                    className="inline-block mr-[0.3em]"
                >
                    {word}
                </motion.span>
            ))}
            <motion.span
                className="inline-block w-[3px] h-[1em] bg-[#7c3aed] ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(1)' }}
            />
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1: Multi-Language Support
   ═══════════════════════════════════════════════════════════ */
function SectionMultiLang() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    const langs = [
        { icon: <LangPython size={24} />, name: 'Python', color: '#3572A5', tools: 'flake8 · bandit · mypy' },
        { icon: <LangJavaScript size={24} />, name: 'JavaScript', color: '#f1e05a', tools: 'ESLint · Prettier' },
        { icon: <LangTypeScript size={24} />, name: 'TypeScript', color: '#3178c6', tools: 'ESLint · TSC' },
        { icon: <LangGo size={24} />, name: 'Go', color: '#00ADD8', tools: 'go vet · staticcheck' },
    ];

    const codeLines = [
        { text: 'def analyze(repo):', color: '#7c3aed' },
        { text: '    issues = scan_all()', color: '#0066ff' },
        { text: '    fixes = ai_fix(issues)', color: '#10b981' },
        { text: '    commit_and_push(fixes)', color: '#f59e0b' },
        { text: '    return {"score": 94}', color: '#ef4444' },
    ];

    return (
        <div ref={ref} className="min-h-[80vh] flex items-center justify-center px-8 md:px-16 py-24 relative">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Side */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0066ff]">Multi-Language</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
                            Universal Code<br />
                            <span className="bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">Analysis</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-3">
                        {langs.map((lang, i) => (
                            <motion.div
                                key={lang.name}
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                className="group flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-default"
                            >
                                <span className="text-2xl">{lang.icon}</span>
                                <div className="flex-1">
                                    <span className="text-white font-semibold">{lang.name}</span>
                                    <span className="text-white/30 text-xs ml-3 hidden group-hover:inline">{lang.tools}</span>
                                </div>
                                <div className="w-2 h-2 rounded-full" style={{ background: lang.color }} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <motion.div
                    initial={{ opacity: 0, rotateY: -15 }}
                    animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative"
                    style={{ perspective: '1000px' }}
                >
                    <div className="bg-[#0d1117] rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/20 overflow-hidden"
                        style={{ transform: 'rotateY(-3deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
                        {/* Editor header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <span className="text-xs text-white/20 ml-3 font-mono">analyzer.py</span>
                        </div>
                        {/* Code lines */}
                        <div className="p-5 font-mono text-sm space-y-1">
                            {codeLines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-white/15 w-5 text-right text-xs">{i + 1}</span>
                                    <span style={{ color: line.color }}>{line.text}</span>
                                    {i === 1 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={isInView ? { scale: 1 } : {}}
                                            transition={{ delay: 1.5, type: 'spring' }}
                                            className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full ml-auto"
                                        >⚠ lint</motion.span>
                                    )}
                                    {i === 2 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={isInView ? { scale: 1 } : {}}
                                            transition={{ delay: 2, type: 'spring' }}
                                            className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-auto"
                                        >✓ fixed</motion.span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2: AI-Powered Fixes
   ═══════════════════════════════════════════════════════════ */
function SectionAIFixes() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (isInView) {
            const t = setTimeout(() => setFlipped(true), 1200);
            return () => clearTimeout(t);
        } else {
            setFlipped(false);
        }
    }, [isInView]);

    return (
        <div ref={ref} className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-8 md:px-16">
            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">AI-Powered</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-3">
                        Contextual <span className="bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">Intelligence</span>
                    </h2>
                    <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
                        AI reads your entire codebase — not just snippets. It understands imports, types, and dependencies.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Before Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="relative group"
                        style={{ perspective: '1000px' }}
                    >
                        <div className={`bg-[#0d1117] rounded-2xl border transition-all duration-700 overflow-hidden ${flipped ? 'border-green-500/30' : 'border-red-500/30'}`}
                            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                            {/* Front — Buggy */}
                            <div className="p-6" style={{ backfaceVisibility: 'hidden' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Bug className="w-4 h-4 text-red-400" />
                                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Before</span>
                                </div>
                                <pre className="text-left text-sm font-mono text-red-300/80 whitespace-pre-wrap">
                                    {`def get_user(id):
    user = db.query(User)
    .filter(id == id)
    return user.name`}
                                </pre>
                                <div className="mt-3 text-xs text-red-400/60 flex items-center gap-1"><IconError size={14} /> 3 issues found</div>
                            </div>
                        </div>
                        {/* Back — Fixed */}
                        <div className={`absolute inset-0 bg-[#0d1117] rounded-2xl border border-green-500/30 overflow-hidden transition-all duration-700`}
                            style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(0)' : 'rotateY(-180deg)' }}>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">After</span>
                                </div>
                                <pre className="text-left text-sm font-mono text-green-300/80 whitespace-pre-wrap">
                                    {`def get_user(user_id: int):
    user = db.query(User)\\
        .filter(User.id == user_id)
    return user.name`}
                                </pre>
                                <div className="mt-3 text-xs text-green-400/60 flex items-center gap-1"><IconSuccess size={14} /> All issues fixed</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Explanation Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="bg-white/[0.03] rounded-2xl border border-white/5 p-6 text-left flex flex-col justify-center"
                    >
                        <h3 className="text-white font-semibold mb-4">What AI Fixed:</h3>
                        <div className="space-y-3">
                            {[
                                'Renamed shadowed parameter id → user_id',
                                'Added type annotation: int',
                                'Fixed filter comparison: User.id == user_id',
                            ].map((fix, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 1.5 + i * 0.2, duration: 0.4 }}
                                    className="flex items-start gap-2 text-sm"
                                >
                                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                    <span className="text-white/60">{fix}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3: Autonomous Test Healing
   ═══════════════════════════════════════════════════════════ */
function SectionTestHealing() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!isInView) { setScore(0); return; }
        let frame; let start = null;
        const animate = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 2000, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setScore(Math.round(eased * 45));
            if (p < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [isInView]);

    const radius = 70;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 45) * circ;
    const color = score < 35 ? '#ef4444' : score < 42 ? '#eab308' : '#10b981';

    const steps = [
        { icon: <TestTube2 className="w-5 h-5" />, label: 'Run Tests', active: score > 0 },
        { icon: <Bug className="w-5 h-5" />, label: 'Fix Fails', active: score > 15 },
        { icon: <CheckCircle className="w-5 h-5" />, label: 'All Pass', active: score >= 45 },
    ];

    return (
        <div ref={ref} className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-8 md:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10b981]">Autonomous</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-10">
                        Self-Healing <span className="bg-gradient-to-r from-[#10b981] to-[#0066ff] bg-clip-text text-transparent">Test Loop</span>
                    </h2>
                </motion.div>

                {/* Circular Gauge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative w-48 h-48 mx-auto mb-10"
                >
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="96" cy="96" r={radius} fill="none" stroke={color} strokeWidth="8"
                            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                            style={{ transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.3s' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black tabular-nums" style={{ color }}>{score}</span>
                        <span className="text-xs text-white/30">/ 45 Tests</span>
                    </div>
                </motion.div>

                {/* Steps */}
                <div className="flex items-center justify-center gap-4 md:gap-8">
                    {steps.map((step, i) => (
                        <React.Fragment key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-500 ${step.active
                                    ? 'bg-white/[0.05] border-white/10 text-white'
                                    : 'bg-transparent border-white/5 text-white/20'
                                    }`}
                            >
                                {step.icon}
                                <span className="text-xs font-medium">{step.label}</span>
                            </motion.div>
                            {i < steps.length - 1 && (
                                <ChevronRight className={`w-5 h-5 transition-colors duration-500 ${step.active ? 'text-white/30' : 'text-white/10'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.5 }}
                    className="text-white/30 text-sm mt-8"
                >
                    Zero-touch healing loop: detect → fix → re-run → until all tests pass
                </motion.p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4: GitHub Integration
   ═══════════════════════════════════════════════════════════ */
function SectionGitHub() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    const prLines = [
        { icon: <IconBot size={16} />, text: 'GitFixAI commented just now' },
        { icon: <IconCheckCircle size={16} />, text: 'Fixed 8 issues automatically' },
        { icon: <IconChart size={16} />, text: 'Score: 94/100 (+12)' },
        { icon: <IconTestTube size={16} />, text: 'All tests passing (45/45)' },
    ];

    return (
        <div ref={ref} className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-8 md:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Seamless</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-10">
                        GitHub <span className="bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">Integration</span>
                    </h2>
                </motion.div>

                {/* PR Mockup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-lg mx-auto"
                    style={{ perspective: '1000px' }}
                >
                    <div className="bg-[#0d1117] rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/20 overflow-hidden"
                        style={{ transform: 'rotateX(2deg)', transformStyle: 'preserve-3d' }}>
                        {/* PR header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                            <GitPullRequest className="w-5 h-5 text-green-400" />
                            <span className="text-white font-semibold text-sm flex items-center gap-1.5"><IconBot size={16} /> Auto-fix code quality issues</span>
                            <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Open</span>
                        </div>
                        {/* PR comment */}
                        <div className="p-5 space-y-3">
                            {prLines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.8 + i * 0.25, duration: 0.4 }}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <span className="text-lg">{line.icon}</span>
                                    <span className="text-white/70">{line.text}</span>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 2 }}
                                className="pt-3 border-t border-white/5"
                            >
                                <a href="#" className="text-xs text-[#0066ff] hover:underline">View Full Report →</a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2 }}
                    className="text-white/30 text-sm mt-8"
                >
                    Automatic healing on every push, PR, and webhook event
                </motion.p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   HORIZONTAL SCROLL DOTS
   ═══════════════════════════════════════════════════════════ */
function ScrollDots({ active, total }) {
    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-none">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-[#7c3aed] scale-150' : 'bg-white/20'}`} />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const links = {
        Product: [
            { label: 'Features', href: '#' },
            { label: 'Pricing', href: '#' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Changelog', href: '#' },
        ],
        Company: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
        ],
        Connect: [
            { label: 'GitHub', href: 'https://github.com/AryanSingh64/GItFIxAI', icon: <Github className="w-4 h-4" /> },
            { label: 'Twitter', href: '#', icon: <Twitter className="w-4 h-4" /> },
            { label: 'Email', href: '#', icon: <Mail className="w-4 h-4" /> },
        ],
    };

    return (
        <footer ref={ref} className="relative bg-gradient-to-b from-[#0f1419] to-[#080a0d] border-t border-white/5 py-10 md:py-16 px-4 md:px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="flex items-center gap-3 mb-12"
                >
                    <AnimatedLogo size={40} />
                    <LogoText className="text-2xl" />
                </motion.div>

                {/* Link Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
                    {Object.entries(links).map(([category, items], ci) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 + ci * 0.1 }}
                        >
                            <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">{category}</h4>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <a href={item.href} className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                            {item.icon}
                                            <span className="relative">
                                                {item.label}
                                                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#7c3aed] group-hover:w-full transition-all duration-300" />
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 }}
                    >
                        <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Stay Updated</h4>
                        <p className="text-white/30 text-sm mb-3">Get notified about new features</p>
                        <div className="flex gap-2 max-w-full">
                            <input type="email" placeholder="your@email.com"
                                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:border-[#7c3aed] focus:outline-none transition-colors" />
                            <button className="bg-gradient-to-r from-[#0066ff] to-[#7c3aed] text-white text-sm px-3 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
                    <p className="text-white/20 text-xs">
                        <span className="flex items-center gap-1">Healing code, one commit at a time. © 2025 GitFixAI · Made with <IconHeart size={12} /></span>
                    </p>
                    <button onClick={scrollToTop}
                        className="group flex items-center gap-2 text-white/20 hover:text-[#7c3aed] text-xs transition-colors cursor-pointer">
                        Back to top
                        <Rocket className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
}


/* ═══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0a0c10] text-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ══════ NAV BAR ══════ */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0c10]/70 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AnimatedLogo size={32} />
                        <LogoText className="text-xl hidden sm:inline" />
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="/docs" className="text-white/50 hover:text-white text-sm transition-colors hidden md:flex items-center">Docs</a>
                        <a href="https://github.com/AryanSingh64/GItFIxAI" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition-colors hidden md:flex flex-row items-center gap-1.5">
                            <Github className="w-4 h-4" /> <span>GitHub</span>
                        </a>
                        <button onClick={() => navigate('/auth')}
                            className="bg-gradient-to-r from-[#0066ff] to-[#7c3aed] text-white text-sm font-semibold px-5 py-2 rounded-full hover:shadow-lg hover:shadow-purple-600/20 transition-all hover:scale-105 cursor-pointer">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ══════ HERO SECTION ══════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
                <FloatingParticles />

                {/* Gradient mesh background */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066ff]/10 rounded-full filter blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c3aed]/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Logo entrance */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
                    className="relative z-10 mb-8"
                >
                    <AnimatedLogo size={140} />
                </motion.div>

                {/* Brand name */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative z-10 mb-6"
                >
                    <LogoText className="text-5xl md:text-7xl" />
                </motion.div>

                {/* Headline with typewriter */}
                <div className="relative z-10 text-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        <TypewriterText text="Heal Your Code Automatically" delay={0.8} />
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="text-white/40 text-lg mt-4 max-w-lg mx-auto"
                    >
                        AI-powered code analysis, fixing, and testing. One commit at a time.
                    </motion.p>
                </div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="relative z-10 flex flex-col sm:flex-row items-center gap-4"
                >
                    <button onClick={() => navigate('/auth')}
                        className="group relative bg-gradient-to-r from-[#0066ff] to-[#7c3aed] text-white font-semibold px-8 py-3.5 rounded-full text-lg hover:shadow-xl hover:shadow-purple-600/30 transition-all hover:scale-105 cursor-pointer overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                    <a href="/docs"
                        className="flex items-center gap-2 text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-6 py-3 rounded-full transition-all cursor-pointer">
                        <BookOpen className="w-5 h-5" /> Read Docs
                    </a>
                </motion.div>

                {/* Scroll indicator — positioned well below CTAs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
                >
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ChevronDown className="w-4 h-4 text-white/15" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════ FEATURE SECTIONS (vertical scroll) ══════ */}
            <SectionMultiLang />
            <SectionAIFixes />
            <SectionTestHealing />
            <SectionGitHub />

            {/* ══════ STATS BAR ══════ */}
            <section className="py-16 px-8 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '10K+', label: 'Issues Fixed' },
                        { value: '4', label: 'Languages' },
                        { value: '95%', label: 'Fix Rate' },
                        { value: '<60s', label: 'Avg Time' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0066ff] to-[#7c3aed] bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-white/30 text-sm mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══════ FOOTER ══════ */}
            <Footer />
        </div>
    );
}
