import React from 'react';
import type { ScoreRecord } from './types';

interface HighScoreGridProps {
  scores: ScoreRecord[];
  /** Přezdívka, která se má zvýraznit (právě uložený výsledek) */
  highlightInitials?: string;
  className?: string;
}

const PLACES_PER_COLUMN = 4;

/* Tabulka nejlepších výsledků: 8 míst ve dvou sloupcích (1-4 a 5-8), prázdná místa jako "---" */
export const HighScoreGrid: React.FC<HighScoreGridProps> = ({
  scores,
  highlightInitials,
  className = 'grid grid-cols-2 gap-1 w-full',
}) => (
  <div className={className}>
    {[0, 1].map((column) => (
      <div key={column} className="space-y-0.5">
        {Array.from({ length: PLACES_PER_COLUMN }).map((_, i) => {
          const idx = column * PLACES_PER_COLUMN + i;
          const item = scores[idx];
          const isPresent = !!item && item.score > 0;
          const isCurrentPlayer =
            isPresent && !!highlightInitials && item.initials === highlightInitials;

          return (
            <div
              key={idx}
              className={`flex items-center text-[9px] sm:text-[10px] font-mono px-1 py-0.5 rounded border ${
                isCurrentPlayer
                  ? 'bg-loyo-mustard/25 border-loyo-ink font-bold shadow-brutal-1'
                  : 'bg-[#f4f4f5] border-zinc-200'
              }`}
            >
              <span className="font-bold text-loyo-ink w-3.5 shrink-0">{idx + 1}.</span>
              <span
                className={`font-black tracking-wider ${
                  isPresent ? 'text-loyo-blue' : 'text-zinc-400'
                }`}
              >
                {isPresent ? item.initials : '---'}
              </span>
              <strong
                className={`ml-1.5 font-heading font-black truncate ${
                  isPresent ? 'text-loyo-ink' : 'text-zinc-400'
                }`}
              >
                {isPresent ? `${item.score}b` : '-'}
              </strong>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);
