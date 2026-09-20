import React from 'react';
import { ArrowRight, Sparkles, Coffee, GraduationCap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BigSectionLetter } from './BigSectionLetter';
import { MagneticButton } from './MagneticButton';

interface ConsultationBannerSectionProps {
  onNavigateToPage: () => void;
}

export const ConsultationBannerSection: React.FC<ConsultationBannerSectionProps> = ({
  onNavigateToPage
}) => {
  return (
    <section id="konzultace" className="py-12 sm:py-16 bg-transparent text-[#18181b] border-b border-[#d0d0d0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title: KONZULTACE + Subtitle */}
        <BigSectionLetter
          letter="K"
          wordRemainder="ONZULTACE"
          fillColor="#18181b"
          subtitle="1 na 1 osobně nebo online, zaškolení a nezávislé know-how"
        />

        {/* Outer Section Area Container with subtle fade-in-up entrance animation */}
        <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-5 sm:p-7 lg:p-8 shadow-sm space-y-6 animate-fade-in-up">
          
          {/* Top Row: 3 Equal Vertical Cards (Designed precisely from the wireframe sketch: Colored Card + Top Orbit Circle + 3 Horizontal White Bars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* CARD 1: Osobní setkání nebo Online */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#CDA24D] animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#CDA24D] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-[#18181b]">
                      <Coffee className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider">1 NA 1</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Osobně nebo Online
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Konzultace u dobré kávy nebo přes videohovor</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Prověření vašeho nápadu a technických možností</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Přímý kontakt s vývojářem bez zprostředkovatelů</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Přesně podle vašeho časového harmonogramu
              </div>
            </div>

            {/* CARD 2: Předání know-how a zaškolení */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#040b8d] animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#040b8d] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-white">
                      <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider">KNOW-HOW</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Předání know-how
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Lidská srozumitelná řeč bez zbytečného žargonu</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Praktická zaškolení a video manuály pro tým</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Plná samostatnost v ovládání vašich nástrojů</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Stanete se pány svých technologií
              </div>
            </div>

            {/* CARD 3: Ochrana před zbytečnými výdaji */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ac0001] animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#ac0001] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-white">
                      <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider">ÚSPORA</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Ochrana rozpočtu
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Nezávislý audit nabídek – záchrana před předražením</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Návrh funkčního MVP dřív, než utratíte statisíce</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Férová hodinová sazba bez svazujících smluv</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Ušetříte desetitisíce za slepé uličky
              </div>
            </div>

          </div>

          {/* Bottom Row: Crucial Highlight (Yellow Box) + Action CTA (Green Box) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch pt-1">
            
            {/* Left: Crucial Highlight (The yellow box from wireframe) */}
            <div className="lg:col-span-8 bg-[#ededed] border-2 border-[#18181b] p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
              <div className="w-11 h-11 shrink-0 bg-[#18181b] text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#18181b] font-black block">
                  ZÁSADNÍ VÝHODA PRO VÁS
                </span>
                <p className="text-xs sm:text-sm text-[#18181b] font-medium leading-snug">
                  Férová sazba ~800 Kč / hod bez dlouhodobých závazků. Platíte pouze za reálný čas, přímé odpovědi a okamžitě aplikovatelné výsledky.
                </p>
              </div>
            </div>

            {/* Right: Action CTA Transition (The green box from wireframe) */}
            <div className="lg:col-span-4 flex">
              <MagneticButton
                type="button"
                onClick={onNavigateToPage}
                magneticStrength={0.25}
                showCornerSquares={true}
                squareColor="#ffffff"
                className="w-full p-4 sm:p-5 bg-[#18181b] hover:bg-[#333] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 border-2 border-[#18181b] shadow-md hover:shadow-lg transition-all cursor-pointer group text-center"
              >
                <span>Více informací & rezervace konzultace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
              </MagneticButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
