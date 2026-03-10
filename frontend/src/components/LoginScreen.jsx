import { Github, Mail } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome to Auto-DevOps Agent</h2>
                <p className="text-secondary max-w-md mx-auto">
                    Transform your broken code into production-ready software with our autonomous AI agent.
                </p>
            </div>

            <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-xl hover:shadow-white/20 active:scale-95"
            >
                <Mail className="w-6 h-6" />
                Sign In to Get Started
            </button>

            <div className="text-xs text-secondary mt-8">
                Sign in with Email, Google, or GitHub to access your repositories.
            </div>
        </div>
    );
}
