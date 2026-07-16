'use client';

const CODE_LINES = [
    { text: '#!/usr/bin/env python3', cls: 'comment' },
    { text: '# 0xMaruF — Automated Recon Script', cls: 'comment' },
    { text: '# For educational purposes only', cls: 'comment' },
    { text: '', cls: '' },
    { text: 'import', cls: 'keyword', rest: ' subprocess' },
    { text: 'import', cls: 'keyword', rest: ' socket' },
    { text: 'import', cls: 'keyword', rest: ' sys' },
    { text: 'from', cls: 'keyword', rest: [' datetime ', { text: 'import', cls: 'keyword' }, ' datetime'] },
    { text: '', cls: '' },
    { text: 'class', cls: 'keyword', rest: [' ', { text: 'ReconScanner', cls: 'function' }, ':'] },
    { text: '    """Automated reconnaissance scanner."""', cls: 'string' },
    { text: '', cls: '' },
    { text: '    def', cls: 'keyword', rest: [' ', { text: '__init__', cls: 'function' }, '(', { text: 'self', cls: 'variable' }, ', target):'] },
    { text: '        self.target = target', cls: '' },
    { text: '        self.open_ports = []', cls: '' },
    { text: '        self.start_time = datetime.now()', cls: '' },
    { text: '', cls: '' },
    { text: '    def', cls: 'keyword', rest: [' ', { text: 'scan_ports', cls: 'function' }, '(', { text: 'self', cls: 'variable' }, ', port_range=', { text: '1024', cls: 'number' }, '):'] },
    { text: '        """Scan target for open ports."""', cls: 'string' },
    { text: '        print', cls: 'keyword', rest: ['(', { text: 'f"[*] Scanning {self.target}..."', cls: 'string' }, ')'] },
    { text: '', cls: '' },
    { text: '        for', cls: 'keyword', rest: ' port ', rest2: [{ text: 'in', cls: 'keyword' }, ' range(', { text: '1', cls: 'number' }, ', port_range):'] },
    { text: '            try:', cls: 'keyword' },
    { text: '                sock = socket.socket()', cls: '' },
    { text: '                sock.settimeout(', cls: '', rest: [{ text: '0.5', cls: 'number' }, ')'] },
    { text: '                result = sock.connect_ex((self.target, port))', cls: '' },
    { text: '                if', cls: 'keyword', rest: ' result == ', rest2: [{ text: '0', cls: 'number' }, ':'] },
    { text: '                    self.open_ports.append(port)', cls: '' },
    { text: '                    print', cls: 'keyword', rest: ['(', { text: 'f"[+] Port {port} is OPEN"', cls: 'string' }, ')'] },
    { text: '            except:', cls: 'keyword' },
    { text: '                pass', cls: 'keyword' },
    { text: '', cls: '' },
    { text: 'if', cls: 'keyword', rest: ' __name__ == ', rest2: [{ text: '"__main__"', cls: 'string' }, ':'] },
    { text: '    target = sys.argv[', cls: '', rest: [{ text: '1', cls: 'number' }, '] ', { text: 'if', cls: 'keyword' }, ' len(sys.argv) > ', { text: '1', cls: 'number' }, ' ', { text: 'else', cls: 'keyword' }, ' ', { text: '"127.0.0.1"', cls: 'string' }] },
    { text: '    scanner = ReconScanner(target)', cls: '' },
    { text: '    scanner.scan_ports()', cls: '' },
];

// Simple rendering — just show plain text with line numbers
const PLAIN_CODE = `#!/usr/bin/env python3
# 0xMaruF — Automated Recon Script
# For educational purposes only

import subprocess
import socket
import sys
from datetime import datetime

class ReconScanner:
    """Automated reconnaissance scanner."""

    def __init__(self, target):
        self.target = target
        self.open_ports = []
        self.start_time = datetime.now()

    def scan_ports(self, port_range=1024):
        """Scan target for open ports."""
        print(f"[*] Scanning {self.target}...")

        for port in range(1, port_range):
            try:
                sock = socket.socket()
                sock.settimeout(0.5)
                result = sock.connect_ex((self.target, port))
                if result == 0:
                    self.open_ports.append(port)
                    print(f"[+] Port {port} is OPEN")
            except:
                pass

    def banner_grab(self, port):
        """Attempt banner grab on open port."""
        try:
            sock = socket.socket()
            sock.connect((self.target, port))
            sock.send(b"HEAD / HTTP/1.1\\r\\n\\r\\n")
            banner = sock.recv(1024).decode().strip()
            return banner
        except:
            return None

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
    scanner = ReconScanner(target)
    scanner.scan_ports()`;

export default function CodeEditor() {
    const lines = PLAIN_CODE.split('\n');

    const highlightLine = (line: string): React.ReactNode => {
        // Simple keyword-based highlighting
        return line
            .split(/(\b(?:import|from|class|def|if|else|for|in|try|except|pass|return|print|self|None|True|False)\b|"[^"]*"|'[^']*'|#.*$|\b\d+\b)/g)
            .map((part, i) => {
                if (/^(import|from|class|def|if|else|for|in|try|except|pass|return)$/.test(part)) {
                    return <span key={i} className="keyword">{part}</span>;
                }
                if (/^(print|self|None|True|False)$/.test(part)) {
                    return <span key={i} className="variable">{part}</span>;
                }
                if (/^["']/.test(part)) {
                    return <span key={i} className="string">{part}</span>;
                }
                if (/^#/.test(part)) {
                    return <span key={i} className="comment">{part}</span>;
                }
                if (/^\d+$/.test(part)) {
                    return <span key={i} className="number">{part}</span>;
                }
                return part;
            });
    };

    return (
        <div className="ox-editor">
            <div className="ox-editor-gutter">
                {lines.map((_, i) => (
                    <div key={i} className="ox-editor-gutter-line">
                        {i + 1}
                    </div>
                ))}
            </div>
            <div className="ox-editor-content">
                {lines.map((line, i) => (
                    <div key={i}>{highlightLine(line) || ' '}</div>
                ))}
            </div>
        </div>
    );
}
