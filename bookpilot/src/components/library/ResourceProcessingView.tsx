import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { Resource } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export interface ResourceProcessingViewProps {
  resource: Resource;
  onComplete?: () => void;
}

interface Step {
  id: string;
  name: string;
  description: string;
  detail: string;
}

const PIPELINE_STEPS: Step[] = [
  {
    id: 'upload',
    name: 'Upload complete',
    description: 'File received & binary structure verified',
    detail: 'Validated format, extracted file headers, and initiated AST document parser.',
  },
  {
    id: 'extract',
    name: 'Extracting content',
    description: 'Reading semantic headings, code blocks, and formulas',
    detail: 'Constructing high-fidelity markdown tree and preserving LaTeX equations.',
  },
  {
    id: 'chapters',
    name: 'Detecting chapters',
    description: 'Mapping section hierarchy and reading time estimates',
    detail: 'Discovered table of contents, partitioned 8 chapters, and generated reading roadmaps.',
  },
  {
    id: 'concepts',
    name: 'Analyzing concepts',
    description: 'Identifying key technical terms, prerequisites & difficulty',
    detail: 'Extracted 14 core concepts (e.g. Gradient Descent, Loss Functions, Regularization).',
  },
  {
    id: 'knowledge',
    name: 'Creating searchable knowledge',
    description: 'Indexing semantic embeddings for contextual AI companion',
    detail: 'Generated vector index chunks linked to precise chapter and section locations.',
  },
  {
    id: 'finalize',
    name: 'Finalizing reader',
    description: 'Configuring technical reader with annotations and quizzes',
    detail: 'Assembled interactive exercises and validated all cross-references.',
  },
];

export const ResourceProcessingView: React.FC<ResourceProcessingViewProps> = ({
  resource,
  onComplete,
}) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(3); // Start at "Analyzing concepts"
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Auto-progress simulation
  useEffect(() => {
    if (isFinished || hasError) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsFinished(true);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isFinished, hasError, onComplete]);

  const progressPercentage = Math.round(
    ((currentStepIndex + (isFinished ? 1 : 0.4)) / PIPELINE_STEPS.length) * 100
  );

  const handleOpenReader = () => {
    navigate(`/reader/${resource.id}/${resource.currentChapterId || 'ch-1'}`);
  };

  const handleInstantComplete = () => {
    setCurrentStepIndex(PIPELINE_STEPS.length - 1);
    setIsFinished(true);
    if (onComplete) onComplete();
  };

  const handleSimulateError = () => {
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setCurrentStepIndex(1);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Processing Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-xs font-semibold border border-blue-200 dark:border-blue-900/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated Technical Ingestion</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {isFinished ? 'Your resource is ready!' : 'Understanding your resource...'}
        </h1>

        <p className="text-xs md:text-sm text-[var(--muted-foreground)] leading-relaxed">
          {isFinished
            ? 'AST extraction, chapter partitioning, and contextual knowledge indexing are complete. You can now read with the AI learning companion.'
            : 'BookPilot is analyzing document structure, mapping chapter boundaries, and identifying key technical concepts to build a contextual reading layer.'}
        </p>
      </div>

      {/* Main Processing Card */}
      <Card className="p-6 md:p-8 space-y-6 shadow-sm border-[var(--border)]">
        {/* Resource Meta Banner */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--secondary)]/60 border border-[var(--border)]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-14 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-mono font-bold uppercase border border-neutral-700 shadow-2xs">
              {resource.type}
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-[var(--foreground)] truncate">
                {resource.title}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                by {resource.author} · {resource.totalPages} estimated pages
              </p>
            </div>
          </div>

          <Badge variant={isFinished ? 'success' : hasError ? 'error' : 'warning'} size="sm">
            {isFinished ? 'Ready to Read' : hasError ? 'Error Encountered' : 'Processing'}
          </Badge>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--foreground)] flex items-center gap-1.5">
              {!isFinished && !hasError && <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />}
              {isFinished
                ? 'Processing 100% Complete'
                : hasError
                ? 'Pipeline Interrupted'
                : `Step ${currentStepIndex + 1} of ${PIPELINE_STEPS.length}: ${PIPELINE_STEPS[currentStepIndex].name}`}
            </span>
            <span className="font-mono text-[var(--muted-foreground)] font-semibold">
              {progressPercentage}%
            </span>
          </div>
          <ProgressBar
            value={progressPercentage}
            size="md"
            variant={isFinished ? 'success' : hasError ? 'warning' : 'accent'}
          />
        </div>

        {/* Error State Banner */}
        {hasError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--error)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">
                  AST Chapter Extraction Timed Out
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  We encountered an issue extracting semantic hierarchy from page 42. You can retry the ingestion pipeline or continue with fallback table of contents.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 pl-8">
              <Button size="sm" variant="danger" onClick={handleRetry} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                Retry Ingestion
              </Button>
              <Button size="sm" variant="outline" onClick={handleInstantComplete}>
                Continue with Fallback
              </Button>
            </div>
          </div>
        )}

        {/* Pipeline Step Progression */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Ingestion Pipeline Stages
          </h4>

          <div className="space-y-2.5">
            {PIPELINE_STEPS.map((step, idx) => {
              const isStepDone = isFinished || idx < currentStepIndex;
              const isStepActive = !isFinished && !hasError && idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isStepActive
                      ? 'bg-[var(--card)] border-[var(--accent)] shadow-xs ring-1 ring-[var(--accent)]/20'
                      : isStepDone
                      ? 'bg-[var(--secondary)]/40 border-[var(--border)]'
                      : 'bg-transparent border-dashed border-[var(--border)]/60 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isStepDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      ) : isStepActive ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[var(--muted-foreground)]/40 flex items-center justify-center text-[9px] font-mono text-[var(--muted-foreground)]">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isStepActive
                              ? 'text-[var(--accent)]'
                              : isStepDone
                              ? 'text-[var(--foreground)]'
                              : 'text-[var(--muted-foreground)]'
                          }`}
                        >
                          {step.name}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          {isStepDone ? 'Completed' : isStepActive ? 'Running...' : 'Pending'}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                        {step.description}
                      </p>

                      {isStepActive && (
                        <p className="text-[11px] text-[var(--foreground)] font-mono bg-[var(--secondary)] p-2 rounded-md mt-2 border border-[var(--border)]">
                          ↳ {step.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated time remaining: {isFinished ? '0s' : '~15s'}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isFinished && !hasError && (
              <>
                <button
                  type="button"
                  onClick={handleSimulateError}
                  className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--error)] transition-colors"
                >
                  Simulate Error
                </button>
                <Button size="sm" variant="outline" onClick={handleInstantComplete}>
                  Skip to Finish
                </Button>
              </>
            )}

            {isFinished && (
              <Button
                size="md"
                variant="primary"
                onClick={handleOpenReader}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-md"
              >
                Open Reader
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
