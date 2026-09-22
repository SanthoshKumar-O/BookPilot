import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  Award,
  Flame,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';

export const ProgressPage: React.FC = () => {
  const { analytics, resources, activities, quizResults } = useBookPilot();

  // Reading time calculations
  const readingHours = Math.floor(analytics.totalReadingMinutes / 60);
  const readingMins = analytics.totalReadingMinutes % 60;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            Analytics & Insights
          </span>
          <span className="text-[var(--border)]">•</span>
          <span className="text-xs text-[var(--success)] font-medium">
            {analytics.currentStreakDays} day streak active
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Progress & Insights</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Meaningful metrics tracking your reading depth, concept mastery, and review priorities.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <Clock className="w-5 h-5 text-blue-500" />,
            label: 'Reading Time',
            value: `${readingHours}h ${readingMins}m`,
            sublabel: 'Total time in reader',
            color: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40',
          },
          {
            icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
            label: 'Chapters Done',
            value: `${analytics.totalChaptersCompleted}`,
            sublabel: 'Chapters completed',
            color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/40',
          },
          {
            icon: <Award className="w-5 h-5 text-emerald-500" />,
            label: 'Quiz Average',
            value: `${analytics.quizAverage}%`,
            sublabel: `${quizResults.length} quizzes taken`,
            color: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40',
          },
          {
            icon: <Flame className="w-5 h-5 text-amber-500" />,
            label: 'Learning Streak',
            value: `${analytics.currentStreakDays}`,
            sublabel: 'Consecutive days',
            color: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40',
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 space-y-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${metric.color}`}>
              {metric.icon}
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[var(--foreground)]">{metric.value}</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{metric.label}</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">{metric.sublabel}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Resource Progress</CardTitle>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Reading depth across all technical books in your library
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.map((res) => (
            <div key={res.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-7 rounded bg-neutral-900 flex items-center justify-center text-[8px] text-neutral-300 font-mono shrink-0 border border-neutral-700">
                    {res.type.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/library/${res.id}`}
                      className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors truncate block"
                    >
                      {res.title}
                    </Link>
                    <div className="text-[var(--muted-foreground)] text-[11px]">
                      {res.completedChapters}/{res.totalChapters} chapters
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="font-mono font-bold text-[var(--foreground)]">{res.progress}%</span>
                  {res.status === 'completed' && (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </div>
              <ProgressBar
                value={res.progress}
                size="xs"
                variant={res.status === 'completed' ? 'success' : 'accent'}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mastery + Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Concepts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--success-subtle)] text-[var(--success)] flex items-center justify-center border border-[var(--success)]/20">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <CardTitle>Strong Concepts</CardTitle>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Topics where you've demonstrated consistent mastery
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {analytics.strongConcepts.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] text-center py-4">
                Complete quizzes to track strong concepts
              </p>
            ) : (
              analytics.strongConcepts.map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-3 rounded-xl bg-[var(--success-subtle)]/40 border border-[var(--success)]/20"
                >
                  <span className="font-medium text-[var(--foreground)]">{sc.name}</span>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={sc.score} size="xs" variant="success" className="w-16 hidden sm:flex" />
                    <span className="font-semibold font-mono text-[var(--success)]">{sc.score}%</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chapters Needing Review */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--warning-subtle)] text-[var(--warning)] flex items-center justify-center border border-[var(--warning)]/20">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <CardTitle>Recommended Review</CardTitle>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Chapters and concepts that benefit from revisiting
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {analytics.chaptersNeedingReview.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] text-center py-4">
                No chapters flagged for review yet
              </p>
            ) : (
              analytics.chaptersNeedingReview.map((rev, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-[var(--warning)]/20 bg-[var(--warning-subtle)]/40 space-y-2"
                >
                  <div className="flex items-start gap-2 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-[var(--warning)] shrink-0 mt-0.5" />
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-[var(--foreground)] truncate">{rev.chapterTitle}</div>
                      <div className="text-[11px] text-[var(--muted-foreground)]">{rev.reason}</div>
                    </div>
                  </div>
                  <Link
                    to={`/reader/${rev.resourceId}/${rev.chapterId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:underline ml-5"
                  >
                    Revisit in Reader
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <Link
              to="/library"
              className="text-xs text-[var(--accent)] hover:underline font-medium flex items-center gap-1"
            >
              My Library
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Timeline of learning events</p>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-[var(--border)]">
          {activities.slice(0, 8).map((act) => {
            const iconMap: Record<string, React.ReactNode> = {
              reading: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
              quiz: <Award className="w-3.5 h-3.5 text-emerald-500" />,
              coding: <TrendingUp className="w-3.5 h-3.5 text-purple-500" />,
              bookmark: <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />,
              highlight: <Flame className="w-3.5 h-3.5 text-rose-500" />,
            };
            return (
              <div
                key={act.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[var(--secondary)] flex items-center justify-center shrink-0 border border-[var(--border)]/60 mt-0.5">
                    {iconMap[act.type] || <BookOpen className="w-3.5 h-3.5" />}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-[var(--foreground)] truncate">{act.title}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate">{act.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)] shrink-0">{act.timestamp}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
