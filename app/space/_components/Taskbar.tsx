'use client';
import { useState, useEffect } from 'react';
import {
    Skull,
    Wifi,
    Battery,
    LogOut,
} from 'lucide-react';

export interface OpenWindow {
    id: string;
    title: string;
    minimized: boolean;
}

interface TaskbarProps {
    windows: OpenWindow[];
    focusedWindow: string | null;
    onWindowClick: (id: string) => void;
    onOpenApp: (app: string) => void;
}

export default function Taskbar({
    windows,
    focusedWindow,
    onWindowClick,
    onOpenApp,
}: TaskbarProps) {
    const [time, setTime] = useState('');
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const iconSrc = '/space/icons/placeholder.svg';

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleStartItemClick = (app: string) => {
        onOpenApp(app);
        setStartMenuOpen(false);
    };

    return (
        <>
            {/* Start Menu */}
            {startMenuOpen && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 55,
                        }}
                        onClick={() => setStartMenuOpen(false)}
                    />
                    <div className="ox-start-menu">
                        <div className="ox-start-menu-title">Applications</div>
                        <button
                            className="ox-start-item"
                            onClick={() => handleStartItemClick('terminal')}
                        >
                            <div className="ox-start-item-icon">
                                <img src={iconSrc} alt="" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="ox-start-item-text">0xTerm</div>
                                <div className="ox-start-item-desc">
                                    Terminal Emulator
                                </div>
                            </div>
                        </button>
                        <button
                            className="ox-start-item"
                            onClick={() => handleStartItemClick('files')}
                        >
                            <div className="ox-start-item-icon">
                                <img src={iconSrc} alt="" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="ox-start-item-text">
                                    0xFiles
                                </div>
                                <div className="ox-start-item-desc">
                                    File Manager
                                </div>
                            </div>
                        </button>
                        <button
                            className="ox-start-item"
                            onClick={() => handleStartItemClick('monitor')}
                        >
                            <div className="ox-start-item-icon">
                                <img src={iconSrc} alt="" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="ox-start-item-text">0xMon</div>
                                <div className="ox-start-item-desc">
                                    System Monitor
                                </div>
                            </div>
                        </button>
                        <button
                            className="ox-start-item"
                            onClick={() => handleStartItemClick('editor')}
                        >
                            <div className="ox-start-item-icon">
                                <img src={iconSrc} alt="" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="ox-start-item-text">
                                    0xCode
                                </div>
                                <div className="ox-start-item-desc">
                                    Code Editor
                                </div>
                            </div>
                        </button>
                        <button
                            className="ox-start-item"
                            onClick={() => handleStartItemClick('about')}
                        >
                            <div className="ox-start-item-icon">
                                <img src={iconSrc} alt="" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="ox-start-item-text">
                                    About 0xLinux
                                </div>
                                <div className="ox-start-item-desc">
                                    System Information
                                </div>
                            </div>
                        </button>

                        <div className="ox-start-divider" />

                        <button
                            className="ox-start-item"
                            onClick={() => {
                                window.location.href = '/';
                            }}
                        >
                            <div
                                className="ox-start-item-icon"
                                style={{
                                    background: 'rgba(255,85,87,0.15)',
                                    color: '#ff5f57',
                                }}
                            >
                                <LogOut size={16} />
                            </div>
                            <div>
                                <div className="ox-start-item-text">
                                    Exit to Portfolio
                                </div>
                                <div className="ox-start-item-desc">
                                    Return to main site
                                </div>
                            </div>
                        </button>
                    </div>
                </>
            )}

            {/* Taskbar */}
            <div className="ox-taskbar">
                <div className="ox-taskbar-left">
                    <button
                        className="ox-start-btn"
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                    >
                        <Skull size={16} />
                    </button>
                </div>

                <div className="ox-taskbar-center">
                    {windows
                        .filter((w) => !w.minimized)
                        .map((w) => (
                            <button
                                key={w.id}
                                className={`ox-taskbar-item ${focusedWindow === w.id ? 'active' : ''}`}
                                onClick={() => onWindowClick(w.id)}
                            >
                                {w.title}
                            </button>
                        ))}
                </div>

                <div className="ox-taskbar-right">
                    <Wifi size={14} className="ox-tray-icon" />
                    <Battery size={14} className="ox-tray-icon" />
                    <span className="ox-clock">{time}</span>
                </div>
            </div>
        </>
    );
}
