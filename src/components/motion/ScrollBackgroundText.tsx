import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollBackgroundTextProps {
  text: string;
  direction?: 'left' | 'right';
  className?: string;
  topOffset?: string;
}

export const ScrollBackgroundText: React.FC<ScrollBackgroundTextProps> = ({
  text,
  direction = 'left',
  className = '',
  topOffset = 'top-1/4',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const xTransform = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? ['20%', '-40%'] : ['-40%', '20%']
  );

  return (
    <div
      ref={containerRef}
      className={`absolute left-0 right-0 ${topOffset} overflow-hidden pointer-events-none z-0 opacity-25 select-none ${className}`}
    >
      <motion.div
        style={{ x: xTransform }}
        className="whitespace-nowrap font-sans font-black text-[120px] sm:text-[180px] lg:text-[220px] uppercase tracking-tighter text-slate-400/50 leading-none"
      >
        {text} • {text} • {text}
      </motion.div>
    </div>
  );
};
