import { useRef, useEffect } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';

const Terminal = ({ sessionId, token }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const socketRef = useRef(null);
    const currCommand = useRef('');

    useEffect(() => {
        // Initialize XTerm
        const term = new XTerm({
            cursorBlink: true,
            theme: {
                background: '#0a0e17',
                foreground: '#00f2fe'
            },
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        term.writeln('Connecting to secure terminal environment...');

        // Initialize Socket
        const socket = io('http://localhost:3000/labs', {
            auth: { token }
        });

        socket.on('connect', () => {
            term.writeln('\x1b[32m[CONNECTED]\x1b[0m Node established.');
            socket.emit('join_lab', sessionId);
            term.write('\r\n$ ');
        });

        socket.on('terminal_output', (res) => {
            term.write('\r\n' + res.data + '\r\n$ ');
        });

        term.onData(data => {
            const code = data.charCodeAt(0);
            if (code === 13) { // Enter
                socket.emit('terminal_input', { sessionId, command: currCommand.current });
                currCommand.current = '';
            } else if (code === 127) { // Backspace
                if (currCommand.current.length > 0) {
                    currCommand.current = currCommand.current.slice(0, -1);
                    term.write('\b \b');
                }
            } else {
                currCommand.current += data;
                term.write(data);
            }
        });

        xtermRef.current = term;
        socketRef.current = socket;

        return () => {
            socket.disconnect();
            term.dispose();
        };
    }, [sessionId, token]);

    return (
        <div style={{ height: '400px', backgroundColor: '#0a0e17', borderRadius: '8px', padding: '10px', overflow: 'hidden' }}>
            <div ref={terminalRef} style={{ height: '100%' }} />
        </div>
    );
};

export default Terminal;
