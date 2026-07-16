'use client';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onOpenApp: (app: string) => void;
}

export default function ContextMenu({
    x,
    y,
    onClose,
    onOpenApp,
}: ContextMenuProps) {
    const iconSrc = '/space/icons/placeholder.svg';

    const handleClick = (app: string) => {
        onOpenApp(app);
        onClose();
    };

    return (
        <>
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                onClick={onClose}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onClose();
                }}
            />
            <div
                className="ox-context-menu"
                style={{ left: x, top: y }}
            >
                <button
                    className="ox-context-item"
                    onClick={() => handleClick('terminal')}
                >
                    <img src={iconSrc} alt="" aria-hidden="true" className="ox-context-item-icon" />
                    Open Terminal
                </button>
                <button
                    className="ox-context-item"
                    onClick={() => handleClick('files')}
                >
                    <img src={iconSrc} alt="" aria-hidden="true" className="ox-context-item-icon" />
                    Open File Manager
                </button>
                <button
                    className="ox-context-item"
                    onClick={() => handleClick('monitor')}
                >
                    <img src={iconSrc} alt="" aria-hidden="true" className="ox-context-item-icon" />
                    System Monitor
                </button>
                <button
                    className="ox-context-item"
                    onClick={() => handleClick('editor')}
                >
                    <img src={iconSrc} alt="" aria-hidden="true" className="ox-context-item-icon" />
                    Code Editor
                </button>
                <div className="ox-context-divider" />
                <button
                    className="ox-context-item"
                    onClick={() => handleClick('about')}
                >
                    <img src={iconSrc} alt="" aria-hidden="true" className="ox-context-item-icon" />
                    About 0xLinux
                </button>
            </div>
        </>
    );
}
