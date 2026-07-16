'use client';
import { SOCIAL_LINKS } from '@/lib/data';

export default function AboutWidget() {
    return (
        <div className="ox-about">
            <div className="ox-about-logo">Arch Linux</div>
            <div className="ox-about-version">WM: Hyprland | Theme: Catppuccin</div>
            <div className="ox-about-desc">
                An interactive Arch Linux & Hyprland desktop experience built by{' '}
                <span style={{ color: 'var(--blue)' }}>0xMaruF</span>.
                <br />
                <br />
                A simulation of a perfectly riced workspace running inside your browser.
            </div>
            <div
                style={{
                    width: '80%',
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                    margin: '0.5rem 0',
                }}
            />
            <div className="ox-about-links">
                {SOCIAL_LINKS.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ox-about-link"
                    >
                        {link.name}
                    </a>
                ))}
                <a href="/" className="ox-about-link">
                    Portfolio
                </a>
            </div>
            <div
                style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: 10,
                    color: 'var(--overlay0)',
                    marginTop: '0.5rem',
                }}
            >
                © {new Date().getFullYear()} Abdul MaruF. All rights reserved.
            </div>
        </div>
    );
}
