import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAgentSocket } from '../hooks/useAgentSocket';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

import RunSummary from '../components/RunSummary';
import FixesTable from '../components/FixesTable';
import ScoreCard from '../components/ScoreCard';
import CICDTimeline from '../components/CICDTimeline';
import AgentLogs from '../components/AgentLogs';

export default function AgentView() {
    const location = useLocation();
    const navigate = useNavigate();
    const { repoUrl, teamName, leaderName } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState(null);
    const { messages, clearMessages } = useAgentSocket();

    useEffect(() => {
        if (!repoUrl) {
            navigate('/dashboard');
            return;
        }

        const start = async () => {
            clearMessages();
            try {
                const response = await fetch('http://localhost:8000/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repo_url: repoUrl, team_name: teamName, leader_name: leaderName })
                });
                if (!response.ok) throw new Error('Failed');
            } catch (e) {
                console.error(e);
                alert("Backend Error");
                setLoading(false);
            }
        };
        start();
    }, [repoUrl]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.type === 'RESULT') {
                setAnalysisData(lastMsg);
                setLoading(false);
            }
        }
    }, [messages]);

    const logs = messages.filter(m => m.type !== 'RESULT');

    if (!repoUrl) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        {loading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                Agent Actively Healing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                Mission Complete
                            </>
                        )}
                    </h1>
                    <p className="text-secondary mt-1 font-mono text-xs">{repoUrl}</p>
                </div>
            </div>

            {/* Live Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[500px] flex flex-col">
                    <AgentLogs logs={logs} />
                </div>

                {/* Timeline or Summary */}
                <div className="space-y-6">
                    {analysisData ? (
                        <ScoreCard score={analysisData.score} breakdown={analysisData.scoreBreakdown} />
                    ) : (
                        <div className="bg-surface p-6 rounded-xl border border-white/5 h-full flex items-center justify-center text-secondary">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 opacity-50" />
                                <p>Analyzing Repository Structure...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            {analysisData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RunSummary result={analysisData.summary} />
                        <CICDTimeline runs={analysisData.timeline || []} />
                    </div>
                    <FixesTable fixes={analysisData.fixes} />
                </motion.div>
            )}
        </div>
    );
}
