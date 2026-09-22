import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center space-y-4 shadow-sm">
        <h1 className="text-3xl font-bold">404</h1>
        <h2 className="text-base font-semibold">Page Not Found</h2>
        <p className="text-xs text-[var(--muted-foreground)]">
          The learning resource or view you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium hover:opacity-90"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--muted)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
