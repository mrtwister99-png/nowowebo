import React from 'react';
import { ArrowRight, Sparkles, Clock, Workflow, ShieldCheck, Zap } from 'lucide-react';
import { BigSectionLetter } from '../../dalsi/BigSectionLetter';
import { MagneticButton } from '../../dalsi/MagneticButton';

interface AutomationBannerSectionProps {
  onNavigateToPage: () => void;
}

export const AutomationBannerSection: React.FC<AutomationBannerSectionProps> = ({
  onNavigateToPage
}) => {
  return (
    <section id="automatizace" className="py-12 sm:py-16 bg-transparent text-[#18181b] border-b border-[#d0d0d0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title: AUTOMATIZACE + Subtitle */}
        <BigSectionLetter
          letter="A"
          wordRemainder="UTOMATIZACE"
          fillColor="#040b8d"
          subtitle="Úspora času, propojení systémů a zakázkové zabezpečení"
        />

        {/* Outer Section Area Container with subtle fade-in-up entrance animation */}
        <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-5 sm:p-7 lg:p-8 shadow-sm space-y-6 animate-fade-in-up">
          
          {/* Top Row: 3 Equal Vertical Cards (Designed precisely from the wireframe sketch: Colored Card + Top Orbit Circle + 3 Horizontal White Bars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* CARD 1: Úspora 15–40 hodin týdně */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#040b8d]/70 animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Colored Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#040b8d] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-white">
                      <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider">-85% ČASU</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Úspora 15–40 hod týdně
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Konec ručního přepisování faktur a dat</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Okamžité uvolnění rukou týmu pro byznys</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Spolehlivý chod 24/7 s nulovou chybovostí</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Návratnost investice v řádu týdnů
              </div>
            </div>

            {/* CARD 2: Propojení ekosystému */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#040b8d]/70 animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Colored Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#040b8d] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-white">
                      <Workflow className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider">SYNC</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Propojení systémů
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>E-shop, CRM i účetnictví v jednom toku</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Automatická obousměrná výměna v reálném čase</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Integrace AI a Google Workspace bez poplatků</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Všechny nástroje mluví stejnou řečí
              </div>
            </div>

            {/* CARD 3: Zakázkové zabezpečení */}
            <div className="bg-[#ececec] text-[#18181b] border-2 border-[#18181b] p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:translate-y-[-2px] hover:bg-[#f1f1f1] transition-all group">
              <div>
                {/* Visual Top Circle precisely as drawn in sketch: Hero colored element */}
                <div className="flex flex-col items-center justify-center pt-2 pb-4">
                  <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                    {/* Orbit outline ring from sketch */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#040b8d]/70 animate-[spin_25s_linear_infinite]" />
                    {/* Inner Solid Colored Circle */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#040b8d] border-2 border-[#18181b] flex flex-col items-center justify-center shadow-md text-white">
                      <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="font-mono text-[9px] font-black uppercase mt-1 tracking-wider">BEZPEČÍ</span>
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight uppercase text-center mb-4">
                  Zakázkové bezpečí
                </h3>

                {/* 3 Horizontal White Rectangular Bars (Exactly as in the sketch) */}
                <div className="space-y-2.5">
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>NFC čipy, magic linky a biometrie na míru</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Šifrovaná API a přesná oprávnění zaměstnanců</span>
                  </div>
                  <div className="bg-white text-[#18181b] p-3 border-2 border-[#18181b] shadow-xs flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0" />
                    <span>Zero-Trust ochrana – data výhradně u vás</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#c5c5c5] text-center font-mono text-[11px] font-bold text-[#555]">
                Bezpečné interní toky bez rizik
              </div>
            </div>

          </div>

          {/* Bottom Row: Crucial Highlight + Action CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch pt-1">
            
            {/* Left: Crucial Highlight */}
            <div className="lg:col-span-8 bg-[#ededed] border-2 border-[#18181b] p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
              <div className="w-11 h-11 shrink-0 bg-[#18181b] text-white flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 fill-white text-white" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#18181b] font-black block">
                  ZÁSADNÍ VÝHODA PRO VÁS
                </span>
                <p className="text-xs sm:text-sm text-[#18181b] font-medium leading-snug">
                  Automatizace přímo v kódu na vašem serveru – bez nutnosti platit tisíce měsíčně za drahé externí platformy jako Zapier nebo Make.
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
                <span>Více informací & dotazník pro automatizaci</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
              </MagneticButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
