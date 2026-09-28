import { BRAND } from '../../lib/colors';
import { PieceShape } from './types';

// Barvy hry: 3 značkové barvy + černá; padající kostičky jsou žlutozelené
export const COLOR_BLUE = BRAND.blue;
export const COLOR_GOLD = BRAND.mustard;
export const COLOR_RED = BRAND.red;
export const COLOR_BLACK = BRAND.ink;
export const COLOR_FALLING = '#bef264';

export const CUBE_SIZE = 11; // 11 px na kostičku
export const GAP = 2; // 2 px mezera
export const STEP = CUBE_SIZE + GAP; // 13 px krok
export const MAX_ROWS = 6; // maximální výška (6 kostiček)

// Sloupce hrací plochy: celkem 8 (indexy 0 až 7)
export const TOTAL_COLS = 8;
export const BOARD_WIDTH = TOTAL_COLS * STEP - GAP;
export const BOARD_HEIGHT = (MAX_ROWS + 1) * STEP; // +1 řádek nad plochou pro vznik dílku

export const GAME_DURATION_SECONDS = 60;
export const BOMB_COOLDOWN_SECONDS = 30;
export const HIGH_SCORES_KEY = 'loyo_tetris_scores';
export const HIGH_SCORES_LIMIT = 8;

// Aktivní sloupce v demu: 1 až 5
export const DEMO_MIN_COL = 1;
export const DEMO_MAX_COL = 5;

// Všechny tvary pro ostrou hru
export const PIECE_SHAPES: PieceShape[] = [
  { cells: [[0, 0]] }, // 1 kostička
  {
    cells: [
      [0, 0],
      [1, 0],
    ],
  }, // 2 kostičky vodorovně
  {
    cells: [
      [0, 0],
      [0, 1],
    ],
  }, // 2 kostičky svisle
  {
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
  }, // rohový tvar
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
  }, // 3 kostičky vodorovně
  {
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  }, // čtverec 2x2
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
  }, // T-dílek
];

// Jednodušší tvary pro ukázku (demo), které chytře zaplňují mezery
export const DEMO_PIECE_SHAPES: PieceShape[] = PIECE_SHAPES.slice(0, 5);
