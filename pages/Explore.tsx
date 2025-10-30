
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';

const ExplorePage: React.FC = () => {
  const { t } = useTranslation('home');
  const grape = 'Cabernet Sauvignon';
  const xp = 20;

  return (
    <div key={i18n.language} className="animate-fade-in space-y-8">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-vinifero-purple">{t('hero.title')}</h1>
            <p className="mt-2 text-lg text-soft-graphite/80">{t('hero.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-2xl text-aged-gold">{t('mission.title')}</h2>
        <p className="mt-2 text-soft-graphite">
          {t('mission.body', { grape, xp })}
        </p>
        <button className="mt-4 bg-vinifero-purple text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
          {t('mission.cta')}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-vinifero-purple">{t('recs.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border border-velvet-gray/30">
            <h4 className="font-semibold">{t('recs.track_title')}</h4>
            <p className="text-sm text-soft-graphite/70 mt-1">{t('recs.track_desc')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-velvet-gray/30">
            <h4 className="font-semibold">{t('recs.quiz_title')}</h4>
            <p className="text-sm text-soft-graphite/70 mt-1">{t('recs.quiz_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;