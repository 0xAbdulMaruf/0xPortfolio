'use client';
import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { MY_STACK } from '@/lib/data';
import Image from 'next/image';

const Skills = () => {
    return (
        <section id="my-stack" className="py-12 md:py-24 overflow-hidden relative">
            <div className="container relative z-10 pointer-events-none">
                <SectionTitle title="My Stack" />
            </div>

            <div className="-mt-32">
                <MacbookScroll
                    title={
                        <span className="text-4xl md:text-5xl font-anton uppercase text-muted-foreground/80 pointer-events-none">
                            The Tools Behind The <br className="md:hidden" /><span className="text-primary drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">Hacks</span>
                        </span>
                    }
                    showGradient={false}
                >
                    {/* Screen Content - macOS Glossy Style */}
                    <div className="w-full h-full p-2 sm:p-6 flex flex-col relative overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                            alt="macOS Wallpaper"
                            fill
                            sizes="(max-width: 768px) 100vw, 1200px"
                            className="object-cover object-center z-0"
                            priority={false}
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10"></div>
                        
                        {/* macOS Top Bar */}
                        <div className="w-full h-6 bg-white/10 backdrop-blur-2xl border-b border-white/20 flex items-center px-4 justify-between absolute top-0 left-0 z-20 shadow-sm">
                            <div className="flex gap-4 items-center">
                                <span className="font-bold text-[12px] text-white"></span>
                                <span className="font-semibold text-[10px] text-white">Finder</span>
                                <span className="text-[10px] text-white/80 hidden sm:inline-block">File</span>
                                <span className="text-[10px] text-white/80 hidden sm:inline-block">Edit</span>
                                <span className="text-[10px] text-white/80 hidden sm:inline-block">View</span>
                                <span className="text-[10px] text-white/80 hidden sm:inline-block">Go</span>
                                <span className="text-[10px] text-white/80 hidden sm:inline-block">Window</span>
                                <span className="text-[10px] text-white/80 hidden sm:inline-block">Help</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className="text-[10px] text-white/90 font-medium">100%</span>
                                <span className="text-[10px] text-white font-medium font-sans tracking-wide">Tue 9:41 AM</span>
                            </div>
                        </div>
 
                        {/* Content Area */}
                        <div className="mt-8 flex-1 flex flex-col justify-center relative z-20 pb-4">
                            <div className="max-w-[98%] mx-auto grid grid-cols-2 gap-3 w-full">
                                {Object.entries(MY_STACK).map(([category, skills]) => (
                                    <div key={category} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                        <h4 className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-widest mb-2 pl-2 border-l-2 border-primary relative z-10 drop-shadow-md">
                                            {category}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 sm:gap-3 relative z-10">
                                            {skills.map((skill) => (
                                                <div
                                                    key={skill.name}
                                                    className="flex flex-col items-center gap-1 group cursor-pointer w-10 sm:w-12"
                                                    title={skill.name}
                                                >
                                                    <div className="size-8 sm:size-10 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-2xl border border-white/30 rounded-[22%] shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_rgba(0,255,65,0.5),inset_0_1px_2px_rgba(255,255,255,0.9)] group-hover:border-primary/60 relative overflow-hidden">
                                                        {/* Glossy reflection highlight */}
                                                        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent rounded-t-[22%]"></div>
                                                        <Image
                                                            src={skill.icon}
                                                            alt={skill.name}
                                                            width={24}
                                                            height={24}
                                                            className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 transition-transform group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <span className="text-[7px] sm:text-[8px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center leading-tight bg-black/40 px-1 py-0.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {skill.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </MacbookScroll>
            </div>
        </section>
    );
};

export default Skills;
