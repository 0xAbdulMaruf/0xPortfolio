'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import CertificateSlider from './CertificateSlider';
import CategoryFilter from './CategoryFilter';
import CertificateLightbox from './CertificateLightbox';
import SectionTitle from '@/components/SectionTitle';
import { CERTIFICATES, CERTIFICATE_COMPANIES } from '@/lib/data';
import { ICertificate } from '@/types';
import { ArrowLeft } from 'lucide-react';
import '../certificates.css';
import CompanyGlobe from './CompanyGlobe';

export default function CertificatesPage() {
    const [view, setView] = useState<'globe' | 'gallery'>('globe');
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [lightboxCert, setLightboxCert] = useState<ICertificate | null>(null);

    const companyCerts = selectedCompany
        ? CERTIFICATES.filter((c) => c.company === selectedCompany)
        : [];

    const filteredCerts =
        activeCategory === 'All'
            ? companyCerts
            : companyCerts.filter((c) => c.category === activeCategory);

    const categories = [
        'All',
        ...Array.from(new Set(companyCerts.map((c) => c.category))),
    ];

    const companyData = selectedCompany
        ? CERTIFICATE_COMPANIES.find((c) => c.name === selectedCompany)
        : null;

    const handleSelectCompany = useCallback((name: string) => {
        setSelectedCompany(name);
        setActiveCategory('All');
        setView('gallery');
    }, []);

    const handleBack = useCallback(() => {
        setView('globe');
        setSelectedCompany(null);
        setActiveCategory('All');
    }, []);

    return (
        <section className="certificates-page" id="certificates">
            <div className="certificates-page-inner">
                <SectionTitle title="Certificates & Achievements" />

                <AnimatePresence mode="wait">
                    {view === 'globe' && (
                        <motion.div
                            key="globe"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <CompanyGlobe onSelectCompany={handleSelectCompany} />
                        </motion.div>
                    )}

                    {view === 'gallery' && selectedCompany && (
                        <motion.div
                            key="gallery"
                            className="cert-gallery"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <div className="cert-gallery-header">
                                <button
                                    className="cert-back-btn"
                                    onClick={handleBack}
                                    aria-label="Back to globe"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {selectedCompany}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {companyCerts.length} certificate
                                        {companyCerts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <CategoryFilter
                                categories={categories}
                                active={activeCategory}
                                onChange={setActiveCategory}
                            />

                            <CertificateSlider
                                certificates={filteredCerts}
                                companyColor={companyData?.color || '#00ff41'}
                                onCertClick={setLightboxCert}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {lightboxCert && (
                    <CertificateLightbox
                        cert={lightboxCert}
                        onClose={() => setLightboxCert(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
