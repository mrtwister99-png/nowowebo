import React from 'react';
import type { GameState, InfoPhase } from './types';

interface BottomRightControlsProps {
  gameState: GameState;
  infoPhase: InfoPhase;
  bombCooldown: number;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  triggerBomb: () => void;
  moveHorizontal: (direction: -1 | 1) => void;
  dropFast: () => void;
}

/* Vpravo dole: při hře ovládací tlačítka (mezerník, šipky) pro dotyk a myš, vždy kulaté tlačítko (i) */
export const BottomRightControls: React.FC<BottomRightControlsProps> = ({
  gameState,
  infoPhase,
  bombCooldown,
  setIsHovered,
  triggerBomb,
  moveHorizontal,
  dropFast,
}) => (
  <div
    className="absolute bottom-1.5 right-2 sm:right-3 z-40 flex items-center gap-1.5 pointer-events-auto"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* PŘI SAMOTNÉM HRANÍ (gameState === 'playing') MÁ HRÁČ DOSTUPNÉ TLAČÍTKA DOLE PRO TOUCH/MYŠ */}
    {gameState === 'playing' && (
      <div className="flex items-center gap-1 bg-loyo-ink text-white border-2 border-loyo-ink rounded-lg px-1.5 py-0.5 shadow-brutal-2 animate-in fade-in">
        {/* TLAČÍTKO MEZERNÍK */}
        <button
          onClick={triggerBomb}
          className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] tracking-tight uppercase flex items-center gap-0.5 transition-all ${
            bombCooldown === 0
              ? 'bg-loyo-mustard text-loyo-ink cursor-pointer shadow-[1px_1px_0px_#fff] active:scale-95 animate-pulse'
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
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-white hover:bg-zinc-100 text-loyo-ink border border-loyo-ink font-bold text-[10px] flex items-center justify-center cursor-pointer shadow-brutal-1 active:translate-y-0.5"
            title="Doleva (←)"
          >
            ←
          </button>
          <button
            onClick={dropFast}
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-white hover:bg-zinc-100 text-loyo-ink border border-loyo-ink font-bold text-[10px] flex items-center justify-center cursor-pointer shadow-brutal-1 active:translate-y-0.5"
            title="Dolů / Zrychlit (↓)"
          >
            ↓
          </button>
          <button
            onClick={() => moveHorizontal(1)}
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-white hover:bg-zinc-100 text-loyo-ink border border-loyo-ink font-bold text-[10px] flex items-center justify-center cursor-pointer shadow-brutal-1 active:translate-y-0.5"
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
      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-loyo-ink shadow-[1.5px_1.5px_0px_#18181b] flex items-center justify-center font-heading font-black text-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 z-40 ${
        infoPhase !== 'idle'
          ? 'bg-loyo-mustard text-loyo-ink scale-105 shadow-brutal-2'
          : 'bg-white hover:bg-zinc-100 text-loyo-ink'
      }`}
      title="Minigame pauza • Nápověda ovládání"
    >
      i
    </button>
  </div>
);
