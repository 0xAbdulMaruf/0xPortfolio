'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import Lanyard from '@/components/Lanyard/Lanyard';
import { GENERAL_INFO } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';
import ElasticLine from '@/components/fancy/physics/elastic-line';
import Letter3DSwap from '@/components/fancy/text/letter-3d-swap';
gsap.registerPlugin(ScrollTrigger, useGSAP);

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // move the content a little up on scroll
    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 70%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.fromTo(
                '.slide-up-and-fade',
                { y: 0 },
                { y: -150, opacity: 0, stagger: 0.02 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[3] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsla(140,100%,47%,0.06)_0%,_transparent_60%)] pointer-events-none" />

            {/* Elastic Line Interaction */}
            <div className="absolute left-0 top-0 w-full h-full z-[0] opacity-30 pointer-events-auto text-primary">
                <ElasticLine
                    grabThreshold={150}
                    releaseThreshold={300}
                    strokeWidth={2}
                    animateInTransition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        delay: 0.15,
                    }}
                />
            </div>

            <ArrowAnimation />

            {/* Lanyard - right side, absolute so it doesn't affect layout */}
            <div className="absolute right-0 top-0 w-1/2 h-full z-[2] max-md:hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                <div className="pointer-events-auto w-full h-full relative z-[1]">
                    <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
                </div>
            </div>

            <div
                className="container h-[100svh] min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col relative z-[1]"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px]">
                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-6xl sm:text-[80px] font-anton cursor-default z-10 relative">
                        <Letter3DSwap
                            as="span"
                            rotateDirection="top"
                            frontFaceClassName="text-primary drop-shadow-[0_0_30px_hsla(140,100%,47%,0.3)]"
                            secondFaceClassName="text-foreground"
                            staggerFrom="first"
                            staggerDuration={0.02}
                        >
                            OFFENSIVE
                        </Letter3DSwap>
                        <Letter3DSwap
                            as="span"
                            mainClassName="ml-4 mt-2"
                            rotateDirection="bottom"
                            frontFaceClassName="text-foreground"
                            secondFaceClassName="text-primary drop-shadow-[0_0_30px_hsla(140,100%,47%,0.3)]"
                            staggerFrom="last"
                            staggerDuration={0.02}
                        >
                            SECURITY
                        </Letter3DSwap>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-6 text-lg text-muted-foreground">
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground">
                            MaruF
                        </span>
                        . A Cybersecurity Student passionate about offensive
                        security, bug hunting, and AI-driven security automation.
                    </p>
                    <Button
                        as="link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`mailto:${GENERAL_INFO.email}`}
                        variant="primary"
                        className="mt-9 banner-button slide-up-and-fade glitch-hover"
                        data-text="Let's Talk"
                    >
                        Let&apos;s Talk
                    </Button>

                    <div className="flex items-center gap-2.5 mt-3">
                        <span className="relative flex size-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex size-2.5 rounded-full bg-primary"></span>
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Open to security research opportunities
                        </span>
                    </div>
                </div>

                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-4 md:gap-8 text-center md:text-right">
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            2+
                        </h5>
                        <p className="text-muted-foreground">
                            Years of Learning
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            5+
                        </h5>
                        <p className="text-muted-foreground">
                            Security Tools Mastered
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            10+
                        </h5>
                        <p className="text-muted-foreground">Vulnerabilities Found</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
