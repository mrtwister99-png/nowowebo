import React from 'react';
import { ArrowRight, Sparkles, Terminal, Database, Cpu, CheckCircle2 } from 'lucide-react';
import { BigSectionLetter } from './BigSectionLetter';
import { MagneticButton } from './MagneticButton';

interface FullstackBannerSectionProps {
  onNavigateToPage: () => void;
}

export const FullstackBannerSection: React.FC<FullstackBannerSectionProps> = ({
  onNavigateToPage
}) => {
  return (
    <section id="fullstack" className="py-12 sm:py-16 bg-transparent text-[#18181b] border-b border-[#d0d0d0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title: APLIKACE + Subtitle */}
        <BigSectionLetter
          letter="A"
          wordRemainder="PLIKACE"
          fillColor="#CDA24D"
          subtitle="100% nezávislý kód, komplexní backend na míru a stabilní výkon"
        />

        {/* Outer Section Area Container with subtle fade-in-up entrance animation */}
        <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-5 sm:p-7 lg:p-8 shadow-sm space-y-6 animate-fade-in-up">
          
          {/* Top Row: 3 Equal Vertical Cards (Designed precisely from the wireframe sketch: Colored Card + Top Orbit Circle + 3 Horizontal White Bars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* CARD 1: 100% nezávislý kód */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#CDA24D] animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Colored Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#CDA24D] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-[#18181b]">
                      <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-[#18181b]" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider text-[#18181b]">100% VLASTNÍ</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  100% nezávislý kód
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Zdrojový kód i data ve vašem 100% vlastnictví</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Žádné poplatky za každého dalšího uživatele</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Nulový vendor lock-in a svoboda hostingu</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Žádné měsíční poplatky třetím stranám
              </div>
            </div>

            {/* CARD 2: Komplexní backend na míru */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#CDA24D] animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Colored Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#CDA24D] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-[#18181b]">
                      <Database className="w-6 h-6 sm:w-7 sm:h-7 text-[#18181b]" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider text-[#18181b]">BACKEND</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Backend na míru
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>ACID transakce pro spolehlivé objednávky i sklady</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Blesková API rozhraní s odezvou v milisekundách</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Logika navržená přímo pro vaše firemní procesy</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Bezpečné srdce vašeho podnikání
              </div>
            </div>

            {/* CARD 3: Škálovatelnost a výkon */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#CDA24D] animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Colored Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#CDA24D] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-[#18181b]">
                      <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-[#18181b]" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider text-[#18181b]">99.9% CHOD</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Škálovatelnost & výkon
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Zvládá nárazové špičky i 10 000+ požadavků</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Připraveno na růst firmy bez přepisování kódu</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Minimální nároky na server a vysoká stabilita</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Plynulý běh připravený na exponenciální růst
              </div>
            </div>

          </div>

          {/* Bottom Row: Crucial Highlight + Action CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch pt-1">
            
            {/* Left: Crucial Highlight */}
            <div className="lg:col-span-8 bg-[#ededed] border-2 border-[#18181b] p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
              <div className="w-11 h-11 shrink-0 bg-[#18181b] text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#18181b] font-black block">
                  ZÁSADNÍ VÝHODA PRO VÁS
                </span>
                <p className="text-xs sm:text-sm text-[#18181b] font-medium leading-snug">
                  Veškerý kód, databáze i dokumentace přechází po dokončení do vašeho výhradního vlastnictví bez vendor lock-inu a bez licenčních poplatků.
                </p>
              </div>
            </div>

            {/* Right: Action CTA Transition */}
            <div className="lg:col-span-4 flex">
              <MagneticButton
                type="button"
                onClick={onNavigateToPage}
                magneticStrength={0.25}
                showCornerSquares={true}
                squareColor="#ffffff"
                className="w-full p-4 sm:p-5 bg-[#18181b] hover:bg-[#333] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 border-2 border-[#18181b] shadow-md hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <span>Více informací & dotazník pro aplikace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
              </MagneticButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
