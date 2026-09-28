import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { LoyoLogoBox } from '../logo/LoyoLogoBox';
import { MiniFallingCubesInGap } from '../dalsi/MiniFallingCubesInGap';
import { CursorParticleMode, ServiceId } from '../types';

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
  onScrollToTop
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
    { id: 'automatizace', page: 'automation', num: '01', title: 'Automatizace procesů & ekosystém', color: '#040b8d' },
    { id: 'fullstack', page: 'fullstack', num: '02', title: 'Vývoj aplikací fullstack', color: '#CDA24D' },
    { id: 'weby', page: 'web-branding', num: '03', title: 'Tvorba webů, Restyling & Logo', color: '#ac0001' },
    { id: 'konzultace', page: 'consultation', num: '04', title: 'Odborná osobní konzultace', color: '#18181b' },
    { id: 'zprava', page: 'home', num: '05', title: 'Rychlá zpráva k projektu', color: '#666666' },
    { id: 'kontakty', page: 'home', num: '06', title: 'Kontakty & Sociální sítě', color: '#18181b' }
  ];

  return (
    <div className="relative w-full select-none bg-transparent">
      
      <style>{`
        @keyframes floatBubbleLeft1 {
          0% { transform: translate(-4px, 0) scale(0.3); opacity: 0; }
          25% { opacity: 0.95; }
          75% { opacity: 0.8; }
          100% { transform: translate(-14px, -44px) scale(1.15); opacity: 0; }
        }
        @keyframes floatBubbleLeft2 {
          0% { transform: translate(-2px, 0) scale(0.25); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.75; }
          100% { transform: translate(-8px, -52px) scale(1.3); opacity: 0; }
        }
        @keyframes floatBubbleCenter1 {
          0% { transform: translate(0px, 0) scale(0.3); opacity: 0; }
          25% { opacity: 0.95; }
          75% { opacity: 0.8; }
          100% { transform: translate(4px, -38px) scale(1.0); opacity: 0; }
        }
        @keyframes floatBubbleCenter2 {
          0% { transform: translate(2px, 0) scale(0.2); opacity: 0; }
          20% { opacity: 0.85; }
          80% { opacity: 0.7; }
          100% { transform: translate(-4px, -48px) scale(1.25); opacity: 0; }
        }
        @keyframes floatBubbleRight1 {
          0% { transform: translate(4px, 0) scale(0.35); opacity: 0; }
          25% { opacity: 0.9; }
          75% { opacity: 0.75; }
          100% { transform: translate(12px, -42px) scale(1.1); opacity: 0; }
        }
        @keyframes floatBubbleRight2 {
          0% { transform: translate(6px, 0) scale(0.25); opacity: 0; }
          20% { opacity: 0.85; }
          80% { opacity: 0.7; }
          100% { transform: translate(16px, -54px) scale(1.35); opacity: 0; }
        }
        .anim-b-left1 { animation: floatBubbleLeft1 2.1s infinite ease-out; }
        .anim-b-left2 { animation: floatBubbleLeft2 2.7s infinite 0.7s ease-out; }
        .anim-b-center1 { animation: floatBubbleCenter1 1.9s infinite 0.3s ease-out; }
        .anim-b-center2 { animation: floatBubbleCenter2 2.5s infinite 1.1s ease-out; }
        .anim-b-right1 { animation: floatBubbleRight1 2.3s infinite 0.5s ease-out; }
        .anim-b-right2 { animation: floatBubbleRight2 2.9s infinite 1.5s ease-out; }

        @keyframes loyoJumpL {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          15% { transform: translateY(4px) scale(1.12, 0.88) rotate(-2deg); }
          45% { transform: translateY(-16px) scale(0.92, 1.14) rotate(-5deg); box-shadow: 5px 14px 0px #18181b; }
          70% { transform: translateY(0) scale(1.12, 0.88) rotate(2deg); }
          85% { transform: translateY(-3px) scale(0.98, 1.02) rotate(-1deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes loyoSpinO1 {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.12); box-shadow: 4px 4px 0px #CDA24D; border-color: #CDA24D; }
          50% { transform: rotate(180deg) scale(0.93); box-shadow: 3px 3px 0px #18181b; }
          75% { transform: rotate(270deg) scale(1.1); box-shadow: 4px 4px 0px #CDA24D; border-color: #CDA24D; }
          90% { transform: rotate(370deg) scale(1.03); }
          100% { transform: rotate(360deg) scale(1); border-color: #18181b; }
        }
        @keyframes loyoSwingY {
          0% { transform: rotate(0deg) skewX(0deg) scale(1); }
          20% { transform: rotate(-14deg) skewX(-10deg) scale(1.12, 0.92); box-shadow: 6px 4px 0px #ac0001; border-color: #ac0001; }
          40% { transform: rotate(12deg) skewX(8deg) scale(0.92, 1.12); box-shadow: 2px 4px 0px #18181b; }
          60% { transform: rotate(-7deg) skewX(-4deg) scale(1.05, 0.96); }
          80% { transform: rotate(3deg) skewX(2deg) scale(0.99, 1.01); }
          100% { transform: rotate(0deg) skewX(0deg) scale(1); border-color: #18181b; }
        }
        @keyframes loyoPulseO2 {
          0% { transform: scale(1); box-shadow: 3px 3px 0px #18181b; }
          18% { transform: scale(1.16) translate(-2px, -2px); box-shadow: 7px 7px 0px #18181b; border-color: #bef264; }
          38% { transform: scale(1.02) translate(0, 0); box-shadow: 4px 4px 0px #18181b; }
          56% { transform: scale(1.2) translate(-3px, -3px); box-shadow: 8px 8px 0px #18181b; border-color: #bef264; }
          76% { transform: scale(0.96) translate(1px, 1px); box-shadow: 2px 2px 0px #18181b; }
          100% { transform: scale(1) translate(0, 0); box-shadow: 3px 3px 0px #18181b; border-color: #18181b; }
        }
        .anim-cube-L { animation: loyoJumpL 0.85s cubic-bezier(0.2, 0.8, 0.25, 1) forwards !important; }
        .anim-cube-o1 { animation: loyoSpinO1 0.9s cubic-bezier(0.34, 1.3, 0.64, 1) forwards !important; }
        .anim-cube-Y { animation: loyoSwingY 0.85s cubic-bezier(0.25, 1.2, 0.5, 1) forwards !important; }
        .anim-cube-o2 { animation: loyoPulseO2 0.85s cubic-bezier(0.2, 0.9, 0.3, 1) forwards !important; }

        @keyframes slideDown {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

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
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white border-3 border-[#18181b] shadow-[0_8px_24px_rgba(24,24,27,0.22),4px_4px_0px_#18181b] flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 transition-all overflow-hidden relative z-30"
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
            
            <div
              id="header-location-pill"
              className="h-10 sm:h-11 px-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border-2 border-[#18181b] shadow-[3px_3px_0px_#18181b] flex items-center gap-2 text-xs font-semibold text-[#18181b] select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0 animate-pulse" />
              <span className="font-heading tracking-wide uppercase text-2.75 sm:text-xs truncate max-w-32.5 sm:max-w-52.5">
                {currentPage !== 'home' ? `Detail: ${currentPage}` : 'Úvod • LoYo Premium Developer'}
              </span>
            </div>

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
                  className={`h-10 sm:h-11 w-10 sm:w-11 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] group relative ${
                    cursorMode === 'bubbles'
                      ? 'bg-loyo-blue border-[#18181b] text-white'
                      : 'bg-white border-[#18181b] text-[#18181b] hover:bg-neutral-50'
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
                    <circle cx="9" cy="13" r="5" fill={cursorMode === 'bubbles' ? 'rgba(255,255,255,0.2)' : 'rgba(4,11,141,0.08)'} />
                    <circle cx="16" cy="9" r="3.5" fill={cursorMode === 'bubbles' ? 'rgba(255,255,255,0.25)' : 'rgba(205,162,77,0.12)'} />
                    <circle cx="14" cy="17" r="2" fill={cursorMode === 'bubbles' ? 'rgba(255,255,255,0.3)' : 'rgba(172,0,1,0.10)'} />
                  </svg>
                </button>
              </div>
            )}

            {/* MENU BUTTON - now toggles dropdown */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              id="header-menu-button"
              className={`h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 border-[#18181b] shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none ${
                isMenuOpen ? 'bg-white text-[#18181b] -translate-y-0.5 shadow-[4px_4px_0px_#000]' : 'bg-[#18181b] hover:bg-[#2c2c31] text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000]'
              } active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />}
              <span>{isMenuOpen ? 'ZAVŘÍT' : 'MENU'}</span>
            </button>

            <button
              onClick={() => onOpenQuestionnaire()}
              id="header-dotaznik-button"
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none"
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
              className="w-full sm:w-auto bg-white border-2 border-[#18181b] rounded-3xl sm:rounded-tr-none p-3.5 sm:p-4 md:p-5 shadow-[6px_6px_0px_#18181b] relative z-10 flex justify-center"
            >
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 select-none">
                
                <div
                  onMouseEnter={() => triggerCubeAnim('L')}
                  onClick={() => triggerCubeAnim('L')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.L ? 'anim-cube-L' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-blue" />
                  <span className={`tracking-tight transition-transform duration-300 ${animatingCube.L ? 'scale-115 text-loyo-blue' : ''}`}>L</span>
                </div>

                <div
                  onMouseEnter={() => triggerCubeAnim('o1')}
                  onClick={() => triggerCubeAnim('o1')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.o1 ? 'anim-cube-o1' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-mustard" />
                  <span className={`tracking-tight lowercase transition-transform duration-300 ${animatingCube.o1 ? 'scale-120 text-loyo-mustard' : ''}`}>o</span>
                </div>

                <div
                  onMouseEnter={() => triggerCubeAnim('Y')}
                  onClick={() => triggerCubeAnim('Y')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.Y ? 'anim-cube-Y' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-loyo-red" />
                  <span className={`tracking-tight transition-transform duration-300 ${animatingCube.Y ? 'scale-115 text-loyo-red' : ''}`}>Y</span>
                </div>

                <div
                  onMouseEnter={() => triggerCubeAnim('o2')}
                  onClick={() => triggerCubeAnim('o2')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.o2 ? 'anim-cube-o2' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-[#18181b]" />
                  <span className={`tracking-tight lowercase transition-transform duration-300 ${animatingCube.o2 ? 'scale-120 text-[#bef264]' : ''}`}>o</span>
                </div>

              </div>
            </div>

            <div className="w-full flex-1 flex items-end justify-center pt-1 relative z-40 overflow-visible">
              <MiniFallingCubesInGap />
            </div>
          </div>

                    <div className="flex-1 w-full flex flex-col min-w-0 sm:-ml-0.5 mt-3 sm:mt-0 justify-between">
            
            <div
              id="card-premium-developer"
              className="bg-white border-2 border-[#18181b] sm:border-l-0 rounded-2xl sm:rounded-l-none sm:rounded-r-3xl p-4 sm:p-5 md:p-6 shadow-[6px_6px_0px_#18181b] relative z-20"
            >
              <div className="hidden sm:block absolute -left-0.75 top-0.5 bottom-0.5 w-1.5 bg-white z-30 pointer-events-none" />

              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-[#555]">PREMIUM</span>
                <span className="h-0.5 w-10 sm:w-16 bg-[#18181b]" />
              </div>

                            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-[#18181b] leading-tight uppercase wrap-break-word">
                DEVELOPER
              </h1>
            </div>

            <div
              id="card-uvod"
              className="bg-white border-2 border-[#18181b] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-[4px_4px_0px_#18181b] mt-2.5 mb-2.5 sm:mb-3 sm:ml-3 text-center relative z-10"
            >
              <div className="flex justify-center mb-2">
                <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-loyo-blue flex items-center gap-2 px-3 py-0.5 bg-loyo-blue/8 rounded-full border border-loyo-blue/20">
                  <span className="w-2 h-2 rounded-full bg-loyo-blue" />
                  <span>ÚVOD</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#18181b] font-medium leading-relaxed max-w-2xl mx-auto">
                Vytvářím <strong>správně fungující, propracované prémiové systémy</strong> s využitím moderní AI. 
                Žádné zkopírované šablony ani polovičatá řešení – stavím <strong>přímo na míru cokoliv... cokoliv téměř</strong>.
              </p>

              <p className="text-xs sm:text-sm text-[#555] mt-1.5 leading-relaxed max-w-xl mx-auto">
                Ke každému projektu přistupuji striktně individuálně. Vím přesně, jak je každý řádek kódu sestavený, a po dokončení je 100 % produktu, zdrojových kódů i přístupů výhradně vaším majetkem.
              </p>
            </div>

          </div>

        </div>

        <div className="mt-0">
          <div
            id="card-hlavni-info"
            className="bg-white border-2 border-[#18181b] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#18181b]"
          >
            
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e4e4e7]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18181b] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs">
                <span>HLAVNÍ INFO</span>
              </div>
              <span className="text-2.75 font-mono text-[#777] font-medium hidden sm:inline">
                LoYo Visual Identity & Core Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="border-l-3 border-loyo-blue pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-blue" />
                  100% Vlastnictví
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Zdrojový kód, databáze a cloudová infrastruktura jsou od prvního dne kompletně vaším majetkem.
                </div>
              </div>

              <div className="border-l-3 border-loyo-mustard pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-mustard" />
                  Vývoj bez šablon
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Žádné restriktivní CMS šablony ani univerzální pluginy. Vše je navrženo přímo pro vaše procesy.
                </div>
              </div>

              <div className="border-l-3 border-loyo-red pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-loyo-red" />
                  AI & Automatizace
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Autonomní agenti, chytré zpracování dat a full-stack aplikace šetřící desítky hodin měsíčně.
                </div>
              </div>

              <div className="border-l-3 border-[#18181b] pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181b]" />
                  Přímý kontakt
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Žádná agenturní byrokracie ani prostředníci. Řešíte zadání i detaily přímo se samotným vývojářem.
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
              <div className="bg-white border-2 border-[#18181b] rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_#18181b] overflow-hidden animate-[slideDown_0.35s_cubic-bezier(0.16,1,0.3,1)]">
                
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-[#18181b] bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#18181b] text-white flex items-center justify-center">
                      <Menu className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-black text-sm sm:text-base tracking-tight uppercase">Navigační menu</span>
                    <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 bg-loyo-bar border border-[#c2c2c2] text-2.5 font-mono font-bold uppercase">6 sekcí</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-[#18181b] hover:text-white border-2 border-[#18181b] shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer transition-all"
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
                      className="w-full p-3.5 bg-white hover:bg-neutral-50 border-2 border-[#18181b] rounded-xl shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-0.75 shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                          <div className="text-2.5 font-mono font-bold text-[#666]">SEKCE {item.num}</div>
                          <div className="font-heading font-bold text-sm text-[#18181b] group-hover:text-loyo-blue transition-colors">{item.title}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-[#18181b] group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="px-5 sm:px-6 py-4 bg-[#f5f5f5] border-t-2 border-[#18181b] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-[#666] text-center sm:text-left">
                    loyo.gruup@gmail.com • LoYo PREMIUM DEVELOPER
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenQuestionnaire();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] font-heading font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
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
