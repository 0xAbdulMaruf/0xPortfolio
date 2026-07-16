'use client';
import { useRef, useState, useCallback, ReactNode } from 'react';

interface WindowProps {
    id: string;
    title: string;
    icon: ReactNode;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    focused: boolean;
    onFocus: () => void;
    onClose: () => void;
    onMinimize: () => void;
    children: ReactNode;
}

export default function Window({
    id,
    title,
    icon,
    x,
    y,
    width,
    height,
    zIndex,
    focused,
    onFocus,
    onClose,
    onMinimize,
    children,
}: WindowProps) {
    const windowRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x, y });
    const [size, setSize] = useState({ w: width, h: height });
    const [maximized, setMaximized] = useState(false);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleTitleBarMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (maximized) return;
            e.preventDefault();
            onFocus();
            isDragging.current = true;
            dragOffset.current = {
                x: e.clientX - pos.x,
                y: e.clientY - pos.y,
            };

            const handleMouseMove = (ev: MouseEvent) => {
                if (!isDragging.current) return;
                setPos({
                    x: ev.clientX - dragOffset.current.x,
                    y: Math.max(0, ev.clientY - dragOffset.current.y),
                });
            };

            const handleMouseUp = () => {
                isDragging.current = false;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
        [pos, maximized, onFocus]
    );

    const handleMaximize = useCallback(() => {
        setMaximized((prev) => !prev);
    }, []);

    return (
        <div
            ref={windowRef}
            className={`ox-window ${focused ? 'focused' : ''} ${maximized ? 'maximized' : ''}`}
            style={{
                left: maximized ? 0 : pos.x,
                top: maximized ? 0 : pos.y,
                width: maximized ? '100vw' : size.w,
                height: maximized ? 'calc(100vh - 42px)' : size.h,
                zIndex,
            }}
            onMouseDown={onFocus}
        >
            <div
                className="ox-window-titlebar"
                onMouseDown={handleTitleBarMouseDown}
                onDoubleClick={handleMaximize}
            >
                <span className="ox-window-title">
                    <span className="ox-window-title-icon">{icon}</span>
                    {title}
                </span>
                <div className="ox-window-controls">
                    <button
                        className="ox-window-btn minimize"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMinimize();
                        }}
                    />
                    <button
                        className="ox-window-btn maximize"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMaximize();
                        }}
                    />
                    <button
                        className="ox-window-btn close"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    />
                </div>
            </div>
            <div className="ox-window-body">{children}</div>
        </div>
    );
}
