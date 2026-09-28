/*
 * Herní pravidla minihry jako čisté funkce (bez Reactu, bez časovačů).
 * Díky tomu jdou testovat samostatně a komponenta se stará jen o stav a vykreslení.
 */
import {
  BOARD_HEIGHT,
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_FALLING,
  COLOR_GOLD,
  COLOR_RED,
  CUBE_SIZE,
  DEMO_MAX_COL,
  DEMO_MIN_COL,
  DEMO_PIECE_SHAPES,
  GAME_DURATION_SECONDS,
  HIGH_SCORES_LIMIT,
  MAX_ROWS,
  PIECE_SHAPES,
  STEP,
  TOTAL_COLS,
} from './constants';
import type { FallingPiece, GameState, Particle, ScoreRecord, SettledCube } from './types';

/** Funkce vracející náhodné číslo 0 až 1: ve hře Math.random, v testech předvídatelná. */
export type Random = () => number;

const columnHeight = (cubes: SettledCube[], col: number): number =>
  cubes.filter((b) => b.col === col).length;

/** Střed buňky (sloupec, řádek) v px uvnitř hrací plochy; sem míří výbuchy. */
export const cellCenter = (col: number, row: number): { x: number; y: number } => ({
  x: col * STEP + CUBE_SIZE / 2,
  y: BOARD_HEIGHT - row * STEP - CUBE_SIZE / 2,
});

/** Výchozí kostičky v ukázce (demo): tři kostičky ve spodním řádku a mezery mezi nimi. */
export const createDemoStartCubes = (): SettledCube[] => [
  { id: 'd1-1', col: 1, row: 0, color: COLOR_BLACK },
  { id: 'd1-2', col: 2, row: 0, color: COLOR_BLACK },
  { id: 'd1-4', col: 4, row: 0, color: COLOR_BLACK },
];

/**
 * Aktivní sloupce podle času:
 * demo = sloupce 1 až 5; hra: 0-15 s sloupce 2-5, 15-30 s sloupce 1-6, potom všech 8 (0-7).
 */
export const getActiveColBounds = (timeLeft: number, state: string): [number, number] => {
  if (state === 'demo') return [DEMO_MIN_COL, DEMO_MAX_COL];
  const elapsed = GAME_DURATION_SECONDS - timeLeft;
  if (elapsed < 15) return [2, 5];
  if (elapsed < 30) return [1, 6];
  return [0, 7];
};

/** Rychlost pádu v px na snímek: v demu pomalu, v posledních 15 s rychleji. */
export const getFallSpeed = (state: GameState, timeLeft: number): number => {
  if (state === 'demo') return 0.75;
  const elapsed = GAME_DURATION_SECONDS - timeLeft;
  if (elapsed >= 45) return 1.8;
  return 1.1;
};

/** Nový dílek pro demo: jednoduché tvary, padá do jednoho ze dvou nejnižších sloupců. */
export const spawnDemoPiece = (
  settled: SettledCube[],
  rand: Random = Math.random,
): FallingPiece => {
  const shape = DEMO_PIECE_SHAPES[Math.floor(rand() * DEMO_PIECE_SHAPES.length)];
  const maxDx = Math.max(...shape.cells.map((c) => c[0]));
  const pieceWidth = maxDx + 1;

  const validCols: number[] = [];
  for (let c = DEMO_MIN_COL; c <= DEMO_MAX_COL - pieceWidth + 1; c++) {
    validCols.push(c);
  }

  // Seřadíme podle nejnižší výšky, aby kostičky pěkně doplňovaly řádky
  validCols.sort((colA, colB) => columnHeight(settled, colA) - columnHeight(settled, colB));

  const topChoices = validCols.slice(0, Math.min(2, validCols.length));
  const chosenCol =
    topChoices.length > 0 ? topChoices[Math.floor(rand() * topChoices.length)] : DEMO_MIN_COL;

  return {
    cells: shape.cells,
    col: chosenCol,
    y: -CUBE_SIZE * 2,
    isBomb: false,
    color: COLOR_FALLING,
  };
};

/** Nový dílek pro ostrou hru (bomba = jedna červená kostička). */
export const spawnPlayPiece = (
  minCol: number,
  maxCol: number,
  isBomb: boolean,
  rand: Random = Math.random,
): FallingPiece => {
  if (isBomb) {
    const col = Math.floor(minCol + rand() * (maxCol - minCol + 1));
    return { cells: [[0, 0]], col, y: -CUBE_SIZE, isBomb: true, color: COLOR_RED };
  }

  const shape = PIECE_SHAPES[Math.floor(rand() * PIECE_SHAPES.length)];
  const maxDx = Math.max(...shape.cells.map((c) => c[0]));
  const pieceWidth = maxDx + 1;

  const validCols: number[] = [];
  for (let c = minCol; c <= maxCol - pieceWidth + 1; c++) {
    validCols.push(c);
  }
  const chosenCol =
    validCols.length > 0 ? validCols[Math.floor(rand() * validCols.length)] : minCol;

  return {
    cells: shape.cells,
    col: chosenCol,
    y: -CUBE_SIZE * 2,
    isBomb: false,
    color: COLOR_FALLING,
  };
};

/** Dopadne dílek při posunu o `nextY`? */
export const willLand = (piece: FallingPiece, nextY: number, settled: SettledCube[]): boolean => {
  for (const [dx, dy] of piece.cells) {
    const stackHeight = columnHeight(settled, piece.col + dx);
    const cellBottom = nextY + dy * STEP + CUBE_SIZE;
    const restingBottom = BOARD_HEIGHT - stackHeight * STEP;
    if (cellBottom >= restingBottom) return true;
  }
  return false;
};

/** Nový sloupec po posunu doleva/doprava, nebo null, když posun nejde (okraj, kolize). */
export const moveTarget = (
  piece: FallingPiece,
  direction: -1 | 1,
  settled: SettledCube[],
  activeMinCol: number,
  activeMaxCol: number,
): number | null => {
  const newCol = piece.col + direction;
  const maxDx = Math.max(...piece.cells.map((c) => c[0]));
  const minDx = Math.min(...piece.cells.map((c) => c[0]));

  if (newCol + minDx < activeMinCol || newCol + maxDx > activeMaxCol) return null;

  const collides = piece.cells.some(([dx, dy]) => {
    const highestRow = columnHeight(settled, newCol + dx);
    const restingY = BOARD_HEIGHT - (highestRow + 1) * STEP;
    return piece.y + dy * STEP >= restingY;
  });

  return collides ? null : newCol;
};

/** Dopad dílku v demu: kostičky zčernají. */
export const settleDemoPiece = (
  settled: SettledCube[],
  piece: FallingPiece,
  now: number,
): SettledCube[] => {
  const result: SettledCube[] = [...settled];
  for (const [dx] of piece.cells) {
    const col = piece.col + dx;
    const row = columnHeight(result, col);
    if (row < MAX_ROWS) {
      result.push({ id: `demo-landed-${now}-${col}-${row}`, col, row, color: COLOR_BLACK });
    }
  }
  return result;
};

/** Dopad dílku v ostré hře; kostička v posledním řádku je červená (výstraha), přetečení = konec hry. */
export const settlePlayingPiece = (
  settled: SettledCube[],
  piece: FallingPiece,
  now: number,
): { cubes: SettledCube[]; isGameOver: boolean } => {
  let isGameOver = false;
  const cubes: SettledCube[] = [...settled];

  for (const [dx] of piece.cells) {
    const col = piece.col + dx;
    const row = columnHeight(cubes, col);
    if (row >= MAX_ROWS) isGameOver = true;

    const isTopAlert = row === MAX_ROWS - 1;
    cubes.push({
      id: `settled-${now}-${col}-${row}`,
      col,
      row,
      color: isTopAlert ? COLOR_RED : COLOR_BLACK,
      isRedAlert: isTopAlert,
    });
  }

  return { cubes, isGameOver };
};

/** Řádky (0 = dole), které jsou v aktivních sloupcích celé zaplněné. */
export const findFullRows = (cubes: SettledCube[], minC: number, maxC: number): number[] => {
  const activeWidth = maxC - minC + 1;
  const fullRows: number[] = [];
  for (let r = 0; r < MAX_ROWS; r++) {
    const cubesInRow = cubes.filter((b) => b.row === r && b.col >= minC && b.col <= maxC);
    if (cubesInRow.length >= activeWidth) fullRows.push(r);
  }
  return fullRows;
};

/** Smaže plné řádky a posune vyšší kostičky dolů. */
export const clearFullRows = (
  cubes: SettledCube[],
  fullRows: number[],
  minC: number,
  maxC: number,
): SettledCube[] => {
  let updated = cubes.filter((b) => !(fullRows.includes(b.row) && b.col >= minC && b.col <= maxC));
  fullRows
    .slice()
    .sort((a, b) => b - a)
    .forEach((clearedRow) => {
      updated = updated.map((b) =>
        b.row > clearedRow && b.col >= minC && b.col <= maxC ? { ...b, row: b.row - 1 } : b,
      );
    });
  return updated;
};

/** Body za vymazané řádky: 1 řádek 100, 2 řádky 300, 3 řádky 600, více 1200, krát počet sloupců. */
export const lineClearPoints = (clearedRows: number, activeWidth: number): number => {
  const basePoints =
    clearedRows === 1 ? 100 : clearedRows === 2 ? 300 : clearedRows === 3 ? 600 : 1200;
  return basePoints * activeWidth;
};

/** Ukázka nikdy nezamrzne: když některý sloupec dosáhne výšky 4, odpaří se spodní řádek. */
export const demoOverflowCleanup = (
  cubes: SettledCube[],
): { cubes: SettledCube[]; explodedCubes: SettledCube[] } | null => {
  const demoCols: number[] = [];
  for (let c = DEMO_MIN_COL; c <= DEMO_MAX_COL; c++) demoCols.push(c);

  const maxColHeight = Math.max(...demoCols.map((c) => columnHeight(cubes, c)));
  if (maxColHeight < 4) return null;

  const inDemoCols = (b: SettledCube) => b.col >= DEMO_MIN_COL && b.col <= DEMO_MAX_COL;
  return {
    explodedCubes: cubes.filter((b) => b.row === 0 && inDemoCols(b)),
    cubes: cubes
      .filter((b) => !(b.row === 0 && inDemoCols(b)))
      .map((b) => (inDemoCols(b) ? { ...b, row: b.row - 1 } : b)),
  };
};

/** Dopad bomby: zničí kostičky v okolí (sloupec ±1, řádek ±2) a zbytek slisuje dolů. */
export const resolveBomb = (
  settled: SettledCube[],
  bombCol: number,
): { impactRow: number; points: number; cubes: SettledCube[] } => {
  const impactRow = columnHeight(settled, bombCol);
  const inBlast = (b: SettledCube) =>
    Math.abs(b.col - bombCol) <= 1 && Math.abs(b.row - impactRow) <= 2;

  const destroyedCount = Math.max(3, settled.filter(inBlast).length);
  const surviving = settled.filter((b) => !inBlast(b));

  const compacted: SettledCube[] = [];
  for (let c = 0; c < TOTAL_COLS; c++) {
    const colCubes = surviving.filter((b) => b.col === c).sort((a, b) => a.row - b.row);
    colCubes.forEach((cube, idx) => {
      compacted.push({ ...cube, row: idx });
    });
  }

  return { impactRow, points: destroyedCount * 50, cubes: compacted };
};

/** Částice výbuchu ve značkových barvách. */
export const createExplosionParticles = (
  centerX: number,
  centerY: number,
  count: number,
  now: number,
  rand: Random = Math.random,
): Particle[] => {
  const colors = [COLOR_BLUE, COLOR_GOLD, COLOR_GOLD, COLOR_BLUE, '#ffffff', COLOR_RED];
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (rand() - 0.5);
    const speed = 2.5 + rand() * 3.5;
    particles.push({
      id: `p-${now}-${i}`,
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(rand() * colors.length)],
      opacity: 1,
      size: 3 + rand() * 4,
    });
  }
  return particles;
};

/** Jeden krok animace částic: posun a vyblednutí, zaniklé se odstraní. */
export const stepParticles = (particles: Particle[]): Particle[] =>
  particles
    .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, opacity: p.opacity - 0.05 }))
    .filter((p) => p.opacity > 0);

/** Přidá výsledek do tabulky: nejlepší nahoře, nejvýše 8 záznamů. */
export const addHighScore = (scores: ScoreRecord[], record: ScoreRecord): ScoreRecord[] =>
  [...scores, record].sort((a, b) => b.score - a.score).slice(0, HIGH_SCORES_LIMIT);
