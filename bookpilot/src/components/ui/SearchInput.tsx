import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcut?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, shortcut, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Search className="w-4 h-4 absolute left-3 text-[var(--muted-foreground)] pointer-events-none shrink-0" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            'w-full h-9 pl-9 pr-9 text-sm bg-[var(--secondary)] text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:border-[var(--ring)] focus:bg-[var(--card)] rounded-lg placeholder:text-[var(--muted-foreground)] focus:outline-none transition-all',
            shortcut && 'pr-14',
            className
          )}
          {...props}
        />
        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : shortcut ? (
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] rounded shadow-xs pointer-events-none">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
