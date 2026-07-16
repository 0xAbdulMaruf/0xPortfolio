'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
    history: { x: number; y: number }[];
}

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        hasMoved: false,
    });
    const [isDarkMode, setIsDarkMode] = useState(true);

    const colorsDark = useMemo(
        () => [
            'rgba(114, 159, 255,',
            'rgba(145, 211, 255,',
            'rgba(180, 146, 255,',
            'rgba(109, 231, 255,',
        ],
        []
    );

    const colorsLight = useMemo(
        () => [
            'rgba(79, 110, 247,',
            'rgba(99, 102, 241,',
            'rgba(16, 185, 129,',
            'rgba(236, 72, 153,',
        ],
        []
    );

    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        const canvas = canvasRef.current;
        if (!canvas) {
            return () => observer.disconnect();
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            observer.disconnect();
            return;
        }

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let particles: Particle[] = [];
        const particleCount = 160;

        const resizeCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            mouseRef.current.targetX = width / 2;
            mouseRef.current.targetY = height / 2;

            if (particles.length === 0) {
                particles = Array.from({ length: particleCount }, (_, index) => {
                    const pX = Math.random() * width;
                    const pY = Math.random() * height;
                    const palette = isDarkMode ? colorsDark : colorsLight;

                    return {
                        x: pX,
                        y: pY,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                        size: (Math.random() * 0.9 + 0.4) * (index % 3 === 0 ? 1.6 : 1),
                        color: palette[Math.floor(Math.random() * palette.length)],
                        opacity: Math.random() * 0.45 + 0.25,
                        history: [],
                    };
                });
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.targetX = e.clientX - rect.left;
            mouseRef.current.targetY = e.clientY - rect.top;
            mouseRef.current.hasMoved = true;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!mouseRef.current.hasMoved) {
                const cx = width / 2;
                const cy = height / 2;
                const radius = Math.min(width, height) * 0.12;
                const time = performance.now() * 0.00018;
                mouseRef.current.targetX = cx + Math.cos(time) * radius;
                mouseRef.current.targetY = cy + Math.sin(time * 1.2) * radius;
            }

            mouseRef.current.x +=
                (mouseRef.current.targetX - mouseRef.current.x) * 0.025;
            mouseRef.current.y +=
                (mouseRef.current.targetY - mouseRef.current.y) * 0.025;

            const mX = mouseRef.current.x;
            const mY = mouseRef.current.y;

            particles.forEach((particle, index) => {
                const windX = Math.sin(performance.now() * 0.00012 + index) * 0.008;
                const windY = Math.cos(performance.now() * 0.00009 + index * 0.7) * 0.004;

                particle.vx += windX;
                particle.vy += windY;

                const dx = mX - particle.x;
                const dy = mY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const influenceRadius = 220;

                if (distance < influenceRadius) {
                    const force = (1 - distance / influenceRadius) * 0.28;
                    const swirlX = -dy / distance;
                    const swirlY = dx / distance;

                    particle.vx += (dx / distance) * force * 0.03;
                    particle.vy += (dy / distance) * force * 0.03;
                    particle.vx += swirlX * force * 0.12;
                    particle.vy += swirlY * force * 0.12;
                }

                particle.vx *= 0.985;
                particle.vy *= 0.985;

                particle.x += particle.vx * 0.9;
                particle.y += particle.vy * 0.9;

                particle.history.push({ x: particle.x, y: particle.y });
                if (particle.history.length > 8) {
                    particle.history.shift();
                }

                if (
                    particle.x < -30 ||
                    particle.x > width + 30 ||
                    particle.y < -30 ||
                    particle.y > height + 30
                ) {
                    const palette = isDarkMode ? colorsDark : colorsLight;
                    particles[index] = {
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.35,
                        vy: (Math.random() - 0.5) * 0.35,
                        size: Math.random() * 1.2 + 0.35,
                        color: palette[Math.floor(Math.random() * palette.length)],
                        opacity: Math.random() * 0.45 + 0.2,
                        history: [],
                    };
                    return;
                }

                if (particle.history.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(particle.history[0].x, particle.history[0].y);
                    for (let i = 1; i < particle.history.length; i += 1) {
                        ctx.lineTo(particle.history[i].x, particle.history[i].y);
                    }
                    ctx.strokeStyle = `${particle.color}${particle.opacity * 0.22})`;
                    ctx.lineWidth = particle.size * 0.35;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }

                ctx.save();
                ctx.shadowBlur = isDarkMode ? 10 : 4;
                ctx.shadowColor = `${particle.color}${Math.min(1, particle.opacity + 0.15)})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}${particle.opacity})`;
                ctx.fill();
                ctx.restore();
            });
        };

        animate();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colorsDark, colorsLight, isDarkMode]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none block"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default ParticleBackground;
