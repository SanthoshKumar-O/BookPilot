export type ResourceType = 'pdf' | 'epub' | 'url';

export type ResourceStatus = 'processing' | 'in_progress' | 'completed' | 'error';

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  description: string;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  content: string; // rich markdown / semantic content
  wordCount: number;
  estimatedMinutes: number;
}

export interface Chapter {
  id: string;
  resourceId: string;
  number: number;
  title: string;
  overview: string;
  sections: Section[];
  estimatedMinutes: number;
  progress: number; // 0 - 100
  isCompleted: boolean;
  quizId?: string;
  codingProblemIds?: string[];
}

export type ConceptImportance = 'core' | 'supporting' | 'advanced';
export type ConceptDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Concept {
  id: string;
  resourceId: string;
  chapterId: string;
  name: string;
  category: string;
  difficulty: ConceptDifficulty;
  importance: ConceptImportance;
  prerequisites: string[];
  chapterReference: string;
  explanation: string;
  codeExample?: string;
}

export type HighlightCategory = 'important' | 'definition' | 'formula' | 'code' | 'review';

export interface Highlight {
  id: string;
  resourceId: string;
  chapterId: string;
  sectionId: string;
  text: string;
  category: HighlightCategory;
  color?: string;
  createdAt: string;
  location?: string;
}

export interface Note {
  id: string;
  resourceId: string;
  chapterId: string;
  sectionId: string;
  selectedText: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
}

export interface Bookmark {
  id: string;
  resourceId: string;
  chapterId: string;
  sectionId: string;
  title: string;
  note?: string;
  createdAt: string;
  location?: string;
}

export interface Resource {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  type: ResourceType;
  status: ResourceStatus;
  totalPages: number;
  totalChapters: number;
  completedChapters: number;
  progress: number; // 0 - 100
  currentChapterId: string;
  currentSectionId: string;
  lastOpenedAt: string;
  description: string;
  processingSteps?: ProcessingStep[];
  tags: string[];
  estimatedRemainingMinutes: number;
  totalReadingMinutes: number;
  quizAverageScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  relatedConceptId: string;
  relatedConceptName: string;
}

export interface Quiz {
  id: string;
  resourceId: string;
  chapterId: string;
  title: string;
  questionsCount: number;
  estimatedMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  resourceId: string;
  chapterId: string;
  chapterTitle: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  strongConcepts: string[];
  weakConcepts: string[];
  completedAt: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  resourceId: string;
  chapterId: string;
  conceptId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: string;
  solutionCode?: string;
  testCases: TestCase[];
  status: 'unsolved' | 'solved' | 'attempted';
  relatedChapterTitle?: string;
  relatedConceptName?: string;
}

export interface CodeSubmissionResult {
  problemId: string;
  status: 'success' | 'failure' | 'error';
  runtimeMs: number;
  memoryMb: number;
  passedCount: number;
  totalCount: number;
  failedTestCase?: {
    input: string;
    expected: string;
    received: string;
  };
  errorOutput?: string;
}

export interface StudyPlanDay {
  day: number;
  date: string;
  chapterId: string;
  chapterTitle: string;
  taskType: 'read' | 'quiz' | 'code' | 'review';
  isDone: boolean;
  estimatedMinutes: number;
}

export interface StudyPlan {
  id: string;
  resourceId: string;
  resourceTitle: string;
  targetCompletionDate: string;
  dailyReadingMinutes: number;
  currentStreakDays: number;
  totalDays: number;
  completedDays: number;
  schedule: StudyPlanDay[];
}

export interface LearningActivity {
  id: string;
  type: 'reading' | 'quiz' | 'coding' | 'bookmark' | 'highlight';
  title: string;
  description: string;
  timestamp: string;
  resourceId?: string;
  resourceTitle?: string;
  link?: string;
}

export interface SourceReference {
  chapterTitle: string;
  sectionTitle: string;
  chapterId: string;
  sectionId: string;
  location?: string;
  excerpt?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextSnapshot?: {
    chapterTitle: string;
    sectionTitle: string;
    selectedText?: string;
  };
  sourceReferences?: SourceReference[];
}

export interface AISession {
  id: string;
  resourceId: string;
  chapterId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ReaderSettings {
  fontSize: number; // e.g. 18
  lineWidth: 'compact' | 'comfortable' | 'wide';
  theme: 'light' | 'dark' | 'sepia';
  readingMode: 'continuous' | 'paginated';
  focusMode: boolean;
}

export interface ProgressAnalytics {
  totalReadingMinutes: number;
  totalChaptersCompleted: number;
  totalBooksCompleted: number;
  quizAverage: number;
  codingAccuracy: number;
  currentStreakDays: number;
  strongConcepts: { name: string; score: number; count: number }[];
  weakConcepts: { name: string; score: number; count: number; chapterId: string; resourceId: string }[];
  chaptersNeedingReview: { chapterTitle: string; resourceTitle: string; chapterId: string; resourceId: string; reason: string }[];
}
