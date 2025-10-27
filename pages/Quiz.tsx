import React, { useState, useEffect } from 'react';
import type { Quiz } from '../types';
import { QuizEngine } from '../services/QuizEngine';

interface QuizPageProps {
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ addXp, addAchievement }) => {
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component state for quiz flow
  const [view, setView] = useState<'list' | 'active' | 'finished'>('list');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // QuizEngine instance, created once
  const [engine] = useState(() => new QuizEngine({ addXp, addAchievement }));

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all([
          fetch('./data/quiz-harmonization.json'),
          fetch('./data/quiz-level1.json'),
          fetch('./data/quiz-level2.json'),
          fetch('./data/quiz-level3.json'),
        ]);

        for (const res of responses) {
            if (!res.ok) {
                throw new Error(`Failed to load quiz data: ${res.statusText}`);
            }
        }

        const quizzesData = await Promise.all(responses.map(res => res.json()));
        setAvailableQuizzes(quizzesData);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError("Não foi possível carregar os quizzes. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);
  
  const handleQuizSelect = (quizId: string) => {
    const selectedQuiz = availableQuizzes.find(q => q.id === quizId);
    if (selectedQuiz) {
      engine.startQuiz(selectedQuiz);
      setView('active');
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    engine.submitAnswer(selectedAnswer);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    engine.nextQuestion();
    if (engine.isQuizFinished()) {
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
    return <div className="flex justify-center items-center h-full pt-20"><p className="text-soft-graphite/70 text-lg">Carregando quizzes...</p></div>;
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
                <h1 className="font-serif text-4xl text-vinifero-purple">Desafios de Quiz</h1>
                <p className="mt-1 text-lg text-soft-graphite/80">Escolha um quiz e teste seus conhecimentos.</p>
            </header>
            <div className="space-y-4">
                {availableQuizzes.map(quiz => (
                    <div key={quiz.id} className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50 flex justify-between items-center">
                        <div>
                            <h2 className="font-serif text-2xl text-vinifero-purple">{quiz.title}</h2>
                            <p className="text-soft-graphite/70 mt-1">{quiz.questions.length} perguntas</p>
                        </div>
                        <button 
                            onClick={() => handleQuizSelect(quiz.id)}
                            className="bg-vinifero-purple text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                        >
                            Começar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
  }
  
  const currentQuestion = engine.getCurrentQuestion();
  if (!currentQuestion) {
      // Should not happen if view is 'active', but good for type safety
      return <div className="text-center pt-20"><p>Ocorreu um erro ao carregar a pergunta.</p></div>;
  }
  
  if (view === 'finished') {
    const { score, total, quizId, isPerfect } = engine.getResults();
    const xpGained = score * 10;
    return (
      <div className="animate-fade-in text-center space-y-6 bg-white p-8 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-3xl text-vinifero-purple">Quiz Finalizado!</h2>
        {isPerfect && quizId === 'quiz-h1' && (
           <p className="text-lg font-semibold text-aged-gold">🎉 Conquista Desbloqueada: Mestre da Harmonização!</p>
        )}
        {isPerfect && quizId === 'quiz-l1' && (
           <p className="text-lg font-semibold text-aged-gold">🎉 Conquista Desbloqueada: Mestre dos Fundamentos!</p>
        )}
        {isPerfect && quizId === 'quiz-l2' && (
           <p className="text-lg font-semibold text-aged-gold">🎉 Conquista Desbloqueada: Explorador Global!</p>
        )}
        {isPerfect && quizId === 'quiz-l3' && (
           <p className="text-lg font-semibold text-aged-gold">🎉 Conquista Desbloqueada: Sommelier em Treinamento!</p>
        )}
        <p className="text-xl text-soft-graphite">
          Você acertou <span className="font-bold text-aged-gold">{score}</span> de <span className="font-bold text-vinifero-purple">{total}</span> perguntas.
        </p>
        <p className="text-lg font-semibold text-aged-gold">+{xpGained} XP</p>
        <button onClick={handlePlayAgain} className="bg-vinifero-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
          Escolher outro Quiz
        </button>
      </div>
    );
  }

  const { current, total } = engine.getProgress();
  const { score } = engine.getResults();

  return (
    <div className="animate-fade-in space-y-6">
      <header>
          {/* FIX: Use the new public method `getQuizTitle` instead of accessing the private `quiz` property. */}
          <h1 className="font-serif text-4xl text-vinifero-purple">{engine.getQuizTitle() || 'Quiz'}</h1>
          <p className="mt-1 text-lg text-soft-graphite/80">Teste seus conhecimentos.</p>
      </header>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <div className="flex justify-between items-baseline mb-4">
          <p className="font-semibold text-soft-graphite">Pergunta {current} de {total}</p>
          <p className="font-bold text-aged-gold">Pontuação: {score}</p>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-soft-graphite mb-6">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map(option => {
            const isCorrect = option === currentQuestion.correctAnswer;
            let buttonClass = 'bg-white border-2 border-velvet-gray text-soft-graphite hover:bg-champagne-light';
            if (isAnswered) {
              if (isCorrect) buttonClass = 'bg-green-200 border-green-500 text-green-800';
              else if (selectedAnswer === option) buttonClass = 'bg-red-200 border-red-500 text-red-800';
              else buttonClass = 'bg-white border-2 border-velvet-gray text-soft-graphite opacity-60';
            } else if (selectedAnswer === option) {
              buttonClass = 'bg-aged-gold/30 border-2 border-aged-gold text-soft-graphite';
            }
            return (
              <button key={option} onClick={() => handleAnswerSelect(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg font-medium transition-all duration-200 ${buttonClass}`}>
                {option}
              </button>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          {isAnswered ? (
            <button onClick={handleNextQuestion} className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
              {current < total ? 'Próxima Pergunta' : 'Ver Resultado'}
            </button>
          ) : (
            <button onClick={checkAnswer} disabled={selectedAnswer === null} className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-velvet-gray disabled:cursor-not-allowed">
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;