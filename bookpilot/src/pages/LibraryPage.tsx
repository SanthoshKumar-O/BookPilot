import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Loader2,
  BookMarked,
  Filter,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { AddResourceModal } from '../components/library/AddResourceModal';

type FilterType = 'all' | 'pdf' | 'epub' | 'in_progress' | 'completed' | 'processing';

export const LibraryPage: React.FC = () => {
  const { resources } = useBookPilot();
  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredResources = resources.filter((r) => {
    if (filter === 'pdf' && r.type !== 'pdf') return false;
    if (filter === 'epub' && r.type !== 'epub') return false;
    if (filter === 'in_progress' && r.status !== 'in_progress') return false;
    if (filter === 'completed' && r.status !== 'completed') return false;
    if (filter === 'processing' && r.status !== 'processing') return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchAuthor = r.author.toLowerCase().includes(q);
      const matchTag = r.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchAuthor && !matchTag) return false;
    }

    return true;
  });

  const filterTabs: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Resources', count: resources.length },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: resources.filter((r) => r.status === 'in_progress').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: resources.filter((r) => r.status === 'completed').length,
    },
    {
      id: 'processing',
      label: 'Processing',
      count: resources.filter((r) => r.status === 'processing').length,
    },
    { id: 'pdf', label: 'PDF', count: resources.filter((r) => r.type === 'pdf').length },
    { id: 'epub', label: 'EPUB', count: resources.filter((r) => r.type === 'epub').length },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
      {/* Add Resource Modal */}
      <AddResourceModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />

      {/* Header with Title and Add Resource Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              Resource Management
            </span>
            <span className="text-[var(--border)]">•</span>
            <span className="text-xs text-[var(--muted-foreground)]">{resources.length} Total Books</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            My Technical Library
          </h1>
          <p className="text-xs md:text-sm text-[var(--muted-foreground)] mt-1">
            Original technical books, documentation, and papers with contextual learning layers.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto shadow-sm"
        >
          Add Resource
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--card)] p-3 rounded-xl border border-[var(--border)]">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-2xs font-semibold'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-[var(--primary-foreground)]/20 text-[var(--primary-foreground)]'
                      : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 shrink-0">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search by title, author, tag..."
          />
        </div>
      </div>

      {/* Resource Grid / Empty State */}
      {resources.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="Your library is empty"
          description="Add your first technical book or paper in PDF or EPUB format to begin reading with BookPilot."
          actionLabel="Add Resource"
          onAction={() => setAddModalOpen(true)}
        />
      ) : filteredResources.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No resources match your filter"
          description={`We couldn't find any resources matching the filter "${filter}"${query ? ` and search query "${query}"` : ''}.`}
          actionLabel="Clear Filters"
          onAction={() => {
            setFilter('all');
            setQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isProcessing = res.status === 'processing';
            const isCompleted = res.status === 'completed';

            return (
              <Card
                key={res.id}
                variant="interactive"
                className="flex flex-col justify-between group overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar: Book Spine + Metadata */}
                  <div className="flex items-start gap-3.5">
                    {/* Spine Cover Graphic */}
                    <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-950 text-white flex flex-col justify-between p-2 shrink-0 shadow-sm border border-neutral-700/60">
                      <div className="flex items-center justify-between">
                        <BookOpen className="w-3 h-3 text-neutral-400" />
                        <span className="text-[8px] font-mono uppercase text-neutral-400">
                          {res.type}
                        </span>
                      </div>
                      <div className="text-[9px] font-bold line-clamp-2 leading-tight">
                        {res.title}
                      </div>
                      <div className="h-0.5 w-full bg-blue-500 rounded-full" />
                    </div>

                    {/* Meta & Status */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <Badge
                          variant={
                            isProcessing
                              ? 'warning'
                              : isCompleted
                              ? 'success'
                              : 'secondary'
                          }
                          size="sm"
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              Processing
                            </span>
                          ) : isCompleted ? (
                            'Completed'
                          ) : (
                            'In Progress'
                          )}
                        </Badge>
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          {res.lastOpenedAt}
                        </span>
                      </div>

                      <Link to={`/library/${res.id}`} className="block">
                        <h2 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors line-clamp-1 leading-snug">
                          {res.title}
                        </h2>
                      </Link>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                        by {res.author}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {res.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]/40"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Progress & Quick Actions */}
                <div className="p-4 pt-3 border-t border-[var(--border)] bg-[var(--secondary)]/30 space-y-3">
                  {isProcessing ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--warning)] font-medium flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Extracting AST & Chapters...
                      </span>
                      <Link to={`/library/${res.id}`}>
                        <Button size="sm" variant="outline">
                          View Pipeline
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
                          {res.completedChapters}/{res.totalChapters} chapters
                        </span>
                        <span className="font-mono font-semibold text-[var(--foreground)]">
                          {res.progress}%
                        </span>
                      </div>

                      <ProgressBar
                        value={res.progress}
                        size="xs"
                        variant={isCompleted ? 'success' : 'default'}
                      />

                      <div className="flex items-center justify-between pt-1">
                        <Link
                          to={`/library/${res.id}`}
                          className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                        >
                          Overview
                        </Link>
                        <Link to={`/reader/${res.id}/${res.currentChapterId}`}>
                          <Button
                            size="sm"
                            variant={isCompleted ? 'outline' : 'primary'}
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            {isCompleted ? 'Review' : 'Read'}
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
