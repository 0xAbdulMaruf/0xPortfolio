import { AlertTriangle } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return (
        <>
            {isProduction && (
                <div className="bg-red-900/50 text-red-200 p-2 text-center text-sm font-mono flex items-center justify-center gap-2 border-b border-red-500/30">
                    <AlertTriangle size={14} />
                    <strong>Warning:</strong> You are running in Production Mode. Saving changes is disabled because the filesystem is read-only. Run <code>npm run dev</code> to enable saving.
                </div>
            )}
            {children}
        </>
    );
}
