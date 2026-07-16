'use client';
import { useState, useEffect, useCallback } from 'react';

const BOOT_LINES = [
    { text: '[    0.000000] 0xLinux kernel v6.6.6-0xmaruf initializing...', type: 'info' },
    { text: '[    0.012340] BIOS-provided physical RAM map:', type: 'info' },
    { text: '[    0.015678] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable', type: 'info' },
    { text: '[    0.023456] Command line: root=/dev/0xfs ro quiet splash', type: 'info' },
    { text: '[    0.045678] Booting paravirtualized kernel on bare hardware', type: 'info' },
    { text: '[    0.089012] Memory: 16384MB available', type: 'ok' },
    { text: '[    0.123456] CPU: 0xProcessor™ Hacker Edition @ 4.2GHz', type: 'ok' },
    { text: '[    0.234567] Mounting root filesystem...', type: 'info' },
    { text: '[    0.345678] Loading kernel modules...', type: 'info' },
    { text: '[  OK  ] Started 0xFirewall — Stealth Mode', type: 'ok' },
    { text: '[  OK  ] Started Network Manager', type: 'ok' },
    { text: '[  OK  ] Started 0xTor — Onion Routing Service', type: 'ok' },
    { text: '[  OK  ] Loaded Metasploit Framework v6.3', type: 'ok' },
    { text: '[  OK  ] Started Nmap Discovery Service', type: 'ok' },
    { text: '[ WARN ] SSH brute-force protector active', type: 'warn' },
    { text: '[  OK  ] Started 0xMaruF Workspace Manager', type: 'ok' },
    { text: '[  OK  ] Reached target Graphical Interface', type: 'ok' },
    { text: '', type: 'info' },
    { text: '    ██████╗ ██╗  ██╗██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗', type: 'ok' },
    { text: '   ██╔═████╗╚██╗██╔╝██║     ██║████╗  ██║██║   ██║╚██╗██╔╝', type: 'ok' },
    { text: '   ██║██╔██║ ╚███╔╝ ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝ ', type: 'ok' },
    { text: '   ████╔╝██║ ██╔██╗ ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗ ', type: 'ok' },
    { text: '   ╚██████╔╝██╔╝ ██╗███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗', type: 'ok' },
    { text: '    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝', type: 'ok' },
    { text: '', type: 'info' },
    { text: '   Welcome to 0xLinux — Built by 0xMaruF', type: 'ok' },
    { text: '   Initializing desktop environment...', type: 'info' },
];

interface BootScreenProps {
    onComplete: () => void;
}

const BOOT_FLAG = '0xlinux-boot-seen';

export default function BootScreen({ onComplete }: BootScreenProps) {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        if (window.sessionStorage.getItem(BOOT_FLAG) === '1') {
            onComplete();
            return;
        }

        if (visibleLines >= BOOT_LINES.length) {
            window.sessionStorage.setItem(BOOT_FLAG, '1');
            const timeout = setTimeout(onComplete, 800);
            return () => clearTimeout(timeout);
        }

        const delay = visibleLines < 8 ? 60 : visibleLines < 16 ? 80 : 50;
        const timeout = setTimeout(() => {
            setVisibleLines((prev) => prev + 1);
        }, delay);

        return () => clearTimeout(timeout);
    }, [visibleLines, onComplete]);

    const handleSkip = useCallback(() => {
        window.sessionStorage.setItem(BOOT_FLAG, '1');
        onComplete();
    }, [onComplete]);

    return (
        <div className="boot-screen">
            <div style={{ overflow: 'hidden' }}>
                {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                    <div
                        key={i}
                        className={`boot-line ${line.type}`}
                        style={{ animationDelay: `${i * 0.02}s` }}
                    >
                        {line.text}
                    </div>
                ))}
            </div>
            <button className="boot-skip" onClick={handleSkip}>
                Skip [Enter]
            </button>
        </div>
    );
}
