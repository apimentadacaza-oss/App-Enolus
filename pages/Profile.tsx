import React from 'react';
import type { UserProgress } from '../types';

interface ProfilePageProps {
  progress: UserProgress;
}

// Icon component for achievements
const AchievementIcon: React.FC<{ achievement: string, className?: string }> = ({ achievement, className }) => {
  switch (achievement) {
    case 'Aprendiz Enófilo':
      // Book with a grape
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          <circle cx="14" cy="8" r="2"></circle>
          <path d="M14 10s-2 1.5-2 4"></path>
        </svg>
      );
    case 'Mestre da Harmonização':
      // Link icon to represent pairing
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
        </svg>
      );
    case 'Mestre dos Fundamentos':
      // Shield with checkmark
       return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
       );
    default:
      // Generic medal icon
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      );
  }
};


const ProfilePage: React.FC<ProfilePageProps> = ({ progress }) => {
  const level = Math.floor(progress.xp / 100) + 1;
  const xpForNextLevel = 100;
  const currentLevelXp = progress.xp % 100;

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="font-serif text-4xl text-vinifero-purple">Seu Perfil</h1>
        <p className="mt-1 text-lg text-soft-graphite/80">Acompanhe sua jornada no mundo do vinho.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-2xl text-aged-gold">Progresso</h2>
        <div className="mt-4 space-y-3">
          <div>
            <p className="font-semibold text-soft-graphite">Nível: <span className="text-vinifero-purple font-bold">{level}</span></p>
          </div>
          <div>
            <p className="font-semibold text-soft-graphite">Experiência (XP): <span className="text-vinifero-purple font-bold">{progress.xp}</span></p>
            <div className="w-full bg-velvet-gray/50 rounded-full h-4 mt-2">
              <div 
                className="bg-aged-gold h-4 rounded-full" 
                style={{ width: `${(currentLevelXp / xpForNextLevel) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-right text-soft-graphite/70 mt-1">{currentLevelXp} / {xpForNextLevel} XP para o próximo nível</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-2xl text-aged-gold">Conquistas</h2>
        {progress.achievements.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {progress.achievements.map((achievement, index) => (
              <li key={index} className="flex items-center p-4 bg-white rounded-xl border border-velvet-gray/40 shadow-sm transition-colors hover:bg-champagne-light">
                <div className="w-12 h-12 bg-champagne-light rounded-full flex items-center justify-center border-2 border-aged-gold flex-shrink-0">
                  <AchievementIcon achievement={achievement} className="w-6 h-6 text-aged-gold" />
                </div>
                <p className="ml-4 font-semibold text-vinifero-purple text-md">{achievement}</p>
              </li>
            ))}
          </ul>
        ) : (
           <div className="text-center py-4">
             <div className="w-20 h-20 mx-auto bg-velvet-gray/30 rounded-full flex items-center justify-center border-2 border-dashed border-velvet-gray">
                <svg className="w-10 h-10 text-velvet-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
             </div>
             <p className="mt-4 text-soft-graphite/70">Você ainda não desbloqueou nenhuma conquista. <br/> Continue aprendendo!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;