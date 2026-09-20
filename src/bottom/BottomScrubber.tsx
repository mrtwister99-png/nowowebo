import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BottomScrubberProps {
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
  currentPage?: string;
  onBackToHome?: () => void;
}

interface SectionCheckpoint {
  id: string;
  num: string;
  label: string;
  color: string;
}

export const BottomScrubber: React.FC<BottomScrubberProps> = ({
  activeSection,
  onScrollToSection,
  currentPage = 'home',
  onBackToHome
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 7 checkpoints with precise numbering: 0=Úvod, 1=Automatizace, 2=Aplikace, 3=Web, 4=Konzultace, 5=Zpráva, 6=Kontakty
  const checkpoints: SectionCheckpoint[] = [
    { id: 'uvod', num: '0', label: '0. Úvod', color: '#18181b' },
    { id: 'automatizace', num: '1', label: '1. Automatizace', color: '#040b8d' },
    { id: 'fullstack', num: '2', label: '2. Aplikace', color: '#CDA24D' },
    { id: 'weby', num: '3', label: '3. Web', color: '#ac0001' },
    { id: 'konzultace', num: '4', label: '4. Konzultace', color: '#18181b' },
    { id: 'zprava', num: '5', label: '5. Zpráva', color: '#555555' },
    { id: 'kontakty', num: '6', label: '6. Kontakty', color: '#18181b' }
  ];

  // Calculate actual scroll percentage of the window
  const updateScrollProgress = useCallback(() => {
    if (currentPage !== 'home') return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    }
  }, [currentPage]);

  useEffect(() => {
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [updateScrollProgress]);

  // Handle click or drag on the horizontal track
  const handleTrackInteraction = (clientX: number) => {
    if (currentPage !== 'home' && onBackToHome) {
      onBackToHome();
      return;
    }
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = (percentage / 100) * totalHeight;
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleTrackInteraction(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleTrackInteraction(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Subpage bar
  if (currentPage !== 'home') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#18181b] border-t border-[#333] text-white py-1 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 h-5">
          <span className="font-mono text-[10px] text-[#aaa]">
            Detail: <strong className="text-white uppercase">{currentPage}</strong>
          </span>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-2 py-0.5 bg-white text-[#18181b] hover:bg-[#040b8d] hover:text-white font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
          >
            ← Zpět na přehled
          </button>
        </div>
      </div>
    );
  }

  const getCheckpointPercent = (index: number) => {
    return (index / (checkpoints.length - 1)) * 100;
  };

  return (
    <nav
      aria-label="Navigace stránky"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#18181b] border-t border-[#2e2e33] text-white px-4 sm:px-8 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] select-none h-6 flex items-center"
    >
      <div className="w-full max-w-4xl mx-auto flex items-center relative">
        {/* Track */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-4 flex items-center cursor-pointer touch-none group"
          title="Kliknutím nebo tažením kolečka se posunete po webu"
        >
          {/* Subtle rail line */}
          <div className="w-full h-[2px] bg-[#333338] group-hover:bg-[#4a4a52] relative transition-colors">
            {/* Active filled line */}
            <div 
              className="h-full bg-gradient-to-r from-[#040b8d] via-[#CDA24D] to-[#ac0001] transition-all duration-75"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Checkpoint SQUARES with thin white border and section color */}
          {checkpoints.map((cp, idx) => {
            const pct = getCheckpointPercent(idx);
            const isActive = activeSection === cp.id;

            return (
              <button
                key={cp.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onScrollToSection(cp.id);
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ left: `${pct}%` }}
                className="absolute -translate-x-1/2 flex items-center justify-center group/cp focus:outline-hidden z-20"
                aria-label={`Přejít na sekci ${cp.label}`}
              >
                <span
                  className={`w-2.5 h-2.5 border border-white transition-transform duration-150 ${
                    isActive ? 'scale-125 ring-1 ring-white/70' : 'hover:scale-135'
                  }`}
                  style={{ backgroundColor: cp.color }}
                />

                {/* Tooltip on hover */}
                {hoveredIndex === idx && (
                  <div className="absolute bottom-4 font-mono text-[9px] font-bold bg-[#222226] text-white px-2 py-0.5 border border-white/40 shadow-xl whitespace-nowrap pointer-events-none -translate-x-1/2 left-1/2 z-30">
                    {cp.label}
                  </div>
                )}
              </button>
            );
          })}

          {/* Draggable CIRCLE knob ("my pojedeme kolečkem") */}
          <div
            style={{ left: `${scrollProgress}%` }}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-[#18181b] shadow-[0_0_8px_rgba(255,255,255,0.9)] z-30 pointer-events-none transition-transform duration-75 flex items-center justify-center ${
              isDragging ? 'scale-125' : 'group-hover:scale-110'
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-[#18181b]" />
          </div>
        </div>
      </div>
    </nav>
  );
};
