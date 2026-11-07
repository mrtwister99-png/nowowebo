import React from 'react';
import { HighScoreGrid } from './HighScoreGrid';
import type { ScoreRecord } from './types';

interface HighScoresModalProps {
  highScores: ScoreRecord[];
  onClose: () => void;
}

/* Tabulka HIGHSCORE přes hrací plochu (8 míst, 4 a 4 vedle sebe) */
export const HighScoresModal: React.FC<HighScoresModalProps> = ({ highScores, onClose }) => (
  <div className="absolute inset-x-1.5 bottom-1 top-8 z-40 bg-loyo-surface/95 backdrop-blur-xs border border-loyo-line rounded-xl shadow-brutal-3 p-1.5 flex flex-col animate-in fade-in zoom-in-95">
    <div>
      <div className="flex items-center justify-between border-b border-loyo-line pb-0.5 mb-1">
        <span className="font-sans font-black text-[11px] uppercase tracking-wider text-loyo-blue">
          HIGHSCORE
        </span>
        <button
          onClick={onClose}
          className="w-4 h-4 rounded bg-loyo-panel hover:bg-loyo-hover text-loyo-text flex items-center justify-center text-[10px] font-black cursor-pointer"
          title="Zavřít"
        >
          ✕
        </button>
      </div>

      <HighScoreGrid scores={highScores} />
    </div>
  </div>
);
