import type { Quiz, QuizQuestion } from '../types';

interface QuizEngineProps {
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
}

/**
 * Manages the state and logic for a single quiz session.
 */
export class QuizEngine {
  private quiz: Quiz | null = null;
  private currentQuestionIndex: number = 0;
  private score: number = 0;
  private isFinished: boolean = false;
  private props: QuizEngineProps;

  constructor(props: QuizEngineProps) {
    this.props = props;
  }

  /**
   * Starts a new quiz with the given data.
   * @param quiz The quiz data object.
   */
  public startQuiz(quiz: Quiz): void {
    this.quiz = {
      ...quiz,
      // Shuffle questions for replayability
      questions: [...quiz.questions].sort(() => Math.random() - 0.5),
    };
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.isFinished = false;
  }

  /**
   * @returns The current active question or null if the quiz is not running.
   */
  public getCurrentQuestion(): QuizQuestion | null {
    if (!this.quiz || this.isFinished) {
      return null;
    }
    return this.quiz.questions[this.currentQuestionIndex];
  }

  /**
   * Returns the title of the current quiz.
   */
  public getQuizTitle(): string | null {
    return this.quiz?.title ?? null;
  }

  /**
   * Submits an answer for the current question and updates the score.
   * @param answer The user's selected answer.
   * @returns True if the answer was correct, false otherwise.
   */
  public submitAnswer(answer: string): boolean {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      return false;
    }

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      this.score++;
      // Award 10 XP per correct answer, as in the original component
      this.props.addXp(10);
    }
    return isCorrect;
  }

  /**
   * Advances to the next question in the quiz.
   */
  public nextQuestion(): void {
    if (!this.quiz || this.isFinished) {
      return;
    }

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.isFinished = true;
      this.handleQuizCompletion();
    }
  }

  /**
   * Handles logic for when the quiz is completed, like awarding achievements.
   */
  private handleQuizCompletion(): void {
    if (!this.quiz) return;

    const isPerfectScore = this.score === this.quiz.questions.length;
    if (isPerfectScore) {
      if (this.quiz.id === 'quiz-h1') {
        this.props.addAchievement("Mestre da Harmonização");
      } else if (this.quiz.id === 'quiz-l1') {
        this.props.addAchievement("Mestre dos Fundamentos");
      } else if (this.quiz.id === 'quiz-l2') {
        this.props.addAchievement("Explorador Global");
      } else if (this.quiz.id === 'quiz-l3') {
        this.props.addAchievement("Sommelier em Treinamento");
      }
    }
  }

  /**
   * @returns True if all questions have been answered.
   */
  public isQuizFinished(): boolean {
    return this.isFinished;
  }

  /**
   * @returns The final results of the quiz.
   */
  public getResults(): { score: number; total: number; quizId: string | null; isPerfect: boolean } {
    const total = this.quiz?.questions.length ?? 0;
    return {
      score: this.score,
      total,
      quizId: this.quiz?.id || null,
      isPerfect: this.score === total && total > 0,
    };
  }

  /**
   * @returns The progress within the current quiz (e.g., "Question 3 of 5").
   */
  public getProgress(): { current: number; total: number } {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.quiz?.questions.length ?? 0,
    };
  }
}