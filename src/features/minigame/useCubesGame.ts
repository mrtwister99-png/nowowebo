import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BOMB_COOLDOWN_SECONDS,
  COLOR_GOLD,
  DEMO_MAX_COL,
  DEMO_MIN_COL,
  GAME_DURATION_SECONDS,
  STEP,
} from './constants';
import {
  cellCenter,
  clearFullRows,
  createDemoStartCubes,
  demoOverflowCleanup,
  findFullRows,
  getActiveColBounds,
  getFallSpeed,
  lineClearPoints,
  moveTarget,
  resolveBomb,
  settleDemoPiece,
  settlePlayingPiece,
  spawnDemoPiece,
  spawnPlayPiece,
  willLand,
} from './engine';
import type { FallingPiece, FlashingLines, GameState, SettledCube } from './types';
import { useBoardEffects } from './useBoardEffects';
import { useHighScores } from './useHighScores';
import { useInfoTeaser } from './useInfoTeaser';

/**
 * Stav a časování celé minihry. Herní pravidla jsou v engine.ts,
 * tady je jen React stav, časovače a klávesy.
 */
export function useCubesGame() {
  // 'demo' | 'countdown' | 'playing' | 'name_entry' | 'post_leaderboard'
  const [gameState, setGameState] = useState<GameState>('demo');
  const [showHighScoresModal, setShowHighScoresModal] = useState<boolean>(false);

  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS);
  const [score, setScore] = useState<number>(0);
  const [endReason, setEndReason] = useState<'gameover' | 'timeout'>('timeout');

  // Blikání řádků před výbuchem (1x pro 1 řádek, 2x pro 2 řádky atd.)
  const [flashingLines, setFlashingLines] = useState<FlashingLines | null>(null);
  const isProcessingLineClearRef = useRef<boolean>(false);

  const { highScores, addScore } = useHighScores();

  // Zadání přezdívky na konci hry (3 znaky)
  const [inputInitials, setInputInitials] = useState<string>('');
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  // Bubliny s nápovědou u tlačítka (i)
  const info = useInfoTeaser();
  const { setIsHovered, setInfoPhase } = info;

  const [activeMinCol, setActiveMinCol] = useState<number>(DEMO_MIN_COL);
  const [activeMaxCol, setActiveMaxCol] = useState<number>(DEMO_MAX_COL);

  const [settledCubes, setSettledCubes] = useState<SettledCube[]>(() => createDemoStartCubes());
  const [fallingPiece, setFallingPiece] = useState<FallingPiece | null>(null);

  // Speciální bomba (mezerník) s cooldownem 30 s
  const [bombCooldown, setBombCooldown] = useState<number>(0);
  const [nextIsBomb, setNextIsBomb] = useState<boolean>(false);

  const {
    particles,
    floatingScores,
    flashBoard,
    showFloatingScore,
    triggerExplosion,
    flashBoardBriefly,
  } = useBoardEffects();

  // Demo: nekonečně běžící živé pozadí, které nikdy nezamrzne
  useEffect(() => {
    if (gameState !== 'demo') return;

    setActiveMinCol(DEMO_MIN_COL);
    setActiveMaxCol(DEMO_MAX_COL);
    setSettledCubes(createDemoStartCubes());
    setFallingPiece(null);
  }, [gameState]);

  // Start hry: odpočet 3... 2... 1... START!
  const startGame = () => {
    setShowHighScoresModal(false);
    setGameState('countdown');
    setCountdown(3);
    setSettledCubes([]); // prázdné pole
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
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

  // Odpočítávání času a cooldownu bomby během hry
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

  // Aktivní sloupce se s časem rozšiřují
  useEffect(() => {
    if (gameState === 'playing') {
      const [minCol, maxCol] = getActiveColBounds(timeLeft, 'playing');
      setActiveMinCol(minCol);
      setActiveMaxCol(maxCol);
    }
  }, [timeLeft, gameState]);

  // Nový dílek (všechny padající kostičky jsou žlutozelené)
  const spawnPiece = useCallback(() => {
    if (gameState !== 'playing' && gameState !== 'demo') return;

    if (gameState === 'demo') {
      setFallingPiece(spawnDemoPiece(settledCubes));
      return;
    }

    const [minCol, maxCol] = getActiveColBounds(timeLeft, 'playing');
    const isBomb = nextIsBomb;
    setNextIsBomb(false);
    setFallingPiece(spawnPlayPiece(minCol, maxCol, isBomb));
  }, [gameState, nextIsBomb, settledCubes, timeLeft]);

  // Speciální bomba (mezerník)
  const triggerBomb = useCallback(() => {
    if (gameState !== 'playing') return;
    if (bombCooldown > 0) return;

    setNextIsBomb(true);
    setBombCooldown(BOMB_COOLDOWN_SECONDS);
    flashBoardBriefly();
  }, [bombCooldown, flashBoardBriefly, gameState]);

  // Pohyb doleva a doprava
  const moveHorizontal = useCallback(
    (direction: -1 | 1) => {
      if (!fallingPiece || gameState !== 'playing') return;

      const newCol = moveTarget(fallingPiece, direction, settledCubes, activeMinCol, activeMaxCol);
      if (newCol !== null) {
        setFallingPiece((prev) => (prev ? { ...prev, col: newCol } : null));
      }
    },
    [activeMaxCol, activeMinCol, fallingPiece, gameState, settledCubes],
  );

  // Rychlý pád (šipka dolů)
  const dropFast = useCallback(() => {
    if (!fallingPiece || gameState !== 'playing') return;
    setFallingPiece((prev) => (prev ? { ...prev, y: prev.y + 8 } : null));
  }, [fallingPiece, gameState]);

  // Po skončení hry se zaměří skryté pole pro přezdívku
  useEffect(() => {
    if (gameState === 'name_entry' && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [gameState]);

  // Uložení výsledku a zobrazení tabulky nejlepších
  const submitInitials = useCallback(
    (cleanInitials: string) => {
      addScore(cleanInitials, score);
      setGameState('post_leaderboard');
    },
    [addScore, score],
  );

  // Klávesy (globálně): přezdívka na konci hry, ovládání během hry
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

        // Povoleno A-Z a 0-9
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
  }, [dropFast, gameState, inputInitials, moveHorizontal, submitInitials, triggerBomb]);

  // Propojení řádků: 1 řádek = 1 bliknutí, 2 řádky = 2 bliknutí atd.; po výbuchu se připíšou body
  const triggerLineClearSequence = useCallback(
    (
      cubes: SettledCube[],
      minC: number,
      maxC: number,
      onComplete: (remainingCubes: SettledCube[]) => void,
    ) => {
      const activeWidth = maxC - minC + 1;
      const fullRows = findFullRows(cubes, minC, maxC);

      if (fullRows.length === 0) {
        isProcessingLineClearRef.current = false;
        onComplete(cubes);
        return;
      }

      // Počet pobliknutí odpovídá počtu propojených řádků
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

          // 1. Výbuch řádků (částice a otřes)
          fullRows.forEach((r) => {
            for (let c = minC; c <= maxC; c++) {
              const { x, y } = cellCenter(c, r);
              triggerExplosion(x, y, 9);
            }
          });
          flashBoardBriefly();

          // 2. Smazání plných řádků a posunutí vyšších kostiček dolů
          const updatedCubes = clearFullRows(cubes, fullRows, minC, maxC);
          setSettledCubes(updatedCubes);

          // 3. Po výbuchu se připíšou body
          if (gameState === 'playing') {
            const addedScore = lineClearPoints(flashTotal, activeWidth);
            setScore((s) => s + addedScore);
            showFloatingScore(
              `+${addedScore}!`,
              ((minC + maxC) / 2) * STEP,
              BOARD_HEIGHT / 2,
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
    [flashBoardBriefly, gameState, showFloatingScore, triggerExplosion],
  );

  // Fyzika pádu (běží v demu i v ostré hře)
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

      const nextY = fallingPiece.y + getFallSpeed(gameState, timeLeft);

      if (willLand(fallingPiece, nextY, settledCubes)) {
        if (gameState === 'demo') {
          // Dopad v demu: kostičky zčernají
          const newSettled = settleDemoPiece(settledCubes, fallingPiece, Date.now());
          setSettledCubes(newSettled);
          setFallingPiece(null);

          // Zkontrolujeme a odpálíme řádky
          triggerLineClearSequence(newSettled, DEMO_MIN_COL, DEMO_MAX_COL, (afterCubes) => {
            // Ukázka se nikdy nezasekne: při výšce 4 a víc se odpaří spodní řádek
            const cleanup = demoOverflowCleanup(afterCubes);
            if (cleanup) {
              cleanup.explodedCubes.forEach((b) => {
                const { x, y } = cellCenter(b.col, b.row);
                triggerExplosion(x, y, 6);
              });
              setSettledCubes(cleanup.cubes);
            }

            // Další dílek: ukázka běží donekonečna
            setTimeout(() => {
              isProcessingLineClearRef.current = false;
              spawnPiece();
            }, 120);
          });
          return;
        }

        // Dopad v ostré hře
        if (fallingPiece.isBomb) {
          const { impactRow, points, cubes } = resolveBomb(settledCubes, fallingPiece.col);
          const { x: impactX, y: impactY } = cellCenter(fallingPiece.col, impactRow);

          triggerExplosion(impactX, impactY, 32);
          setScore((s) => s + points);
          showFloatingScore(`BOMBA! +${points}`, impactX, impactY, COLOR_GOLD);

          setSettledCubes(cubes);
          setFallingPiece(null);
          setTimeout(() => {
            isProcessingLineClearRef.current = false;
            spawnPiece();
          }, 120);
        } else {
          const { cubes: newSettled, isGameOver } = settlePlayingPiece(
            settledCubes,
            fallingPiece,
            Date.now(),
          );

          if (isGameOver) {
            triggerExplosion(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, 40);
            setEndReason('gameover');
            setGameState('name_entry');
            setInputInitials('');
            setActiveSlot(0);
            setFallingPiece(null);
            return;
          }

          setSettledCubes(newSettled);
          setFallingPiece(null);

          // Propojení řádku: bliknutí, výbuch a body
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
    fallingPiece,
    gameState,
    settledCubes,
    showFloatingScore,
    spawnPiece,
    timeLeft,
    triggerExplosion,
    triggerLineClearSequence,
  ]);

  // Zpět do ukázky
  const returnToDemo = () => {
    setGameState('demo');
    setSettledCubes(createDemoStartCubes());
    setFallingPiece(null);
    setShowHighScoresModal(false);
  };

  // Po 10 s zobrazení tabulky nejlepších se automaticky vrátí ukázka
  useEffect(() => {
    if (gameState !== 'post_leaderboard') return;
    const autoReturnTimer = setTimeout(() => {
      returnToDemo();
    }, 10000);
    return () => clearTimeout(autoReturnTimer);
  }, [gameState]);

  return {
    gameState,
    showHighScoresModal,
    setShowHighScoresModal,
    countdown,
    timeLeft,
    score,
    endReason,
    flashingLines,
    highScores,
    inputInitials,
    setInputInitials,
    activeSlot,
    setActiveSlot,
    textInputRef,
    info,
    activeMinCol,
    activeMaxCol,
    settledCubes,
    fallingPiece,
    bombCooldown,
    particles,
    floatingScores,
    flashBoard,
    startGame,
    triggerBomb,
    moveHorizontal,
    dropFast,
    submitInitials,
    returnToDemo,
  };
}
