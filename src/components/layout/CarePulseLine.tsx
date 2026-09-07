import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CarePulseLineProps {
  variant?: 'hero' | 'network' | 'radar' | 'node' | 'straight';
  className?: string;
}

export const CarePulseLine: React.FC<CarePulseLineProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (variant === 'hero') {
    return (
      <div className={`relative w-full h-12 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}>
        <svg className="w-full h-full max-w-4xl opacity-70" viewBox="0 0 1000 60" fill="none">
          {/* Base pulse track */}
          <path
            d="M0 30 L380 30 L400 15 L415 45 L430 5 L450 55 L470 30 L530 30 L550 10 L570 50 L585 20 L600 30 L1000 30"
            stroke="url(#pulse-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Traveling energy glow dot */}
          {!prefersReducedMotion && (
            <motion.circle
              r="4"
              fill="#00F2FE"
              filter="drop-shadow(0 0 8px #00F2FE)"
              animate={{
                offsetDistance: ['0%', '100%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                offsetPath: 'path("M0 30 L380 30 L400 15 L415 45 L430 5 L450 55 L470 30 L530 30 L550 10 L570 50 L585 20 L600 30 L1000 30")',
              }}
            />
          )}
          <defs>
            <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0" />
              <stop offset="25%" stopColor="#00F2FE" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#6366F1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'network') {
    return (
      <div className={`relative w-full h-8 flex items-center justify-center pointer-events-none ${className}`}>
        <svg className="w-full h-full max-w-2xl opacity-40" viewBox="0 0 600 40" fill="none">
          <path
            d="M0 20 L200 20 C250 20 270 5 300 5 C330 5 350 35 380 35 C410 35 430 20 600 20"
            stroke="#06B6D4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="300" cy="5" r="3" fill="#00F2FE" />
          <circle cx="380" cy="35" r="3" fill="#6366F1" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-4 ${className}`} />
  );
};
