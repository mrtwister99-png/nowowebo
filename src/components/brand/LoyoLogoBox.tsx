
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LoyoLogoBoxProps {
  activeSection: string;
  currentPage?: string;
  className?: string;
}

// Faces - pohled shora -22° / -28° zachován z Cenna3DCUBE-Double
const SIDE_KEYS = ['FRONT', 'RIGHT', 'BACK', 'LEFT'] as const;
const ALL_KEYS = ['FRONT', 'RIGHT', 'BACK', 'LEFT', 'TOP', 'BOTTOM'] as const;
type FaceKey = typeof ALL_KEYS[number];

interface FaceDef {
  key: FaceKey;
  rotX: number;
  rotY: number;
  baseRot: string; // transform pro samotnou stěnu
  bg: string;
  text: string;
  neonBorder: string;
  neonText: string;
  neonGlow: string;
  neonGlow2: string;
  labelNormal: string; // L o Y o
  labelNeon: string; // LoYo varianty
}

// Map z přílohy 2 - přesně podle extrakce
const FACE_DEFS: Record<FaceKey, FaceDef> = {
  FRONT: {
    key: 'FRONT',
    rotX: -22,
    rotY: -28,
    baseRot: '',
    bg: '#040b8d',
    text: 'white',
    neonBorder: '#4a7bff',
    neonText: '#6b9bff',
    neonGlow: '#040b8d',
    neonGlow2: '#2a4bff',
    labelNormal: 'L',
    labelNeon: 'LoYo',
  },
  RIGHT: {
    key: 'RIGHT',
    rotX: -22,
    rotY: -118,
    baseRot: 'rotateY(90deg)',
    bg: '#CDA24D',
    text: 'black',
    neonBorder: '#ffcc5c',
    neonText: '#ffde8a',
    neonGlow: '#CDA24D',
    neonGlow2: '#ffb347',
    labelNormal: 'o',
    labelNeon: 'Loyo',
  },
  BACK: {
    key: 'BACK',
    rotX: -22,
    rotY: -208,
    baseRot: 'rotateY(180deg)',
    bg: '#ac0001',
    text: 'white',
    neonBorder: '#ff1a1a',
    neonText: '#ff4a4a',
    neonGlow: '#ac0001',
    neonGlow2: '#ff3333',
    labelNormal: 'Y',
    labelNeon: 'loYO',
  },
  LEFT: {
    key: 'LEFT',
    rotX: -22,
    rotY: 62,
    baseRot: 'rotateY(-90deg)',
    bg: '#616161',
    text: 'white',
    neonBorder: '#cccccc',
    neonText: '#ffffff',
    neonGlow: '#888888',
    neonGlow2: '#aaaaaa',
    labelNormal: 'o',
    labelNeon: 'lOYO',
  },
  TOP: {
    key: 'TOP',
    rotX: 68,
    rotY: -28,
    baseRot: 'rotateX(90deg)',
    bg: '#f8f8f6',
    text: 'black',
    neonBorder: '#ffffff',
    neonText: '#ffffff',
    neonGlow: '#f8f8f6',
    neonGlow2: '#ffffff',
    labelNormal: '',
    labelNeon: 'LoYo',
  },
  BOTTOM: {
    key: 'BOTTOM',
    rotX: -112,
    rotY: -28,
    baseRot: 'rotateX(-90deg)',
    bg: '#111111',
    text: 'white',
    neonBorder: '#ffffff',
    neonText: '#ffffff',
    neonGlow: '#666666',
    neonGlow2: '#ffffff',
    labelNormal: '',
    labelNeon: 'Loyo',
  },
};

const FACE_LIST: FaceDef[] = ALL_KEYS.map(k => FACE_DEFS[k]);

export const LoyoLogoBox: React.FC<LoyoLogoBoxProps> = ({
  activeSection,
  currentPage = 'home',
  className = '',
}) => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(-28);
  const [face, setFace] = useState<FaceKey>('FRONT');
  const [isNeon, setIsNeon] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'exploding' | 'imploding'>('idle');
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimerRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);
  const switchTimerRef = useRef<number | null>(null);
  const implodeTimerRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const hasExplodedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }
    if (implodeTimerRef.current) {
      window.clearTimeout(implodeTimerRef.current);
      implodeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const rotateToNext = useCallback(() => {
    if (phase !== 'idle') return;
    if (!isNeon) {
      // NORMAL: 90° doleva pouze 4 boční L,o,Y,o
      const idx = SIDE_KEYS.indexOf(face as any);
      const nextIdx = idx === -1 ? 0 : (idx + 1) % SIDE_KEYS.length;
      const nextKey = SIDE_KEYS[nextIdx] as FaceKey;
      const def = FACE_DEFS[nextKey];
      setRotX(def.rotX);
      setRotY((prev) => prev - 90);
      setFace(nextKey);
    } else {
      // NEON: RANDOM 6 stran včetně TOP 68° / BOTTOM -112°
      const others = FACE_LIST.filter((f) => f.key !== face);
      const pick = others[Math.floor(Math.random() * others.length)];
      // shortest path pro Y
      setRotX(pick.rotX);
      setRotY((prev) => {
        const cur = ((prev % 360) + 360) % 360;
        const tgt = ((pick.rotY % 360) + 360) % 360;
        let diff = tgt - cur;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return prev + diff;
      });
      setFace(pick.key);
    }
  }, [face, isNeon, phase]);

  // Sync s activeSection (automatizace = FRONT, fullstack = RIGHT, weby = BACK)
  useEffect(() => {
    if (phase !== 'idle') return;
    let target: FaceKey | null = null;
    if (
      activeSection === 'automatizace' ||
      currentPage === 'automation'
    ) {
      target = 'FRONT';
    } else if (
      activeSection === 'fullstack' ||
      currentPage === 'fullstack'
    ) {
      target = 'RIGHT';
    } else if (
      activeSection === 'weby' ||
      currentPage === 'web-branding' ||
      currentPage === 'webs'
    ) {
      target = 'BACK';
    }
    if (target && target !== face && SIDE_KEYS.includes(target as any)) {
      const def = FACE_DEFS[target];
      const curIdx = SIDE_KEYS.indexOf(face as any);
      const tgtIdx = SIDE_KEYS.indexOf(target as any);
      if (!isNeon && curIdx !== -1 && tgtIdx !== -1) {
        // kolik kroků doleva
        let steps = (tgtIdx - curIdx + SIDE_KEYS.length) % SIDE_KEYS.length;
        // pokud je to víc než 2, jdi kratší cestou doprava? Ale spec říká 90° doleva, takže drž -90
        setRotX(def.rotX);
        setRotY((prev) => prev - 90 * steps);
      } else {
        setRotX(def.rotX);
        setRotY((prev) => {
          const cur = ((prev % 360) + 360) % 360;
          const tgt = ((def.rotY % 360) + 360) % 360;
          let diff = tgt - cur;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return prev + diff;
        });
      }
      setFace(target);
    }
  }, [activeSection, currentPage, face, isNeon, phase]);

  const startHold = useCallback(() => {
    if (phase !== 'idle') return;
    isHoldingRef.current = true;
    hasExplodedRef.current = false;
    setHoldProgress(0);

    // progress 0->100% za 600ms
    const start = Date.now();
    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / 600, 1);
      setHoldProgress(p);
      if (p >= 1 && holdIntervalRef.current) {
        window.clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    }, 16);

    holdTimerRef.current = window.setTimeout(() => {
      hasExplodedRef.current = true;
      setPhase('exploding');
      // 0.6s explode, pak switch
      switchTimerRef.current = window.setTimeout(() => {
        setIsNeon((prev) => !prev);
        setPhase('imploding');
        // 0.6s implode bounce 1.12 -> 1
        implodeTimerRef.current = window.setTimeout(() => {
          setPhase('idle');
          setHoldProgress(0);
          hasExplodedRef.current = false;
        }, 600);
      }, 600);
    }, 600);
  }, [phase]);

  const endHold = useCallback(() => {
    const wasHolding = isHoldingRef.current;
    const exploded = hasExplodedRef.current;
    isHoldingRef.current = false;

    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }

    if (!exploded && wasHolding && phase === 'idle') {
      // krátký klik = rotace
      rotateToNext();
    }
    if (!exploded) {
      setHoldProgress(0);
    }
  }, [phase, rotateToNext]);

  const currentDef = FACE_DEFS[face];

  // velikost kostky - reaguje na scale třídy z className (scale-150 apod. mění celek)
  // base 56px kontejner -> kostka 62% -> 34px, face translateZ = polovina
  const isExploding = phase === 'exploding';
  const isImploding = phase === 'imploding';
  const cubeScale = isExploding ? 0.9 : isImploding ? 1.12 : 1;
  const cubeOpacity = isExploding ? 0.7 : 1;
  const faceTranslate = isExploding ? 34 : 22; // px, 150->230 (+80) => 22->34 pro malou kostku
  const tiltX = isExploding ? -12 : 0;
  const tiltY = isExploding ? -13 : 0;

  return (
    <div
      id="loyo-logo-box"
      className={`relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 cursor-pointer select-none group ${className}`}
      title={`LoYo 3D — ${isNeon ? 'NEON LoYo 6 stran' : 'NORMAL L,o,Y,o 4 strany'} • klik 90° / podrž 0.6s explode ${isNeon ? '→ NORMAL' : '→ NEON'}`}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          rotateToNext();
        }
      }}
    >
      {/* Outer brutální rámeček pro NORMAL - jako v příloze */}
      <div
        className={`absolute inset-0 border-[3px] transition-all duration-300 ${
          isNeon ? 'bg-[#070708] border-white/20' : 'bg-[#fafaf9] border-black shadow-[4px_4px_0px_0px_black]'
        }`}
        style={
          isNeon
            ? {
                boxShadow: `0 0 0 1px ${currentDef.neonBorder}22, inset 0 0 20px ${currentDef.neonGlow}11`,
                backgroundImage: `radial-gradient(ellipse at 50% 20%, ${currentDef.neonGlow}22 0%, transparent 55%)`,
              }
            : {}
        }
      />

      {/* Progress pro podržení - tenká linka dole */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10 overflow-hidden z-20">
        <div
          className="h-full bg-black transition-all duration-75"
          style={{
            width: `${holdProgress * 100}%`,
            backgroundColor: isNeon ? currentDef.neonBorder : 'black',
            boxShadow: isNeon ? `0 0 8px ${currentDef.neonGlow}` : 'none',
            opacity: holdProgress > 0 ? 1 : 0,
          }}
        />
      </div>

      {/* Kontejner s perspektivou */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '420px', perspectiveOrigin: '50% 50%' }}
      >
        {/* Ambient glow - 320px radial v originálu, zmenšeno pro logo */}
        {isNeon && (
          <div
            aria-hidden
            className="absolute pointer-events-none rounded-full transition-all duration-700"
            style={{
              width: '160%',
              height: '160%',
              background: `radial-gradient(circle, ${currentDef.neonGlow}22 0%, ${currentDef.neonGlow}08 32%, transparent 70%)`,
              filter: 'blur(14px)',
              transform: `scale(${isExploding ? 1.18 : 1})`,
              zIndex: 0,
            }}
          />
        )}

        {/* Stín pod kostkou - bg neon + blur 24-32 + scale 1→1.85 při explode */}
        <div
          aria-hidden
          className="absolute bottom-[10%] left-1/2 w-[58%] h-[12%] rounded-full pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: isNeon ? currentDef.neonGlow : 'black',
            filter: `blur(${isNeon ? (isExploding ? 12 : 7) : 4}px)`,
            opacity: isNeon ? 0.55 : 0.18,
            transform: `translateX(-50%) scale(${isExploding ? 1.85 : 1})`,
            boxShadow: isNeon ? `0 0 20px ${currentDef.neonGlow}, 0 0 40px ${currentDef.neonGlow}` : 'none',
            zIndex: 1,
          }}
        />

        {/* KOSTKA */}
        <div
          className="relative"
          style={{
            width: '58%',
            height: '58%',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX + tiltX}deg) rotateY(${rotY + tiltY}deg) scale(${cubeScale})`,
            transition: isImploding
              ? 'transform 0.6s cubic-bezier(0.68,-0.55,0.265,1.55), opacity 0.3s ease'
              : 'transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.4s ease',
            opacity: cubeOpacity,
            zIndex: 2,
          }}
        >
          {FACE_LIST.map((f) => {
            const def = FACE_DEFS[f.key];
            const isTopBottom = f.key === 'TOP' || f.key === 'BOTTOM';
            // V NORMAL režimu zobrazujeme TOP/BOTTOM jako prázdné / s tečkou, ale stále existují pro 3D iluzi
            const showContent = isNeon || SIDE_KEYS.includes(f.key as any);

            const bg = isNeon ? '#0a0a0a' : def.bg;
            const border = isNeon ? `2px solid ${def.neonBorder}` : `3px solid black`;
            const boxShadow = isNeon
              ? isExploding
                ? `0 0 10px ${def.neonBorder}, 0 0 20px ${def.neonBorder}, 0 0 40px ${def.neonBorder}, 0 0 30px ${def.neonGlow}, 0 0 60px ${def.neonGlow}, 0 0 90px ${def.neonGlow}, inset 0 0 15px ${def.neonGlow}4D`
                : `0 0 10px ${def.neonBorder}, 0 0 20px ${def.neonBorder}, 0 0 40px ${def.neonBorder}, inset 0 0 15px ${def.neonGlow}4D`
              : `2.5px 2.5px 0px 0px black`;

            const textColor = isNeon ? def.neonText : def.text;
            const textShadow = isNeon
              ? `0 0 7px ${def.neonGlow}, 0 0 10px ${def.neonGlow}, 0 0 21px ${def.neonGlow}, 0 0 42px ${def.neonBorder}`
              : 'none';

            const label = isNeon ? def.labelNeon : def.labelNormal;

            return (
              <div
                key={f.key}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `${f.baseRot} translateZ(${faceTranslate}px)`,
                  backgroundColor: bg,
                  border: border,
                  boxShadow: boxShadow,
                  backfaceVisibility: 'hidden',
                }}
              >
                {showContent ? (
                  <span
                    className={`font-black tracking-tight leading-none select-none ${
                      isNeon ? 'text-[11px] sm:text-[12px]' : 'text-[16px] sm:text-[18px]'
                    }`}
                    style={{
                      color: textColor,
                      textShadow: textShadow,
                      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                      fontWeight: 900,
                      letterSpacing: isNeon ? '0.04em' : '-0.02em',
                      opacity: isTopBottom && !isNeon ? 0.18 : 1,
                    }}
                  >
                    {label || (isTopBottom ? '•' : '')}
                  </span>
                ) : null}

                {/* Malý tag rohu pro NORMAL - jako v příloze */}
                {!isNeon && (
                  <span className="absolute top-[2px] left-[2px] text-[5px] font-black bg-black text-white px-[2px] leading-none tracking-widest">
                    {f.key}
                  </span>
                )}
                {isNeon && (
                  <span
                    className="absolute top-[2px] left-[2px] text-[5px] font-black px-[2px] leading-none tracking-widest border"
                    style={{
                      backgroundColor: '#0a0a0a',
                      color: def.neonText,
                      borderColor: `${def.neonBorder}66`,
                      textShadow: `0 0 6px ${def.neonGlow}`,
                    }}
                  >
                    {f.key}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Indikátor stavu */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-[2px] z-10">
          <div
            className="w-1 h-1 rounded-full"
            style={{
              backgroundColor: isNeon ? currentDef.neonBorder : 'black',
              boxShadow: isNeon ? `0 0 6px ${currentDef.neonGlow}` : 'none',
            }}
          />
          <div
            className={`w-1 h-1 rounded-full ${phase !== 'idle' ? 'animate-pulse' : 'opacity-30'}`}
            style={{
              backgroundColor: phase !== 'idle' ? '#ac0001' : isNeon ? 'white' : 'black',
            }}
          />
        </div>
      </div>

      {/* Popisek pod logem pro debug - skryto v produkci, ale užitečné */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 hidden group-hover:flex text-[7px] font-black tracking-widest whitespace-nowrap bg-black text-white px-1 py-[1px] z-30 pointer-events-none">
        {face} {rotX}°/{rotY}° {isNeon ? 'NEON' : 'NORMAL'} {phase !== 'idle' ? `• ${phase}` : ''}
      </div>
    </div>
  );
};
