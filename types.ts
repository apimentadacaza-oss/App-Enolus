
export type Tab = 'explore' | 'tracks' | 'quiz' | 'encyclopedia' | 'profile';

export interface UserProgress {
  xp: number;
  achievements: string[];
  completedLessons: string[];
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
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Level {
  id: string;
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
