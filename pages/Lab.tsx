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

// --- Terroir Wind Component ---
const TerroirWind = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [sceneKey, setSceneKey] = useState(0);
    const holdTimeoutRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear previous elements on reset
        container.querySelectorAll('.terroir-leaf, .terroir-petal').forEach(el => el.remove());

        // Create new particles
        const PARTICLE_COUNT = 30;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const isLeaf = Math.random() > 0.4;
            const p = document.createElement('div');
            p.className = isLeaf ? 'terroir-leaf' : 'terroir-petal';
            p.style.top = `${Math.random() * 100}%`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.setProperty('--sway-amp', `${Math.random() * 30 + 10}px`);
            p.style.setProperty('--sway-speed', `${Math.random() * 4 + 3}s`);
            p.style.setProperty('--float-speed', `${Math.random() * 10 + 8}s`);
            p.style.setProperty('--float-delay', `-${Math.random() * 18}s`);
            p.style.setProperty('--spin-speed', `${Math.random() * 15 + 10}s`);
            p.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            container.appendChild(p);
        }
    }, [sceneKey]);

    const handleInteractionStart = (clientX: number, clientY: number) => {
        lastPos.current = { x: clientX, y: clientY };
        holdTimeoutRef.current = window.setTimeout(() => setShowMessage(true), 2000);
    };

    const handleInteractionEnd = () => {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        setShowMessage(false);
        containerRef.current?.style.setProperty('--wind-x', '0');
        containerRef.current?.style.setProperty('--wind-y', '0');
    };

    const handleInteractionMove = (clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return;

        const deltaX = clientX - lastPos.current.x;
        const deltaY = clientY - lastPos.current.y;
        lastPos.current = { x: clientX, y: clientY };

        const currentWindX = parseFloat(container.style.getPropertyValue('--wind-x')) || 0;
        const currentWindY = parseFloat(container.style.getPropertyValue('--wind-y')) || 0;
        
        const newWindX = currentWindX + deltaX;
        const newWindY = currentWindY + deltaY;

        container.style.setProperty('--wind-x', `${Math.max(-100, Math.min(100, newWindX))}`);
        container.style.setProperty('--wind-y', `${Math.max(-50, Math.min(50, newWindY))}`);
    };
    
    const resetScene = () => {
        setShowMessage(false);
        setSceneKey(prev => prev + 1);
    };

    return (
        <div
            ref={containerRef}
            className="terroir-container"
            key={sceneKey}
            onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY)}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleInteractionEnd}
            onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
            onTouchMove={(e) => {
                e.preventDefault();
                handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
        >
            <div className="terroir-light-beam" />
            <div className="terroir-fog" />
            <div className="terroir-fog" style={{animationDelay: '-10s', opacity: 0.5}} />
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
        
        <div className="lab-card terroir-wind-card">
            <h3>O Sopro do Terroir</h3>
            <p>Uma cena poética que simula o vento atravessando um vinhedo.</p>
            <TerroirWind />
        </div>

        <div className="lab-card wine-awakening-card">
            <h3>O Despertar do Vinho</h3>
            <p>Um ambiente sensorial com animações fluidas e interação sutil.</p>
            <WineAwakening />
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