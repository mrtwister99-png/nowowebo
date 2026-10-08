import React, { useState } from 'react';
import type { InfoPhase } from './types';

// Ovládání v bublině u (i): klávesa + co dělá
const CONTROLS: { key: string; label: string }[] = [
  { key: '←', label: 'doleva' },
  { key: '→', label: 'doprava' },
  { key: '↓', label: 'pošle čtverečky zrychleně dolů' },
  { key: 'MEZERNÍK', label: 'bomba' },
];

type BubblePhase = 'idle' | 'in' | 'out';

/* Kolečko s počítadlem: po najetí bublina naskočí, po odjetí zmizí glitchem (probliknutí barev) */
const TryCounter: React.FC<{ tryCount: number }> = ({ tryCount }) => {
  const [phase, setPhase] = useState<BubblePhase>('idle');
  const show = () => setPhase('in');
  const hide = () => setPhase((p) => (p === 'in' ? 'out' : p));

  return (
    <button
      type="button"
      aria-label="Lidí zkoušelo hru hrát"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className="absolute bottom-1.5 left-2 sm:left-3 z-40 min-w-9 h-9 sm:min-w-[42px] sm:h-[42px] px-2 rounded-full border-2 border-loyo-ink bg-white hover:bg-zinc-100 text-loyo-ink shadow-[1.5px_1.5px_0px_#18181b] flex items-center justify-center font-mono font-black text-[15px] leading-none cursor-pointer pointer-events-auto active:translate-x-0.5 active:translate-y-0.5 transition-all"
    >
      {tryCount}
      {phase !== 'idle' && (
        <span
          onAnimationEnd={() => phase === 'out' && setPhase('idle')} // po glitchi se bublina odstraní
          className={`pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-xl border-2 border-loyo-ink bg-loyo-ink px-2 py-1 font-heading text-[10px] font-black uppercase tracking-wider text-loyo-mustard shadow-[3px_3px_0px_#000] ${
            phase === 'in' ? 'anim-bubble-in' : 'anim-bubble-glitch-out'
          }`}
        >
          LIDÍ ZKOUŠELO HRU HRÁT
        </span>
      )}
    </button>
  );
};

interface DemoOverlayProps {
  infoPhase: InfoPhase;
  tryCount: number;
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
  tryCount,
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
            ? 'bg-loyo-mustard text-loyo-ink shadow-brutal-2 -translate-y-0.5'
            : 'bg-white hover:bg-zinc-100 text-loyo-ink shadow-brutal-2 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1'
        }`}
        title="Zobrazit HIGHSCORE"
      >
        <span>HIGHSCORE</span>
      </button>

      {/* VPRAVO: HRÁT? */}
      <button
        onClick={onStart}
        className="h-6 sm:h-7 px-3 rounded-lg bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-loyo-ink shadow-brutal-2 hover:-translate-y-0.5 hover:shadow-brutal-3 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 font-heading font-black text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all"
      >
        <span>HRÁT?</span>
        <span className="text-loyo-mustard">▶</span>
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
          className="font-heading font-black text-[11px] sm:text-xs text-loyo-mustard tracking-wider flex items-center gap-1.5 leading-tight whitespace-nowrap"
          style={{ animation: 'blink-5s 5s infinite ease-in-out' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] shrink-0" />
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

    {/* 3. VLEVO DOLE: KOLEČKO S POČÍTADLEM (HRÁT = +1) */}
    <TryCounter tryCount={tryCount} />
  </>
);
