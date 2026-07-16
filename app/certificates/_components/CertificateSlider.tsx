'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { ICertificate } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CertificateSliderProps {
    certificates: ICertificate[];
    companyColor: string;
    onCertClick: (cert: ICertificate) => void;
}

export default function CertificateSlider({
    certificates,
    companyColor,
    onCertClick,
}: CertificateSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const isDraggingRef = useRef(false);

    // Reset index when certificates change
    useEffect(() => {
        setActiveIndex(0);
    }, [certificates]);

    const goTo = useCallback(
        (index: number) => {
            if (index < 0) index = certificates.length - 1;
            if (index >= certificates.length) index = 0;
            setActiveIndex(index);
        },
        [certificates.length]
    );

    const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
    const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

    // Keyboard nav
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [goPrev, goNext]);

    // Swipe gesture
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        startXRef.current = e.clientX;
        isDraggingRef.current = true;
    }, []);

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const diff = e.clientX - startXRef.current;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goPrev() : goNext();
            }
        },
        [goPrev, goNext]
    );

    if (certificates.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground font-mono text-sm">
                    No certificates in this category
                </p>
            </div>
        );
    }

    const activeCert = certificates[activeIndex];

    const getSlideStyle = (index: number): React.CSSProperties => {
        const offset = index - activeIndex;
        const absOffset = Math.abs(offset);

        if (absOffset > 2) {
            return {
                opacity: 0,
                transform: `translateX(${offset * 200}px) scale(0.6) rotateY(${offset * 20}deg)`,
                zIndex: 0,
                pointerEvents: 'none',
            };
        }

        return {
            opacity: absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : 0.4,
            transform: `translateX(${offset * 280}px) scale(${1 - absOffset * 0.15}) rotateY(${offset * -15}deg) translateZ(${-absOffset * 80}px)`,
            zIndex: 10 - absOffset,
            filter: absOffset > 0 ? `blur(${absOffset * 1.5}px)` : 'none',
            pointerEvents: absOffset === 0 ? 'auto' : 'none',
        } as React.CSSProperties;
    };

    return (
        <div>
            <div
                ref={containerRef}
                className="cert-slider-container"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                {/* Prev button */}
                <button
                    className="cert-slider-nav prev"
                    onClick={goPrev}
                    aria-label="Previous certificate"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Slides */}
                <div className="cert-slider-track">
                    {certificates.map((cert, index) => (
                        <div
                            key={`${cert.title}-${index}`}
                            className={`cert-slide ${index === activeIndex ? 'active' : ''}`}
                            style={getSlideStyle(index)}
                            onClick={() => {
                                if (index === activeIndex) onCertClick(cert);
                            }}
                        >
                            <div className="cert-slide-inner">
                                <div
                                    className="cert-slide-image"
                                    style={{
                                        backgroundImage: `url(${cert.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <div className="cert-slide-info">
                                    <p className="cert-slide-title">
                                        {cert.title}
                                    </p>
                                    <p className="cert-slide-meta">
                                        <span>{cert.company}</span> ·{' '}
                                        {cert.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Next button */}
                <button
                    className="cert-slider-nav next"
                    onClick={goNext}
                    aria-label="Next certificate"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Detail panel below slider */}
            <div className="cert-detail-panel">
                <h4 className="cert-detail-title">{activeCert.title}</h4>
                <p className="cert-detail-company">{activeCert.company}</p>
                <p className="cert-detail-date">{activeCert.date}</p>
                {activeCert.credentialId && (
                    <span className="cert-detail-id">
                        ID: {activeCert.credentialId}
                    </span>
                )}
                {activeCert.verifyUrl && activeCert.verifyUrl !== '#' && (
                    <a
                        href={activeCert.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-3 text-sm text-primary hover:underline font-mono"
                    >
                        Verify Certificate →
                    </a>
                )}
            </div>
        </div>
    );
}
