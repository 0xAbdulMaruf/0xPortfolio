'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

import TextHighlighter from '@/components/fancy/text/text-highlighter';

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 0.5,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.02,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-thin mb-20 slide-up-and-fade leading-tight">
                    I believe in an{' '}
                    <TextHighlighter
                        highlightColor="rgba(0, 255, 65, 0.25)"
                        className="rounded-lg px-2 -mx-2 font-medium text-foreground"
                    >
                        offensive-first security approach
                    </TextHighlighter>
                    , ensuring that every system I test is thoroughly assessed for
                    vulnerabilities before attackers can exploit them.
                </h2>

                <p className="pb-3 border-b text-muted-foreground slide-up-and-fade">
                    This is me.
                </p>

                <div className="grid md:grid-cols-12 mt-9">
                    <div className="md:col-span-5">
                        <p className="text-5xl slide-up-and-fade">
                            Hi, I&apos;m MaruF.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-lg text-muted-foreground max-w-[450px]">
                            <p className="slide-up-and-fade">
                                I&apos;m a Computer Science student focused on{' '}
                                <TextHighlighter
                                    highlightColor="rgba(0, 255, 65, 0.15)"
                                    className="rounded-md px-1 text-foreground"
                                >
                                    offensive security, web application security, and
                                    bug hunting
                                </TextHighlighter>
                                . I specialize in reconnaissance,
                                exploitation workflows, and security tooling
                                automation.
                            </p>
                            <p className="mt-4 slide-up-and-fade">
                                My approach combines hands-on vulnerability
                                discovery with{' '}
                                <TextHighlighter
                                    highlightColor="rgba(0, 255, 65, 0.15)"
                                    className="rounded-md px-1 text-foreground"
                                >
                                    AI-powered cybersecurity automation
                                </TextHighlighter>
                                {' '}using LLMs and MCP frameworks. I&apos;m passionate
                                about Linux systems, building security tools, and
                                continuously learning new attack vectors and
                                defense techniques.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
