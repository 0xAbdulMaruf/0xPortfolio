'use client';

import type { HTMLAttributes, ReactNode, MouseEvent } from 'react';
import { useId, useRef } from 'react';

import { cn } from '@/lib/utils';

interface MagicCardProps extends HTMLAttributes<HTMLDivElement> {
    imageUrl: string;
    title: string;
    icon?: ReactNode;
}

export const MagicCard = ({
    imageUrl,
    title,
    icon,
    className,
    ...props
}: MagicCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const id = useId();
    const filterId = `magic-card-blur-${id.replace(/:/g, '')}`;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const relativeX = e.clientX - centerX;
        const relativeY = e.clientY - centerY;

        const x = (relativeX / (rect.width / 2)).toFixed(3);
        const y = (relativeY / (rect.height / 2)).toFixed(3);

        card.style.setProperty('--pointer-x', x);
        card.style.setProperty('--pointer-y', y);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;

        card.style.setProperty('--pointer-x', '-10');
        card.style.setProperty('--pointer-y', '-10');
    };

    return (
        <article
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                'group relative w-full cursor-pointer rounded-[24px] outline outline-1 outline-white/10 bg-white/5 transition-transform duration-300 active:scale-[0.99] active:translate-y-px [container-type:size] overflow-hidden',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-[24px]">
                <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        transform: 'translateZ(0)',
                        filter: `url(#${filterId}) saturate(4) brightness(1.15) contrast(1.2)`,
                        translate:
                            'calc(var(--pointer-x, -10) * 45cqi) calc(var(--pointer-y, -10) * 45cqh)',
                        scale: '3.25',
                        willChange: 'transform, filter',
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="" className="w-full h-full object-cover select-none" />
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

                <div className="relative z-[2] flex h-full w-full flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur-md">
                            Company
                        </div>
                        {icon ? (
                            <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/75 backdrop-blur-md">
                                {icon}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={title}
                            className="h-16 w-16 rounded-2xl border border-white/10 bg-black/20 object-contain p-3 shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur-sm"
                        />
                        <div>
                            <h3 className="m-0 text-2xl font-semibold tracking-tight text-white">
                                {title}
                            </h3>
                            <p className="mt-1 text-sm text-white/55">
                                Click to open the certificate collection
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="pointer-events-none absolute inset-0 z-[2] rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md backdrop-saturate-[2.5]"
                style={{
                    mask: 'linear-gradient(#fff 0 100%) border-box, linear-gradient(#fff 0 100%) padding-box',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                }}
            />

            <svg className="absolute h-0 w-0 overflow-visible opacity-0 pointer-events-none">
                <defs>
                    <filter id={filterId} width="500%" height="500%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="28" />
                    </filter>
                </defs>
            </svg>
        </article>
    );
};

export default MagicCard;