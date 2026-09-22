import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Bookmark,
  Sparkles,
  CheckCircle2,
  ListOrdered,
  Send,
  Loader2,
  Sun,
  Moon,
  Coffee,
  ZoomIn,
  ZoomOut,
  X,
  ChevronRight,
  History,
  BookOpen,
  Highlighter,
  StickyNote,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { cn } from '../lib/utils';
import type { AIMessage } from '../types';

type HighlightCategory = 'important' | 'definition' | 'formula' | 'code' | 'review';

const HIGHLIGHT_CATEGORIES: { id: HighlightCategory; label: string; color: string }[] = [
  { id: 'important', label: 'Important', color: 'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200' },
  { id: 'definition', label: 'Definition', color: 'bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' },
  { id: 'formula', label: 'Formula', color: 'bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200' },
  { id: 'code', label: 'Code', color: 'bg-purple-200 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200' },
  { id: 'review', label: 'Review', color: 'bg-rose-200 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200' },
];

export const ReaderPage: React.FC = () => {
  const { resourceId, chapterId } = useParams<{ resourceId: string; chapterId: string }>();
  const navigate = useNavigate();
  const {
    resources,
    chapters,
    activeSection,
    setActiveChapterId,
    setActiveSectionId,
    readerSettings,
    updateReaderSettings,
    isBookmarked,
    addBookmark,
    removeBookmark,
    addHighlight,
    addNote,
    aiSessions,
    activeAiSessionId,
    setActiveAiSessionId,
    sendAiMessage,
    completeChapter,
  } = useBookPilot();

  const [companionOpen, setCompanionOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [selectionPos, setSelectionPos] = useState({ top: 0, left: 0 });
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showChapterCompletePrompt, setShowChapterCompletePrompt] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const resource = resources.find((r) => r.id === resourceId) || resources[0];
  const currentChapters = (resource && chapters[resource.id]) || [];
  const currentChapter = currentChapters.find((c) => c.id === chapterId) || currentChapters[0];
  const currentChapterIndex = currentChapters.findIndex((c) => c.id === currentChapter?.id);
  const nextChapter = currentChapters[currentChapterIndex + 1];

  const bookmarked = isBookmarked(resource?.id || '', currentChapter?.id || '');

  // Active AI session
  const resourceSessions = aiSessions[resource?.id || ''] || [];
  const activeSession = resourceSessions.find((s) => s.id === activeAiSessionId) || resourceSessions[0];
  const messages: AIMessage[] = activeSession?.messages || [];

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 3) {
      setSelectedText(text);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelectionPos({
          top: rect.top - 52,
          left: Math.max(8, rect.left + rect.width / 2 - 160),
        });
        setShowSelectionMenu(true);
        setShowHighlightPicker(false);
        setShowNoteInput(false);
      }
    } else {
      setShowSelectionMenu(false);
    }
  };

  const closeSelectionUI = () => {
    setShowSelectionMenu(false);
    setShowHighlightPicker(false);
    setShowNoteInput(false);
    setNoteText('');
    window.getSelection()?.removeAllRanges();
  };

  const handleExplain = () => {
    const prompt = `Explain this passage: "${selectedText.slice(0, 200)}"`;
    setChatInput(prompt);
    setCompanionOpen(true);
    closeSelectionUI();
    setTimeout(() => chatInputRef.current?.focus(), 200);
  };

  const handleHighlight = (category: HighlightCategory) => {
    if (resource && currentChapter) {
      addHighlight({
        resourceId: resource.id,
        chapterId: currentChapter.id,
        sectionId: activeSection?.id || '',
        text: selectedText,
        category,
      });
    }
    closeSelectionUI();
  };

  const handleSaveNote = () => {
    if (resource && currentChapter && noteText.trim()) {
      addNote({
        resourceId: resource.id,
        chapterId: currentChapter.id,
        sectionId: activeSection?.id || '',
        note: noteText.trim(),
        selectedText: selectedText,
      });
    }
    closeSelectionUI();
  };

  const handleSendMessage = async () => {
    const prompt = chatInput.trim();
    if (!prompt || isSending) return;
    setChatInput('');
    setIsSending(true);
    try {
      await sendAiMessage(prompt, {
        chapterTitle: currentChapter?.title || '',
        sectionTitle: activeSection?.title || '',
        selectedText: selectedText || undefined,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsSending(true);
    try {
      await sendAiMessage(action, {
        chapterTitle: currentChapter?.title || '',
        sectionTitle: activeSection?.title || '',
      });
      setCompanionOpen(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleCompleteChapter = () => {
    if (resource && currentChapter) {
      completeChapter(resource.id, currentChapter.id);
      setShowChapterCompletePrompt(false);
      if (nextChapter) {
        navigate(`/reader/${resource.id}/${nextChapter.id}`);
      } else {
        navigate(`/library/${resource.id}`);
      }
    }
  };

  // Apply font size from reader settings to article
  const articleStyle: React.CSSProperties = {
    fontSize: `${readerSettings.fontSize}px`,
    maxWidth: readerSettings.lineWidth === 'compact' ? '560px' : readerSettings.lineWidth === 'wide' ? '860px' : '680px',
  };

  return (
    <div
      className={cn(
        'h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-hidden',
        readerSettings.theme === 'sepia' && 'data-theme-sepia'
      )}
    >
      {/* ═══════════════════════════════════════
          READER TOP BAR
      ═══════════════════════════════════════ */}
      <header className="h-14 border-b border-[var(--border)] bg-[var(--card)] px-4 flex items-center justify-between shrink-0 select-none z-20">
        {/* Left: back + book info */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/library/${resource?.id}`}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors shrink-0"
            title="Back to Resource"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-[1px] bg-[var(--border)] shrink-0" />
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold truncate">{resource?.title}</span>
            <span className="text-[11px] text-[var(--muted-foreground)] truncate">
              Ch. {currentChapter?.number} · {currentChapter?.title}
            </span>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* TOC Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Table of Contents"
            className={cn(
              'p-1.5 rounded-lg text-xs border border-[var(--border)] transition-colors',
              sidebarOpen ? 'bg-[var(--muted)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
            )}
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => {
              if (bookmarked) {
                removeBookmark(resource?.id || '', currentChapter?.id || '');
              } else {
                addBookmark({
                  resourceId: resource?.id || '',
                  chapterId: currentChapter?.id || '',
                  sectionId: activeSection?.id || '',
                  title: `${currentChapter?.title} — ${activeSection?.title || ''}`,
                });
              }
            }}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this position'}
            className={cn(
              'p-1.5 rounded-lg border border-[var(--border)] transition-colors',
              bookmarked ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
            )}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Mark Complete */}
          <button
            onClick={() => setShowChapterCompletePrompt(true)}
            title="Mark chapter complete"
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--success)] hover:bg-[var(--success-subtle)] transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-[var(--border)]" />

          {/* Font size controls */}
          <button
            onClick={() => updateReaderSettings({ fontSize: Math.max(14, readerSettings.fontSize - 1) })}
            title="Decrease font size"
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-[var(--muted-foreground)] w-8 text-center">
            {readerSettings.fontSize}
          </span>
          <button
            onClick={() => updateReaderSettings({ fontSize: Math.min(24, readerSettings.fontSize + 1) })}
            title="Increase font size"
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Theme + Companion Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center border border-[var(--border)] rounded-lg p-0.5 bg-[var(--muted)]">
            {(['light', 'sepia', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateReaderSettings({ theme: t })}
                title={`${t} theme`}
                className={cn(
                  'p-1.5 rounded transition-all',
                  readerSettings.theme === t
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
              >
                {t === 'light' ? <Sun className="w-3.5 h-3.5" /> : t === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* AI Companion Toggle */}
          <button
            onClick={() => setCompanionOpen(!companionOpen)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              companionOpen
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Companion</span>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          3-COLUMN READER BODY
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── LEFT: Table of Contents ── */}
        {sidebarOpen && (
          <aside className="fixed inset-y-14 left-0 z-30 w-72 md:static md:w-64 border-r border-[var(--border)] bg-[var(--card)] flex flex-col shrink-0 overflow-y-auto shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Table of Contents
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                title="Close table of contents"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-0.5 flex-1">
              {currentChapters.map((ch) => {
                const isSelected = ch.id === currentChapter?.id;
                return (
                  <div key={ch.id} className="space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveChapterId(ch.id);
                        if (ch.sections[0]) setActiveSectionId(ch.sections[0].id);
                        navigate(`/reader/${resource?.id}/${ch.id}`);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors',
                        isSelected
                          ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                      )}
                    >
                      <span className="truncate">{ch.number}. {ch.title}</span>
                      {ch.isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0 ml-1" />
                      )}
                    </button>

                    {isSelected && (
                      <div className="pl-5 space-y-0.5 border-l border-[var(--border)] ml-3 my-0.5">
                        {ch.sections.map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => setActiveSectionId(sec.id)}
                            className={cn(
                              'w-full text-left px-2 py-1.5 rounded text-[11px] transition-colors truncate',
                              activeSection?.id === sec.id
                                ? 'text-[var(--accent)] font-semibold bg-[var(--accent-subtle)]'
                                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            )}
                          >
                            {sec.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chapter navigation arrows */}
            <div className="p-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              {currentChapterIndex > 0 && (
                <button
                  onClick={() => {
                    const prev = currentChapters[currentChapterIndex - 1];
                    if (prev) navigate(`/reader/${resource?.id}/${prev.id}`);
                  }}
                  className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
              )}
              <div />
              {nextChapter && (
                <button
                  onClick={() => navigate(`/reader/${resource?.id}/${nextChapter.id}`)}
                  className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </aside>
        )}

        {/* ── CENTER: The Sacred Reading Area ── */}
        <main
          className="flex-1 overflow-y-auto selection:bg-[var(--reader-highlight-important)]"
          onMouseUp={handleTextSelection}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.selection-menu') === null) {
              setShowSelectionMenu(false);
            }
          }}
        >
          <div className="py-12 px-8 sm:px-16 flex justify-center">
            <div style={articleStyle} className="w-full space-y-6">
              {/* Chapter Header */}
              <div className="border-b border-[var(--border)] pb-6 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                  Chapter {currentChapter?.number}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                  {currentChapter?.title}
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {currentChapter?.sections.length} sections · {currentChapter?.isCompleted ? 'Completed' : 'In progress'}
                </p>
              </div>

              {/* Content Sections */}
              <article
                className="font-reading leading-relaxed space-y-8 text-[var(--reader-fg)]"
                style={{ fontSize: 'inherit' }}
              >
                {currentChapter?.sections.map((sec) => (
                  <div key={sec.id} id={sec.id} className="space-y-4 scroll-mt-4">
                    <h2 className="font-sans text-xl font-semibold tracking-tight text-[var(--foreground)]">
                      {sec.title}
                    </h2>
                    <div className="whitespace-pre-line leading-[1.8]">{sec.content}</div>
                  </div>
                ))}
              </article>

              {/* End-of-chapter CTA */}
              <div className="pt-8 pb-4">
                <div className="border border-[var(--border)] bg-[var(--card)] rounded-xl p-6 text-center space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--success-subtle)] border border-[var(--success)]/30 text-[var(--success)] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">End of Chapter {currentChapter?.number}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Ready to mark this chapter complete and move on?
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setShowChapterCompletePrompt(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Complete
                    </button>
                    {nextChapter && (
                      <button
                        onClick={() => navigate(`/reader/${resource?.id}/${nextChapter.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--muted)] transition-colors"
                      >
                        Next: {nextChapter.title}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Contextual Text Selection Toolbar ── */}
          {showSelectionMenu && (
            <div
              className="selection-menu fixed z-50"
              style={{ top: `${selectionPos.top}px`, left: `${selectionPos.left}px` }}
            >
              {!showHighlightPicker && !showNoteInput ? (
                <div className="flex items-center gap-0.5 p-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={handleExplain}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--muted)] font-semibold text-[var(--accent)] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Explain
                  </button>
                  <div className="h-4 w-[1px] bg-[var(--border)]" />
                  <button
                    onClick={() => setShowHighlightPicker(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                    Highlight
                  </button>
                  <div className="h-4 w-[1px] bg-[var(--border)]" />
                  <button
                    onClick={() => setShowNoteInput(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                    Note
                  </button>
                  <div className="h-4 w-[1px] bg-[var(--border)]" />
                  <button
                    onClick={closeSelectionUI}
                    className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : showHighlightPicker ? (
                <div className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-100 min-w-[220px]">
                  <div className="text-[10px] font-semibold uppercase text-[var(--muted-foreground)] px-1">
                    Select Highlight Type
                  </div>
                  <div className="space-y-1">
                    {HIGHLIGHT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleHighlight(cat.id)}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          cat.color
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowHighlightPicker(false)}
                    className="text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-1"
                  >
                    ← Back
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-100 min-w-[260px]">
                  <div className="text-[10px] font-semibold uppercase text-[var(--muted-foreground)]">
                    Add Note
                  </div>
                  <p className="text-[11px] italic text-[var(--muted-foreground)] border-l-2 border-[var(--accent)] pl-2 line-clamp-2">
                    "{selectedText}"
                  </p>
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Your note..."
                    className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--ring)]/40 h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-xs font-medium"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={() => setShowNoteInput(false)}
                      className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs text-[var(--muted-foreground)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── RIGHT: AI Learning Companion ── */}
        {companionOpen && (
          <aside className="fixed inset-y-14 right-0 z-30 w-80 sm:w-88 md:static md:w-80 xl:w-96 border-l border-[var(--border)] bg-[var(--card)] flex flex-col shrink-0 shadow-2xl md:shadow-none animate-in slide-in-from-right duration-200">
            {/* Companion Header */}
            <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="text-xs font-semibold">Learning Companion</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
                  Contextual
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSessionHistory(!showSessionHistory)}
                  title="Session history"
                  className={cn(
                    'p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors',
                    showSessionHistory && 'bg-[var(--muted)] text-[var(--foreground)]'
                  )}
                >
                  <History className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCompanionOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  title="Close AI companion"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Session History Panel */}
            {showSessionHistory ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="text-[10px] uppercase font-semibold text-[var(--muted-foreground)] pb-1">
                  AI Sessions — {resource?.title}
                </div>
                {resourceSessions.length === 0 ? (
                  <p className="text-xs text-[var(--muted-foreground)] text-center pt-8">No sessions yet</p>
                ) : (
                  resourceSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        setActiveAiSessionId(session.id);
                        setShowSessionHistory(false);
                      }}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border text-xs transition-colors',
                        session.id === activeAiSessionId
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--foreground)]'
                          : 'border-[var(--border)] hover:bg-[var(--muted)]'
                      )}
                    >
                      <div className="font-medium truncate">{session.title}</div>
                      <div className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                        <MessageSquare className="w-3 h-3" />
                        {session.messages.length} messages
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <>
                {/* Active Context Banner */}
                <div className="p-3 border-b border-[var(--border)] bg-[var(--muted)]/50 space-y-1 text-xs shrink-0">
                  <div className="text-[10px] uppercase font-mono text-[var(--muted-foreground)]">Active Context</div>
                  <div className="font-semibold text-[var(--foreground)] truncate">{currentChapter?.title}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)] truncate">{activeSection?.title}</div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {/* Selected text context bubble */}
                  {selectedText && showSelectionMenu === false && (
                    <div className="p-2.5 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-subtle)] text-xs space-y-1 animate-in fade-in duration-150">
                      <div className="text-[10px] font-semibold text-[var(--accent)] uppercase">Selected Text</div>
                      <div className="italic text-[var(--foreground)] line-clamp-2 font-serif leading-relaxed">
                        "{selectedText}"
                      </div>
                    </div>
                  )}

                  {/* Quick Actions — shown when no messages */}
                  {messages.length === 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-[var(--muted-foreground)]">Quick Actions</div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          'Summarize this chapter',
                          'Explain the key concepts',
                          'Give a practical example',
                          'What should I know before this?',
                          'How does this connect to the next chapter?',
                        ].map((action) => (
                          <button
                            key={action}
                            onClick={() => handleQuickAction(action)}
                            disabled={isSending}
                            className="w-full text-left px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] hover:border-[var(--ring)]/30 text-xs text-[var(--foreground)] transition-colors disabled:opacity-50"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Thread */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'space-y-1 animate-in fade-in duration-200',
                        msg.role === 'user' ? 'pl-4' : ''
                      )}
                    >
                      {msg.role === 'user' ? (
                        <div className="p-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs rounded-br-sm">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)] rounded-bl-sm leading-relaxed whitespace-pre-line">
                            {msg.content}
                          </div>
                          {/* Source References */}
                          {msg.sourceReferences && msg.sourceReferences.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-[10px] text-[var(--muted-foreground)] font-semibold">Sources:</div>
                              {msg.sourceReferences.map((ref, i) => (
                                <Link
                                  key={i}
                                  to={`/reader/${resource?.id}/${ref.chapterId}`}
                                  className="flex items-center gap-1.5 text-[11px] text-[var(--accent)] hover:underline"
                                >
                                  <BookOpen className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{ref.chapterTitle} — {ref.sectionTitle}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Sending indicator */}
                  {isSending && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--muted-foreground)] animate-in fade-in duration-150">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Thinking...
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-[var(--border)] shrink-0">
                  <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-[var(--ring)]/40 transition-all">
                    <input
                      ref={chatInputRef}
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask about this chapter..."
                      className="flex-1 text-xs bg-transparent focus:outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isSending}
                      className="p-1 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-40 transition-opacity"
                    >
                      {isSending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5 text-center">
                    Context-aware · Chapter {currentChapter?.number} active
                  </p>
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* ── Chapter Complete Confirmation Modal ── */}
      {showChapterCompletePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[var(--success-subtle)] border border-[var(--success)]/20 text-[var(--success)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base">Complete Chapter?</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Mark <strong>"{currentChapter?.title}"</strong> as complete.
                {nextChapter ? ` You'll move on to Chapter ${currentChapter?.number! + 1}.` : ' This is the final chapter!'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-lg text-xs">
                <GraduationCap className="w-4 h-4 text-[var(--accent)]" />
                <span>Take a chapter quiz to test your knowledge?</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowChapterCompletePrompt(false)}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-xl text-xs font-medium hover:bg-[var(--muted)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteChapter}
                className="flex-1 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Complete & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


