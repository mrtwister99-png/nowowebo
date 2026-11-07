import React from 'react';

/* Černé kolečko s časem vpravo nahoře; při 10, 5, 4, 3, 2, 1 s se zvětší a zčervená */
export const TimerBadge: React.FC<{ timeLeft: number }> = ({ timeLeft }) => (
  <div className="absolute top-1 right-2 z-30 pointer-events-none">
    <div
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-loyo-panel border shadow-brutal-2 flex items-center justify-center transition-all duration-200 ${
        [10, 5, 4, 3, 2, 1].includes(timeLeft)
          ? 'border-loyo-blue scale-125 shadow-[0_0_10px_rgba(18,164,255,0.85)]'
          : 'border-loyo-blue scale-100'
      }`}
    >
      <span
        className={`font-mono font-black text-xs sm:text-sm leading-none transition-all duration-200 ${
          [10, 5, 4, 3, 2, 1].includes(timeLeft) ? 'text-loyo-blue scale-135' : 'text-loyo-text'
        }`}
      >
        {timeLeft}
      </span>
    </div>
  </div>
);
