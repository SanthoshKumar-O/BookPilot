import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { useBookPilot } from '../context';

export const QuizDetailPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { quizzes, submitQuizResult } = useBookPilot();
  const quiz = quizzes.find((q) => q.id === quizId) || quizzes[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);
  const [strongConcepts, setStrongConcepts] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) {
    return <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Quiz not found.</div>;
  }

  const currentQ = quiz.questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    if (idx === currentQ.correctOptionIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
      if (currentQ.relatedConceptName && !strongConcepts.includes(currentQ.relatedConceptName)) {
        setStrongConcepts((prev) => [...prev, currentQ.relatedConceptName]);
      }
    } else {
      if (currentQ.relatedConceptName && !weakConcepts.includes(currentQ.relatedConceptName)) {
        setWeakConcepts((prev) => [...prev, currentQ.relatedConceptName]);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      const finalScore = Math.round((correctAnswersCount / quiz.questions.length) * 100);
      submitQuizResult({
        quizId: quiz.id,
        resourceId: quiz.resourceId,
        chapterId: quiz.chapterId,
        chapterTitle: quiz.title,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        correctCount: correctAnswersCount,
        timeSpentSeconds: 180,
        strongConcepts: strongConcepts.length > 0 ? strongConcepts : [currentQ.relatedConceptName || 'Core Concept'],
        weakConcepts: weakConcepts
      });
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const finalScore = Math.round((correctAnswersCount / quiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-8 space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950 text-green-600 flex items-center justify-center mx-auto border border-green-200 dark:border-green-900">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Quiz Complete</h2>
            <p className="text-xs text-[var(--muted-foreground)]">{quiz.title}</p>
          </div>

          <div className="flex justify-center gap-8 py-4 border-y border-[var(--border)]">
            <div>
              <div className="text-2xl font-bold">{finalScore}%</div>
              <div className="text-xs text-[var(--muted-foreground)]">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{correctAnswersCount} / {quiz.questions.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Correct</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setHasAnswered(false);
                setCorrectAnswersCount(0);
                setIsFinished(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--muted)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake
            </button>
            <Link
              to={`/reader/${quiz.resourceId}/${quiz.chapterId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium hover:opacity-90"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Back to Reader
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/quizzes" className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ChevronLeft className="w-4 h-4" />
          <span>All Quizzes</span>
        </Link>
        <span className="text-xs font-mono text-[var(--muted-foreground)]">
          Question {currentIndex + 1} of {quiz.questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-base font-semibold leading-relaxed">{currentQ.question}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctOptionIndex;
            let optStyle = 'border-[var(--border)] hover:bg-[var(--muted)]';
            if (hasAnswered) {
              if (isCorrect) optStyle = 'border-green-500 bg-green-50/50 dark:bg-green-950/30 text-green-700 dark:text-green-300';
              else if (isSelected) optStyle = 'border-red-500 bg-red-50/50 dark:bg-red-950/30 text-red-700 dark:text-red-300';
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${optStyle}`}
              >
                <span>{option}</span>
                {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {hasAnswered && (
          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)] space-y-2 text-xs">
            <div className="font-semibold">
              {selectedOption === currentQ.correctOptionIndex ? '✓ Correct' : '✗ Incorrect'}
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed">{currentQ.explanation}</p>
            <div className="pt-2 text-[11px] text-[var(--accent)] font-medium">
              Related Concept: {currentQ.relatedConceptName}
            </div>
          </div>
        )}

        {hasAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium hover:opacity-90"
            >
              <span>{currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
