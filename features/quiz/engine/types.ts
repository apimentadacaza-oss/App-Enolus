/**
 * Represents a reference to a quiz question, containing only logical data,
 * not the display text.
 */
export interface QuizQuestionRef {
  id: string; // Unique ID for the question, used to build i18n keys
  correct: string; // The key of the correct choice, e.g., 'a'
  choices: string[]; // An array of choice keys, e.g., ['a', 'b', 'c', 'd']
}

/**
 * Represents a bank of questions for a specific quiz.
 * Contains the quiz's ID, a key for its translatable title, and question references.
 */
export interface QuizBank {
  id: string; // e.g., 'intro'
  titleKey: string; // i18n key for the quiz title, e.g., 'quiz.banks.intro.title'
  questions: QuizQuestionRef[];
}

/**
 * Represents a user's evaluated answer for a question, tracking what they
 * answered and whether it was correct.
 */
export interface EvaluatedQuestion {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}
