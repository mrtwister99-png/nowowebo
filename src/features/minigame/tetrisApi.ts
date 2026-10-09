import { HIGH_SCORES_LIMIT } from './constants';
import type { ScoreRecord } from './types';

/*
 * Společné počítadlo (kolik lidí vydrželo celou minutu) a žebříček HIGHSCORE v Supabase (funkce tetris_* ze supabase/tetris.sql).
 * Bez proměnných prostředí nebo při chybě sítě hra funguje dál s daty jen z tohoto prohlížeče.
 */
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const REQUEST_TIMEOUT_MS = 5000;

export const isTetrisApiConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

interface ScoreRow {
  initials: string;
  score: number;
  created_at: string;
}

/** Zavolá funkci v databázi (Supabase RPC). Chyba nebo timeout = výjimka. */
const callRpc = async <T>(fn: string, args: Record<string, unknown> = {}): Promise<T> => {
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY as string,
    'Content-Type': 'application/json',
  };
  // Starý veřejný klíč je JWT a posílá se i jako Bearer; nový (sb_publishable_...) jen v apikey
  if (SUPABASE_KEY?.startsWith('eyJ')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Supabase ${fn}: ${response.status}`);

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

/** Kolik lidí zatím zkoušelo Tetris (společné číslo). */
export const fetchTries = async (): Promise<number> => Number(await callRpc<number>('tetris_get_tries'));

/** Dohraná celá minuta: přičte 1 a vrátí nový společný součet. */
export const addTry = async (): Promise<number> => Number(await callRpc<number>('tetris_add_try'));

/** Nejlepší výsledky všech hráčů (nejlepší nahoře). */
export const fetchTopScores = async (): Promise<ScoreRecord[]> => {
  const rows = await callRpc<ScoreRow[]>('tetris_top_scores', { max_rows: HIGH_SCORES_LIMIT });
  return rows.map((row) => ({
    initials: row.initials,
    score: row.score,
    date: row.created_at.slice(0, 10),
  }));
};

/** Uloží výsledek hráče (server zkontroluje přezdívku a skóre). */
export const submitScore = async (initials: string, score: number): Promise<void> => {
  await callRpc<void>('tetris_submit_score', { p_initials: initials, p_score: score });
};
