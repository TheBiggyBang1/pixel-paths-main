import { useState, useCallback, useEffect, useRef } from 'react';
import { SceneBackground } from './SceneBackground';
import { DialogueBox } from './DialogueBox';
import { ChoiceButton } from './ChoiceButton';
import { CharacterPortrait } from './CharacterPortrait';
import { getNode, type StoryNode, type GameState } from '@/data/storyData';
import { audioManager, preloadDefaultSounds } from '@/lib/audio';
// audio files are looked up dynamically (public/sounds fallback)

interface GameUIProps {
  onRestart: () => void;
}

export const GameUI = ({ onRestart }: GameUIProps) => {
  const [currentNode, setCurrentNode] = useState<StoryNode>(getNode('start'));
  const prevSceneRef = useRef<string>(currentNode.scene);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    opensourcePoints: 0,
    corporatePoints: 0,
    allyCount: 0,
    hasRefused: false,
    hasQuestioned: false
  });
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [transitionFade, setTransitionFade] = useState(false);

  const currentDialogue = currentNode.dialogue[dialogueIndex];
  const isLastDialogue = dialogueIndex >= currentNode.dialogue.length - 1;

  const handleDialogueComplete = useCallback(() => {
    setIsDialogueComplete(true);
  }, []);

  const handleNextDialogue = useCallback(() => {
    if (!isDialogueComplete) return;

    if (!isLastDialogue) {
      setDialogueIndex(prev => prev + 1);
      setIsDialogueComplete(false);
    } else if (currentNode.choices && currentNode.choices.length > 0) {
      setShowChoices(true);
    }
  }, [isDialogueComplete, isLastDialogue, currentNode.choices]);

  

  const handleChoice = useCallback((nextNodeId: string, choiceType: 'opensource' | 'corporate' | 'neutral') => {
    // Update game state based on choice
    setGameState(prev => {
      const newState = { ...prev };
      
      if (choiceType === 'opensource') {
        newState.opensourcePoints += 1;
      } else if (choiceType === 'corporate') {
        newState.corporatePoints += 1;
      }
      
      // Track specific behaviors
      if (nextNodeId.includes('question') || nextNodeId.includes('refuse')) {
        newState.hasQuestioned = true;
      }
      
      return newState;
    });

    const nextNode = getNode(nextNodeId);
    setCurrentNode(nextNode);
    setDialogueIndex(0);
    setIsDialogueComplete(false);
    setShowChoices(false);
  }, []);

  useEffect(() => {
    // preload audio files (try assets first, then public/sounds/)
    // Use Vite's glob to find any audio files placed in `src/assets` so users
    // can add `typing.wav` or `transition.wav` there and have them picked up.
    const found = import.meta.glob('../../assets/*.{mp3,wav,ogg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
    const byName: Record<string, string> = {};
    for (const p in found) {
      const parts = p.split('/');
      const file = parts[parts.length - 1].toLowerCase();
      byName[file] = found[p];
    }

    preloadDefaultSounds({
      intro: byName['intro.mp3'] ?? '/sounds/intro.mp3',
      school: byName['school.wav'] ?? '/sounds/school.mp3',
      evil: byName['evil.wav'] ?? '/sounds/evil.mp3',
      good: byName['good.wav'] ?? byName['good.mp3'] ?? '/sounds/good.wav',
      typing: byName['typing.wav'] ?? '/sounds/typing.wav',
      transition: byName['transition.wav'] ?? '/sounds/transition.wav'
    });

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (showChoices) return;
        handleNextDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNextDialogue, showChoices]);

  // Autoplay is blocked by browsers until a user gesture. Listen for first pointerdown
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      // start appropriate BGM immediately after user gesture
      if (currentNode.id === 'start') {
        audioManager.playBgm('intro');
      } else if (currentNode.speaker === 'corporate') {
        audioManager.playBgm('evil');
      } else if (currentNode.speaker === 'teacher' || currentNode.speaker === 'principal') {
        audioManager.playBgm('school');
      } else if (currentNode.speaker === 'opensource') {
        // Alex / open source mentor
        audioManager.playBgm('good');
      }
    };

    window.addEventListener('pointerdown', enableAudio, { once: true });
    return () => window.removeEventListener('pointerdown', enableAudio as any);
  }, [currentNode.id, currentNode.speaker]);

  // Play appropriate BGM when the node or speaker changes (only if audio enabled)
  useEffect(() => {
    if (!audioEnabled) return;

    // intro song ONLY on start menu
    if (currentNode.id === 'start') {
      audioManager.playBgm('intro');
    } 
    // corporate speaker plays evil music
    else if (currentNode.speaker === 'corporate') {
      audioManager.playBgm('evil');
    } 
    // teacher or principal plays school music
    else if (currentNode.speaker === 'teacher' || currentNode.speaker === 'principal') {
      audioManager.playBgm('school');
    } 
    // opensource/alex plays good music
    else if (currentNode.speaker === 'opensource') {
      audioManager.playBgm('good');
    } 
    // all other nodes: stop music
    else {
      audioManager.stopBgm(300);
    }
  }, [audioEnabled, currentNode.id, currentNode.speaker]);

  // Scene transition FX and visual effect
  useEffect(() => {
    const prev = prevSceneRef.current;
    if (prev && prev !== currentNode.scene) {
      // play quick transition sfx
      audioManager.playSfx('transition');
      // trigger fade animation
      setTransitionFade(true);
      const timer = setTimeout(() => setTransitionFade(false), 500);
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = currentNode.scene;
  }, [currentNode.scene]);

  // Determine path indicator
  const getPathIndicator = () => {
    if (gameState.opensourcePoints > gameState.corporatePoints) {
      return { label: '🔓 Freedom Path', color: 'text-green-400' };
    } else if (gameState.corporatePoints > gameState.opensourcePoints) {
      return { label: '💼 Corporate Path', color: 'text-red-400' };
    } else {
      return { label: '🌳 Independent Path', color: 'text-yellow-400' };
    }
  };

  const pathInfo = getPathIndicator();

  return (
    <SceneBackground scene={currentNode.scene}>
      {/* Fade transition overlay */}
      {transitionFade && (
        <div className="fixed inset-0 bg-black pointer-events-none z-50 animate-fade-in-out" />
      )}
      {/* Top bar with scene and path indicator */}
      <div className="p-4 flex justify-between items-center">
        <div className="inline-block bg-card/80 backdrop-blur-sm px-4 py-2 border-2 border-primary">
          <span className="text-primary text-xs font-pixel capitalize">
            📍 {currentNode.scene.replace('-', ' ')}
          </span>
        </div>
        <div className={`inline-block bg-card/80 backdrop-blur-sm px-4 py-2 border-2 ${pathInfo.color.replace('text-', 'border-')}`}>
          <span className={`${pathInfo.color} text-xs font-pixel`}>
            {pathInfo.label}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-end p-4 pb-8">
        <div className="w-full max-w-4xl mx-auto space-y-4">
          {/* Character and dialogue area */}
          <div className="flex items-end gap-4">
            <CharacterPortrait character={currentNode.speaker} />
            
            <div className="flex-1">
              <div 
                onClick={!showChoices ? handleNextDialogue : undefined}
                className={!showChoices ? "cursor-pointer" : ""}
              >
                <DialogueBox
                  text={currentDialogue}
                  speakerName={(() => {
                    try {
                      const stored = localStorage.getItem('playerName') || '';
                      if (!stored) return currentNode.speakerName;
                      // Replace plain 'You' occurrences with the player's name
                      return currentNode.speakerName.replace(/^You(\b|\s|\(|$)/, stored + '$1');
                    } catch {
                      return currentNode.speakerName;
                    }
                  })()}
                  onComplete={handleDialogueComplete}
                  isComplete={isDialogueComplete}
                />
              </div>
            </div>
          </div>

          {/* Choices or continue prompt */}
          {isDialogueComplete && isLastDialogue && (
            <div className="space-y-3 animate-fade-in">
              {/* top inline navigation removed per user request */}
              {currentNode.isEnding ? (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={onRestart}
                    className="pixel-btn bg-primary text-primary-foreground border-4 border-primary font-pixel text-xs px-8 py-4 animate-pulse-glow"
                  >
                    🔄 Play Again
                  </button>
                </div>
              ) : showChoices && currentNode.choices ? (
                <div className="space-y-3 pt-2">
                  {currentNode.choices.map((choice, index) => (
                    <div key={choice.id} className="space-y-1">
                      <ChoiceButton
                        text={choice.text}
                        type={choice.type}
                        onClick={() => handleChoice(choice.nextNode, choice.type)}
                        index={index}
                      />
                      {choice.impact && (
                        <p className="text-xs text-muted-foreground italic ml-2 font-pixel">
                          💭 {choice.impact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="text-center py-2 cursor-pointer"
                  onClick={handleNextDialogue}
                >
                  <span className="text-muted-foreground text-xs font-pixel animate-blink">
                    Click or press SPACE to continue...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hint text and stats */}
      <div className="p-4 flex justify-between items-center text-center">
        <span className="text-muted-foreground text-xs font-pixel opacity-60">
          Press SPACE or click dialogue to advance
        </span>
        <div className="text-muted-foreground text-xs font-pixel opacity-60 space-x-4">
          <span>🔓 {gameState.opensourcePoints}</span>
          <span>💼 {gameState.corporatePoints}</span>
        </div>
      </div>

      {/* Fixed menu button - bottom left */}
      <button
        onClick={onRestart}
        className="fixed left-4 bottom-12 z-50 pixel-btn bg-card text-foreground border-4 border-primary text-xs px-3 py-2"
      >
        ⤴ Menu
      </button>
    </SceneBackground>
  );
};
