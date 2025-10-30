
import React from 'react';
import type { Tab } from '../types';
import { ExploreIcon, TracksIcon, QuizIcon, EncyclopediaIcon, ProfileIcon } from './icons/NavIcons';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'explore', label: 'Início', icon: ExploreIcon },
  { id: 'tracks', label: 'Trilhas', icon: TracksIcon },
  { id: 'quiz', label: 'Quiz', icon: QuizIcon },
  { id: 'encyclopedia', label: 'Enciclopédia', icon: EncyclopediaIcon },
  { id: 'profile', label: 'Perfil', icon: ProfileIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-velvet-gray z-30">
      <nav className="flex justify-around items-center max-w-2xl mx-auto h-[72px]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ease-in-out ${
              activeTab === item.id ? 'text-vinifero-purple' : 'text-velvet-gray'
            }`}
          >
            <item.icon className={`w-6 h-6 mb-1 ${activeTab === item.id && 'fill-aged-gold'}`} />
            <span className={`text-xs font-semibold ${
              activeTab === item.id ? 'text-vinifero-purple' : 'text-gray-500'
            }`}>{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;