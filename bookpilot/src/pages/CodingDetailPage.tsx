import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Copy,
  Check,
  Terminal,
  FileCode2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useBookPilot } from '../context';
import { Badge } from '../components/ui/Badge';
import type { CodeSubmissionResult } from '../types';

export const CodingDetailPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const { codingProblems, submitCodeProblem, resources } = useBookPilot();
  const problem = codingProblems.find((p) => p.id === problemId) || codingProblems[0];

  const [code, setCode] = useState(problem?.starterCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CodeSubmissionResult | null>(null);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!problem) {
    return (
      <div className="p-12 text-center text-sm text-[var(--muted-foreground)]">
        Problem not found.
      </div>
    );
  }

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await submitCodeProblem(problem.id, code);
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find next problem for easy progression
  const currentIndex = codingProblems.findIndex((p) => p.id === problem.id);
  const nextProblem = currentIndex >= 0 && currentIndex < codingProblems.length - 1 ? codingProblems[currentIndex + 1] : null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[var(--background)] animate-in fade-in duration-200">
      {/* Sub Header */}
      <div className="h-12 border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between bg-[var(--card)] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/coding"
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Problems</span>
          </Link>
          <div className="h-4 w-[1px] bg-[var(--border)] shrink-0" />
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold truncate text-[var(--foreground)]">
              {problem.title}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {problem.relatedChapterTitle && (
            <Link
              to={`/reader/${problem.resourceId}/${problem.chapterId}`}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Open the chapter in Reader"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Read Chapter</span>
            </Link>
          )}

          <button
            onClick={() => setCode(problem.starterCode)}
            className="p-1.5 rounded-lg text-xs border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors"
            title="Reset code to template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-xs border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            disabled={isRunning}
            onClick={handleRun}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run & Submit'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Description & Code Editor */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Statement & Context */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-[var(--border)] space-y-6 bg-[var(--card)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-[var(--foreground)]">{problem.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
              {problem.relatedChapterTitle && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{problem.relatedChapterTitle}</span>
                </span>
              )}
              {problem.relatedConceptName && (
                <span className="px-1.5 py-0.5 rounded bg-[var(--secondary)] font-mono text-[11px]">
                  Concept: {problem.relatedConceptName}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-[var(--foreground)] leading-relaxed whitespace-pre-line space-y-2">
            {problem.description}
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider text-[11px]">
              Examples
            </h4>
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-[var(--secondary)] border border-[var(--border)] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[var(--muted-foreground)] shrink-0">Input:</span>
                  <span className="text-[var(--foreground)] break-all">{ex.input}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--muted-foreground)] shrink-0">Output:</span>
                  <span className="text-[var(--foreground)] font-semibold break-all">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-[11px] font-sans text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]/60">
                    <span className="font-medium text-[var(--foreground)]">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider text-[11px]">
              Constraints
            </h4>
            <ul className="list-disc pl-4 text-xs text-[var(--muted-foreground)] space-y-1 font-mono">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Connected Chapter Card */}
          {problem.relatedChapterTitle && (
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Need a refresher on the underlying theory?</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                The algorithm required for this problem is explained step-by-step in {problem.relatedChapterTitle}.
              </p>
              <Link
                to={`/reader/${problem.resourceId}/${problem.chapterId}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline pt-1"
              >
                <span>Open in BookPilot Reader</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right: Code Editor & Console Shell */}
        <div className="w-full md:w-1/2 flex flex-col bg-[var(--background)]">
          {/* File Header */}
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-[var(--muted-foreground)]">
              <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
              <span>solution.py</span>
            </div>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              Press <kbd className="px-1 py-0.5 rounded bg-[var(--secondary)] border border-[var(--border)] font-mono">Ctrl+Enter</kbd> to run
            </span>
          </div>

          {/* Textarea Editor with line numbers style */}
          <div className="flex-1 relative flex overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleRun();
                }
              }}
              className="w-full h-full p-4 font-mono text-xs text-[var(--foreground)] bg-transparent focus:outline-none resize-none leading-relaxed selection:bg-blue-500/20"
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
            />
          </div>

          {/* Test Case / Result Console Panel */}
          <div className="h-56 border-t border-[var(--border)] bg-[var(--card)] flex flex-col">
            {/* Console Header / Tabs */}
            <div className="px-4 py-2 border-b border-[var(--border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <span className="font-semibold text-[11px] uppercase tracking-wider text-[var(--muted-foreground)]">
                  Test Cases & Execution
                </span>
              </div>

              {/* Test Case Selectors */}
              <div className="flex items-center gap-1">
                {problem.testCases.map((tc, idx) => (
                  <button
                    key={tc.id}
                    onClick={() => setActiveTestCaseTab(idx)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      activeTestCaseTab === idx
                        ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold border border-[var(--border)]'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Console Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {result ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                      result.status === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {result.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>
                        {result.status === 'success'
                          ? `Accepted — All ${result.totalCount} Test Cases Passed`
                          : `Wrong Answer (${result.passedCount}/${result.totalCount} passed)`}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono opacity-80">
                      Runtime: {result.runtimeMs}ms · Memory: {result.memoryMb}MB
                    </div>
                  </div>

                  {/* Next Problem Prompt if passed */}
                  {result.status === 'success' && nextProblem && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--secondary)] text-xs">
                      <span className="text-[var(--muted-foreground)]">Ready for the next challenge?</span>
                      <Link
                        to={`/coding/${nextProblem.id}`}
                        className="text-[var(--accent)] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Next: {nextProblem.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {problem.testCases[activeTestCaseTab] && (
                    <div className="space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-[var(--muted-foreground)]">Input: </span>
                        <span className="p-1 rounded bg-[var(--secondary)] text-[var(--foreground)]">
                          {problem.testCases[activeTestCaseTab].input}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)]">Expected Output: </span>
                        <span className="p-1 rounded bg-[var(--secondary)] text-[var(--foreground)] font-semibold">
                          {problem.testCases[activeTestCaseTab].expectedOutput}
                        </span>
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--muted-foreground)] italic pt-2">
                    Click &ldquo;Run & Submit&rdquo; to test your code against all test cases.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
