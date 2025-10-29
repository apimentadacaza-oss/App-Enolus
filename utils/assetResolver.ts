import textLesson1 from '../data/texts/1_oque-e-vinho';

// A map to hold the paths to media assets.
// These paths are relative to the public directory.
const mediaMap: Record<string, string> = {
  '1_oque-e-vinho:audio': './data/trilhas/nivel1/modulo1/lessons/1_oque-e-vinho/audio.mp3',
};

// A map to hold text content imported as modules.
const textMap: Record<string, string> = {
    '1_oque-e-vinho': textLesson1,
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
 * Resolves the text content for a given lesson.
 * @param lessonId The ID of the lesson.
 * @returns The lesson's text content as a string, or null if not found.
 */
export const resolveText = (lessonId: string): string | null => {
    return textMap[lessonId] || null;
};
