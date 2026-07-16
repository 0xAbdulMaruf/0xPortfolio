import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Arch Linux — 0xMaruF's Space",
    description:
        'An interactive Arch Linux & Hyprland desktop environment experience by 0xMaruF.',
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
                    '#1e1e2e', // Catppuccin Mocha Base
            }}
        >
            {children}
        </div>
    );
}
