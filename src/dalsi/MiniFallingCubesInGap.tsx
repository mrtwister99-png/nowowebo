import React, { useEffect, useState, useRef, useCallback } from 'react';

// LoYo Brand Colors - Strictly the 3 classic brand colors plus ordinary black/white/neutrals
const COLOR_BLUE = '#040b8d';
const COLOR_GOLD = '#CDA24D';
const COLOR_RED = '#ac0001';
const COLOR_BLACK = '#18181b';
const COLOR_FALLING = '#bef264'; // Žlutozelená pro padající kostičky

const CUBE_SIZE = 11; // 11px per square (~50% smaller to fit perfectly)
const GAP = 2; // 2px spacing
const STEP = CUBE_SIZE + GAP; // 13px step
const MAX_ROWS = 6; // Height limit (6 cubes high)

// Highscore record
interface ScoreRecord {
  initials: string;
  score: number;
  date: string;
}

// Settled block in the grid
interface SettledCube {
  id: string;
  col: number;
  row: number; // 0 is bottom
  color: string;
  isRedAlert?: boolean;
}

// Active falling piece shape (relative coordinates [dx, dy] from anchor)
interface PieceShape {
  cells: [number, number][];
}

// Full shapes for active gameplay
const PIECE_SHAPES: PieceShape[] = [
  { cells: [[0, 0]] }, // 1-block monomino
  {
    cells: [
      [0, 0],
      [1, 0],
    ],
  }, // 2-block horizontal domino
  {
    cells: [
      [0, 0],
      [0, 1],
    ],
  }, // 2-block vertical domino
  {
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
  }, // Corner tromino
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
  }, // 3-block horizontal
  {
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  }, // 2x2 square tetromino
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
  }, // T-piece
];

// Floating score indicator (+X points)
interface FloatingScore {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

// Particle for explosion effect
interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  size: number;
}

// Preset Scene 1: "1 řádek dole" (1 bottom row with a few cubes and open gaps)
const getDemoScene1Cubes = (): SettledCube[] => [
  { id: 'd1-1', col: 1, row: 0, color: COLOR_BLACK },
  { id: 'd1-2', col: 2, row: 0, color: COLOR_BLACK },
  { id: 'd1-4', col: 4, row: 0, color: COLOR_BLACK },
];

export const MiniFallingCubesInGap: React.FC = () => {
  // Main states: 'demo' | 'countdown' | 'playing' | 'name_entry' | 'post_leaderboard'
  const [gameState, setGameState] = useState<
    'demo' | 'countdown' | 'playing' | 'name_entry' | 'post_leaderboard'
  >('demo');

  // Demo scene: 1 (1 řádek dole) vs 2 (v půlce)
  const [demoScene, setDemoScene] = useState<1 | 2>(1);

  // Clickable HighScore Modal toggle (next to HRÁT?)
  const [showHighScoresModal, setShowHighScoresModal] = useState<boolean>(false);

  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [endReason, setEndReason] = useState<'gameover' | 'timeout'>('timeout');

  // Stavy pro poblikávání řádků před výbuchem (1x pro 1 řádek, 2x pro 2 řádky atd.)
  const [flashingLines, setFlashingLines] = useState<{
    rows: number[];
    flashOn: boolean;
  } | null>(null);
  const isProcessingLineClearRef = useRef<boolean>(false);

  // High Scores list (saved in localStorage, default empty so unfilled show "- - -")
  const [highScores, setHighScores] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('loyo_tetris_scores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // End-of-game 3-character slot entry (_ _ _)
  const [inputInitials, setInputInitials] = useState<string>('');
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  // Info popup state (button 'i')
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [infoPhase, setInfoPhase] = useState<'idle' | 'active' | 'exiting'>('idle');
  const [typedChars, setTypedChars] = useState<number>(0);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  const fullText = 'možná vás toto zaujalo.';
  const loadProgressRef = useRef<number>(0);
  loadProgressRef.current = loadProgress;

  useEffect(() => {
    let typeTimer: NodeJS.Timeout | null = null;
    let animFrameId: number | null = null;

    if (isHovered) {
      setInfoPhase('active');

      // Slower typewriter effect (approx 95ms per char -> ~2.3s total)
      setTypedChars(0);
      typeTimer = setInterval(() => {
        setTypedChars((prev) => {
          if (prev < fullText.length) {
            return prev + 1;
          }
          if (typeTimer) clearInterval(typeTimer);
          return prev;
        });
      }, 95);

      // Reveal progress from 0% (left) to 100% (right) over 3.2 seconds
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
      // When mouse leaves: 2.5 seconds exit phase!
      // Right side retracts from 100% (or current) down to 0% (from right to left)
      // Left side black box fades out
      if (infoPhase === 'active') {
        setInfoPhase('exiting');
        const exitStartTime = Date.now();
        const exitDuration = 2500; // 2.5 seconds exactly as requested
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

  // Board columns: Total 8 columns available (indexes 0 to 7)
  const TOTAL_COLS = 8;
  const boardWidth = TOTAL_COLS * STEP - GAP;
  const boardHeight = (MAX_ROWS + 1) * STEP; // +1 for spawn headroom

  // Dynamic active column boundaries based on elapsed time:
  // In demo mode: strictly columns 1 to 5 (5 columns)
  // In play mode:
  // 0-15s: 4 columns (indices 2 to 5)
  // 15-30s: 6 columns (indices 1 to 6)
  // 30-60s: 8 columns (indices 0 to 7)
  const getActiveColBounds = useCallback(
    (currTimeLeft: number, state: string): [number, number] => {
      if (state === 'demo') {
        return [1, 5]; // 5 columns in demo
      }
      const elapsed = 60 - currTimeLeft;
      if (elapsed < 15) return [2, 5]; // 4 columns
      if (elapsed < 30) return [1, 6]; // 6 columns
      return [0, 7]; // 8 columns (all)
    },
    [],
  );

  const [activeMinCol, setActiveMinCol] = useState<number>(1);
  const [activeMaxCol, setActiveMaxCol] = useState<number>(5);

  // Settled blocks
  const [settledCubes, setSettledCubes] = useState<SettledCube[]>(() => getDemoScene1Cubes());

  // Active falling piece
  const [fallingPiece, setFallingPiece] = useState<{
    cells: [number, number][]; // relative [dx, dy]
    col: number;
    y: number; // in px
    isBomb: boolean;
    color: string;
  } | null>(null);

  // Special Bomb Ability (Spacebar) Cooldown (30 seconds)
  const [bombCooldown, setBombCooldown] = useState<number>(0);
  const [nextIsBomb, setNextIsBomb] = useState<boolean>(false);

  // Visual effects
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [flashBoard, setFlashBoard] = useState<boolean>(false);

  // Trigger floating score popup
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

  // Spawn visual explosion particles in LoYo colors (Blue, Gold, Red)
  const triggerExplosion = useCallback((centerX: number, centerY: number, count: number = 20) => {
    const colors = [COLOR_BLUE, COLOR_GOLD, COLOR_GOLD, COLOR_BLUE, '#ffffff', COLOR_RED];
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 2.5 + Math.random() * 3.5;
      newParticles.push({
        id: `p-${Date.now()}-${i}`,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        size: 3 + Math.random() * 4,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.05,
          }))
          .filter((p) => p.opacity > 0),
      );
    }, 24);
    return () => clearInterval(interval);
  }, [particles.length]);

  // Demo režim: Nekonečně běžící živé pozadí - žádné zamrzání, neustále padají nové kostičky do nekonečna
  useEffect(() => {
    if (gameState !== 'demo') return;

    setActiveMinCol(1);
    setActiveMaxCol(5);
    setSettledCubes(getDemoScene1Cubes());
    setFallingPiece(null);
  }, [gameState]);

  // START GAME sequence: 3... 2... 1... START!
  const startGame = () => {
    setShowHighScoresModal(false);
    setGameState('countdown');
    setCountdown(3);
    setSettledCubes([]); // "prázdné pole"
    setScore(0);
    setTimeLeft(60);
    setBombCooldown(0);
    setNextIsBomb(false);
    setInputInitials('');
    setActiveSlot(0);
    setFallingPiece(null);
    setIsHovered(false);
    setInfoPhase('idle');

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(0);
        setGameState('playing');
      }
    }, 1000);
  };

  // Cooldown timer during active play
  useEffect(() => {
    if (gameState !== 'playing') return;

    const secondTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setEndReason('timeout');
          setGameState('name_entry');
          setInputInitials('');
          setActiveSlot(0);
          return 0;
        }
        return prev - 1;
      });

      setBombCooldown((cd) => (cd > 0 ? cd - 1 : 0));
    }, 1000);

    return () => clearInterval(secondTimer);
  }, [gameState]);

  // Update active boundaries based on time left in game
  useEffect(() => {
    if (gameState === 'playing') {
      const [minCol, maxCol] = getActiveColBounds(timeLeft, 'playing');
      setActiveMinCol(minCol);
      setActiveMaxCol(maxCol);
    }
  }, [timeLeft, gameState, getActiveColBounds]);

  // Fall speed:
  // Scaled proportionally for 13px step (smooth and leisurely)
  const getFallSpeed = useCallback((): number => {
    if (gameState === 'demo') return 0.75;
    const elapsed = 60 - timeLeft;
    if (elapsed >= 45) {
      return 1.8;
    }
    return 1.1;
  }, [gameState, timeLeft]);

  // Spawn piece (všechny padající kostičky jsou ŽLUTOZELENÉ #bef264 dle požadavku)
  const spawnPiece = useCallback(() => {
    if (gameState !== 'playing' && gameState !== 'demo') return;

    if (gameState === 'demo') {
      // V demo režimu pestřejší tvary padajících kostiček, které chytře zaplňují mezery
      const demoPieceShapes: PieceShape[] = [
        { cells: [[0, 0]] }, // 1-kostička
        {
          cells: [
            [0, 0],
            [1, 0],
          ],
        }, // 2-kostička vodorovně
        {
          cells: [
            [0, 0],
            [0, 1],
          ],
        }, // 2-kostička svisle
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
        }, // 3-kostička vodorovně
      ];
      const shape = demoPieceShapes[Math.floor(Math.random() * demoPieceShapes.length)];
      const maxDx = Math.max(...shape.cells.map((c) => c[0]));
      const pieceWidth = maxDx + 1;

      // Dostupné sloupce 1..5
      const validCols: number[] = [];
      for (let c = 1; c <= 5 - pieceWidth + 1; c++) {
        validCols.push(c);
      }

      // Seřadíme sloupce podle nejnižší výšky, aby kostičky pěkně doplňovaly řádky
      validCols.sort((colA, colB) => {
        const heightA = settledCubes.filter((b) => b.col === colA).length;
        const heightB = settledCubes.filter((b) => b.col === colB).length;
        return heightA - heightB;
      });

      // Zvolíme ze 2 nejnižších sloupců
      const topChoices = validCols.slice(0, Math.min(2, validCols.length));
      const chosenCol =
        topChoices.length > 0 ? topChoices[Math.floor(Math.random() * topChoices.length)] : 1;

      setFallingPiece({
        cells: shape.cells,
        col: chosenCol,
        y: -CUBE_SIZE * 2,
        isBomb: false,
        color: COLOR_FALLING, // ŽLUTOZELENÁ dle požadavku
      });
      return;
    }

    // Active gameplay spawn
    const [minCol, maxCol] = getActiveColBounds(timeLeft, 'playing');
    const isBomb = nextIsBomb;
    setNextIsBomb(false);

    if (isBomb) {
      const col = Math.floor(minCol + Math.random() * (maxCol - minCol + 1));
      setFallingPiece({
        cells: [[0, 0]],
        col,
        y: -CUBE_SIZE,
        isBomb: true,
        color: COLOR_RED,
      });
      return;
    }

    const shape = PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)];
    const maxDx = Math.max(...shape.cells.map((c) => c[0]));
    const pieceWidth = maxDx + 1;

    const validCols: number[] = [];
    for (let c = minCol; c <= maxCol - pieceWidth + 1; c++) {
      validCols.push(c);
    }
    const chosenCol =
      validCols.length > 0 ? validCols[Math.floor(Math.random() * validCols.length)] : minCol;

    // Padající kostičky jsou ŽLUTOZELENÉ (#bef264) dle požadavku
    setFallingPiece({
      cells: shape.cells,
      col: chosenCol,
      y: -CUBE_SIZE * 2,
      isBomb: false,
      color: COLOR_FALLING,
    });
  }, [gameState, getActiveColBounds, nextIsBomb, settledCubes, timeLeft]);

  // Trigger special bomb ability (Spacebar)
  const triggerBomb = useCallback(() => {
    if (gameState !== 'playing') return;
    if (bombCooldown > 0) return;

    setNextIsBomb(true);
    setBombCooldown(30);

    setFlashBoard(true);
    setTimeout(() => setFlashBoard(false), 200);
  }, [bombCooldown, gameState]);

  // Movement: Left & Right
  const moveHorizontal = useCallback(
    (direction: -1 | 1) => {
      if (!fallingPiece || gameState !== 'playing') return;

      const newCol = fallingPiece.col + direction;
      const maxDx = Math.max(...fallingPiece.cells.map((c) => c[0]));
      const minDx = Math.min(...fallingPiece.cells.map((c) => c[0]));

      if (newCol + minDx < activeMinCol || newCol + maxDx > activeMaxCol) {
        return;
      }

      const collides = fallingPiece.cells.some(([dx, dy]) => {
        const col = newCol + dx;
        const cubesInCol = settledCubes.filter((b) => b.col === col);
        const highestRow = cubesInCol.length;
        const restingY = boardHeight - (highestRow + 1) * STEP;
        return fallingPiece.y + dy * STEP >= restingY;
      });

      if (!collides) {
        setFallingPiece((prev) => (prev ? { ...prev, col: newCol } : null));
      }
    },
    [activeMaxCol, activeMinCol, boardHeight, fallingPiece, gameState, settledCubes],
  );

  // Fast drop (Down arrow)
  const dropFast = useCallback(() => {
    if (!fallingPiece || gameState !== 'playing') return;
    setFallingPiece((prev) => (prev ? { ...prev, y: prev.y + 8 } : null));
  }, [fallingPiece, gameState]);

  // Auto-focus input during initials entry
  useEffect(() => {
    if (gameState === 'name_entry' && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [gameState]);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'name_entry') {
        if (e.key === 'Backspace') {
          e.preventDefault();
          setInputInitials((prev) => {
            const next = prev.slice(0, -1);
            setActiveSlot(next.length);
            return next;
          });
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          if (inputInitials.length === 3) {
            submitInitials(inputInitials);
          }
          return;
        }

        // Allow alphanumeric A-Z, 0-9
        const char = e.key.toUpperCase();
        if (/^[A-Z0-9]$/.test(char) && inputInitials.length < 3) {
          e.preventDefault();
          setInputInitials((prev) => {
            const next = (prev + char).slice(0, 3);
            setActiveSlot(next.length);
            return next;
          });
        }
        return;
      }

      if (gameState === 'playing') {
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          triggerBomb();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          moveHorizontal(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          moveHorizontal(1);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          dropFast();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dropFast, gameState, inputInitials, moveHorizontal, triggerBomb]);

  // Kontrola a animace propojování řádků:
  // "kdyz propoji uzivatel radek = poblikne 1, kdyz pouze jeden radek bouchne. kdyz dva = problikne 2x, ... po vybuchu radku +body pripise"
  const triggerLineClearSequence = useCallback(
    (
      cubes: SettledCube[],
      minC: number,
      maxC: number,
      onComplete: (remainingCubes: SettledCube[]) => void,
    ) => {
      const activeWidth = maxC - minC + 1;
      const fullRows: number[] = [];

      for (let r = 0; r < MAX_ROWS; r++) {
        const cubesInRow = cubes.filter((b) => b.row === r && b.col >= minC && b.col <= maxC);
        if (cubesInRow.length >= activeWidth) {
          fullRows.push(r);
        }
      }

      if (fullRows.length === 0) {
        isProcessingLineClearRef.current = false;
        onComplete(cubes);
        return;
      }

      // Počet pobliknutí přesně odpovídá počtu propojených řádků (1 řádek = 1x, 2 řádky = 2x, ...)
      isProcessingLineClearRef.current = true;
      const flashTotal = fullRows.length;
      let currentStep = 0;
      const totalSteps = flashTotal * 2; // každý cyklus má ON (rozsvíceno) a OFF (zhasnuto)

      const flashInterval = setInterval(() => {
        currentStep++;
        const isFlashOn = currentStep % 2 === 1;

        if (currentStep <= totalSteps) {
          setFlashingLines({ rows: fullRows, flashOn: isFlashOn });
        } else {
          clearInterval(flashInterval);
          setFlashingLines(null);

          // 1. VÝBUCH ŘÁDKŮ (částice a otřes)
          fullRows.forEach((r) => {
            for (let c = minC; c <= maxC; c++) {
              triggerExplosion(c * STEP + CUBE_SIZE / 2, boardHeight - r * STEP - CUBE_SIZE / 2, 9);
            }
          });
          setFlashBoard(true);
          setTimeout(() => setFlashBoard(false), 200);

          // 2. SMAZÁNÍ PLNÝCH ŘÁDKŮ A POSUNUTÍ VYŠŠÍCH KOSTIČEK DOLŮ
          let updatedCubes = cubes.filter(
            (b) => !(fullRows.includes(b.row) && b.col >= minC && b.col <= maxC),
          );
          fullRows
            .slice()
            .sort((a, b) => b - a)
            .forEach((clearedRow) => {
              updatedCubes = updatedCubes.map((b) =>
                b.row > clearedRow && b.col >= minC && b.col <= maxC ? { ...b, row: b.row - 1 } : b,
              );
            });
          setSettledCubes(updatedCubes);

          // 3. PO VYBUCHU PŘIPÍŠE BODY
          if (gameState === 'playing') {
            const basePoints =
              flashTotal === 1 ? 100 : flashTotal === 2 ? 300 : flashTotal === 3 ? 600 : 1200;
            const addedScore = basePoints * activeWidth;
            setScore((s) => s + addedScore);
            showFloatingScore(
              `+${addedScore}!`,
              ((minC + maxC) / 2) * STEP,
              boardHeight / 2,
              COLOR_GOLD,
            );
          }

          setTimeout(() => {
            isProcessingLineClearRef.current = false;
            onComplete(updatedCubes);
          }, 120);
        }
      }, 150);
    },
    [boardHeight, gameState, showFloatingScore, triggerExplosion],
  );

  // Physics loop (runs both for Demo and Playing)
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'demo') return;

    if (!fallingPiece) {
      const delay = gameState === 'demo' ? 240 : 60;
      const spawnTimer = setTimeout(() => {
        if (!isProcessingLineClearRef.current) {
          spawnPiece();
        }
      }, delay);
      return () => clearTimeout(spawnTimer);
    }

    let animId: number;

    const tick = () => {
      if (!fallingPiece) return;

      const speed = getFallSpeed();
      const currentY = fallingPiece.y;
      const nextY = currentY + speed;

      let shouldLand = false;

      for (const [dx, dy] of fallingPiece.cells) {
        const col = fallingPiece.col + dx;
        const currentStackInCol = settledCubes.filter((b) => b.col === col);
        const stackHeight = currentStackInCol.length;

        const cellBottom = nextY + dy * STEP + CUBE_SIZE;
        const restingBottom = boardHeight - stackHeight * STEP;

        if (cellBottom >= restingBottom) {
          shouldLand = true;
          break;
        }
      }

      if (shouldLand) {
        if (gameState === 'demo') {
          // Demo landing: kostička dopadne a zčerná (COLOR_BLACK)
          const newSettled: SettledCube[] = [...settledCubes];
          for (const [dx] of fallingPiece.cells) {
            const col = fallingPiece.col + dx;
            const currentStack = newSettled.filter((b) => b.col === col);
            const row = currentStack.length;

            if (row < MAX_ROWS) {
              newSettled.push({
                id: `demo-landed-${Date.now()}-${col}-${row}`,
                col,
                row,
                color: COLOR_BLACK, // dopadne tak černá
              });
            }
          }

          setSettledCubes(newSettled);
          setFallingPiece(null);

          // Zkontrolujeme a odpálíme řádky
          triggerLineClearSequence(newSettled, 1, 5, (afterCubes) => {
            // Aby se pozadí v demo režimu nikdy nezaseklo ("do nekonečna"):
            // Pokud jakýkoliv sloupec dosáhne 4 nebo více, mini-výbuchem odpaříme spodek
            const maxColHeight = Math.max(
              ...[1, 2, 3, 4, 5].map((c) => afterCubes.filter((b) => b.col === c).length),
            );
            if (maxColHeight >= 4) {
              afterCubes
                .filter((b) => b.row === 0 && b.col >= 1 && b.col <= 5)
                .forEach((b) => {
                  triggerExplosion(
                    b.col * STEP + CUBE_SIZE / 2,
                    boardHeight - b.row * STEP - CUBE_SIZE / 2,
                    6,
                  );
                });
              const finalCubes = afterCubes
                .filter((b) => !(b.row === 0 && b.col >= 1 && b.col <= 5))
                .map((b) => (b.col >= 1 && b.col <= 5 ? { ...b, row: b.row - 1 } : b));
              setSettledCubes(finalCubes);
            }

            // Spustíme další dílek - ukázka nikdy nezamrzne a běží do nekonečna
            setTimeout(() => {
              isProcessingLineClearRef.current = false;
              spawnPiece();
            }, 120);
          });
          return;
        }

        // Playing mode landing
        if (fallingPiece.isBomb) {
          const bombCol = fallingPiece.col;
          const currentStack = settledCubes.filter((b) => b.col === bombCol);
          const impactRow = currentStack.length;

          const impactX = bombCol * STEP + CUBE_SIZE / 2;
          const impactY = boardHeight - impactRow * STEP - CUBE_SIZE / 2;

          triggerExplosion(impactX, impactY, 32);

          const destroyedCubes = settledCubes.filter(
            (b) => Math.abs(b.col - bombCol) <= 1 && Math.abs(b.row - impactRow) <= 2,
          );

          const destroyedCount = Math.max(3, destroyedCubes.length);
          const bombPoints = destroyedCount * 50;

          setScore((s) => s + bombPoints);
          showFloatingScore(`BOMBA! +${bombPoints}`, impactX, impactY, COLOR_GOLD);

          const surviving = settledCubes.filter(
            (b) => !(Math.abs(b.col - bombCol) <= 1 && Math.abs(b.row - impactRow) <= 2),
          );

          const compacted: SettledCube[] = [];
          for (let c = 0; c < TOTAL_COLS; c++) {
            const colCubes = surviving.filter((b) => b.col === c).sort((a, b) => a.row - b.row);
            colCubes.forEach((cube, idx) => {
              compacted.push({ ...cube, row: idx });
            });
          }

          setSettledCubes(compacted);
          setFallingPiece(null);
          setTimeout(() => {
            isProcessingLineClearRef.current = false;
            spawnPiece();
          }, 120);
        } else {
          let isGameOver = false;
          const newSettled: SettledCube[] = [...settledCubes];

          for (const [dx] of fallingPiece.cells) {
            const col = fallingPiece.col + dx;
            const currentStack = newSettled.filter((b) => b.col === col);
            const row = currentStack.length;

            if (row >= MAX_ROWS) {
              isGameOver = true;
            }

            const isTopAlert = row === MAX_ROWS - 1;
            newSettled.push({
              id: `settled-${Date.now()}-${col}-${row}`,
              col,
              row,
              color: isTopAlert ? COLOR_RED : COLOR_BLACK, // dopadne tak černá
              isRedAlert: isTopAlert,
            });
          }

          if (isGameOver) {
            triggerExplosion(boardWidth / 2, boardHeight / 2, 40);
            setEndReason('gameover');
            setGameState('name_entry');
            setInputInitials('');
            setActiveSlot(0);
            setFallingPiece(null);
            return;
          }

          setSettledCubes(newSettled);
          setFallingPiece(null);

          // Propojení řádku: 1x poblikne pro 1 řádek, 2x pro 2 řádky, po výbuchu připíše body!
          triggerLineClearSequence(newSettled, activeMinCol, activeMaxCol, () => {
            setScore((s) => s + fallingPiece.cells.length * 10);
            setTimeout(() => {
              isProcessingLineClearRef.current = false;
              spawnPiece();
            }, 100);
          });
        }
      } else {
        setFallingPiece((prev) => (prev ? { ...prev, y: nextY } : null));
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [
    activeMaxCol,
    activeMinCol,
    boardHeight,
    boardWidth,
    demoScene,
    fallingPiece,
    gameState,
    getFallSpeed,
    settledCubes,
    showFloatingScore,
    spawnPiece,
    triggerExplosion,
    triggerLineClearSequence,
  ]);

  // Submit initials -> Show HIGHSCORE Leaderboard (8 slots)
  const submitInitials = (cleanInitials: string) => {
    const formatted = cleanInitials.toUpperCase().slice(0, 3);
    const newRecord: ScoreRecord = {
      initials: formatted,
      score,
      date: 'Nyní',
    };
    const updated = [...highScores, newRecord].sort((a, b) => b.score - a.score).slice(0, 8);
    setHighScores(updated);
    try {
      localStorage.setItem('loyo_tetris_scores', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setGameState('post_leaderboard');
  };

  // Back to Demo
  const returnToDemo = () => {
    setGameState('demo');
    setDemoScene(1);
    setSettledCubes(getDemoScene1Cubes());
    setFallingPiece(null);
    setShowHighScoresModal(false);
  };

  // Auto-return to demo after 10 seconds of showing high scores
  useEffect(() => {
    if (gameState !== 'post_leaderboard') return;
    const autoReturnTimer = setTimeout(() => {
      returnToDemo();
    }, 10000); // 10 seconds
    return () => clearTimeout(autoReturnTimer);
  }, [gameState]);

  return (
    <div
      className={`relative w-full h-27.5 sm:h-30 overflow-visible select-none flex flex-col justify-end items-center transition-colors duration-200 ${
        flashBoard ? 'bg-amber-400/15' : 'bg-transparent'
      }`}
      style={{ marginBottom: '0px' }}
    >
      {/* ========================================================================= */}
      {/* DEMO REŽIM: VÝCHOZÍ HIGHSCORE + HRÁT?                                      */}
      {/* PŘI NAJETÍ NA ( i ): HIGHSCORE + HRÁT? POMALU ZMIZÍ                        */}
      {/* PŘI ODJETÍ Z ( i ): JEŠTĚ 2.5s MIZÍ INFO A PAK SE HIGHSCORE + HRÁT VRÁTÍ    */}
      {/* ========================================================================= */}
      {gameState === 'demo' && (
        <>
          {/* 1. VÝCHOZÍ TLAČÍTKA: HIGHSCORE (VLEVO) + HRÁT? (VPRAVO) */}
          <div
            className={`absolute top-1 inset-x-0 flex items-center justify-between px-2 sm:px-3 z-20 pointer-events-auto min-h-8 transition-all duration-300 ${
              infoPhase !== 'idle'
                ? 'opacity-0 pointer-events-none -translate-y-1'
                : 'opacity-100 pointer-events-auto translate-y-0'
            }`}
          >
            {/* VLEVO: HIGHSCORE */}
            <button
              onClick={() => setShowHighScoresModal((prev) => !prev)}
              className={`h-6 sm:h-7 px-2.5 rounded-lg border-2 border-[#18181b] font-heading font-black text-2.5 sm:text-xs tracking-wider uppercase flex items-center cursor-pointer transition-all ${
                showHighScoresModal
                  ? 'bg-loyo-mustard text-[#18181b] shadow-[2px_2px_0px_#18181b] -translate-y-0.5'
                  : 'bg-white hover:bg-zinc-100 text-[#18181b] shadow-[2px_2px_0px_#18181b] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b]'
              }`}
              title="Zobrazit HIGHSCORE"
            >
              <span>HIGHSCORE</span>
            </button>

            {/* VPRAVO: HRÁT? */}
            <button
              onClick={startGame}
              className="h-6 sm:h-7 px-3 rounded-lg bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-[#18181b] shadow-[2px_2px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] font-heading font-black text-2.5 sm:text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>HRÁT?</span>
              <span className="text-loyo-mustard">▶</span>
            </button>
          </div>

          {/* 2. VLEVO: KOMIKSOVÁ BUBLINA "MINIGAME" JDE MÍRNĚ NAHORU A DOLEVA (POZICE LOCK NA VŠECH ZAŘÍZENÍCH) */}
          {/* NADPIS: POUZE MINIGAME (HOŘČIČNÁ BARVA #CDA24D, JEDNOU ZA 5s PROBLIKNE), POPIS: ŠEDÝ */}
          <div
            className={`absolute z-40 bg-[#18181b] border-2 border-[#18181b] rounded-xl p-2 shadow-[3px_3px_0px_#000] text-white flex flex-col justify-center min-w-31.25 max-w-37.5 -rotate-2 origin-bottom-right ${
              infoPhase === 'active'
                ? 'opacity-100 translate-x-0 -translate-y-1 transition-all duration-300 pointer-events-auto'
                : infoPhase === 'exiting'
                  ? 'opacity-0 -translate-x-1 -translate-y-1 transition-all duration-2500 pointer-events-none'
                  : 'opacity-0 pointer-events-none -translate-x-2 translate-y-0'
            }`}
            style={{
              right: 'calc(50% + 50px)',
              top: '-10px',
            }}
          >
            {/* Ocas komiksové bubliny mířící dolů doprava ke hře */}
            <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-[#18181b] border-r-2 border-b-2 border-[#18181b] rotate-45 pointer-events-none" />

            <div
              className="font-heading font-black text-2.75 sm:text-3 text-loyo-mustard uppercase tracking-wider flex items-center gap-1.5 leading-tight whitespace-nowrap"
              style={{ animation: 'blink-5s 5s infinite ease-in-out' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] shrink-0" />
              <span>MINIGAME</span>
            </div>
            <div className="font-sans text-2.25 sm:text-2.5 text-zinc-400 font-medium leading-tight mt-1 min-h-3.5">
              {fullText.slice(0, typedChars)}
              {typedChars < fullText.length && infoPhase === 'active' && (
                <span className="inline-block w-1 h-2.5 bg-[#bef264] ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>

          {/* 3. VPRAVO: KOMIKSOVÁ BUBLINA "OVLÁDÁNÍ:" JDE MÍRNĚ NAHORU A DOPRAVA (POZICE LOCK) */}
          {/* NADPIS: OVLÁDÁNÍ: (HOŘČIČNÁ #CDA24D), MEZERNÍK + ŠIPKY, 0% DO 100% V 3s, MIZÍ 2.5s */}
          <div
            className={`absolute z-40 bg-[#18181b] border-2 border-[#18181b] rounded-xl p-2 shadow-[3px_3px_0px_#000] text-white flex flex-col items-start min-w-35 rotate-2 origin-bottom-left ${
              infoPhase === 'active'
                ? 'opacity-100 pointer-events-auto -translate-y-1 transition-all duration-300'
                : infoPhase === 'exiting'
                  ? 'opacity-100 pointer-events-none -translate-y-1'
                  : 'opacity-0 pointer-events-none translate-y-0'
            }`}
            style={{
              left: 'calc(50% + 50px)',
              top: '-10px',
            }}
          >
            {/* Ocas komiksové bubliny mířící dolů doleva ke hře */}
            <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-[#18181b] border-l-2 border-b-2 border-[#18181b] -rotate-45 pointer-events-none" />

            {/* NADPIS VPRAVO: OVLÁDÁNÍ: */}
            <div className="font-heading font-black text-2.625 sm:text-2.75 text-loyo-mustard uppercase tracking-wider flex items-center gap-1.5 leading-tight mb-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-loyo-mustard shrink-0" />
              <span>OVLÁDÁNÍ:</span>
            </div>

            {/* PILULKA KLÁVES SE SPOJITÝM ODKRÝVÁNÍM Z 0% DO 100% A ZATAHOVÁNÍM 100% -> 0% */}
            <div
              className="flex items-center gap-1 bg-[#27272a] text-white border border-zinc-600 rounded-lg px-1.5 py-0.5 shadow-[1px_1px_0px_#000] overflow-hidden transition-all"
              style={{
                clipPath: `inset(0 ${100 - loadProgress}% 0 0)`,
              }}
            >
              {/* MEZERNÍK */}
              <div className="px-1.5 py-0.5 rounded font-mono font-black text-2.125 sm:text-2.375 tracking-tight uppercase bg-loyo-mustard text-[#18181b] shadow-[1px_1px_0px_#fff] whitespace-nowrap">
                MEZERNÍK
              </div>

              {/* 3 KOSTIČKY ŠIPEK: ← ↓ → */}
              <div className="flex items-center gap-0.5 shrink-0">
                <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-white text-[#18181b] border border-[#18181b] font-black text-2.25 flex items-center justify-center shadow-[1px_1px_0px_#18181b]">
                  ←
                </div>
                <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-white text-[#18181b] border border-[#18181b] font-black text-2.25 flex items-center justify-center shadow-[1px_1px_0px_#18181b]">
                  ↓
                </div>
                <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-white text-[#18181b] border border-[#18181b] font-black text-2.25 flex items-center justify-center shadow-[1px_1px_0px_#18181b]">
                  →
                </div>
              </div>
            </div>

            {/* INDIKÁTOR NAČÍTÁNÍ (0% -> 100% PŘI NAJETÍ, 100% -> 0% PŘI ODJETÍ) */}
            <div
              className="h-1 bg-zinc-700/60 rounded-full mt-1 overflow-hidden border border-[#18181b] w-full"
              style={{
                clipPath: `inset(0 ${100 - loadProgress}% 0 0)`,
              }}
            >
              <div className="h-full bg-loyo-mustard" style={{ width: `${loadProgress}%` }} />
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* ČAS PŘI HRANÍ: ČERNÉ KOLEČKO VPRAVO NAHOŘE S ORANŽOVÝM OBRYSEM DLE OBRÁZKU 3 */}
      {/* ŽLUTOZELENÝ ČAS -> PŘI 10, 5, 4, 3, 2, 1 SE ZVĚTŠÍ A ZČERVENÁ */}
      {/* ========================================================================= */}
      {gameState === 'playing' && (
        <div className="absolute top-1 right-2 z-30 pointer-events-none">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18181b] border-2 shadow-[2px_2px_0px_#18181b] flex items-center justify-center transition-all duration-200 ${
              [10, 5, 4, 3, 2, 1].includes(timeLeft)
                ? 'border-loyo-red scale-125 shadow-[0_0_10px_rgba(172,0,1,0.85)]'
                : 'border-orange-500 scale-100'
            }`}
          >
            <span
              className={`font-mono font-black text-xs sm:text-sm leading-none transition-all duration-200 ${
                [10, 5, 4, 3, 2, 1].includes(timeLeft)
                  ? 'text-loyo-red scale-135'
                  : 'text-[#d9ff00]'
              }`}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIGHSCORE OVERLAY: POUZE "HIGHSCORE" - 4 A 4 (8 MÍST) VEDLE SEBE */}
      {/* ========================================================================= */}
      {showHighScoresModal && gameState === 'demo' && (
        <div className="absolute inset-x-1.5 bottom-1 top-8 z-40 bg-white/95 backdrop-blur-xs border-2 border-[#18181b] rounded-xl shadow-[3px_3px_0px_#18181b] p-1.5 flex flex-col justify-between animate-in fade-in zoom-in-95">
          <div>
            <div className="flex items-center justify-between border-b border-[#18181b]/15 pb-0.5 mb-1">
              <span className="font-heading font-black text-2.75 uppercase tracking-wider text-loyo-blue">
                HIGHSCORE
              </span>
              <button
                onClick={() => setShowHighScoresModal(false)}
                className="w-4 h-4 rounded bg-zinc-200 hover:bg-zinc-300 text-[#18181b] flex items-center justify-center text-2.5 font-black cursor-pointer"
                title="Zavřít"
              >
                ✕
              </button>
            </div>

            {/* 4 a 4 (8 míst celkem) ve dvou sloupcích, body těsně u přezdívky */}
            <div className="grid grid-cols-2 gap-1 w-full">
              {/* Sloupec 1: 1. až 4. místo */}
              <div className="space-y-0.5">
                {Array.from({ length: 4 }).map((_, i) => {
                  const idx = i;
                  const item = highScores[idx];
                  const isPresent = !!item && item.score > 0;
                  return (
                    <div
                      key={idx}
                      className="flex items-center text-2.25 sm:text-2.5 font-mono px-1 py-0.5 rounded bg-[#f4f4f5] border border-zinc-200"
                    >
                      <span className="font-bold text-[#18181b] w-3.5 shrink-0">{idx + 1}.</span>
                      <span
                        className={`font-black tracking-wider ${
                          isPresent ? 'text-loyo-blue' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? item.initials : '---'}
                      </span>
                      <strong
                        className={`ml-1.5 font-heading font-black truncate ${
                          isPresent ? 'text-[#18181b]' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? `${item.score}b` : '-'}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* Sloupec 2: 5. až 8. místo */}
              <div className="space-y-0.5">
                {Array.from({ length: 4 }).map((_, i) => {
                  const idx = i + 4;
                  const item = highScores[idx];
                  const isPresent = !!item && item.score > 0;
                  return (
                    <div
                      key={idx}
                      className="flex items-center text-2.25 sm:text-2.5 font-mono px-1 py-0.5 rounded bg-[#f4f4f5] border border-zinc-200"
                    >
                      <span className="font-bold text-[#18181b] w-3.5 shrink-0">{idx + 1}.</span>
                      <span
                        className={`font-black tracking-wider ${
                          isPresent ? 'text-loyo-blue' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? item.initials : '---'}
                      </span>
                      <strong
                        className={`ml-1.5 font-heading font-black truncate ${
                          isPresent ? 'text-[#18181b]' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? `${item.score}b` : '-'}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5 border-t border-zinc-100">
            <span className="text-2.25 font-mono text-zinc-500">--- = neumístěn</span>
            <button
              onClick={() => setShowHighScoresModal(false)}
              className="px-2 py-0.5 bg-[#18181b] hover:bg-zinc-800 text-white rounded font-heading font-bold text-2.25 uppercase cursor-pointer transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ( i ) TLAČÍTKO VPRAVO DOLE V DÍŘE (PŘI NAJETÍ AKTIVUJE infoPhase)         */}
      {/* ========================================================================= */}
      <div
        className="absolute bottom-1.5 right-2 sm:right-3 z-40 flex items-center gap-1.5 pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* PŘI SAMOTNÉM HRANÍ (gameState === 'playing') MÁ HRÁČ DOSTUPNÉ TLAČÍTKA DOLE PRO TOUCH/MYŠ */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-1 bg-[#18181b] text-white border-2 border-[#18181b] rounded-lg px-1.5 py-0.5 shadow-[2px_2px_0px_#18181b] animate-in fade-in">
            {/* TLAČÍTKO MEZERNÍK */}
            <button
              onClick={triggerBomb}
              className={`px-1.5 py-0.5 rounded font-mono font-bold text-2.25 sm:text-2.5 tracking-tight uppercase flex items-center gap-0.5 transition-all ${
                bombCooldown === 0
                  ? 'bg-loyo-mustard text-[#18181b] cursor-pointer shadow-[1px_1px_0px_#fff] active:scale-95 animate-pulse'
                  : 'bg-zinc-800 text-loyo-mustard hover:bg-zinc-700 cursor-default'
              }`}
              title="Mezerník = Speciální bomba"
            >
              <span>MEZERNÍK</span>
            </button>

            {/* 3 KOSTIČKY ŠIPEK: ← ↓ → */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => moveHorizontal(-1)}
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-white hover:bg-zinc-100 text-[#18181b] border border-[#18181b] font-bold text-2.5 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#18181b] active:translate-y-0.5"
                title="Doleva (←)"
              >
                ←
              </button>
              <button
                onClick={dropFast}
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-white hover:bg-zinc-100 text-[#18181b] border border-[#18181b] font-bold text-2.5 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#18181b] active:translate-y-0.5"
                title="Dolů / Zrychlit (↓)"
              >
                ↓
              </button>
              <button
                onClick={() => moveHorizontal(1)}
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-white hover:bg-zinc-100 text-[#18181b] border border-[#18181b] font-bold text-2.5 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#18181b] active:translate-y-0.5"
                title="Doprava (→)"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* KULATÉ TLAČÍTKO ( i ) NA PRAVÉ STRANĚ DOLE V DÍŘE */}
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsHovered((prev) => !prev)}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#18181b] shadow-[1.5px_1.5px_0px_#18181b] flex items-center justify-center font-heading font-black text-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 z-40 ${
            infoPhase !== 'idle'
              ? 'bg-loyo-mustard text-[#18181b] scale-105 shadow-[2px_2px_0px_#18181b]'
              : 'bg-white hover:bg-zinc-100 text-[#18181b]'
          }`}
          title="Minigame pauza • Nápověda ovládání"
        >
          i
        </button>
      </div>

      {/* ========================================================================= */}
      {/* COUNTDOWN OVERLAY: 3 ... 2 ... 1 ... START! */}
      {/* ========================================================================= */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center animate-in fade-in">
          <div className="font-heading font-black text-4xl sm:text-5xl text-loyo-blue tracking-tight animate-bounce">
            {countdown > 0 ? countdown : 'START!'}
          </div>
          <span className="text-2.5 font-mono uppercase tracking-widest text-[#555] mt-0.5">
            Použij mezerník a šipky!
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* END OF GAME: SCORE + 3 BLINKING SLOTS (_ _ _) + OK / ZRUŠIT */}
      {/* ========================================================================= */}
      {gameState === 'name_entry' && (
        <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center animate-in zoom-in-95">
          <input
            ref={textInputRef}
            type="text"
            maxLength={3}
            value={inputInitials}
            onChange={(e) => {
              const clean = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, 3);
              setInputInitials(clean);
              setActiveSlot(clean.length);
            }}
            className="absolute opacity-0 pointer-events-none w-1 h-1"
          />

          <div className="text-2.25 font-mono uppercase font-bold text-loyo-red tracking-wider">
            {endReason === 'gameover' ? 'PŘETEČENÍ KOSTIČEK!' : '1 MINUTA UPLYNULA!'}
          </div>

          <div className="font-heading font-black text-base sm:text-lg text-[#18181b] tracking-tight">
            SKÓRE: <span className="text-loyo-blue">{score} BODŮ</span>
          </div>

          {/* 3 Interactive Character Slots (_ _ _) */}
          <div className="mt-1 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((slotIdx) => {
              const char = inputInitials[slotIdx] || '';
              const isCurrent = slotIdx === activeSlot && inputInitials.length < 3;

              return (
                <div
                  key={slotIdx}
                  onClick={() => {
                    textInputRef.current?.focus();
                  }}
                  className={`w-8 h-9 rounded-lg border-2 flex items-center justify-center font-heading font-black text-base transition-all cursor-text ${
                    isCurrent
                      ? 'border-[#18181b] bg-loyo-mustard/25 shadow-[1.5px_1.5px_0px_#18181b] ring-2 ring-[#18181b]'
                      : 'border-[#18181b] bg-white shadow-[1.5px_1.5px_0px_#18181b]'
                  }`}
                >
                  {char ? (
                    <span className="text-[#18181b]">{char}</span>
                  ) : isCurrent ? (
                    <span className="text-[#18181b] animate-ping font-mono font-bold text-sm">
                      _
                    </span>
                  ) : (
                    <span className="text-zinc-300 font-mono text-xs">_</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons: OK and Zrušit */}
          <div className="mt-1.5 flex items-center gap-2">
            <button
              onClick={() => {
                if (inputInitials.length === 3) {
                  submitInitials(inputInitials);
                }
              }}
              disabled={inputInitials.length !== 3}
              className={`h-6 px-3 rounded-lg font-heading font-bold text-2.5 uppercase tracking-wider border-2 transition-all ${
                inputInitials.length === 3
                  ? 'bg-loyo-blue hover:bg-[#03086b] text-white border-[#18181b] shadow-[2px_2px_0px_#18181b] cursor-pointer active:translate-y-0.5'
                  : 'bg-zinc-200 text-zinc-400 border-zinc-400 cursor-not-allowed shadow-none'
              }`}
            >
              OK
            </button>

            <button
              onClick={returnToDemo}
              className="h-6 px-2 font-mono font-bold text-2.5 text-[#555] hover:text-[#18181b] underline cursor-pointer"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POST-CONFIRMATION LEADERBOARD TABLE: POUZE "HIGHSCORE" - 4 A 4 (8 MÍST) */}
      {/* ========================================================================= */}
      {gameState === 'post_leaderboard' && (
        <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-between p-1.5 text-center animate-in zoom-in-95">
          <div className="w-full">
            <div className="text-2.75 font-heading font-black text-loyo-blue uppercase tracking-wider">
              HIGHSCORE
            </div>

            {/* 4 a 4 (8 míst) ve dvou sloupcích, body těsně u přezdívky */}
            <div className="mt-1 grid grid-cols-2 gap-1 w-full max-w-67.5 mx-auto">
              {/* Sloupec 1: 1. až 4. místo */}
              <div className="space-y-0.5">
                {Array.from({ length: 4 }).map((_, i) => {
                  const idx = i;
                  const item = highScores[idx];
                  const isPresent = !!item && item.score > 0;
                  const isCurrentPlayer =
                    isPresent && item.initials === inputInitials.toUpperCase().slice(0, 3);

                  return (
                    <div
                      key={idx}
                      className={`flex items-center text-2.25 sm:text-2.5 font-mono px-1 py-0.5 rounded border ${
                        isCurrentPlayer
                          ? 'bg-loyo-mustard/25 border-[#18181b] font-bold shadow-[1px_1px_0px_#18181b]'
                          : 'bg-[#f4f4f5] border-zinc-200'
                      }`}
                    >
                      <span className="font-bold text-[#18181b] w-3.5 shrink-0">{idx + 1}.</span>
                      <span
                        className={`font-black tracking-wider ${
                          isPresent ? 'text-loyo-blue' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? item.initials : '---'}
                      </span>
                      <strong
                        className={`ml-1.5 font-heading font-black truncate ${
                          isPresent ? 'text-[#18181b]' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? `${item.score}b` : '-'}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* Sloupec 2: 5. až 8. místo */}
              <div className="space-y-0.5">
                {Array.from({ length: 4 }).map((_, i) => {
                  const idx = i + 4;
                  const item = highScores[idx];
                  const isPresent = !!item && item.score > 0;
                  const isCurrentPlayer =
                    isPresent && item.initials === inputInitials.toUpperCase().slice(0, 3);

                  return (
                    <div
                      key={idx}
                      className={`flex items-center text-2.25 sm:text-2.5 font-mono px-1 py-0.5 rounded border ${
                        isCurrentPlayer
                          ? 'bg-loyo-mustard/25 border-[#18181b] font-bold shadow-[1px_1px_0px_#18181b]'
                          : 'bg-[#f4f4f5] border-zinc-200'
                      }`}
                    >
                      <span className="font-bold text-[#18181b] w-3.5 shrink-0">{idx + 1}.</span>
                      <span
                        className={`font-black tracking-wider ${
                          isPresent ? 'text-loyo-blue' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? item.initials : '---'}
                      </span>
                      <strong
                        className={`ml-1.5 font-heading font-black truncate ${
                          isPresent ? 'text-[#18181b]' : 'text-zinc-400'
                        }`}
                      >
                        {isPresent ? `${item.score}b` : '-'}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={returnToDemo}
              className="h-6 px-3 bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-[#18181b] shadow-[2px_2px_0px_#18181b] rounded-lg font-heading font-bold text-2.5 uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all"
            >
              OK (ZPĚT DO UKÁZKY)
            </button>
            <span className="text-2.25 font-mono text-zinc-500">(zpět za 10s)</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TETRIS BOARD */}
      {/* ========================================================================= */}
      <div
        className="relative flex justify-center items-end"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
        {/* RED BOUNDARY LINES */}
        <div
          className="absolute top-0 bottom-0 w-0.625 bg-loyo-red shadow-[0_0_8px_rgba(172,0,1,0.8)] z-20 pointer-events-none transition-all duration-500"
          style={{
            left: `${activeMinCol * STEP - 1}px`,
          }}
        />

        <div
          className="absolute top-0 bottom-0 w-0.625 bg-loyo-red shadow-[0_0_8px_rgba(172,0,1,0.8)] z-20 pointer-events-none transition-all duration-500"
          style={{
            left: `${(activeMaxCol + 1) * STEP - GAP + 1}px`,
          }}
        />

        {/* SETTLED CUBES (černé po dopadu, při propojení řádku poblikávají barvou COLOR_FALLING) */}
        {settledCubes.map((cube) => {
          const left = cube.col * STEP;
          const bottom = cube.row * STEP;
          const isFlashing =
            flashingLines && flashingLines.rows.includes(cube.row) && flashingLines.flashOn;

          return (
            <div
              key={cube.id}
              className={`absolute rounded-0.875 border-2 border-[#18181b] transition-all duration-75 ${
                cube.isRedAlert ? 'animate-pulse' : ''
              }`}
              style={{
                width: `${CUBE_SIZE}px`,
                height: `${CUBE_SIZE}px`,
                left: `${left}px`,
                bottom: `${bottom}px`,
                backgroundColor: isFlashing ? COLOR_FALLING : cube.color,
                boxShadow: isFlashing
                  ? `0 0 12px ${COLOR_FALLING}, 2px 2px 0px #18181b`
                  : '2px 2px 0px #18181b',
              }}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-0.5 ${
                  isFlashing ? 'bg-white' : 'bg-white/20'
                }`}
              />
            </div>
          );
        })}

        {/* ACTIVE FALLING PIECE */}
        {fallingPiece && (
          <>
            {fallingPiece.isBomb ? (
              <div
                className="absolute rounded-full border-2 border-[#18181b] z-30 pointer-events-none shadow-[2px_2px_0px_#18181b] animate-pulse"
                style={{
                  width: `${CUBE_SIZE}px`,
                  height: `${CUBE_SIZE}px`,
                  left: `${fallingPiece.col * STEP}px`,
                  top: `${fallingPiece.y}px`,
                  backgroundColor: COLOR_RED,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-2.25 text-white">
                  💣
                </div>
              </div>
            ) : (
              fallingPiece.cells.map(([dx, dy], idx) => {
                const cellLeft = (fallingPiece.col + dx) * STEP;
                const cellTop = fallingPiece.y + dy * STEP;

                return (
                  <div
                    key={`fp-${idx}`}
                    className="absolute rounded-0.875 border-2 border-[#18181b] shadow-[2px_2px_0px_#18181b] z-30 pointer-events-none"
                    style={{
                      width: `${CUBE_SIZE}px`,
                      height: `${CUBE_SIZE}px`,
                      left: `${cellLeft}px`,
                      top: `${cellTop}px`,
                      backgroundColor: fallingPiece.color,
                      boxShadow: '2px 2px 0px #18181b',
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40 rounded-t-0.5" />
                  </div>
                );
              })
            )}
          </>
        )}

        {/* EXPLOSION PARTICLES */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none z-40"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}

        {/* FLOATING SCORES (+X) */}
        {floatingScores.map((fs) => (
          <div
            key={fs.id}
            className="absolute font-heading font-black text-xs sm:text-sm z-50 pointer-events-none animate-bounce"
            style={{
              left: `${fs.x}px`,
              top: `${fs.y}px`,
              color: fs.color,
              textShadow: '0 0 4px #000, 1px 1px 0px #000',
            }}
          >
            {fs.text}
          </div>
        ))}
      </div>
    </div>
  );
};
