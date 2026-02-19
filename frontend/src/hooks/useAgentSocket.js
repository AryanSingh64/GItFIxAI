import { useEffect, useRef, useState, useCallback } from 'react';

export function useAgentSocket() {
    const [logs, setLogs] = useState([]);
    const [stages, setStages] = useState({});
    const [diffs, setDiffs] = useState([]);
    const [result, setResult] = useState(null);
    const [prUrl, setPrUrl] = useState(null);

    const ws = useRef(null);
    const mounted = useRef(false);
    const reconnectTimer = useRef(null);

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        ws.current = new WebSocket('wss://gitfixai.onrender.com/ws');

        ws.current.onopen = () => {
            console.log('Agent WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'STAGE') {
                    setStages(prev => ({ ...prev, [data.stage]: data.status }));
                } else if (data.type === 'DIFF') {
                    setDiffs(prev => [...prev, data]);
                } else if (data.type === 'RESULT') {
                    setResult(data);
                } else if (data.type === 'PR') {
                    setPrUrl(data.url);
                } else {
                    setLogs(prev => [...prev, data]);
                }
            } catch (e) {
                // ignore parse errors
            }
        };

        ws.current.onclose = () => {
            // Auto-reconnect after 2 seconds
            if (mounted.current) {
                reconnectTimer.current = setTimeout(connect, 2000);
            }
        };

        ws.current.onerror = () => { };
    }, []);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;
        connect();

        return () => {
            mounted.current = false;
            clearTimeout(reconnectTimer.current);
            ws.current?.close();
        };
    }, [connect]);

    const clearAll = useCallback(() => {
        setLogs([]);
        setStages({});
        setDiffs([]);
        setResult(null);
        setPrUrl(null);
    }, []);

    return { logs, stages, diffs, result, prUrl, clearAll };
}
