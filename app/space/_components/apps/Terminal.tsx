'use client';
import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { MY_STACK, MY_EXPERIENCE, CVE_LIST } from '@/lib/data';

const NEOFETCH_ASCII = `                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \``;

interface TerminalLine {
    type: 'input' | 'output';
    content: string;
    html?: boolean;
}

export default function Terminal() {
    const [lines, setLines] = useState<TerminalLine[]>([
        { type: 'output', content: 'Arch Linux x86_64' },
        { type: 'output', content: 'Type "help" for available commands.\n' },
    ]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const termRef = useRef<HTMLDivElement>(null);
    const startTime = useRef(Date.now());

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (termRef.current) {
            termRef.current.scrollTop = termRef.current.scrollHeight;
        }
    }, [lines]);

    const processCommand = useCallback(
        (cmd: string): string[] => {
            const trimmed = cmd.trim().toLowerCase();
            const parts = trimmed.split(/\s+/);
            const command = parts[0];

            switch (command) {
                case 'help':
                    return [
                        'Available commands:',
                        '  help          — Show this help message',
                        '  whoami        — Display current user',
                        '  ls            — List directory contents',
                        '  cat <file>    — Display file contents',
                        '  neofetch      — System information',
                        '  nmap portfolio — Scan portfolio services',
                        '  clear         — Clear terminal',
                        '  pwd           — Print working directory',
                        '  date          — Display current date',
                        '  uname -a      — System information',
                        '  exit          — Return to portfolio',
                    ];

                case 'whoami':
                    return ['0xMaruF'];

                case 'pwd':
                    return ['/home/0xmaruf'];

                case 'date':
                    return [new Date().toString()];

                case 'uname':
                    return ['Linux archlinux 6.6.6-arch1-1 x86_64 GNU/Linux'];

                case 'ls': {
                    const dir = parts[1] || '';
                    if (!dir || dir === '~' || dir === '.') {
                        return [
                            'Documents/  Projects/  Downloads/  .config/',
                            'about.txt   skills.txt  experience.txt  cves.txt',
                        ];
                    }
                    if (dir === 'Documents' || dir === '~/Documents') {
                        return ['about.txt  skills.txt  experience.txt  cves.txt'];
                    }
                    if (dir === 'Projects' || dir === '~/Projects') {
                        return ['No projects found. Check back soon!'];
                    }
                    return [`ls: cannot access '${parts[1]}': No such file or directory`];
                }

                case 'cat': {
                    const file = parts[1];
                    if (!file) return ['cat: missing operand'];

                    if (file === 'about.txt') {
                        return [
                            '╔══════════════════════════════════════╗',
                            '║           ABOUT 0xMaruF             ║',
                            '╚══════════════════════════════════════╝',
                            '',
                            'Hi! I\'m MaruF. A Cybersecurity Student',
                            'passionate about offensive security,',
                            'bug hunting, and AI-driven security',
                            'automation.',
                            '',
                            'Email: abdulmaruf9024@gmail.com',
                        ];
                    }

                    if (file === 'skills.txt') {
                        const securitySkills = MY_STACK.security.map((s) => `  • ${s.name}`);
                        const tools = MY_STACK.tools.map((s) => `  • ${s.name}`);
                        const prog = MY_STACK.programming.map((s) => `  • ${s.name}`);
                        return [
                            '── Security ──',
                            ...securitySkills,
                            '',
                            '── Tools ──',
                            ...tools,
                            '',
                            '── Programming ──',
                            ...prog,
                        ];
                    }

                    if (file === 'experience.txt') {
                        const exp = MY_EXPERIENCE.map(
                            (e) => `  ${e.title} @ ${e.company} (${e.duration})`
                        );
                        return ['── Experience ──', ...exp];
                    }

                    if (file === 'cves.txt') {
                        const cves = CVE_LIST.map(
                            (c) => `  [${c.severity}] ${c.id} — ${c.title}`
                        );
                        return ['── CVE Discoveries ──', ...cves];
                    }

                    return [`cat: ${file}: No such file or directory`];
                }

                case 'neofetch': {
                    const uptime = Math.floor(
                        (Date.now() - startTime.current) / 1000
                    );
                    const mins = Math.floor(uptime / 60);
                    const secs = uptime % 60;
                    return [
                        '___NEOFETCH_START___',
                        NEOFETCH_ASCII,
                        '___NEOFETCH_SEPARATOR___',
                        `0xmaruf@archlinux`,
                        `-----------------`,
                        `OS: Arch Linux x86_64`,
                        `Host: 0xMaruF's Portfolio`,
                        `Kernel: 6.6.6-arch1-1`,
                        `Uptime: ${mins}m ${secs}s`,
                        `Packages: 1337 (pacman)`,
                        `Shell: zsh 5.9`,
                        `WM: Hyprland`,
                        `Terminal: kitty`,
                        `CPU: AMD Ryzen 9 5900X (24) @ 4.8GHz`,
                        `Memory: 1337MiB / 16384MiB`,
                        `Theme: Catppuccin Mocha [Dark]`,
                        '___NEOFETCH_END___',
                    ];
                }

                case 'nmap': {
                    if (parts[1] !== 'portfolio') {
                        return [`nmap: target '${parts[1] || ''}' not found`];
                    }
                    return [
                        'Starting Nmap 7.94 ( https://nmap.org )',
                        'Nmap scan report for portfolio.0xmaruf.dev',
                        'Host is up (0.001s latency).',
                        '',
                        'PORT      STATE    SERVICE',
                        '22/tcp    open     ssh',
                        '80/tcp    open     http',
                        '443/tcp   open     https',
                        '3000/tcp  open     nextjs',
                        '8080/tcp  open     burpsuite-proxy',
                        '4444/tcp  filtered metasploit',
                        '8443/tcp  open     wireshark-capture',
                        '',
                        'Nmap done: 1 IP address (1 host up) scanned in 0.42s',
                    ];
                }

                case 'clear':
                    return ['___CLEAR___'];

                case 'exit':
                    return ['___EXIT___'];

                case '':
                    return [];

                default:
                    return [
                        `zsh: command not found: ${command}`,
                        'Type "help" for available commands.',
                    ];
            }
        },
        []
    );

    const handleSubmit = useCallback(() => {
        const cmd = input.trim();
        const newLines: TerminalLine[] = [
            ...lines,
            { type: 'input', content: cmd },
        ];

        const output = processCommand(cmd);

        if (output.includes('___CLEAR___')) {
            setLines([]);
            setInput('');
            if (cmd) {
                setHistory((prev) => [...prev, cmd]);
                setHistoryIndex(-1);
            }
            return;
        }

        if (output.includes('___EXIT___')) {
            window.location.href = '/';
            return;
        }

        output.forEach((line) => {
            newLines.push({ type: 'output', content: line });
        });

        setLines(newLines);
        setInput('');
        if (cmd) {
            setHistory((prev) => [...prev, cmd]);
            setHistoryIndex(-1);
        }
    }, [input, lines, processCommand]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleSubmit();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (history.length === 0) return;
                const newIndex =
                    historyIndex === -1
                        ? history.length - 1
                        : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex === -1) return;
                const newIndex = historyIndex + 1;
                if (newIndex >= history.length) {
                    setHistoryIndex(-1);
                    setInput('');
                } else {
                    setHistoryIndex(newIndex);
                    setInput(history[newIndex]);
                }
            }
        },
        [handleSubmit, history, historyIndex]
    );

    const renderLine = (line: TerminalLine, i: number) => {
        if (line.type === 'input') {
            return (
                <div key={i} className="ox-terminal-line">
                    <span className="prompt-user">0xmaruf</span>
                    <span className="prompt-at">@</span>
                    <span className="prompt-host">archlinux</span>
                    <span className="prompt-char"> </span>
                    <span className="prompt-path">~</span>
                    <span className="prompt-char"> $ </span>
                    <span className="command">{line.content}</span>
                </div>
            );
        }

        // Neofetch special rendering
        if (line.content === '___NEOFETCH_START___') return null;
        if (line.content === '___NEOFETCH_END___') return null;
        if (line.content === '___NEOFETCH_SEPARATOR___') return null;

        return (
            <div key={i} className="ox-terminal-line ox-terminal-output">
                {line.content}
            </div>
        );
    };

    // Group neofetch output
    const renderLines = () => {
        const result: React.ReactNode[] = [];
        let i = 0;
        while (i < lines.length) {
            if (lines[i].content === '___NEOFETCH_START___') {
                // Collect neofetch block
                const asciiLines: string[] = [];
                const infoLines: string[] = [];
                i++; // skip start marker
                let inInfo = false;
                while (i < lines.length && lines[i].content !== '___NEOFETCH_END___') {
                    if (lines[i].content === '___NEOFETCH_SEPARATOR___') {
                        inInfo = true;
                    } else if (inInfo) {
                        infoLines.push(lines[i].content);
                    } else {
                        asciiLines.push(lines[i].content);
                    }
                    i++;
                }
                i++; // skip end marker
                result.push(
                    <div key={`neofetch-${i}`} className="neofetch-output">
                        <div className="neofetch-ascii">
                            {asciiLines.join('\n')}
                        </div>
                        <div className="neofetch-info">
                            {infoLines.map((l, j) => {
                                // For the "0xmaruf@archlinux" and "-------------" lines
                                if (!l.includes(': ')) {
                                    return <div key={j} className="label" style={{ color: 'var(--blue)' }}>{l}</div>;
                                }
                                const [label, ...rest] = l.split(': ');
                                const value = rest.join(': ');
                                return (
                                    <div key={j}>
                                        <span className="label">{label}</span>
                                        {value && (
                                            <>
                                                <span className="neofetch-separator">: </span>
                                                <span className="value">{value}</span>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            } else {
                result.push(renderLine(lines[i], i));
                i++;
            }
        }
        return result;
    };

    return (
        <div
            className="ox-terminal"
            ref={termRef}
            onClick={() => inputRef.current?.focus()}
        >
            {renderLines()}
            <div className="ox-terminal-input-line">
                <span className="prompt-user">0xmaruf</span>
                <span className="prompt-at">@</span>
                <span className="prompt-host">archlinux</span>
                <span className="prompt-char"> </span>
                <span className="prompt-path">~</span>
                <span className="prompt-char"> $ </span>
                <input
                    ref={inputRef}
                    className="ox-terminal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
