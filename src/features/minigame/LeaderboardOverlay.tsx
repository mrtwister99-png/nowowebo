import React from 'react';
import { HighScoreGrid } from './HighScoreGrid';
import type { ScoreRecord } from './types';

interface LeaderboardOverlayProps {
  highScores: ScoreRecord[];
  inputInitials: string;
  returnToDemo: () => void;
}

/* Tabulka HIGHSCORE po uložení výsledku (zvýrazní právě uložený záznam), po 10 s se vrátí ukázka */
export const LeaderboardOverlay: React.FC<LeaderboardOverlayProps> = ({
  highScores,
  inputInitials,
  returnToDemo,
}) => (
  <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-between p-1.5 text-center animate-in zoom-in-95">
    <div className="w-full">
      <div className="text-[11px] font-heading font-black text-loyo-blue uppercase tracking-wider">
        HIGHSCORE
      </div>

      <HighScoreGrid
        scores={highScores}
        highlightInitials={inputInitials.toUpperCase().slice(0, 3)}
        className="mt-1 grid grid-cols-2 gap-1 w-full max-w-67.5 mx-auto"
      />
    </div>

    <div className="flex items-center gap-2 pt-0.5">
      <button
        onClick={returnToDemo}
        className="h-6 px-3 bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-loyo-ink shadow-brutal-2 rounded-lg font-heading font-bold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all"
      >
        OK (ZPĚT DO UKÁZKY)
      </button>
      <span className="text-[9px] font-mono text-zinc-500">(zpět za 10s)</span>
    </div>
  </div>
);
