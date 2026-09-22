import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'success'
    | 'warning'
    | 'error'
    | 'accent'
    | 'important'
    | 'definition'
    | 'formula'
    | 'code'
    | 'review';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
    secondary: 'bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]',
    outline: 'border border-[var(--border)] text-[var(--foreground)] bg-transparent',
    success: 'bg-[var(--success-subtle)] text-[var(--success)] border border-green-200 dark:border-green-900/40',
    warning: 'bg-[var(--warning-subtle)] text-[var(--warning)] border border-amber-200 dark:border-amber-900/40',
    error: 'bg-[var(--error-subtle)] text-[var(--error)] border border-red-200 dark:border-red-900/40',
    accent: 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-blue-200 dark:border-blue-900/40',
    important: 'bg-[var(--reader-highlight-important)] text-amber-900 dark:text-amber-200 font-semibold',
    definition: 'bg-[var(--reader-highlight-definition)] text-blue-900 dark:text-blue-200 font-semibold',
    formula: 'bg-[var(--reader-highlight-formula)] text-orange-900 dark:text-orange-200 font-semibold',
    code: 'bg-[var(--reader-highlight-code)] text-purple-900 dark:text-purple-200 font-semibold',
    review: 'bg-[var(--reader-highlight-review)] text-rose-900 dark:text-rose-200 font-semibold',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md tracking-tight leading-none shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
