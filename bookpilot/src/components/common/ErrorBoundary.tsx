import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BookPilot ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-900/50">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h1 className="text-xl font-semibold mb-2">We couldn't load this view</h1>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              An unexpected error occurred while rendering the learning environment. Your reading progress and annotations are safe.
            </p>

            {this.state.error?.message && (
              <div className="bg-[var(--muted)] p-3 rounded-lg text-left text-xs font-mono text-[var(--muted-foreground)] mb-6 overflow-auto max-h-32 border border-[var(--border)]">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                Reload View
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
