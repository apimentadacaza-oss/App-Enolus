
import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '../types';

const STORAGE_KEY = 'enolus_user_progress';

const getInitialProgress = (): UserProgress => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : { xp: 0, achievements: [], completedLessons: [] };
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return { xp: 0, achievements: [], completedLessons: [] };
  }
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

  return { progress, addXp, addAchievement, completeLesson };
};
