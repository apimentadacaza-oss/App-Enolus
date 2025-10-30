import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QuizSession } from '../features/quiz/engine/QuizSession';
import { loadAllQuizBanks } from '../features/quiz/engine/loader';
import type { QuizBank, QuizQuestionRef } from '../features/quiz/engine/types';

interface QuizPageProps {
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ addXp, addAchievement }) => {
  const { t } = useTranslation('quiz');
  const { t: tQuestions, i18n } = useTranslation('quiz_questions');
  
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component state for quiz flow
  const [view, setView] = useState<'list' | 'active' | 'finished'>('list');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // QuizSession instance, created once
  const [session] = useState(() => new QuizSession());

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const banks = await loadAllQuizBanks();
        setAvailableQuizzes(banks);
      } catch (err) {
        console.error("Failed to fetch quiz banks:", err);
        setError(t('load_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [t]);
  
  const handleQuizSelect = (quizBank: QuizBank) => {
    session.startQuiz(quizBank, { shuffle: true });
    setView('active');
    setSelectedAnswer(null);
    setIsAnswered(false);
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    const correct = session.submitAnswer(selectedAnswer);
    if (correct) {
      addXp(10); // Award XP for correct answer
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    session.nextQuestion();
    if (session.isQuizFinished()) {
      const { score, total, bankId } = session.getResults();
      if (score === total && bankId === 'intro') {
        addAchievement("Mestre dos Fundamentos");
      }
      // Add other achievement checks here for future quizzes
      setView('finished');
    } else {
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handlePlayAgain = () => {
     setView('list');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full pt-20"><p className="text-soft-graphite/70 text-lg">{t('loading')}</p></div>;
  }
  
  if (error) {
     return (
      <div className="text-center pt-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
        <div className="animate-fade-in space-y-6">
            <header>
                <h1 className="font-serif text-4xl text-vinifero-purple">{t('title')}</h1>
                <p className="mt-1 text-lg text-soft-graphite/80">{t('subtitle')}</p>
            </header>
            <div className="space-y-4">
                {availableQuizzes.map(quiz => (
                    <div key={quiz.id} className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50 flex justify-between items-center">
                        <div>
                            <h2 className="font-serif text-2xl text-vinifero-purple">{t(quiz.titleKey as any)}</h2>
                            <p className="text-soft-graphite/70 mt-1">{t(`banks.${quiz.id}.count`, { count: quiz.questions.length })}</p>
                        </div>
                        <button 
                            onClick={() => handleQuizSelect(quiz)}
                            className="bg-vinifero-purple text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                        >
                            {t('actions.start')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
  }
  
  const currentQuestion = session.getCurrentQuestion();
  if (!currentQuestion) {
      return <div className="text-center pt-20"><p>{t('question_load_error')}</p></div>;
  }
  
  if (view === 'finished') {
    const { score, total, bankId } = session.getResults();
    const isPerfect = score === total;
    return (
      <div className="animate-fade-in text-center space-y-6 bg-white p-8 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-3xl text-vinifero-purple">{t('quiz_finished')}</h2>
        {isPerfect && bankId === 'intro' && (
           <p className="text-lg font-semibold text-aged-gold">{t('achievement_unlocked', { achievement: 'Mestre dos Fundamentos' })}</p>
        )}
        <p className="text-xl text-soft-graphite">
          {t('results_summary', { score, total })}
        </p>
        <button onClick={handlePlayAgain} className="bg-vinifero-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
          {t('choose_another_quiz')}
        </button>
      </div>
    );
  }

  const { current, total } = session.getProgress();
  const { score, bankId } = session.getResults();
  
  const getQuestionText = (bankId: string, question: QuizQuestionRef, part: 'stem' | 'expl' | `choices.${string}`): string => {
    const key = `q_bank.${bankId}.${question.id}.${part}` as const;
    // Fallback in case a key is missing
    return tQuestions(key as any, `Missing translation for ${key}`);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header>
          <h1 className="font-serif text-4xl text-vinifero-purple">{t(session.getBankTitleKey() as any)}</h1>
          <p className="mt-1 text-lg text-soft-graphite/80">{t('test_your_knowledge')}</p>
      </header>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <div className="flex justify-between items-baseline mb-4">
          <p className="font-semibold text-soft-graphite">{t('question_progress', { current, total })}</p>
          <p className="font-bold text-aged-gold">{t('score', { score })}</p>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-soft-graphite mb-6">{getQuestionText(bankId!, currentQuestion, 'stem')}</h2>
        
        <div className="space-y-3">
          {currentQuestion.choices.map(choiceKey => {
            const isCorrect = choiceKey === currentQuestion.correct;
            let buttonClass = 'bg-white border-2 border-velvet-gray text-soft-graphite hover:bg-champagne-light';
            if (isAnswered) {
              if (isCorrect) buttonClass = 'bg-green-200 border-green-500 text-green-800';
              else if (selectedAnswer === choiceKey) buttonClass = 'bg-red-200 border-red-500 text-red-800';
              else buttonClass = 'bg-white border-2 border-velvet-gray text-soft-graphite opacity-60';
            } else if (selectedAnswer === choiceKey) {
              buttonClass = 'bg-aged-gold/30 border-2 border-aged-gold text-soft-graphite';
            }
            return (
              <button key={choiceKey} onClick={() => handleAnswerSelect(choiceKey)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg font-medium transition-all duration-200 ${buttonClass}`}>
                {getQuestionText(bankId!, currentQuestion, `choices.${choiceKey}`)}
              </button>
            );
          })}
        </div>
        
        {isAnswered && (
          <div className="mt-6 p-4 bg-champagne-light rounded-lg border border-velvet-gray/50">
            <p className="font-semibold text-vinifero-purple">{selectedAnswer === currentQuestion.correct ? 'Correto!' : 'Incorreto.'}</p>
            <p className="text-soft-graphite/80 text-sm mt-1">{getQuestionText(bankId!, currentQuestion, 'expl')}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          {isAnswered ? (
            <button onClick={handleNextQuestion} className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
              {current < total ? t('next_question') : t('view_result')}
            </button>
          ) : (
            <button onClick={checkAnswer} disabled={selectedAnswer === null} className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-velvet-gray disabled:cursor-not-allowed">
              {t('confirm')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;