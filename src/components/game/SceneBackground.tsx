import classroomBg from '@/assets/classroom-bg.png';
import computerLabBg from '@/assets/computer-lab-bg.png';
import digitalCityBg from '@/assets/digital-city-bg.png';
import type { SceneType } from '@/data/storyData';

interface SceneBackgroundProps {
  scene: SceneType;
  children: React.ReactNode;
}

const sceneImages: Record<SceneType, string> = {
  classroom: classroomBg,
  'computer-lab': computerLabBg,
  'digital-city': digitalCityBg
};

export const SceneBackground = ({ scene, children }: SceneBackgroundProps) => {
  return (
    <div 
      className="scene-container min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url(${sceneImages[scene]})`,
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-background/40" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
