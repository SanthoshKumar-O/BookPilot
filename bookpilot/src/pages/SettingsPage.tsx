import React from 'react';
import {
  Sun,
  Moon,
  Coffee,
  Type,
  Columns,
  Keyboard,
  Bell,
  Shield,
  User,
  BookOpen,
  Monitor,
  Accessibility,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

type SettingRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

const SettingRow: React.FC<SettingRowProps> = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-6 py-4 border-b border-[var(--border)] last:border-0">
    <div className="space-y-0.5 min-w-0">
      <div className="text-sm font-medium text-[var(--foreground)]">{label}</div>
      {description && (
        <div className="text-xs text-[var(--muted-foreground)]">{description}</div>
      )}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

type SegmentedControlProps<T extends string> = {
  value: T;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  onChange: (val: T) => void;
};

function SegmentedControl<T extends string>({ value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex items-center border border-[var(--border)] rounded-lg p-0.5 bg-[var(--muted)] gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium transition-all ${
            value === opt.value
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export const SettingsPage: React.FC = () => {
  const { readerSettings, updateReaderSettings } = useBookPilot();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            Preferences
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Manage your reader preferences, accessibility, and application configuration.
        </p>
      </div>

      {/* Reader Experience */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <CardTitle>Reader Experience</CardTitle>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Controls that apply within the technical reading environment
          </p>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {/* Theme */}
          <SettingRow
            label="Visual Theme"
            description="Choose your preferred reading environment tone"
          >
            <SegmentedControl
              value={readerSettings.theme}
              options={[
                { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
                { value: 'sepia', label: 'Sepia', icon: <Coffee className="w-3.5 h-3.5" /> },
                { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
              ]}
              onChange={(t) => updateReaderSettings({ theme: t as 'light' | 'sepia' | 'dark' })}
            />
          </SettingRow>

          {/* Font Size */}
          <SettingRow
            label={`Reading Font Size — ${readerSettings.fontSize}px`}
            description="Optimal size for extended technical reading sessions"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateReaderSettings({ fontSize: Math.max(14, readerSettings.fontSize - 1) })}
                className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors font-bold"
              >
                −
              </button>
              <input
                type="range"
                min="14"
                max="24"
                step="1"
                value={readerSettings.fontSize}
                onChange={(e) => updateReaderSettings({ fontSize: parseInt(e.target.value) })}
                className="w-28 accent-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => updateReaderSettings({ fontSize: Math.min(24, readerSettings.fontSize + 1) })}
                className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors font-bold"
              >
                +
              </button>
              <span className="text-xs font-mono text-[var(--muted-foreground)] w-8 text-center">
                {readerSettings.fontSize}px
              </span>
            </div>
          </SettingRow>

          {/* Line Width */}
          <SettingRow
            label="Column Width"
            description="Controls characters per line for comfortable reading"
          >
            <SegmentedControl
              value={readerSettings.lineWidth}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'wide', label: 'Wide' },
              ]}
              onChange={(w) => updateReaderSettings({ lineWidth: w as 'compact' | 'comfortable' | 'wide' })}
            />
          </SettingRow>

          {/* Reading Mode */}
          <SettingRow
            label="Reading Mode"
            description="How content is displayed as you progress through chapters"
          >
            <SegmentedControl
              value={readerSettings.readingMode}
              options={[
                { value: 'continuous', label: 'Continuous' },
                { value: 'paginated', label: 'Paginated' },
              ]}
              onChange={(m) => updateReaderSettings({ readingMode: m as 'continuous' | 'paginated' })}
            />
          </SettingRow>

          {/* Focus Mode */}
          <SettingRow
            label="Focus Mode"
            description="Hides sidebar and companion panel for distraction-free reading"
          >
            <button
              type="button"
              role="switch"
              aria-checked={readerSettings.focusMode}
              onClick={() => updateReaderSettings({ focusMode: !readerSettings.focusMode })}
              className={`relative inline-flex w-10 h-5.5 rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 ${
                readerSettings.focusMode
                  ? 'bg-[var(--primary)] border-[var(--primary)]'
                  : 'bg-[var(--muted)] border-[var(--border)]'
              }`}
              style={{ height: '22px' }}
            >
              <span
                className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-0.5 ${
                  readerSettings.focusMode ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </SettingRow>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <CardTitle>Keyboard Shortcuts</CardTitle>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Keyboard bindings for efficient navigation
          </p>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {[
            { keys: ['⌘', 'K'], description: 'Open global search' },
            { keys: ['⌘', '/'], description: 'Open AI companion' },
            { keys: ['←', '→'], description: 'Navigate chapters in reader' },
            { keys: ['Esc'], description: 'Close modal or overlay' },
            { keys: ['⌘', 'B'], description: 'Add bookmark at current position' },
            { keys: ['⌘', 'H'], description: 'Highlight selected text (Important)' },
          ].map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0"
            >
              <span className="text-xs text-[var(--foreground)]">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((k, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)]"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <CardTitle>About BookPilot</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">Version</span>
            <Badge variant="secondary" size="sm">1.0.0 Preview</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">Platform</span>
            <span className="text-[var(--foreground)] font-mono">React + TypeScript + Vite</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">AI Model</span>
            <span className="text-[var(--foreground)] font-mono">Contextual Companion</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] pt-2 leading-relaxed border-t border-[var(--border)]">
            BookPilot is an AI-powered learning environment for technical books and resources. 
            Upload a PDF or EPUB and study with a contextual companion that understands exactly where you are in the material.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
