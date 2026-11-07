import React, { useState, useEffect } from 'react';
import {
  Mail,
  Instagram,
  Facebook,
  ArrowUp,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { scrollToTop } from '../lib/motion';

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

  const handleToggle = () => {
    setUserManuallyToggled(true);
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {/* Odsazení pod obsahem, aby plovoucí linka nezakrývala spodek stránky.
          id="kontakty" je cíl položky menu "Kontakty": posune na konec stránky, kde patička vyjede */}
      <div id="kontakty" className="h-16 sm:h-20 w-full pointer-events-none" />

      {/* PLOVOUCÍ SPODNÍ LIŠTA / ZADEČEK (PERMANENTNĚ VIDITELNÝ JAKO LINKA, PŘI DOJETÍ DOLŮ VYJEDE) */}
      <footer
        id="bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 select-none bg-loyo-surface/95 backdrop-blur-sm text-loyo-text border-t border-loyo-line shadow-[0_-10px_25px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out"
      >
        {/* 1. VYSUVNÝ OBSAH (ZÁVĚR MENŠÍ) - VIDITELNÝ PŘI VYJETÍ */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-125 opacity-100 border-b border-loyo-line' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* LEVÁ ČÁST: ZÁVĚR & BRAND */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-loyo-gold" />
                  <span className="font-mono text-[11px] font-black uppercase tracking-widest text-loyo-muted">
                    ZÁVĚR & VLASTNICTVÍ
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl sm:text-2xl text-loyo-text tracking-tight">
                  LoYo – Správně fungující systémy bez kompromisů
                </h3>

                <p className="text-xs sm:text-sm text-loyo-muted leading-relaxed max-w-xl">
                  Žádné zkopírované šablony ani polovičatá řešení. Vše stavím přímo na míru vašemu
                  byznysu se 100% vlastnictvím vašeho kódu, hesel i serverů.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-loyo-panel text-[11px] font-mono text-loyo-text">
                    #AutonomníAI
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-loyo-panel text-[11px] font-mono text-loyo-text">
                    #ReactAplikace
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-loyo-panel text-[11px] font-mono text-loyo-text">
                    #VlastníZdrojáky
                  </span>
                </div>
              </div>

              {/* PRAVÁ ČÁST: RYCHLÉ KONTAKTY A ZPĚT NAHORU */}
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-loyo-muted block mb-2 font-bold">
                    Přímé spojení:
                  </span>
                  <div className="space-y-2">
                    <a
                      href="mailto:loyo.gruup@gmail.com"
                      className="flex items-center justify-between p-3 rounded-xl bg-loyo-panel hover:bg-loyo-hover border border-loyo-line text-xs font-mono transition-colors group"
                    >
                      <span className="flex items-center gap-2 text-loyo-text font-bold">
                        <Mail className="w-4 h-4 text-loyo-blue" />
                        loyo.gruup@gmail.com
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-loyo-muted group-hover:text-loyo-text transition-colors" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-loyo-muted font-mono">
                    © {new Date().getFullYear()} LoYo. Všechna práva vyhrazena.
                  </span>
                  <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-loyo-panel border border-loyo-line hover:bg-loyo-hover text-loyo-text text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
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
              className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-loyo-text hover:text-loyo-blue transition-colors shrink-0 group"
              title="Napsat e-mail"
            >
              <Mail className="w-4 h-4 text-loyo-muted group-hover:text-loyo-blue transition-colors" />
              <span>loyo.gruup@gmail.com</span>
            </a>

            <span className="text-loyo-muted hidden xs:inline">•</span>

            {/* 2. INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-loyo-text hover:text-loyo-blue transition-colors shrink-0 group"
              title="Instagram profil"
            >
              <Instagram className="w-4 h-4 text-loyo-muted group-hover:text-loyo-blue transition-colors" />
              <span>Instagram</span>
            </a>

            <span className="text-loyo-muted hidden xs:inline">•</span>

            {/* 3. FACEBOOK */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-loyo-text hover:text-loyo-blue transition-colors shrink-0 group"
              title="Facebook stránka"
            >
              <Facebook className="w-4 h-4 text-loyo-muted group-hover:text-loyo-blue transition-colors" />
              <span>Facebook</span>
            </a>
          </div>

          {/* PRAVÁ STRANA: INDIKÁTOR / ROZBALOVACÍ TLAČÍTKO */}
          <div className="flex items-center gap-2 pl-2 shrink-0">
            <button
              onClick={handleToggle}
              className="px-2.5 py-1 rounded-md bg-loyo-panel hover:bg-loyo-hover text-loyo-muted hover:text-loyo-text font-mono text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
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
