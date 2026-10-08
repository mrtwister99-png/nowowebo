import React from 'react';
import type { GameState, InfoPhase } from './types';

interface BottomRightControlsProps {
  gameState: GameState;
  infoPhase: InfoPhase;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Vpravo dole: kulaté tlačítko (i), jen v ukázce (při hře tu nic není) */
export const BottomRightControls: React.FC<BottomRightControlsProps> = ({
  gameState,
  infoPhase,
  setIsHovered,
}) => (
  <div
    className="absolute bottom-1.5 right-2 sm:right-3 z-40 flex items-center gap-1.5 pointer-events-auto"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* KULATÉ TLAČÍTKO ( i ) V PRAVÉM DOLNÍM ROHU - JEN V DEMU, PŘI HŘE (A ODPOČTU) NENÍ */}
    {gameState === 'demo' && (
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
    )}
  </div>
);
