import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AureliaPulseProps {
  variant?: 'hero' | 'atlas' | 'rooms' | 'intelligence' | 'journey' | 'subtle';
  className?: string;
}

export const AureliaPulse: React.FC<AureliaPulseProps> = ({
  variant = 'subtle',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (variant === 'hero') {
    return (
      <div className={`relative w-full h-20 flex items-center justify-center pointer-events-none ${className}`}>
        <svg className="w-full h-full max-w-5xl opacity-80" viewBox="0 0 1000 80" fill="none">
          {/* Architectural Blueprint Care Line */}
          <motion.path
            d="M 0 40 L 350 40 L 370 20 L 390 60 L 410 10 L 430 70 L 450 40 L 550 40 L 570 15 L 590 65 L 610 30 L 630 40 L 1000 40"
            stroke="url(#aurelia-pulse-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />

          {/* Signal Pulse Node Dot */}
          {!prefersReducedMotion && (
            <motion.circle
              r="3.5"
              fill="#79CFCB"
              animate={{
                offsetDistance: ['0%', '100%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                offsetPath: 'path("M 0 40 L 350 40 L 370 20 L 390 60 L 410 10 L 430 70 L 450 40 L 550 40 L 570 15 L 590 65 L 610 30 L 630 40 L 1000 40")',
              }}
            />
          )}

          <defs>
            <linearGradient id="aurelia-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7DB99A" stopOpacity="0" />
              <stop offset="30%" stopColor="#7DB99A" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#79CFCB" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#BFD8C8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#17352B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'intelligence') {
    return (
      <div className={`relative w-full h-12 flex items-center justify-center pointer-events-none ${className}`}>
        <svg className="w-full h-full max-w-3xl opacity-60" viewBox="0 0 600 50" fill="none">
          <path
            d="M 0 25 L 200 25 C 250 25 270 5 300 5 C 330 5 350 45 380 45 L 600 25"
            stroke="#79CFCB"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle cx="300" cy="5" r="3" fill="#79CFCB" />
          <circle cx="380" cy="45" r="3" fill="#7DB99A" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-[#7DB99A]/30 to-transparent my-6 ${className}`} />
  );
};
