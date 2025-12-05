import { cn } from '@/lib/utils';
import studentCharacter from '@/assets/student-character.png';
import opensourceMentor from '@/assets/opensource-mentor.png';
import corporateDevil from '@/assets/corporate-devil.png';
import teacherCharacter from '@/assets/teacher-character.png';
import principalCharacter from '@/assets/principal-character.png';
import type { CharacterType } from '@/data/storyData';

interface CharacterPortraitProps {
  character: CharacterType;
  className?: string;
}

const characterImages: Record<CharacterType, string | null> = {
  student: studentCharacter,
  opensource: opensourceMentor,
  corporate: corporateDevil,
  teacher: teacherCharacter,
  principal: principalCharacter,
  none: null
};

const characterColors: Record<CharacterType, string> = {
  student: 'border-primary',
  opensource: 'border-opensource-glow',
  corporate: 'border-destructive',
  teacher: 'border-secondary',
  principal: 'border-muted-foreground',
  none: 'border-muted'
};

export const CharacterPortrait = ({ character, className }: CharacterPortraitProps) => {
  const image = characterImages[character];
  
  if (!image) return null;

  return (
    <div 
      className={cn(
        "character-portrait animate-slide-up",
        characterColors[character],
        character === 'corporate' && "animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]",
        className
      )}
    >
      <img 
        src={image} 
        alt={`${character} character`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
