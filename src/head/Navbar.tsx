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
  onBackToHome
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dotaznikDropdownOpen, setDotaznikDropdownOpen] = useState(false);

  // Section labels & color markers in the exact requested order
  const sectionInfo: Record<string, { label: string; color: string; tag: string }> = {
    uvod: { label: 'Úvod • LoYo Premium Developer', color: '#18181b', tag: 'START' },
    automatizace: { label: '01. Automatizace procesů & ekosystém', color: '#040b8d', tag: 'MODRÁ' },
    fullstack: { label: '02. Vývoj aplikací fullstack', color: '#CDA24D', tag: 'ZLATÁ' },
    weby: { label: '03. Tvorba webů, Restyling & Logo', color: '#ac0001', tag: 'ČERVENÁ' },
    konzultace: { label: '04. Odborná osobní konzultace', color: '#18181b', tag: 'KONZULTACE' },
    zprava: { label: '05. Rychlá zpráva k projektu', color: '#666666', tag: 'ZPRÁVA' },
    kontakty: { label: '06. Kontakty & Sociální sítě', color: '#18181b', tag: 'KONTAKT' }
  };

  const pageInfo: Record<string, { label: string; color: string }> = {
    automation: { label: 'Detail: 01. Automatizace', color: '#040b8d' },
    fullstack: { label: 'Detail: 02. Aplikace', color: '#CDA24D' },
    'web-branding': { label: 'Detail: 03. Tvorba webu', color: '#ac0001' },
    webs: { label: 'Detail: 03. Tvorba webu', color: '#ac0001' },
    consultation: { label: 'Detail: 04. Konzultace', color: '#18181b' }
  };

  const currentInfo = currentPage !== 'home' && pageInfo[currentPage]
    ? pageInfo[currentPage]
    : (sectionInfo[activeSection] || sectionInfo.uvod);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#nav-dotaznik-container')) {
        setDotaznikDropdownOpen(false);
      }
      if (!target.closest('#nav-menu-container') && !target.closest('#mobile-menu-drawer')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#dbdbdb] border-b border-[#c2c2c2] shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4.5rem] sm:min-h-[5rem] py-2 flex items-center justify-between gap-3">
        {/* LEFT: Square Logo (1.8x larger) */}
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
            title="LoYo PREMIUM DEVELOPER - Hlavní stránka (Na začátek nahoru)"
          >
            {/* The Dynamic Interactive Logo Box */}
            <LoyoLogoBox
              activeSection={activeSection}
              currentPage={currentPage}
            />
            <div className="hidden sm:block">
              <span className="font-heading font-black text-sm sm:text-base tracking-tight text-[#18181b] block leading-none">
                LoYo
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#555] block leading-none mt-1 font-bold">
                PREMIUM DEV
              </span>
            </div>
          </button>
        </div>

        {/* CENTER: Active Section or Page Indicator */}
        <div className="flex-1 flex items-center justify-center px-2 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ededed] border border-[#c8c8c8] text-[#18181b] text-xs font-semibold max-w-full truncate">
            <span
              className="w-2.5 h-2.5 shrink-0 rounded-xs"
              style={{ backgroundColor: currentInfo.color }}
            />
            <span className="font-heading tracking-wide uppercase text-[11px] sm:text-xs truncate">
              {currentInfo.label}
            </span>
          </div>
        </div>

        {/* RIGHT: Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Back button if on subpage */}
          {currentPage !== 'home' && (
            <button
              onClick={onBackToHome}
              className="px-2.5 sm:px-3 py-1.5 bg-[#ededed] hover:bg-[#18181b] hover:text-white border border-[#c8c8c8] text-[#18181b] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zpět</span>
            </button>
          )}

          {/* BUBBLES TOGGLE BUTTON NEXT TO MENU */}
          {onToggleCursorMode && (
            <MagneticButton
              onClick={onToggleCursorMode}
              magneticStrength={0.28}
              showCornerSquares={true}
              squareColor={cursorMode === 'bubbles' ? '#040b8d' : '#888888'}
              className={`h-9 sm:h-10 px-2.5 sm:px-3 border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                cursorMode === 'bubbles'
                  ? 'bg-white border-[#040b8d] text-[#040b8d] shadow-sm ring-1 ring-[#040b8d]/25'
                  : 'bg-[#ededed] hover:bg-[#ffffff] border-[#c8c8c8] text-[#555555] hover:text-[#18181b]'
              }`}
              title={
                cursorMode === 'bubbles'
                  ? "Bublinky jsou ZAPNUTÉ (kliknutím vypnete)"
                  : "Bublinky jsou VYPNUTÉ (kliknutím zapnete barevné bublinky)"
              }
              aria-label="Zapnout nebo vypnout bublinky kurzoru"
              id="btn-cursor-mode-toggle"
            >
              <div className="flex items-center gap-1.5">
                {/* 3 organické bublinky v brandových barvách */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  {/* Bublinka 1 - Modrá */}
                  <circle
                    cx="5.5"
                    cy="15.5"
                    r="4.2"
                    fill="#040b8d"
                    fillOpacity={cursorMode === 'bubbles' ? "0.95" : "0.35"}
                    stroke="#040b8d"
                    strokeWidth="1.2"
                  />
                  <circle cx="4.2" cy="14.2" r="1.1" fill="white" fillOpacity={cursorMode === 'bubbles' ? "0.95" : "0.6"} />
                  {/* Bublinka 2 - Zlatá */}
                  <circle
                    cx="12.5"
                    cy="10"
                    r="3.4"
                    fill="#CDA24D"
                    fillOpacity={cursorMode === 'bubbles' ? "0.95" : "0.35"}
                    stroke="#CDA24D"
                    strokeWidth="1.2"
                  />
                  <circle cx="11.5" cy="9" r="0.9" fill="white" fillOpacity={cursorMode === 'bubbles' ? "0.95" : "0.6"} />
                  {/* Bublinka 3 - Červená */}
                  <circle
                    cx="18.5"
                    cy="5.5"
                    r="2.6"
                    fill="#ac0001"
                    fillOpacity={cursorMode === 'bubbles' ? "0.95" : "0.35"}
                    stroke="#ac0001"
                    strokeWidth="1.2"
                  />
                  <circle cx="17.7" cy="4.7" r="0.7" fill="white" fillOpacity={cursorMode === 'bubbles' ? "0.95" : "0.6"} />
                </svg>
                <span className="hidden md:inline font-mono text-[10px] uppercase font-semibold tracking-wider">
                  {cursorMode === 'bubbles' ? 'Bublinky ON' : 'Bublinky'}
                </span>
              </div>
            </MagneticButton>
          )}

          {/* MENU Button with Dropdown */}
          <div className="relative" id="nav-menu-container">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-2.5 sm:px-3 py-1.5 bg-[#ededed] hover:bg-[#e4e4e4] border border-[#c8c8c8] text-[#18181b] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              id="btn-nav-menu"
            >
              {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Menu</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#ededed] border border-[#c2c2c2] shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 font-mono text-[10px] text-[#777] uppercase tracking-widest border-b border-[#dbdbdb] mb-1">
                  Přechod na sekce
                </div>
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('uvod');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-medium"
                >
                  <span>Úvod & Představení</span>
                  <span className="text-[10px] font-mono text-[#777]">START</span>
                </button>
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('automatizace');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-semibold text-[#040b8d]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#040b8d]" />
                    01. Automatizace
                  </span>
                  <span className="text-[10px] font-mono">Modrá</span>
                </button>
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('fullstack');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-semibold text-[#8a6b28]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#CDA24D]" />
                    02. Aplikace
                  </span>
                  <span className="text-[10px] font-mono">Zlatá</span>
                </button>
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('weby');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-semibold text-[#ac0001]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ac0001]" />
                    03. Tvorba
                  </span>
                  <span className="text-[10px] font-mono">Červená</span>
                </button>
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('konzultace');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-semibold text-[#18181b]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#18181b]" />
                    04. Konzultace
                  </span>
                  <span className="text-[10px] font-mono">1-on-1</span>
                </button>
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('zprava');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-medium"
                >
                  <span>05. Rychlá zpráva</span>
                  <span className="text-[10px] font-mono text-[#777]">Zpráva</span>
                </button>
                <div className="border-t border-[#dbdbdb] my-1" />
                <button
                  onClick={() => {
                    if (currentPage !== 'home') onBackToHome();
                    onScrollToSection('kontakty');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#dbdbdb] flex items-center justify-between cursor-pointer font-medium"
                >
                  <span>06. Kontakty</span>
                  <span className="text-[10px] font-mono text-[#777]">Info</span>
                </button>
              </div>
            )}
          </div>

          {/* DOTAZNÍK Button with 4-variant dropdown */}
          <div className="relative" id="nav-dotaznik-container">
            <button
              onClick={() => setDotaznikDropdownOpen(!dotaznikDropdownOpen)}
              className="px-3 sm:px-4 py-1.5 bg-[#18181b] hover:bg-[#040b8d] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              id="btn-nav-dotaznik"
            >
              <span>Dotazník</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {dotaznikDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#ededed] border border-[#c2c2c2] shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#dbdbdb] mb-1">
                  <span className="font-heading font-bold text-xs text-[#18181b] block">
                    Vyberte samostatnou stránku s dotazníkem:
                  </span>
                  <span className="text-[11px] text-[#666] block">
                    Přejít na detail a dotazník na míru
                  </span>
                </div>

                {/* 1. Automatizace (Modrá) */}
                <button
                  onClick={() => {
                    onNavigateToPage('automation');
                    setDotaznikDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-[#dbdbdb] border-l-4 border-[#040b8d] transition-colors cursor-pointer block mb-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#040b8d]">
                      01. Automatizace
                    </span>
                    <span className="font-mono text-[10px] text-[#555]">MODRÁ</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-0.5 leading-snug">
                    Úspora hodin, propojení systémů a zakázkové zabezpečení
                  </p>
                </button>

                {/* 2. Fullstack vývoj (Zlatá) */}
                <button
                  onClick={() => {
                    onNavigateToPage('fullstack');
                    setDotaznikDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-[#dbdbdb] border-l-4 border-[#CDA24D] transition-colors cursor-pointer block mb-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#8a6b28]">
                      02. Aplikace
                    </span>
                    <span className="font-mono text-[10px] text-[#555]">ZLATÁ</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-0.5 leading-snug">
                    100% nezávislý čistý kód a komplexní backend na míru
                  </p>
                </button>

                {/* 3. Weby & Logo (Červená) */}
                <button
                  onClick={() => {
                    onNavigateToPage('web-branding');
                    setDotaznikDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-[#dbdbdb] border-l-4 border-[#ac0001] transition-colors cursor-pointer block mb-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#ac0001]">
                      03. Tvorba webu
                    </span>
                    <span className="font-mono text-[10px] text-[#555]">ČERVENÁ</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-0.5 leading-snug">
                    Restyling, vlastní podoba stránky a plynulé 60 FPS animace
                  </p>
                </button>

                {/* 4. Konzultace (Černá) */}
                <button
                  onClick={() => {
                    onNavigateToPage('consultation');
                    setDotaznikDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-[#dbdbdb] border-l-4 border-[#18181b] transition-colors cursor-pointer block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#18181b]">
                      04. Osobní konzultace
                    </span>
                    <span className="font-mono text-[10px] text-[#18181b] font-bold">~800 Kč/h</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-0.5 leading-snug">
                    1 na 1 u kávy nebo online – zaškolení a předání know-how
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
