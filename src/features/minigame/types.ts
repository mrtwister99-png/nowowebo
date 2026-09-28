/** Záznam v tabulce nejlepších výsledků */
export interface ScoreRecord {
  initials: string;
  score: number;
  date: string;
}

/** Kostička, která už dopadla na hrací plochu */
export interface SettledCube {
  id: string;
  col: number;
  row: number; // 0 je dole
  color: string;
  isRedAlert?: boolean;
}

/** Tvar padajícího dílku (relativní souřadnice [dx, dy] od kotvy) */
export interface PieceShape {
  cells: [number, number][];
}

/** Právě padající dílek */
export interface FallingPiece {
  cells: [number, number][]; // relativní [dx, dy]
  col: number;
  y: number; // v px
  isBomb: boolean;
  color: string;
}

/** Plovoucí text s body (+X) */
export interface FloatingScore {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

/** Částice výbuchu */
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  size: number;
}

export type GameState = 'demo' | 'countdown' | 'playing' | 'name_entry' | 'post_leaderboard';

export type InfoPhase = 'idle' | 'active' | 'exiting';

/** Řádky, které zrovna blikají před výbuchem */
export interface FlashingLines {
  rows: number[];
  flashOn: boolean;
}
