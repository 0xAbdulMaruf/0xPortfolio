'use client';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { useRef, useState, MouseEvent } from 'react';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const projectListRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PROJECTS.length > 0 ? PROJECTS[0].slug : null,
    );

    // update imageRef.current href based on the cursor hover position
    // also update image position
    useGSAP(
        (context, contextSafe) => {
            // show image on hover
            if (window.innerWidth < 768) {
                setSelectedProject(null);
                return;
            }

            const container = containerRef.current;
            if (!container) return;

            const handleMouseMove = contextSafe?.((e: MouseEvent) => {
                if (!imageContainer.current) return;

                if (window.innerWidth < 768) {
                    setSelectedProject(null);
                    return;
                }

                const containerRect = container.getBoundingClientRect();
                const imageRect = imageContainer.current.getBoundingClientRect();
                const offsetTop = e.clientY - containerRect.y;

                gsap.to(imageContainer.current, {
                    y: offsetTop - imageRect.height / 2,
                    duration: 1,
                    opacity: 1,
                });
            }) as any;

            const handleMouseLeave = contextSafe?.(() => {
                if (imageContainer.current) {
                    gsap.to(imageContainer.current, {
                        duration: 0.3,
                        opacity: 0,
                    });
                }
            }) as any;

            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            };
        },
        { scope: containerRef, dependencies: [containerRef.current] },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    const handleMouseEnter = (slug: string) => {
        if (window.innerWidth < 768) {
            setSelectedProject(null);
            return;
        }

        setSelectedProject(slug);
    };

    return (
        <section className="pb-section" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />

                <div className="group/projects relative" ref={containerRef}>
                    {selectedProject !== null && (
                        <div
                            className="max-md:hidden absolute right-0 top-0 z-[1] pointer-events-none w-[200px] xl:w-[350px] aspect-[3/4] overflow-hidden opacity-0"
                            ref={imageContainer}
                        >
                            {PROJECTS.map((project) => (
                                <Image
                                    src={project.thumbnail}
                                    alt="Project"
                                    width="400"
                                    height="500"
                                    className={cn(
                                        'absolute inset-0 transition-all duration-500 w-full h-full object-cover',
                                        {
                                            'opacity-0':
                                                project.slug !==
                                                selectedProject,
                                        },
                                    )}
                                    ref={imageRef}
                                    key={project.slug}
                                />
                            ))}
                        </div>
                    )}

                    <div
                        className="flex flex-col max-md:gap-10"
                        ref={projectListRef}
                    >
                        {PROJECTS.map((project, index) => (
                            <Project
                                index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={handleMouseEnter}
                                key={project.slug}
                            />
                        ))}
                        
                        {/* Coming Soon Item */}
                        <div className="project-item group leading-none py-8 md:border-b first:!pt-0 last:pb-0 last:border-none transition-all select-none opacity-80 mt-10">
                            <div className="flex gap-2 md:gap-5">
                                <div className="font-mono text-muted-foreground/50">
                                    _{(PROJECTS.length + 1).toString().padStart(2, '0')}.
                                </div>
                                <div className="w-full">
                                    <div className="border border-dashed border-white/10 bg-black/40 backdrop-blur-sm p-6 rounded-lg relative overflow-hidden group-hover:border-primary/20 transition-all">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                        <h4 className="text-xl md:text-3xl flex items-center gap-4 font-mono text-muted-foreground/70 tracking-widest uppercase">
                                            <span className="text-primary/70">🔒</span>
                                            [CLASSIFIED_UNTIL_RELEASE]
                                        </h4>
                                        <div className="mt-6 flex flex-wrap gap-4 text-muted-foreground/50 text-xs font-mono">
                                            <div className="gap-3 flex items-center bg-white/5 px-3 py-1.5 rounded">
                                                <span>New_Tools.exe</span>
                                            </div>
                                            <div className="gap-3 flex items-center bg-white/5 px-3 py-1.5 rounded">
                                                <span>Research_Data.bin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
