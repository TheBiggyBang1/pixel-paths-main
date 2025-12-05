import { useState } from 'react';
import { TitleScreen } from '@/components/game/TitleScreen';
import { GameUI } from '@/components/game/GameUI';

type GameState = 'title' | 'playing';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('title');

  const handleStart = () => {
    setGameState('playing');
  };

  const handleRestart = () => {
    setGameState('title');
  };

  return (
    <main className="min-h-screen">
      {gameState === 'title' && <TitleScreen onStart={handleStart} />}
      {gameState === 'playing' && <GameUI onRestart={handleRestart} />}
    </main>
  );
};

export default Index;
