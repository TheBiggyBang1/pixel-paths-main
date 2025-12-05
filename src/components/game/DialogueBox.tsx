import { useState, useEffect, useCallback } from 'react';
import { audioManager } from '@/lib/audio';

interface DialogueBoxProps {
  text: string;
  speakerName: string;
  onComplete: () => void;
  isComplete: boolean;
}

export const DialogueBox = ({ text, speakerName, onComplete, isComplete }: DialogueBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const typingSpeed = 30;

  useEffect(() => {
    if (isComplete) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
    } else {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timer = setTimeout(() => {
        // play short typing SFX (cloned internally)
        try {
          audioManager.playSfx('typing');
        } catch (e) {}

        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length && !isComplete) {
      onComplete();
    }
  }, [currentIndex, text, typingSpeed, onComplete, isComplete]);

  const skipToEnd = useCallback(() => {
    if (!isComplete) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      onComplete();
    }
  }, [text, isComplete, onComplete]);

  return (
    <div 
      className="dialogue-box w-full animate-slide-up cursor-pointer"
      onClick={skipToEnd}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="mb-3">
            <span className="text-primary text-xs font-pixel">{speakerName}</span>
          </div>
          <p className="text-foreground text-xs leading-relaxed font-pixel min-h-[60px]">
            {displayedText}
            {!isComplete && <span className="animate-blink ml-1">▊</span>}
          </p>
        </div>
      </div>
      {isComplete && (
        <div className="absolute bottom-2 right-4">
          <span className="text-primary text-xs animate-bounce-slow">▼</span>
        </div>
      )}
    </div>
  );
};
