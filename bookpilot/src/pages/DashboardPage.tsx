import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  Circle,
  FileText,
  Bookmark,
  GraduationCap,
  Code2,
  Layers,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

export const DashboardPage: React.FC = () => {
  const {
    resources,
    activeResource,
    chapters,
    activities,
    analytics,
    studyPlan,
    toggleStudyPlanTask,
  } = useBookPilot();

  // Find active chapter and section for the dominant Continue Reading card
  const resourceChapters = (activeResource && chapters[activeResource.id]) || [];
  const currentChapter =
    resourceChapters.find((c) => c.id === activeResource?.currentChapterId) ||
    resourceChapters[0];
  const currentSection =
    currentChapter?.sections.find((s) => s.id === activeResource?.currentSectionId) ||
    currentChapter?.sections[0];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-150">
      {/* 1. Technical Greeting & Purpose */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
              Workspace Overview
            </span>
            <span className="text-[var(--border)]">•</span>
            <span className="text-xs text-[var(--accent)] font-medium">Ready to continue</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Welcome back to your technical library
          </h1>
          <p className="text-xs md:text-sm text-[var(--muted-foreground)] mt-1">
            Pick up your reading right where you stopped or review active chapter concepts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/library">
            <Button variant="outline" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
              Browse Library ({resources.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. PRIORITY 1: Dominant "Continue Reading" Hero Card */}
      {activeResource && (
        <div className="relative overflow-hidden bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-xs hover:border-[var(--ring)]/40 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Book & Reading Position Metadata */}
            <div className="flex items-start gap-5">
              {/* Technical Book Cover / Spine */}
              <div className="relative w-20 h-28 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-950 text-white flex flex-col justify-between p-2.5 shrink-0 shadow-md border border-neutral-700/60 overflow-hidden">
                <div className="w-full flex items-center justify-between">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                    {activeResource.type}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold leading-tight line-clamp-2">
                    {activeResource.title}
                  </div>
                  <div className="text-[8px] text-neutral-400 truncate">
                    {activeResource.author}
                  </div>
                </div>
                <div className="h-0.5 w-full bg-blue-500 rounded-full" />
              </div>

              {/* Chapter & Reading Position */}
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent" size="sm">
                    Active Reading Resource
                  </Badge>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Last read {activeResource.lastOpenedAt}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
                    {activeResource.title}
                  </h2>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5 font-medium">
                    by {activeResource.author}
                  </p>
                </div>

                {/* Specific Section Location */}
                <div className="flex items-center gap-2 text-xs bg-[var(--secondary)]/70 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--foreground)] w-fit">
                  <span className="font-semibold text-[var(--primary)]">
                    Chapter {currentChapter?.number || 3}: {currentChapter?.title || 'Current Chapter'}
                  </span>
                  <span className="text-[var(--muted-foreground)]">/</span>
                  <span className="text-[var(--muted-foreground)] truncate max-w-[260px]">
                    {currentSection?.title || 'Section 3.2'}
                  </span>
                </div>

                {/* Progress Bar & Reading Time */}
                <div className="pt-1 max-w-md flex items-center gap-4">
                  <ProgressBar
                    value={activeResource.progress}
                    size="sm"
                    variant="accent"
                    showLabel
                  />
                  <span className="text-xs text-[var(--muted-foreground)] shrink-0 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    ~{activeResource.estimatedRemainingMinutes}m left
                  </span>
                </div>
              </div>
            </div>

            {/* Dominant CTA Button */}
            <div className="lg:self-center shrink-0">
              <Link
                to={`/reader/${activeResource.id}/${currentChapter?.id || 'ch-3'}`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-md"
                >
                  Resume Reading
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Grid: Today's Learning Plan & Focused Learning Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Learning Plan */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Today&apos;s Learning Plan</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Structured goals aligned with your active technical study plan
              </p>
            </div>
            <Link
              to="/study-plans"
              className="text-xs font-medium text-[var(--accent)] hover:underline shrink-0"
            >
              View Full Plan →
            </Link>
          </CardHeader>

          <CardContent className="space-y-2.5">
            {studyPlan.schedule.slice(0, 3).map((task) => (
              <div
                key={task.day}
                onClick={() => toggleStudyPlanTask(task.day)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  task.isDone
                    ? 'bg-[var(--secondary)]/40 border-[var(--border)] opacity-75'
                    : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--ring)]/30 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    aria-label={`Mark task day ${task.day} as ${task.isDone ? 'incomplete' : 'complete'}`}
                    className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {task.isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--muted-foreground)]" />
                    )}
                  </button>

                  <div className="truncate">
                    <div
                      className={`text-xs font-semibold ${
                        task.isDone
                          ? 'line-through text-[var(--muted-foreground)]'
                          : 'text-[var(--foreground)]'
                      }`}
                    >
                      {task.chapterTitle}
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-2">
                      <span className="capitalize font-medium">{task.taskType} Task</span>
                      <span>•</span>
                      <span>Day {task.day}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={task.isDone ? 'secondary' : 'outline'} size="sm">
                    {task.estimatedMinutes} min
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Focused Learning Snapshot */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Learning Snapshot</CardTitle>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Personal velocity & comprehension metrics
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Streak */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--secondary)]/60 border border-[var(--border)]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900/40">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Current Streak
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Daily cadence</div>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-[var(--foreground)]">
                {analytics.currentStreakDays} days
              </span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--secondary)]/60 border border-[var(--border)]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/40">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Reading Time
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Time in reader</div>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-[var(--foreground)]">
                {Math.round(analytics.totalReadingMinutes / 60)}h{' '}
                {analytics.totalReadingMinutes % 60}m
              </span>
            </div>

            {/* Quiz Average */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--secondary)]/60 border border-[var(--border)]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/40">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Quiz Mastery
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Concept accuracy</div>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-[var(--foreground)]">
                {analytics.quizAverage}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Active Resources & Recent Learning Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Resources */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Active Resources</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Technical books and guides in progress
              </p>
            </div>
            <Link
              to="/library"
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              All Books ({resources.length}) →
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {resources.slice(0, 3).map((res) => (
              <Link
                key={res.id}
                to={`/library/${res.id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)]/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-10 rounded bg-neutral-900 text-neutral-300 flex items-center justify-center shrink-0 text-[10px] font-mono border border-neutral-700 font-bold uppercase">
                    {res.type}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
                      {res.title}
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      {res.author} · {res.completedChapters}/{res.totalChapters} chapters
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <ProgressBar value={res.progress} size="xs" className="w-16 hidden sm:flex" />
                  <span className="text-xs font-mono font-semibold text-[var(--foreground)]">
                    {res.progress}%
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Learning Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Timeline of reading, practice, and notes
              </p>
            </div>
            <Link
              to="/progress"
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              Insights →
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {activities.slice(0, 4).map((act) => {
              const iconMap = {
                reading: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
                quiz: <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />,
                coding: <Code2 className="w-3.5 h-3.5 text-purple-500" />,
                bookmark: <Bookmark className="w-3.5 h-3.5 text-amber-500" />,
                highlight: <FileText className="w-3.5 h-3.5 text-rose-500" />,
              };

              return (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 text-xs pb-2.5 border-b border-[var(--border)] last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[var(--secondary)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--border)]/60">
                      {iconMap[act.type] || <BookOpen className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-[var(--foreground)] truncate">{act.title}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                        {act.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)] shrink-0">
                    {act.timestamp}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
