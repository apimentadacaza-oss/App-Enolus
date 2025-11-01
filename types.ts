


// FIX: Removed circular import and redefined Tab type to resolve self-referencing error.
export type Tab = 'explore' | 'tracks' | 'quiz' | 'encyclopedia' | 'profile' | 'settings' | 'lab';

export interface UserProgress {
  xp: number;
  achievements: string[];
  completedLessons: string[];
  completedActivities: string[]; // e.g., ["lesson-1-1-1/read", "lesson-1-1-1/listen"]
  currentLessonId: string | null;
  favoriteArticles: string[]; // e.g., ["cabernet-sauvignon", "bordeaux"]
}

export interface Lesson {
  id: string;
  type: 'text' | 'video' | 'audio' | 'quiz';
  title: string;
  content: string;
  xp: number;
  duration?: string;
  videoUrl?: string;
  audioUrl?: string;
  activities?: {
    read?: {
      xp: number;
      content?: string; // Content is now optional
    };
    listen?: {
      xp: number;
      file?: string;
    };
    watch?: {
      xp: number;
      content?: string; // Content is now optional for consistency
    };
    quiz?: {
      xp: number;
      file?: string;
    };
  };
  icon?: string;
}

export interface TrailNode {
  id: string;
  x: number;
  y: number;
}

export interface UnlockRule {
  target: string;
  requires: string;
  minXp?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  trail?: {
    nodes: TrailNode[];
    unlockRules: UnlockRule[];
  };
}

export interface Level {
  id:string;
  title: string;
  description: string;
  modules: Module[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface EncyclopediaEntry {
  category: 'Grapes' | 'Regions' | 'Styles' | 'Vocabulary';
  term: string;
  description: string;
  details?: { [key: string]: string };
}

// --- Types for Profile Page / Confraria ---

export interface Patent {
  level: number;
  name: string;
  minXp: number;
  icon: string;
  ceremonialPhrase: string;
}

export interface RiteStep {
  title: string;
  description: string;
}

export interface Rite {
  icon: string;
  title: string;
  description: string;
  ritualPhrase: string;
  introduction: string;
  xp: number;
  steps: RiteStep[];
}

export interface CircleTheme {
  bg: string;
  text: string;
  accent: string;
  border: string;
  sectionBg: string;
  gradient: string;
}

export interface Circle {
  name: string;
  minPatentLevel: number;
  maxPatentLevel: number;
  icon: string;
  description: string;
  ritual: string;
  purpose: string;
  theme: CircleTheme;
  rites: Rite[];
}