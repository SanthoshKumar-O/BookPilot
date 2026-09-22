import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
  Layers,
  ChevronRight,
  Sparkles,
  BookMarked,
  FileText,
  Bookmark,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { ResourceProcessingView } from '../components/library/ResourceProcessingView';

export const ResourceDetailPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { resources, chapters, concepts, notes, highlights, quizzes, quizResults } = useBookPilot();
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'concepts' | 'notes'>('overview');

  const resource = resources.find((r) => r.id === resourceId) || resources[0];
  const resourceChapters = (resource && chapters[resource.id]) || [];
  const resourceConcepts = concepts.filter((c) => c.resourceId === resource?.id);
  const resourceNotes = notes.filter((n) => n.resourceId === resource?.id);
  const resourceHighlights = highlights.filter((h) => h.resourceId === resource?.id);

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <EmptyState
          icon={BookMarked}
          title="Resource not found"
          description="We couldn't find the technical resource you were looking for."
          actionLabel="Back to Library"
          onAction={() => (window.location.href = '/library')}
        />
      </div>
    );
  }

  // If resource is in processing status, render the dedicated processing pipeline
  if (resource.status === 'processing') {
    return <ResourceProcessingView resource={resource} />;
  }

  const currentChapter =
    resourceChapters.find((c) => c.id === resource.currentChapterId) || resourceChapters[0];

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    {
      id: 'chapters',
      label: 'Learning Path & Chapters',
      icon: <Layers className="w-4 h-4" />,
      count: resourceChapters.length,
    },
    {
      id: 'concepts',
      label: 'Extracted Concepts',
      icon: <Sparkles className="w-4 h-4" />,
      count: resourceConcepts.length,
    },
    {
      id: 'notes',
      label: 'Notes & Highlights',
      icon: <FileText className="w-4 h-4" />,
      count: resourceNotes.length + resourceHighlights.length,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-150">
      {/* 1. Header: Book Cover, Title, Metadata, and Primary Action */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Cover Spine & Details */}
          <div className="flex items-start gap-5 min-w-0">
            {/* Technical Spine Graphic */}
            <div className="relative w-20 h-28 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-950 text-white flex flex-col justify-between p-3 shrink-0 shadow-md border border-neutral-700">
              <div className="flex items-center justify-between">
                <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                  {resource.type}
                </span>
              </div>
              <div>
                <div className="text-[10px] font-bold line-clamp-2 leading-tight">
                  {resource.title}
                </div>
                <div className="text-[8px] text-neutral-400 truncate mt-0.5">
                  {resource.author}
                </div>
              </div>
              <div className="h-0.5 w-full bg-blue-500 rounded-full" />
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={resource.status === 'completed' ? 'success' : 'secondary'}
                  size="sm"
                >
                  {resource.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Last opened {resource.lastOpenedAt}
                </span>
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  {resource.title}
                </h1>
                <p className="text-xs md:text-sm text-[var(--muted-foreground)] font-medium mt-0.5">
                  by {resource.author} · {resource.totalPages} Pages
                </p>
              </div>

              {/* Progress & Chapter stats */}
              <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] pt-1 max-w-md">
                <ProgressBar
                  value={resource.progress}
                  size="sm"
                  variant={resource.status === 'completed' ? 'success' : 'accent'}
                  showLabel
                />
                <span className="shrink-0 font-mono">
                  {resource.completedChapters}/{resource.totalChapters} chapters
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
            <Link to={`/reader/${resource.id}/${resource.currentChapterId}`}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full shadow-md"
              >
                {resource.status === 'completed' ? 'Review Book' : 'Continue Reading'}
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
              <Clock className="w-3.5 h-3.5" />
              <span>~{resource.estimatedRemainingMinutes} min remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'overview' | 'chapters' | 'concepts' | 'notes')}
      />

      {/* 3. Tab Contents */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Description Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>About this Technical Resource</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {resource.description}
              </p>

              {resource.tags && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                  <span className="text-xs font-semibold text-[var(--foreground)] self-center mr-1">
                    Topics:
                  </span>
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>Est. Remaining Time</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-[var(--foreground)] font-mono">
                {Math.round(resource.estimatedRemainingMinutes / 60)}h{' '}
                {resource.estimatedRemainingMinutes % 60}m
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">Based on reading speed</p>
            </Card>

            <Card className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>Time Spent Reading</span>
                <BookOpen className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-[var(--foreground)] font-mono">
                {Math.round(resource.totalReadingMinutes / 60)}h{' '}
                {resource.totalReadingMinutes % 60}m
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">Active reader sessions</p>
            </Card>

            <Card className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>Quiz Mastery</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-[var(--foreground)] font-mono">
                {resource.quizAverageScore}%
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">Across chapter quizzes</p>
            </Card>
          </div>

          {/* Next Recommended Step */}
          <Card className="p-5 bg-[var(--secondary)]/40 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                Current Learning Position
              </span>
              <h4 className="text-sm font-bold text-[var(--foreground)]">
                Chapter {currentChapter?.number}: {currentChapter?.title}
              </h4>
              <p className="text-xs text-[var(--muted-foreground)]">
                {currentChapter?.sections.length} sections · ~{currentChapter?.estimatedMinutes} min read
              </p>
            </div>

            <Link to={`/reader/${resource.id}/${currentChapter?.id}`}>
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read Chapter
              </Button>
            </Link>
          </Card>
        </div>
      )}

      {/* CHAPTERS & LEARNING PATH TAB */}
      {activeTab === 'chapters' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Vertical Learning Path
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Sequential progression of technical chapters with assessments
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">
              {resource.completedChapters} of {resource.totalChapters} Completed
            </span>
          </div>

          {/* Vertical Chapter Progression Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
            {resourceChapters.map((ch) => {
              const isCurrent = ch.id === resource.currentChapterId;
              const hasQuiz = Boolean(ch.quizId);
              const chapterQuiz = quizzes.find((q) => q.chapterId === ch.id);
              const chapterQuizResult = quizResults.find((qr) => qr.chapterId === ch.id);

              return (
                <div key={ch.id} className="relative group">
                  {/* Step Connector Marker */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      ch.isCompleted
                        ? 'bg-[var(--success)] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] ring-4 ring-[var(--primary)]/20'
                        : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]'
                    }`}
                  >
                    {ch.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span>{ch.number}</span>
                    )}
                  </div>

                  {/* Chapter Card */}
                  <Card
                    variant={isCurrent ? 'default' : 'default'}
                    className={`p-5 transition-all ${
                      isCurrent
                        ? 'border-[var(--ring)]/50 shadow-xs ring-1 ring-[var(--ring)]/10'
                        : 'hover:border-[var(--border)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Chapter Info */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-[var(--muted-foreground)]">
                            Chapter {ch.number}
                          </span>
                          {isCurrent && (
                            <Badge variant="accent" size="sm">
                              Current Reading
                            </Badge>
                          )}
                          {ch.isCompleted && (
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                          {ch.title}
                        </h4>

                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                          {ch.overview}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {ch.estimatedMinutes} min
                          </span>
                          <span>•</span>
                          <span>{ch.sections.length} sections</span>
                          {hasQuiz && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-[var(--foreground)] font-medium">
                                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                                {chapterQuizResult
                                  ? `Quiz Score: ${chapterQuizResult.score}%`
                                  : 'Quiz Available'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {hasQuiz && chapterQuiz && (
                          <Link to={`/quizzes/${chapterQuiz.id}`}>
                            <Button size="sm" variant="outline">
                              Quiz
                            </Button>
                          </Link>
                        )}
                        <Link to={`/reader/${resource.id}/${ch.id}`}>
                          <Button
                            size="sm"
                            variant={isCurrent ? 'primary' : 'secondary'}
                            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                          >
                            {ch.isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Read'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONCEPTS TAB */}
      {activeTab === 'concepts' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Extracted Technical Concepts
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Core terminology, algorithms, and models extracted by BookPilot
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">
              {resourceConcepts.length} Concepts Identified
            </span>
          </div>

          {resourceConcepts.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No concepts extracted yet"
              description="Concepts will appear once document parsing identifies key terminology."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourceConcepts.map((con) => (
                <Card key={con.id} className="p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent" size="sm">
                        {con.category}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" size="sm">
                          {con.difficulty}
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {con.importance}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[var(--foreground)]">{con.name}</h4>

                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {con.explanation}
                    </p>

                    {con.prerequisites && con.prerequisites.length > 0 && (
                      <div className="pt-2 text-[11px] text-[var(--muted-foreground)]">
                        <span className="font-semibold text-[var(--foreground)]">
                          Prerequisites:{' '}
                        </span>
                        <span>{con.prerequisites.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Ref: {con.chapterReference}
                    </span>
                    <Link
                      to={`/reader/${con.resourceId}/${con.chapterId}`}
                      className="font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
                    >
                      Jump to Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTES & HIGHLIGHTS TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Annotations & Highlights
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Saved reading excerpts, formulas, and personal notes
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">
              {resourceNotes.length} Notes · {resourceHighlights.length} Highlights
            </span>
          </div>

          {resourceNotes.length === 0 && resourceHighlights.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No notes or highlights yet"
              description="While reading in the technical reader, select any text to highlight, add notes, or ask the AI companion."
              actionLabel="Open Reader"
              onAction={() =>
                (window.location.href = `/reader/${resource.id}/${resource.currentChapterId}`)
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Highlights */}
              {resourceHighlights.map((hl) => (
                <Card key={hl.id} className="p-4 space-y-2 border-l-4 border-l-[var(--accent)]">
                  <div className="flex items-center justify-between">
                    <Badge variant={hl.category as any} size="sm">
                      {hl.category.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      {hl.createdAt}
                    </span>
                  </div>

                  <blockquote className="text-xs italic text-[var(--foreground)] leading-relaxed pl-2 border-l-2 border-[var(--border)]">
                    &ldquo;{hl.text}&rdquo;
                  </blockquote>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                    <span>Location: {hl.location || 'Section Reading'}</span>
                    <Link
                      to={`/reader/${hl.resourceId}/${hl.chapterId}`}
                      className="text-[var(--accent)] hover:underline font-medium"
                    >
                      View in Reader →
                    </Link>
                  </div>
                </Card>
              ))}

              {/* Personal Notes */}
              {resourceNotes.map((n) => (
                <Card key={n.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
                      <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                      <span>Note on Excerpt</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      {n.createdAt}
                    </span>
                  </div>

                  <blockquote className="text-xs italic text-[var(--muted-foreground)] bg-[var(--secondary)]/50 p-2.5 rounded-lg border border-[var(--border)]/60">
                    &ldquo;{n.selectedText}&rdquo;
                  </blockquote>

                  <p className="text-xs font-medium text-[var(--foreground)] leading-relaxed pl-1">
                    {n.note}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                    <span>{n.location}</span>
                    <Link
                      to={`/reader/${n.resourceId}/${n.chapterId}`}
                      className="text-[var(--accent)] hover:underline font-medium"
                    >
                      Jump to Context →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
