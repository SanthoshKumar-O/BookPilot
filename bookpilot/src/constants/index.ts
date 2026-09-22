export const APP_CONFIG = {
  name: 'BookPilot',
  tagline: 'Contextual AI Learning Environment for Technical Books',
  version: '1.0.0',
} as const;

export const ROUTES = {
  DASHBOARD: '/dashboard',
  LIBRARY: '/library',
  LIBRARY_RESOURCE: (resourceId: string) => `/library/${resourceId}`,
  READER: (resourceId: string, chapterId: string) => `/reader/${resourceId}/${chapterId}`,
  QUIZZES: '/quizzes',
  QUIZ_DETAIL: (quizId: string) => `/quizzes/${quizId}`,
  CODING: '/coding',
  CODING_DETAIL: (problemId: string) => `/coding/${problemId}`,
  STUDY_PLANS: '/study-plans',
  PROGRESS: '/progress',
  SETTINGS: '/settings',
} as const;

export const HIGHLIGHT_CATEGORIES = [
  { id: 'important', label: 'Important', color: 'var(--reader-highlight-important)', shortcut: '1' },
  { id: 'definition', label: 'Definition', color: 'var(--reader-highlight-definition)', shortcut: '2' },
  { id: 'formula', label: 'Formula', color: 'var(--reader-highlight-formula)', shortcut: '3' },
  { id: 'code', label: 'Code Pattern', color: 'var(--reader-highlight-code)', shortcut: '4' },
  { id: 'review', label: 'Review Later', color: 'var(--reader-highlight-review)', shortcut: '5' },
] as const;

export const PROCESSING_STEPS_PIPELINE = [
  { id: '1', name: 'Upload complete', description: 'File received and verified' },
  { id: '2', name: 'Extracting content', description: 'Reading document structure & AST' },
  { id: '3', name: 'Detecting chapters', description: 'Mapping chapter boundaries & sections' },
  { id: '4', name: 'Analyzing concepts', description: 'Extracting technical concepts & prerequisites' },
  { id: '5', name: 'Creating searchable knowledge', description: 'Indexing semantic embeddings & code blocks' },
  { id: '6', name: 'Finalizing reader', description: 'Preparing contextual reading environment' },
] as const;

export const DEFAULT_READER_SETTINGS = {
  fontSize: 18,
  lineWidth: 'comfortable' as const,
  theme: 'light' as const,
  readingMode: 'continuous' as const,
  focusMode: false,
} as const;
