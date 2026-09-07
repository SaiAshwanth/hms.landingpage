import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Shield, Heart, Cpu, Stethoscope } from 'lucide-react';

interface MarqueeTickerProps {
  items?: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

const DEFAULT_ITEMS = [
  'ADVANCED CARDIOLOGY & ROBOTIC SURGERY',
  '24/7 LEVEL-1 TRAUMA & CARDIAC ER',
  '3.0T MRI & LOW-DOSE SPECTRAL CT',
  'HYBRID SURGICAL SUITES',
  'SUB-MILLIMETER SURGICAL PRECISION',
  'COMPASSIONATE PATIENT-FIRST CARE',
  'AI RADIOLOGY DIAGNOSTICS ENGINE',
  'ORGAN REGENERATION RESEARCH',
];

const ICONS = [Activity, Sparkles, Shield, Heart, Cpu, Stethoscope];

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items = DEFAULT_ITEMS,
  direction = 'left',
  speed = 25,
  className = '',
}) => {
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap flex select-none py-3.5 bg-slate-900 text-slate-100 border-y border-teal-500/20 relative z-20 ${className}`}>
      {/* Subtle Glow Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-8 text-xs font-mono tracking-[0.25em] uppercase font-bold text-slate-200 shrink-0"
        animate={{
          x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {repeatedItems.map((item, index) => {
          const IconComponent = ICONS[index % ICONS.length];
          return (
            <div key={index} className="flex items-center gap-3 shrink-0 group cursor-default">
              <IconComponent className="w-3.5 h-3.5 text-teal-400 group-hover:scale-125 transition-transform duration-300" />
              <span className="hover:text-teal-300 transition-colors">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse ml-3" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
