import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Level, Module, Lesson, UserProgress, TrailNode, UnlockRule } from '../types';
import { resolveMedia, resolveText } from '../utils/assetResolver';
import { tLessonTitle } from '../i18n';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';

// Due to platform constraints, Lottie and Marked are loaded from CDN in index.html
declare const lottie: any;
declare const marked: any;

// --- SVG & LOTTIE ASSETS ---
const TrailMapSvg = () => (
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full object-cover">
    <path d="M 60 60 C 150 200, 250 -80, 340 90" stroke="#DAD1CA" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="10 10"/>
  </svg>
);

const LOTTIE_FOOTSTEPS_JSON = {"v":"5.5.7","fr":30,"ip":0,"op":60,"w":512,"h":512,"nm":"Footprints","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Shape Layer 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[344.249,256,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-14.25,50.5],[-14.25,30.25],[-11.25,30.25],[-11.25,17.75],[-7.5,17.75],[-7.5,8.75],[-3,8.75],[-3,-3.25],[1.5,-3.25],[1.5,11.25],[5.25,11.25],[5.25,20.5],[8.75,20.5],[8.75,32.75],[12.5,32.75]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.321568627451,0.203921568627,0.305882352941,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false}],"nm":"Shape 1","np":2,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":65,"st":0,"bm":0,"effect":{"ip":29,"op":60,"ef":[{"ty":5,"nm":"CC Bend It","np":6,"mn":"CC Bend It","ix":1,"en":1,"ef":[{"ty":0,"nm":"Bend","mn":"CC Bend It-0001","ix":1,"v":{"a":1,"k":[{"t":29,"s":[0],"e":[11.3],"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]}},{"t":44,"s":[11.3]}],"ix":1}},{"ty":0,"nm":"Start","mn":"CC Bend It-0002","ix":2,"v":{"a":0,"k":-2.4,"ix":2}},{"ty":0,"nm":"End","mn":"CC Bend It-0003","ix":3,"v":{"a":0,"k":56.6,"ix":3}},{"ty":3,"nm":"Render Prestart","mn":"CC Bend It-0004","ix":4,"v":{"a":0,"k":1,"ix":4}},{"ty":7,"nm":"Distort","mn":"CC Bend It-0005","ix":5,"v":{"a":0,"k":0,"ix":5}},{"ty":7,"nm":"Fill","mn":"CC Bend It-0006","ix":6,"v":{"a":0,"k":0,"ix":6}}]}]}},{"ddd":0,"ind":2,"ty":4,"nm":"Shape Layer 1","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[167.75,256,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[14.25,50.5],[14.25,30.25],[11.25,30.25],[11.25,17.75],[7.5,17.75],[7.5,8.75],[3,8.75],[3,-3.25],[-1.5,-3.25],[-1.5,11.25],[-5.25,11.25],[-5.25,20.5],[-8.75,20.5],[-8.75,32.75],[-12.5,32.75]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.321568627451,0.203921568627,0.305882352941,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false}],"nm":"Shape 1","np":2,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":65,"st":0,"bm":0,"effect":{"ip":0,"op":30,"ef":[{"ty":5,"nm":"CC Bend It","np":6,"mn":"CC Bend It","ix":1,"en":1,"ef":[{"ty":0,"nm":"Bend","mn":"CC Bend It-0001","ix":1,"v":{"a":1,"k":[{"t":0,"s":[0],"e":[11.3],"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]}},{"t":15,"s":[11.3]}],"ix":1}},{"ty":0,"nm":"Start","mn":"CC Bend It-0002","ix":2,"v":{"a":0,"k":-2.4,"ix":2}},{"ty":0,"nm":"End","mn":"CC Bend It-0003","ix":3,"v":{"a":0,"k":56.6,"ix":3}},{"ty":3,"nm":"Render Prestart","mn":"CC Bend It-0004","ix":4,"v":{"a":0,"k":1,"ix":4}},{"ty":7,"nm":"Distort","mn":"CC Bend It-0005","ix":5,"v":{"a":0,"k":0,"ix":5}},{"ty":7,"nm":"Fill","mn":"CC Bend It-0006","ix":6,"v":{"a":0,"k":0,"ix":6}}]}]}}]};

// --- PROPS INTERFACES ---
interface TracksPageProps {
  progress: UserProgress;
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isActivityCompleted: (activityId: string) => boolean;
  completeActivity: (activityId: string, lessonId: string, requiredActivities: string[]) => void;
  setCurrentLessonId: (lessonId: string | null) => void;
}

interface JourneyMapProps extends TracksPageProps {
    module: Module;
}

// --- MAIN PAGE COMPONENT ---
const TracksPage: React.FC<TracksPageProps> = (props) => {
  const { t } = useTranslation(['map', 'tracks']);
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
    if (props.progress.achievements.includes(LEVEL_1_ACHIEVEMENT) || levels.length === 0) {
      return;
    }

    const level1 = levels.find(l => l.id === 'level-1');
    if (!level1) return;

    const level1LessonIds = level1.modules.flatMap(m => m.lessons.map(l => l.id));
    const allLevel1LessonsCompleted = level1LessonIds.every(id => props.isLessonCompleted(id));

    if (allLevel1LessonsCompleted) {
      props.addAchievement(LEVEL_1_ACHIEVEMENT);
      alert('🎉 Conquista Desbloqueada: Aprendiz Enófilo!');
    }
  }, [props.progress.completedLessons, levels, props.addAchievement, props.progress.achievements, props.isLessonCompleted]);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(prev => prev === moduleId ? null : moduleId);
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevel(prev => prev === levelId ? null : levelId);
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full pt-20">
            <p className="text-soft-graphite/70 text-lg">{t('map:loading')}</p>
        </div>
    );
  }

  return (
    <div key={i18n.language} className="animate-fade-in space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-vinifero-purple">{t('tracks:title')}</h1>
        <p className="mt-1 text-lg text-soft-graphite/80">{t('tracks:subtitle')}</p>
      </header>

      {levels.map(level => (
        <div key={level.id} className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50">
          <button onClick={() => toggleLevel(level.id)} className="w-full text-left flex justify-between items-center">
            <div>
              <h2 className="font-serif text-2xl text-vinifero-purple">{level.id === 'level-1' ? t('tracks:level1.title') : level.title}</h2>
              <p className="text-soft-graphite/70 mt-1">{level.id === 'level-1' ? t('tracks:level1.subtitle') : level.description}</p>
            </div>
            <svg className={`w-8 h-8 transform transition-transform text-vinifero-purple ${expandedLevel === level.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        
          {expandedLevel === level.id && (
            <div className="mt-6 space-y-4 animate-fade-in">
              {level.modules.map((module: Module) => {
                if (module.id === 'module-1-1' && module.trail) {
                    return <JourneyMap key={module.id} module={module} {...props} />;
                }

                const completedLessonsInModule = module.lessons.filter(lesson => props.isLessonCompleted(lesson.id)).length;
                const totalLessonsInModule = module.lessons.length;
                const progressPercentage = totalLessonsInModule > 0 ? (completedLessonsInModule / totalLessonsInModule) * 100 : 0;
                
                return (
                <div key={module.id} className="border border-velvet-gray rounded-lg overflow-hidden">
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className="w-full text-left p-4 bg-champagne-light/50 hover:bg-velvet-gray/50 transition flex justify-between items-center"
                  >
                    <div className="flex-grow pr-4">
                      <h3 className="font-semibold text-lg text-vinifero-purple">{module.id === 'module-1-1' ? t('tracks:module1.title') : module.title}</h3>
                      <p className="text-sm text-soft-graphite/60 mb-2">{module.description}</p>

                      <div className="w-full">
                        <div className="flex justify-between items-center text-xs font-medium text-soft-graphite/70 mb-1">
                          <span className="font-semibold">{t('map:progress')}</span>
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
                        const isCompleted = props.isLessonCompleted(lesson.id);
                        return (
                          <li key={lesson.id}>
                            <button onClick={() => alert('Esta lição agora faz parte da Jornada Visual!')} className="w-full text-left flex items-center justify-between p-3 rounded-md hover:bg-champagne-light transition group">
                               <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${isCompleted ? 'bg-aged-gold' : 'bg-velvet-gray'}`}>
                                  {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                  <p className={`font-medium ${isCompleted ? 'text-soft-graphite/50 line-through' : 'text-soft-graphite'}`}>{tLessonTitle(lesson.id)}</p>
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


// --- JOURNEY MAP COMPONENTS ---

type LessonState = 'locked' | 'unlocked' | 'done';

const JourneyMap: React.FC<JourneyMapProps> = (props) => {
    const { module, progress, addXp, isLessonCompleted, isActivityCompleted, completeActivity, setCurrentLessonId } = props;
    const [lessonsMeta, setLessonsMeta] = useState<Record<string, Lesson>>({});
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const lottieRef = useRef<HTMLDivElement>(null);
    const anim = useRef<any>(null);
    const { t } = useTranslation(['map', 'tracks']);

    useEffect(() => {
        const metaMap = module.lessons.reduce((acc, lesson) => {
            acc[lesson.id] = lesson;
            return acc;
        }, {} as Record<string, Lesson>);
        setLessonsMeta(metaMap);
    }, [module.lessons]);

    useEffect(() => {
        if (lottieRef.current) {
            anim.current = lottie.loadAnimation({
                container: lottieRef.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: LOTTIE_FOOTSTEPS_JSON,
            });
        }
        return () => anim.current?.destroy();
    }, []);

    const getLessonState = useCallback((lessonId: string, rules: UnlockRule[], xp: number): LessonState => {
        if (isLessonCompleted(lessonId)) return 'done';
        const rule = rules.find(r => r.target === lessonId);
        if (!rule) return 'unlocked';
        if (!isLessonCompleted(rule.requires) || (rule.minXp && xp < rule.minXp)) {
            return 'locked';
        }
        return 'unlocked';
    }, [isLessonCompleted]);

    const handleNodeClick = (lesson: Lesson) => {
        setActiveLesson(lesson);
    };
    
    const handleActivityComplete = (lesson: Lesson, activityType: keyof NonNullable<Lesson['activities']>) => {
        const activityId = `${lesson.id}/${activityType}`;
        if (isActivityCompleted(activityId) || !lesson.activities) return;
        
        const xp = lesson.activities[activityType]?.xp ?? 0;
        addXp(xp);
        const requiredActivities = Object.keys(lesson.activities);
        completeActivity(activityId, lesson.id, requiredActivities);

        // Check if this completion finished the whole lesson
        const allActivitiesDone = requiredActivities.every(req => {
            const reqId = `${lesson.id}/${req}`;
            // The activity we just completed might not be in the progress state yet, so check it manually
            return isActivityCompleted(reqId) || req === activityType;
        });

        if(allActivitiesDone) {
            const currentNodeIndex = module.trail!.nodes.findIndex(n => n.id === lesson.id);
            const nextNode = module.trail!.nodes[currentNodeIndex + 1];
            if(nextNode) {
                setCurrentLessonId(nextNode.id);
            } else {
                setCurrentLessonId(null);
            }
        }
    };

    const lessonNodes = useMemo(() => {
        if (!module.trail) return [];
        return module.trail.nodes.map(node => {
            const lesson = lessonsMeta[node.id];
            if (!lesson) return null;
            const state = getLessonState(node.id, module.trail!.unlockRules, progress.xp);
            return { ...node, lesson, state };
        }).filter(Boolean);
    }, [module.trail, lessonsMeta, progress.xp, getLessonState]);
    
    const currentLessonNode = lessonNodes.find(n => n && n.id === progress.currentLessonId);

    return (
        <div className="border border-velvet-gray rounded-lg p-4 bg-champagne-light/50">
             <h3 className="font-semibold text-lg text-vinifero-purple mb-2">{module.id === 'module-1-1' ? t('tracks:module1.title') : module.title}</h3>
            <div className="relative w-full aspect-[4/3] max-w-xl mx-auto">
                <TrailMapSvg />
                {lessonNodes.map(node => (
                    node && <LessonNode key={node.id} node={node} onClick={() => handleNodeClick(node.lesson)} />
                ))}
                {currentLessonNode && (
                     <div
                        ref={lottieRef}
                        className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                        style={{ left: `${currentLessonNode.x}%`, top: `${currentLessonNode.y}%`, pointerEvents: 'none' }}
                     />
                )}
            </div>
            {activeLesson && (
                <LessonHubModal
                    lesson={activeLesson}
                    onClose={() => setActiveLesson(null)}
                    onActivityComplete={handleActivityComplete}
                    isActivityCompleted={isActivityCompleted}
                />
            )}
        </div>
    );
};

const LessonNode: React.FC<{ node: any; onClick: () => void | Promise<void> }> = ({ node, onClick }) => {
    const { t } = useTranslation('map');
    const isLocked = node.state === 'locked';
    let bgClass = 'bg-aged-gold/20 border-aged-gold';
    let textClass = 'text-aged-gold';
    if(node.state === 'done') {
        bgClass = 'bg-green-200 border-green-500';
        textClass = 'text-green-800';
    } else if (isLocked) {
        bgClass = 'bg-velvet-gray/50 border-velvet-gray';
        textClass = 'text-soft-graphite/50';
    }
    
    const title = tLessonTitle(node.lesson.id);

    return (
         <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
         >
            <button
                onClick={onClick}
                disabled={isLocked}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-center p-1 border-2 transition-transform duration-200 ${bgClass} ${!isLocked && 'hover:scale-110 active:scale-100'} ${node.lesson.id === node.progress?.currentLessonId ? 'journey-pulse' : ''}`}
                aria-label={isLocked ? t('lesson_locked', { title }) : t('open_lesson', { title })}
            >
                <span className="text-2xl">{node.state === 'done' ? '✔' : node.state === 'locked' ? '🔒' : node.lesson.icon}</span>
                <span className={`text-xs font-semibold leading-tight mt-1 ${textClass}`}>{title}</span>
            </button>
        </div>
    )
}

function stripLeadingMarkdownTitle(s: string | null | undefined): string {
    if (!s) return '';
    const lines = s.split(/\r?\n/);
    if (lines.length > 0 && /^\s*#\s+/.test(lines[0])) {
        lines.shift();
    }
    return lines.join('\n').trimStart();
}

const LessonHubModal = ({ lesson, onClose, onActivityComplete, isActivityCompleted }: { lesson: Lesson; onClose: () => void; onActivityComplete: (lesson: Lesson, activity: any) => void; isActivityCompleted: (activityId: string) => boolean; }) => {
    const { t } = useTranslation(['lesson_ui', 'map']);
    const [view, setView] = useState<'hub' | 'reader'>('hub');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleListenClick = () => {
        const audioUrl = resolveMedia(lesson.id, 'audio');
        if (!audioUrl) return;

        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
        } else {
            if (!audioRef.current) {
                audioRef.current = new Audio(audioUrl);
                audioRef.current.addEventListener('ended', () => {
                    onActivityComplete(lesson, 'listen');
                    setIsPlaying(false);
                });
                audioRef.current.addEventListener('pause', () => setIsPlaying(false));
                audioRef.current.addEventListener('play', () => setIsPlaying(true));
            }
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    };
    
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const ActivityCard = ({ type, icon, title }: { type: keyof NonNullable<Lesson['activities']>, icon: string, title: string }) => {
        if (!lesson.activities || !lesson.activities[type]) return null;

        const activity = lesson.activities[type]!;
        const activityId = `${lesson.id}/${type}`;
        const isDone = isActivityCompleted(activityId);

        let action = () => {};
        if (type === 'read') action = () => setView('reader');
        if (type === 'listen') action = handleListenClick;

        const xpTextKey = (type === 'read' || type === 'listen')
          ? `lesson_ui:actions.${type}_xp`
          : 'map:complete_to_earn_xp';

        return (
            <button
                onClick={action}
                disabled={isDone}
                className={`w-full flex items-center p-4 rounded-lg text-left transition-colors ${
                    isDone 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-white hover:bg-velvet-gray/30'
                }`}
                aria-label={`${title}: ${isDone ? t('map:completed') : t(xpTextKey as any, { xp: activity.xp })}`}
            >
                <span className="text-3xl mr-4">{icon}</span>
                <div className="flex-grow">
                    <p className="font-semibold text-lg text-vinifero-purple">{title}</p>
                    <p className={`text-sm ${isDone ? 'text-green-700' : 'text-aged-gold'}`}>
                        {isDone ? t('map:completed') : t(xpTextKey as any, { xp: activity.xp })}
                    </p>
                </div>
                {!isDone && <span className="text-2xl text-aged-gold">›</span>}
            </button>
        )
    }
    
    const readerContent = useMemo(() => {
        if (view !== 'reader') return { type: 'empty' as const, content: null };

        if (lesson.id === '1_oque-e-vinho') {
            const text = resolveText(lesson.id);
            return { type: 'pre-wrap' as const, content: text };
        }

        const rawMarkdown = lesson.activities?.read?.content;
        const bodyContent = stripLeadingMarkdownTitle(rawMarkdown);
        
        if (!bodyContent) {
            return { type: 'empty' as const, content: null };
        }
        
        return {
            type: 'html' as const,
            content: marked.parse(bodyContent),
        };
    }, [view, lesson, i18n.language]);
    
    const headerTitle = tLessonTitle(lesson.id);

    return ReactDOM.createPortal(
        <>
            <div className="lesson-hub-backdrop" onClick={onClose}></div>
            <div className="lesson-hub-container" onClick={onClose}>
                <div className="lesson-hub-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="drag-handle"></div>
                    
                    {view === 'hub' && (
                        <>
                            <header className="text-center mb-6">
                                <span className="text-5xl">{lesson.icon}</span>
                                <h2 className="font-serif text-3xl text-vinifero-purple mt-2">{headerTitle}</h2>
                                <p className="text-soft-graphite/70">{t('lesson_ui:subtitle')}</p>
                            </header>
                            <div className="space-y-3 mb-6">
                                <ActivityCard type="read" icon="📝" title={t('lesson_ui:actions.read')} />
                                <ActivityCard type="listen" icon="🎧" title={t('lesson_ui:actions.listen')} />
                                <ActivityCard type="watch" icon="▶️" title={t('map:watch')} />
                                <ActivityCard type="quiz" icon="❓" title={t('map:quiz')} />
                            </div>
                            <button onClick={onClose} className="w-full bg-vinifero-purple text-white font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 mt-auto">
                                {t('lesson_ui:actions.back')}
                            </button>
                        </>
                    )}

                    {view === 'reader' && (
                         <div className="flex flex-col flex-grow h-full">
                            <header className="flex items-center justify-between mb-4">
                               <button onClick={() => setView('hub')} className="text-vinifero-purple font-semibold flex items-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                 {t('map:back')}
                               </button>
                               <h2 className="font-serif text-xl text-vinifero-purple text-center flex-1 px-2 truncate">{headerTitle}</h2>
                               <div className="w-16"></div>
                            </header>
                            <div className="flex-grow overflow-y-auto pr-2 -mr-2 lesson-reader-view">
                               {readerContent.type === 'pre-wrap' && (
                                   <div className="prose max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
                                       {readerContent.content}
                                   </div>
                               )}
                               {readerContent.type === 'html' && readerContent.content && (
                                   <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: readerContent.content }} />
                               )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-velvet-gray">
                                <button
                                    onClick={() => {
                                        onActivityComplete(lesson, 'read');
                                        setView('hub');
                                    }}
                                    className="w-full bg-aged-gold text-white font-bold py-3 px-5 rounded-lg hover:bg-opacity-90"
                                >
                                    {t('map:mark_as_completed')}
                                </button>
                            </div>
                         </div>
                    )}

                </div>
            </div>
        </>,
        document.body
    );
};


export default TracksPage;