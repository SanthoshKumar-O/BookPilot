import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'accent' | 'warning';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'sm',
  variant = 'default',
  showLabel = false,
  className,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-[var(--primary)]',
    success: 'bg-[var(--success)]',
    accent: 'bg-[var(--accent)]',
    warning: 'bg-[var(--warning)]',
  };

  return (
    <div className={cn('w-full flex items-center gap-3', className)} {...props}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'w-full bg-[var(--secondary)] overflow-hidden rounded-full border border-[var(--border)]/40 relative',
          sizes[size]
        )}
      >
        <div
          className={cn('h-full transition-all duration-300 ease-out rounded-full', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] shrink-0 min-w-[2.5rem] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
