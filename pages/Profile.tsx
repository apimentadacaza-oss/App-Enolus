import React, { useState } from 'react';
import { useUserProgress } from '../hooks/useUserProgress';

// --- Data Structures ---

interface RiteStep {
  title: string;
  description: string;
}

interface Rite {
  icon: string;
  title: string;
  description: string;
  ritualPhrase: string;
  introduction: string;
  xp: number;
  steps: RiteStep[];
}

interface CircleTheme {
  bg: string;
  text: string;
  accent: string;
  border: string;
  sectionBg: string;
  gradient: string;
}

interface Circle {
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

const patentsData = [
  { level: 1, name: 'Aprendiz da Videira', minXp: 0, icon: '🍇', ceremonialPhrase: 'Primeiros passos na arte do vinho.' },
  { level: 2, name: 'Discípulo do Cálice', minXp: 200, icon: '🍷', ceremonialPhrase: 'O aroma revela o que a alma entende.' },
  { level: 3, name: 'Guardião do Aroma', minXp: 400, icon: '🌹', ceremonialPhrase: 'Zela pelos segredos da taça.' },
  { level: 4, name: 'Iniciado do Terroir', minXp: 600, icon: '🌍', ceremonialPhrase: 'O solo ensina, o tempo aperfeiçoa.' },
  { level: 5, name: 'Custódio da Safra', minXp: 900, icon: '🕰️', ceremonialPhrase: 'A paciência é o melhor vinho.' },
  { level: 6, name: 'Sábio da Fermentação', minXp: 1200, icon: '🔬', ceremonialPhrase: 'Transforma o fruto em essência.' },
  { level: 7, name: 'Cavaleiro da Taça', minXp: 1600, icon: '⚔️', ceremonialPhrase: 'Defende o saber e honra a mesa.' },
  { level: 8, name: 'Curador do Cálice', minXp: 2000, icon: '🕯️', ceremonialPhrase: 'A luz da taça guia os confrades.' },
  { level: 9, name: 'Guardião das Castas', minXp: 2500, icon: '🏵️', ceremonialPhrase: 'Conhece o vinho como um irmão.' },
  { level: 10, name: 'Mestre da Harmonização', minXp: 3000, icon: '🍽️', ceremonialPhrase: 'Une sabores, tempos e pessoas.' },
  { level: 11, name: 'Enólogo da Palavra', minXp: 3600, icon: '📖', ceremonialPhrase: 'Ensina com a taça, fala com o tempo.' },
  { level: 12, name: 'Sommelier do Tempo', minXp: 4200, icon: '⏳', ceremonialPhrase: 'Cada gole é um instante eterno.' },
  { level: 13, name: 'Embaixador do Vinho', minXp: 5000, icon: '🌐', ceremonialPhrase: 'Leva o nome da Confraria ao mundo.' },
  { level: 14, name: 'Grão-Sommelier da Ordem', minXp: 6000, icon: '👑', ceremonialPhrase: 'Mestre eterno do vinho e da sabedoria.' },
];

const circlesData: Circle[] = [
  { 
    name: 'Círculo da Videira', minPatentLevel: 1, maxPatentLevel: 3, icon: '🍇',
    description: 'Iniciantes da arte do vinho, descobrindo uvas e aromas.',
    ritual: 'Toda taça começa na raiz.',
    purpose: 'Aqui se reúnem os aprendizes da arte do vinho. Exploramos as uvas, os estilos e os primeiros aromas que abrem o paladar e o espírito.',
    theme: { bg: 'bg-violet-50', text: 'text-violet-900', accent: 'text-violet-600', border: 'border-violet-200', sectionBg: 'bg-violet-100/50', gradient: 'from-champagne-light to-violet-50' },
    rites: [
      { 
        icon: '🍇', title: 'Rito da Uva', description: 'Descubra as principais castas tintas e brancas.',
        ritualPhrase: 'A essência do vinho nasce na fruta que o tempo escolhe.',
        introduction: 'Neste rito, você conhecerá as principais castas tintas e brancas, compreendendo como cada uva guarda uma personalidade única. Observe, compare, deguste e registre suas percepções — o vinho é a voz da terra.',
        xp: 50,
        steps: [
          { title: 'As Uvas Tintas', description: 'Aprenda as principais variedades e suas características: Cabernet Sauvignon, Merlot e Pinot Noir.' },
          { title: 'As Uvas Brancas', description: 'Descubra aromas e notas de Chardonnay, Sauvignon Blanc e Riesling.' },
          { title: 'Registro Sensorial', description: 'Escolha um vinho de uma das uvas estudadas e anote suas impressões.' },
        ]
      },
      { 
        icon: '🍷', title: 'Rito do Cálice', description: 'Aprenda a segurar, girar e sentir o vinho.',
        ritualPhrase: 'O cálice é o altar onde o vinho se revela.',
        introduction: 'A forma como interagimos com a taça transforma a degustação. Este rito ensina os gestos fundamentais para liberar os aromas e preparar o paladar para a experiência completa.',
        xp: 50,
        steps: [
            { title: 'A Pega Correta', description: 'Entenda por que seguramos a taça pela haste e pratique a postura correta.' },
            { title: 'O Giro Ritualístico', description: 'Aprenda a girar o vinho na taça para oxigená-lo e liberar seus aromas complexos.' },
            { title: 'Análise Visual', description: 'Incline a taça contra um fundo branco e observe a cor, a limpidez e as lágrimas do vinho.' },
        ]
      },
      { 
        icon: '🌹', title: 'Rito do Aroma', description: 'Identifique notas florais e frutadas em uma degustação guiada.',
        ritualPhrase: 'Cada aroma é uma memória esperando para ser despertada.',
        introduction: 'O nariz é o nosso portal para a complexidade do vinho. Neste rito, treinaremos o olfato para identificar as famílias de aromas primários, aqueles que vêm diretamente da uva.',
        xp: 50,
        steps: [
            { title: 'Aromas Primários', description: 'Conheça a roda de aromas e as principais categorias: frutas, flores e ervas.' },
            { title: 'Degustação Cega', description: 'Com um vinho em mãos, feche os olhos e tente identificar pelo menos três aromas distintos.' },
            { title: 'Anotação Olfativa', description: 'Use a seção de registro para descrever os aromas que você encontrou.' },
        ]
      },
    ]
  },
  { 
    name: 'Círculo do Cálice', minPatentLevel: 4, maxPatentLevel: 6, icon: '🍷',
    description: 'Adeptos do paladar e da fermentação.',
    ritual: 'A taça é a mestra da paciência.',
    purpose: 'Neste círculo, a técnica e a degustação se aprofundam. Dominamos a arte da fermentação, o uso do carvalho e a linguagem sensorial que descreve cada gole.',
    theme: { bg: 'bg-red-50', text: 'text-red-900', accent: 'text-red-700', border: 'border-red-200', sectionBg: 'bg-red-100/50', gradient: 'from-champagne-light to-red-50' },
    rites: [
      { icon: '🔬', title: 'Rito da Fermentação', description: 'Entenda como o açúcar se transforma em álcool e sabor.', ritualPhrase: 'A magia acontece no silêncio da adega.', introduction: 'A fermentação é o coração da vinificação. Vamos explorar como as leveduras trabalham para criar a bebida que amamos.', xp: 75, steps: [{title: 'Leveduras', description: 'Entenda o papel das leveduras.'}, {title: 'Temperatura', description: 'Veja como a temperatura afeta o resultado.'}] },
      { icon: '🕰️', title: 'Rito do Carvalho', description: 'Compare um vinho maturado em carvalho com um sem.', ritualPhrase: 'A madeira ensina ao vinho a sabedoria do tempo.', introduction: 'O carvalho é mais que um recipiente; é um ingrediente. Descubra os aromas e texturas que ele confere ao vinho.', xp: 75, steps: [{title: 'Tipos de Carvalho', description: 'Francês vs. Americano.'}, {title: 'Níveis de Tosta', description: 'Como a queima da madeira impacta o sabor.'}] },
    ]
  },
  { name: 'Círculo do Terroir', minPatentLevel: 7, maxPatentLevel: 9, icon: '🌍', description: 'Confrades que exploram as regiões e a origem do vinho.', ritual: 'O solo guarda a memória do tempo.', purpose: 'Viajamos pelo mundo sem sair da taça. Estudamos o Velho e o Novo Mundo, as denominações de origem e como o terroir imprime uma identidade única em cada garrafa.', theme: { bg: 'bg-orange-50', text: 'text-orange-900', accent: 'text-orange-700', border: 'border-orange-200', sectionBg: 'bg-orange-100/50', gradient: 'from-champagne-light to-orange-50' }, rites: [] },
  { name: 'Círculo da Mesa', minPatentLevel: 10, maxPatentLevel: 12, icon: '🍽️', description: 'Mestres da harmonização e cultura da mesa.', ritual: 'Onde o vinho e o pão se tornam celebração.', purpose: 'Aqui, o vinho encontra seu propósito final: a mesa. Dominamos a arte da harmonização, criando diálogos entre pratos e taças que elevam a experiência gastronômica.', theme: { bg: 'bg-yellow-50', text: 'text-yellow-900', accent: 'text-yellow-700', border: 'border-yellow-300', sectionBg: 'bg-yellow-100/50', gradient: 'from-champagne-light to-yellow-50' }, rites: [] },
  { name: 'Círculo dos Mestres', minPatentLevel: 13, maxPatentLevel: 14, icon: '👑', description: 'Guardiões do saber, mentores e embaixadores da Confraria.', ritual: 'O vinho é eterno, e o saber também.', purpose: 'Este é o círculo dos guardiões do saber. Aprofundamos em tópicos de vanguarda, lideramos degustações e atuamos como mentores, garantindo que a chama do conhecimento permaneça acesa.', theme: { bg: 'bg-gray-800', text: 'text-gray-100', accent: 'text-aged-gold', border: 'border-gray-600', sectionBg: 'bg-gray-700/50', gradient: 'from-night-blue to-gray-800' }, rites: [] },
];

const mockRanking = [
    { name: 'Isabela', xp: 2450 }, { name: 'Ricardo', xp: 2310 }, { name: 'Júlia', xp: 2180 },
    { name: 'Você', xp: 0 }, { name: 'Fernando', xp: 1890 }, { name: 'Clara', xp: 1720 },
    { name: 'Mateus', xp: 1560 }, { name: 'Beatriz', xp: 1400 },
].sort((a, b) => b.xp - a.xp);

const getPatentByXp = (xp: number) => {
  return [...patentsData].reverse().find(p => xp >= p.minXp) || patentsData[0];
};

const getNextPatent = (xp: number) => {
    const currentPatent = getPatentByXp(xp);
    return patentsData.find(p => p.level === currentPatent.level + 1) || null;
}

const AchievementIcon = ({ achievement, className }: { achievement: string; className?: string }) => {
  const icons: { [key: string]: React.ReactElement } = {
    'Aprendiz Enófilo': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><circle cx="14" cy="8" r="2"></circle><path d="M14 10s-2 1.5-2 4"></path></svg>,
    'Mestre da Harmonização': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>,
    'Mestre dos Fundamentos': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>,
    'Explorador Global': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
    'Sommelier em Treinamento': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5c-1.2 1.2-1.2 3.1 0 4.2 1.2 1.2 3.1 1.2 4.2 0 1.2-1.2 1.2-3.1 0-4.2-1.2-1.1-3.1-1.1-4.2 0z"></path><path d="m14.5 5.5 5 5"></path><path d="M12 7.5c-1.2 1.2-1.2 3.1 0 4.2 1.2 1.2 3.1 1.2 4.2 0"></path><path d="m5 12 1.5-1.5c1.2-1.2 3.1-1.2 4.2 0L12 12"></path><path d="M3 21v-5.5c0-2.2 1.8-4 4-4H12"></path></svg>,
    'Rito da Videira Concluído': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
    'default': <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
  };
  return icons[achievement] || icons['default'];
};

const MedalIcon = ({ rank, className }: { rank: number; className?: string }) => {
    const colors: { [key: number]: string } = { 1: 'text-yellow-400', 2: 'text-gray-400', 3: 'text-orange-400' };
    const colorClass = colors[rank] || 'text-velvet-gray';
    return <svg className={`${className} ${colorClass}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>;
};

const RiteDetailView = ({ rite, circle, onClose, onComplete }: { rite: Rite; circle: Circle; onClose: () => void; onComplete: (xp: number) => void }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const handleStepToggle = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const allStepsCompleted = completedSteps.size === rite.steps.length;

  const handleSaveRite = () => {
    if (allStepsCompleted) {
      setShowCompletionPopup(true);
    }
  };

  const handleFinalize = () => {
    onComplete(rite.xp);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in overflow-y-auto" onClick={onClose}>
        <div className={`w-full min-h-full bg-gradient-to-b ${circle.theme.gradient} ${circle.theme.text} pb-10`} onClick={e => e.stopPropagation()}>
            <div className="container mx-auto p-4 sm:p-6 max-w-4xl space-y-8">
                {showCompletionPopup && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 animate-fade-in">
                        <div className={`text-center p-8 rounded-xl shadow-2xl ${circle.theme.sectionBg} border-2 ${circle.theme.border} max-w-sm mx-4`}>
                            <p className="text-6xl">{rite.icon}</p>
                            <h2 className="font-serif text-2xl mt-4">Rito Concluído!</h2>
                            <p className="italic text-base opacity-90 mt-2">“Seu cálice se enche de sabedoria. O tempo agora habita em sua taça.”</p>
                            <p className={`font-bold text-lg mt-4 ${circle.theme.accent}`}>+{rite.xp} Sabedoria Acumulada</p>
                            <button onClick={handleFinalize} className="mt-6 bg-vinifero-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                                Brindar e Voltar à Confraria
                            </button>
                        </div>
                    </div>
                )}

                <header className="relative text-center pt-12">
                    <button onClick={onClose} className={`absolute top-4 left-4 ${circle.theme.accent} hover:opacity-70 transition flex items-center gap-2`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="font-semibold text-sm">Voltar ao Círculo</span>
                    </button>
                    <p className="text-6xl mb-4">{rite.icon}</p>
                    <h1 className="font-serif text-4xl">{rite.title}</h1>
                    <p className={`italic ${circle.theme.accent} mt-2`}>"{rite.ritualPhrase}"</p>
                </header>

                <section className={`p-6 rounded-xl shadow-lg border ${circle.theme.border} ${circle.theme.sectionBg}`}>
                    <p className="whitespace-pre-line text-base opacity-90">{rite.introduction}</p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-center mb-5">Etapas do Rito</h2>
                    <div className="space-y-3">
                        {rite.steps.map((step, index) => (
                            <div key={index} className={`p-4 rounded-lg border flex items-center gap-4 transition-all ${completedSteps.has(index) ? `opacity-50 ${circle.theme.sectionBg}` : `bg-white/50 ${circle.theme.border}`}`}>
                                <button onClick={() => handleStepToggle(index)} className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${completedSteps.has(index) ? `${circle.theme.accent} border-current` : `border-velvet-gray`}`}>
                                    {completedSteps.has(index) && <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </button>
                                <div>
                                    <h3 className={`font-bold ${completedSteps.has(index) ? 'line-through' : ''}`}>{index + 1}. {step.title}</h3>
                                    <p className={`text-sm opacity-80 ${completedSteps.has(index) ? 'line-through' : ''}`}>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={`p-6 rounded-xl shadow-lg border ${circle.theme.border} ${circle.theme.sectionBg}`}>
                    <h2 className="font-serif text-2xl mb-4">Registro Sensorial</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Cor do Vinho</label>
                            <select className="w-full p-2 rounded border border-current bg-transparent">
                                <option>Rubi</option>
                                <option>Granada</option>
                                <option>Púrpura</option>
                                <option>Dourado</option>
                                <option>Palha</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Aroma Predominante</label>
                            <select className="w-full p-2 rounded border border-current bg-transparent">
                                <option>Frutado</option>
                                <option>Floral</option>
                                <option>Amadeirado</option>
                                <option>Terroso</option>
                            </select>
                        </div>
                         <div className="md:col-span-2">
                             <label className="block text-sm font-bold mb-1">Observações Pessoais</label>
                             <textarea rows={3} className="w-full p-2 rounded border border-current bg-transparent" placeholder="Notas de degustação, impressões..."></textarea>
                         </div>
                    </div>
                </section>
                
                <footer className="text-center mt-8">
                    <button 
                        onClick={handleSaveRite}
                        disabled={!allStepsCompleted}
                        className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-velvet-gray disabled:cursor-not-allowed"
                    >
                        {allStepsCompleted ? 'Salvar e Concluir Rito' : 'Complete todas as etapas para salvar'}
                    </button>
                </footer>
            </div>
        </div>
    </div>
  );
};

const CircleDetailView = ({ circle, userPatentLevel, onClose, onRiteComplete }: { circle: Circle; userPatentLevel: number; onClose: () => void; onRiteComplete: (xp: number) => void; }) => {
  const [selectedRite, setSelectedRite] = useState<Rite | null>(null);

  const handleRiteComplete = (xp: number) => {
      onRiteComplete(xp);
      setSelectedRite(null);
  };

  if (selectedRite) {
    return <RiteDetailView rite={selectedRite} circle={circle} onClose={() => setSelectedRite(null)} onComplete={handleRiteComplete} />;
  }

  const isLocked = userPatentLevel < circle.minPatentLevel;

  if (isLocked) {
      const requiredPatent = patentsData.find(p => p.level === circle.minPatentLevel);
      return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in flex items-center justify-center p-4" onClick={onClose}>
              <div className="bg-champagne-light p-8 rounded-xl shadow-2xl text-center max-w-md border border-velvet-gray" onClick={e => e.stopPropagation()}>
                  <p className="text-6xl mb-4">{circle.icon}</p>
                  <h2 className="font-serif text-3xl text-vinifero-purple">Círculo Bloqueado</h2>
                  <p className="mt-2 text-soft-graphite/80">Este círculo será revelado quando você alcançar a patente de</p>
                  <p className="font-serif text-xl text-aged-gold mt-1">{requiredPatent?.name || 'Próxima Patente'}.</p>
                  <button onClick={onClose} className="mt-6 bg-vinifero-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">Voltar à Confraria</button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in overflow-y-auto" onClick={onClose}>
        <div className={`w-full min-h-full bg-gradient-to-b ${circle.theme.gradient} ${circle.theme.text} pb-10`} onClick={e => e.stopPropagation()}>
            <div className="container mx-auto p-4 sm:p-6 max-w-4xl space-y-8">
                 <header className="relative text-center pt-12">
                     <button onClick={onClose} className={`absolute top-4 left-4 ${circle.theme.accent} hover:opacity-70 transition flex items-center gap-2`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="font-semibold text-sm">Voltar à Confraria</span>
                    </button>
                    <p className="text-6xl mb-4">{circle.icon}</p>
                    <h1 className="font-serif text-4xl">{circle.name}</h1>
                    <p className={`italic ${circle.theme.accent} mt-2`}>"{circle.ritual}"</p>
                </header>

                <section className={`p-6 rounded-xl shadow-lg border ${circle.theme.border} ${circle.theme.sectionBg}`}>
                    <h2 className="font-serif text-2xl mb-2">Propósito do Círculo</h2>
                    <p className="whitespace-pre-line text-base opacity-90">{circle.purpose}</p>
                </section>
                
                <section>
                    <h2 className="font-serif text-3xl text-center mb-6">Desafios e Ritos Atuais</h2>
                    {circle.rites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {circle.rites.map(rite => (
                                <button key={rite.title} onClick={() => setSelectedRite(rite)} className={`bg-white/60 p-5 rounded-lg shadow-md border ${circle.theme.border} text-left flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-transform`}>
                                    <p className="text-3xl">{rite.icon}</p>
                                    <h3 className="font-serif text-xl mt-2">{rite.title}</h3>
                                    <p className="text-sm opacity-70 mt-1 flex-grow">{rite.description}</p>
                                    <span className={`mt-4 self-start font-bold text-sm ${circle.theme.accent}`}>Iniciar Rito →</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center opacity-70">Novos ritos serão revelados em breve...</p>
                    )}
                </section>

                <section>
                    <h2 className="font-serif text-3xl text-center mb-6">Confrades do Círculo</h2>
                     <div className="flex justify-center flex-wrap gap-4">
                        {['Isabela', 'Ricardo', 'Júlia', 'Mateus'].map(name => (
                            <div key={name} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-velvet-gray flex items-center justify-center font-serif text-2xl text-vinifero-purple mb-2">{name[0]}</div>
                                <p className="font-semibold text-sm">{name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="text-center italic opacity-80 pt-8">
                    <p>"Aqui, o vinho se torna palavra, e a palavra se torna amizade."</p>
                    <p className="font-semibold mt-1">— Dom Sommelius</p>
                </footer>
            </div>
        </div>
    </div>
  );
};

const ProfilePage = () => {
  const { progress, addXp } = useUserProgress();
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const currentPatent = getPatentByXp(progress.xp);
  const nextPatent = getNextPatent(progress.xp);
  const xpForNextPatent = nextPatent ? nextPatent.minXp : currentPatent.minXp;
  const progressPercentage = nextPatent ? Math.max(0, (progress.xp / xpForNextPatent) * 100) : 100;
  
  const userRanking = { ...mockRanking.find(u => u.name === 'Você'), xp: progress.xp };
  const finalRanking = mockRanking.filter(u => u.name !== 'Você').concat([userRanking]).sort((a, b) => b.xp - a.xp);

  const handleRiteCompletionInProfile = (xp: number) => {
    addXp(xp);
  };
  
  const displayedAchievements = [...progress.achievements];
  if (progress.completedLessons.length > 0 && !displayedAchievements.includes('Rito da Videira Concluído')) {
      // Add a placeholder for completing a rite once any lesson is done.
      // This is a placeholder as rite completion isn't tracked globally yet.
      displayedAchievements.push('Rito da Videira Concluído');
  }

  return (
    <div className="animate-fade-in space-y-12">
        {selectedCircle && <CircleDetailView circle={selectedCircle} userPatentLevel={currentPatent.level} onClose={() => setSelectedCircle(null)} onRiteComplete={handleRiteCompletionInProfile} />}
      
      <header className="text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-vinifero-purple">Confraria Enolus</h1>
        <p className="mt-2 text-lg text-soft-graphite/80">Sua jornada entre taças, saberes e conquistas.</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-soft-graphite/70">Patente Atual</span>
            <span className="font-serif text-xl text-vinifero-purple mt-1">{currentPatent.icon} {currentPatent.name}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-soft-graphite/70">Sabedoria Acumulada</span>
            <span className="font-serif text-2xl text-aged-gold font-bold mt-1">{progress.xp} XP</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-soft-graphite/70">Ritos Completos</span>
            <span className="font-serif text-2xl text-vinifero-purple mt-1">{progress.completedLessons.length}</span>
          </div>
        </div>
        <div className="mt-6">
            <div className="w-full bg-velvet-gray/50 rounded-full h-2.5">
                <div className="bg-aged-gold h-2.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
            </div>
            <p className="text-center text-sm text-soft-graphite/70 mt-2">
                {nextPatent ? `${progress.xp} / ${xpForNextPatent} XP para a próxima patente.` : 'Você alcançou a patente máxima!'}
            </p>
        </div>
        <p className="text-center italic text-soft-graphite/80 mt-4">"{currentPatent.ceremonialPhrase}"</p>
      </section>

       <section>
          <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-2">Patentes da Confraria</h2>
           <p className="text-center text-soft-graphite/70 mb-6">Continue sua jornada para alcançar o título de {nextPatent ? nextPatent.name : 'Grão-Sommelier'}.</p>
          <div className="patentes-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {patentsData.map(patent => {
                  const isCurrent = patent.level === currentPatent.level;
                  const isUnlocked = progress.xp >= patent.minXp;
                  const isConquered = isUnlocked && !isCurrent;
                  const isLocked = !isUnlocked;

                  const baseClasses = "patente-card relative p-4 rounded-lg text-center transition-all duration-300";
                  let stateClasses = '';
                  let tooltip = '';
                  let ariaLabel = '';
                  
                  if (isCurrent) {
                    stateClasses = 'is-active bg-white shadow-xl border-2 border-aged-gold scale-105 cursor-pointer';
                    tooltip = 'Sua patente atual';
                    ariaLabel = `Patente atual: ${patent.name}`;
                  } else if (isConquered) {
                    stateClasses = 'is-owned bg-white shadow border border-velvet-gray/30 hover:shadow-md hover:-translate-y-px cursor-pointer';
                    tooltip = 'Patente conquistada';
                    ariaLabel = `Patente conquistada: ${patent.name}`;
                  } else { // isLocked
                    stateClasses = 'is-locked bg-velvet-gray/30 opacity-60 cursor-not-allowed pointer-events-none';
                    tooltip = `Bloqueado — requer ${patent.minXp} XP`;
                    ariaLabel = `Patente bloqueada: ${patent.name}. Requer ${patent.minXp} XP.`;
                  }

                  return (
                      <div 
                          key={patent.name} 
                          className={`${baseClasses} ${stateClasses}`}
                          title={tooltip}
                          aria-label={ariaLabel}
                      >
                          {isLocked && (
                            <span className="badge-bloqueado absolute top-2 right-2 z-10 pointer-events-none" aria-hidden="true">
                                <div className="bg-night-blue/80 text-white flex items-center justify-center w-6 h-6 rounded-full shadow-md text-xs">
                                    🔒
                                </div>
                            </span>
                          )}
                          {isConquered && (
                            <span className="absolute bottom-1 right-1 bg-green-100 text-green-800 flex items-center justify-center w-5 h-5 rounded-full" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                          )}
                          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isUnlocked ? 'bg-champagne-light' : 'bg-velvet-gray'}`}>{patent.icon}</div>
                          <p className="font-semibold text-sm mt-2 text-vinifero-purple">{patent.name}</p>
                      </div>
                  )
              })}
          </div>
       </section>
       
      <section>
        <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-2">Círculos da Confraria</h2>
        <p className="text-center text-soft-graphite/70 mb-6">Encontre seu círculo e conecte-se com confrades do mesmo grau.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circlesData.map(circle => {
            const isUnlocked = currentPatent.level >= circle.minPatentLevel;
            return (
              <button 
                key={circle.name} 
                onClick={() => setSelectedCircle(circle)}
                className={`bg-white p-6 rounded-xl shadow-lg border text-left flex flex-col items-start transition-all duration-300 ${isUnlocked ? 'border-velvet-gray/50 hover:shadow-xl hover:-translate-y-1' : 'opacity-50 bg-velvet-gray/20 cursor-not-allowed'}`}
                disabled={!isUnlocked}
              >
                  <p className="text-4xl">{circle.icon}</p>
                  <h3 className="font-serif text-xl text-vinifero-purple mt-3">{circle.name}</h3>
                  <p className="text-sm text-soft-graphite/70 mt-1 flex-grow">{circle.description}</p>
                  <p className="text-xs italic text-aged-gold mt-4">"{circle.ritual}"</p>
                  {!isUnlocked && <div className="absolute inset-0 bg-champagne-light/50 flex items-center justify-center font-bold text-vinifero-purple rounded-xl opacity-0">BLOQUEADO</div>}
              </button>
            )
          })}
        </div>
        <p className="text-center italic text-soft-graphite/70 mt-8">A sabedoria se multiplica quando partilhada. — Dom Sommelius</p>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-2">Salão dos Confrades</h2>
        <p className="text-center text-soft-graphite/70 mb-6">Os confrades mais ativos desta safra.</p>
        <div className="bg-white max-w-lg mx-auto p-6 rounded-xl shadow-lg border border-velvet-gray/50 space-y-3">
          {finalRanking.map((user, index) => {
            const rank = index + 1;
            const userPatent = getPatentByXp(user.xp);
            const isCurrentUser = user.name === 'Você';
            return (
              <div key={user.name + index} className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-aged-gold/20 border-2 border-aged-gold' : ''}`}>
                <div className="w-8 text-center font-bold text-lg text-vinifero-purple">{rank <= 3 ? <MedalIcon rank={rank} className="w-6 h-6 mx-auto"/> : `${rank}.`}</div>
                <div className="flex-grow font-semibold text-soft-graphite ml-3">
                  {user.name}
                  <span className="text-sm text-aged-gold ml-2 font-normal">• {userPatent.name}</span>
                </div>
                <div className="font-bold text-vinifero-purple">{user.xp} XP</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
          <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-6">📜 Conquistas Cerimoniais</h2>
          {displayedAchievements.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4">
                  {displayedAchievements.map(ach => (
                      <div key={ach} className="bg-white p-4 rounded-lg shadow border border-velvet-gray/30 text-center w-40">
                          <AchievementIcon achievement={ach} className="w-10 h-10 text-aged-gold mx-auto" />
                          <p className="text-sm font-semibold mt-2 text-vinifero-purple">{ach}</p>
                      </div>
                  ))}
              </div>
          ) : (
            <p className="text-center text-soft-graphite/70">Continue sua jornada para desbloquear conquistas!</p>
          )}
      </section>

      <footer className="text-center border-t border-velvet-gray pt-8 mt-8">
          <p className="italic text-soft-graphite/80">“O vinho ensina, o tempo revela.”</p>
          <p className="font-semibold text-soft-graphite/90 mt-1">— Dom Sommelius</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
