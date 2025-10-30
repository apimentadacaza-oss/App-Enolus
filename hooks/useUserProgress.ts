import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '../types';

const STORAGE_KEY = 'enolus_user_progress';

const getInitialProgress = (): UserProgress => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    const parsed = item ? JSON.parse(item) : {};
    return {
      xp: parsed.xp || 0,
      achievements: parsed.achievements || [],
      completedLessons: parsed.completedLessons || [],
      completedActivities: parsed.completedActivities || [],
      currentLessonId: parsed.currentLessonId || '1_oque-e-vinho',
      favoriteArticles: parsed.favoriteArticles || [],
    };
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return { xp: 0, achievements: [], completedLessons: [], completedActivities: [], currentLessonId: '1_oque-e-vinho', favoriteArticles: [] };
  }
};

const sanitizeProgressForStorage = (progress: UserProgress): UserProgress => ({
  xp: typeof progress.xp === 'number' ? progress.xp : 0,
  achievements: Array.isArray(progress.achievements) ? progress.achievements.filter(item => typeof item === 'string') : [],
  completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons.filter(item => typeof item === 'string') : [],
  completedActivities: Array.isArray(progress.completedActivities) ? progress.completedActivities.filter(item => typeof item === 'string') : [],
  currentLessonId: typeof progress.currentLessonId === 'string' ? progress.currentLessonId : null,
  favoriteArticles: Array.isArray(progress.favoriteArticles) ? progress.favoriteArticles.filter(item => typeof item === 'string') : [],
});


export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);

  useEffect(() => {
    try {
      const sanitizedProgress = sanitizeProgressForStorage(progress);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedProgress));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [progress]);

  const addXp = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const addAchievement = useCallback((achievement: string) => {
    setProgress(prev => {
      if (!prev.achievements.includes(achievement)) {
        return { ...prev, achievements: [...prev.achievements, achievement] };
      }
      return prev;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
     setProgress(prev => {
      if (!prev.completedLessons.includes(lessonId)) {
        return { ...prev, completedLessons: [...prev.completedLessons, lessonId] };
      }
      return prev;
    });
  }, []);
  
  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const isActivityCompleted = useCallback((activityId: string): boolean => {
    return progress.completedActivities.includes(activityId);
  }, [progress.completedActivities]);

  const completeActivity = useCallback((activityId: string, lessonId: string, requiredActivities: string[]) => {
    setProgress(prev => {
      const newActivities = prev.completedActivities.includes(activityId) 
        ? prev.completedActivities
        : [...prev.completedActivities, activityId];
      
      const updatedProgress = { ...prev, completedActivities: newActivities };

      const allDone = requiredActivities.every(req => newActivities.includes(`${lessonId}/${req}`));
      if (allDone && !updatedProgress.completedLessons.includes(lessonId)) {
        updatedProgress.completedLessons = [...updatedProgress.completedLessons, lessonId];
      }
      
      return updatedProgress;
    });
  }, []);

  const setCurrentLessonId = useCallback((lessonId: string | null) => {
    setProgress(prev => ({ ...prev, currentLessonId: lessonId }));
  }, []);

  const isArticleFavorite = useCallback((slug: string): boolean => {
    return progress.favoriteArticles.includes(slug);
  }, [progress.favoriteArticles]);

  const toggleFavoriteArticle = useCallback((slug: string) => {
    setProgress(prev => {
      const favorites = prev.favoriteArticles || [];
      const isFavorited = favorites.includes(slug);
      const newFavorites = isFavorited
        ? favorites.filter(s => s !== slug)
        : [...favorites, slug];
      return { ...prev, favoriteArticles: newFavorites };
    });
  }, []);

  return { 
    progress, 
    addXp, 
    addAchievement, 
    completeLesson, 
    isLessonCompleted,
    isActivityCompleted,
    completeActivity,
    setCurrentLessonId,
    isArticleFavorite,
    toggleFavoriteArticle,
  };
};