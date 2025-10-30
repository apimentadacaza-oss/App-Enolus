import textLesson1_pt from '../data/texts/1_oque-e-vinho';
import textLesson1_en from '../data/texts/en/1_what-is-wine';
import i18n from '../i18n/i18n';

// A map to hold the paths to media assets.
// These paths are relative to the public directory.
const mediaMap: Record<string, string> = {
  '1_oque-e-vinho:audio': './data/trilhas/nivel1/modulo1/lessons/1_oque-e-vinho/audio.mp3',
};

// A map to hold text content imported as modules, now with language support.
const textMap: Record<string, { [lang: string]: string }> = {
    '1_oque-e-vinho': {
        'pt-BR': textLesson1_pt,
        'en': textLesson1_en,
    },
};


/**
 * Resolves the URL for a given lesson's media activity.
 * @param lessonId The ID of the lesson (e.g., '1_oque-e-vinho').
 * @param kind The type of media ('audio' or 'video').
 * @returns The URL path to the media file, or null if it's not found.
 */
export const resolveMedia = (lessonId: string, kind: 'audio' | 'video'): string | null => {
  const key = `${lessonId}:${kind}`;
  return mediaMap[key] || null;
};

/**
 * Resolves the text content for a given lesson, respecting the current language.
 * This is used as a fallback when the i18n JSON content is not available or disabled.
 * @param lessonId The ID of the lesson.
 * @returns The lesson's text content as a string, or null if not found.
 */
export const resolveText = (lessonId: string): string | null => {
    const lessonContent = textMap[lessonId];
    if (!lessonContent) return null;

    const lang = i18n.language;
    if (lang === 'en' && lessonContent.en) {
        return lessonContent.en;
    }
    
    // Default/fallback to Portuguese
    return lessonContent['pt-BR'] || null;
};
