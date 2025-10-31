import React, { useState, useCallback, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ExplorePage from './pages/Explore';
import TracksPage from './pages/Tracks';
import QuizPage from './pages/Quiz';
import EncyclopediaPage from './pages/Encyclopedia';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import WelcomeScreen from './components/WelcomeScreen';
import { useUserProgress } from './hooks/useUserProgress';
import type { Tab } from './types';

const WELCOME_KEY = 'enolus_has_seen_welcome';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  
  const { 
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
  } = useUserProgress();

  useEffect(() => {
    try {
      const hasSeenWelcome = window.localStorage.getItem(WELCOME_KEY);
      if (hasSeenWelcome) {
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Could not read from localStorage', error);
      setShowWelcome(false);
    }
  }, []);

  const handleStartJourney = () => {
    try {
      window.localStorage.setItem(WELCOME_KEY, 'true');
    } catch (error) {
       console.error('Could not write to localStorage', error);
    }
    setShowWelcome(false);
  };
  
  const handleSelectFavoriteArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setActiveTab('encyclopedia');
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExplorePage />;
      case 'tracks':
        return <TracksPage 
                  progress={progress} 
                  addXp={addXp} 
                  addAchievement={addAchievement} 
                  completeLesson={completeLesson} 
                  isLessonCompleted={isLessonCompleted}
                  isActivityCompleted={isActivityCompleted}
                  completeActivity={completeActivity}
                  setCurrentLessonId={setCurrentLessonId}
                />;
      case 'quiz':
        return <QuizPage addXp={addXp} addAchievement={addAchievement} />;
      case 'encyclopedia':
        return <EncyclopediaPage 
                  isArticleFavorite={isArticleFavorite}
                  toggleFavoriteArticle={toggleFavoriteArticle}
                  selectedSlug={selectedArticleSlug}
                  setSelectedSlug={setSelectedArticleSlug}
                />;
      case 'profile':
        return <ProfilePage 
                  progress={progress} 
                  addXp={addXp} 
                  addAchievement={addAchievement} 
                  onSelectFavorite={handleSelectFavoriteArticle}
                />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ExplorePage />;
    }
  };
  
  const handleTabChange = useCallback((tab: Tab) => {
      if (tab !== 'encyclopedia') {
        setSelectedArticleSlug(null);
      }
      setActiveTab(tab);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStartJourney} />;
  }

  return (
    <div className="bg-champagne-light font-sans text-soft-graphite min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 sm:p-6 pb-[104px]">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;