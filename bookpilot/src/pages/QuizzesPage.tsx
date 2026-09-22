import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Award,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';

type QuizFilter = 'all' | 'completed' | 'not_started';

export const QuizzesPage: React.FC = () => {
  const { quizzes, resources, quizResults } = useBookPilot();
  const [filter, setFilter] = useState<QuizFilter>('all');

  const filteredQuizzes = quizzes.filter((quiz) => {
    const result = quizResults.find((r) => r.quizId === quiz.id);
    if (filter === 'completed') return !!result;
    if (filter === 'not_started') return !result;
    return true;
  });

  const completedCount = quizResults.length;
  const avgScore = quizResults.length
    ? Math.round(quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length)
    : 0;
  const totalTime = quizzes.reduce((acc, q) => acc + q.estimatedMinutes, 0);

  const filterTabs: { id: QuizFilter; label: string }[] = [
    { id: 'all', label: `All (${quizzes.length})` },
    { id: 'completed', label: `Completed (${completedCount})` },
    { id: 'not_started', label: `Not Started (${quizzes.length - completedCount})` },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            Assessment Center
          </span>
          <span className="text-[var(--border)]">•</span>
          <span className="text-xs text-[var(--muted-foreground)]">{quizzes.length} Available Quizzes</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Quiz Center</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Reinforce conceptual understanding through chapter assessments and targeted review.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/40 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[var(--foreground)]">{completedCount} / {quizzes.length}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Quizzes Completed</div>
          </div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/40 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[var(--foreground)]">{avgScore > 0 ? `${avgScore}%` : '—'}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Average Score</div>
          </div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-900/40 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[var(--foreground)]">~{totalTime}m</div>
            <div className="text-xs text-[var(--muted-foreground)]">Total Estimated Time</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {quizzes.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--foreground)]">Overall Assessment Progress</span>
            <span className="font-mono text-[var(--muted-foreground)]">
              {completedCount} / {quizzes.length} complete
            </span>
          </div>
          <ProgressBar
            value={Math.round((completedCount / quizzes.length) * 100)}
            size="sm"
            variant="accent"
            showLabel
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors select-none ${
              filter === tab.id
                ? 'bg-[var(--secondary)] text-[var(--foreground)] border border-b-0 border-[var(--border)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz Cards */}
      {filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No quizzes match this filter"
          description="Try a different filter to see available assessments."
          actionLabel="Show All"
          onAction={() => setFilter('all')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredQuizzes.map((quiz) => {
            const res = resources.find((r) => r.id === quiz.resourceId);
            const result = quizResults.find((qr) => qr.quizId === quiz.id);
            const isCompleted = !!result;

            return (
              <Card key={quiz.id} variant="interactive" className="flex flex-col justify-between">
                <div className="p-5 space-y-4">
                  {/* Source book + time */}
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{res?.title || 'Technical Resource'}</span>
                    </div>
                    <span className="flex items-center gap-1 shrink-0 ml-2">
                      <Clock className="w-3 h-3" />
                      ~{quiz.estimatedMinutes}m
                    </span>
                  </div>

                  {/* Quiz Title */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[var(--foreground)] leading-snug">{quiz.title}</h3>
                      {isCompleted && (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Passed
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {quiz.questionsCount} interactive questions covering core concepts
                    </p>
                  </div>

                  {/* Score display */}
                  {isCompleted && result && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--muted-foreground)]">Last Score</span>
                        <span className={`font-mono font-bold ${
                          result.score >= 80 ? 'text-[var(--success)]' :
                          result.score >= 60 ? 'text-[var(--warning)]' : 'text-[var(--error)]'
                        }`}>
                          {result.score}%
                        </span>
                      </div>
                      <ProgressBar
                        value={result.score}
                        size="xs"
                        variant={result.score >= 80 ? 'success' : result.score >= 60 ? 'default' : 'default'}
                      />
                      <div className="text-[10px] text-[var(--muted-foreground)]">
                        {result.correctCount}/{result.totalQuestions} correct · Completed {result.completedAt}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <Link
                    to={`/reader/${quiz.resourceId}/${quiz.chapterId}`}
                    className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    Review Chapter
                  </Link>
                  <Link to={`/quizzes/${quiz.id}`}>
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'primary'}
                      rightIcon={isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {isCompleted ? 'Retake' : 'Start Quiz'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Practice Suggestion */}
      {completedCount > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[var(--foreground)]">
              Ready for deeper practice?
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Your AI companion can generate additional practice questions based on your weak areas and the chapters you've read.
            </p>
            <Link
              to="/progress"
              className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-medium mt-1"
            >
              View Learning Insights
              <TrendingUp className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
