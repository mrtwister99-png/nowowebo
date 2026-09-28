import React from 'react';

interface NameEntryOverlayProps {
  score: number;
  endReason: 'gameover' | 'timeout';
  inputInitials: string;
  activeSlot: number;
  textInputRef: React.RefObject<HTMLInputElement | null>;
  setInputInitials: (value: string) => void;
  setActiveSlot: (value: number) => void;
  submitInitials: (initials: string) => void;
  returnToDemo: () => void;
}

/* Konec hry: skóre, tři políčka na přezdívku (_ _ _), tlačítka OK a Zrušit */
export const NameEntryOverlay: React.FC<NameEntryOverlayProps> = ({
  score,
  endReason,
  inputInitials,
  activeSlot,
  textInputRef,
  setInputInitials,
  setActiveSlot,
  submitInitials,
  returnToDemo,
}) => (
  <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center animate-in zoom-in-95">
    <input
      ref={textInputRef}
      type="text"
      maxLength={3}
      value={inputInitials}
      onChange={(e) => {
        const clean = e.target.value
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .slice(0, 3);
        setInputInitials(clean);
        setActiveSlot(clean.length);
      }}
      className="absolute opacity-0 pointer-events-none w-1 h-1"
    />

    <div className="text-[9px] font-mono uppercase font-bold text-loyo-red tracking-wider">
      {endReason === 'gameover' ? 'PŘETEČENÍ KOSTIČEK!' : '1 MINUTA UPLYNULA!'}
    </div>

    <div className="font-heading font-black text-base sm:text-lg text-loyo-ink tracking-tight">
      SKÓRE: <span className="text-loyo-blue">{score} BODŮ</span>
    </div>

    {/* 3 Interactive Character Slots (_ _ _) */}
    <div className="mt-1 flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((slotIdx) => {
        const char = inputInitials[slotIdx] || '';
        const isCurrent = slotIdx === activeSlot && inputInitials.length < 3;

        return (
          <div
            key={slotIdx}
            onClick={() => {
              textInputRef.current?.focus();
            }}
            className={`w-8 h-9 rounded-lg border-2 flex items-center justify-center font-heading font-black text-base transition-all cursor-text ${
              isCurrent
                ? 'border-loyo-ink bg-loyo-mustard/25 shadow-[1.5px_1.5px_0px_#18181b] ring-2 ring-loyo-ink'
                : 'border-loyo-ink bg-white shadow-[1.5px_1.5px_0px_#18181b]'
            }`}
          >
            {char ? (
              <span className="text-loyo-ink">{char}</span>
            ) : isCurrent ? (
              <span className="text-loyo-ink animate-ping font-mono font-bold text-sm">_</span>
            ) : (
              <span className="text-zinc-300 font-mono text-xs">_</span>
            )}
          </div>
        );
      })}
    </div>

    {/* Action Buttons: OK and Zrušit */}
    <div className="mt-1.5 flex items-center gap-2">
      <button
        onClick={() => {
          if (inputInitials.length === 3) {
            submitInitials(inputInitials);
          }
        }}
        disabled={inputInitials.length !== 3}
        className={`h-6 px-3 rounded-lg font-heading font-bold text-[10px] uppercase tracking-wider border-2 transition-all ${
          inputInitials.length === 3
            ? 'bg-loyo-blue hover:bg-[#03086b] text-white border-loyo-ink shadow-brutal-2 cursor-pointer active:translate-y-0.5'
            : 'bg-zinc-200 text-zinc-400 border-zinc-400 cursor-not-allowed shadow-none'
        }`}
      >
        OK
      </button>

      <button
        onClick={returnToDemo}
        className="h-6 px-2 font-mono font-bold text-[10px] text-loyo-muted hover:text-loyo-ink underline cursor-pointer"
      >
        Zrušit
      </button>
    </div>
  </div>
);
