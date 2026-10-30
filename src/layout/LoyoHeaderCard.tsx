import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Menu, Settings, ArrowRight } from 'lucide-react';
import { ServiceId } from '../types';
import { scrollToElement, useMenuMount } from '../lib/motion';
import { MENU_SECTIONS } from '../data/routes';

// Minihra se stahuje samostatně (odděleně od hlavního balíčku), až když je potřeba
const MiniFallingCubesInGap = lazy(() =>
  import('../features/minigame/MiniFallingCubesInGap').then((m) => ({
    default: m.MiniFallingCubesInGap,
  })),
);

interface LoyoHeaderCardProps {
  activeSection: string;
  currentPage: string;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
  onNavigateToPage: (page: string) => void;
}

export const LoyoHeaderCard: React.FC<LoyoHeaderCardProps> = ({
  onOpenQuestionnaire,
  onNavigateToPage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menu: myší se otevírá najetím a po odjetí se zavře, dotyk a klávesnice fungují klikem
  const menuMounted = useMenuMount(isMenuOpen); // panel zůstane v DOM do konce animace zavření
  const menuCloseTimer = useRef<number | null>(null);
  const menuPointerType = useRef('mouse');

  const openMenuHover = (e: React.PointerEvent) => {
    menuPointerType.current = e.pointerType;
    if (e.pointerType !== 'mouse') return;
    if (menuCloseTimer.current !== null) {
      window.clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = null;
    }
    setIsMenuOpen(true);
  };

  const closeMenuHover = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    menuCloseTimer.current = window.setTimeout(() => setIsMenuOpen(false), 250); // čas na přejetí z tlačítka do panelu
  };

  // Ozubené kolečko u DOTAZNÍKU: jednou za 15 s se samo otočí o 90°, po najetí myší se rozjede a zase zastaví
  const [gearTurns, setGearTurns] = useState(0); // počet čtvrtotáček (90°) z klidového otáčení
  const [gearSpinning, setGearSpinning] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setGearTurns((t) => t + 1);
    }, 15000);
    return () => window.clearInterval(id);
  }, []);

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
      if (document.hidden) return; // skrytá záložka: kostky se nehýbou (stejně jako favicon)
      const targetLetter = letters[step % letters.length];
      triggerCubeAnim(targetLetter);
      step++;
    }, 2600);
    return () => clearInterval(periodicInterval);
  }, []);

  // položky menu jsou sdílené s Navbarem (src/data/routes.ts), tady jen ty, které patří do hlavičky
  const menuItems = MENU_SECTIONS.filter((s) => s.inHeader);

  return (
    <div className="relative w-full select-none bg-transparent">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-70 pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-2 flex items-center justify-end gap-3 pointer-events-auto">
          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {/* MENU: po najetí myší vyjede pod tlačítkem seznam sekcí, dotyk a klávesnice fungují klikem */}
            <div
              className="relative"
              onPointerEnter={openMenuHover}
              onPointerLeave={closeMenuHover}
            >
              <button
                onClick={(e) => {
                  // myš: menu řídí najetí, klik řešíme jen pro dotyk a klávesnici (detail 0)
                  if (e.detail !== 0 && menuPointerType.current === 'mouse') return;
                  setIsMenuOpen(!isMenuOpen);
                }}
                id="header-menu-button"
                aria-expanded={isMenuOpen}
                className={`h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 border-loyo-ink shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none ${
                  isMenuOpen
                    ? 'bg-white text-loyo-ink -translate-y-0.5 shadow-[4px_4px_0px_#000]'
                    : 'bg-loyo-ink hover:bg-[#2c2c31] text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000]'
                } active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`}
              >
                <Menu
                  className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                />
                <span>MENU</span>
              </button>

              {(isMenuOpen || menuMounted) && (
                <>
                  {/* neviditelná vrstva: klik nebo dotyk mimo menu ho zavře */}
                  <div className="fixed inset-0 -z-10" onClick={() => setIsMenuOpen(false)} />

                  {/* pt-3 = mezera pod tlačítkem, je součástí najetí (menu se nezavře při přejezdu myší) */}
                  {/* na mobilu je panel přes šířku obrazovky, na větších displejích pod tlačítkem vpravo */}
                  <div className="absolute right-0 top-full pt-3 w-88 z-10 max-sm:fixed max-sm:inset-x-4 max-sm:top-18 max-sm:w-auto">
                    <div
                      className={`bg-white border-2 border-loyo-ink rounded-2xl shadow-brutal-6 overflow-hidden p-3 flex flex-col gap-2.5 ${
                        isMenuOpen
                          ? 'menu-enter'
                          : 'menu-exit'
                      }`}
                    >
                      {menuItems.map((item, i) => (
                        <button
                          key={item.id}
                          /* stagger: při otevření shora dolů, při zavření obráceně; 'backwards' = před startem skryté, po doběhu nechá hover efekty volné */
                          style={{
                            animation: isMenuOpen
                              ? `menuItemIn 0.25s ease-out ${80 + i * 50}ms backwards`
                              : `menuItemOut 0.15s ease-in ${(menuItems.length - 1 - i) * 30}ms forwards`,
                          }}
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (item.page !== 'home') {
                              onNavigateToPage(item.page);
                            } else {
                              scrollToElement(item.id); // s odsazením o výšku fixní hlavičky
                            }
                          }}
                          className="w-full p-3 bg-white hover:bg-neutral-50 border-2 border-loyo-ink rounded-xl shadow-brutal-3 hover:-translate-y-0.5 hover:shadow-brutal-4 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
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
                              <div className="font-heading font-bold text-[13px] leading-tight text-loyo-ink group-hover:text-loyo-blue transition-colors">
                                {item.title}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-loyo-ink group-hover:translate-x-1 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => onOpenQuestionnaire()}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setGearSpinning(true); // rozjede se jen při najetí myší
              }}
              id="header-dotaznik-button"
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-loyo-blue hover:bg-[#03086b] text-white border-2 border-loyo-ink shadow-brutal-3 hover:-translate-y-0.5 hover:shadow-brutal-4 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-1 flex items-center gap-2 cursor-pointer transition-all font-heading font-bold text-xs sm:text-sm tracking-wider uppercase select-none"
            >
              {/* vnější prvek: klidové otočení o 90° každých 15 s; vnitřní: rozjezd po najetí (hotovo = zpět do klidu) */}
              <span
                className="inline-flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                style={{ transform: `rotate(${gearTurns * 90}deg)` }}
                aria-hidden="true"
              >
                <Settings
                  className={`w-4 h-4 text-amber-300 ${gearSpinning ? 'anim-gear-spin' : ''}`}
                  onAnimationEnd={() => setGearSpinning(false)}
                />
              </span>
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
              className="w-full sm:w-auto bg-white/80 border-2 border-loyo-ink rounded-3xl sm:rounded-tr-none p-3.5 sm:p-4 md:p-5 shadow-brutal-6 relative z-10 flex justify-center"
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

            <div className="w-full flex-1 flex items-stretch justify-center pt-1 relative z-40 overflow-visible">
              {/* Záložní prvek má stejnou výšku jako hra, aby se stránka při načtení neposunula */}
              <Suspense
                fallback={<div className="w-full min-h-42" aria-hidden="true" />}
              >
                <MiniFallingCubesInGap />
              </Suspense>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col min-w-0 mt-0 sm:-ml-0.5 sm:mt-0 justify-start relative z-30">
            <div
              id="card-premium-developer"
              className="bg-white/80 border-2 border-loyo-ink sm:border-l-0 rounded-2xl sm:rounded-l-none sm:rounded-r-3xl p-4 sm:p-5 md:p-6 shadow-brutal-6 relative z-20"
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
              className="bg-white/80 border-2 border-loyo-ink rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-brutal-4 mt-4 sm:mt-5 mb-2.5 sm:mb-3 sm:ml-3 text-center relative z-10"
            >
              <div className="flex justify-center mb-2">
                <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-loyo-blue flex items-center gap-2 px-3 py-0.5 bg-loyo-blue/8 rounded-full border border-loyo-blue/20">
                  <span className="w-2 h-2 rounded-full bg-loyo-blue" />
                  <span>ÚVOD</span>
                </div>
              </div>

              {/* Úvodní věta (claim) */}
              <p className="font-heading font-black text-base sm:text-lg md:text-xl text-loyo-ink leading-snug max-w-2xl mx-auto">
                Stavím bezpečné automatizace, které vám vrací čas.
              </p>

              {/* Hlavní odstavec */}
              <p className="text-sm sm:text-base text-loyo-ink font-medium leading-relaxed max-w-2xl mx-auto mt-2">
                Všechno, co lze, převádím do čistého kódu. AI používám jen tam, kde je opravdu
                nutná. Žádné vysoké účty za model, 100% kontrola nad workflow.
              </p>

              {/* Závěrečná věta */}
              <p className="text-sm sm:text-base text-loyo-ink font-bold leading-relaxed max-w-2xl mx-auto mt-3">
                Backend je moje specialita a koníček – je to na výsledku poznat.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-0">
          <div
            id="card-hlavni-info"
            className="bg-white/80 border-2 border-loyo-ink rounded-3xl p-5 sm:p-7 shadow-brutal-6"
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
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 mt-1.25 shrink-0 rounded-full bg-loyo-blue" />
                  MAXimální bezpečnost
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Každý pohyb v systému je zaevidovaný v logu. Vždy je dohledatelné, kdo, kdy a co udělal.
                </div>
              </div>

              <div className="border-l-3 border-loyo-mustard pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 mt-1.25 shrink-0 rounded-full bg-loyo-mustard" />
                  Ušetřím X hodin týdně
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Dlouhodobý nárůst času pro vás samotné: méně ruční práce a víc prostoru na to, co vás posouvá.
                </div>
              </div>

              <div className="border-l-3 border-loyo-red pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 mt-1.25 shrink-0 rounded-full bg-loyo-red" />
                  Důkladná analýza firmy a procesů
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Kompletní audit celé firmy zevnitř: prozkoumám procesy, nástroje i data, než cokoli postavím.
                </div>
              </div>

              <div className="border-l-3 border-loyo-ink pl-3.5">
                <div className="font-heading font-bold text-sm text-loyo-ink uppercase tracking-wide flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 mt-1.25 shrink-0 rounded-full bg-loyo-ink" />
                  Individuální přístup
                </div>
                <div className="text-xs text-loyo-muted mt-1.5 leading-relaxed">
                  Jakékoli možnosti stacku: web, OS, aplikace, NFC. Vždy a všude vše správně propojené a monitorované.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
