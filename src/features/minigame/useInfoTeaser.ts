import { useEffect, useRef, useState } from 'react';
import type { InfoPhase } from './types';

/**
 * Bublina s ovládáním u tlačítka (i) v ukázce.
 * Najetí myší: bublina naskočí (active).
 * Odjetí: 0,45 s glitch odchod (exiting) a pak se vrátí tlačítka HIGHSCORE a HRÁT (idle).
 */
export function useInfoTeaser() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [infoPhase, setInfoPhase] = useState<InfoPhase>('idle');

  // Aktuální fáze pro efekt, který se spouští jen při změně isHovered
  const infoPhaseRef = useRef<InfoPhase>('idle');
  infoPhaseRef.current = infoPhase;

  useEffect(() => {
    if (isHovered) {
      setInfoPhase('active');
      return;
    }

    // Odjetí myší: krátký glitch odchod, pak se bublina schová
    if (infoPhaseRef.current === 'active') {
      setInfoPhase('exiting');
      const exitTimer = setTimeout(() => setInfoPhase('idle'), 450);
      return () => clearTimeout(exitTimer); // nové najetí během odchodu časovač zruší
    }
  }, [isHovered]);

  return { isHovered, setIsHovered, infoPhase, setInfoPhase };
}
