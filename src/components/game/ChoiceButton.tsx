import { cn } from '@/lib/utils';

interface ChoiceButtonProps {
  text: string;
  type: 'opensource' | 'corporate' | 'neutral';
  onClick: () => void;
  index: number;
}

export const ChoiceButton = ({ text, type, onClick, index }: ChoiceButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full pixel-btn text-left font-pixel text-xs p-4 border-4 transition-all animate-slide-up bg-card text-foreground border-primary hover:bg-primary/5"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <span className="flex items-center gap-3">
        <span className={cn(
          "w-6 h-6 flex items-center justify-center border-2 text-xs border-foreground"
        )}>
          {index + 1}
        </span>
        <span className="flex-1 leading-relaxed">{text}</span>
      </span>
    </button>
  );
};
