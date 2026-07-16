'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const PROCESSES = [
    { pid: 1, name: 'systemd', cpu: '0.1' },
    { pid: 142, name: 'nginx', cpu: '1.2' },
    { pid: 256, name: 'metasploit', cpu: '4.8' },
    { pid: 301, name: 'burpsuite', cpu: '8.3' },
    { pid: 412, name: 'nmap-scanner', cpu: '2.1' },
    { pid: 503, name: 'python3.11', cpu: '3.4' },
    { pid: 610, name: 'tor', cpu: '1.7' },
    { pid: 722, name: 'wireshark', cpu: '5.2' },
    { pid: 834, name: 'hashcat', cpu: '12.6' },
    { pid: 901, name: '0xterm', cpu: '0.5' },
];

export default function SystemMonitor() {
    const [cpuUsage, setCpuUsage] = useState(42);
    const [ramUsage, setRamUsage] = useState(67);
    const [netActivity, setNetActivity] = useState(23);
    const [cpuHistory, setCpuHistory] = useState<number[]>(
        Array.from({ length: 30 }, () => Math.random() * 60 + 20)
    );
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Randomize stats
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage((prev) =>
                Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 15))
            );
            setRamUsage((prev) =>
                Math.max(40, Math.min(90, prev + (Math.random() - 0.5) * 5))
            );
            setNetActivity((prev) =>
                Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 30))
            );
            setCpuHistory((prev) => {
                const next = [...prev.slice(1), Math.random() * 60 + 20];
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Draw CPU graph
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (h / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Line
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        cpuHistory.forEach((val, i) => {
            const x = (w / (cpuHistory.length - 1)) * i;
            const y = h - (val / 100) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill below
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0,255,65,0.15)');
        grad.addColorStop(1, 'rgba(0,255,65,0)');
        ctx.fillStyle = grad;
        ctx.fill();
    }, [cpuHistory]);

    return (
        <div className="ox-sysmon">
            {/* CPU */}
            <div className="ox-sysmon-section">
                <div className="ox-sysmon-title">CPU Usage</div>
                <canvas
                    ref={canvasRef}
                    className="ox-sysmon-graph"
                    width={400}
                    height={60}
                    style={{ width: '100%', height: 60 }}
                />
                <div className="ox-sysmon-bar">
                    <div
                        className="ox-sysmon-bar-fill cpu"
                        style={{ width: `${cpuUsage}%` }}
                    />
                </div>
                <div className="ox-sysmon-value">{cpuUsage.toFixed(1)}%</div>
            </div>

            {/* RAM */}
            <div className="ox-sysmon-section">
                <div className="ox-sysmon-title">Memory</div>
                <div className="ox-sysmon-bar">
                    <div
                        className="ox-sysmon-bar-fill ram"
                        style={{ width: `${ramUsage}%` }}
                    />
                </div>
                <div className="ox-sysmon-value">
                    {((ramUsage / 100) * 16384).toFixed(0)}MB / 16384MB (
                    {ramUsage.toFixed(1)}%)
                </div>
            </div>

            {/* Network */}
            <div className="ox-sysmon-section">
                <div className="ox-sysmon-title">Network Activity</div>
                <div className="ox-sysmon-bar">
                    <div
                        className="ox-sysmon-bar-fill net"
                        style={{ width: `${netActivity}%` }}
                    />
                </div>
                <div className="ox-sysmon-value">
                    {(netActivity * 10).toFixed(0)} KB/s
                </div>
            </div>

            {/* Processes */}
            <div className="ox-sysmon-section">
                <div className="ox-sysmon-title">Processes</div>
                <div className="ox-sysmon-processes">
                    <div
                        className="ox-sysmon-process"
                        style={{
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: 4,
                            paddingBottom: 4,
                        }}
                    >
                        <span className="pid" style={{ color: '#00ff41' }}>
                            PID
                        </span>
                        <span className="name" style={{ color: '#00ff41' }}>
                            NAME
                        </span>
                        <span
                            className="cpu-usage"
                            style={{ color: '#00ff41' }}
                        >
                            CPU%
                        </span>
                    </div>
                    {PROCESSES.map((p) => (
                        <div key={p.pid} className="ox-sysmon-process">
                            <span className="pid">{p.pid}</span>
                            <span className="name">{p.name}</span>
                            <span className="cpu-usage">{p.cpu}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
