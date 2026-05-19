'use client';
import SectionTitle from '@/components/SectionTitle';
import { CVE_LIST } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const severityColor: Record<string, string> = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-orange-400',
    Critical: 'text-red-400',
};

const severityBg: Record<string, string> = {
    Low: 'bg-green-500/10 border-green-500/20',
    Medium: 'bg-yellow-500/10 border-yellow-500/20',
    High: 'bg-orange-500/10 border-orange-500/20',
    Critical: 'bg-red-500/10 border-red-500/20',
};

const CVEList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    x: i % 2 === 0 ? -80 : 80,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 50%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 60%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.to(containerRef.current, {
                y: -120,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="py-section" id="cve-list">
            <div className="container" ref={containerRef}>
                <SectionTitle title="CVE Discoveries" />

                <div className="grid gap-6">
                    {CVE_LIST.map((cve, index) => (
                        <div
                            key={cve.id}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className={`rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 ${severityBg[cve.severity] || 'bg-card border-border/50'}`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm bg-foreground/10 px-3 py-1 rounded-md">
                                        {cve.id}
                                    </span>
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded ${severityColor[cve.severity] || 'text-gray-400'}`}
                                    >
                                        {cve.severity}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        CVSS {cve.cvss}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground">
                                        {cve.status}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                {cve.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {cve.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CVEList;
