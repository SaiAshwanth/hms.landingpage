import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface HeroCoreCanvasProps {
  className?: string;
}

export const HeroCoreCanvas: React.FC<HeroCoreCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for sci-fi medical visualization
    const particleCount = prefersReducedMotion ? 12 : 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw glowing medical core outer ring
      ctx.save();
      ctx.translate(centerX, centerY);

      if (!prefersReducedMotion) {
        rotationAngle += 0.003;
      }
      ctx.rotate(rotationAngle);

      // Ring 1 (Cyan orbital ring)
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.32, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 18, 6, 18]);
      ctx.stroke();

      // Ring 2 (Inner violet ring)
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();

      ctx.restore();

      // 2. Central Medical Energy Core Glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        Math.min(width, height) * 0.35
      );
      gradient.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
      gradient.addColorStop(0.4, 'rgba(6, 182, 212, 0.12)');
      gradient.addColorStop(0.8, 'rgba(99, 102, 241, 0.04)');
      gradient.addColorStop(1, 'rgba(6, 8, 15, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // 3. Connect floating particle constellation
      particles.forEach((p, i) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
        ctx.fill();

        // Connect nearby nodes with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 90) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};
