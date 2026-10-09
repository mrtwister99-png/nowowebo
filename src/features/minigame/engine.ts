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
  DEMO_MAX_HEIGHT,
  DEMO_MIN_COL,
  DEMO_TETROMINOES,
  FALL_SPEED_SCALE,
  FIELD_GROW_SECONDS,
  FIELD_MAX_GROWTH,
  FIELD_TOP_SPACE,
  GAME_DURATION_SECONDS,
  HIGH_SCORES_LIMIT,
  MAX_ROWS,
  PIECE_SHAPES,
  START_MAX_COL,
  START_MIN_COL,
  START_PIECE_SHAPES,
  STEP,
  TOTAL_COLS,
} from './constants';
import type {
  FallingPiece,
  FallStep,
  GameState,
  Particle,
  PieceShape,
  ScoreRecord,
  SettledCube,
} from './types';

/** Funkce vracející náhodné číslo 0 až 1: ve hře Math.random, v testech předvídatelná. */
export type Random = () => number;

// Výška sloupce = nejvyšší kostička + 1
const columnHeight = (cubes: SettledCube[], col: number): number =>
  cubes.reduce((height, b) => (b.col === col && b.row + 1 > height ? b.row + 1 : height), 0);

/** Střed buňky (sloupec, řádek) v px uvnitř hrací plochy; sem míří výbuchy. */
export const cellCenter = (col: number, row: number): { x: number; y: number } => ({
  x: col * STEP + CUBE_SIZE / 2,
  y: BOARD_HEIGHT - row * STEP - CUBE_SIZE / 2,
});

/** Ukázka (demo) začíná s prázdným polem jako opravdový Tetris. */
export const createDemoStartCubes = (): SettledCube[] => [];

/**
 * Aktivní sloupce podle času:
 * demo = 10 sloupců (1 až 10); hra: začíná 4 sloupci (4 až 7) a každých 10 s o 2 víc (6, 8, 10, 12).
 */
export const getActiveColBounds = (timeLeft: number, state: string): [number, number] => {
  if (state === 'demo') return [DEMO_MIN_COL, DEMO_MAX_COL];
  const elapsed = GAME_DURATION_SECONDS - timeLeft;
  const growth = Math.min(FIELD_MAX_GROWTH, Math.floor(elapsed / FIELD_GROW_SECONDS));
  return [START_MIN_COL - growth, START_MAX_COL + growth];
};

/** Rychlost pádu v px na snímek: v demu pomaleji, v posledních 15 s rychleji (krát FALL_SPEED_SCALE). */
export const getFallSpeed = (state: GameState, timeLeft: number): number => {
  if (state === 'demo') return 0.75 * FALL_SPEED_SCALE;
  const elapsed = GAME_DURATION_SECONDS - timeLeft;
  if (elapsed >= 45) return 1.8 * FALL_SPEED_SCALE;
  return 1.1 * FALL_SPEED_SCALE;
};

/**
 * Ohodnocení tahu pro ukázku: kostičky dílku v daném natočení a sloupci padají po sloupcích (jako ve hře).
 * Víc plných řádků je lepší; díry, výška sloupců a nerovný povrch jsou horší.
 */
const scoreDemoMove = (cubes: SettledCube[], shape: PieceShape, col: number): number => {
  // Každá kostička se opře o nejvyšší kostičku ve svém sloupci (přečnívající padá dál)
  const filled = new Set(cubes.map((b) => `${b.col},${b.row}`));
  const heights = new Map<number, number>();
  for (const [dx] of shape.cells) {
    const c = col + dx;
    const row = heights.get(c) ?? columnHeight(cubes, c);
    if (row >= MAX_ROWS) return -Infinity;
    filled.add(`${c},${row}`);
    heights.set(c, row + 1);
  }

  // Plné řádky se vymažou, hodnotí se pole až po jejich smazání
  const fullRows: number[] = [];
  for (let r = 0; r < MAX_ROWS; r++) {
    let isFull = true;
    for (let c = DEMO_MIN_COL; c <= DEMO_MAX_COL; c++) {
      if (!filled.has(`${c},${r}`)) {
        isFull = false;
        break;
      }
    }
    if (isFull) fullRows.push(r);
  }
  const lines = fullRows.length;
  const after = new Set<string>();
  for (const key of filled) {
    const [c, r] = key.split(',').map(Number);
    if (!fullRows.includes(r)) after.add(`${c},${r - fullRows.filter((f) => f < r).length}`);
  }

  let aggregateHeight = 0;
  let holes = 0;
  let bumpiness = 0;
  let previousHeight = -1;
  for (let c = DEMO_MIN_COL; c <= DEMO_MAX_COL; c++) {
    let height = 0;
    for (let r = MAX_ROWS - 1; r >= 0; r--) {
      if (after.has(`${c},${r}`)) {
        height = r + 1;
        break;
      }
    }
    for (let r = 0; r < height; r++) {
      if (!after.has(`${c},${r}`)) holes++;
    }
    aggregateHeight += height;
    if (previousHeight >= 0) bumpiness += Math.abs(height - previousHeight);
    previousHeight = height;
  }

  return lines * 0.76 - aggregateHeight * 0.51 - holes * 0.36 - bumpiness * 0.18;
};

/** Nový dílek pro ukázku: náhodný Tetris dílek, ukázka sama vybere nejlepší natočení a sloupec. */
export const spawnDemoPiece = (
  settled: SettledCube[],
  rand: Random = Math.random,
): FallingPiece => {
  const orientations = DEMO_TETROMINOES[Math.floor(rand() * DEMO_TETROMINOES.length)];

  let best = { shape: orientations[0], col: DEMO_MIN_COL, score: -Infinity };
  for (const shape of orientations) {
    const pieceWidth = Math.max(...shape.cells.map((c) => c[0])) + 1;
    for (let c = DEMO_MIN_COL; c <= DEMO_MAX_COL - pieceWidth + 1; c++) {
      const score = scoreDemoMove(settled, shape, c);
      if (score > best.score) best = { shape, col: c, score };
    }
  }

  // Dílek vzniká uprostřed pole v základním natočení jako v opravdovém Tetrisu; cestou dolů se
  // natočí (kratším směrem) do vybraného natočení a posune na vybraný sloupec
  const spawnShape = orientations[0];
  const targetIdx = orientations.indexOf(best.shape);
  const rotations =
    targetIdx <= orientations.length / 2
      ? orientations.slice(1, targetIdx + 1)
      : orientations.slice(targetIdx).reverse();

  const pieceHeight = Math.max(...spawnShape.cells.map((c) => c[1])) + 1;
  const pieceWidth = Math.max(...spawnShape.cells.map((c) => c[0])) + 1;
  const fieldWidth = DEMO_MAX_COL - DEMO_MIN_COL + 1;
  return {
    cells: spawnShape.cells,
    col: DEMO_MIN_COL + Math.floor((fieldWidth - pieceWidth) / 2),
    y: Math.max(-pieceHeight * STEP, -FIELD_TOP_SPACE),
    isBomb: false,
    color: COLOR_FALLING,
    targetCol: best.col,
    rotationsLeft: rotations.map((shape) => shape.cells),
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
    return { cells: [[0, 0]], col, y: 0, isBomb: true, color: COLOR_RED };
  }

  // První pole (4 sloupce): jen 1 kostička, 2 kostičky a kostka 2x2; od zvětšení pole všechny tvary
  const pool = maxCol - minCol + 1 <= 4 ? START_PIECE_SHAPES : PIECE_SHAPES;
  const shape = pool[Math.floor(rand() * pool.length)];
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
    y: 0,
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

/** Vejde se dílek s tvarem `cells` na sloupec `col` v ukázkovém poli a nenarazí do usazených kostiček? */
const demoFits = (
  piece: FallingPiece,
  cells: [number, number][],
  col: number,
  settled: SettledCube[],
): boolean =>
  cells.every(([dx, dy]) => {
    const c = col + dx;
    if (c < DEMO_MIN_COL || c > DEMO_MAX_COL) return false;
    const restingY = BOARD_HEIGHT - (columnHeight(settled, c) + 1) * STEP;
    return piece.y + dy * STEP < restingY;
  });

/**
 * Ukázka: jeden krok "hráče". Nejdřív dílek natočí do vybraného natočení (jedno natočení za krok,
 * u zdi se při tom odsune), potom ho posune o 1 sloupec k vybranému sloupci (targetCol).
 * Když krok nejde (kolize), dílek zůstane stát a zkusí to příště.
 */
export const steerDemoPiece = (
  piece: FallingPiece | null,
  settled: SettledCube[],
): FallingPiece | null => {
  if (!piece) return piece;

  const [nextCells, ...restCells] = piece.rotationsLeft ?? [];
  if (nextCells) {
    const width = Math.max(...nextCells.map((c) => c[0])) + 1;
    const col = Math.min(piece.col, DEMO_MAX_COL - width + 1);
    return demoFits(piece, nextCells, col, settled)
      ? { ...piece, cells: nextCells, col, rotationsLeft: restCells }
      : piece;
  }

  if (piece.targetCol === undefined || piece.targetCol === piece.col) return piece;

  const direction = piece.targetCol > piece.col ? 1 : -1;
  const newCol = moveTarget(piece, direction, settled, DEMO_MIN_COL, DEMO_MAX_COL);
  return newCol === null ? piece : { ...piece, col: newCol };
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

/** Rozdělí dílek po sloupcích: každý sloupec je samostatná část padající svisle (cells mají dx = 0). */
export const splitByColumn = (piece: FallingPiece): FallingPiece[] => {
  const columns = new Map<number, [number, number][]>();
  for (const [dx, dy] of piece.cells) {
    columns.set(dx, [...(columns.get(dx) ?? []), [0, dy]]);
  }
  return [...columns.entries()].map(([dx, cells]) => ({ ...piece, col: piece.col + dx, cells }));
};

/**
 * Jeden snímek pádu: odpadlé části i hlavní dílek se posunou o `speed` px stejnou rychlostí.
 * Když dílek narazí, usadí se jen sloupce, které se o něco opřely; přečnívající sloupce
 * padají dál jako odpadlé části a dopadnou samy. Bomba se jen ohlásí (bombCol), řeší ji hra.
 */
export const stepFalling = (
  settled: SettledCube[],
  loose: FallingPiece[],
  piece: FallingPiece | null,
  speed: number,
  now: number,
): FallStep => {
  let cubes = settled;
  let landed = false;
  let pieceLanded = false;
  let isGameOver = false;
  let bombCol: number | null = null;
  let nextPiece: FallingPiece | null = null;
  const nextLoose: FallingPiece[] = [];

  const settlePart = (part: FallingPiece) => {
    const result = settlePlayingPiece(cubes, part, now);
    cubes = result.cubes;
    isGameOver = isGameOver || result.isGameOver;
    landed = true;
  };

  // Odpadlé části: nejnižší první, ať se vyšší část ve stejném sloupci opře o už usazenou
  for (const part of [...loose].sort((a, b) => b.y - a.y)) {
    const nextY = part.y + speed;
    if (willLand(part, nextY, cubes)) settlePart(part);
    else nextLoose.push({ ...part, y: nextY });
  }

  if (piece) {
    const nextY = piece.y + speed;
    if (!willLand(piece, nextY, cubes)) {
      nextPiece = { ...piece, y: nextY };
    } else if (piece.isBomb) {
      bombCol = piece.col;
    } else {
      pieceLanded = true;
      for (const part of splitByColumn(piece)) {
        if (willLand(part, nextY, cubes)) settlePart(part);
        else nextLoose.push({ ...part, y: nextY });
      }
    }
  }

  return {
    settled: cubes,
    loose: nextLoose,
    piece: nextPiece,
    landed,
    pieceLanded,
    bombCol,
    isGameOver,
  };
};

/** Kam by odpadlé části dopadly (ukázka s tím počítá při výběru dalšího tahu). */
export const projectLooseParts = (settled: SettledCube[], loose: FallingPiece[]): SettledCube[] =>
  loose.reduce((cubes, part) => settlePlayingPiece(cubes, part, 0).cubes, settled);

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

/** Ukázka nikdy nezamrzne: když některý sloupec dosáhne výšky DEMO_MAX_HEIGHT, odpaří se spodní řádek. */
export const demoOverflowCleanup = (
  cubes: SettledCube[],
): { cubes: SettledCube[]; explodedCubes: SettledCube[] } | null => {
  const demoCols: number[] = [];
  for (let c = DEMO_MIN_COL; c <= DEMO_MAX_COL; c++) demoCols.push(c);

  const maxColHeight = Math.max(...demoCols.map((c) => columnHeight(cubes, c)));
  if (maxColHeight < DEMO_MAX_HEIGHT) return null;

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
