'use client';
import { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, Search, Power, ChevronRight, User } from 'lucide-react';

export interface OpenWindow {
    id: string;
    title: string;
    icon?: React.ReactNode;
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
    const [dateStr, setDateStr] = useState('');
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    
    // TODO: Add actual SVG icons for apps in public/space/icons/
    const iconSrc = '/space/icons/placeholder.svg';

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                })
            );
            setDateStr(
                now.toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
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

    const apps = [
        { id: 'terminal', name: 'Kitty', icon: iconSrc },
        { id: 'files', name: 'Thunar', icon: iconSrc },
        { id: 'monitor', name: 'btop', icon: iconSrc },
        { id: 'editor', name: 'Neovim', icon: iconSrc },
        { id: 'about', name: 'About Arch', icon: iconSrc },
    ];

    return (
        <>
            {/* Start Menu Overlay */}
            {startMenuOpen && (
                <>
                    <div
                        className="ox-start-menu-overlay"
                        onClick={() => setStartMenuOpen(false)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setStartMenuOpen(false);
                        }}
                    />
                    <div className="ox-start-menu">
                        <div className="ox-start-search-container">
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: 16, top: 12, color: 'var(--overlay0)' }} />
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="ox-start-search" 
                                    placeholder="Type here to search" 
                                />
                            </div>
                        </div>

                        <div className="ox-start-body">
                            <div className="ox-start-section-header">
                                <span className="ox-start-section-title">Pinned</span>
                                <button className="ox-start-section-btn">
                                    All apps <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/>
                                </button>
                            </div>
                            <div className="ox-start-grid">
                                {apps.map(app => (
                                    <button 
                                        key={app.id} 
                                        className="ox-start-grid-item"
                                        onClick={() => handleStartItemClick(app.id)}
                                    >
                                        <img src={app.icon} alt="" className="ox-start-grid-icon" />
                                        <span className="ox-start-grid-label">{app.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="ox-start-footer">
                            <div className="ox-start-user">
                                <div className="ox-start-avatar">
                                    <User size={18} />
                                </div>
                                <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>0xMaruF</span>
                            </div>
                            <button 
                                className="ox-start-power"
                                onClick={() => window.location.href = '/'}
                                title="Exit to Portfolio"
                            >
                                <Power size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Taskbar (Bottom Center) */}
            <div className="ox-taskbar">
                <div className="ox-taskbar-left">
                    {/* Empty for layout balance, or add widgets/weather here later */}
                </div>

                <div className="ox-taskbar-center">
                    <button
                        className="ox-start-btn"
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                    >
                        {/* Arch Logo SVG replacing Windows Logo */}
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            <path d="M12 2L2 22h3.5l2.5-5h8l2.5 5H22L12 2zm0 4.5l3.5 7h-7l3.5-7z" />
                        </svg>
                    </button>
                    
                    {windows.map((w) => (
                        <button
                            key={w.id}
                            className={`ox-taskbar-item ${focusedWindow === w.id ? 'active' : ''}`}
                            onClick={() => onWindowClick(w.id)}
                            title={w.title}
                        >
                            {w.icon || <img src={iconSrc} alt="" />}
                            <div className="ox-taskbar-item-indicator" />
                        </button>
                    ))}
                </div>

                <div className="ox-taskbar-right">
                    <div className="ox-tray-container">
                        <Wifi size={14} className="ox-tray-icon" />
                        <Volume2 size={14} className="ox-tray-icon" />
                        <Battery size={14} className="ox-tray-icon" />
                    </div>
                    
                    <div className="ox-tray-container" style={{ padding: '4px 10px' }}>
                        <div className="ox-clock">
                            <span>{time}</span>
                            <span>{dateStr}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
