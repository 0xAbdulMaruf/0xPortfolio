'use client';
import { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ICertificate } from '@/types';
import { X } from 'lucide-react';

interface CertificateLightboxProps {
    cert: ICertificate;
    onClose: () => void;
}

export default function CertificateLightbox({
    cert,
    onClose,
}: CertificateLightboxProps) {
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [handleEscape]);

    return (
        <motion.div
            className="cert-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <button
                className="cert-lightbox-close"
                onClick={onClose}
                aria-label="Close lightbox"
            >
                <X size={18} />
            </button>

            <motion.div
                className="cert-lightbox-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={cert.image}
                    alt={cert.title}
                    className="cert-lightbox-image"
                />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        {cert.title}
                    </h3>
                    <p className="text-sm text-primary font-mono">
                        {cert.company}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                        {cert.date}
                        {cert.credentialId && ` · ID: ${cert.credentialId}`}
                    </p>
                    {cert.verifyUrl && cert.verifyUrl !== '#' && (
                        <a
                            href={cert.verifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-3 text-sm text-primary hover:underline font-mono"
                        >
                            Verify Certificate →
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
