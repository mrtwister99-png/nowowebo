import React from 'react';

/* Odpočet před startem: 3 ... 2 ... 1 ... START! */
export const CountdownOverlay: React.FC<{ countdown: number }> = ({ countdown }) => (
  <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center animate-in fade-in">
    <div className="font-heading font-black text-4xl sm:text-5xl text-loyo-blue tracking-tight animate-bounce">
      {countdown > 0 ? countdown : 'START!'}
    </div>
    <span className="text-[10px] font-mono uppercase tracking-widest text-loyo-muted mt-0.5">
      Použij mezerník a šipky!
    </span>
  </div>
);
