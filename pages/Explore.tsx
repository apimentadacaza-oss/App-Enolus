
import React from 'react';

const ExplorePage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="font-serif text-4xl md:text-5xl text-vinifero-purple">Bem-vindo ao Enolus</h1>
        <p className="mt-2 text-lg text-soft-graphite/80">Sua jornada pelo mundo dos vinhos começa aqui.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-2xl text-aged-gold">Missão do Dia</h2>
        <p className="mt-2 text-soft-graphite">Aprenda sobre a uva <span className="font-semibold text-vinifero-purple">Cabernet Sauvignon</span> e ganhe 20 XP!</p>
        <button className="mt-4 bg-vinifero-purple text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
          Começar Missão
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-vinifero-purple">Recomendações para você</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border border-velvet-gray/30">
            <h4 className="font-semibold">Trilha: Primeiros Passos</h4>
            <p className="text-sm text-soft-graphite/70 mt-1">Ideal para iniciantes. Descubra os fundamentos do vinho.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-velvet-gray/30">
            <h4 className="font-semibold">Quiz: Harmonização</h4>
            <p className="text-sm text-soft-graphite/70 mt-1">Teste seus conhecimentos sobre combinações de vinhos e pratos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
