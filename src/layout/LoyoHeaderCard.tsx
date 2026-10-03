import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { LoyoLogoBox } from '../components/brand/LoyoLogoBox';
import { CursorParticleMode, ServiceId } from '../types';
import { BRAND } from '../lib/colors';

// Minihra se stahuje samostatně (odděleně od hlavního balíčku), až když je potřeba
const MiniFallingCubesInGap = lazy(() =>
  import('../features/minigame/MiniFallingCubesInGap').then((m) => ({
    default: m.MiniFallingCubesInGap,
  })),
);

interface LoyoHeaderCardProps {
  activeSection: string;
  currentPage: string;
  cursorMode?: CursorParticleMode;
  onToggleCursorMode?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
  onNavigateToPage: (page: string) => void;
  onScrollToTop?: () => void;
}

export const LoyoHeaderCard: React.FC<LoyoHeaderCardProps> = ({
  activeSection,
  currentPage,
  cursorMode = 'none',
  onToggleCursorMode,
  onOpenQuestionnaire,
  onNavigateToPage,
  onScrollToTop,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [animatingCube, setAnimatingCube] = useState<{ [key: string]: boolean }>({
    L: false,
    o1: false,
    Y: false,
    o2: false,
  });

  const triggerCubeAnim = (key: 'L' | 'o1' | 'Y' | 'o2') => {
    setAnimatingCube((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAnimatingCube((prev) => ({ ...prev, [key]: false }));
    }, 900);
  };

  useEffect(() => {
    const letters: Array<'L' | 'o1' | 'Y' | 'o2'> = ['L', 'o1', 'Y', 'o2'];
    let step = 0;
    const periodicInterval = setInterval(() => {
      const targetLetter = letters[step % letters.length];
      triggerCubeAnim(targetLetter);
      step++;
    }, 2600);
    return () => clearInterval(periodicInterval);
  }, []);

  const menuItems = [
    {
      id: 'automatizace',
      page: 'automation',
      num: '01',
      title: 'Automatizace procesů & ekosystém',
      color: BRAND.blue,
    },
    {
      id: 'fullstack',
      page: 'fullstack',
      num: '02',
      title: 'Vývoj aplikací fullstack',
      color: BRAND.mustard,
    },
    {
      id: 'weby',
      page: 'web-branding',
      num: '03',
      title: 'Tvorba webů, Restyling & Logo',
      color: BRAND.red,
    },
    {
      id: 'konzultace',
      page: 'consultation',
      num: '04',
      title: 'Odborná osobní konzultace',
      color: BRAND.ink,
    },
    { id: 'zprava', page: 'home', num: '05', title: 'Rychlá zpráva k projektu', color: '#666666' },
    {
      id: 'kontakty',
      page: 'home',
      num: '06',
      title: 'Kontakty & Sociální sítě',
      color: BRAND.ink,
    },
  ];

  return (
    <div className="relative w-full select-none bg-transparent">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[70] pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-2 flex items-center justify-between gap-3 pointer-events-auto">
          {/* LOGO */}
          <div className="flex items-center shrink-0 ml-0">
            <button
              onClick={() => {
                if (onScrollToTop) onScrollToTop();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              id="header-circle-logo-2x"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white border-3 border-loyo-ink shadow-[0_8px_24px_rgba(24,24,27,0.22),4px_4px_0px_#18181b] flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 transition-all overflow-hidden relative z-30"
              title="LoYo • Zpět na začátek"
            >
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-neutral-50">
                <LoyoLogoBox
                  activeSection={activeSection}
                  currentPage={currentPage}
                  className="scale-150 sm:scale-165 md:scale-180"
                />
              </div>
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {onToggleCursorMode && (
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute -top-1 inset-x-0 h-0 pointer-events-none z-10">
                  {cursorMode === 'bubbles' ? (
                    <>
                      <span className="anim-b-left1 absolute -left-1.5 w-2.5 h-2.5 rounded-full bg-loyo-blue shadow-[0_0_6px_rgba(4,11,141,0.6)] border border-white/80" />
                      <span className="anim-b-left2 absolute left-0.5 w-3 h-3 rounded-full bg-loyo-mustard shadow-[0_0_6px_rgba(205,162,77,0.6)] border border-white/80" />
                      <span className="anim-b-center1 absolute left-4 w-2 h-2 rounded-full bg-loyo-red shadow-[0_0_6px_rgba(172,0,1,0.6)] border border-white/80" />
                      <span className="anim-b-center2 absolute left-5.5 w-3.5 h-3.5 rounded-full bg-loyo-blue shadow-[0_0_8px_rgba(4,11,141,0.7)] border border-white/90" />
                      <span className="anim-b-right1 absolute left-8 w-2.5 h-2.5 rounded-full bg-loyo-mustard shadow-[0_0_6px_rgba(205,162,77,0.6)] border border-white/80" />
                      <span className="anim-b-right2 absolute left-9.5 w-2 h-2 rounded-full bg-loyo-red shadow-[0_0_5px_rgba(172,0,1,0.6)] border border-white/80" />
                    </>
                  ) : (
                    <>
                      <span className="anim-b-left1 absolute -left-1.75 w-2 h-2 rounded-full bg-loyo-mustard shadow-[0_0_5px_rgba(205,162,77,0.5)] border border-white/70" />
                      <span className="anim-b-left2 absolute left-px w-3.5 h-3.5 rounded-full bg-loyo-blue shadow-[0_0_6px_rgba(4,11,141,0.5)] border border-white/70" />
                      <span className="anim-b-center1 absolute left-3.75 w-2.5 h-2.5 rounded-full bg-loyo-red shadow-[0_0_5px_rgba(172,0,1,0.5)] border border-white/70" />
                      <span className="anim-b-center2 absolute left-5.25 w-3 h-3 rounded-full bg-loyo-mustard shadow-[0_0_6px_rgba(205,162,77,0.5)] border border-white/70" />
                      <span className="anim-b-right1 absolute left-7.75 w-2 h-2 rounded-full bg-loyo-blue shadow-[0_0_5px_rgba(4,11,141,0.5)] border border-white/70" />
                      <span className="anim-b-right2 absolute left-9.25 w-3 h-3 rounded-full bg-loyo-red shadow-[0_0_6px_rgba(172,0,1,0.5)] border border-white/70" />
                    </>
                  )}
                </div>

                <button
                  onClick={onToggleCursorMode}
                  id="header-bubbles-icon-button"
                  className={`h-10 sm:h-11 w-10 sm:w-11 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all shadow-brutal-3 hover:-translate-y-0.5 hover:shadow-brutal-4 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 group relative ${
                    cursorMode === 'bubbles'
                      ? 'bg-loyo-blue border-loyo-ink text-white'
                      : 'bg-white border-loyo-ink text-loyo-ink hover:bg-neutral-50'
                  }`}
                  title={cursorMode === 'bubbles' ? 'Bublinky: AKTIVNÍ' : 'Bublinky: VYPNUTO'}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${cursorMode === 'bubbles' ? 'scale-110' : 'group-hover:scale-105'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="9"
                      cy="13"
                      r="5"
                      fill={
                        cursorMode === 'bubbles' ? 'rgba(255,255,255,0.2)' : 'rgba(4,11,141,0.08)'
                      }
                    />
                    <circle
                      cx="16"
                      cy="9"
                      r="3.5"
                      fill={
                        cursorMode === 'bubbles'
                          ? 'rgba(255,255,255,0.25)'
                          : 'rgba(205,162,77,0.12)'
                      }
                    />
                    <circle
                      cx="14"
                      cy="17"
                      r="2"
                      fill={
                        cursorMode === 'bubbles' ? 'rgba(255,255,255,0.3)' : 'rgba(172,0,1,0.10)'
                      }
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* MENU BUTTON - now toggles dropdown */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              id="header-menu-button"
              className={`h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 border-loyo-ink shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none ${
                isMenuOpen
                  ? 'bg-white text-loyo-ink -translate-y-0.5 shadow-[4px_4px_0px_#000]'
                  : 'bg-loyo-ink hover:bg-[#2c2c31] text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000]'
              } active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`}
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              )}
              <span>{isMenuOpen ? 'ZAVŘÍT' : 'MENU'}</span>
            </button>

            <button
              onClick={() => onOpenQuestionnaire()}
              id="header-dotaznik-button"
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-loyo-ink shadow-brutal-3 hover:-translate-y-0.5 hover:shadow-brutal-4 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>DOTAZNÍK</span>
            </button>
          </div>
        </div>
      </header>

      {/* OBSAH ÚVODU */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-22 pb-8 bg-transparent">
        <div className="flex flex-col sm:flex-row items-stretch">
          <div className="shrink-0 w-full sm:w-auto flex flex-col items-center sm:items-stretch justify-between relative z-30">
            <div
              id="card-loyo-cubes"
              className="w-full sm:w-auto bg-white border-2 border-loyo-ink rounded-3xl sm:rounded-tr-none p-3.5 sm:p-4 md:p-5 shadow-brutal-6 relative z-10 flex justify-center"
            >
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 select-none">
                <div
                  onMouseEnter={() => triggerCubeAnim('L')}
                  onClick={() => triggerCubeAnim('L')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-loyo-ink rounded-2xl shadow-brutal-3 flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-loyo-ink relative overflow-hidden group hover:-translate-y-1 hover:shadow-brutal-5 transition-all cursor-pointer ${
                    animatingCube.L ? 'anim-cube-L' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-blue" />
                  <span
                    className={`tracking-tight transition-transform duration-300 ${animatingCube.L ? 'scale-115 text-loyo-blue' : ''}`}
                  >
                    L
                  </span>
                </div>

                <div
                  onMouseEnter={() => triggerCubeAnim('o1')}
                  onClick={() => triggerCubeAnim('o1')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-loyo-ink rounded-2xl shadow-brutal-3 flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-loyo-ink relative overflow-hidden group hover:-translate-y-1 hover:shadow-brutal-5 transition-all cursor-pointer ${
                    animatingCube.o1 ? 'anim-cube-o1' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-mustard" />
                  <span
                    className={`tracking-tight lowercase transition-transform duration-300 ${animatingCube.o1 ? 'scale-120 text-loyo-mustard' : ''}`}
                  >
                    o
                  </span>
                </div>

                <div
                  onMouseEnter={() => triggerCubeAnim('Y')}
                  onClick={() => triggerCubeAnim('Y')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-loyo-ink rounded-2xl shadow-brutal-3 flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-loyo-ink relative overflow-hidden group hover:-translate-y-1 hover:shadow-brutal-5 transition-all cursor-pointer ${
                    animatingCube.Y ? 'anim-cube-Y' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-red" />
                  <span
                    className={`tracking-tight transition-transform duration-300 ${animatingCube.Y ? 'scale-115 text-loyo-red' : ''}`}
                  >
                    Y
                  </span>
                </div>

                <div
                  onMouseEnter={() => triggerCubeAnim('o2')}
                  onClick={() => triggerCubeAnim('o2')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-loyo-ink rounded-2xl shadow-brutal-3 flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-loyo-ink relative overflow-hidden group hover:-translate-y-1 hover:shadow-brutal-5 transition-all cursor-pointer ${
                    animatingCube.o2 ? 'anim-cube-o2' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-ink" />
                  <span
                    className={`tracking-tight lowercase transition-transform duration-300 ${animatingCube.o2 ? 'scale-120 text-[#bef264]' : ''}`}
                  >
                    o
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full flex-1 flex items-start justify-center pt-1 relative z-40 overflow-visible">
              {/* Záložní prvek má stejnou výšku jako hra, aby se stránka při načtení neposunula */}
              <Suspense fallback={<div className="w-full h-27.5 sm:h-30" aria-hidden="true" />}>
                <MiniFallingCubesInGap />
              </Suspense>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col min-w-0 mt-0 sm:-ml-[2px] sm:mt-0 justify-start relative z-30">
            <div
              id="card-premium-developer"
              className="bg-white border-2 border-loyo-ink sm:border-l-0 rounded-2xl sm:rounded-l-none sm:rounded-r-3xl p-4 sm:p-5 md:p-6 shadow-brutal-6 relative z-20"
            >
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-loyo-muted">
                  PREMIUM
                </span>
                <span className="h-0.5 w-10 sm:w-16 bg-loyo-ink" />
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-loyo-ink leading-tight uppercase wrap-break-word">
                DEVELOPER
              </h1>
            </div>

            <div
              id="card-uvod"
              className="bg-white border-2 border-loyo-ink rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-brutal-4 mt-4 sm:mt-5 mb-2.5 sm:mb-3 sm:ml-3 text-center relative z-10"
            >
              <div className="flex justify-center mb-2">
                <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-loyo-blue flex items-center gap-2 px-3 py-0.5 bg-loyo-blue/8 rounded-full border border-loyo-blue/20">
                  <span className="w-2 h-2 rounded-full bg-loyo-blue" />
                  <span>ÚVOD</span>
                </div>
              </div>

              {/* Úvodní věta (claim) */}
              <p className="font-heading font-black text-base sm:text-lg md:text-xl text-loyo-ink leading-snug max-w-2xl mx-auto">
                Automatizuji. Vyvíjím. Přetvářím nápady v realitu.
              </p>

              {/* Hlavní odstavec */}
              <p className="text-sm sm:text-base text-loyo-ink font-medium leading-relaxed max-w-2xl mx-auto mt-2">
                Tvořím weby, aplikace a chytré systémy, které šetří desítky hodin práce. Kombinuji
                sílu AI s hlubokou znalostí vývoje, díky čemuž dokážu rychle navrhnout, postavit i
                upravit řešení přesně podle vašich potřeb. Každý projekt vzniká na míru s důrazem
                na výkon, jednoduchost a dlouhodobou hodnotu.
              </p>

              {/* Závěrečná výzva */}
              <p className="text-sm sm:text-base text-loyo-ink font-bold leading-relaxed max-w-2xl mx-auto mt-3">
                Pojďme postavit něco, co vám vrátí čas zpět.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-0">
          <div
            id="card-hlavni-info"
            className="bg-white border-2 border-loyo-ink rounded-3xl p-5 sm:p-7 shadow-brutal-6"
          >
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e4e4e7]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-ink text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs">
                <span>HLAVNÍ INFO</span>
              </div>
              <span className="text-[11px] font-mono text-loyo-faint font-medium hidden sm:inline">
                LoYo Visual Identity & Core Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="border-l-3 border-loyo-blue pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-blue" />
                  100% Vlastnictví
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Zdrojový kód, databáze a cloudová infrastruktura jsou od prvního dne kompletně
                  vaším majetkem.
                </div>
              </div>

              <div className="border-l-3 border-loyo-mustard pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-mustard" />
                  Vývoj bez šablon
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Žádné restriktivní CMS šablony ani univerzální pluginy. Vše je navrženo přímo pro
                  vaše procesy.
                </div>
              </div>

              <div className="border-l-3 border-loyo-red pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-red" />
                  AI & Automatizace
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Autonomní agenti, chytré zpracování dat a full-stack aplikace šetřící desítky
                  hodin měsíčně.
                </div>
              </div>

              <div className="border-l-3 border-loyo-ink pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-ink" />
                  Přímý kontakt
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Žádná agenturní byrokracie ani prostředníci. Řešíte zadání i detaily přímo se
                  samotným vývojářem.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOVÉ MENU - VYSUNE SE DOLŮ Z HEADERU */}
      {isMenuOpen && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-65 bg-black/20 backdrop-blur- animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* dropdown panel */}
          <div className="fixed top-22 sm:top-24 left-0 right-0 z-72 px-4 sm:px-6 pointer-events-none">
            <div className="max-w-6xl mx-auto pointer-events-auto">
              <div className="bg-white border-2 border-loyo-ink rounded-2xl sm:rounded-3xl shadow-brutal-8 overflow-hidden animate-[slideDown_0.35s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-loyo-ink bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-loyo-ink text-white flex items-center justify-center">
                      <Menu className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-black text-sm sm:text-base tracking-tight uppercase">
                      Navigační menu
                    </span>
                    <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 bg-loyo-bar border border-loyo-line text-[10px] font-mono font-bold uppercase">
                      6 sekcí
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-loyo-ink hover:text-white border-2 border-loyo-ink shadow-brutal-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (item.page !== 'home') {
                          onNavigateToPage(item.page);
                        } else {
                          const el = document.getElementById(item.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full p-3.5 bg-white hover:bg-neutral-50 border-2 border-loyo-ink rounded-xl shadow-brutal-3 hover:-translate-y-0.5 hover:shadow-brutal-4 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <div className="text-[10px] font-mono font-bold text-loyo-subtle">
                            SEKCE {item.num}
                          </div>
                          <div className="font-heading font-bold text-sm text-loyo-ink group-hover:text-loyo-blue transition-colors">
                            {item.title}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-loyo-ink group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="px-5 sm:px-6 py-4 bg-[#f5f5f5] border-t-2 border-loyo-ink flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-loyo-subtle text-center sm:text-left">
                    loyo.gruup@gmail.com • LoYo PREMIUM DEVELOPER
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenQuestionnaire();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-loyo-ink shadow-brutal-3 hover:-translate-y-0.5 hover:shadow-brutal-4 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 font-heading font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>OTEVŘÍT DOTAZNÍK</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
