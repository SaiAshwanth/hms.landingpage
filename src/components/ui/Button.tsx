import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emergency' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none select-none cursor-pointer';

    const variants = {
      primary:
        'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:brightness-110 border border-cyan-400/40',
      secondary:
        'bg-slate-800/80 text-slate-100 hover:bg-slate-700/80 border border-slate-700/80 hover:border-slate-600',
      outline:
        'bg-transparent text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400',
      ghost:
        'bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800/40',
      emergency:
        'bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:brightness-110 border border-rose-500/50 animate-pulse-subtle',
      glass:
        'bg-white/5 backdrop-blur-md text-slate-100 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl',
      icon: 'p-2.5 rounded-lg aspect-square',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
