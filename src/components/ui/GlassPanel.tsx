import React from 'react';
import { cn } from '../../utils/cn';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'glow' | 'accent';
  hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#0F1420]/70 backdrop-blur-xl border border-white/[0.08]',
    subtle: 'bg-[#0A0E17]/60 backdrop-blur-md border border-white/[0.05]',
    glow: 'bg-[#0F1420]/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)]',
    accent: 'bg-gradient-to-br from-cyan-950/20 via-[#0F1420]/80 to-indigo-950/20 backdrop-blur-xl border border-cyan-500/20',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        variantStyles[variant],
        hoverEffect && 'hover:border-cyan-500/40 hover:shadow-[0_10px_40px_-15px_rgba(6,182,212,0.2)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
