const STORAGE_KEY = 'enolus_i18n_lang';

/**
 * Normalizes a language code from the browser.
 * e.g., 'pt-br' or 'pt' becomes 'pt-BR'.
 * e.g., 'en-us' or 'en' becomes 'en'.
 * @param lang The language string from the browser.
 * @returns The normalized language code ('en' or 'pt-BR') or null.
 */
const normalizeLanguage = (lang: string): string | null => {
  if (!lang) return null;
  const normalized = lang.toLowerCase().split('-')[0];
  if (normalized === 'pt') {
    return 'pt-BR';
  }
  if (normalized === 'en') {
    return 'en';
  }
  return null;
};

/**
 * Detects the user's language based on a sequence of lookups:
 * 1. Tries to read the saved language from localStorage.
 * 2. If not found, uses the browser's language settings (`navigator.languages`).
 * 3. Returns 'pt-BR' as a final fallback.
 * @returns The detected language code ('en' or 'pt-BR').
 */
export const detectLanguage = (): string => {
  try {
    const storedLang = window.localStorage.getItem(STORAGE_KEY);
    if (storedLang && ['en', 'pt-BR'].includes(storedLang)) {
      return storedLang;
    }
  } catch (e) {
    console.error('Could not read language from localStorage', e);
  }
  
  // Use `navigator.languages` for a more robust check if available
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const normalized = normalizeLanguage(lang);
    if (normalized) {
      return normalized;
    }
  }

  return 'pt-BR'; // Fallback
};

/**
 * Saves the user's language choice to localStorage for persistence.
 * @param lng The language code to save ('en' or 'pt-BR').
 */
export const saveLanguage = (lng: string): void => {
  try {
    if (['en', 'pt-BR'].includes(lng)) {
      window.localStorage.setItem(STORAGE_KEY, lng);
    }
  } catch (e) {
    console.error('Could not save language to localStorage', e);
  }
};

/**
 * A helper function to get the currently detected or stored language.
 * After i18next is initialized, it's best to use `i18n.language` as the source of truth.
 * @returns The detected language code.
 */
export const getCurrentLanguage = (): string => {
  return detectLanguage();
};
