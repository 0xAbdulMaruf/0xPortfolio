'use client';
import { useState, useCallback } from 'react';
import { Folder, FileText, ArrowLeft } from 'lucide-react';
import { MY_STACK, MY_EXPERIENCE, CVE_LIST } from '@/lib/data';

interface FileSystemItem {
    name: string;
    type: 'folder' | 'file';
    content?: string;
    children?: FileSystemItem[];
}

const FILE_SYSTEM: FileSystemItem[] = [
    {
        name: 'Documents',
        type: 'folder',
        children: [
            {
                name: 'about.txt',
                type: 'file',
                content: `Hi! I'm MaruF.\n\nA Cybersecurity Student passionate about offensive security, bug hunting, and AI-driven security automation.\n\nEmail: abdulmaruf9024@gmail.com`,
            },
            {
                name: 'skills.txt',
                type: 'file',
                content: `Security Skills:\n${MY_STACK.security.map((s) => `  • ${s.name}`).join('\n')}\n\nTools:\n${MY_STACK.tools.map((s) => `  • ${s.name}`).join('\n')}\n\nProgramming:\n${MY_STACK.programming.map((s) => `  • ${s.name}`).join('\n')}`,
            },
            {
                name: 'experience.txt',
                type: 'file',
                content: MY_EXPERIENCE.map(
                    (e) => `${e.title}\n  ${e.company}\n  ${e.duration}\n`
                ).join('\n'),
            },
            {
                name: 'cves.txt',
                type: 'file',
                content: CVE_LIST.map(
                    (c) =>
                        `[${c.severity}] ${c.id}\n  ${c.title}\n  CVSS: ${c.cvss}\n`
                ).join('\n'),
            },
        ],
    },
    {
        name: 'Projects',
        type: 'folder',
        children: [
            {
                name: 'README.md',
                type: 'file',
                content:
                    '# Projects\n\nCheck out my projects on the main portfolio page!\nNavigate to the Projects section from the homepage.',
            },
        ],
    },
    {
        name: 'Downloads',
        type: 'folder',
        children: [
            {
                name: 'resume.pdf',
                type: 'file',
                content: '[Binary file — download from portfolio]',
            },
        ],
    },
];

export default function FileManager() {
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [viewingFile, setViewingFile] = useState<FileSystemItem | null>(null);

    const getCurrentItems = useCallback((): FileSystemItem[] => {
        let items = FILE_SYSTEM;
        for (const dir of currentPath) {
            const found = items.find(
                (i) => i.name === dir && i.type === 'folder'
            );
            if (found?.children) {
                items = found.children;
            }
        }
        return items;
    }, [currentPath]);

    const handleItemClick = useCallback(
        (item: FileSystemItem) => {
            if (item.type === 'folder') {
                setCurrentPath([...currentPath, item.name]);
                setViewingFile(null);
            } else {
                setViewingFile(item);
            }
        },
        [currentPath]
    );

    const handleBack = useCallback(() => {
        if (viewingFile) {
            setViewingFile(null);
        } else if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    }, [currentPath, viewingFile]);

    const items = getCurrentItems();
    const breadcrumb = '/home/0xmaruf' + (currentPath.length ? '/' + currentPath.join('/') : '');

    return (
        <div className="ox-filemgr">
            <div className="ox-filemgr-toolbar">
                <button
                    className="ox-filemgr-back"
                    onClick={handleBack}
                    disabled={currentPath.length === 0 && !viewingFile}
                >
                    <ArrowLeft size={14} />
                </button>
                <div className="ox-filemgr-breadcrumb">
                    <span>{breadcrumb}</span>
                    {viewingFile && (
                        <>
                            /<span>{viewingFile.name}</span>
                        </>
                    )}
                </div>
            </div>

            {viewingFile ? (
                <div
                    style={{
                        padding: '1rem',
                        fontFamily:
                            'var(--font-jetbrains-mono), monospace',
                        fontSize: '12px',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.7)',
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto',
                        flex: 1,
                    }}
                >
                    {viewingFile.content}
                </div>
            ) : (
                <div className="ox-filemgr-grid">
                    {items.map((item) => (
                        <div
                            key={item.name}
                            className="ox-filemgr-item"
                            onDoubleClick={() => handleItemClick(item)}
                            onClick={() => handleItemClick(item)}
                        >
                            <div
                                className={`ox-filemgr-item-icon ${item.type === 'folder' ? 'folder' : ''}`}
                            >
                                {item.type === 'folder' ? (
                                    <Folder size={28} />
                                ) : (
                                    <FileText size={28} />
                                )}
                            </div>
                            <span className="ox-filemgr-item-name">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
