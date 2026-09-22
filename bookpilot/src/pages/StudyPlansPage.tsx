import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Flame,
  Target,
  Clock,
  BookOpen,
  GraduationCap,
  Code2,
  ChevronRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

const taskTypeIcon: Record<string, React.ReactNode> = {
  read: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
  reading: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
  quiz: <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />,
  code: <Code2 className="w-3.5 h-3.5 text-purple-500" />,
  coding: <Code2 className="w-3.5 h-3.5 text-purple-500" />,
  review: <TrendingUp className="w-3.5 h-3.5 text-amber-500" />,
};

const taskTypeColor: Record<string, string> = {
  read: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40',
  reading: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40',
  quiz: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40',
  code: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/40',
  coding: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/40',
  review: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40',
};

export const StudyPlansPage: React.FC = () => {
  const { studyPlan, toggleStudyPlanTask, resources, activeResource, chapters } = useBookPilot();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const completedTasks = studyPlan.schedule.filter((t) => t.isDone).length;
  const totalTasks = studyPlan.schedule.length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const dailyAvgMinutes = Math.round(
    studyPlan.schedule.reduce((acc, t) => acc + t.estimatedMinutes, 0) / totalTasks
  );

  const todayTasks = studyPlan.schedule.slice(0, 3);
  const upcomingTasks = studyPlan.schedule.slice(3);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            Learning Roadmap
          </span>
          <span className="text-[var(--border)]">•</span>
          <span className="text-xs text-[var(--accent)] font-medium">{studyPlan.currentStreakDays} day streak</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Study Plans</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Structured roadmap connecting your reading sessions, quizzes, and coding exercises.
        </p>
      </div>

      {/* Active Plan Overview */}
      <Card>
        <CardContent className="p-5 space-y-5">
          {/* Plan Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
                Active Plan
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)] truncate">{studyPlan.resourceTitle}</h2>
              <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Target: {studyPlan.targetCompletionDate}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{dailyAvgMinutes}m/day
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-center shrink-0">
              <div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">{studyPlan.currentStreakDays}</div>
                <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 justify-center">
                  <Flame className="w-3 h-3 text-amber-500" />
                  Day streak
                </div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {studyPlan.completedDays}/{studyPlan.totalDays}
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)]">Days done</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">{overallProgress}%</div>
                <div className="text-[10px] text-[var(--muted-foreground)]">Progress</div>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Plan Completion</span>
              <span className="font-mono font-semibold text-[var(--foreground)]">
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>
            <ProgressBar value={overallProgress} size="sm" variant="accent" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--foreground)]">Today's Tasks</h3>
          <span className="text-xs text-[var(--muted-foreground)]">
            {todayTasks.filter((t) => t.isDone).length}/{todayTasks.length} done today
          </span>
        </div>

        <div className="space-y-2.5">
          {todayTasks.map((task) => (
            <div
              key={task.day}
              className={`bg-[var(--card)] border rounded-xl overflow-hidden transition-all ${
                task.isDone
                  ? 'border-[var(--border)] opacity-70'
                  : 'border-[var(--border)] hover:border-[var(--ring)]/30 shadow-2xs'
              }`}
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer select-none"
                onClick={() => toggleStudyPlanTask(task.day)}
              >
                {/* Completion Toggle */}
                <button
                  type="button"
                  aria-label={`Mark Day ${task.day} as ${task.isDone ? 'incomplete' : 'complete'}`}
                  className="shrink-0 transition-transform hover:scale-110"
                >
                  {task.isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[var(--muted-foreground)]" />
                  )}
                </button>

                {/* Task Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className={`text-sm font-semibold truncate ${task.isDone ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>
                    {task.chapterTitle}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
                    <span>Day {task.day}</span>
                    <span>·</span>
                    <span>{task.date}</span>
                    <span>·</span>
                    <span className="capitalize flex items-center gap-1">
                      {taskTypeIcon[task.taskType as keyof typeof taskTypeIcon] || null}
                      {task.taskType}
                    </span>
                  </div>
                </div>

                {/* Right: Time + Type Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" size="sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.estimatedMinutes}m
                  </Badge>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold capitalize ${taskTypeColor[task.taskType] || ''}`}>
                    {task.taskType}
                  </span>
                </div>
              </div>

              {/* Expanded: Quick Action Link */}
              {!task.isDone && (
                <div className="px-4 pb-3 flex items-center gap-3 -mt-1">
                  <div className="ml-9 flex items-center gap-3 text-xs">
                    {task.taskType === 'read' && activeResource && (
                      <Link
                        to={`/reader/${activeResource.id}/${activeResource.currentChapterId}`}
                        className="text-[var(--accent)] hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        Open in Reader
                      </Link>
                    )}
                    {task.taskType === 'quiz' && (
                      <Link
                        to="/quizzes"
                        className="text-[var(--accent)] hover:underline flex items-center gap-1"
                      >
                        <GraduationCap className="w-3 h-3" />
                        Go to Quiz Center
                      </Link>
                    )}
                    {task.taskType === 'code' && (
                      <Link
                        to="/coding"
                        className="text-[var(--accent)] hover:underline flex items-center gap-1"
                      >
                        <Code2 className="w-3 h-3" />
                        Open Coding Practice
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Schedule */}
      {upcomingTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--foreground)]">Full Schedule</h3>
            <span className="text-xs text-[var(--muted-foreground)]">{upcomingTasks.length} upcoming tasks</span>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
            {upcomingTasks.map((task, i) => (
              <div
                key={task.day}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors hover:bg-[var(--muted)]/50 ${
                  task.isDone ? 'opacity-60' : ''
                }`}
                onClick={() => toggleStudyPlanTask(task.day)}
              >
                {task.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${task.isDone ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>
                    Day {task.day} · {task.chapterTitle}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">{task.date}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{task.estimatedMinutes}m</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono capitalize ${taskTypeColor[task.taskType] || 'bg-[var(--muted)]'}`}>
                    {task.taskType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Tip */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/20">
          <Target className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-[var(--foreground)]">Consistency is key</div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Even 20 minutes of focused technical reading daily builds lasting comprehension. Your current streak of{' '}
            <strong>{studyPlan.currentStreakDays} days</strong> is building strong learning habits.
          </p>
        </div>
      </div>
    </div>
  );
};
