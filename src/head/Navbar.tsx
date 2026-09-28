import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowLeft } from 'lucide-react';
import { ServiceId, CursorParticleMode } from '../types';
import { LoyoLogoBox } from '../logo/LoyoLogoBox';
import { MagneticButton } from '../dalsi/MagneticButton';

interface NavbarProps {
  activeSection: string;
  currentPage: string;
  cursorMode?: CursorParticleMode;
  onToggleCursorMode?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
  onScrollToSection: (sectionId: string) => void;
  onNavigateToPage: (page: string) => void;
  onBackToHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  currentPage = 'home',
  cursorMode = 'bubbles',
  onToggleCursorMode,
  onOpenQuestionnaire,
  onScrollToSection,
  onNavigateToPage,
  onBackToHome,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dotaznikDropdownOpen, setDotaznikDropdownOpen] = useState(false);

  const sectionInfo: Record<string, { label: string; color: string; tag: string }> = {
    uvod: { label: 'Úvod • LoYo Premium Developer', color: '#18181b', tag: 'START' },
    automatizace: { label: '01. Automatizace procesů & ekosystém', color: '#040b8d', tag: 'MODRÁ' },
    fullstack: { label: '02. Vývoj aplikací fullstack', color: '#CDA24D', tag: 'ZLATÁ' },
    weby: { label: '03. Tvorba webů, Restyling & Logo', color: '#ac0001', tag: 'ČERVENÁ' },
    konzultace: { label: '04. Odborná osobní konzultace', color: '#18181b', tag: 'KONZULTACE' },
    zprava: { label: '05. Rychlá zpráva k projektu', color: '#666666', tag: 'ZPRÁVA' },
    kontakty: { label: '06. Kontakty & Sociální sítě', color: '#18181b', tag: 'KONTAKT' },
  };

  const pageInfo: Record<string, { label: string; color: string }> = {
    automation: { label: 'Detail: 01. Automatizace', color: '#040b8d' },
    fullstack: { label: 'Detail: 02. Aplikace', color: '#CDA24D' },
    'web-branding': { label: 'Detail: 03. Tvorba webu', color: '#ac0001' },
    webs: { label: 'Detail: 03. Tvorba webu', color: '#ac0001' },
    consultation: { label: 'Detail: 04. Konzultace', color: '#18181b' },
  };

  const currentInfo =
    currentPage !== 'home' && pageInfo[currentPage]
      ? pageInfo[currentPage]
      : sectionInfo[activeSection] || sectionInfo.uvod;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#nav-dotaznik-container')) {
        setDotaznikDropdownOpen(false);
      }
      if (!target.closest('#nav-menu-container') && !target.closest('#mobile-menu-dropdown')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideDownNav {
          0% { transform: translateY(-12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-loyo-bar border-b border-[#c2c2c2] shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-18 sm:min-h-20 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (currentPage !== 'home') {
                  onBackToHome();
                } else {
                  onScrollToSection('uvod');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group text-left"
              title="LoYo PREMIUM DEVELOPER - Hlavní stránka"
            >
              <LoyoLogoBox activeSection={activeSection} currentPage={currentPage} />
              <div className="hidden sm:block">
                <span className="font-heading font-black text-sm sm:text-base tracking-tight text-[#18181b] block leading-none">
                  LoYo
                </span>
                <span className="font-mono text-2.25 sm:text-2.5 uppercase tracking-widest text-[#555] block leading-none mt-1 font-bold">
                  PREMIUM DEV
                </span>
              </div>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-2 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bg border border-[#c8c8c8] text-[#18181b] text-xs font-semibold max-w-full truncate">
              <span
                className="w-2.5 h-2.5 shrink-0 rounded-xs"
                style={{ backgroundColor: currentInfo.color }}
              />
              <span className="font-heading tracking-wide uppercase text- sm:text-xs truncate">
                {currentInfo.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentPage !== 'home' && (
              <button
                onClick={onBackToHome}
                className="px-2.5 sm:px-3 py-1.5 bg-loyo-bg hover:bg-[#18181b] hover:text-white border border-[#c8c8c8] text-[#18181b] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zpět</span>
              </button>
            )}

            {onToggleCursorMode && (
              <MagneticButton
                onClick={onToggleCursorMode}
                magneticStrength={0.28}
                showCornerSquares={true}
                squareColor={cursorMode === 'bubbles' ? '#040b8d' : '#888888'}
                className={`h-9 sm:h-10 px-2.5 sm:px-3 border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  cursorMode === 'bubbles'
                    ? 'bg-white border-loyo-blue text-loyo-blue shadow-sm ring-1 ring-loyo-blue/25'
                    : 'bg-loyo-bg hover:bg-[#ffffff] border-[#c8c8c8] text-[#555555] hover:text-[#18181b]'
                }`}
                title={cursorMode === 'bubbles' ? 'Bublinky ZAPNUTÉ' : 'Bublinky VYPNUTÉ'}
              >
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="5.5"
                      cy="15.5"
                      r="4.2"
                      fill="#040b8d"
                      fillOpacity={cursorMode === 'bubbles' ? '0.95' : '0.35'}
                      stroke="#040b8d"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="4.2"
                      cy="14.2"
                      r="1.1"
                      fill="white"
                      fillOpacity={cursorMode === 'bubbles' ? '0.95' : '0.6'}
                    />
                    <circle
                      cx="12.5"
                      cy="10"
                      r="3.4"
                      fill="#CDA24D"
                      fillOpacity={cursorMode === 'bubbles' ? '0.95' : '0.35'}
                      stroke="#CDA24D"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="11.5"
                      cy="9"
                      r="0.9"
                      fill="white"
                      fillOpacity={cursorMode === 'bubbles' ? '0.95' : '0.6'}
                    />
                    <circle
                      cx="18.5"
                      cy="5.5"
                      r="2.6"
                      fill="#ac0001"
                      fillOpacity={cursorMode === 'bubbles' ? '0.95' : '0.35'}
                      stroke="#ac0001"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="17.7"
                      cy="4.7"
                      r="0.7"
                      fill="white"
                      fillOpacity={cursorMode === 'bubbles' ? '0.95' : '0.6'}
                    />
                  </svg>
                  <span className="hidden md:inline font-mono text-2.5 uppercase font-semibold tracking-wider">
                    {cursorMode === 'bubbles' ? 'Bublinky ON' : 'Bublinky'}
                  </span>
                </div>
              </MagneticButton>
            )}

            <div className="relative" id="nav-menu-container">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`px-2.5 sm:px-3 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                  menuOpen
                    ? 'bg-[#18181b] text-white border-[#18181b]'
                    : 'bg-loyo-bg hover:bg-zinc-200 border-[#c8c8c8] text-[#18181b]'
                }`}
              >
                {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{menuOpen ? 'Zavřít' : 'Menu'}</span>
              </button>
            </div>

            <div className="relative" id="nav-dotaznik-container">
              <button
                onClick={() => setDotaznikDropdownOpen(!dotaznikDropdownOpen)}
                className="px-3 sm:px-4 py-1.5 bg-[#18181b] hover:bg-loyo-blue text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Dotazník</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${dotaznikDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dotaznikDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-loyo-bg border border-[#c2c2c2] shadow-2xl p-2 z-50 text-xs animate-[slideDownNav_0.25s_cubic-bezier(0.16,1,0.3,1)] origin-top">
                  <div className="px-3 py-2 border-b border-loyo-bar mb-1">
                    <span className="font-heading font-bold text-xs text-[#18181b] block">
                      Vyberte stránku s dotazníkem:
                    </span>
                    <span className="text- text-[#666] block">
                      Přejít na detail a dotazník na míru
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateToPage('automation');
                      setDotaznikDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-loyo-bar border-l-4 border-loyo-blue transition-colors cursor-pointer block mb-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-loyo-blue">
                        01. Automatizace
                      </span>
                      <span className="font-mono text- text-[#555]">MODRÁ</span>
                    </div>
                    <p className="text- text-[#555] mt-0.5 leading-snug">
                      Úspora hodin, propojení systémů a zakázkové zabezpečení
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToPage('fullstack');
                      setDotaznikDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-loyo-bar border-l-4 border-loyo-mustard transition-colors cursor-pointer block mb-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-[#8a6b28]">
                        02. Aplikace
                      </span>
                      <span className="font-mono text- text-[#555]">ZLATÁ</span>
                    </div>
                    <p className="text- text-[#555] mt-0.5 leading-snug">
                      100% nezávislý čistý kód a komplexní backend
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToPage('web-branding');
                      setDotaznikDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-loyo-bar border-l-4 border-loyo-red transition-colors cursor-pointer block mb-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-loyo-red">
                        03. Tvorba webu
                      </span>
                      <span className="font-mono text- text-[#555]">ČERVENÁ</span>
                    </div>
                    <p className="text- text-[#555] mt-0.5 leading-snug">
                      Restyling, vlastní podoba a 60 FPS animace
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToPage('consultation');
                      setDotaznikDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-loyo-bar border-l-4 border-[#18181b] transition-colors cursor-pointer block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-[#18181b]">
                        04. Konzultace
                      </span>
                      <span className="font-mono text- text-[#18181b] font-bold">~800 Kč/h</span>
                    </div>
                    <p className="text- text-[#555] mt-0.5 leading-snug">
                      1 na 1 u kávy nebo online – know-how
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* NOVÉ MENU PRO NAVBAR - VYSUNE SE DOLŮ */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-menu-dropdown"
            className="fixed top-18 sm:top-20 left-0 right-0 z-60 px-4 sm:px-6 lg:px-8 pointer-events-none"
          >
            <div className="max-w-7xl mx-auto pointer-events-auto">
              <div className="bg-loyo-bg border-2 border-[#18181b] rounded-2xl shadow-[6px_6px_0px_#18181b] overflow-hidden animate-[slideDownNav_0.35s_cubic-bezier(0.16,1,0.3,1)] origin-top">
                <div className="px-4 sm:px-5 py-3 bg-white border-b-2 border-[#18181b] flex items-center justify-between">
                  <span className="font-heading font-black text-sm uppercase tracking-wide">
                    Menu • Sekce
                  </span>
                  <span className="text- font-mono text-[#777] uppercase">Vyber sekci</span>
                </div>

                <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('uvod');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border border-[#c2c2c2] hover:border-[#18181b] flex items-center justify-between cursor-pointer font-medium transition-colors rounded-xl"
                  >
                    <span>Úvod & Představení</span>
                    <span className="text- font-mono text-[#777]">START</span>
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('automatizace');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border-2 border-[#18181b] flex items-center justify-between cursor-pointer font-semibold text-loyo-blue transition-colors rounded-xl shadow-[2px_2px_0px_#18181b]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-loyo-blue rounded-xs" />
                      01. Automatizace
                    </span>
                    <span className="text- font-mono">Modrá</span>
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('fullstack');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border-2 border-[#18181b] flex items-center justify-between cursor-pointer font-semibold text-[#8a6b28] transition-colors rounded-xl shadow-[2px_2px_0px_#18181b]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-loyo-mustard rounded-xs" />
                      02. Aplikace
                    </span>
                    <span className="text- font-mono">Zlatá</span>
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('weby');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border-2 border-[#18181b] flex items-center justify-between cursor-pointer font-semibold text-loyo-red transition-colors rounded-xl shadow-[2px_2px_0px_#18181b]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-loyo-red rounded-xs" />
                      03. Tvorba
                    </span>
                    <span className="text- font-mono">Červená</span>
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('konzultace');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border border-[#c2c2c2] hover:border-[#18181b] flex items-center justify-between cursor-pointer font-semibold text-[#18181b] transition-colors rounded-xl"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#18181b] rounded-0.5" />
                      04. Konzultace
                    </span>
                    <span className="text-2.5 font-mono">1-on-1</span>
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('zprava');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border border-[#c2c2c2] hover:border-[#18181b] flex items-center justify-between cursor-pointer font-medium transition-colors rounded-xl"
                  >
                    <span>05. Rychlá zpráva</span>
                    <span className="text-2.5 font-mono text-[#777]">Zpráva</span>
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage !== 'home') onBackToHome();
                      onScrollToSection('kontakty');
                      setMenuOpen(false);
                    }}
                    className="w-full sm:col-span-2 text-left px-3 py-2.5 bg-white hover:bg-neutral-50 border border-[#c2c2c2] hover:border-[#18181b] flex items-center justify-between cursor-pointer font-medium transition-colors rounded-xl"
                  >
                    <span>06. Kontakty</span>
                    <span className="text-2.5 font-mono text-[#777]">Info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
