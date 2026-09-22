import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'interactive' | 'flat' | 'elevated' }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xs',
    interactive:
      'bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xs hover:border-[var(--ring)]/30 hover:shadow-sm transition-all cursor-pointer',
    flat: 'bg-[var(--secondary)]/60 border border-transparent rounded-xl',
    elevated: 'bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-md',
  };

  return <div ref={ref} className={cn(variants[variant], className)} {...props} />;
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5 p-5', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold leading-tight text-[var(--foreground)] tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-[var(--muted-foreground)] leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0 gap-2 text-sm text-[var(--muted-foreground)]', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
