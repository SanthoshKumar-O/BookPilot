import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftElement, rightElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--foreground)] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftElement && (
            <div className="absolute left-3 text-[var(--muted-foreground)] pointer-events-none flex items-center">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-9 px-3 text-sm bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-lg placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              leftElement && 'pl-9',
              rightElement && 'pr-9',
              error && 'border-[var(--error)] focus:ring-[var(--error)]',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-[var(--muted-foreground)] flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <span className="text-xs text-[var(--error)] font-medium">{error}</span>
        ) : hint ? (
          <span className="text-xs text-[var(--muted-foreground)]">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
