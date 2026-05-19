'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { MoveUpRight, Home, User, Code2, Briefcase, Bug, Folder, Mail, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { FloatingDock } from '@/components/ui/floating-dock';

const COLORS = [
    'bg-yellow-500 text-black',
    'bg-blue-500 text-white',
    'bg-teal-500 text-black',
    'bg-indigo-500 text-white',
];

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
    },
    {
        name: 'About Me',
        url: '/#about-me',
    },
    {
        name: 'Skills',
        url: '/#my-stack',
    },
    {
        name: 'Experience',
        url: '/#my-experience',
    },
    {
        name: 'CVEs',
        url: '/#cve-list',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
    },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <div className="sticky top-0 z-[50]">
                {/* Mobile Hamburger Button */}
                <button
                    className={cn(
                        'md:hidden group size-12 absolute top-5 right-5 z-[50]',
                    )}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span
                        className={cn(
                            'inline-block w-3/5 h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 -translate-y-[5px] ',
                            {
                                'rotate-45 -translate-y-1/2': isMenuOpen,
                                'md:group-hover:rotate-12': !isMenuOpen,
                            },
                        )}
                    ></span>
                    <span
                        className={cn(
                            'inline-block w-3/5 h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 translate-y-[5px] ',
                            {
                                '-rotate-45 -translate-y-1/2': isMenuOpen,
                                'md:group-hover:-rotate-12': !isMenuOpen,
                            },
                        )}
                    ></span>
                </button>
            </div>

            <div
                className={cn(
                    'overlay fixed inset-0 z-[2] bg-black/70 transition-all duration-150',
                    {
                        'opacity-0 invisible pointer-events-none': !isMenuOpen,
                    },
                )}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            <div
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] w-[500px] max-w-[calc(100vw-3rem)] transform translate-x-full transition-transform duration-700 z-[3] overflow-hidden gap-y-14',
                    'flex flex-col lg:justify-center py-10',
                    { 'translate-x-0': isMenuOpen },
                )}
            >
                <div
                    className={cn(
                        'fixed inset-0 scale-150 translate-x-1/2 rounded-[50%] bg-background-light duration-700 delay-150 z-[-1]',
                        {
                            'translate-x-0': isMenuOpen,
                        },
                    )}
                ></div>

                <div className="grow flex md:items-center w-full max-w-[300px] mx-8 sm:mx-auto">
                    <div className="flex gap-10 lg:justify-between max-lg:flex-col w-full">
                        <div className="max-lg:order-2">
                            <p className="text-muted-foreground mb-5 md:mb-8">
                                SOCIAL
                            </p>
                            <ul className="space-y-3">
                                {SOCIAL_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-lg capitalize hover:underline"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="">
                            <p className="text-muted-foreground mb-5 md:mb-8">
                                MENU
                            </p>
                            <ul className="space-y-3">
                                {MENU_LINKS.map((link, idx) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() => {
                                                router.push(link.url);
                                                setIsMenuOpen(false);
                                            }}
                                            className="group text-xl flex items-center gap-3"
                                        >
                                            <span
                                                className={cn(
                                                    'size-3.5 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-[200%] transition-all',
                                                    COLORS[idx],
                                                )}
                                            >
                                                <MoveUpRight
                                                    size={8}
                                                    className="scale-0 group-hover:scale-100 transition-all"
                                                />
                                            </span>
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[300px] mx-8 sm:mx-auto">
                    <p className="text-muted-foreground mb-4">GET IN TOUCH</p>
                    <a href={`mailto:${GENERAL_INFO.email}`}>
                        {GENERAL_INFO.email}
                    </a>
                </div>
            </div>

            {/* Desktop Floating Pill Navbar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[50] hidden md:block">
                <FloatingDock
                    items={[
                        {
                            title: 'Home',
                            icon: <Home className="h-full w-full text-neutral-300" />,
                            href: '/',
                        },
                        {
                            title: 'About Me',
                            icon: <User className="h-full w-full text-neutral-300" />,
                            href: '/#about-me',
                        },
                        {
                            title: 'Skills',
                            icon: <Code2 className="h-full w-full text-neutral-300" />,
                            href: '/#my-stack',
                        },
                        {
                            title: 'Experience',
                            icon: <Briefcase className="h-full w-full text-neutral-300" />,
                            href: '/#my-experience',
                        },
                        {
                            title: 'CVEs',
                            icon: <Bug className="h-full w-full text-neutral-300" />,
                            href: '/#cve-list',
                        },
                        {
                            title: 'Projects',
                            icon: <Folder className="h-full w-full text-neutral-300" />,
                            href: '/#selected-projects',
                        },
                        {
                            title: 'Contact',
                            icon: <Mail className="h-full w-full text-neutral-300" />,
                            href: `mailto:${GENERAL_INFO.email}`,
                        },
                        {
                            title: 'Download CV',
                            icon: <Download className="h-full w-full text-neutral-300" />,
                            href: '/0xAbdulMaruF.pdf',
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default Navbar;
