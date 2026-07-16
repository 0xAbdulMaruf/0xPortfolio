'use client';
import { useMemo } from 'react';
import { CERTIFICATE_COMPANIES, CERTIFICATES } from '@/lib/data';
import MagicCard from './MagicCard';

interface CompanyGlobeProps {
    onSelectCompany: (name: string) => void;
}

/* ───── Exported component ───── */
export default function CompanyGlobe({ onSelectCompany }: CompanyGlobeProps) {
    const marqueeItems = useMemo(
        () =>
            CERTIFICATE_COMPANIES.map((company) => {
                const certCount = CERTIFICATES.filter(
                    (cert) => cert.company === company.name
                ).length;

                return { company, certCount };
            }),
        []
    );

    return (
        <div className="cert-magic-grid">
            {marqueeItems.map(({ company, certCount }) => (
                <MagicCard
                    key={company.name}
                    imageUrl={company.logo}
                    title={company.name}
                    icon={<span>{certCount} cert{certCount === 1 ? '' : 's'}</span>}
                    className="cert-magic-card"
                    onClick={() => onSelectCompany(company.name)}
                />
            ))}
        </div>
    );
}
