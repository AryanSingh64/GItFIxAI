import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreCard({ score, breakdown }) {
    if (score === undefined) return null;

    const getScoreColor = (s) => {
        if (s >= 90) return 'text-green-400';
        if (s >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-surface p-6 rounded-xl border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-10 blur-3xl ${getScoreColor(score).replace('text-', 'bg-')}`}></div>

            <h3 className="text-secondary text-sm font-medium uppercase tracking-wider mb-2 relative z-10">Total Score</h3>

            <div className="relative z-10 flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    <motion.circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className={getScoreColor(score)}
                        strokeDasharray="377"
                        strokeDashoffset={377 - (377 * score) / 100}
                        initial={{ strokeDashoffset: 377 }}
                        animate={{ strokeDashoffset: 377 - (377 * score) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${getScoreColor(score)}`}>
                    {score}
                </div>
            </div>

            <div className="w-full space-y-2 text-sm relative z-10">
                <div className="flex justify-between">
                    <span className="text-secondary">Base Score</span>
                    <span className="text-white">100</span>
                </div>
                {breakdown?.speedBonus > 0 && (
                    <div className="flex justify-between">
                        <span className="text-green-400">Speed Bonus (&lt;5m)</span>
                        <span className="text-green-400">+{breakdown.speedBonus}</span>
                    </div>
                )}
                {breakdown?.efficiencyPenalty > 0 && (
                    <div className="flex justify-between">
                        <span className="text-red-400">Efficiency Penalty</span>
                        <span className="text-red-400">-{breakdown.efficiencyPenalty}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
