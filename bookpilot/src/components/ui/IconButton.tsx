import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg shrink-0';

    const variants = {
      primary:
        'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98]',
      secondary:
        'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--border)]',
      outline:
        'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)]',
      ghost:
        'bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]',
      danger:
        'bg-red-50 dark:bg-red-950/40 text-[var(--error)] hover:bg-red-100 dark:hover:bg-red-900/50',
    };

    const sizes = {
      xs: 'w-7 h-7 p-1 text-xs',
      sm: 'w-8 h-8 p-1.5 text-sm',
      md: 'w-9 h-9 p-2 text-sm',
      lg: 'w-10 h-10 p-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
