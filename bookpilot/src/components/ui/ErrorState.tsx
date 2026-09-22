import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "We couldn't complete this action",
  message,
  details,
  onRetry,
  secondaryAction,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-6 md:p-8 text-center rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10 max-w-md mx-auto my-4',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-[var(--error)] flex items-center justify-center mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>

      <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1">{title}</h4>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-3 max-w-xs">{message}</p>

      {details && (
        <pre className="text-[11px] font-mono text-left w-full p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] overflow-x-auto mb-4 max-h-24">
          {details}
        </pre>
      )}

      <div className="flex items-center gap-2.5 mt-1">
        {onRetry && (
          <Button size="sm" variant="primary" onClick={onRetry} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </Button>
        )}
        {secondaryAction && (
          <Button size="sm" variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};
