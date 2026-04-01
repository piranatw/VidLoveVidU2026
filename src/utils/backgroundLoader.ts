// Background image imports
import scene1 from '@assets/backgrounds/scene-1.png';
import scene2 from '@assets/backgrounds/scene-2.png';
import scene3 from '@assets/backgrounds/scene-3.png';
import scene4 from '@assets/backgrounds/scene-4.png';
import scene5 from '@assets/backgrounds/scene-5.png';
import scene6 from '@assets/backgrounds/scene-6.png';
import scene7 from '@assets/backgrounds/scene-7.png';
import scene8 from '@assets/backgrounds/scene-8.png';
import scene9 from '@assets/backgrounds/scene-9.png';
import scene10 from '@assets/backgrounds/scene-10.png';
import scene11 from '@assets/backgrounds/scene-11.png';
import scene12 from '@assets/backgrounds/scene-12.png';
import scene13 from '@assets/backgrounds/scene-13.png';

// Background mapping
const backgroundMap: Record<string, string> = {
    'scene-1': scene1,
    'scene-2': scene2,
    'scene-3': scene3,
    'scene-4': scene4,
    'scene-5': scene5,
    'scene-6': scene6,
    'scene-7': scene7,
    'scene-8': scene8,
    'scene-9': scene9,
    'scene-10': scene10,
    'scene-11': scene11,
    'scene-12': scene12,
    'scene-13': scene13,
};

/**
 * Get bundled background image for a scene
 * @param backgroundKey - Key from scenes.ts (e.g., 'festival-entrance')
 * @returns Imported background image URL
 */
export function getBackgroundImage(backgroundKey?: string): string {
    if (!backgroundKey) return '';
    return backgroundMap[backgroundKey];
}
