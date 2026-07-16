'use client';

import { useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SlidingLogoMarqueeItem {
    id: string;
    content: React.ReactNode;
    href?: string;
    label?: string;
    sublabel?: string;
}

export interface SlidingLogoMarqueeProps {
    items: SlidingLogoMarqueeItem[];
    speed?: number;
    pauseOnHover?: boolean;
    enableBlur?: boolean;
    blurIntensity?: number;
    height?: string;
    width?: string;
    gap?: string;
    scale?: number;
    direction?: 'horizontal' | 'vertical';
    autoPlay?: boolean;
    backgroundColor?: string;
    showGridBackground?: boolean;
    className?: string;
    onItemClick?: (item: SlidingLogoMarqueeItem) => void;
    enableSpillEffect?: boolean;
    animationSteps?: number;
    showControls?: boolean;
}

export function SlidingLogoMarquee({
    items,
    speed = 40,
    pauseOnHover = true,
    enableBlur = true,
    blurIntensity = 1.2,
    height = '180px',
    width = '100%',
    gap = '1rem',
    scale = 1,
    direction = 'horizontal',
    autoPlay = true,
    backgroundColor = 'transparent',
    showGridBackground = false,
    className,
    onItemClick,
    enableSpillEffect = false,
    animationSteps = 8,
    showControls = true,
}: SlidingLogoMarqueeProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    const duplicatedItems = useMemo(() => [...items, ...items], [items]);

    const blurDivs = Array.from({ length: animationSteps }, (_, index) => (
        <div
            key={index}
            style={{ '--index': index } as React.CSSProperties}
            className="absolute inset-0 z-[var(--index)]"
        />
    ));

    const handleItemClick = (item: SlidingLogoMarqueeItem) => {
        if (item.href) {
            window.open(item.href, '_blank', 'noopener,noreferrer');
        }
        onItemClick?.(item);
    };

    return (
        <div
            className={cn('sliding-marquee-container relative', className)}
            style={{ width, background: backgroundColor, scale }}
            onMouseEnter={() => pauseOnHover && setIsPlaying(false)}
            onMouseLeave={() => pauseOnHover && setIsPlaying(true)}
        >
            {showGridBackground && (
                <div className="absolute inset-0 pointer-events-none opacity-5">
                    <div className="h-full w-full bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
            )}

            <div
                className="sliding-marquee-resizable"
                data-direction={direction}
                data-play-state={isPlaying ? 'running' : 'paused'}
                data-spill={enableSpillEffect}
                style={{ height }}
            >
                <div className="sliding-marquee-inner">
                    {enableBlur && (
                        <div className="sliding-marquee-blur sliding-marquee-blur--left">
                            {blurDivs}
                        </div>
                    )}

                    <ul
                        className="sliding-marquee-list text-foreground"
                        aria-hidden={false}
                        style={{ gap }}
                    >
                        {duplicatedItems.map((item, index) => (
                            <li
                                key={`${item.id}-${index}`}
                                className="sliding-marquee-item"
                                onClick={() => handleItemClick(item)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleItemClick(item);
                                    }
                                }}
                            >
                                <div className="sliding-marquee-card">
                                    <div className="sliding-marquee-logo">
                                        {item.content}
                                    </div>
                                    {item.label && (
                                        <div className="sliding-marquee-label">
                                            {item.label}
                                        </div>
                                    )}
                                    {item.sublabel && (
                                        <div className="sliding-marquee-sublabel">
                                            {item.sublabel}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {enableBlur && (
                        <div className="sliding-marquee-blur sliding-marquee-blur--right">
                            {blurDivs}
                        </div>
                    )}
                </div>
            </div>

            {showControls && (
                <button
                    onClick={() => setIsPlaying((current) => !current)}
                    className={cn(
                        'absolute top-1/2 right-3 transform -translate-y-1/2 z-10 p-2 text-xs',
                        'bg-black/40 text-white/80 rounded-full border border-white/10 backdrop-blur-md',
                        'hover:bg-black/60 hover:text-white transition-colors'
                    )}
                    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                    {isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </button>
            )}
        </div>
    );
}

export default SlidingLogoMarquee;