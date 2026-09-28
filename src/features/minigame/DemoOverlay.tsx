import React from 'react';
import { INFO_TEXT } from './useInfoTeaser';
import type { InfoPhase } from './types';

interface DemoOverlayProps {
  infoPhase: InfoPhase;
  typedChars: number;
  loadProgress: number;
  showHighScoresModal: boolean;
  onToggleHighScores: () => void;
  onStart: () => void;
}

/*
 * Ukázka (demo): tlačítka HIGHSCORE (vlevo) a HRÁT? (vpravo).
 * Při najetí na (i) obě zmizí a objeví se bubliny MINIGAME a OVLÁDÁNÍ;
 * po odjetí se ještě 2,5 s vytrácejí a potom se tlačítka vrátí.
 */
export const DemoOverlay: React.FC<DemoOverlayProps> = ({
  infoPhase,
  typedChars,
  loadProgress,
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

    {/* 2. VLEVO: KOMIKSOVÁ BUBLINA "MINIGAME" JDE MÍRNĚ NAHORU A DOLEVA (POZICE LOCK NA VŠECH ZAŘÍZENÍCH) */}
    {/* NADPIS: POUZE MINIGAME (HOŘČIČNÁ BARVA #CDA24D, JEDNOU ZA 5s PROBLIKNE), POPIS: ŠEDÝ */}
    <div
      className={`absolute z-40 bg-loyo-ink border-2 border-loyo-ink rounded-xl p-2 shadow-[3px_3px_0px_#000] text-white flex flex-col justify-center min-w-31.25 max-w-37.5 -rotate-2 origin-bottom-right ${
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
      <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-loyo-ink border-r-2 border-b-2 border-loyo-ink rotate-45 pointer-events-none" />

      <div
        className="font-heading font-black text-[11px] sm:text-3 text-loyo-mustard uppercase tracking-wider flex items-center gap-1.5 leading-tight whitespace-nowrap"
        style={{ animation: 'blink-5s 5s infinite ease-in-out' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] shrink-0" />
        <span>MINIGAME</span>
      </div>
      <div className="font-sans text-[9px] sm:text-[10px] text-zinc-400 font-medium leading-tight mt-1 min-h-3.5">
        {INFO_TEXT.slice(0, typedChars)}
        {typedChars < INFO_TEXT.length && infoPhase === 'active' && (
          <span className="inline-block w-1 h-2.5 bg-[#bef264] ml-0.5 animate-pulse align-middle" />
        )}
      </div>
    </div>

    {/* 3. VPRAVO: KOMIKSOVÁ BUBLINA "OVLÁDÁNÍ:" JDE MÍRNĚ NAHORU A DOPRAVA (POZICE LOCK) */}
    {/* NADPIS: OVLÁDÁNÍ: (HOŘČIČNÁ #CDA24D), MEZERNÍK + ŠIPKY, 0% DO 100% V 3s, MIZÍ 2.5s */}
    <div
      className={`absolute z-40 bg-loyo-ink border-2 border-loyo-ink rounded-xl p-2 shadow-[3px_3px_0px_#000] text-white flex flex-col items-start min-w-35 rotate-2 origin-bottom-left ${
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
      <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-loyo-ink border-l-2 border-b-2 border-loyo-ink -rotate-45 pointer-events-none" />

      {/* NADPIS VPRAVO: OVLÁDÁNÍ: */}
      <div className="font-heading font-black text-[10.5px] sm:text-[11px] text-loyo-mustard uppercase tracking-wider flex items-center gap-1.5 leading-tight mb-1 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-loyo-mustard shrink-0" />
        <span>OVLÁDÁNÍ:</span>
      </div>

      {/* PILULKA KLÁVES SE SPOJITÝM ODKRÝVÁNÍM Z 0% DO 100% A ZATAHOVÁNÍM 100% -> 0% */}
      <div
        className="flex items-center gap-1 bg-loyo-ink-soft text-white border border-zinc-600 rounded-lg px-1.5 py-0.5 shadow-[1px_1px_0px_#000] overflow-hidden transition-all"
        style={{
          clipPath: `inset(0 ${100 - loadProgress}% 0 0)`,
        }}
      >
        {/* MEZERNÍK */}
        <div className="px-1.5 py-0.5 rounded font-mono font-black text-[8.5px] sm:text-[9.5px] tracking-tight uppercase bg-loyo-mustard text-loyo-ink shadow-[1px_1px_0px_#fff] whitespace-nowrap">
          MEZERNÍK
        </div>

        {/* 3 KOSTIČKY ŠIPEK: ← ↓ → */}
        <div className="flex items-center gap-0.5 shrink-0">
          <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-white text-loyo-ink border border-loyo-ink font-black text-[9px] flex items-center justify-center shadow-brutal-1">
            ←
          </div>
          <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-white text-loyo-ink border border-loyo-ink font-black text-[9px] flex items-center justify-center shadow-brutal-1">
            ↓
          </div>
          <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-white text-loyo-ink border border-loyo-ink font-black text-[9px] flex items-center justify-center shadow-brutal-1">
            →
          </div>
        </div>
      </div>

      {/* INDIKÁTOR NAČÍTÁNÍ (0% -> 100% PŘI NAJETÍ, 100% -> 0% PŘI ODJETÍ) */}
      <div
        className="h-1 bg-zinc-700/60 rounded-full mt-1 overflow-hidden border border-loyo-ink w-full"
        style={{
          clipPath: `inset(0 ${100 - loadProgress}% 0 0)`,
        }}
      >
        <div className="h-full bg-loyo-mustard" style={{ width: `${loadProgress}%` }} />
      </div>
    </div>
  </>
);
