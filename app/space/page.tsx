'use client';
import dynamic from 'next/dynamic';

const Desktop = dynamic(() => import('./_components/Desktop'), {
    ssr: false,
    loading: () => (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                background: '#1e1e2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderTop: '2px solid #89b4fa',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
        </div>
    ),
});

export default function SpacePage() {
    return <Desktop />;
}
