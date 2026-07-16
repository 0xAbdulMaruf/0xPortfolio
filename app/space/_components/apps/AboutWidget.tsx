'use client';
import { SOCIAL_LINKS } from '@/lib/data';

export default function AboutWidget() {
    return (
        <div className="ox-about">
            <div className="ox-about-logo">0xLinux</div>
            <div className="ox-about-version">Version 1.0.0</div>
            <div className="ox-about-desc">
                An interactive Linux desktop experience built by{' '}
                <span style={{ color: '#00ff41' }}>0xMaruF</span>.
                <br />
                <br />
                Inspired by Arch Linux and Kali Linux. This is a simulated
                desktop environment running inside your browser.
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
                    color: 'rgba(255,255,255,0.2)',
                    marginTop: '0.5rem',
                }}
            >
                © {new Date().getFullYear()} Abdul MaruF. All rights reserved.
            </div>
        </div>
    );
}
