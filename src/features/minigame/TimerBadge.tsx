import React from 'react';

/* Černé kolečko s časem vpravo nahoře; při 10, 5, 4, 3, 2, 1 s se zvětší a zčervená */
export const TimerBadge: React.FC<{ timeLeft: number }> = ({ timeLeft }) => (
  <div className="absolute top-1 right-2 z-30 pointer-events-none">
    <div
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-loyo-ink border-2 shadow-brutal-2 flex items-center justify-center transition-all duration-200 ${
        [10, 5, 4, 3, 2, 1].includes(timeLeft)
          ? 'border-loyo-red scale-125 shadow-[0_0_10px_rgba(172,0,1,0.85)]'
          : 'border-orange-500 scale-100'
      }`}
    >
      <span
        className={`font-mono font-black text-xs sm:text-sm leading-none transition-all duration-200 ${
          [10, 5, 4, 3, 2, 1].includes(timeLeft) ? 'text-loyo-red scale-135' : 'text-[#d9ff00]'
        }`}
      >
        {timeLeft}
      </span>
    </div>
  </div>
);
