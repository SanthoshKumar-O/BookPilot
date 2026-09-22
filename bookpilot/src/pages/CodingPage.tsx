import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Trophy,
  Filter,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const CodingPage: React.FC = () => {
  const { codingProblems } = useBookPilot();
  const [filterTab, setFilterTab] = useState<'all' | 'solved' | 'unsolved' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const solvedCount = codingProblems.filter((p) => p.status === 'solved').length;
  const totalCount = codingProblems.length;
  const solvedPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const filteredProblems = codingProblems.filter((p) => {
    // Tab filter
    if (filterTab === 'solved' && p.status !== 'solved') return false;
    if (filterTab === 'unsolved' && p.status === 'solved') return false;
    if (['Easy', 'Medium', 'Hard'].includes(filterTab) && p.difficulty !== filterTab) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.relatedConceptName && p.relatedConceptName.toLowerCase().includes(q)) ||
        (p.relatedChapterTitle && p.relatedChapterTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Coding Sandbox & Practice
            </h1>
            <Badge variant="accent" size="sm">
              Hands-on
            </Badge>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Implement algorithms, data structures, and mathematical proofs directly derived from your reading materials.
          </p>
        </div>

        {/* Quick CTA */}
        {codingProblems.length > 0 && (
          <Link
            to={`/coding/${codingProblems.find((p) => p.status !== 'solved')?.id || codingProblems[0].id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Continue Next Challenge</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
            <span>Overall Completion</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--foreground)] mb-2">
            {solvedCount} <span className="text-sm font-normal text-[var(--muted-foreground)]">/ {totalCount} Solved</span>
          </div>
          <ProgressBar value={solvedPercent} size="sm" variant="accent" showLabel={false} />
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
            <span>Difficulty Breakdown</span>
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-medium">
              Easy: {codingProblems.filter((p) => p.difficulty === 'Easy').length}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono font-medium">
              Med: {codingProblems.filter((p) => p.difficulty === 'Medium').length}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-mono font-medium">
              Hard: {codingProblems.filter((p) => p.difficulty === 'Hard').length}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
            <span>Runtime Environment</span>
            <Code2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xs text-[var(--foreground)] font-mono font-semibold">
            Python 3.12 / TypeScript 5.4
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Standard library & unit test runner enabled
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--secondary)] border border-[var(--border)] overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Problems' },
            { id: 'unsolved', label: 'Unsolved' },
            { id: 'solved', label: 'Solved' },
            { id: 'Easy', label: 'Easy' },
            { id: 'Medium', label: 'Medium' },
            { id: 'Hard', label: 'Hard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterTab === tab.id
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or concepts..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8">
            <Code2 className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-semibold text-[var(--foreground)]">No problems found</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Try adjusting your search query or filter tab.
            </p>
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const isSolved = prob.status === 'solved';
            return (
              <div
                key={prob.id}
                className="bg-[var(--card)] border border-[var(--border)] hover:border-[var(--muted-foreground)]/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="pt-0.5">
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                        {prob.title}
                      </h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                      {prob.testCases && (
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          {prob.testCases.length} test cases
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      {prob.relatedChapterTitle && (
                        <span className="flex items-center gap-1 truncate">
                          <BookOpen className="w-3 h-3 shrink-0" />
                          <span>{prob.relatedChapterTitle}</span>
                        </span>
                      )}
                      {prob.relatedConceptName && (
                        <span className="px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[10px] font-mono">
                          {prob.relatedConceptName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center self-end">
                  <Link
                    to={`/coding/${prob.id}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isSolved
                        ? 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--border)]'
                        : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90'
                    }`}
                  >
                    <span>{isSolved ? 'Review Code' : 'Solve Challenge'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
