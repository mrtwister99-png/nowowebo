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

  // Animation states for the 4 individual cubes (L, o1, Y, o2)
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

  // Autonomous periodic animation cycling through each letter independently
  // "po kazde pismenko zvlast - a kazde pismenko jinou animaci - jakoze po najeti mysi + jedniu za x - nebi ruzne"
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

  // Section items for menu drawer
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
      
      {/* CSS for animated rising bubbles coming out of button across left, center, right */}
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

        /* 4 UNIKÁTNÍ ANIMACE PRO 4 PÍSMENKA VE ČTVEREČCÍCH */
        /* Cube 1: L - Skok a elastické stlačení */
        @keyframes loyoJumpL {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          15% { transform: translateY(4px) scale(1.12, 0.88) rotate(-2deg); }
          45% { transform: translateY(-16px) scale(0.92, 1.14) rotate(-5deg); box-shadow: 5px 14px 0px #18181b; }
          70% { transform: translateY(0) scale(1.12, 0.88) rotate(2deg); }
          85% { transform: translateY(-3px) scale(0.98, 1.02) rotate(-1deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }

        /* Cube 2: o (nahoře vpravo) - Otočka a vytočení o 360 stupňů s odleskem */
        @keyframes loyoSpinO1 {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.12); box-shadow: 4px 4px 0px #CDA24D; border-color: #CDA24D; }
          50% { transform: rotate(180deg) scale(0.93); box-shadow: 3px 3px 0px #18181b; }
          75% { transform: rotate(270deg) scale(1.1); box-shadow: 4px 4px 0px #CDA24D; border-color: #CDA24D; }
          90% { transform: rotate(370deg) scale(1.03); }
          100% { transform: rotate(360deg) scale(1); border-color: #18181b; }
        }

        /* Cube 3: Y (dole vlevo) - Pružinové vyosení / houpačka do stran */
        @keyframes loyoSwingY {
          0% { transform: rotate(0deg) skewX(0deg) scale(1); }
          20% { transform: rotate(-14deg) skewX(-10deg) scale(1.12, 0.92); box-shadow: 6px 4px 0px #ac0001; border-color: #ac0001; }
          40% { transform: rotate(12deg) skewX(8deg) scale(0.92, 1.12); box-shadow: 2px 4px 0px #18181b; }
          60% { transform: rotate(-7deg) skewX(-4deg) scale(1.05, 0.96); }
          80% { transform: rotate(3deg) skewX(2deg) scale(0.99, 1.01); }
          100% { transform: rotate(0deg) skewX(0deg) scale(1); border-color: #18181b; }
        }

        /* Cube 4: o (dole vpravo) - Tactile Heartbeat 3D Pop a zelený pulz hrany */
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
      `}</style>

      {/* ========================================================================= */}
      {/* 1, 2, 3, 4, 5 = FIXED HEADER (BUDE VIDĚT FURT - Z-[70] ABY BYL VŽDY NEJVÝŠ) */}
      {/* Background is transparent so cubes are seen, buttons are solid and crisp */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-[70] pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-2 flex items-center justify-between gap-3 pointer-events-auto">
          
          {/* LOGO (1) - KOLEČKO POSUNUTÉ DOLEVA */}
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
              {/* Scaled dynamic interactive logo inside */}
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-[#fafafa]">
                <LoyoLogoBox
                  activeSection={activeSection}
                  currentPage={currentPage}
                  className="scale-150 sm:scale-165 md:scale-180"
                />
              </div>
            </button>
          </div>

          {/* 2, 5, 3, 4 = PRAVÉ TLAČÍTKA (Kde jsme, Bublinky, Menu, Dotazník) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            
            {/* 2 = AKTUÁLNĚ KDE JSME */}
            <div
              id="header-location-pill"
              className="h-10 sm:h-11 px-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border-2 border-[#18181b] shadow-[3px_3px_0px_#18181b] flex items-center gap-2 text-xs font-semibold text-[#18181b] select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#18181b] shrink-0 animate-pulse" />
              <span className="font-heading tracking-wide uppercase text-[11px] sm:text-xs truncate max-w-[130px] sm:max-w-[210px]">
                {currentPage !== 'home' ? `Detail: ${currentPage}` : 'Úvod • LoYo Premium Developer'}
              </span>
            </div>

            {/* 5 = BUBLINKY: PŮVODNÍ VZHLED & ANIMACE SE 3 NAŠIMI BARVAMI */}
            {onToggleCursorMode && (
              <div className="relative inline-flex items-center justify-center">
                
                {/* Vznášející se bublinky vycházející z tlačítka (vlevo, na středu, vpravo) v našich 3 barvách */}
                <div className="absolute -top-1 inset-x-0 h-0 pointer-events-none z-10">
                  {cursorMode === 'bubbles' ? (
                    // Aktivní stav: naše 3 barvy (modrá, zlatá, červená)
                    <>
                      <span className="anim-b-left1 absolute left-[-6px] w-2.5 h-2.5 rounded-full bg-[#040b8d] shadow-[0_0_6px_rgba(4,11,141,0.6)] border border-white/80" />
                      <span className="anim-b-left2 absolute left-[2px] w-3 h-3 rounded-full bg-[#CDA24D] shadow-[0_0_6px_rgba(205,162,77,0.6)] border border-white/80" />
                      <span className="anim-b-center1 absolute left-[16px] w-2 h-2 rounded-full bg-[#ac0001] shadow-[0_0_6px_rgba(172,0,1,0.6)] border border-white/80" />
                      <span className="anim-b-center2 absolute left-[22px] w-3.5 h-3.5 rounded-full bg-[#040b8d] shadow-[0_0_8px_rgba(4,11,141,0.7)] border border-white/90" />
                      <span className="anim-b-right1 absolute left-[32px] w-2.5 h-2.5 rounded-full bg-[#CDA24D] shadow-[0_0_6px_rgba(205,162,77,0.6)] border border-white/80" />
                      <span className="anim-b-right2 absolute left-[38px] w-2 h-2 rounded-full bg-[#ac0001] shadow-[0_0_5px_rgba(172,0,1,0.6)] border border-white/80" />
                    </>
                  ) : (
                    // Výchozí stav: barevné vznášející se bublinky
                    <>
                      <span className="anim-b-left1 absolute left-[-7px] w-2 h-2 rounded-full bg-[#CDA24D] shadow-[0_0_5px_rgba(205,162,77,0.5)] border border-white/70" />
                      <span className="anim-b-left2 absolute left-[1px] w-3.5 h-3.5 rounded-full bg-[#040b8d] shadow-[0_0_6px_rgba(4,11,141,0.5)] border border-white/70" />
                      <span className="anim-b-center1 absolute left-[15px] w-2.5 h-2.5 rounded-full bg-[#ac0001] shadow-[0_0_5px_rgba(172,0,1,0.5)] border border-white/70" />
                      <span className="anim-b-center2 absolute left-[21px] w-3 h-3 rounded-full bg-[#CDA24D] shadow-[0_0_6px_rgba(205,162,77,0.5)] border border-white/70" />
                      <span className="anim-b-right1 absolute left-[31px] w-2 h-2 rounded-full bg-[#040b8d] shadow-[0_0_5px_rgba(4,11,141,0.5)] border border-white/70" />
                      <span className="anim-b-right2 absolute left-[37px] w-3 h-3 rounded-full bg-[#ac0001] shadow-[0_0_6px_rgba(172,0,1,0.5)] border border-white/70" />
                    </>
                  )}
                </div>

                <button
                  onClick={onToggleCursorMode}
                  id="header-bubbles-icon-button"
                  className={`h-10 sm:h-11 w-10 sm:w-11 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] group relative ${
                    cursorMode === 'bubbles'
                      ? 'bg-[#040b8d] border-[#18181b] text-white'
                      : 'bg-white border-[#18181b] text-[#18181b] hover:bg-[#fafafa]'
                  }`}
                  title={cursorMode === 'bubbles' ? 'Bublinky: AKTIVNÍ (kliknutím vypnout)' : 'Bublinky: VYPNUTO (kliknutím zapnout)'}
                >
                  {/* Původní olejová/mýdlová bublinka s jemnou výplní */}
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

            {/* 3 = MENU (3D BUTTON) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              id="header-menu-button"
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-[#18181b] hover:bg-[#2c2c31] text-white border-2 border-[#18181b] shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center gap-2 cursor-pointer transition-all group font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none"
            >
              <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>MENU</span>
            </button>

            {/* 4 = DOTAZNÍK (3D BUTTON) */}
            <button
              onClick={() => onOpenQuestionnaire()}
              id="header-dotaznik-button"
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-[#040b8d] hover:bg-[#03086b] text-white border-2 border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>DOTAZNÍK</span>
            </button>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* OBSAH ÚVODU (POSUNUTO VÝŠE DLE POŽADAVKU) */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-22 pb-8 bg-transparent">
        
        {/* ========================================================================= */}
        {/* HORNÍ KOMPOZICE: SROSTLÉ BÍLÉ POZADÍ LOYO + PREMIUM DEVELOPER NAHOŘE */}
        {/* S VYKOUSNUTÍM VPRAVO DOLE, KDE JE SAMOSTATNÁ KARTA ÚVOD (NA STŘED) */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch">
          
          {/* 1. VLEVO: KARTA S LOYO ČTVEREČKY (2×2 KUBY) + PŘESNĚ V MEZEŘE POD TÍM MINITETRIS PŘILEPENÝ NA HLAVNÍ INFO */}
          <div className="shrink-0 w-full sm:w-auto flex flex-col items-center sm:items-stretch justify-between relative z-30">
            <div
              id="card-loyo-cubes"
              className="w-full sm:w-auto bg-white border-2 border-[#18181b] rounded-3xl sm:rounded-tr-none p-3.5 sm:p-4 md:p-5 shadow-[6px_6px_0px_#18181b] relative z-10 flex justify-center"
            >
              {/* The 4 tactile cubes 2x2 */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 select-none">
                
                {/* Cube 1: L (Top-Left) - Skok nahoru s elastickým dopadem */}
                <div
                  onMouseEnter={() => triggerCubeAnim('L')}
                  onClick={() => triggerCubeAnim('L')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.L ? 'anim-cube-L' : ''
                  }`}
                  title="L - Klikni nebo najeď myší!"
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-[#040b8d]" />
                  <span className={`tracking-tight transition-transform duration-300 ${animatingCube.L ? 'scale-115 text-[#040b8d]' : ''}`}>
                    L
                  </span>
                </div>

                {/* Cube 2: o (Top-Right) - Hravá otočka o 360 stupňů */}
                <div
                  onMouseEnter={() => triggerCubeAnim('o1')}
                  onClick={() => triggerCubeAnim('o1')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.o1 ? 'anim-cube-o1' : ''
                  }`}
                  title="o - Klikni nebo najeď myší!"
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-[#CDA24D]" />
                  <span className={`tracking-tight lowercase transition-transform duration-300 ${animatingCube.o1 ? 'scale-120 text-[#CDA24D]' : ''}`}>
                    o
                  </span>
                </div>

                {/* Cube 3: Y (Bottom-Left) - Pružinové vyosení / houpačka do stran */}
                <div
                  onMouseEnter={() => triggerCubeAnim('Y')}
                  onClick={() => triggerCubeAnim('Y')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.Y ? 'anim-cube-Y' : ''
                  }`}
                  title="Y - Klikni nebo najeď myší!"
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-[#ac0001]" />
                  <span className={`tracking-tight transition-transform duration-300 ${animatingCube.Y ? 'scale-115 text-[#ac0001]' : ''}`}>
                    Y
                  </span>
                </div>

                {/* Cube 4: o (Bottom-Right) - Dvojitý pulz hloubky a neonový záchvěv */}
                <div
                  onMouseEnter={() => triggerCubeAnim('o2')}
                  onClick={() => triggerCubeAnim('o2')}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 bg-white border-2 border-[#18181b] rounded-2xl shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#18181b] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all cursor-pointer ${
                    animatingCube.o2 ? 'anim-cube-o2' : ''
                  }`}
                  title="o - Klikni nebo najeď myší!"
                >
                  <div className="absolute top-0 left-0 right-0 h-2 sm:h-2.5 bg-[#18181b]" />
                  <span className={`tracking-tight lowercase transition-transform duration-300 ${animatingCube.o2 ? 'scale-120 text-[#bef264]' : ''}`}>
                    o
                  </span>
                </div>

              </div>
            </div>

            {/* PŘESNĚ V TÉTO MEZEŘE - PŘILEPENÉ PŘÍMO NA HLAVNÍ INFO */}
            <div className="w-full flex-1 flex items-end justify-center pt-1 relative z-40 overflow-visible">
              <MiniFallingCubesInGap />
            </div>
          </div>

          {/* 2. PRAVÁ ČÁST: NAHOŘE SROSTLÝ PREMIUM DEVELOPER A DOLE VYKOUSLÝ ÚVOD */}
          <div className="flex-1 w-full flex flex-col min-w-0 sm:-ml-[2px] mt-3 sm:mt-0 justify-between">
            
            {/* KARTA DEVELOPER - BÍLÉ POZADÍ PRODLOUŽENÉ Z LOYO BEZE ŠVU */}
            <div
              id="card-premium-developer"
              className="bg-white border-2 border-[#18181b] sm:border-l-0 rounded-2xl sm:rounded-l-none sm:rounded-r-3xl p-4 sm:p-5 md:p-6 shadow-[6px_6px_0px_#18181b] relative z-20"
            >
              {/* Bezešvý můstek: překryje vertikální černou čáru uvnitř, takže bílé pozadí plynule protéká z LoYo bez švu či přesahů */}
              <div className="hidden sm:block absolute -left-[3px] top-[2px] bottom-[2px] w-[6px] bg-white z-30 pointer-events-none" />

              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-[#555]">
                  PREMIUM
                </span>
                <span className="h-0.5 w-10 sm:w-16 bg-[#18181b]" />
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-[#18181b] leading-tight uppercase break-words">
                DEVELOPER
              </h1>
            </div>

            {/* KARTA ÚVOD - POSUNUTA VÝŠE POD DEVELOPEREM (ZAROVNANÁ NA STŘED) */}
            <div
              id="card-uvod"
              className="bg-white border-2 border-[#18181b] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-[4px_4px_0px_#18181b] mt-2.5 mb-2.5 sm:mb-3 sm:ml-3 text-center relative z-10"
            >
              <div className="flex justify-center mb-2">
                <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#040b8d] flex items-center gap-2 px-3 py-0.5 bg-[#040b8d]/8 rounded-full border border-[#040b8d]/20">
                  <span className="w-2 h-2 rounded-full bg-[#040b8d]" />
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

        {/* 3. HLAVNÍ INFO (PŘÍMO NAVAZUJE NA SPODEK KOSTIČEK VLEVO) */}
        {/* Všechno okolo je bez pozadí, plně průhledné, kostičky v pozadí prosvítají */}
        <div className="mt-0">
          <div
            id="card-hlavni-info"
            className="bg-white border-2 border-[#18181b] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#18181b]"
          >
            
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e4e4e7]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18181b] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs">
                <span>HLAVNÍ INFO</span>
              </div>
              <span className="text-[11px] font-mono text-[#777] font-medium hidden sm:inline">
                LoYo Visual Identity & Core Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Point 1: 100% Vlastnictví */}
              <div className="border-l-3 border-[#040b8d] pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#040b8d]" />
                  100% Vlastnictví
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Zdrojový kód, databáze a cloudová infrastruktura jsou od prvního dne kompletně vaším majetkem.
                </div>
              </div>

              {/* Point 2: Čistý vývoj na míru */}
              <div className="border-l-3 border-[#CDA24D] pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CDA24D]" />
                  Vývoj bez šablon
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Žádné restriktivní CMS šablony ani univerzální pluginy. Vše je navrženo přímo pro vaše procesy.
                </div>
              </div>

              {/* Point 3: Moderní AI integrace */}
              <div className="border-l-3 border-[#ac0001] pl-3.5">
                <div className="font-heading font-bold text-sm text-[#18181b] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ac0001]" />
                  AI & Automatizace
                </div>
                <div className="text-xs text-[#555] mt-1.5 leading-relaxed">
                  Autonomní agenti, chytré zpracování dat a full-stack aplikace šetřící desítky hodin měsíčně.
                </div>
              </div>

              {/* Point 4: Přímá spolupráce */}
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

      {/* ========================================================================= */}
      {/* MENU DRAWER (OTVÍRÁ SE PO KLIKU NA MENU) */}
      {/* ========================================================================= */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white border-l-2 border-[#18181b] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#18181b] mb-6">
                <span className="font-heading font-black text-lg tracking-tight uppercase">
                  NAVIGAČNÍ MENU
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-[#18181b] hover:text-white border-2 border-[#18181b] shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#777] block mb-2">
                  SEKCE & DETAILNÍ STRÁNKY
                </span>

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
                    className="w-full p-3 bg-white hover:bg-[#fafafa] border-2 border-[#18181b] rounded-xl shadow-[3px_3px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="text-[10px] font-mono font-bold text-[#666]">
                          SEKCE {item.num}
                        </div>
                        <div className="font-heading font-bold text-sm text-[#18181b] group-hover:text-[#040b8d] transition-colors">
                          {item.title}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-[#18181b] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t-2 border-[#18181b] mt-8 space-y-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenQuestionnaire();
                }}
                className="w-full py-3 bg-[#040b8d] hover:bg-[#03086b] text-white border-2 border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] font-heading font-bold text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>OTEVŘÍT DOTAZNÍK</span>
              </button>
              <div className="text-center text-xs font-mono text-[#666]">
                loyo.gruup@gmail.com • LoYo PREMIUM DEVELOPER
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
