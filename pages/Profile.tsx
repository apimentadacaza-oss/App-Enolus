import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserProgress, Patent, Circle, Rite, RiteStep } from '../types';
import type { ArticleMetadata } from '../features/encyclopedia/types';
import { loadArticleIndex } from '../features/encyclopedia/content';
import RiteSuccessModal from '../components/RiteSuccessModal';
import PatentDetailModal from '../components/PatentDetailModal';

// Data is now minimal, referencing i18n keys for display text.
const patentsData: Omit<Patent, 'name' | 'ceremonialPhrase'>[] = [
  { level: 1, minXp: 0, icon: '🍇' }, { level: 2, minXp: 200, icon: '🍷' },
  { level: 3, minXp: 400, icon: '🌹' }, { level: 4, minXp: 600, icon: '🌍' },
  { level: 5, minXp: 900, icon: '🕰️' }, { level: 6, minXp: 1200, icon: '🔬' },
  { level: 7, minXp: 1600, icon: '⚔️' }, { level: 8, minXp: 2000, icon: '🕯️' },
  { level: 9, minXp: 2500, icon: '🏵️' }, { level: 10, minXp: 3000, icon: '🍽️' },
  { level: 11, minXp: 3600, icon: '📖' }, { level: 12, minXp: 4200, icon: '⏳' },
  { level: 13, minXp: 5000, icon: '🌐' }, { level: 14, minXp: 6000, icon: '👑' },
];

const circlesData: Omit<Circle, 'name' | 'description' | 'ritual' | 'purpose' | 'rites'>[] = [
  { 
    minPatentLevel: 1, maxPatentLevel: 3, icon: '🍇',
    theme: { bg: 'bg-violet-50', text: 'text-violet-900', accent: 'text-violet-600', border: 'border-violet-200', sectionBg: 'bg-violet-100/50', gradient: 'from-champagne-light to-violet-50' },
  },
  { 
    minPatentLevel: 4, maxPatentLevel: 6, icon: '🍷',
    theme: { bg: 'bg-red-50', text: 'text-red-900', accent: 'text-red-700', border: 'border-red-200', sectionBg: 'bg-red-100/50', gradient: 'from-champagne-light to-red-50' },
  },
  // FIX: Removed `rites: []` property as it violates the Omit type.
  // The `rites` property is correctly populated later in the `allCircles` mapping.
  { minPatentLevel: 7, maxPatentLevel: 9, icon: '🌍', theme: { bg: 'bg-orange-50', text: 'text-orange-900', accent: 'text-orange-700', border: 'border-orange-200', sectionBg: 'bg-orange-100/50', gradient: 'from-champagne-light to-orange-50' } },
  { minPatentLevel: 10, maxPatentLevel: 12, icon: '🍽️', theme: { bg: 'bg-yellow-50', text: 'text-yellow-900', accent: 'text-yellow-700', border: 'border-yellow-300', sectionBg: 'bg-yellow-100/50', gradient: 'from-champagne-light to-yellow-50' } },
  { minPatentLevel: 13, maxPatentLevel: 14, icon: '👑', theme: { bg: 'bg-gray-800', text: 'text-gray-100', accent: 'text-aged-gold', border: 'border-gray-600', sectionBg: 'bg-gray-700/50', gradient: 'from-night-blue to-gray-800' } },
];

const mockRankingData = [
    { name: 'Isabela', xp: 2450 }, { name: 'Ricardo', xp: 2310 }, { name: 'Júlia', xp: 2180 },
    { nameKey: 'ranking.you', xp: 0 }, { name: 'Fernando', xp: 1890 }, { name: 'Clara', xp: 1720 },
    { name: 'Mateus', xp: 1560 }, { name: 'Beatriz', xp: 1400 },
].sort((a, b) => b.xp - a.xp);

const PRIMEIRA_TACA_ACHIEVEMENT = {
  name: 'Primeira Taça',
  description: 'Celebre seu início na arte do vinho — a primeira taça marca o começo da jornada.',
  xp: 20,
  icon: '🍷'
};

const getPatentByXp = (xp: number, t: (key: string) => string): Patent => {
  const patentMeta = [...patentsData].reverse().find(p => xp >= p.minXp) || patentsData[0];
  const name = t(`data.patents.p${patentMeta.level}.name`);
  const ceremonialPhrase = t(`data.patents.p${patentMeta.level}.phrase`);
  return { ...patentMeta, name, ceremonialPhrase };
};

const getNextPatent = (xp: number, t: (key: string) => string) => {
    const currentPatent = getPatentByXp(xp, t);
    const nextPatentMeta = patentsData.find(p => p.level === currentPatent.level + 1);
    if (!nextPatentMeta) return null;
    const name = t(`data.patents.p${nextPatentMeta.level}.name`);
    const ceremonialPhrase = t(`data.patents.p${nextPatentMeta.level}.phrase`);
    return { ...nextPatentMeta, name, ceremonialPhrase };
}

type PatentState = 'active' | 'owned' | 'locked';

const getPatentState = (patent: Patent, userXp: number, currentPatentLevel: number): PatentState => {
  if (patent.level === currentPatentLevel) return 'active';
  if (userXp >= patent.minXp) return 'owned';
  return 'locked';
};

const AchievementIcon = ({ achievement, className }: { achievement: string; className?: string }) => {
  // ... (icon mapping remains the same as it's not translatable content)
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
  const { t } = useTranslation('confraria');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleStepToggle = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) newSet.delete(stepIndex);
      else newSet.add(stepIndex);
      return newSet;
    });
  };

  const allStepsCompleted = completedSteps.size === rite.steps.length;

  const handleSaveRite = () => {
    if (allStepsCompleted) setShowCompletionModal(true);
  };

  const handleFinalize = () => {
    onComplete(rite.xp);
    setShowCompletionModal(false);
    onClose();
  };

  return (
    <>
      <RiteSuccessModal isOpen={showCompletionModal} onClose={handleFinalize} rite={rite} circle={circle} />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in overflow-y-auto" onClick={onClose}>
        <div className={`w-full min-h-full bg-gradient-to-b ${circle.theme.gradient} ${circle.theme.text} pb-10`} onClick={e => e.stopPropagation()}>
          <div className="container mx-auto p-4 sm:p-6 max-w-4xl space-y-8">
            <header className="relative text-center pt-12">
              <button onClick={onClose} className={`absolute top-4 left-4 ${circle.theme.accent} hover:opacity-70 transition flex items-center gap-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                <span className="font-semibold text-sm">{t('rite_detail.back_to_circle')}</span>
              </button>
              <p className="text-6xl mb-4">{rite.icon}</p>
              <h1 className="font-serif text-4xl">{rite.title}</h1>
              <p className={`italic ${circle.theme.accent} mt-2`}>"{rite.ritualPhrase}"</p>
            </header>
            <section className={`p-6 rounded-xl shadow-lg border ${circle.theme.border} ${circle.theme.sectionBg}`}>
              <p className="whitespace-pre-line text-base opacity-90">{rite.introduction}</p>
            </section>
            <section>
              <h2 className="font-serif text-2xl text-center mb-5">{t('rite_detail.steps_title')}</h2>
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
              <h2 className="font-serif text-2xl mb-4">{t('rite_detail.log_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">{t('rite_detail.log_color_label')}</label>
                  <select className="w-full p-2 rounded border border-current bg-transparent"><option>Rubi</option><option>Granada</option><option>Púrpura</option><option>Dourado</option><option>Palha</option></select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">{t('rite_detail.log_aroma_label')}</label>
                  <select className="w-full p-2 rounded border border-current bg-transparent"><option>Frutado</option><option>Floral</option><option>Amadeirado</option><option>Terroso</option></select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">{t('rite_detail.log_notes_label')}</label>
                  <textarea rows={3} className="w-full p-2 rounded border border-current bg-transparent" placeholder={t('rite_detail.log_notes_placeholder') ?? ""}></textarea>
                </div>
              </div>
            </section>
            <footer className="text-center mt-8">
              <button onClick={handleSaveRite} disabled={!allStepsCompleted} className="bg-vinifero-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-velvet-gray disabled:cursor-not-allowed">
                {allStepsCompleted ? t('rite_detail.cta_complete') : t('rite_detail.cta_disabled')}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

const CircleDetailView = ({ circle, userPatentLevel, onClose, onRiteComplete }: { circle: Circle; userPatentLevel: number; onClose: () => void; onRiteComplete: (xp: number, riteTitle: string) => void; }) => {
  const { t } = useTranslation('confraria');
  const [selectedRite, setSelectedRite] = useState<Rite | null>(null);

  const handleRiteComplete = (xp: number) => {
    if (selectedRite) onRiteComplete(xp, selectedRite.title);
    setSelectedRite(null);
  };

  if (selectedRite) {
    return <RiteDetailView rite={selectedRite} circle={circle} onClose={() => setSelectedRite(null)} onComplete={handleRiteComplete} />;
  }

  const isLocked = userPatentLevel < circle.minPatentLevel;
  const patentName = t(`data.patents.p${circle.minPatentLevel}.name`);

  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-champagne-light p-8 rounded-xl shadow-2xl text-center max-w-md border border-velvet-gray" onClick={e => e.stopPropagation()}>
          <p className="text-6xl mb-4">{circle.icon}</p>
          <h2 className="font-serif text-3xl text-vinifero-purple">{t('circle_detail.locked_title')}</h2>
          <p className="mt-2 text-soft-graphite/80">{t('circle_detail.locked_body')}</p>
          <p className="font-serif text-xl text-aged-gold mt-1">{patentName}</p>
          <button onClick={onClose} className="mt-6 bg-vinifero-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">{t('circle_detail.locked_cta')}</button>
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
              <span className="font-semibold text-sm">{t('circle_detail.back_to_guild')}</span>
            </button>
            <p className="text-6xl mb-4">{circle.icon}</p>
            <h1 className="font-serif text-4xl">{circle.name}</h1>
            <p className={`italic ${circle.theme.accent} mt-2`}>"{circle.ritual}"</p>
          </header>
          <section className={`p-6 rounded-xl shadow-lg border ${circle.theme.border} ${circle.theme.sectionBg}`}>
            <h2 className="font-serif text-2xl mb-2">{t('circle_detail.purpose_title')}</h2>
            <p className="whitespace-pre-line text-base opacity-90">{circle.purpose}</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-center mb-6">{t('circle_detail.rites_title')}</h2>
            {circle.rites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {circle.rites.map(rite => (
                  <button key={rite.title} onClick={() => setSelectedRite(rite)} className={`bg-white/60 p-5 rounded-lg shadow-md border ${circle.theme.border} text-left flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-transform`}>
                    <p className="text-3xl">{rite.icon}</p>
                    <h3 className="font-serif text-xl mt-2">{rite.title}</h3>
                    <p className="text-sm opacity-70 mt-1 flex-grow">{rite.description}</p>
                    <span className={`mt-4 self-start font-bold text-sm ${circle.theme.accent}`}>{t('circle_detail.start_rite')}</span>
                  </button>
                ))}
              </div>
            ) : (<p className="text-center opacity-70">{t('circle_detail.rites_empty')}</p>)}
          </section>
          <section>
            <h2 className="font-serif text-3xl text-center mb-6">{t('circle_detail.members_title')}</h2>
            <div className="flex justify-center flex-wrap gap-4">{['Isabela', 'Ricardo', 'Júlia', 'Mateus'].map(name => (<div key={name} className="text-center"><div className="w-16 h-16 rounded-full bg-velvet-gray flex items-center justify-center font-serif text-2xl text-vinifero-purple mb-2">{name[0]}</div><p className="font-semibold text-sm">{name}</p></div>))}</div>
          </section>
          <footer className="text-center italic opacity-80 pt-8">
            <p>"{t('circle_detail.footer_quote')}"</p>
            <p className="font-semibold mt-1">{t('footer.author')}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

interface ProfilePageProps {
  progress: UserProgress;
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
  onSelectFavorite: (slug: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ progress, addXp, addAchievement, onSelectFavorite }) => {
  const { t, i18n } = useTranslation('confraria');
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [selectedPatent, setSelectedPatent] = useState<{ patent: Patent; circle: Circle | null } | null>(null);
  const [allEntries, setAllEntries] = useState<ArticleMetadata[]>([]);

  useEffect(() => {
    loadArticleIndex(i18n.language).then(setAllEntries);
  }, [i18n.language]);

  const favoriteEntries = useMemo(() => {
    if (!allEntries.length || !progress.favoriteArticles) return [];
    const favoriteMap = new Map(allEntries.map(entry => [entry.slug, entry]));
    return progress.favoriteArticles
      .map(slug => favoriteMap.get(slug))
      .filter((entry): entry is ArticleMetadata => !!entry);
  }, [allEntries, progress.favoriteArticles]);

  const currentPatent = getPatentByXp(progress.xp, t);
  const nextPatent = getNextPatent(progress.xp, t);
  
  const allPatents: Patent[] = patentsData.map(p => ({ ...p, name: t(`data.patents.p${p.level}.name`), ceremonialPhrase: t(`data.patents.p${p.level}.phrase`) }));
  const allCircles: Circle[] = circlesData.map((c, i) => {
    const key = `c${i + 1}`;
    // A simplified mapping of rites to circles for this refactor
    const ritesMap: { [key: string]: string[] } = {
        c1: ['c1_r1', 'c1_r2', 'c1_r3'],
        c2: ['c2_r1', 'c2_r2'],
    };
    const riteKeys = ritesMap[key] || [];
    const rites: Rite[] = riteKeys.map(rk => {
        const steps: RiteStep[] = [
            { title: t(`data.rites.${rk}.step1_title`), description: t(`data.rites.${rk}.step1_desc`) },
            { title: t(`data.rites.${rk}.step2_title`), description: t(`data.rites.${rk}.step2_desc`) },
            t(`data.rites.${rk}.step3_title`) && { title: t(`data.rites.${rk}.step3_title`), description: t(`data.rites.${rk}.step3_desc`) }
        ].filter(Boolean) as RiteStep[];
        
        return {
            icon: '', // Note: Icons are hardcoded for now
            title: t(`data.rites.${rk}.title`),
            description: t(`data.rites.${rk}.description`),
            ritualPhrase: t(`data.rites.${rk}.phrase`),
            introduction: t(`data.rites.${rk}.intro`),
            xp: i === 0 ? 50 : 75, // Simplified XP
            steps: steps
        };
    });
    
    return {
        ...c,
        name: t(`data.circles.${key}.name`),
        description: t(`data.circles.${key}.description`),
        ritual: t(`data.circles.${key}.ritual`),
        purpose: "",
        rites: rites
    };
  });

  const xpForCurrentPatent = currentPatent.minXp;
  const xpForNextPatent = nextPatent ? nextPatent.minXp : xpForCurrentPatent;
  const levelXpRange = xpForNextPatent - xpForCurrentPatent;
  const xpInCurrentLevel = progress.xp - xpForCurrentPatent;
  const progressPercentage = (nextPatent && levelXpRange > 0) ? (xpInCurrentLevel / levelXpRange) * 100 : 100;

  const mockRanking = mockRankingData.map(u => ({ ...u, name: u.nameKey ? t(u.nameKey) : u.name }));
  const userRanking = { ...mockRanking.find(u => u.name === t('ranking.you')), xp: progress.xp };
  const finalRanking = mockRanking.filter(u => u.name !== t('ranking.you')).concat([userRanking]).sort((a, b) => b.xp - a.xp);

  const handleRiteCompletionInProfile = (xp: number, riteTitle: string) => {
    addXp(xp);
    const circleDaVideira = allCircles[0];
    if (circleDaVideira && circleDaVideira.rites.some(r => r.title === riteTitle)) {
      if (!progress.achievements.includes(PRIMEIRA_TACA_ACHIEVEMENT.name)) {
        addXp(PRIMEIRA_TACA_ACHIEVEMENT.xp);
        addAchievement(PRIMEIRA_TACA_ACHIEVEMENT.name);
      }
    }
  };

  const openPatent = (patentName: string) => {
    const patentData = allPatents.find(p => p.name === patentName);
    if (patentData) {
      const circleData = allCircles.find(c => patentData.level >= c.minPatentLevel && patentData.level <= c.maxPatentLevel) || null;
      setSelectedPatent({ patent: patentData, circle: circleData });
    }
  };
  
  const displayedAchievements = [...progress.achievements];
  if (progress.completedLessons.length > 0 && !displayedAchievements.includes('Rito da Videira Concluído')) {
      displayedAchievements.push('Rito da Videira Concluído');
  }

  const isPrimeiraTacaUnlocked = progress.achievements.includes(PRIMEIRA_TACA_ACHIEVEMENT.name);

  return (
    <div className="animate-fade-in space-y-12">
      {selectedCircle && <CircleDetailView circle={selectedCircle} userPatentLevel={currentPatent.level} onClose={() => setSelectedCircle(null)} onRiteComplete={handleRiteCompletionInProfile} />}
      {selectedPatent && <PatentDetailModal isOpen={!!selectedPatent} onClose={() => setSelectedPatent(null)} patent={selectedPatent.patent} circle={selectedPatent.circle} />}
      
      <header className="text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-vinifero-purple">{t('title')}</h1>
        <p className="mt-2 text-lg text-soft-graphite/80">{t('subtitle')}</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center"><span className="text-sm font-semibold text-soft-graphite/70">{t('stats.current_patent')}</span><span className="font-serif text-xl text-vinifero-purple mt-1">{currentPatent.icon} {currentPatent.name}</span></div>
          <div className="flex flex-col items-center"><span className="text-sm font-semibold text-soft-graphite/70">{t('stats.accumulated_wisdom')}</span><span className="font-serif text-2xl text-aged-gold font-bold mt-1">{progress.xp} XP</span></div>
          <div className="flex flex-col items-center"><span className="text-sm font-semibold text-soft-graphite/70">{t('stats.completed_rites')}</span><span className="font-serif text-2xl text-vinifero-purple mt-1">{progress.completedLessons.length}</span></div>
        </div>
        <div className="mt-6">
          <div className="w-full bg-velvet-gray/50 rounded-full h-2.5"><div className="bg-aged-gold h-2.5 rounded-full" style={{width: `${progressPercentage}%`}}></div></div>
          <p className="text-center text-sm text-soft-graphite/70 mt-2">
            {nextPatent ? t('progress_bar.label', { currentXp: progress.xp, nextXp: xpForNextPatent }) : t('progress_bar.max_level')}
          </p>
        </div>
        <p className="text-center italic text-soft-graphite/80 mt-4">"{currentPatent.ceremonialPhrase}"</p>
        {currentPatent.level === 1 && (
          <div className="mt-6 border-t border-velvet-gray/50 pt-4">
            <h3 className="text-center font-serif text-lg text-vinifero-purple mb-3">{t('patents.achievement_title')}</h3>
            <div className={`relative flex items-center gap-4 p-3 rounded-lg transition-all max-w-sm mx-auto ${ isPrimeiraTacaUnlocked ? 'bg-aged-gold/10 cursor-pointer hover:bg-aged-gold/20' : 'bg-velvet-gray/20 opacity-70' }`} title={PRIMEIRA_TACA_ACHIEVEMENT.description} onClick={isPrimeiraTacaUnlocked ? () => alert(`${t('achievements.title')}: ${PRIMEIRA_TACA_ACHIEVEMENT.name}\n\n${PRIMEIRA_TACA_ACHIEVEMENT.description}`) : undefined} role={isPrimeiraTacaUnlocked ? "button" : undefined} tabIndex={isPrimeiraTacaUnlocked ? 0 : -1}>
              <span className="text-3xl">{PRIMEIRA_TACA_ACHIEVEMENT.icon}</span>
              <div><p className="font-bold text-soft-graphite">{PRIMEIRA_TACA_ACHIEVEMENT.name}</p><p className="text-sm text-aged-gold font-semibold">+{PRIMEIRA_TACA_ACHIEVEMENT.xp} XP</p></div>
              {!isPrimeiraTacaUnlocked && <div className="absolute top-2 right-2 text-night-blue" aria-label={t('patents.locked_aria_label')}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002 2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg></div>}
              {isPrimeiraTacaUnlocked && <div className="absolute top-2 right-2 text-green-600" aria-label={t('patents.unlocked_aria_label')}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>}
            </div>
          </div>
        )}
      </section>

      <section className="patentes-section">
        <div className="patentes-header">
          <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-2">{t('patents.title')}</h2>
          <p className="text-center text-soft-graphite/70 mb-6">{nextPatent ? t('patents.subtitle', { nextPatentName: nextPatent.name }) : t('patents.subtitle_max')}</p>
        </div>
        <div className="patentes-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allPatents.map(patent => {
            const state = getPatentState(patent, progress.xp, currentPatent.level);
            const isEnabled = state === 'active' || state === 'owned';
            return (
              <div key={patent.name} className={`patente-card relative p-4 text-center group is-${state} ${state === 'active' ? 'bg-white border-2 border-aged-gold' : state === 'owned' ? 'bg-white border border-velvet-gray/30' : 'bg-velvet-gray/30'} ${isEnabled ? 'active:scale-95' : ''}`} role={isEnabled ? 'button' : undefined} tabIndex={isEnabled ? 0 : -1} aria-disabled={!isEnabled} aria-label={isEnabled ? t('patents.open_details_aria', { patentName: patent.name }) : t('patents.locked_details_aria', { patentName: patent.name })} onClick={isEnabled ? () => openPatent(patent.name) : undefined} onKeyDown={isEnabled ? (e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPatent(patent.name); } } : undefined}>
                <span className="tooltip absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-xs font-semibold text-white bg-night-blue rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30">{patent.name}<span className="block font-normal opacity-80">{state === 'active' ? t('patents.tooltip.current') : state === 'owned' ? t('patents.tooltip.owned') : t('patents.tooltip.locked', { xp: patent.minXp })}</span></span>
                {state === 'locked' && <span className="badge-bloqueado absolute top-2 right-2 z-10 pointer-events-none" aria-hidden="true"><div className="bg-night-blue/80 text-white flex items-center justify-center w-6 h-6 rounded-full shadow-md text-xs">🔒</div></span>}
                {state === 'owned' && <span className="absolute bottom-1 right-1 bg-green-100 text-green-800 flex items-center justify-center w-5 h-5 rounded-full" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isEnabled ? 'bg-champagne-light' : 'bg-velvet-gray'}`}>{patent.icon}</div>
                <p className="font-semibold text-sm mt-2 text-vinifero-purple">{patent.name}</p>
              </div>
            )
          })}
        </div>
      </section>
       
      <section>
        <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-2">{t('circles.title')}</h2>
        <p className="text-center text-soft-graphite/70 mb-6">{t('circles.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCircles.map(circle => {
            const isUnlocked = currentPatent.level >= circle.minPatentLevel;
            return (
              <div key={circle.name} role={isUnlocked ? 'button' : undefined} tabIndex={isUnlocked ? 0 : -1} onClick={isUnlocked ? () => setSelectedCircle(circle) : undefined} onKeyDown={isUnlocked ? (e) => (e.key === 'Enter' || e.key === ' ') && setSelectedCircle(circle) : undefined} className={`bg-white p-6 rounded-xl shadow-lg border text-left flex flex-col items-start transition-all duration-300 ${isUnlocked ? 'border-velvet-gray/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-50 bg-velvet-gray/20 cursor-not-allowed'}`} aria-disabled={!isUnlocked} aria-label={isUnlocked ? t('circles.open_aria', { circleName: circle.name }) : t('circles.locked_aria', { circleName: circle.name })}>
                <p className="text-4xl">{circle.icon}</p>
                <h3 className="font-serif text-xl text-vinifero-purple mt-3">{circle.name}</h3>
                <p className="text-sm text-soft-graphite/70 mt-1 flex-grow">{circle.description}</p>
                <p className="text-xs italic text-aged-gold mt-4">"{circle.ritual}"</p>
                {!isUnlocked && <div className="absolute inset-0 bg-champagne-light/50 flex items-center justify-center font-bold text-vinifero-purple rounded-xl opacity-0" aria-hidden="true">{t('circles.locked_label')}</div>}
              </div>
            );
          })}
        </div>
        <p className="text-center italic text-soft-graphite/70 mt-8">{t('circle_detail.footer_quote')}</p>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-2">{t('ranking.title')}</h2>
        <p className="text-center text-soft-graphite/70 mb-6">{t('ranking.subtitle')}</p>
        <div className="bg-white max-w-lg mx-auto p-6 rounded-xl shadow-lg border border-velvet-gray/50 space-y-3">
          {finalRanking.map((user, index) => {
            const rank = index + 1;
            const userPatent = getPatentByXp(user.xp, t);
            return (
              <div key={user.name + index} className={`flex items-center p-3 rounded-lg ${user.name === t('ranking.you') ? 'bg-aged-gold/20 border-2 border-aged-gold' : ''}`}>
                <div className="w-8 text-center font-bold text-lg text-vinifero-purple">{rank <= 3 ? <MedalIcon rank={rank} className="w-6 h-6 mx-auto"/> : `${rank}.`}</div>
                <div className="flex-grow font-semibold text-soft-graphite ml-3">{user.name}<span className="text-sm text-aged-gold ml-2 font-normal">• {userPatent.name}</span></div>
                <div className="font-bold text-vinifero-purple">{user.xp} XP</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="conquistas-section">
          <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-6">{t('achievements.title')}</h2>
          {displayedAchievements.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4">
                  {displayedAchievements.map(ach => (
                      <div key={ach} className="bg-white p-4 rounded-lg shadow border border-velvet-gray/30 text-center w-40">
                          <AchievementIcon achievement={ach} className="w-10 h-10 text-aged-gold mx-auto" />
                          <p className="text-sm font-semibold mt-2 text-vinifero-purple">{ach}</p>
                      </div>
                  ))}
              </div>
          ) : (<p className="text-center text-soft-graphite/70">{t('achievements.empty')}</p>)}
      </section>

      <section>
        <h2 className="font-serif text-3xl text-vinifero-purple text-center mb-6">{t('favorites.title')}</h2>
        {favoriteEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {favoriteEntries.map(entry => (
              <button
                key={entry.slug}
                onClick={() => onSelectFavorite(entry.slug)}
                className="w-full text-left p-4 rounded-lg shadow-sm border bg-white border-velvet-gray/30 hover:bg-champagne-light hover:border-aged-gold/50 transition-all duration-200"
              >
                <p className="text-xs font-bold uppercase text-aged-gold">{entry.category_display}</p>
                <h3 className="font-serif text-lg text-vinifero-purple mt-1">{entry.title}</h3>
                <p className="mt-1 text-sm text-soft-graphite/80 line-clamp-2">{entry.summary}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white/50 border-2 border-dashed border-velvet-gray rounded-xl max-w-md mx-auto">
            <p className="text-soft-graphite/70 font-semibold">{t('favorites.empty')}</p>
          </div>
        )}
      </section>

      <footer className="text-center border-t border-velvet-gray pt-8 mt-8">
          <p className="italic text-soft-graphite/80">{t('footer.quote')}</p>
          <p className="font-semibold text-soft-graphite/90 mt-1">{t('footer.author')}</p>
      </footer>
    </div>
  );
};

export default ProfilePage;