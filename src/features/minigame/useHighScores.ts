import { useCallback, useState } from 'react';
import { HIGH_SCORES_KEY } from './constants';
import { addHighScore } from './engine';
import type { ScoreRecord } from './types';

/** Tabulka nejlepších výsledků uložená v localStorage (při chybě úložiště zůstane prázdná). */
export function useHighScores() {
  const [highScores, setHighScores] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /** Přidá výsledek (přezdívka max. 3 znaky velkými písmeny) a uloží tabulku. */
  const addScore = useCallback(
    (initials: string, score: number) => {
      const newRecord: ScoreRecord = {
        initials: initials.toUpperCase().slice(0, 3),
        score,
        date: 'Nyní',
      };
      const updated = addHighScore(highScores, newRecord);
      setHighScores(updated);
      try {
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
      } catch {
        // uložení se nepovedlo - tabulka funguje dál jen po dobu návštěvy
      }
    },
    [highScores],
  );

  return { highScores, addScore };
}
