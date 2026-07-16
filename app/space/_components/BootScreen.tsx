'use client';
import { useState, useEffect, useCallback } from 'react';

// Replace text with an SVG or an Image if you have an Arch Linux logo asset.
// TODO: Add Arch Linux SVG logo to public folder and reference it here.
const BOOT_LINES = [
    { text: 'Starting Arch Linux...', type: 'info' },
    { text: '[    0.000000] Linux version 6.6.6-arch1-1 (linux@archlinux) (gcc (GCC) 13.2.1)', type: 'info' },
    { text: '[    0.012340] BIOS-provided physical RAM map:', type: 'info' },
    { text: '[    0.015678] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable', type: 'info' },
    { text: '[    0.023456] Command line: initrd=\\initramfs-linux.img root=PARTUUID=1337-xxxx rw quiet splash', type: 'info' },
    { text: '[    0.089012] Memory: 16384MB available', type: 'ok' },
    { text: '[    0.123456] smp: Brought up 1 node, 16 CPUs', type: 'ok' },
    { text: '[    0.234567] Mounting root filesystem...', type: 'info' },
    { text: '[    0.345678] systemd[1]: Inserted module \'autofs4\'', type: 'info' },
    { text: '[  OK  ] Reached target Local File Systems.', type: 'ok' },
    { text: '[  OK  ] Started Network Manager.', type: 'ok' },
    { text: '[  OK  ] Started WPA supplicant.', type: 'ok' },
    { text: '[  OK  ] Started Authorization Manager.', type: 'ok' },
    { text: '[  OK  ] Started 0xTor — Onion Routing Service.', type: 'ok' },
    { text: '[ WARN ] SSH brute-force protector active.', type: 'warn' },
    { text: '[  OK  ] Started Seat management daemon.', type: 'ok' },
    { text: '[  OK  ] Started Hyprland Compositor.', type: 'ok' },
    { text: '[  OK  ] Started Waybar.', type: 'ok' },
    { text: '[  OK  ] Started Mako Notification Daemon.', type: 'ok' },
    { text: '[  OK  ] Reached target Graphical Interface.', type: 'ok' },
    { text: '', type: 'info' },
    { text: '                   -`', type: 'arch' },
    { text: '                  .o+`', type: 'arch' },
    { text: '                 `ooo/', type: 'arch' },
    { text: '                `+oooo:', type: 'arch' },
    { text: '               `+oooooo:', type: 'arch' },
    { text: '               -+oooooo+:', type: 'arch' },
    { text: '             `/:-:++oooo+:', type: 'arch' },
    { text: '            `/++++/+++++++:', type: 'arch' },
    { text: '           `/++++++++++++++:', type: 'arch' },
    { text: '          `/+++ooooooooooooo/`', type: 'arch' },
    { text: '         ./ooosssso++osssssso+`', type: 'arch' },
    { text: '        .oossssso-````/ossssss+`', type: 'arch' },
    { text: '       -osssssso.      :ssssssso.', type: 'arch' },
    { text: '      :osssssss/        osssso+++.', type: 'arch' },
    { text: '     /ossssssss/        +ssssooo/-', type: 'arch' },
    { text: '   `/ossssso+/:-        -:/+osssso+-', type: 'arch' },
    { text: '  `+sso+:-`                 `.-/+oso:', type: 'arch' },
    { text: ' `++:.                           `-/+/', type: 'arch' },
    { text: ' .`                                 `', type: 'arch' },
    { text: '', type: 'info' },
    { text: '   Welcome to Arch Linux — Built by 0xMaruF', type: 'ok' },
    { text: '   Initializing Hyprland desktop...', type: 'info' },
];

interface BootScreenProps {
    onComplete: () => void;
}

const BOOT_FLAG = 'archlinux-hypr-boot-seen';

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

        const delay = visibleLines < 8 ? 60 : visibleLines < 20 ? 40 : 20; // Faster later
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
