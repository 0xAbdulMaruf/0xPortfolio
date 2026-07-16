import { Metadata } from 'next';
import CertificatesPage from './_components/CertificatesPage';
import ClickSpark from '@/components/ClickSpark';

export const metadata: Metadata = {
    title: 'Certificates & Achievements — Abdul MaruF',
    description:
        'Explore my professional certifications and achievements in cybersecurity, networking, and programming.',
};

export default function Page() {
    return (
        <ClickSpark
            sparkColor="#00ff41"
            sparkSize={12}
            sparkRadius={20}
            sparkCount={8}
            duration={400}
        >
            <CertificatesPage />
        </ClickSpark>
    );
}
