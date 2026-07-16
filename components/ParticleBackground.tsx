'use client';
import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
}

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 100;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            if (particles.length === 0) {
                particles = Array.from({ length: particleCount }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speed: Math.random() * 0.5 + 0.2,
                    opacity: Math.random(),
                }));
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.y += p.speed;

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                    p.speed = Math.random() * 0.5 + 0.2;
                    p.opacity = Math.random();
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none block"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default ParticleBackground;
