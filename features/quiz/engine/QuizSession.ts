import type { QuizBank, QuizQuestionRef } from './types';

interface QuizSessionOptions {
  shuffle?: boolean;
}

/**
 * Manages the state and logic for a single quiz session.
 * This class is agnostic of UI, text content, and rewards.
 */
export class QuizSession {
  private bank: QuizBank | null = null;
  private questions: QuizQuestionRef[] = [];
  private currentQuestionIndex: number = 0;
  private score: number = 0;
  private isFinished: boolean = false;

  /**
   * Starts a new quiz session with the given data.
   * @param bank The quiz bank data object.
   * @param options Configuration options for the session.
   */
  public startQuiz(bank: QuizBank, options: QuizSessionOptions = {}): void {
    this.bank = bank;
    this.questions = options.shuffle
      ? [...bank.questions].sort(() => Math.random() - 0.5)
      : [...bank.questions];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.isFinished = false;
  }

  /**
   * @returns The current active question reference or null if the quiz is not running.
   */
  public getCurrentQuestion(): QuizQuestionRef | null {
    if (!this.bank || this.isFinished) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Returns the i18n key for the title of the current quiz bank.
   */
  public getBankTitleKey(): string | null {
    return this.bank?.titleKey ?? null;
  }

  /**
   * Submits an answer for the current question and updates the score.
   * @param answer The user's selected answer key (e.g., 'a').
   * @returns True if the answer was correct, false otherwise.
   */
  public submitAnswer(answer: string): boolean {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      return false;
    }

    const isCorrect = answer === currentQuestion.correct;
    if (isCorrect) {
      this.score++;
    }
    return isCorrect;
  }

  /**
   * Advances to the next question in the quiz.
   */
  public nextQuestion(): void {
    if (!this.bank || this.isFinished) {
      return;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.isFinished = true;
    }
  }

  /**
   * @returns True if all questions have been answered.
   */
  public isQuizFinished(): boolean {
    return this.isFinished;
  }

  /**
   * @returns The final results of the quiz session.
   */
  public getResults(): { score: number; total: number; bankId: string | null } {
    return {
      score: this.score,
      total: this.questions.length,
      bankId: this.bank?.id || null,
    };
  }

  /**
   * @returns The progress within the current quiz (e.g., { current: 3, total: 5 }).
   */
  public getProgress(): { current: number; total: number } {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length,
    };
  }
}
