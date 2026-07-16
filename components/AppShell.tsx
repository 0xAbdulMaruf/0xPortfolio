'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

export default function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isSpaceRoute = pathname?.startsWith('/space');

    return (
        <>
            {!isSpaceRoute && <Navbar />}
            <main>{children}</main>
            {!isSpaceRoute && <Footer />}
            {!isSpaceRoute && <ParticleBackground />}
        </>
    );
}