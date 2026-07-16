import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "0xLinux — 0xMaruF's Space",
    description:
        'An interactive Linux desktop environment experience by 0xMaruF.',
};

export default function SpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                overflow: 'hidden',
                background:
                    'linear-gradient(135deg, #0b1016 0%, #0a0d13 45%, #101722 100%)',
            }}
        >
            {children}
        </div>
    );
}
