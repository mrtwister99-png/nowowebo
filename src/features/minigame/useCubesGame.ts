import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BOMB_COOLDOWN_SECONDS,
  COLOR_GOLD,
  DEMO_MAX_COL,
  DEMO_MIN_COL,
  GAME_DURATION_SECONDS,
  START_MAX_COL,
  START_MIN_COL,
  STEP,
  TRIES_KEY,
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
  projectLooseParts,
  resolveBomb,
  spawnDemoPiece,
  spawnPlayPiece,
  stepFalling,
} from './engine';
import type { FallingPiece, FlashingLines, GameState, SettledCube } from './types';
import { addTry, fetchTries, isTetrisApiConfigured } from './tetrisApi';
import { useBoardEffects } from './useBoardEffects';
import { useHighScores } from './useHighScores';
import { useInfoTeaser } from './useInfoTeaser';

/** Poslední známé číslo pokusů se schová do localStorage (zobrazí se hned, funguje i bez serveru). */
const saveTryCount = (value: number) => {
  try {
    localStorage.setItem(TRIES_KEY, String(value));
  } catch {
    // úložiště nemusí být dostupné (soukromý režim): číslo pak platí jen do obnovení stránky
  }
};

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

  const { highScores, addScore, refreshScores } = useHighScores();

  // Počítadlo pokusů: každé kliknutí na HRÁT = +1 (zatím se ukládá jen v tomto prohlížeči)
  const [tryCount, setTryCount] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(TRIES_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  // Při načtení stránky se stáhne společný počet pokusů
  useEffect(() => {
    if (!isTetrisApiConfigured) return;
    fetchTries()
      .then((total) => {
        setTryCount(total);
        saveTryCount(total);
      })
      .catch(() => {
        // server nedostupný: zůstává poslední známé číslo
      });
  }, []);

  // Při otevření tabulky HIGHSCORE se stáhnou čerstvé výsledky
  useEffect(() => {
    if (showHighScoresModal) void refreshScores();
  }, [refreshScores, showHighScoresModal]);

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
  // Části dílku, které přečnívaly a padají dál samy (stejnou rychlostí), než dopadnou
  const [looseParts, setLooseParts] = useState<FallingPiece[]>([]);

  // Aktuální hodnoty pro časovače a výběr dílku (čtou se bez nového spuštění efektů)
  const fallingRef = useRef<FallingPiece | null>(null);
  fallingRef.current = fallingPiece;
  const looseRef = useRef<FallingPiece[]>([]);
  looseRef.current = looseParts;
  // Nejnovější kostičky a stav hry (mazání řádků běží za pohybu, nesmí pracovat se starým snímkem)
  const settledRef = useRef<SettledCube[]>([]);
  settledRef.current = settledCubes;
  const gameStateRef = useRef<GameState>(gameState);
  gameStateRef.current = gameState;

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
    setLooseParts([]);
  }, [gameState]);

  // Start hry: odpočet 3... 2... 1... START!
  const startGame = () => {
    setShowHighScoresModal(false);
    setGameState('countdown');
    setCountdown(3);
    setSettledCubes([]); // prázdné pole
    setActiveMinCol(START_MIN_COL); // pole začíná jen 4 sloupce široké
    setActiveMaxCol(START_MAX_COL);

    // Počítadlo pokusů +1: hned se zobrazí, server pak vrátí společný součet všech návštěvníků
    const nextTryCount = tryCount + 1;
    setTryCount(nextTryCount);
    saveTryCount(nextTryCount);
    if (isTetrisApiConfigured) {
      addTry()
        .then((total) => {
          setTryCount(total);
          saveTryCount(total);
        })
        .catch(() => {
          // server nedostupný: zůstává lokální číslo
        });
    }
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setBombCooldown(0);
    setNextIsBomb(false);
    setInputInitials('');
    setActiveSlot(0);
    setFallingPiece(null);
    setLooseParts([]);
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
    if (fallingRef.current) return; // dílek už padá (např. spustily se dva časovače po sobě)

    if (gameState === 'demo') {
      // Ukázka počítá i s částmi, které ještě padají
      setFallingPiece(spawnDemoPiece(projectLooseParts(settledCubes, looseRef.current)));
      return;
    }

    const [minCol, maxCol] = getActiveColBounds(timeLeft, 'playing');
    const isBomb = nextIsBomb;
    setNextIsBomb(false);
    setFallingPiece(spawnPlayPiece(minCol, maxCol, isBomb));
  }, [gameState, nextIsBomb, settledCubes, timeLeft]);

  // Časovače volají vždy nejnovější spawnPiece (ne zastaralou kopii z doby spuštění efektu)
  const spawnPieceRef = useRef(spawnPiece);
  spawnPieceRef.current = spawnPiece;

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
    function runLineClearSequence(
      cubes: SettledCube[],
      minC: number,
      maxC: number,
      onComplete: (remainingCubes: SettledCube[]) => void,
    ): void {
      // Hra běží dál: když mazání už probíhá, nové plné řádky se zkontrolují až po jeho konci
      if (isProcessingLineClearRef.current) return;

      const activeWidth = maxC - minC + 1;
      const fullRows = findFullRows(cubes, minC, maxC);

      if (fullRows.length === 0) {
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
          // (hra mezitím běžela dál, proto se maže z nejnovějšího stavu, ne ze starého snímku)
          const updatedCubes = clearFullRows(settledRef.current, fullRows, minC, maxC);
          settledRef.current = updatedCubes;
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
            // Hra mezitím neskončila: zkontrolovat, jestli nevznikl další plný řádek
            if (gameStateRef.current === gameState) {
              runLineClearSequence(settledRef.current, minC, maxC, onComplete);
            }
          }, 120);
        }
      }, 150);
    },
    [flashBoardBriefly, gameState, showFloatingScore, triggerExplosion],
  );

  // Nový dílek po chvíli, když žádný nepadá (ukázka 240 ms, hra 60 ms)
  useEffect(() => {
    if ((gameState !== 'playing' && gameState !== 'demo') || fallingPiece) return;

    const delay = gameState === 'demo' ? 240 : 60;
    const spawnTimer = setTimeout(() => {
      spawnPiece();
    }, delay);
    return () => clearTimeout(spawnTimer);
  }, [fallingPiece, gameState, spawnPiece]);

  // Fyzika pádu (ukázka i hra): hlavní dílek i odpadlé části padají stejnou rychlostí.
  // Při dopadu se usadí jen sloupce, které se o něco opřely, přečnívající padají dál samy.
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'demo') return;
    if (!fallingPiece && looseParts.length === 0) return;

    let animId: number;

    const tick = () => {
      const step = stepFalling(
        settledCubes,
        looseParts,
        fallingPiece,
        getFallSpeed(gameState, timeLeft),
        Date.now(),
      );

      // Přetečení v ostré hře: konec hry
      if (step.isGameOver && gameState === 'playing') {
        triggerExplosion(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, 40);
        setEndReason('gameover');
        setGameState('name_entry');
        setInputInitials('');
        setActiveSlot(0);
        setFallingPiece(null);
        setLooseParts([]);
        return;
      }

      setFallingPiece(step.piece);
      setLooseParts(step.loose);

      // Dopad bomby: výbuch, body a slisování zbytku dolů
      if (step.bombCol !== null) {
        const { impactRow, points, cubes } = resolveBomb(step.settled, step.bombCol);
        const { x: impactX, y: impactY } = cellCenter(step.bombCol, impactRow);

        triggerExplosion(impactX, impactY, 32);
        setScore((s) => s + points);
        showFloatingScore(`BOMBA! +${points}`, impactX, impactY, COLOR_GOLD);

        setSettledCubes(cubes);
        setTimeout(() => spawnPieceRef.current(), 120);
        return;
      }

      // Něco se usadilo: zapsat kostičky a zkontrolovat plné řádky
      if (step.landed) {
        setSettledCubes(step.settled);
        if (step.pieceLanded && gameState === 'playing' && fallingPiece) {
          setScore((s) => s + fallingPiece.cells.length * 10);
        }

        const [minC, maxC] =
          gameState === 'demo' ? [DEMO_MIN_COL, DEMO_MAX_COL] : [activeMinCol, activeMaxCol];

        triggerLineClearSequence(step.settled, minC, maxC, (afterCubes) => {
          if (gameState === 'demo') {
            // Ukázka se nikdy nezasekne: při výšce DEMO_MAX_HEIGHT se odpaří spodní řádek
            const cleanup = demoOverflowCleanup(afterCubes);
            if (cleanup) {
              cleanup.explodedCubes.forEach((b) => {
                const { x, y } = cellCenter(b.col, b.row);
                triggerExplosion(x, y, 6);
              });
              setSettledCubes(cleanup.cubes);
            }
          }
        });

        // Další dílek padá rovnou (nečeká na blikání řádků), odpadlé části dopadají mezitím
        if (step.pieceLanded) {
          setTimeout(() => spawnPieceRef.current(), 100);
        }
      }
      // Jinak se jen posunuly: po změně stavu se efekt spustí znovu a naplánuje další snímek
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [
    activeMaxCol,
    activeMinCol,
    fallingPiece,
    gameState,
    looseParts,
    settledCubes,
    showFloatingScore,
    timeLeft,
    triggerExplosion,
    triggerLineClearSequence,
  ]);

  // Zpět do ukázky
  const returnToDemo = () => {
    setGameState('demo');
    setSettledCubes(createDemoStartCubes());
    setFallingPiece(null);
    setLooseParts([]);
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
    looseParts,
    bombCooldown,
    tryCount,
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
