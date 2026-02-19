import React from 'react';
import { motion } from 'framer-motion';

export default function CICDTimeline({ runs }) {
    if (!runs || runs.length === 0) return null;

    return (
        <div className="bg-surface p-6 rounded-xl border border-white/5 shadow-lg">
            <h3 className="text-secondary text-sm font-medium mb-6 uppercase tracking-wider">CI/CD Pipeline History</h3>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>

                <div className="space-y-6">
                    {runs.map((run, index) => (
                        <div key={index} className="relative pl-12">
                            {/* Status Dot */}
                            <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 border-surface ${run.status === 'PASSED' ? 'bg-green-500' : 'bg-red-500'
                                } z-10`}></div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-medium ${run.status === 'PASSED' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        Run #{run.id}: {run.status}
                                    </h4>
                                    <p className="text-sm text-secondary mt-1">{run.message}</p>
                                </div>
                                <span className="text-xs text-secondary font-mono bg-black/20 px-2 py-1 rounded">
                                    {run.timestamp}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
