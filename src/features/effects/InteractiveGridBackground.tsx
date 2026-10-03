import React, { useEffect, useRef, useState, useMemo } from 'react';

const BRAND_COLORS = ['#040b8d', '#CDA24D', '#ac0001', '#bef264'];
const BRAND_COLOR_NAMES = ['blue', 'gold', 'red', 'lime'] as const;
const CELL_SIZE = 72;
const PARALLAX = 0.35;
const BUFFER_COLS = 2;
const BUFFER_ROWS = 4;

export const InteractiveGridBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({ cols: 20, rows: 20, total: 400 });
  const [scrollY, setScrollY] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const currentActiveIdx = useRef<number>(-1);
  const lastCellCoord = useRef<{ col: number; row: number } | null>(null);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubblingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeBubblingIndices = useRef<Set<number>>(new Set());
  const idleCandidateNeighbors = useRef<number[]>([]);
  const idleStepRef = useRef<number>(0);
  const trailLeftBehindCount = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(m.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cols = Math.ceil(w / CELL_SIZE) + BUFFER_COLS * 2;
      const rows = Math.ceil(h / CELL_SIZE) + BUFFER_ROWS * 2 + 2;
      setDimensions({ cols, rows, total: cols * rows });
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const wrappedOffset = useMemo(() => {
    if (prefersReduced) return 0;
    const offset = scrollY * PARALLAX;
    return ((offset % CELL_SIZE) + CELL_SIZE) % CELL_SIZE;
  }, [scrollY, prefersReduced]);

  const gridTop = useMemo(() => wrappedOffset - CELL_SIZE * 2, [wrappedOffset]);
  const gridLeft = useMemo(() => -BUFFER_COLS * 0.5 * CELL_SIZE, []);

  useEffect(() => {
    const cols = dimensions.cols;
    const rows = dimensions.rows;
    if (cols === 0 || rows === 0) return;
    const timers = activeTimers.current;

    const clearBubblingState = () => {
      if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
      if (bubblingIntervalRef.current) { clearInterval(bubblingIntervalRef.current); bubblingIntervalRef.current = null; }
      if (flashIntervalRef.current) { clearInterval(flashIntervalRef.current); flashIntervalRef.current = null; }
      activeBubblingIndices.current.forEach((idx) => {
        const el = tileRefs.current[idx];
        if (el) { el.removeAttribute('data-bubbling'); el.removeAttribute('data-flash'); }
      });
      activeBubblingIndices.current.clear();
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const adjustedX = clientX - gridLeft;
      const adjustedY = clientY - gridTop;
      const col = Math.floor(adjustedX / CELL_SIZE);
      const row = Math.floor(adjustedY / CELL_SIZE);
      if (col < 0 || col >= cols || row < 0 || row >= rows) return;
      const idx = row * cols + col;
      const el = tileRefs.current[idx];
      if (!el) return;
      if (currentActiveIdx.current !== idx) {
        const prev = tileRefs.current[currentActiveIdx.current];
        if (prev) prev.removeAttribute('data-active');
        currentActiveIdx.current = idx;
      }
      el.setAttribute('data-active', 'true');
      if (timers.has(idx)) clearTimeout(timers.get(idx)!);
      const t = setTimeout(() => { el.removeAttribute('data-active'); timers.delete(idx); }, 850);
      timers.set(idx, t);
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => { if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY); };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      clearBubblingState();
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [dimensions, gridTop, gridLeft]);

  const cells = useMemo(() => Array.from({ length: dimensions.total }, (_, i) => ({ id: i, color: BRAND_COLORS[i % 3] })), [dimensions.total]);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-loyo-bg select-none">
      <style>{`
        .loyo-3d-tile { transform: translateZ(0) scale(1); background: transparent; border: 1px solid rgba(24,24,27,0.04); transition: transform 0.35s ease, background 0.35s ease; }
        .loyo-3d-tile[data-active="true"] { transform: translateZ(32px) scale(1.04); background: white; border-color: rgba(24,24,27,0.2); box-shadow: 0 14px 28px -4px rgba(0,0,0,0.15); z-index: 10; }
      `}</style>
      <div className="absolute top-0 left-0 w-full" style={{ perspective: '800px', height: '100%', transform: prefersReduced ? 'none' : `translateY(${gridTop}px) translateX(${gridLeft}px)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dimensions.cols}, ${CELL_SIZE}px)`, width: `${dimensions.cols * CELL_SIZE}px` }}>
          {cells.map((c, idx) => (
            <div key={c.id} ref={(el) => { tileRefs.current[idx] = el; }} className="loyo-3d-tile relative" style={{ width: CELL_SIZE, height: CELL_SIZE }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.color, opacity: 0.9 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
