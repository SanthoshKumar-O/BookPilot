import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Layers, Lightbulb, FileText, ArrowRight } from 'lucide-react';
import { useBookPilot } from '../../context';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

export const GlobalSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    resources,
    chapters,
    concepts,
    notes,
  } = useBookPilot();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filter resources
  const matchedResources = resources
    .filter(
      (r) =>
        r.title.toLowerCase().includes(normalizedQuery) ||
        r.author.toLowerCase().includes(normalizedQuery) ||
        r.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    )
    .slice(0, 3);

  // Filter chapters
  const allChaptersList = Object.values(chapters).flat();
  const matchedChapters = allChaptersList
    .filter((c) => c.title.toLowerCase().includes(normalizedQuery))
    .slice(0, 3);

  // Filter concepts
  const matchedConcepts = concepts
    .filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        c.category.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 3);

  // Filter notes
  const matchedNotes = notes
    .filter(
      (n) =>
        n.note.toLowerCase().includes(normalizedQuery) ||
        n.selectedText.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 3);

  const hasResults =
    matchedResources.length > 0 ||
    matchedChapters.length > 0 ||
    matchedConcepts.length > 0 ||
    matchedNotes.length > 0;

  const handleSelect = (url: string) => {
    setGlobalSearchOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <Modal
      isOpen={globalSearchOpen}
      onClose={() => {
        setGlobalSearchOpen(false);
        setQuery('');
      }}
      size="lg"
      className="p-0 overflow-hidden"
    >
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
        <Search className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, chapters, concepts, code patterns, notes..."
          className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
        />
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--secondary)] border border-[var(--border)] rounded">
          ESC
        </kbd>
      </div>

      {/* Results List */}
      <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
        {!normalizedQuery ? (
          <div className="py-8 text-center text-xs text-[var(--muted-foreground)]">
            Type to search across your technical library and annotations...
          </div>
        ) : !hasResults ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-[var(--foreground)]">No results found</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              No matching books, chapters, concepts, or notes for &ldquo;{query}&rdquo;.
            </p>
          </div>
        ) : (
          <>
            {/* Resources */}
            {matchedResources.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2 py-1 uppercase tracking-wider">
                  Technical Resources
                </div>
                <div className="space-y-1 mt-1">
                  {matchedResources.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleSelect(`/library/${res.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-[var(--secondary)] text-[var(--foreground)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] truncate">
                            {res.title}
                          </div>
                          <div className="text-[11px] text-[var(--muted-foreground)]">
                            {res.author} · {res.progress}% complete
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            {matchedChapters.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2 py-1 uppercase tracking-wider">
                  Chapters
                </div>
                <div className="space-y-1 mt-1">
                  {matchedChapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => handleSelect(`/reader/${ch.resourceId}/${ch.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-[var(--secondary)] text-[var(--foreground)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] truncate">
                            Chapter {ch.number}: {ch.title}
                          </div>
                          <div className="text-[11px] text-[var(--muted-foreground)]">
                            {ch.estimatedMinutes} min read · {ch.sections.length} sections
                          </div>
                        </div>
                      </div>
                      <Badge size="sm" variant="secondary">
                        Open Reader
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Concepts */}
            {matchedConcepts.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2 py-1 uppercase tracking-wider">
                  Technical Concepts
                </div>
                <div className="space-y-1 mt-1">
                  {matchedConcepts.map((con) => (
                    <button
                      key={con.id}
                      onClick={() => handleSelect(`/reader/${con.resourceId}/${con.chapterId}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/40">
                          <Lightbulb className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[var(--foreground)] truncate">
                            {con.name}
                          </div>
                          <div className="text-[11px] text-[var(--muted-foreground)] truncate">
                            {con.explanation.slice(0, 70)}...
                          </div>
                        </div>
                      </div>
                      <Badge size="sm" variant="outline">
                        {con.difficulty}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {matchedNotes.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2 py-1 uppercase tracking-wider">
                  Personal Notes
                </div>
                <div className="space-y-1 mt-1">
                  {matchedNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => handleSelect(`/reader/${note.resourceId}/${note.chapterId}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-[var(--secondary)] text-[var(--foreground)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[var(--foreground)] truncate">
                            &ldquo;{note.note}&rdquo;
                          </div>
                          <div className="text-[11px] text-[var(--muted-foreground)] truncate">
                            on &ldquo;{note.selectedText}&rdquo;
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {note.createdAt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Helper */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--secondary)]/50 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
        <div className="flex items-center gap-3">
          <span>Navigation: <kbd className="px-1 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono">↓</kbd></span>
          <span>Open: <kbd className="px-1 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono">↵</kbd></span>
        </div>
        <span>BookPilot Knowledge Search</span>
      </div>
    </Modal>
  );
};
