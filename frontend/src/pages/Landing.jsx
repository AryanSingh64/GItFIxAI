import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, RefreshCw, Terminal } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white overflow-hidden relative">

            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-xs font-mono text-secondary mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE v1.0.0
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent animate-slide-up">
                    Autonomous <br />
                    Self-Healing DevOps
                </h1>

                <p className="text-lg md:text-xl text-secondary max-w-2xl mb-10 animate-slide-up-delay">
                    An AI agent that clones, scans, fixes, and deploys your code automatically.
                    Zero configuration. 100% Autonomous.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-slide-up-delay-2">
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10"
                    >
                        Initialize Agent <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => window.open('https://github.com', '_blank')}
                        className="px-8 py-4 bg-black border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <Terminal className="w-5 h-5 text-secondary" /> Documentation
                    </button>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-yellow-400" />}
                        title="Instant Analysis"
                        desc="Scans repositories for linting errors, formatting issues, and structural defects in milliseconds."
                    />
                    <FeatureCard
                        icon={<RefreshCw className="w-6 h-6 text-blue-400" />}
                        title="Auto-Remediation"
                        desc="Intelligently patches code with context-aware fixes, ensuring passing build pipelines."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
                        title="Secure Deployment"
                        desc="Pushes fixed branches back to origin with detailed commit logs and compliance checks."
                    />
                </div>

            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-colors group">
            <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
            <p className="text-secondary text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
