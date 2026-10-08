import { useCallback, useEffect, useState } from 'react';
import { HIGH_SCORES_KEY } from './constants';
import { addHighScore } from './engine';
import { fetchTopScores, isTetrisApiConfigured, submitScore } from './tetrisApi';
import type { ScoreRecord } from './types';

/** Poslední známá tabulka se schová do localStorage, aby byla vidět hned a při výpadku serveru. */
const saveLocal = (scores: ScoreRecord[]) => {
  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  } catch {
    // uložení se nepovedlo - tabulka funguje dál jen po dobu návštěvy
  }
};

/**
 * Tabulka nejlepších výsledků všech hráčů ze Supabase.
 * Bez serveru (nenastaveno nebo výpadek) zůstane poslední známá tabulka z tohoto prohlížeče.
 */
export function useHighScores() {
  const [highScores, setHighScores] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /** Stáhne společnou tabulku ze serveru; při chybě se nic nezmění. */
  const refreshScores = useCallback(async () => {
    if (!isTetrisApiConfigured) return;
    try {
      const top = await fetchTopScores();
      setHighScores(top);
      saveLocal(top);
    } catch {
      // server nedostupný: zůstává poslední známá tabulka
    }
  }, []);

  useEffect(() => {
    void refreshScores();
  }, [refreshScores]);

  /** Přidá výsledek (přezdívka max. 3 znaky velkými písmeny): hned do tabulky, pak na server. */
  const addScore = useCallback(
    (initials: string, score: number) => {
      const cleanInitials = initials.toUpperCase().slice(0, 3);
      const updated = addHighScore(highScores, { initials: cleanInitials, score, date: 'Nyní' });
      setHighScores(updated);
      saveLocal(updated);

      if (!isTetrisApiConfigured) return;
      // Po uložení se stáhne společná tabulka (obsahuje i výsledky ostatních)
      submitScore(cleanInitials, score)
        .then(refreshScores)
        .catch(() => {
          // výsledek zůstal jen lokálně (server nedostupný)
        });
    },
    [highScores, refreshScores],
  );

  return { highScores, addScore, refreshScores };
}
