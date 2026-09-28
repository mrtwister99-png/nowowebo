import { useEffect, useRef, useState } from 'react';
import type { InfoPhase } from './types';

export const INFO_TEXT = 'možná vás toto zaujalo.';

/**
 * Bubliny "MINIGAME" a "OVLÁDÁNÍ" u tlačítka (i) v ukázce.
 * Najetí myší: text se píše po znacích a klávesy se odkrývají zleva doprava (3,2 s).
 * Odjetí: bubliny 2,5 s mizí a pak se vrátí tlačítka HIGHSCORE a HRÁT.
 */
export function useInfoTeaser() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [infoPhase, setInfoPhase] = useState<InfoPhase>('idle');
  const [typedChars, setTypedChars] = useState<number>(0);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  // Aktuální hodnoty pro efekt, který se spouští jen při změně isHovered
  const loadProgressRef = useRef<number>(0);
  loadProgressRef.current = loadProgress;
  const infoPhaseRef = useRef<InfoPhase>('idle');
  infoPhaseRef.current = infoPhase;

  useEffect(() => {
    let typeTimer: ReturnType<typeof setInterval> | null = null;
    let animFrameId: number | null = null;

    if (isHovered) {
      setInfoPhase('active');

      // Pomalejší psaní (asi 95 ms na znak, celkem ~2,3 s)
      setTypedChars(0);
      typeTimer = setInterval(() => {
        setTypedChars((prev) => {
          if (prev < INFO_TEXT.length) {
            return prev + 1;
          }
          if (typeTimer) clearInterval(typeTimer);
          return prev;
        });
      }, 95);

      // Odkrývání od 0 % (vlevo) do 100 % (vpravo) během 3,2 s
      const startTime = Date.now();
      const duration = 3200;

      const tickIn = () => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / duration) * 100));
        setLoadProgress(pct);
        if (pct < 100) {
          animFrameId = requestAnimationFrame(tickIn);
        }
      };
      animFrameId = requestAnimationFrame(tickIn);

      return () => {
        if (typeTimer) clearInterval(typeTimer);
        if (animFrameId) cancelAnimationFrame(animFrameId);
      };
    } else {
      // Odjetí myší: 2,5 s ústup; pravá strana se stahuje ze 100 % (nebo aktuální hodnoty) na 0 %
      if (infoPhaseRef.current === 'active') {
        setInfoPhase('exiting');
        const exitStartTime = Date.now();
        const exitDuration = 2500;
        const startPct = loadProgressRef.current > 0 ? loadProgressRef.current : 100;

        const tickOut = () => {
          const elapsed = Date.now() - exitStartTime;
          const fraction = Math.max(0, 1 - elapsed / exitDuration);
          const currentPct = Math.round(startPct * fraction);
          setLoadProgress(currentPct);

          if (elapsed < exitDuration) {
            animFrameId = requestAnimationFrame(tickOut);
          } else {
            setInfoPhase('idle');
            setLoadProgress(0);
            setTypedChars(0);
          }
        };
        animFrameId = requestAnimationFrame(tickOut);

        return () => {
          if (animFrameId) cancelAnimationFrame(animFrameId);
        };
      }
    }
  }, [isHovered]);

  return { isHovered, setIsHovered, infoPhase, setInfoPhase, typedChars, loadProgress };
}
