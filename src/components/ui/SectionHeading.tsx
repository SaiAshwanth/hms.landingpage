import React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from './Badge';

interface SectionHeadingProps {
  badgeText?: string;
  badgeVariant?: 'cyan' | 'violet' | 'emerald' | 'rose' | 'slate';
  title: string | React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  badgeVariant = 'cyan',
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col max-w-3xl mb-12 sm:mb-16', alignmentClasses[align], className)}>
      {badgeText && (
        <Badge variant={badgeVariant} className="mb-4">
          {badgeText}
        </Badge>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
