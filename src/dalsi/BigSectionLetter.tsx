import React from 'react';

interface BigSectionLetterProps {
  letter: string;
  wordRemainder: string;
  fillColor: string;
  subtitle?: string;
}

export const BigSectionLetter: React.FC<BigSectionLetterProps> = ({
  letter,
  wordRemainder,
  fillColor,
  subtitle,
}) => {
  return (
    <div className="mb-6 select-none">
      {/* Title composed of big initial letter + rest of word */}
      <div className="flex items-baseline gap-1 sm:gap-2">
        <span
          className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-none loyo-outlined-letter"
          style={{ color: fillColor }}
        >
          {letter}
        </span>
        <span className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-[#18181b] tracking-tight uppercase leading-none">
          {wordRemainder}
        </span>
      </div>

      {/* Clean subtitle in smaller font right below */}
      {subtitle && (
        <p className="mt-1.5 font-mono text-xs sm:text-sm text-[#555] font-medium tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  );
};
