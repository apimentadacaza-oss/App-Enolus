import i18n from './i18n';
import { STRINGS } from './strings';

export function getLocale(): 'pt-BR' | 'en' {
  const loc = i18n.language.toLowerCase();
  return loc.startsWith('en') ? 'en' : 'pt-BR';
}

export function tLessonTitle(lessonId: string): string {
  const locale = getLocale();

  const lessonsForLocale = STRINGS[locale].lessons;
  // Use a type assertion after a check for safety and to satisfy TS
  if (Object.prototype.hasOwnProperty.call(lessonsForLocale, lessonId)) {
    return lessonsForLocale[lessonId as keyof typeof lessonsForLocale];
  }

  const lessonsForFallback = STRINGS['pt-BR'].lessons;
  if (Object.prototype.hasOwnProperty.call(lessonsForFallback, lessonId)) {
    return lessonsForFallback[lessonId as keyof typeof lessonsForFallback];
  }

  return lessonId;
}
