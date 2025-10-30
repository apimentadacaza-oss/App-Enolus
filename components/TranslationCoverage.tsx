import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// This utility function flattens a nested object into a single-level object
// with dot-separated keys, allowing for an accurate key count.
const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return {};
  }
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Record<string, any>);
};

const TranslationCoverage: React.FC = () => {
  const { i18n, t } = useTranslation('settings');
  
  const namespaces = useMemo(() => [
    'home',
    'map',
    'quiz',
    'quiz_questions',
    'encyclopedia',
    'confraria'
  ].sort(), []);

  const coverageStats = useMemo(() => {
    const resources = i18n.options.resources;
    if (!resources || !resources.en || !resources['pt-BR']) {
      return [];
    }
    
    return namespaces.map(ns => {
      const enKeys = Object.keys(flattenObject(resources.en[ns] || {})).length;
      const ptKeys = Object.keys(flattenObject(resources['pt-BR'][ns] || {})).length;
      
      const percentage = enKeys > 0 ? Math.round((ptKeys / enKeys) * 100) : 100;

      return {
        namespace: ns.replace(/_/g, ' '),
        enKeys,
        ptKeys,
        percentage,
        isComplete: ptKeys >= enKeys,
      };
    });
  }, [i18n.options.resources, namespaces]);
  
  return (
    <div className="space-y-3">
      {coverageStats.map(stat => (
        <div key={stat.namespace} className="p-4 bg-champagne-light/60 rounded-lg border border-velvet-gray/40 flex items-center justify-between">
          <div>
            <p className="font-semibold capitalize text-vinifero-purple">
              {stat.isComplete ? '✅' : '⚠️'}
              <span className="ml-2">{stat.namespace}</span>
            </p>
            <p className="text-sm text-soft-graphite/70">
              {t('coverage.keys_translated', { ptKeys: stat.ptKeys, enKeys: stat.enKeys })}
            </p>
          </div>
          <div className={`font-bold text-lg ${stat.isComplete ? 'text-green-600' : 'text-orange-500'}`}>
            {stat.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranslationCoverage;