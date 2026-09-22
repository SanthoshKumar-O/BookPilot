import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | { divider: true; id?: string })[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute top-full mt-1.5 z-50 min-w-[12rem] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-1 animate-in fade-in zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item, idx) => {
            if ('divider' in item) {
              return (
                <div
                  key={item.id || `div-${idx}`}
                  className="my-1 border-t border-[var(--border)]"
                />
              );
            }

            return (
              <button
                key={item.id}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left select-none',
                  item.danger
                    ? 'text-[var(--error)] hover:bg-red-50 dark:hover:bg-red-950/40'
                    : 'text-[var(--foreground)] hover:bg-[var(--secondary)]',
                  item.disabled && 'opacity-50 pointer-events-none'
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.shortcut && (
                  <kbd className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
