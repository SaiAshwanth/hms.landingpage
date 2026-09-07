import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const { cursorMode } = useUIStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, input, select, textarea, [role="button"]');
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', updateCursor, { passive: true });
    return () => window.removeEventListener('mousemove', updateCursor);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Follower Dot */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
        animate={{
          x: position.x - (isHovered ? 24 : 12),
          y: position.y - (isHovered ? 24 : 12),
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.2 }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-300 flex items-center justify-center ${
            cursorMode === 'emergency'
              ? 'border-rose-500 bg-rose-500/10'
              : cursorMode === 'book'
              ? 'border-[#7DB99A] bg-[#7DB99A]/10'
              : isHovered
              ? 'border-[#79CFCB]/80 bg-[#79CFCB]/10 scale-110'
              : 'border-[#1B201D]/30 bg-transparent'
          }`}
        >
          {cursorMode !== 'default' && (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#1B201D]">
              {cursorMode}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
