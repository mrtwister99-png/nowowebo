import React, { useState, useEffect } from 'react';
import {
  Mail,
  Instagram,
  Facebook,
  ArrowUp,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [userManuallyToggled, setUserManuallyToggled] = useState<boolean>(false);

  // Detekce scrollování úplně dolů
  useEffect(() => {
    const handleScroll = () => {
      // Pokud uživatel ručně neklikl na zavření, otevřeme při dojezdu dolů
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Pokud jsme do 180px od konce stránky
      const isAtBottom = scrollHeight - (scrollY + clientHeight) < 180;

      if (!userManuallyToggled) {
        if (isAtBottom) {
          setIsExpanded(true);
        } else {
          setIsExpanded(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userManuallyToggled]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = () => {
    setUserManuallyToggled(true);
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {/* Odsazení pod obsahem, aby plovoucí linka nezakrývala spodek stránky */}
      <div className="h-16 sm:h-20 w-full pointer-events-none" />

      {/* PLOVOUCÍ SPODNÍ LIŠTA / ZADEČEK (PERMANENTNĚ VIDITELNÝ JAKO LINKA, PŘI DOJETÍ DOLŮ VYJEDE) */}
      <footer
        id="bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 select-none bg-[#18181b] text-white border-t-2 border-[#27272a] shadow-[0_-10px_25px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out"
      >
        {/* 1. VYSUVNÝ OBSAH (ZÁVĚR MENŠÍ) - VIDITELNÝ PŘI VYJETÍ */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-125 opacity-100 border-b border-[#2e2e33]' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* LEVÁ ČÁST: ZÁVĚR & BRAND */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#a1a1aa]">
                    ZÁVĚR & VLASTNICTVÍ
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
                  LoYo – Správně fungující systémy bez kompromisů
                </h3>

                <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-xl">
                  Žádné zkopírované šablony ani polovičatá řešení. Vše stavím přímo na míru vašemu
                  byznysu se 100% vlastnictvím vašeho kódu, hesel i serverů.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-[#27272a] text-[11px] font-mono text-[#d4d4d8]">
                    #AutonomníAI
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#27272a] text-[11px] font-mono text-[#d4d4d8]">
                    #ReactAplikace
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#27272a] text-[11px] font-mono text-[#d4d4d8]">
                    #VlastníZdrojáky
                  </span>
                </div>
              </div>

              {/* PRAVÁ ČÁST: RYCHLÉ KONTAKTY A ZPĚT NAHORU */}
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717a] block mb-2 font-bold">
                    Přímé spojení:
                  </span>
                  <div className="space-y-2">
                    <a
                      href="mailto:loyo.gruup@gmail.com"
                      className="flex items-center justify-between p-3 rounded-xl bg-[#222226] hover:bg-[#2a2a30] border border-[#333338] text-xs font-mono transition-colors group"
                    >
                      <span className="flex items-center gap-2 text-white font-bold">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        loyo.gruup@gmail.com
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#71717a] font-mono">
                    © {new Date().getFullYear()} LoYo. Všechna práva vyhrazena.
                  </span>
                  <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-white hover:text-[#18181b] text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                  >
                    <span>Zpět nahoru</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ZÁKLADNÍ PERMANENTNÍ LINKA (EMAIL, INSTAGRAM, FACEBOOK) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          {/* STŘED / OBSAH LINKY: JENOM EMAIL, INSTAGRAM, FACEBOOK */}
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-1">
            {/* 1. EMAIL */}
            <a
              href="mailto:loyo.gruup@gmail.com"
              className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-white hover:text-emerald-400 transition-colors shrink-0 group"
              title="Napsat e-mail"
            >
              <Mail className="w-4 h-4 text-[#a1a1aa] group-hover:text-emerald-400 transition-colors" />
              <span>loyo.gruup@gmail.com</span>
            </a>

            <span className="text-[#3f3f46] hidden xs:inline">•</span>

            {/* 2. INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-[#d4d4d8] hover:text-[#e1306c] transition-colors shrink-0 group"
              title="Instagram profil"
            >
              <Instagram className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#e1306c] transition-colors" />
              <span>Instagram</span>
            </a>

            <span className="text-[#3f3f46] hidden xs:inline">•</span>

            {/* 3. FACEBOOK */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-[#d4d4d8] hover:text-[#1877f2] transition-colors shrink-0 group"
              title="Facebook stránka"
            >
              <Facebook className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#1877f2] transition-colors" />
              <span>Facebook</span>
            </a>
          </div>

          {/* PRAVÁ STRANA: INDIKÁTOR / ROZBALOVACÍ TLAČÍTKO */}
          <div className="flex items-center gap-2 pl-2 shrink-0">
            <button
              onClick={handleToggle}
              className="px-2.5 py-1 rounded-md bg-[#27272a] hover:bg-[#323238] text-[#a1a1aa] hover:text-white font-mono text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title={isExpanded ? 'Zavřít závěr' : 'Rozbalit závěr'}
            >
              <span className="hidden sm:inline">{isExpanded ? 'Zavřít' : 'Závěr'}</span>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
