import React from 'react';
import { useTranslation } from 'react-i18next';
import { saveLanguage } from '../i18n/detector';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation('settings');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    saveLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="flex items-center space-x-2 p-1 bg-champagne-light rounded-lg border border-velvet-gray/30">
      <button
        onClick={() => changeLanguage('pt-BR')}
        disabled={currentLanguage.startsWith('pt')}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
          currentLanguage.startsWith('pt')
            ? 'bg-vinifero-purple text-white cursor-default'
            : 'bg-transparent text-soft-graphite hover:bg-velvet-gray/50'
        }`}
        aria-pressed={currentLanguage.startsWith('pt')}
      >
        {t('language.pt')}
      </button>
      <button
        onClick={() => changeLanguage('en')}
        disabled={currentLanguage === 'en'}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
          currentLanguage === 'en'
            ? 'bg-vinifero-purple text-white cursor-default'
            : 'bg-transparent text-soft-graphite hover:bg-velvet-gray/50'
        }`}
        aria-pressed={currentLanguage === 'en'}
      >
        {t('language.en')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;