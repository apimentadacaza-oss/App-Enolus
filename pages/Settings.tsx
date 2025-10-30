import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import TranslationCoverage from '../components/TranslationCoverage';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation('settings');

  return (
    <div key={i18n.language} className="animate-fade-in space-y-8 max-w-2xl mx-auto">
      <header>
        <h1 className="font-serif text-4xl md:text-5xl text-vinifero-purple">
          {t('title')}
        </h1>
        <p className="mt-2 text-lg text-soft-graphite/80">
          {t('subtitle')}
        </p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-2xl text-vinifero-purple border-b border-velvet-gray/50 pb-3 mb-4">
          {t('language.title')}
        </h2>
        <p className="text-soft-graphite/80 mb-4">
          {t('language.description')}
        </p>
        <div className="flex justify-center">
            <LanguageSwitcher />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
        <h2 className="font-serif text-2xl text-vinifero-purple border-b border-velvet-gray/50 pb-3 mb-4">
          {t('coverage.title')}
        </h2>
        <p className="text-soft-graphite/80 mb-4">
          {t('coverage.description')}
        </p>
        <TranslationCoverage />
      </div>
    </div>
  );
};

export default SettingsPage;