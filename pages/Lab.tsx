import React, { useState, useEffect, useRef } from 'react';
import './lab.css';
import { WineGlassIcon } from '../components/icons/NavIcons';

// --- Grape Particles Component ---
const GrapeParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isInitialized) return;
    
    const PARTICLE_COUNT = 35;
    const COLORS = ['#51324E', '#C6A664', '#DAD1CA', '#a17a4a'];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 8 + 2; // size between 2px and 10px
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`; // 10-25s duration
      particle.style.animationDelay = `-${Math.random() * 15}s`; // start at random points
      
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }
    setIsInitialized(true);

  }, [isInitialized]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const REPULSION_RADIUS = 80;
      const REPULSION_STRENGTH = 1.5;

      particlesRef.current.forEach(particle => {
        const pX = particle.offsetLeft + particle.offsetWidth / 2;
        const pY = particle.offsetTop + particle.offsetHeight / 2;

        const dx = mouseX - pX;
        const dy = mouseY - pY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < REPULSION_RADIUS) {
          const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
          const moveX = dx / distance * -force * REPULSION_STRENGTH * 20;
          const moveY = dy / distance * -force * REPULSION_STRENGTH * 20;
          particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          particle.style.transform = 'translate(0, 0)';
        }
      });
    };
    
    const handleMouseLeave = () => {
        particlesRef.current.forEach(p => p.style.transform = 'translate(0,0)');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isInitialized]);

  return <div ref={containerRef} className="grape-particles-container"></div>;
};

// --- Wine Awakening Component ---
const WineAwakening = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [sceneKey, setSceneKey] = useState(0);
    const holdTimeoutRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Cleanup old particles on reset
        particlesRef.current.forEach(p => p.remove());
        particlesRef.current = [];

        // Create particles
        const PARTICLE_COUNT = 25;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = document.createElement('div');
            p.className = 'awakening-particle';
            const size = Math.random() * 3 + 1;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${50 + (Math.random() - 0.5) * 5}%`;
            p.style.top = `${50 + (Math.random() - 0.5) * 5}%`;
            p.style.setProperty('--orbit-radius', `${Math.random() * 100 + 40}px`);
            p.style.setProperty('--orbit-duration', `${Math.random() * 20 + 15}s`);
            p.style.setProperty('--orbit-delay', `-${Math.random() * 35}s`);
            p.style.setProperty('--rise-duration', `${Math.random() * 10 + 10}s`);
            container.appendChild(p);
            particlesRef.current.push(p);
        }
    }, [sceneKey]); // Rerun on scene reset

    const handleInteractionStart = () => {
        holdTimeoutRef.current = window.setTimeout(() => {
            setShowMessage(true);
        }, 2000);
    };

    const handleInteractionEnd = () => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        setShowMessage(false);
    };

    const handleInteractionMove = (clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const touchX = clientX - rect.left;
        const touchY = clientY - rect.top;

        particlesRef.current.forEach(p => {
            const pRect = p.getBoundingClientRect();
            const pX = pRect.left - rect.left + pRect.width / 2;
            const pY = pRect.top - rect.top + pRect.height / 2;
            const dx = pX - touchX;
            const dy = pY - touchY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const radius = 60;
            if (dist < radius) {
                const force = (radius - dist) / radius;
                const moveX = dx / dist * force * 30;
                const moveY = dy / dist * force * 30;
                p.style.setProperty('--tx', `${moveX}px`);
                p.style.setProperty('--ty', `${moveY}px`);
                p.style.filter = 'brightness(1.8)';
            } else {
                p.style.setProperty('--tx', '0px');
                p.style.setProperty('--ty', '0px');
                p.style.filter = 'brightness(1)';
            }
        });
    };

    const resetInteraction = () => {
         particlesRef.current.forEach(p => {
            p.style.setProperty('--tx', '0px');
            p.style.setProperty('--ty', '0px');
            p.style.filter = 'brightness(1)';
        });
    }

    const resetScene = () => {
        setShowMessage(false);
        setSceneKey(prev => prev + 1);
    };

    return (
        <div 
            ref={containerRef}
            className="awakening-container"
            key={sceneKey}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
            onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY)}
            onMouseOut={resetInteraction}
        >
            <div className="vortex-shape" />
            <div className="vortex-shape" style={{animationDelay: '-5s', transform: 'scale(0.8)', opacity: 0.6}} />
            <div className="bokeh-lights">
                <div className="bokeh-light" style={{ top: '15%', left: '20%', animationDelay: '-1s' }} />
                <div className="bokeh-light" style={{ top: '60%', left: '80%', animationDelay: '-3s', transform: 'scale(1.5)' }} />
                <div className="bokeh-light" style={{ top: '80%', left: '10%', animationDelay: '-5s', transform: 'scale(0.8)' }} />
                <div className="bokeh-light" style={{ top: '30%', left: '70%', animationDelay: '-2s' }} />
            </div>
            {showMessage && (
                <div className="awakening-message">
                    O vinho desperta. E com ele, o conhecimento.
                </div>
            )}
            <button onClick={resetScene} className="awakening-reset-btn">
                Entrar na Experiência Enolus
            </button>
        </div>
    );
};

// --- Earth and Fire Fusion Component ---
const EarthAndFireFusion = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [sceneKey, setSceneKey] = useState(Date.now());
    const containerRef = useRef<HTMLDivElement>(null);
    const bubblesRef = useRef<Set<HTMLDivElement>>(new Set());
    const holdTimeoutRef = useRef<number | null>(null);
    const audioRef = useRef<{
        ctx: AudioContext;
        masterGain: GainNode;
        hum: OscillatorNode;
        isInitialized: boolean;
    } | null>(null);

    const initAudio = () => {
        if (audioRef.current && audioRef.current.ctx.state !== 'closed') return;
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);

        const hum = ctx.createOscillator();
        hum.type = 'sine';
        hum.frequency.setValueAtTime(40, ctx.currentTime);
        hum.connect(masterGain);
        hum.start();

        audioRef.current = { ctx, masterGain, hum, isInitialized: true };
    };

    const playBubbleSound = () => {
        if (!audioRef.current) return;
        const { ctx, masterGain } = audioRef.current;
        const bubbleGain = ctx.createGain();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
        bubbleGain.gain.setValueAtTime(0, ctx.currentTime);
        bubbleGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
        bubbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.connect(bubbleGain).connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    };

    const createBubble = (container: HTMLDivElement) => {
        const bubble = document.createElement('div');
        bubble.className = 'fusion-bubble';
        const size = Math.random() * 30 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.setProperty('--duration', `${Math.random() * 8 + 6}s`);
        bubble.style.setProperty('--delay', `-${Math.random() * 14}s`);
        bubble.style.setProperty('--sway', `${(Math.random() - 0.5) * 80}px`);

        bubble.addEventListener('animationiteration', () => {
            bubble.style.left = `${Math.random() * 100}%`;
        });

        bubble.addEventListener('click', (e) => {
            e.stopPropagation();
            bubble.classList.add('exploding');
            playBubbleSound();
            bubble.addEventListener('animationend', () => {
                bubble.remove();
                bubblesRef.current.delete(bubble);
                if (containerRef.current) createBubble(containerRef.current);
            }, { once: true });
        });

        container.appendChild(bubble);
        bubblesRef.current.add(bubble);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        bubblesRef.current.forEach(b => b.remove());
        bubblesRef.current.clear();

        for (let i = 0; i < 20; i++) {
            createBubble(container);
        }

        return () => {
            if (audioRef.current && audioRef.current.ctx.state === 'running') {
                audioRef.current.ctx.close();
                audioRef.current = null;
            }
        };
    }, [sceneKey]);

    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!audioRef.current) initAudio();
        audioRef.current?.ctx.resume();
        audioRef.current?.masterGain.gain.linearRampToValueAtTime(0.1, audioRef.current.ctx.currentTime + 0.5);

        holdTimeoutRef.current = window.setTimeout(() => {
            setShowMessage(true);
        }, 2000);
    };

    const handleInteractionEnd = () => {
        if (audioRef.current) {
            audioRef.current.masterGain.gain.linearRampToValueAtTime(0, audioRef.current.ctx.currentTime + 0.5);
        }
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        setShowMessage(false);
    };

    const resetScene = () => {
        setShowMessage(false);
        setSceneKey(Date.now());
    };

    return (
        <div
            ref={containerRef}
            className="earth-fire-container"
            key={sceneKey}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
        >
            <div className="heat-distortion-layer" />
            {showMessage && (
                <div className="fusion-message">
                    A terra ferve. O vinho nasce.
                </div>
            )}
            <button onClick={(e) => { e.stopPropagation(); resetScene(); }} className="fusion-reset-btn">
                Observar a Transformação
            </button>
        </div>
    );
};

// --- Terroir Wind Component ---
const TerroirWind = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [sceneKey, setSceneKey] = useState(Date.now());
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const holdTimeoutRef = useRef<number | null>(null);
    const lastPos = useRef({ x: 0, y: 0 });
    const isInteracting = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        particlesRef.current.forEach(p => p.remove());
        particlesRef.current = [];

        const PARTICLE_COUNT = 30;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = document.createElement('div');
            const type = Math.floor(Math.random() * 3);
            p.className = `terroir-particle p-type-${type}`;
            p.style.left = `${-10 + Math.random() * 120}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDuration = `${Math.random() * 10 + 10}s`;
            p.style.animationDelay = `-${Math.random() * 20}s`;
            container.appendChild(p);
            particlesRef.current.push(p);
        }
    }, [sceneKey]);

    const handleInteractionStart = (clientX: number, clientY: number) => {
        isInteracting.current = true;
        lastPos.current = { x: clientX, y: clientY };
        holdTimeoutRef.current = window.setTimeout(() => {
            setShowMessage(true);
        }, 2000);
    };

    const handleInteractionEnd = () => {
        isInteracting.current = false;
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        setShowMessage(false);
        particlesRef.current.forEach(p => {
            p.style.transform = ''; // Reset transform to let CSS animation take over
        });
    };

    const handleInteractionMove = (clientX: number, clientY: number) => {
        if (!isInteracting.current || !containerRef.current) return;

        const dx = clientX - lastPos.current.x;
        const dy = clientY - lastPos.current.y;
        lastPos.current = { x: clientX, y: clientY };

        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = clientX - rect.left;
        const cursorY = clientY - rect.top;

        particlesRef.current.forEach(p => {
            const pRect = p.getBoundingClientRect();
            const pX = pRect.left - rect.left + pRect.width / 2;
            const pY = pRect.top - rect.top + pRect.height / 2;

            const dist = Math.hypot(cursorX - pX, cursorY - pY);
            const INTERACTION_RADIUS = 120;

            if (dist < INTERACTION_RADIUS) {
                const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
                // Get the current transform from the animation
                const computedStyle = window.getComputedStyle(p);
                const matrix = new DOMMatrix(computedStyle.transform);
                // Apply the gust of wind from drag
                const newX = matrix.e + dx * force * 2;
                const newY = matrix.f + dy * force * 2;
                // We directly set transform to override the animation for a moment
                p.style.transform = `translate(${newX}px, ${newY}px) rotate(${matrix.a}, ${matrix.b})`;
            }
        });
    };

    const resetScene = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMessage(false);
        setSceneKey(Date.now());
    };

    return (
        <div
            ref={containerRef}
            className="terroir-wind-container"
            key={sceneKey}
            onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY)}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleInteractionEnd}
            onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
            onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY)}
        >
            <div className="terroir-fog" />
            <div className="terroir-fog" style={{ animationDelay: '-10s', opacity: 0.6, animationDuration: '45s' }} />
            <div className="terroir-light-beam" />
            {showMessage && (
                <div className="terroir-message">
                    Toda videira respira. Cada sopro guarda uma origem.
                </div>
            )}
            <button onClick={resetScene} className="terroir-reset-btn">
                Sentir o Vento do Terroir
            </button>
        </div>
    );
};

// --- Aroma Birth Component ---
const AromaBirth = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [sceneKey, setSceneKey] = useState(Date.now());
    const containerRef = useRef<HTMLDivElement>(null);
    const holdTimeoutRef = useRef<number | null>(null);
    const audioRef = useRef<{
        ctx: AudioContext;
        masterGain: GainNode;
        isInitialized: boolean;
    } | null>(null);

    const initAudio = () => {
        if (audioRef.current?.isInitialized) {
            audioRef.current.ctx.resume();
            return;
        };
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(120, ctx.currentTime);
        osc1.connect(masterGain);
        osc1.start();
        
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(240, ctx.currentTime);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.value = 0.5;
        osc2.connect(osc2Gain).connect(masterGain);
        osc2.start();

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(5, ctx.currentTime);
        lfo.connect(lfoGain).connect(osc2.frequency);
        lfo.start();

        audioRef.current = { ctx, masterGain, isInitialized: true };
    };
    
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // Clear previous elements
        Array.from(container.children).forEach(child => {
            const element = child as Element;
            if (element.classList.contains('aroma-wave') || element.classList.contains('aroma-particle')) {
                element.remove();
            }
        });

        // Create waves
        for (let i = 0; i < 5; i++) {
            const wave = document.createElement('div');
            wave.className = 'aroma-wave';
            wave.style.left = `${10 + i * 20}%`;
            wave.style.animationDelay = `-${i * 1.5}s`;
            container.appendChild(wave);
        }

        // Create particles
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'aroma-particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.bottom = `-10%`;
            p.style.animationDuration = `${Math.random() * 15 + 10}s`;
            p.style.animationDelay = `-${Math.random() * 25}s`;
            container.appendChild(p);
        }

    }, [sceneKey]);
    
    useEffect(() => {
        return () => {
            if (audioRef.current && audioRef.current.ctx.state === 'running') {
                audioRef.current.ctx.close();
            }
        };
    }, []);

    const handleInteractionStart = () => {
        initAudio();
        audioRef.current?.masterGain.gain.linearRampToValueAtTime(0.1, audioRef.current.ctx.currentTime + 1);
        containerRef.current?.classList.add('is-interacting');
        holdTimeoutRef.current = window.setTimeout(() => setShowMessage(true), 2000);
    };
    
    const handleInteractionEnd = () => {
        audioRef.current?.masterGain.gain.linearRampToValueAtTime(0, audioRef.current.ctx.currentTime + 1);
        containerRef.current?.classList.remove('is-interacting');
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        setShowMessage(false);
    };

    const handleInteractionMove = (clientX: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const cursorX = (clientX - rect.left) / rect.width;
        container.style.setProperty('--cursor-x', `${cursorX}`);
    };

    const resetScene = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMessage(false);
        setSceneKey(Date.now());
        initAudio(); // Also trigger audio on button click
        audioRef.current?.masterGain.gain.linearRampToValueAtTime(0.1, audioRef.current.ctx.currentTime + 0.5);
    };

    return (
        <div
            ref={containerRef}
            className="aroma-birth-container"
            key={sceneKey}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onMouseMove={(e) => handleInteractionMove(e.clientX)}
            onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX)}
        >
            <div className="aroma-light-beam" />
            {/* Waves and particles are created in useEffect */}
            {showMessage && (
                <div className="aroma-message">
                    O vinho fala. O ar traduz.
                </div>
            )}
            <button onClick={resetScene} className="aroma-reset-btn">
                Escutar o Aroma
            </button>
        </div>
    );
};

// --- Trail Breath Component ---
const TrailBreath = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const holdTimeoutRef = useRef<number | null>(null);
    const audioRef = useRef<{
        ctx: AudioContext;
        masterGain: GainNode;
        windGain: GainNode;
        isInitialized: boolean;
    } | null>(null);

    const initAudio = () => {
        if (audioRef.current?.isInitialized) {
            audioRef.current.ctx.resume();
            return;
        }
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(isMuted ? 0 : 0.1, ctx.currentTime);
        masterGain.connect(ctx.destination);

        // Harmonic notes
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(100, ctx.currentTime);
        osc1.connect(masterGain);
        osc1.start();

        // Wind sound
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 400;
        windFilter.Q.value = 8;
        
        const windGain = ctx.createGain();
        windGain.gain.value = 0.2;

        whiteNoise.connect(windFilter).connect(windGain).connect(masterGain);
        whiteNoise.start();
        
        audioRef.current = { ctx, masterGain, windGain, isInitialized: true };
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        Array.from(container.children).forEach(child => {
            const el = child as Element;
            if (el.classList.contains('trail-particle-wrapper') || el.classList.contains('trail-fog')) {
                el.remove();
            }
        });
        particlesRef.current = [];
        
        // Particles
        for (let i = 0; i < 25; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'trail-particle-wrapper';
            const core = document.createElement('div');
            core.className = 'trail-particle-core';
            wrapper.appendChild(core);

            const duration = Math.random() * 20 + 15;
            const zPos = (Math.random() - 0.5) * 250;
            wrapper.style.animationDuration = `${duration}s`;
            wrapper.style.animationDelay = `-${Math.random() * duration}s`;
            wrapper.style.setProperty('--z', `${zPos}px`);

            container.appendChild(wrapper);
            particlesRef.current.push(core);
        }

        // Fog layers
        for (let i = 0; i < 2; i++) {
            const fog = document.createElement('div');
            fog.className = 'trail-fog';
            fog.style.animationDuration = `${30 + i * 15}s`;
            fog.style.opacity = `${0.6 - i * 0.2}`;
            container.appendChild(fog);
        }
    }, []);
    
    useEffect(() => {
        return () => audioRef.current?.ctx.close();
    }, []);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current?.isInitialized) initAudio();
        
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        
        if (audioRef.current) {
            const newGain = newMutedState ? 0 : 0.1;
            audioRef.current.masterGain.gain.linearRampToValueAtTime(newGain, audioRef.current.ctx.currentTime + 0.5);
        }
    };
    
    const handleInteractionStart = () => {
        holdTimeoutRef.current = window.setTimeout(() => setShowMessage(true), 2000);
    };

    const handleInteractionEnd = () => {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        setShowMessage(false);
    };

    const handleInteractionMove = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const scrollDir = (mouseX / rect.width - 0.5);
        containerRef.current.style.setProperty('--scroll-dir', `${scrollDir}`);

        const INTERACTION_RADIUS = 100;
        particlesRef.current.forEach(core => {
            const wrapper = core.parentElement as HTMLDivElement;
            const pX = wrapper.offsetLeft + wrapper.offsetWidth / 2;
            const pY = wrapper.offsetTop + wrapper.offsetHeight / 2;
            const dist = Math.hypot(mouseX - pX, mouseY - pY);

            const zMove = dist < INTERACTION_RADIUS
              ? ((INTERACTION_RADIUS - dist) / INTERACTION_RADIUS) * 80
              : 0;
            
            core.style.transform = `translateZ(${zMove}px)`;
        });
    };

    return (
        <div
            ref={containerRef}
            className="trail-breath-container"
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
            onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY)}
        >
            {/* Particles and fog are created in useEffect */}
            {showMessage && (
                <div className="trail-message">
                    A jornada não é o destino. É o que desperta em você durante o caminho.
                </div>
            )}
            <button onClick={toggleMute} className="trail-mute-btn" aria-label={isMuted ? "Ativar som" : "Silenciar"}>
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
};

// --- Main Lab Component ---
export default function Lab() {
  const [animationKey, setAnimationKey] = useState(0);

  return (
    <div className="lab-scope">
      <header className="lab-header">
        <h1>Enolus • Lab de UI</h1>
        <p>Espaço isolado para testes visuais e de interação.</p>
      </header>

      <section className="lab-grid">
        <div className="lab-card">
          <h3>Tipografia e Botões</h3>
          <p>Testes de hierarquia e feedback visual.</p>
          <button className="lab-btn">Botão Padrão</button>
          <button className="lab-btn ghost">Fantasma</button>
        </div>

        <div className="lab-card">
          <h3>Sombras e Profundidade</h3>
          <p>Hover e micro-interações.</p>
          <div className="lab-box hoverable">Passe o mouse</div>
        </div>

        <div className="lab-card color-palette-card">
          <h3>Painel de Cores Temáticas</h3>
          <p>Teste de contraste e legibilidade da paleta.</p>
          <div className="palette-grid">
            <div className="color-swatch" style={{ backgroundColor: 'var(--lab-brand)' }}>
              <div className="color-info">
                <strong>Vinho Púrpura</strong>
                <span>#51324E</span>
              </div>
              <div className="contrast-test">
                <p style={{ color: 'white' }}>Texto Branco (Legível)</p>
                <p style={{ color: 'var(--lab-ink)' }}>Texto Preto (Ilegível)</p>
              </div>
            </div>
            <div className="color-swatch" style={{ backgroundColor: 'var(--lab-accent)' }}>
              <div className="color-info text-dark">
                <strong>Ouro Envelhecido</strong>
                <span>#C6A664</span>
              </div>
              <div className="contrast-test">
                <p style={{ color: 'white' }}>Texto Branco (Ok)</p>
                <p style={{ color: 'var(--lab-ink)' }}>Texto Preto (Legível)</p>
              </div>
            </div>
            <div className="color-swatch" style={{ backgroundColor: 'var(--lab-bg)' }}>
              <div className="color-info text-dark">
                <strong>Creme Champagne</strong>
                <span>#F4EFEA</span>
              </div>
              <div className="contrast-test">
                <p style={{ color: 'white' }}>Texto Branco (Ilegível)</p>
                <p style={{ color: 'var(--lab-ink)' }}>Texto Preto (Legível)</p>
              </div>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--lab-muted)' }}>
               <div className="color-info text-dark">
                <strong>Branco Puro</strong>
                <span>#FFFFFF</span>
              </div>
              <div className="contrast-test">
                <p style={{ color: 'white' }}>Texto Branco (Ilegível)</p>
                <p style={{ color: 'var(--lab-ink)' }}>Texto Preto (Legível)</p>
              </div>
            </div>
            <div className="color-swatch" style={{ backgroundColor: 'var(--lab-ink)' }}>
               <div className="color-info">
                <strong>Grafite Suave</strong>
                <span>#2C2C2C</span>
              </div>
              <div className="contrast-test">
                <p style={{ color: 'white' }}>Texto Branco (Legível)</p>
                <p style={{ color: 'var(--lab-ink)' }}>Texto Preto (Ilegível)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lab-card wine-awakening-card">
            <h3>O Despertar do Vinho</h3>
            <p>Um ambiente sensorial com animações fluidas e interação sutil.</p>
            <WineAwakening />
        </div>

        <div className="lab-card earth-fire-card">
            <h3>A Fusão da Terra e do Fogo</h3>
            <p>Símbolo da transformação do vinho, com calor e vida emergente.</p>
            <EarthAndFireFusion />
        </div>

        <div className="lab-card terroir-wind-card">
            <h3>O Sopro do Terroir</h3>
            <p>Cena poética que simula o vento atravessando um vinhedo.</p>
            <TerroirWind />
        </div>

        <div className="lab-card conceptual-road-card">
          <h3>Estrada Conceitual</h3>
          <p>Teste de linha do tempo com marcadores interativos e animações.</p>
          <div className="conceptual-road-container">
            <div className="conceptual-road-line"></div>
            <div className="road-marker" style={{ left: '15%' }} role="button" tabIndex={0} aria-label="Marcador da estrada"></div>
            <div className="road-marker" style={{ left: '35%' }} role="button" tabIndex={0} aria-label="Marcador da estrada"></div>
            <div className="road-marker" style={{ left: '55%' }} role="button" tabIndex={0} aria-label="Marcador da estrada"></div>
            <div className="road-marker" style={{ left: '75%' }} role="button" tabIndex={0} aria-label="Marcador da estrada"></div>
            <button className="road-end-btn">Ir até o fim da estrada</button>
          </div>
        </div>
        
        <div className="lab-card aroma-birth-card">
            <h3>O Nascimento do Aroma</h3>
            <p>Experiência sensorial que representa o vinho liberando seus aromas.</p>
            <AromaBirth />
        </div>
        
        <div className="lab-card trail-breath-card">
            <h3>O Sopro das Trilhas</h3>
            <p>Cenário vivo e meditativo para o fundo das trilhas de aprendizado.</p>
            <TrailBreath />
        </div>

        <div className="lab-card micro-animations-card">
          <h3>Microanimações de Transição</h3>
          <p>Teste de movimentos sutis para feedback de interação.</p>
          <div className="anim-showcase" key={animationKey}>
            <div className="anim-item anim-fade-in">Fade In</div>
            <div className="anim-item anim-slide-in">Slide In</div>
            <div className="anim-item anim-pulse-wrapper"><div className="lab-pulse" /></div>
            <button className="anim-item anim-tilt">Tilt Me</button>
          </div>
          <button onClick={() => setAnimationKey(k => k + 1)} className="lab-btn ghost" style={{ width: '100%', marginTop: '16px' }}>
            ▶️ Tocar Animações
          </button>
        </div>

        <div className="lab-card">
          <h3>Tipografia Dinâmica</h3>
          <p>Ritmo de leitura para aulas e missões.</p>
          <div className="typography-showcase">
            <h1 className="font-serif">Cabeçalho Principal (H1)</h1>
            <h2 className="font-serif">Seção Importante (H2)</h2>
            <h3 className="font-serif">Sub-seção (H3)</h3>
            <h4 className="font-serif">Detalhe Menor (H4)</h4>
            <p className="font-sans">
              Este é um parágrafo de corpo de texto, usando a fonte sans-serif para <strong>máxima legibilidade</strong> em textos longos. A fluidez da leitura é essencial para a experiência de aprendizado no Enolus.
            </p>
            <blockquote className="font-sans">
              "O vinho ensina, o tempo revela." Uma citação para destacar informações importantes ou frases inspiradoras.
            </blockquote>
          </div>
        </div>

        <div className="lab-card enolus-scene-card">
          <h3>Cena Enolus</h3>
          <p>Composição final simulando uma tela do app.</p>
          <div className="scene-container">
            <WineGlassIcon className="scene-icon" />
            <p className="scene-text">Deguste o conhecimento</p>
            <button className="lab-btn scene-btn">Explorar Trilhas</button>
          </div>
        </div>

        <div className="lab-card wine-flow-card">
          <h3>Fluxo de Vinho</h3>
          <p>Animação de fundo para evocar a fluidez do vinho na taça.</p>
          <div className="wine-flow-container">
            <div className="wine-flow-path"></div>
            <div className="wine-flow-path" style={{ animationDelay: '-4s', top: '50%', opacity: 0.6 }}></div>
            <div className="wine-flow-path" style={{ animationDelay: '-7s', top: '60%', opacity: 0.8 }}></div>
          </div>
        </div>

        <div className="lab-card grape-particles-card">
            <h3>Partículas de Uva</h3>
            <p>Movimento interativo que reage ao cursor, criando profundidade.</p>
            <GrapeParticles />
        </div>

        <div className="lab-card living-road-card">
            <h3>Estrada Viva</h3>
            <p>Animação de uma estrada pontilhada para simular progresso contínuo.</p>
            <div className="living-road-container">
                <div className="living-road-line"></div>
            </div>
        </div>

      </section>
    </div>
  );
}