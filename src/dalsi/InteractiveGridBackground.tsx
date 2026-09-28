import React, { useEffect, useRef, useState, useMemo } from 'react';

// Brand colors matching LoYo visual system – NECHÁNO PŮVODNÍ
const BRAND_COLORS = ['#040b8d', '#CDA24D', '#ac0001', '#bef264'];
const BRAND_COLOR_NAMES = ['blue', 'gold', 'red', 'lime'] as const;
const CELL_SIZE = 72; // Exact pixel width and height of each square tile – NECHÁNO
const INFINITE_HEIGHT = 8000; // <- NEKONEČNOST – 8000px jako v Nekonečné kostky (původně 6×400px)

export const InteractiveGridBackground: React.FC = () => {
  // Počet buněk – nově počítáno z INFINITE_HEIGHT, ne jen z viewportu
  const [dimensions, setDimensions] = useState<{ cols: number; rows: number; total: number }>({
    cols: 20,
    rows: 112,
    total: 2240
  });

  // Scroll pro parallax 0.35× jako v Nekonečné kostky
  const [scrollY, setScrollY] = useState(0);

  // DOM references pro 60fps
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const currentActiveIdx = useRef<number>(-1);
  const lastCellCoord = useRef<{ col: number; row: number } | null>(null);

  // Idle tracking pro bublání
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubblingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeBubblingIndices = useRef<Set<number>>(new Set());
  const idleCandidateNeighbors = useRef<number[]>([]);
  const idleStepRef = useRef<number>(0);

  const trailLeftBehindCount = useRef<number>(0);

  // 1. ScrollY listener – parallax 0.35×
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 2. Calculate grid – NEKONEČNÝ, ne jen viewport
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const cols = Math.ceil(w / CELL_SIZE);
      // MÍSTO window.innerHeight použijeme INFINITE_HEIGHT pro nekonečný efekt
      const rows = Math.ceil(INFINITE_HEIGHT / CELL_SIZE);
      const total = cols * rows;
      setDimensions({ cols, rows, total });
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 3. Cursor tracking & idle bubbling – PŮVODNÍ LOGIKA ZACHOVÁNA
  useEffect(() => {
    const cols = dimensions.cols;
    const rows = dimensions.rows;
    if (cols === 0 || rows === 0) return;

    const clearBubblingState = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      if (bubblingIntervalRef.current) {
        clearInterval(bubblingIntervalRef.current);
        bubblingIntervalRef.current = null;
      }
      if (flashIntervalRef.current) {
        clearInterval(flashIntervalRef.current);
        flashIntervalRef.current = null;
      }

      activeBubblingIndices.current.forEach((idx) => {
        const el = tileRefs.current[idx];
        if (el) {
          el.removeAttribute('data-bubbling');
          el.removeAttribute('data-flash');
          el.style.removeProperty('animation-delay');
        }
      });
      activeBubblingIndices.current.clear();
      idleCandidateNeighbors.current = [];
      idleStepRef.current = 0;
    };

    const getSurroundingNeighbors = (c: number, r: number): number[] => {
      const neighbors: number[] = [];
      const ring1 = [
        { dc: 0, dr: -1 },
        { dc: 1, dr: 0 },
        { dc: 0, dr: 1 },
        { dc: -1, dr: 0 },
        { dc: -1, dr: -1 },
        { dc: 1, dr: -1 },
        { dc: 1, dr: 1 },
        { dc: -1, dr: 1 }
      ];
      const ring2 = [
        { dc: 0, dr: -2 },
        { dc: 2, dr: 0 },
        { dc: 0, dr: 2 },
        { dc: -2, dr: 0 },
        { dc: 1, dr: -2 },
        { dc: -1, dr: -2 },
        { dc: 2, dr: -1 },
        { dc: 2, dr: 1 },
        { dc: 1, dr: 2 },
        { dc: -1, dr: 2 },
        { dc: -2, dr: -1 },
        { dc: -2, dr: 1 },
        { dc: 2, dr: -2 },
        { dc: 2, dr: 2 },
        { dc: -2, dr: 2 },
        { dc: -2, dr: -2 }
      ];

      [...ring1, ...ring2].forEach(({ dc, dr }) => {
        const nc = c + dc;
        const nr = r + dr;
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
          neighbors.push(nr * cols + nc);
        }
      });

      return neighbors;
    };

    const startIdleBubbling = (c: number, r: number) => {
      idleCandidateNeighbors.current = getSurroundingNeighbors(c, r);
      idleStepRef.current = 0;

      flashIntervalRef.current = setInterval(() => {
        if (activeBubblingIndices.current.size === 0) return;
        const activeArray = Array.from(activeBubblingIndices.current);
        const randomTargetIdx = activeArray[Math.floor(Math.random() * activeArray.length)];
        const el = tileRefs.current[randomTargetIdx];
        if (el) {
          const colorName = BRAND_COLOR_NAMES[Math.floor(Math.random() * BRAND_COLOR_NAMES.length)];
          el.setAttribute('data-flash', colorName);
          setTimeout(() => {
            if (activeBubblingIndices.current.has(randomTargetIdx)) {
              el.removeAttribute('data-flash');
            }
          }, 1400);
        }
      }, 4200);

      bubblingIntervalRef.current = setInterval(() => {
        if (idleStepRef.current < idleCandidateNeighbors.current.length) {
          const nextIdx = idleCandidateNeighbors.current[idleStepRef.current];
          idleStepRef.current += 1;

          const el = tileRefs.current[nextIdx];
          if (el && nextIdx !== currentActiveIdx.current) {
            activeBubblingIndices.current.add(nextIdx);
            const delay = ((idleStepRef.current % 4) * 0.9).toFixed(2);
            el.style.animationDelay = `${delay}s`;
            el.setAttribute('data-bubbling', 'true');
          }
        }
      }, 5000);
    };

    const interpolateCells = (
      p1: { col: number; row: number } | null,
      p2: { col: number; row: number }
    ) => {
      if (!p1) return [{ col: p2.col, row: p2.row }];
      const dx = p2.col - p1.col;
      const dy = p2.row - p1.row;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      if (steps === 0) return [{ col: p2.col, row: p2.row }];

      const list: Array<{ col: number; row: number }> = [];
      for (let i = 1; i <= steps; i++) {
        list.push({
          col: Math.round(p1.col + (dx * i) / steps),
          row: Math.round(p1.row + (dy * i) / steps)
        });
      }
      return list;
    };

    const activateTile = (idx: number, isCurrentCursor: boolean, isTrailLime: boolean = false) => {
      const el = tileRefs.current[idx];
      if (!el) return;

      el.setAttribute('data-lifted', 'true');
      if (isCurrentCursor) {
        el.setAttribute('data-active', 'true');
        el.removeAttribute('data-trail-lime');
      } else if (isTrailLime) {
        el.setAttribute('data-trail-lime', 'true');
      }

      const existingTimer = activeTimers.current.get(idx);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        if (currentActiveIdx.current === idx) return;
        el.removeAttribute('data-lifted');
        el.removeAttribute('data-active');
        el.removeAttribute('data-trail-lime');
        activeTimers.current.delete(idx);
      }, 850);

      activeTimers.current.set(idx, timer);
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const col = Math.floor(clientX / CELL_SIZE);
      // Pro parallax: přepočítáme row podle scrollY, aby interakce seděla i když je grid posunutý o 0.35×
      const adjustedY = clientY - scrollY * 0.35;
      const row = Math.floor(adjustedY / CELL_SIZE);

      if (col < 0 || col >= cols || row < 0 || row >= rows) {
        return;
      }

      const targetIdx = row * cols + col;

      if (currentActiveIdx.current !== targetIdx) {
        clearBubblingState();

        if (currentActiveIdx.current !== -1) {
          const prevIdx = currentActiveIdx.current;
          const prevEl = tileRefs.current[prevIdx];
          if (prevEl) {
            prevEl.removeAttribute('data-active');
            trailLeftBehindCount.current += 1;
            if (trailLeftBehindCount.current % 10 === 0) {
              prevEl.setAttribute('data-trail-lime', 'true');
            }
          }
        }
        currentActiveIdx.current = targetIdx;
      } else {
        if (activeBubblingIndices.current.size === 0) {
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        }
      }

      if (activeBubblingIndices.current.size === 0) {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          startIdleBubbling(col, row);
        }, 5000);
      }

      const path = interpolateCells(lastCellCoord.current, { col, row });
      lastCellCoord.current = { col, row };

      path.forEach((pt, i) => {
        if (pt.col >= 0 && pt.col < cols && pt.row >= 0 && pt.row < rows) {
          const idx = pt.row * cols + pt.col;
          const isCurrent = idx === targetIdx;

          let isTrailLime = false;
          if (!isCurrent && i < path.length - 1) {
            trailLeftBehindCount.current += 1;
            if (trailLeftBehindCount.current % 10 === 0) {
              isTrailLime = true;
            }
          }

          activateTile(idx, isCurrent, isTrailLime);
        }
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onMouseLeave = () => {
      clearBubblingState();
      if (currentActiveIdx.current !== -1) {
        const prevEl = tileRefs.current[currentActiveIdx.current];
        if (prevEl) {
          prevEl.removeAttribute('data-active');
        }
        currentActiveIdx.current = -1;
      }
      lastCellCoord.current = null;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      clearBubblingState();
      activeTimers.current.forEach((t) => clearTimeout(t));
      activeTimers.current.clear();
    };
  }, [dimensions, scrollY]);

  // 4. Autonomous random square lift every 5s – PŮVODNÍ
  useEffect(() => {
    const total = dimensions.total;
    if (total === 0) return;

    const randomLiftInterval = setInterval(() => {
      let targetIdx = Math.floor(Math.random() * total);
      let attempts = 0;
      while (
        attempts < 15 &&
        (targetIdx === currentActiveIdx.current ||
          activeBubblingIndices.current.has(targetIdx) ||
          tileRefs.current[targetIdx]?.hasAttribute('data-random-lift') ||
          tileRefs.current[targetIdx]?.hasAttribute('data-lifted'))
      ) {
        targetIdx = Math.floor(Math.random() * total);
        attempts++;
      }

      const el = tileRefs.current[targetIdx];
      if (!el) return;

      el.setAttribute('data-random-lift', 'true');

      const colorTimer = setTimeout(() => {
        if (el && el.hasAttribute('data-random-lift')) {
          const randomColor = BRAND_COLOR_NAMES[Math.floor(Math.random() * BRAND_COLOR_NAMES.length)];
          el.setAttribute('data-flash', randomColor);
        }
      }, 1500);

      const resetTimer = setTimeout(() => {
        if (el) {
          el.removeAttribute('data-flash');
          el.removeAttribute('data-random-lift');
        }
      }, 3000);

      return () => {
        clearTimeout(colorTimer);
        clearTimeout(resetTimer);
      };
    }, 5000);

    return () => clearInterval(randomLiftInterval);
  }, [dimensions.total]);

  // 5. White lift every 4s – PŮVODNÍ
  useEffect(() => {
    const total = dimensions.total;
    if (total === 0) return;

    const whiteLiftInterval = setInterval(() => {
      let targetIdx = Math.floor(Math.random() * total);
      let attempts = 0;
      while (
        attempts < 15 &&
        (targetIdx === currentActiveIdx.current ||
          activeBubblingIndices.current.has(targetIdx) ||
          tileRefs.current[targetIdx]?.hasAttribute('data-random-lift') ||
          tileRefs.current[targetIdx]?.hasAttribute('data-white-lift') ||
          tileRefs.current[targetIdx]?.hasAttribute('data-ambient-lift') ||
          tileRefs.current[targetIdx]?.hasAttribute('data-lifted'))
      ) {
        targetIdx = Math.floor(Math.random() * total);
        attempts++;
      }

      const el = tileRefs.current[targetIdx];
      if (!el) return;

      el.setAttribute('data-white-lift', 'true');

      setTimeout(() => {
        if (el && el.hasAttribute('data-white-lift')) {
          el.removeAttribute('data-white-lift');
        }
      }, 2000);
    }, 4000);

    return () => clearInterval(whiteLiftInterval);
  }, [dimensions.total]);

  // 6. Endless ambient – PŮVODNÍ, teď nekonečně na 8000px
  useEffect(() => {
    const total = dimensions.total;
    if (total === 0) return;

    const ambientInterval = setInterval(() => {
      const count = Math.floor(Math.random() * 2) + 2;
      for (let k = 0; k < count; k++) {
        const targetIdx = Math.floor(Math.random() * total);
        const el = tileRefs.current[targetIdx];
        if (
          !el ||
          targetIdx === currentActiveIdx.current ||
          activeBubblingIndices.current.has(targetIdx) ||
          el.hasAttribute('data-random-lift') ||
          el.hasAttribute('data-white-lift') ||
          el.hasAttribute('data-lifted') ||
          el.hasAttribute('data-ambient-lift')
        ) {
          continue;
        }

        el.setAttribute('data-ambient-lift', 'true');

        if (Math.random() > 0.35) {
          const randomColor = BRAND_COLOR_NAMES[Math.floor(Math.random() * BRAND_COLOR_NAMES.length)];
          setTimeout(() => {
            if (el && el.hasAttribute('data-ambient-lift')) {
              el.setAttribute('data-flash', randomColor);
            }
          }, 350);
        }

        const duration = 2000 + Math.random() * 1200;
        setTimeout(() => {
          if (el) {
            el.removeAttribute('data-flash');
            el.removeAttribute('data-ambient-lift');
          }
        }, duration);
      }
    }, 1200);

    return () => clearInterval(ambientInterval);
  }, [dimensions.total]);

  const cells = useMemo(() => {
    return Array.from({ length: dimensions.total }, (_, idx) => {
      const colorIndex = idx % 3;
      return {
        id: idx,
        color: BRAND_COLORS[colorIndex]
      };
    });
  }, [dimensions.total]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-loyo-bg select-none"
    >
      <style>{`
        .loyo-3d-tile {
          transform: translateZ(0) scale(1);
          background-color: transparent;
          border: 1px solid rgba(24, 24, 27, 0.04);
          box-shadow: none;
          transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1),
                      background-color 0.38s ease,
                      border-color 0.38s ease,
                      box-shadow 0.4s ease;
          will-change: transform;
        }
        .loyo-3d-tile[data-lifted="true"] {
          transform: translateZ(24px) scale(1.02);
          background-color: rgba(255, 255, 255, 0.92);
          border-color: rgba(24, 24, 27, 0.16);
          box-shadow: 0 10px 20px -3px rgba(24, 24, 27, 0.13),
                      0 2px 6px -1px rgba(24, 24, 27, 0.07),
                      inset 0 1px 0 rgba(255, 255, 255, 1);
          z-index: 10;
        }
        .loyo-3d-tile[data-active="true"] {
          transform: translateZ(32px) scale(1.035);
          background-color: #ffffff;
          border-color: rgba(24, 24, 27, 0.25);
          box-shadow: 0 14px 28px -4px rgba(24, 24, 27, 0.18),
                      0 4px 10px -1px rgba(24, 24, 27, 0.10),
                      inset 0 1.5px 0 rgba(255, 255, 255, 1);
          z-index: 20;
        }
        .loyo-3d-tile[data-random-lift="true"] {
          transform: translateZ(28px) scale(1.03);
          background-color: rgba(255, 255, 255, 0.95);
          border-color: rgba(24, 24, 27, 0.20);
          box-shadow: 0 12px 24px -4px rgba(24, 24, 27, 0.16),
                      0 3px 8px -1px rgba(24, 24, 27, 0.08),
                      inset 0 1px 0 rgba(255, 255, 255, 1);
          z-index: 15;
        }
        .loyo-3d-tile[data-white-lift="true"] {
          transform: translateZ(26px) scale(1.025);
          background-color: #ffffff;
          border-color: rgba(24, 24, 27, 0.22);
          box-shadow: 0 12px 24px -4px rgba(24, 24, 27, 0.15),
                      0 3px 8px -1px rgba(24, 24, 27, 0.08),
                      inset 0 1.5px 0 rgba(255, 255, 255, 1);
          z-index: 14;
        }
        @keyframes loyoTileBubbleWave {
          0%, 100% {
            transform: translateZ(0) scale(1);
            background-color: transparent;
            border-color: rgba(24, 24, 27, 0.04);
            box-shadow: none;
          }
          20%, 50% {
            transform: translateZ(24px) scale(1.025);
            background-color: rgba(255, 255, 255, 0.94);
            border-color: rgba(24, 24, 27, 0.18);
            box-shadow: 0 12px 22px -4px rgba(24, 24, 27, 0.15),
                        0 2px 6px -1px rgba(24, 24, 27, 0.07),
                        inset 0 1px 0 rgba(255, 255, 255, 1);
          }
          70% {
            transform: translateZ(0) scale(1);
            background-color: transparent;
            border-color: rgba(24, 24, 27, 0.04);
            box-shadow: none;
          }
        }
        .loyo-3d-tile[data-bubbling="true"] {
          animation: loyoTileBubbleWave 9s cubic-bezier(0.35, 0, 0.25, 1) infinite;
          z-index: 12;
        }
        .loyo-3d-tile[data-flash="blue"] {
          background-color: #040b8d !important;
          border-color: #040b8d !important;
          box-shadow: 0 14px 28px -4px rgba(4, 11, 141, 0.42),
                      0 4px 10px -1px rgba(4, 11, 141, 0.25),
                      inset 0 1.5px 0 rgba(255, 255, 255, 0.75) !important;
        }
        .loyo-3d-tile[data-flash="gold"] {
          background-color: #CDA24D !important;
          border-color: #CDA24D !important;
          box-shadow: 0 14px 28px -4px rgba(205, 162, 77, 0.45),
                      0 4px 10px -1px rgba(205, 162, 77, 0.25),
                      inset 0 1.5px 0 rgba(255, 255, 255, 0.85) !important;
        }
        .loyo-3d-tile[data-flash="red"] {
          background-color: #ac0001 !important;
          border-color: #ac0001 !important;
          box-shadow: 0 14px 28px -4px rgba(172, 0, 1, 0.42),
                      0 4px 10px -1px rgba(172, 0, 1, 0.25),
                      inset 0 1.5px 0 rgba(255, 255, 255, 0.75) !important;
        }
        .loyo-3d-tile[data-flash="lime"] {
          background-color: #bef264 !important;
          border-color: #18181b !important;
          box-shadow: 0 14px 28px -4px rgba(190, 242, 100, 0.55),
                      0 4px 10px -1px rgba(190, 242, 100, 0.28),
                      inset 0 1.5px 0 rgba(255, 255, 255, 0.85) !important;
        }
        .loyo-3d-tile[data-ambient-lift="true"] {
          transform: translateZ(20px) scale(1.02);
          background-color: rgba(255, 255, 255, 0.94);
          border-color: rgba(24, 24, 27, 0.18);
          box-shadow: 0 10px 20px -3px rgba(24, 24, 27, 0.12),
                      0 2px 6px -1px rgba(24, 24, 27, 0.06),
                      inset 0 1px 0 rgba(255, 255, 255, 1);
          z-index: 10;
        }
        .loyo-3d-tile[data-trail-lime="true"] {
          background-color: #d9ff00 !important;
          border-color: #18181b !important;
          transform: translateZ(28px) scale(1.03) !important;
          box-shadow: 0 16px 32px -4px rgba(217, 255, 0, 0.75),
                      0 6px 14px -1px rgba(217, 255, 0, 0.5),
                      inset 0 2px 0 rgba(255, 255, 255, 0.95) !important;
          z-index: 18 !important;
        }
        .loyo-3d-tile[data-trail-lime="true"] .loyo-tile-accent {
          opacity: 0 !important;
        }
        .loyo-3d-tile .loyo-tile-accent,
        .loyo-3d-tile .loyo-tile-bevel {
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .loyo-3d-tile[data-lifted="true"] .loyo-tile-accent,
        .loyo-3d-tile[data-active="true"] .loyo-tile-accent,
        .loyo-3d-tile[data-random-lift="true"] .loyo-tile-accent,
        .loyo-3d-tile[data-white-lift="true"] .loyo-tile-accent,
        .loyo-3d-tile[data-ambient-lift="true"] .loyo-tile-accent,
        .loyo-3d-tile[data-bubbling="true"] .loyo-tile-accent,
        .loyo-3d-tile[data-lifted="true"] .loyo-tile-bevel,
        .loyo-3d-tile[data-active="true"] .loyo-tile-bevel,
        .loyo-3d-tile[data-random-lift="true"] .loyo-tile-bevel,
        .loyo-3d-tile[data-white-lift="true"] .loyo-tile-bevel,
        .loyo-3d-tile[data-ambient-lift="true"] .loyo-tile-bevel,
        .loyo-3d-tile[data-trail-lime="true"] .loyo-tile-bevel,
        .loyo-3d-tile[data-bubbling="true"] .loyo-tile-bevel {
          opacity: 1;
        }
        .loyo-3d-tile[data-flash] .loyo-tile-accent {
          opacity: 0 !important;
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(100%_100%_at_100%_100%,rgba(4,11,141,0.08),transparent_50%),radial-gradient(90%_90%_at_0%_100%,rgba(172,0,1,0.07),transparent_50%)]" />

      {/* Grid lines – fixed, 72px */}
      <div
        className="absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(24, 24, 27, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(24, 24, 27, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          backgroundPosition: '0 0'
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-170 h-170 max-w-[90vw] max-h-[90vw]">
        <div className="absolute left-[18%] top-[15%] w-57.5 h-57.5 bg-loyo-blue/10 rounded-full blur-[75px]" />
        <div className="absolute right-[16%] top-[45%] w-50 h-50 bg-loyo-mustard/12 rounded-full blur-[65px]" />
        <div className="absolute left-[26%] bottom-[10%] w-52.5 h-52.5 bg-loyo-red/8 rounded-full blur-[70px]" />
      </div>

      {/* NEKONEČNÝ GRID – 8000px vysoký s parallax 0.35× */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ 
          perspective: '800px',
          height: `${INFINITE_HEIGHT}px`,
          transform: `translateY(${scrollY * 0.35}px)`,
          willChange: 'transform'
        }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${dimensions.cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${dimensions.rows}, ${CELL_SIZE}px)`,
            width: `${dimensions.cols * CELL_SIZE}px`,
            height: `${dimensions.rows * CELL_SIZE}px`
          }}
        >
          {cells.map((cell, idx) => (
            <div
              key={cell.id}
              ref={(el) => {
                tileRefs.current[idx] = el;
              }}
              className="loyo-3d-tile relative"
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`
              }}
            >
              <div
                className="loyo-tile-accent absolute top-0 left-0 right-0 h-0.625"
                style={{ backgroundColor: cell.color }}
              />
              <div className="loyo-tile-bevel absolute inset-0 bg-linear-to-b from-white/75 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};
