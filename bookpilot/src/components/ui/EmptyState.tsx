import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 max-w-lg mx-auto my-6',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] flex items-center justify-center mb-4 border border-[var(--border)]">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3">
          {actionLabel && onAction && (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button size="sm" variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
