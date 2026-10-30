import React, { useEffect, useRef, useState } from 'react';
import type { InfoPhase } from './types';
import { roundButtonClass } from './constants';

// Ovládání v bublině u (i): klávesa + co dělá
const CONTROLS: { key: string; label: string }[] = [
  { key: '←', label: 'doleva' },
  { key: '→', label: 'doprava' },
  { key: '↑', label: 'otočí dílek' },
  { key: '↓', label: 'pošle čtverečky zrychleně dolů' },
  { key: 'MEZERNÍK', label: 'bomba' },
];

type BubblePhase = 'idle' | 'in' | 'out';

/* Text v bublině u počítadla (správný tvar slova podle počtu: 1 člověk vydržel, 2-4 lidé vydrželi, jinak lidí vydrželo) */
const finishedText = (n: number): string => {
  if (n === 1) return 'Celkem 1 člověk vydržel celou minutu';
  if (n >= 2 && n <= 4) return `Celkem ${n} lidé vydrželi celou minutu`;
  return `Celkem ${n} lidí vydrželo celou minutu`;
};

/*
 * Kolečko s počítadlem vlevo dole. Bublina s textem vyjede stejně jako u (i):
 * myš = po najetí, dotyk (telefon) = po klepnutí (po 3 s sama zmizí, nebo dalším klepnutím).
 */
const FinishedCounter: React.FC<{ finishedCount: number }> = ({ finishedCount }) => {
  const [phase, setPhase] = useState<BubblePhase>('idle');
  const pointerType = useRef('mouse');
  const hideTimer = useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const show = () => {
    clearHideTimer();
    setPhase('in');
  };
  const hide = () => {
    clearHideTimer();
    setPhase((p) => (p === 'in' ? 'out' : p));
  };
  // při zrušení komponenty se časovač zruší
   
  useEffect(() => clearHideTimer, []);

  return (
    <>
      {phase !== 'idle' && (
        <div
          onAnimationEnd={() => phase === 'out' && setPhase('idle')} // po glitchi se bublina odstraní
          className={`absolute z-40 pointer-events-none bg-loyo-ink border-2 border-loyo-ink rounded-xl px-2 py-1.5 shadow-[3px_3px_0px_#000] -rotate-2 origin-bottom-left whitespace-nowrap ${
            phase === 'in' ? 'anim-bubble-in -translate-y-1' : 'anim-bubble-glitch-out-i -translate-y-1'
          }`}
          style={{ left: '8px', bottom: '44px' }}
        >
          {/* Ocas bubliny mířící dolů ke kolečku */}
          <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-loyo-ink border-r-2 border-b-2 border-loyo-ink rotate-45" />
          <span className="font-heading font-black text-[11px] sm:text-xs text-loyo-orange tracking-wider leading-tight">
            {finishedText(finishedCount)}
          </span>
        </div>
      )}

      <button
        type="button"
        aria-label={finishedText(finishedCount)}
        onPointerDown={(e) => {
          pointerType.current = e.pointerType;
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') show();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') hide();
        }}
        onBlur={hide}
        onClick={(e) => {
          // myš: bublinu řídí najetí; dotyk a klávesnice: klepnutí ji zobrazí / schová
          if (pointerType.current === 'mouse' && e.detail !== 0) return;
          if (phase === 'in') {
            hide();
          } else {
            show();
            hideTimer.current = window.setTimeout(hide, 3000);
          }
        }}
        className={`absolute bottom-1.5 left-2 sm:left-3 ${roundButtonClass(phase === 'in')}`}
      >
        {finishedCount}
      </button>
    </>
  );
};

interface DemoOverlayProps {
  infoPhase: InfoPhase;
  finishedCount: number;
  showHighScoresModal: boolean;
  onToggleHighScores: () => void;
  onStart: () => void;
}

/*
 * Ukázka (demo): tlačítka HIGHSCORE (vlevo) a HRÁT? (vpravo).
 * Při najetí na (i) obě zmizí a objeví se jedna bublina: miniGAME Tetris + OVLÁDÁNÍ;
 * po odjetí se ještě 2,5 s vytrácí a potom se tlačítka vrátí.
 */
export const DemoOverlay: React.FC<DemoOverlayProps> = ({
  infoPhase,
  finishedCount,
  showHighScoresModal,
  onToggleHighScores,
  onStart,
}) => (
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
        onClick={onToggleHighScores}
        className={`h-6 sm:h-7 px-2.5 rounded-lg border-2 border-loyo-ink font-heading font-black text-[10px] sm:text-xs tracking-wider uppercase flex items-center cursor-pointer transition-all ${
          showHighScoresModal
            ? 'bg-loyo-orange text-loyo-ink shadow-brutal-2 -translate-y-0.5'
            : 'bg-white hover:bg-zinc-100 text-loyo-ink shadow-brutal-2 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1'
        }`}
        title="Zobrazit HIGHSCORE"
      >
        <span>HIGHSCORE</span>
      </button>

      {/* VPRAVO: HRÁT? */}
      <button
        onClick={onStart}
        className="h-6 sm:h-7 px-3 rounded-lg bg-loyo-blue hover:bg-loyo-orange text-white border-2 border-loyo-ink shadow-brutal-2 hover:-translate-y-0.5 hover:shadow-brutal-3 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 font-heading font-black text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all"
      >
        <span>HRÁT?</span>
        <span className="text-white">▶</span>
      </button>
    </div>

    {/* 2. JEDNA BUBLINA U TLAČÍTKA (i) V PRAVÉM DOLNÍM ROHU: NADPIS "miniGAME Tetris" + OVLÁDÁNÍ POD NÍM */}
    {/* OBSAH SE ODKRÝVÁ ZLEVA DOPRAVA (0% DO 100% ZA 3,2 s) A PŘI ODJETÍ SE 2,5 s ZATAHUJE ZPĚT */}
    <div
      className={`absolute z-40 bg-loyo-ink border-2 border-loyo-ink rounded-xl p-2 shadow-[3px_3px_0px_#000] text-white flex flex-col items-start min-w-44 -rotate-2 origin-bottom-right ${
        infoPhase === 'active'
          ? 'opacity-100 pointer-events-auto -translate-y-1 anim-bubble-in'
          : infoPhase === 'exiting'
            ? 'opacity-100 pointer-events-none -translate-y-1 anim-bubble-glitch-out-i'
            : 'opacity-0 pointer-events-none translate-y-0'
      }`}
      style={{
        right: '8px',
        bottom: '44px',
      }}
    >
      {/* Ocas komiksové bubliny mířící dolů k tlačítku (i) */}
      <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-loyo-ink border-r-2 border-b-2 border-loyo-ink rotate-45 pointer-events-none" />

      <div className="w-full">
        {/* NADPIS: miniGAME Tetris (HOŘČIČNÁ BARVA, JEDNOU ZA 5 s PROBLIKNE) */}
        <div
          className="font-heading font-black text-[11px] sm:text-xs text-loyo-orange tracking-wider flex items-center gap-1.5 leading-tight whitespace-nowrap"
          style={{ animation: 'blink-5s 5s infinite ease-in-out' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-loyo-blue shrink-0" />
          <span>miniGAME Tetris</span>
        </div>

        {/* POD NADPISEM: OVLÁDÁNÍ (seznam je nahoře v souboru v CONTROLS) */}
        <div className="font-heading font-black text-[10px] text-zinc-400 uppercase tracking-wider mt-1.5 mb-1">
          Ovládání:
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 items-center">
          {CONTROLS.map(({ key, label }) => (
            <React.Fragment key={key}>
              <div className="min-w-5 h-5 px-1 rounded bg-white text-loyo-ink border border-loyo-ink font-mono font-black text-[9px] flex items-center justify-center shadow-brutal-1 whitespace-nowrap">
                {key}
              </div>
              <div className="font-sans text-[9px] sm:text-[10px] text-zinc-300 font-medium leading-tight">
                {label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>

    {/* 3. VLEVO DOLE: KOLEČKO S POČÍTADLEM (DOHRANÁ CELÁ MINUTA = +1) */}
    {!showHighScoresModal && <FinishedCounter finishedCount={finishedCount} />}
  </>
);
