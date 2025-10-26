import React from 'react';
import { WineGlassIcon } from './icons/NavIcons';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-champagne-light min-h-screen flex flex-col justify-center items-center text-center p-6 animate-fade-in">
      <div className="max-w-md">
        <WineGlassIcon className="w-20 h-20 mx-auto text-aged-gold mb-6" />

        <h1 className="font-serif text-4xl md:text-5xl text-vinifero-purple mb-4">
          Bem-vindo ao Enolus
        </h1>

        <p className="text-soft-graphite/80 text-lg mb-4">
          Sua jornada pessoal pelo fascinante mundo dos vinhos começa agora.
        </p>
        
        <p className="text-soft-graphite/70 mb-8">
          Aqui, você encontrará trilhas de aprendizado gamificadas, quizzes desafiadores e uma enciclopédia completa para consultar a qualquer momento.
        </p>

        <p className="font-semibold text-soft-graphite mb-10">
          Desejamos bons estudos!
        </p>

        <button 
          onClick={onStart} 
          className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Iniciar Jornada
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
