import React from 'react';
import { LoyoAnimatedTitle } from '../logo/LoyoAnimatedTitle';

interface HeroProps {
  onScrollToSection?: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section id="uvod" className="relative overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-14 bg-transparent text-[#18181b] border-b border-[#d0d0d0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. NADPIS NA ZAČÁTKU NA STŘED & HLAVNÍ PŘEDSTAVENÍ */}
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Top Tagline with Color Badges - CENTERED */}
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 bg-[#dbdbdb] border border-[#c2c2c2] text-xs font-mono font-bold tracking-wider text-[#18181b] mb-3 shadow-xs">
            <span className="w-2 h-2 bg-[#040b8d]" />
            <span className="w-2 h-2 bg-[#CDA24D]" />
            <span className="w-2 h-2 bg-[#ac0001]" />
            <span className="uppercase ml-1">PORTFOLIO & ZAKÁZKOVÝ VÝVOJ</span>
          </div>

          {/* Animovaný kinetický titul LoYo PREMIUM DEVELOPER - VYCENTROVÁN NA STŘED */}
          <LoyoAnimatedTitle />

          {/* HLAVNÍ ÚVOD - VYCENTROVÁN NA STŘED */}
          <div className="space-y-3.5 text-base sm:text-lg text-[#333] leading-relaxed max-w-3xl mx-auto pt-2 text-center">
            <p className="font-medium text-[#18181b]">
              Vytvářím <strong>správně fungující, propracované prémiové systémy</strong> s využitím moderní AI. 
              Žádné zkopírované šablony ani polovičatá řešení – stavím <strong>přímo na míru cokoliv... cokoliv téměř</strong>.
            </p>
            <p className="text-sm sm:text-base text-[#555] max-w-2xl mx-auto">
              Ke každému projektu přistupuji striktně individuálně. Vím přesně, jak je každý řádek kódu sestavený, a po dokončení je 100 % produktu, zdrojových kódů i přístupů výhradně vaším majetkem.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
