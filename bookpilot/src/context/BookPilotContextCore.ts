import { createContext } from 'react';
import type {
  Resource,
  Chapter,
  Section,
  Concept,
  Highlight,
  Note,
  Bookmark,
  Quiz,
  QuizResult,
  CodingProblem,
  CodeSubmissionResult,
  StudyPlan,
  LearningActivity,
  ProgressAnalytics,
  AISession,
  AIMessage,
  ReaderSettings
} from '../types';

export interface SelectionContextState {
  text: string;
  resourceId: string;
  chapterId: string;
  sectionId: string;
  rect?: { top: number; left: number; width: number; height: number };
}

export interface BookPilotContextType {
  // Resources
  resources: Resource[];
  activeResourceId: string;
  activeResource: Resource | undefined;
  setActiveResourceId: (id: string) => void;
  addResource: (newRes: Partial<Resource>) => Resource;
  
  // Chapters & Sections
  chapters: Record<string, Chapter[]>;
  activeChapterId: string;
  activeChapter: Chapter | undefined;
  setActiveChapterId: (id: string) => void;
  activeSectionId: string;
  activeSection: Section | undefined;
  setActiveSectionId: (id: string) => void;
  completeChapter: (resourceId: string, chapterId: string) => void;

  // Concepts
  concepts: Concept[];
  
  // Reader & Annotations
  highlights: Highlight[];
  addHighlight: (hl: Omit<Highlight, 'id' | 'createdAt'>) => Highlight;
  removeHighlight: (id: string) => void;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  deleteNote: (id: string) => void;
  bookmarks: Bookmark[];
  addBookmark: (bm: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  removeBookmark: (resourceId: string, chapterId: string, sectionId?: string) => void;
  isBookmarked: (resourceId: string, chapterId: string, sectionId?: string) => boolean;

  // Quizzes
  quizzes: Quiz[];
  quizResults: QuizResult[];
  submitQuizResult: (result: Omit<QuizResult, 'id' | 'completedAt'>) => QuizResult;

  // Coding
  codingProblems: CodingProblem[];
  submitCodeProblem: (problemId: string, code: string) => Promise<CodeSubmissionResult>;

  // Study Plans
  studyPlan: StudyPlan;
  toggleStudyPlanTask: (day: number) => void;

  // Activities & Analytics
  activities: LearningActivity[];
  analytics: ProgressAnalytics;
  addActivity: (act: Omit<LearningActivity, 'id' | 'timestamp'>) => void;

  // AI Learning Companion
  aiSessions: Record<string, AISession[]>;
  activeAiSessionId: string | null;
  setActiveAiSessionId: (id: string | null) => void;
  sendAiMessage: (prompt: string, context?: { chapterTitle: string; sectionTitle: string; selectedText?: string }) => Promise<AIMessage>;

  // Selection & Reader Settings
  selectionContext: SelectionContextState | null;
  setSelectionContext: (ctx: SelectionContextState | null) => void;
  readerSettings: ReaderSettings;
  updateReaderSettings: (settings: Partial<ReaderSettings>) => void;

  // Global UI States
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
}

export const BookPilotContext = createContext<BookPilotContextType | undefined>(undefined);
