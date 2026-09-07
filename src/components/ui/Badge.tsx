import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'rose' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cyan',
  size = 'md',
  pulse = false,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30',
    violet: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border border-slate-700/80',
    outline: 'bg-transparent text-slate-300 border border-white/10',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-mono-numbers tracking-wider uppercase rounded-md',
    md: 'text-xs px-2.5 py-1 font-mono-numbers tracking-wider uppercase rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};
