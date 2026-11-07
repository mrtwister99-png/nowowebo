import React from 'react';

interface NameEntryOverlayProps {
  score: number;
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
  inputInitials,
  activeSlot,
  textInputRef,
  setInputInitials,
  setActiveSlot,
  submitInitials,
  returnToDemo,
}) => (
  <div className="absolute inset-0 sm:-right-6 z-40 bg-loyo-surface/95 backdrop-blur-xs flex flex-col items-center justify-center p-2 sm:pr-8 text-center animate-in zoom-in-95">
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

    <div className="font-heading font-bold text-base sm:text-lg text-loyo-text tracking-tight">
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
            className={`w-8 h-9 rounded-lg border flex items-center justify-center font-sans font-black text-base transition-all cursor-text ${
              isCurrent
                ? 'border-loyo-line bg-loyo-blue/25 shadow-brutal-2 ring-2 ring-loyo-blue'
                : 'border-loyo-line bg-loyo-surface shadow-brutal-2'
            }`}
          >
            {char ? (
              <span className="text-loyo-text">{char}</span>
            ) : isCurrent ? (
              <span className="text-loyo-text animate-ping font-mono font-bold text-sm">_</span>
            ) : (
              <span className="text-loyo-muted font-mono text-xs">_</span>
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
        className={`h-6 px-3 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider border transition-all ${
          inputInitials.length === 3
            ? 'bg-loyo-blue hover:bg-loyo-blue-hover text-loyo-text border-loyo-line shadow-brutal-2 cursor-pointer active:translate-y-0.5'
            : 'bg-loyo-panel text-loyo-muted border-loyo-line cursor-not-allowed shadow-none'
        }`}
      >
        OK
      </button>

      <button
        onClick={returnToDemo}
        className="h-6 px-2 font-mono font-bold text-[10px] text-loyo-muted hover:text-loyo-text underline cursor-pointer"
      >
        Zrušit
      </button>
    </div>
  </div>
);
