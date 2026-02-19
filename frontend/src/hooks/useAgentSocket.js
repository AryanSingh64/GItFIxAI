import { useEffect, useRef, useState, useCallback } from 'react';

export function useAgentSocket() {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('IDLE');
    const ws = useRef(null);
    const mounted = useRef(false);

    useEffect(() => {
        // Prevent double connection from React StrictMode
        if (mounted.current) return;
        mounted.current = true;

        const connect = () => {
            ws.current = new WebSocket('ws://localhost:8000/ws');

            ws.current.onopen = () => {
                // console.log('Connected to Agent WebSocket');
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prev) => [...prev, data]);

                if (data.type === 'STATUS') {
                    setStatus(data.status);
                }
            };

            ws.current.onclose = () => {
                // console.log('Disconnected from Agent WebSocket');
            };

            ws.current.onerror = () => {
                // Silently handle connection errors
            };
        };

        connect();

        return () => {
            mounted.current = false;
            ws.current?.close();
        };
    }, []);

    const clearMessages = useCallback(() => setMessages([]), []);

    return { messages, status, clearMessages };
}
