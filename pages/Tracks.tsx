import React, { useState, useEffect } from 'react';
import type { Level, Module, Lesson, UserProgress } from '../types';

interface TracksPageProps {
  progress: UserProgress;
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
  completeLesson: (lessonId: string) => void;
}

const TracksPage: React.FC<TracksPageProps> = ({ progress, addXp, addAchievement, completeLesson }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const [level1Res, level2Res, level3Res, level4Res, level5Res, level6Res] = await Promise.all([
          fetch('./data/level1.json'),
          fetch('./data/level2.json'),
          fetch('./data/level3.json'),
          fetch('./data/level4.json'),
          fetch('./data/level5.json'),
          fetch('./data/level6.json')
        ]);
        const [level1Data, level2Data, level3Data, level4Data, level5Data, level6Data] = await Promise.all([
          level1Res.json(),
          level2Res.json(),
          level3Res.json(),
          level4Res.json(),
          level5Res.json(),
          level6Res.json()
        ]);
        
        setLevels([level1Data, level2Data, level3Data, level4Data, level5Data, level6Data]);
        
        if (level1Data) {
            setExpandedLevel(level1Data.id);
            if (level1Data.modules && level1Data.modules.length > 0) {
                setExpandedModule(level1Data.modules[0].id);
            }
        }
      } catch (err) {
        console.error("Failed to fetch level data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLevels();
  }, []);

  useEffect(() => {
    const LEVEL_1_ACHIEVEMENT = 'Aprendiz Enófilo';
    if (progress.achievements.includes(LEVEL_1_ACHIEVEMENT) || levels.length === 0) {
      return;
    }

    const level1 = levels.find(l => l.id === 'level-1');
    if (!level1) return;

    const level1LessonIds = level1.modules.flatMap(m => m.lessons.map(l => l.id));
    const allLevel1LessonsCompleted = level1LessonIds.every(id => progress.completedLessons.includes(id));

    if (allLevel1LessonsCompleted) {
      addAchievement(LEVEL_1_ACHIEVEMENT);
      alert('🎉 Conquista Desbloqueada: Aprendiz Enófilo!');
    }
  }, [progress.completedLessons, levels, addAchievement, progress.achievements]);

  const handleLessonClick = (lesson: Lesson) => {
    if (!progress.completedLessons.includes(lesson.id)) {
      alert(`Lição "${lesson.title}" concluída!\n+${lesson.xp} XP`);
      addXp(lesson.xp);
      completeLesson(lesson.id);
    } else {
      alert(`Você já completou a lição "${lesson.title}".`);
    }
  };
  
  const toggleModule = (moduleId: string) => {
    setExpandedModule(prev => prev === moduleId ? null : moduleId);
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevel(prev => prev === levelId ? null : levelId);
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full pt-20">
            <p className="text-soft-graphite/70 text-lg">Carregando trilhas...</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-vinifero-purple">Trilhas de Aprendizado</h1>
        <p className="mt-1 text-lg text-soft-graphite/80">Siga os caminhos do conhecimento e torne-se um mestre.</p>
      </header>

      {levels.map(level => (
        <div key={level.id} className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
          <button onClick={() => toggleLevel(level.id)} className="w-full text-left flex justify-between items-center">
            <div>
              <h2 className="font-serif text-2xl text-vinifero-purple">{level.title}</h2>
              <p className="text-soft-graphite/70 mt-1">{level.description}</p>
            </div>
            <svg className={`w-8 h-8 transform transition-transform text-vinifero-purple ${expandedLevel === level.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        
          {expandedLevel === level.id && (
            <div className="mt-6 space-y-4 animate-fade-in">
              {level.modules.map((module: Module) => {
                const completedLessonsInModule = module.lessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length;
                const totalLessonsInModule = module.lessons.length;
                const progressPercentage = totalLessonsInModule > 0 ? (completedLessonsInModule / totalLessonsInModule) * 100 : 0;
                
                return (
                <div key={module.id} className="border border-velvet-gray rounded-lg overflow-hidden">
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className="w-full text-left p-4 bg-champagne-light/50 hover:bg-velvet-gray/50 transition flex justify-between items-center"
                  >
                    <div className="flex-grow pr-4">
                      <h3 className="font-semibold text-lg text-vinifero-purple">{module.title}</h3>
                      <p className="text-sm text-soft-graphite/60 mb-2">{module.description}</p>

                      <div className="w-full">
                        <div className="flex justify-between items-center text-xs font-medium text-soft-graphite/70 mb-1">
                          <span className="font-semibold">Progresso</span>
                          <span>{completedLessonsInModule} / {totalLessonsInModule}</span>
                        </div>
                        <div className="w-full bg-velvet-gray/50 rounded-full h-1.5">
                          <div 
                            className="bg-aged-gold h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <svg className={`w-6 h-6 transform transition-transform text-vinifero-purple flex-shrink-0 ${expandedModule === module.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedModule === module.id && (
                    <ul className="p-4 space-y-2">
                      {module.lessons.map((lesson: Lesson) => {
                        const isCompleted = progress.completedLessons.includes(lesson.id);
                        return (
                          <li key={lesson.id}>
                            <button onClick={() => handleLessonClick(lesson)} className="w-full text-left flex items-center justify-between p-3 rounded-md hover:bg-champagne-light transition group">
                               <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${isCompleted ? 'bg-aged-gold' : 'bg-velvet-gray'}`}>
                                  {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                  <p className={`font-medium ${isCompleted ? 'text-soft-graphite/50 line-through' : 'text-soft-graphite'}`}>{lesson.title}</p>
                                  <span className="text-xs text-aged-gold font-semibold">{lesson.xp} XP</span>
                                </div>
                              </div>
                              {!isCompleted && <span className="text-aged-gold opacity-0 group-hover:opacity-100 transition-opacity">▶</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )})}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TracksPage;