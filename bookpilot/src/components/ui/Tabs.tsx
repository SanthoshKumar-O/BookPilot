import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills' | 'segmented';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={cn(
          'flex items-center p-1 bg-[var(--secondary)] rounded-lg gap-1 border border-[var(--border)]/50',
          className
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all flex-1 select-none',
                isActive
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px]',
                    isActive
                      ? 'bg-[var(--secondary)] text-[var(--foreground)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      className={cn('flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto no-scrollbar', className)}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 py-2.5 px-3 text-sm font-medium transition-colors border-b-2 -mb-px shrink-0 select-none',
              isActive
                ? 'border-[var(--ring)] text-[var(--foreground)] font-semibold'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--secondary)] text-[var(--muted-foreground)]">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
