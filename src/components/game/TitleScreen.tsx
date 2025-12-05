import { useState, useEffect } from 'react';
import { audioManager, preloadDefaultSounds } from '@/lib/audio';
import digitalCityUrl from '@/assets/digital-city-bg.png';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen = ({ onStart }: TitleScreenProps) => {
  const [showStart, setShowStart] = useState(false);
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('playerName') ?? ''; } catch { return ''; }
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowStart(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Preload intro and start muted autoplay (will fade in on first gesture)
  useEffect(() => {
    try {
      preloadDefaultSounds();
      // attempt to play intro muted so browsers allow autoplay
      audioManager.playBgm('intro', { volume: 0, muted: true } as any);
      const enable = () => {
        audioManager.fadeInCurrentBgm(800, 0.85);
        window.removeEventListener('pointerdown', enable);
      };
      window.addEventListener('pointerdown', enable, { once: true });
      return () => window.removeEventListener('pointerdown', enable);
    } catch (e) {
      return;
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        onStart();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStart]);

  const handleStart = () => {
    try { localStorage.setItem('playerName', name.trim() || 'You'); } catch {}
    onStart();
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-visible py-8"
      style={{
        backgroundImage: `url(${digitalCityUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay (neutral) - use semi-transparent black so background gradient shows through */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content: centered card with image + info (responsive) */}
      <div className="relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-card/90 backdrop-blur-sm p-6 rounded-lg border-4 flex flex-col gap-4 items-stretch animate-float" style={{
          borderImage: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #eab308 100%) 1'
        }}>
          <div className="flex-1 flex flex-col items-start gap-4 p-2">
            <div>
              <h1 className="text-2xl font-pixel text-primary game-title leading-tight">
                The Code Quest
              </h1>
              <p className="mt-2 text-sm font-pixel text-foreground leading-relaxed">
                Welcome! This interactive story explores software freedom, repairable hardware, and practical
                ways to make technology last. Your choices shape what you learn and how your community benefits.
              </p>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-stretch gap-3 mt-2">
              <input
                aria-label="Player name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-3 py-2 text-xs font-pixel rounded-md bg-card border-2 text-foreground"
                style={{
                  borderImage: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #eab308 100%) 1'
                }}
              />

              <button
                onClick={handleStart}
                className="pixel-btn text-primary-foreground border-4 border-primary font-pixel text-sm px-6 py-2 w-full sm:w-auto font-bold"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #eab308 100%)',
                }}
              >
                ▶ START
              </button>
            </div>

            <div className="text-xs text-muted-foreground mt-1 font-pixel">
              Press SPACE or click to advance. Your name will appear in dialogues where appropriate.
            </div>
          </div>
        </div>
      </div>

      {/* Instruction*/}
      <div className="relative z-10 space-y-3 text-center mt-6 px-4 py-4 rounded-lg bg-black/40 backdrop-blur-sm border-2" style={{
        borderImage: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #eab308 100%) 1'
      }}>
        <p className="text-sm font-pixel text-primary font-bold tracking-wide">Press SPACE or click to begin</p>
        <p className="text-xs font-pixel text-primary/80 leading-relaxed">An educational adventure about software freedom</p>
        <p className="text-xs font-pixel text-primary/70 pt-2 border-t border-primary/30">
          Psst... there's a hidden game in the story, but you can access it{' '}
          <a
            href="https://gilded-sfogliatella-a7fe39.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            here
          </a>
        </p>
      </div>

      {/* Secret Game Hint */}
      <div className="relative z-10 mt-4 text-center">
      </div>

      {/* Legend */}
      

      {/* Scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
      />
    </div>
  );
};
