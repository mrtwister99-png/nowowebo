import { useCallback, useEffect, useState } from 'react';
import { COLOR_GOLD } from './constants';
import { createExplosionParticles, stepParticles } from './engine';
import type { FloatingScore, Particle } from './types';

/** Vizuální efekty hrací plochy: částice výbuchů, plovoucí body a krátké zablikání pozadí. */
export function useBoardEffects() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [flashBoard, setFlashBoard] = useState<boolean>(false);

  // Plovoucí text s body (+X), po 1,2 s zmizí
  const showFloatingScore = useCallback(
    (text: string, x: number, y: number, color: string = COLOR_GOLD) => {
      const id = `fs-${Date.now()}-${Math.random()}`;
      setFloatingScores((prev) => [...prev, { id, text, x, y, color }]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== id));
      }, 1200);
    },
    [],
  );

  // Výbuch částic ve značkových barvách (modrá, zlatá, červená)
  const triggerExplosion = useCallback((centerX: number, centerY: number, count: number = 20) => {
    const newParticles = createExplosionParticles(centerX, centerY, count, Date.now());
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Zablikání pozadí (výbuch řádku, bomba)
  const flashBoardBriefly = useCallback(() => {
    setFlashBoard(true);
    setTimeout(() => setFlashBoard(false), 200);
  }, []);

  // Animace částic, běží jen dokud nějaké existují
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) => stepParticles(prev));
    }, 24);
    return () => clearInterval(interval);
  }, [particles.length]);

  return {
    particles,
    floatingScores,
    flashBoard,
    showFloatingScore,
    triggerExplosion,
    flashBoardBriefly,
  };
}
