import React from 'react';
import type { GameState, InfoPhase } from './types';
import { roundButtonClass } from './constants';

interface BottomRightControlsProps {
  gameState: GameState;
  infoPhase: InfoPhase;
  hidden?: boolean; // tabulka HIGHSCORE je otevřená: (i) se schová, ať nepřekrývá tabulku
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Vpravo dole: kulaté tlačítko (i), jen v ukázce (při hře tu nic není) */
export const BottomRightControls: React.FC<BottomRightControlsProps> = ({
  gameState,
  infoPhase,
  hidden = false,
  setIsHovered,
}) => (
  <div
    className="absolute bottom-1.5 right-2 sm:right-3 z-40 flex items-center gap-1.5 pointer-events-auto"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* KULATÉ TLAČÍTKO ( i ) V PRAVÉM DOLNÍM ROHU - JEN V DEMU, PŘI HŘE (A ODPOČTU) NENÍ */}
    {gameState === 'demo' && !hidden && (
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered((prev) => !prev)}
        className={roundButtonClass(infoPhase !== 'idle')}
        title="Minigame pauza • Nápověda ovládání"
      >
        i
      </button>
    )}
  </div>
);
