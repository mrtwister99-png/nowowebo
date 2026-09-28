import React from 'react';
import { HighScoreGrid } from './HighScoreGrid';
import type { ScoreRecord } from './types';

interface HighScoresModalProps {
  highScores: ScoreRecord[];
  onClose: () => void;
}

/* Tabulka HIGHSCORE přes hrací plochu (8 míst, 4 a 4 vedle sebe) */
export const HighScoresModal: React.FC<HighScoresModalProps> = ({ highScores, onClose }) => (
  <div className="absolute inset-x-1.5 bottom-1 top-8 z-40 bg-white/95 backdrop-blur-xs border-2 border-loyo-ink rounded-xl shadow-brutal-3 p-1.5 flex flex-col justify-between animate-in fade-in zoom-in-95">
    <div>
      <div className="flex items-center justify-between border-b border-loyo-ink/15 pb-0.5 mb-1">
        <span className="font-heading font-black text-[11px] uppercase tracking-wider text-loyo-blue">
          HIGHSCORE
        </span>
        <button
          onClick={onClose}
          className="w-4 h-4 rounded bg-zinc-200 hover:bg-zinc-300 text-loyo-ink flex items-center justify-center text-[10px] font-black cursor-pointer"
          title="Zavřít"
        >
          ✕
        </button>
      </div>

      <HighScoreGrid scores={highScores} />
    </div>

    <div className="flex items-center justify-between pt-0.5 border-t border-zinc-100">
      <span className="text-[9px] font-mono text-zinc-500">--- = neumístěn</span>
      <button
        onClick={onClose}
        className="px-2 py-0.5 bg-loyo-ink hover:bg-zinc-800 text-white rounded font-heading font-bold text-[9px] uppercase cursor-pointer transition-all"
      >
        OK
      </button>
    </div>
  </div>
);
