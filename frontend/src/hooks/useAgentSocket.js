import { useEffect, useRef, useState } from 'react';

export function useAgentSocket() {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('IDLE');
    const ws = useRef(null);

    useEffect(() => {
        // Connect to WebSocket on Mount
        ws.current = new WebSocket('ws://localhost:8000/ws');

        ws.current.onopen = () => {
            console.log('Connected to Agent WebSocket');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);

            if (data.type === 'STATUS') {
                setStatus(data.status);
            }
        };

        ws.current.onclose = () => {
            console.log('Disconnected from Agent WebSocket');
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const clearMessages = () => setMessages([]);

    return { messages, status, clearMessages };
}
