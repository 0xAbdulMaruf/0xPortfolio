'use client';
import { useState, useCallback, useEffect, ReactNode } from 'react';
import BootScreen from './BootScreen';
import Taskbar from './Taskbar';
import Window from './Window';
import ContextMenu from './ContextMenu';
import Terminal from './apps/Terminal';
import FileManager from './apps/FileManager';
import SystemMonitor from './apps/SystemMonitor';
import CodeEditor from './apps/CodeEditor';
import AboutWidget from './apps/AboutWidget';
import '../space.css';

const PLACEHOLDER_ICON = '/space/icons/placeholder.svg';

interface WindowState {
    id: string;
    app: string;
    title: string;
    icon: ReactNode;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    minimized: boolean;
}

const APP_CONFIGS: Record<
    string,
    { title: string; icon: ReactNode; width: number; height: number }
> = {
    terminal: {
        title: '0xTerm',
        icon: <img src={PLACEHOLDER_ICON} alt="" aria-hidden="true" className="ox-app-icon" />,
        width: 700,
        height: 450,
    },
    files: {
        title: '0xFiles',
        icon: <img src={PLACEHOLDER_ICON} alt="" aria-hidden="true" className="ox-app-icon" />,
        width: 600,
        height: 400,
    },
    monitor: {
        title: '0xMon',
        icon: <img src={PLACEHOLDER_ICON} alt="" aria-hidden="true" className="ox-app-icon" />,
        width: 500,
        height: 500,
    },
    editor: {
        title: '0xCode',
        icon: <img src={PLACEHOLDER_ICON} alt="" aria-hidden="true" className="ox-app-icon" />,
        width: 650,
        height: 500,
    },
    about: {
        title: 'About 0xLinux',
        icon: <img src={PLACEHOLDER_ICON} alt="" aria-hidden="true" className="ox-app-icon" />,
        width: 380,
        height: 350,
    },
};

const DESKTOP_ICONS = [
    { id: 'terminal', label: '0xTerm', icon: PLACEHOLDER_ICON },
    { id: 'files', label: '0xFiles', icon: PLACEHOLDER_ICON },
    { id: 'monitor', label: '0xMon', icon: PLACEHOLDER_ICON },
    { id: 'editor', label: '0xCode', icon: PLACEHOLDER_ICON },
];

let windowCounter = 0;

export default function Desktop() {
    const [booting, setBooting] = useState(true);
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [focusedWindow, setFocusedWindow] = useState<string | null>(null);
    const [nextZIndex, setNextZIndex] = useState(10);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
    } | null>(null);

    // Escape key handler
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                window.location.href = '/';
            }
            if (e.key === 'Enter' && booting) {
                setBooting(false);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [booting]);

    const openApp = useCallback(
        (app: string) => {
            const config = APP_CONFIGS[app];
            if (!config) return;

            windowCounter++;
            const id = `${app}-${windowCounter}`;
            const offset = (windowCounter % 5) * 30;

            const newWindow: WindowState = {
                id,
                app,
                title: config.title,
                icon: config.icon,
                x: 120 + offset,
                y: 60 + offset,
                width: config.width,
                height: config.height,
                zIndex: nextZIndex,
                minimized: false,
            };

            setWindows((prev) => [...prev, newWindow]);
            setFocusedWindow(id);
            setNextZIndex((prev) => prev + 1);
            setContextMenu(null);
        },
        [nextZIndex]
    );

    const closeWindow = useCallback(
        (id: string) => {
            setWindows((prev) => prev.filter((w) => w.id !== id));
            if (focusedWindow === id) {
                setFocusedWindow(null);
            }
        },
        [focusedWindow]
    );

    const focusWindow = useCallback(
        (id: string) => {
            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id
                        ? { ...w, zIndex: nextZIndex, minimized: false }
                        : w
                )
            );
            setFocusedWindow(id);
            setNextZIndex((prev) => prev + 1);
        },
        [nextZIndex]
    );

    const minimizeWindow = useCallback(
        (id: string) => {
            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, minimized: true } : w
                )
            );
            if (focusedWindow === id) {
                setFocusedWindow(null);
            }
        },
        [focusedWindow]
    );

    const handleDesktopContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
        },
        []
    );

    const handleDesktopClick = useCallback(() => {
        setContextMenu(null);
        setFocusedWindow(null);
    }, []);

    const renderAppContent = (app: string) => {
        switch (app) {
            case 'terminal':
                return <Terminal />;
            case 'files':
                return <FileManager />;
            case 'monitor':
                return <SystemMonitor />;
            case 'editor':
                return <CodeEditor />;
            case 'about':
                return <AboutWidget />;
            default:
                return null;
        }
    };

    if (booting) {
        return <BootScreen onComplete={() => setBooting(false)} />;
    }

    return (
        <div
            className="ox-desktop"
            onContextMenu={handleDesktopContextMenu}
            onClick={handleDesktopClick}
        >
            {/* Wallpaper */}
            <div className="ox-desktop-wallpaper" />
            <div className="ox-desktop-scanline" />

            {/* Desktop Icons */}
            <div className="ox-desktop-icons">
                {DESKTOP_ICONS.map((icon) => (
                    <div
                        key={icon.id}
                        className="ox-icon"
                        onDoubleClick={() => openApp(icon.id)}
                        onClick={() => openApp(icon.id)}
                    >
                        <div className="ox-icon-img">
                            <img src={icon.icon} alt="" aria-hidden="true" />
                        </div>
                        <span className="ox-icon-label">{icon.label}</span>
                    </div>
                ))}
            </div>

            {/* Windows */}
            {windows.map((w) =>
                w.minimized ? null : (
                    <Window
                        key={w.id}
                        id={w.id}
                        title={w.title}
                        icon={w.icon}
                        x={w.x}
                        y={w.y}
                        width={w.width}
                        height={w.height}
                        zIndex={w.zIndex}
                        focused={focusedWindow === w.id}
                        onFocus={() => focusWindow(w.id)}
                        onClose={() => closeWindow(w.id)}
                        onMinimize={() => minimizeWindow(w.id)}
                    >
                        {renderAppContent(w.app)}
                    </Window>
                )
            )}

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onOpenApp={openApp}
                />
            )}

            {/* Taskbar */}
            <Taskbar
                windows={windows.map((w) => ({
                    id: w.id,
                    title: w.title,
                    minimized: w.minimized,
                }))}
                focusedWindow={focusedWindow}
                onWindowClick={focusWindow}
                onOpenApp={openApp}
            />
        </div>
    );
}
