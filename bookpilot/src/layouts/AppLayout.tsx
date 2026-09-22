import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  GraduationCap,
  Code2,
  CalendarCheck,
  TrendingUp,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Sun,
  Moon,
  Coffee,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Tooltip } from '../components/ui/Tooltip';
import { IconButton } from '../components/ui/IconButton';
import { Drawer } from '../components/ui/Drawer';
import { Dropdown } from '../components/ui/Dropdown';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { cn } from '../lib/utils';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const {
    resources,
    activeResource,
    setGlobalSearchOpen,
    readerSettings,
    updateReaderSettings,
  } = useBookPilot();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If in Reader view, ReaderPage manages its own 3-column layout
  const isReaderView = location.pathname.startsWith('/reader');
  if (isReaderView) {
    return <Outlet />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Quizzes', path: '/quizzes', icon: GraduationCap },
    { name: 'Coding', path: '/coding', icon: Code2 },
    { name: 'Study Plans', path: '/study-plans', icon: CalendarCheck },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
  ];

  // Dynamic contextual breadcrumb builder
  const renderBreadcrumb = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0 || segments[0] === 'dashboard') {
      return <span className="font-semibold text-[var(--foreground)]">Dashboard</span>;
    }

    if (segments[0] === 'library') {
      if (segments[1]) {
        const currentRes = resources.find((r) => r.id === segments[1]) || activeResource;
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Link to="/library" className="hover:text-[var(--foreground)] transition-colors">
              Library
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="font-semibold text-[var(--foreground)] truncate max-w-[240px]">
              {currentRes?.title || 'Resource Overview'}
            </span>
          </div>
        );
      }
      return <span className="font-semibold text-[var(--foreground)]">My Library</span>;
    }

    if (segments[0] === 'quizzes') {
      if (segments[1]) {
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Link to="/quizzes" className="hover:text-[var(--foreground)] transition-colors">
              Quizzes
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="font-semibold text-[var(--foreground)]">Assessment Session</span>
          </div>
        );
      }
      return <span className="font-semibold text-[var(--foreground)]">Quiz Center</span>;
    }

    if (segments[0] === 'coding') {
      if (segments[1]) {
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Link to="/coding" className="hover:text-[var(--foreground)] transition-colors">
              Coding
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="font-semibold text-[var(--foreground)]">Problem Workspace</span>
          </div>
        );
      }
      return <span className="font-semibold text-[var(--foreground)]">Practice & Coding</span>;
    }

    if (segments[0] === 'study-plans') {
      return <span className="font-semibold text-[var(--foreground)]">Study Plans</span>;
    }

    if (segments[0] === 'progress') {
      return <span className="font-semibold text-[var(--foreground)]">Progress & Insights</span>;
    }

    if (segments[0] === 'settings') {
      return <span className="font-semibold text-[var(--foreground)]">Settings</span>;
    }

    return (
      <span className="font-semibold text-[var(--foreground)] capitalize">
        {segments[0]}
      </span>
    );
  };

  const themeDropdownItems = [
    {
      id: 'light',
      label: 'Light Theme',
      icon: <Sun className="w-4 h-4" />,
      onClick: () => updateReaderSettings({ theme: 'light' }),
    },
    {
      id: 'dark',
      label: 'Dark Theme',
      icon: <Moon className="w-4 h-4" />,
      onClick: () => updateReaderSettings({ theme: 'dark' }),
    },
    {
      id: 'sepia',
      label: 'Sepia Reading',
      icon: <Coffee className="w-4 h-4" />,
      onClick: () => updateReaderSettings({ theme: 'sepia' }),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Global Search Modal */}
      <GlobalSearchModal />

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-[var(--border)] bg-[var(--card)] shrink-0 transition-all duration-200 z-20',
          isCollapsed ? 'w-18' : 'w-64'
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'h-16 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-semibold shadow-xs shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm tracking-tight text-[var(--foreground)]">
                  BookPilot
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)] truncate">
                  Technical Learning
                </span>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <IconButton
              aria-label="Collapse sidebar"
              size="xs"
              variant="ghost"
              onClick={() => setIsCollapsed(true)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <PanelLeftClose className="w-4 h-4" />
            </IconButton>
          )}
        </div>

        {/* Collapsed expansion button */}
        {isCollapsed && (
          <div className="pt-2 flex justify-center">
            <Tooltip content="Expand sidebar" position="right">
              <IconButton
                aria-label="Expand sidebar"
                size="sm"
                variant="ghost"
                onClick={() => setIsCollapsed(false)}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </IconButton>
            </Tooltip>
          </div>
        )}

        {/* Navigation List */}
        <div className="p-3 flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

              const linkContent = (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors select-none',
                    isCollapsed && 'justify-center px-2',
                    isActive
                      ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold shadow-2xs'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );

              return isCollapsed ? (
                <Tooltip key={item.path} content={item.name} position="right">
                  {linkContent}
                </Tooltip>
              ) : (
                <React.Fragment key={item.path}>{linkContent}</React.Fragment>
              );
            })}
          </nav>

          {/* Bottom Settings Separator & Link */}
          <div className="pt-3 border-t border-[var(--border)] space-y-1">
            {isCollapsed ? (
              <Tooltip content="Settings" position="right">
                <Link
                  to="/settings"
                  className={cn(
                    'flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === '/settings'
                      ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60'
                  )}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                </Link>
              </Tooltip>
            ) : (
              <Link
                to="/settings"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === '/settings'
                    ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60'
                )}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Settings</span>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        side="left"
        title="BookPilot Navigation"
        width="max-w-xs"
      >
        <div className="flex flex-col h-full justify-between py-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[var(--border)]">
            <Link
              to="/settings"
              onClick={() => setMobileDrawerOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/settings'
                  ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60'
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </Drawer>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Top Bar */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] px-4 md:px-8 flex items-center justify-between shrink-0 z-10">
          {/* Left: Mobile menu toggle + Contextual Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <IconButton
              aria-label="Open navigation menu"
              size="sm"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </IconButton>

            <div className="flex items-center min-w-0">{renderBreadcrumb()}</div>
          </div>

          {/* Center & Right Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Global Search Trigger */}
            <button
              type="button"
              onClick={() => setGlobalSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--muted-foreground)] hover:border-[var(--ring)]/40 hover:text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search Library...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--secondary)] border border-[var(--border)] text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Selector Dropdown */}
            <Dropdown
              trigger={
                <button
                  type="button"
                  aria-label="Change theme"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                >
                  {readerSettings.theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : readerSettings.theme === 'sepia' ? (
                    <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </button>
              }
              items={themeDropdownItems}
              align="right"
            />

            {/* Notifications Button */}
            <Tooltip content="Notifications">
              <button
                type="button"
                aria-label="View notifications"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
              </button>
            </Tooltip>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center text-xs font-semibold select-none">
              BP
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
