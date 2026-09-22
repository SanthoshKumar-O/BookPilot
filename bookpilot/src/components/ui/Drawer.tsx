import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  side = 'right',
  children,
  className,
  width = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'relative w-full h-full bg-[var(--card)] border-[var(--border)] shadow-2xl flex flex-col',
          side === 'right' ? 'ml-auto border-l animate-in slide-in-from-right duration-200' : 'mr-auto border-r animate-in slide-in-from-left duration-200',
          width,
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          {title && <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>}
          <IconButton aria-label="Close drawer" size="sm" variant="ghost" onClick={onClose} className="ml-auto">
            <X className="w-4 h-4" />
          </IconButton>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
