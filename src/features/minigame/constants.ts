import { BRAND } from '../../lib/colors';
import { PieceShape } from './types';

// Barvy hry: 3 značkové barvy + černá; padající kostičky jsou žlutozelené
export const COLOR_BLUE = BRAND.blue;
export const COLOR_GOLD = BRAND.mustard;
export const COLOR_RED = BRAND.red;
export const COLOR_BLACK = BRAND.ink;
export const COLOR_FALLING = '#bef264';

export const CUBE_SIZE = 7; // 7 px na kostičku (20 řádků se musí vejít do výšky hlavičky)
export const GAP = 1; // 1 px mezera
export const STEP = CUBE_SIZE + GAP; // 13 px krok
export const MAX_ROWS = 20; // výška hrací plochy jako v oficiálním Tetrisu: 20 řádků

// Sloupce hrací plochy: celkem 12 (indexy 0 až 11); hra začíná na 4 sloupcích uprostřed
export const TOTAL_COLS = 12;
export const BOARD_WIDTH = TOTAL_COLS * STEP - GAP;
export const BOARD_HEIGHT = (MAX_ROWS + 1) * STEP; // +1 řádek nad plochou pro vznik dílku

export const GAME_DURATION_SECONDS = 60;
export const BOMB_COOLDOWN_SECONDS = 30;
export const HIGH_SCORES_KEY = 'loyo_tetris_scores';
export const HIGH_SCORES_LIMIT = 8;
export const FINISHED_KEY = 'loyo_tetris_finished'; // počítadlo lidí, kteří vydrželi celou minutu

// Pole hry: začíná 4 sloupce široké (sloupce 4 až 7) a každých 10 s se zvětší o 2 (6, 8, 10, 12)
export const START_MIN_COL = 4;
export const START_MAX_COL = 7;
export const FIELD_GROW_SECONDS = 10;
export const FIELD_MAX_GROWTH = 4;

// Zdi kolem pole: šířka a volné místo nad polem (0 = pole a zdi sahají až úplně nahoru)
export const WALL_WIDTH = 8;
export const FIELD_TOP_SPACE = 0;

// Pole má 21 řádků místo 7 (168 px místo 91 px), proto padá 2x rychleji (jinak by dílek padal moc dlouho)
export const FALL_SPEED_SCALE = 2;

// Šipka dolů (držená): dílek padá 4x rychleji
export const SOFT_DROP_MULTIPLIER = 4;

// Ukázka (demo): pole jako opravdový Tetris, 10 sloupců široké (sloupce 1 až 10) a 20 řádků vysoké;
// při výšce 14 se spodní řádek odpaří
export const DEMO_MIN_COL = 1;
export const DEMO_MAX_COL = 10;
export const DEMO_MAX_HEIGHT = 14;

// Ukázka: dílek se cestou dolů natočí/posune každých 110 až 200 ms (náhodně, jako živý hráč)
export const DEMO_STEER_MS = 110;
export const DEMO_STEER_JITTER_MS = 90;

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

// První pole (4 sloupce): jen 1 kostička, 2 kostičky (vodorovně i svisle) a kostka 2x2
export const START_PIECE_SHAPES: PieceShape[] = [
  PIECE_SHAPES[0],
  PIECE_SHAPES[1],
  PIECE_SHAPES[2],
  PIECE_SHAPES[5],
];

// Ukázka (demo): opravdové Tetris dílky I, O, T, S, Z, J, L, každý ve všech natočeních
// prettier-ignore
export const DEMO_TETROMINOES: PieceShape[][] = [
  [{ cells: [[0, 0], [1, 0], [2, 0], [3, 0]] }, { cells: [[0, 0], [0, 1], [0, 2], [0, 3]] }], // I
  [{ cells: [[0, 0], [1, 0], [0, 1], [1, 1]] }], // O
  [
    { cells: [[1, 0], [0, 1], [1, 1], [2, 1]] },
    { cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
    { cells: [[1, 0], [0, 1], [1, 1], [1, 2]] },
    { cells: [[0, 0], [0, 1], [1, 1], [0, 2]] },
  ], // T
  [{ cells: [[1, 0], [2, 0], [0, 1], [1, 1]] }, { cells: [[0, 0], [0, 1], [1, 1], [1, 2]] }], // S
  [{ cells: [[0, 0], [1, 0], [1, 1], [2, 1]] }, { cells: [[1, 0], [0, 1], [1, 1], [0, 2]] }], // Z
  [
    { cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
    { cells: [[0, 0], [1, 0], [0, 1], [0, 2]] },
    { cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
    { cells: [[1, 0], [1, 1], [0, 2], [1, 2]] },
  ], // J
  [
    { cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
    { cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
    { cells: [[0, 0], [1, 0], [2, 0], [0, 1]] },
    { cells: [[0, 0], [1, 0], [1, 1], [1, 2]] },
  ], // L
];
