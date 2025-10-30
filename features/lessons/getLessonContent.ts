import { TFunction } from 'i18next';

export type LessonSection = { heading: string; paragraphs: string[] };
export type LessonContent = { title: string; sections: LessonSection[] };

export function getWhatIsWine(t: TFunction<'lessons', undefined>): LessonContent {
  const title = t('what_is_wine.title');
  const sections = t('what_is_wine.sections', { returnObjects: true }) as LessonSection[];
  return { title, sections: Array.isArray(sections) ? sections : [] };
}
