import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowLeft } from 'lucide-react';
import { ServiceId } from '../types';
import { LoyoLogoBox } from '../components/brand/LoyoLogoBox';
import { BRAND } from '../lib/colors';
import { scrollToTop, useMenuMount } from '../lib/motion';
import { MENU_SECTIONS, type MenuSection } from '../data/routes';

// Vzhled tlačítek menu podle MenuSection.navStyle (data položek jsou v src/data/routes.ts)
const NAV_BTN_STYLE: Record<MenuSection['navStyle'], string> = {
  accent: 'border-2 border-loyo-ink font-semibold shadow-brutal-2',
  dot: 'border border-loyo-line hover:border-loyo-ink font-semibold text-loyo-ink',
  plain: 'border border-loyo-line hover:border-loyo-ink font-medium',
};

interface NavbarProps {
  activeSection: string;
  currentPage: string;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
  onScrollToSection: (sectionId: string) => void;
  onNavigateToPage: (page: string) => void;
  onBackToHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  currentPage = 'home',
  onScrollToSection,
  onNavigateToPage,
  onBackToHome,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuMounted = useMenuMount(menuOpen); // panel zůstane v DOM do konce animace zavření
  const [dotaznikDropdownOpen, setDotaznikDropdownOpen] = useState(false);

  const sectionInfo: Record<string, { label: string; color: string; tag: string }> = {
    uvod: { label: 'Úvod • LoYo Premium Developer', color: BRAND.ink, tag: 'START' },
    automatizace: {
      label: '01. Automatizace procesů & ekosystém',
      color: BRAND.blue,
      tag: 'MODRÁ',
    },
    fullstack: { label: '02. Vývoj aplikací fullstack', color: BRAND.mustard, tag: 'ZLATÁ' },
    weby: { label: '03. Tvorba webů, Restyling & Logo', color: BRAND.red, tag: 'ČERVENÁ' },
    konzultace: { label: '04. Odborná osobní konzultace', color: BRAND.ink, tag: 'KONZULTACE' },
    zprava: { label: '05. Rychlá zpráva k projektu', color: '#666666', tag: 'ZPRÁVA' },
    kontakty: { label: '06. Kontakty & Sociální sítě', color: BRAND.ink, tag: 'KONTAKT' },
  };

  const pageInfo: Record<string, { label: string; color: string }> = {
    automation: { label: 'Detail: 01. Automatizace', color: BRAND.blue },
    fullstack: { label: 'Detail: 02. Aplikace', color: BRAND.mustard },
    'web-branding': { label: 'Detail: 03. Tvorba webu', color: BRAND.red },
    webs: { label: 'Detail: 03. Tvorba webu', color: BRAND.red },
    consultation: { label: 'Detail: 04. Konzultace', color: BRAND.ink },
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

      <header className="fixed top-0 left-0 right-0 z-50 bg-loyo-bar border-b border-loyo-line shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-18 sm:min-h-20 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (currentPage !== 'home') {
                  onBackToHome();
                } else {
                  onScrollToSection('uvod');
                }
                scrollToTop();
              }}
              className="flex items-center gap-3 cursor-pointer group text-left"
              title="LoYo PREMIUM DEVELOPER - Hlavní stránka"
            >
              <LoyoLogoBox activeSection={activeSection} currentPage={currentPage} />
              <div className="hidden sm:block">
                <span className="font-heading font-black text-sm sm:text-base tracking-tight text-loyo-ink block leading-none">
                  LoYo
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-loyo-muted block leading-none mt-1 font-bold">
                  PREMIUM DEV
                </span>
              </div>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-2 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bg border border-loyo-line-field text-loyo-ink text-xs font-semibold max-w-full truncate">
              <span
                className="w-2.5 h-2.5 shrink-0 rounded-xs"
                style={{ backgroundColor: currentInfo.color }}
              />
              <span className="font-heading tracking-wide uppercase text-[10px] sm:text-xs truncate">
                {currentInfo.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentPage !== 'home' && (
              <button
                onClick={onBackToHome}
                className="px-2.5 sm:px-3 py-1.5 bg-loyo-bg hover:bg-loyo-ink hover:text-white border border-loyo-line-field text-loyo-ink text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zpět</span>
              </button>
            )}

            <div className="relative" id="nav-menu-container">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`px-2.5 sm:px-3 py-1.5 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                  menuOpen
                    ? 'bg-loyo-ink text-white border-loyo-ink'
                    : 'bg-loyo-bg hover:bg-zinc-200 border-loyo-line-field text-loyo-ink'
                }`}
              >
                {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{menuOpen ? 'Zavřít' : 'Menu'}</span>
              </button>
            </div>

            <div className="relative" id="nav-dotaznik-container">
              <button
                onClick={() => setDotaznikDropdownOpen(!dotaznikDropdownOpen)}
                className="px-3 sm:px-4 py-1.5 bg-loyo-ink hover:bg-loyo-blue text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Dotazník</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${dotaznikDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dotaznikDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-loyo-bg border border-loyo-line shadow-2xl p-2 z-50 text-xs animate-[slideDownNav_0.25s_cubic-bezier(0.16,1,0.3,1)] origin-top">
                  <div className="px-3 py-2 border-b border-loyo-bar mb-1">
                    <span className="font-heading font-bold text-xs text-loyo-ink block">
                      Vyberte stránku s dotazníkem:
                    </span>
                    <span className="text-[10px] text-loyo-subtle block">
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
                      <span className="font-mono text-[10px] text-loyo-muted">MODRÁ</span>
                    </div>
                    <p className="text-[10px] text-loyo-muted mt-0.5 leading-snug">
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
                      <span className="font-heading font-bold text-xs text-loyo-mustard-dark">
                        02. Aplikace
                      </span>
                      <span className="font-mono text-[10px] text-loyo-muted">ZLATÁ</span>
                    </div>
                    <p className="text-[10px] text-loyo-muted mt-0.5 leading-snug">
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
                      <span className="font-mono text-[10px] text-loyo-muted">ČERVENÁ</span>
                    </div>
                    <p className="text-[10px] text-loyo-muted mt-0.5 leading-snug">
                      Restyling, vlastní podoba a 60 FPS animace
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToPage('consultation');
                      setDotaznikDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-loyo-bar border-l-4 border-loyo-ink transition-colors cursor-pointer block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-loyo-ink">
                        04. Konzultace
                      </span>
                      <span className="font-mono text-[10px] text-loyo-ink font-bold">
                        ~800 Kč/h
                      </span>
                    </div>
                    <p className="text-[10px] text-loyo-muted mt-0.5 leading-snug">
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
      {(menuOpen || menuMounted) && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] ${
              menuOpen ? 'menu-backdrop-in' : 'menu-backdrop-out pointer-events-none'
            }`}
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-menu-dropdown"
            className="fixed top-18 sm:top-20 left-0 right-0 z-60 px-4 sm:px-6 lg:px-8 pointer-events-none"
          >
            <div className="max-w-7xl mx-auto pointer-events-auto">
              <div
                className={`bg-loyo-bg border-2 border-loyo-ink rounded-2xl shadow-brutal-6 overflow-hidden ${
                  menuOpen ? 'menu-enter' : 'menu-exit'
                }`}
              >
                <div className="px-4 sm:px-5 py-3 bg-white border-b-2 border-loyo-ink flex items-center justify-between">
                  <span className="font-heading font-black text-sm uppercase tracking-wide">
                    Menu • Sekce
                  </span>
                  <span className="text-[10px] font-mono text-loyo-faint uppercase">
                    Vyber sekci
                  </span>
                </div>

                <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MENU_SECTIONS.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onScrollToSection(item.id);
                        setMenuOpen(false);
                      }}
                      /* stagger: při otevření shora dolů, při zavření obráceně (stejně jako v hlavičce) */
                      style={{
                        color: item.textColor,
                        animation: menuOpen
                          ? `menuItemIn 0.25s ease-out ${80 + i * 50}ms backwards`
                          : `menuItemOut 0.15s ease-in ${(MENU_SECTIONS.length - 1 - i) * 30}ms forwards`,
                      }}
                      className={`w-full text-left px-3 py-2.5 bg-white hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors rounded-xl ${NAV_BTN_STYLE[item.navStyle]} ${
                        i === MENU_SECTIONS.length - 1 ? 'sm:col-span-2' : '' // poslední položka přes celou šířku
                      }`}
                    >
                      {item.navStyle !== 'plain' ? (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: item.color }} />
                          {item.label}
                        </span>
                      ) : (
                        <span>{item.label}</span>
                      )}
                      <span className={`text-[10px] font-mono ${item.navStyle === 'plain' ? 'text-loyo-faint' : ''}`}>
                        {item.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
