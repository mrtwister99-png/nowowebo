import React, { Suspense, lazy, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { ZakladniKostkaLoyo90 } from '../components/brand/ZakladniKostkaLoyo90';
import { CursorParticleMode, ServiceId } from '../types';
import { BRAND } from '../lib/colors';

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

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-20">
      <div className="relative bg-white border-[3px] border-loyo-ink rounded-[24px] shadow-[8px_8px_0px_#18181b] p-4 sm:p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* LOGO - cista obyc kostka bez kolecka */}
          <div className="flex items-center shrink-0 ml-0">
            <button
              onClick={() => {
                if (onScrollToTop) onScrollToTop();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              id="header-cube-logo"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-transparent border-0 flex items-center justify-center cursor-pointer group hover:scale-105 active:scale-95 transition-all relative z-30"
              title="LoYo • Zpet na zacatek"
            >
              <ZakladniKostkaLoyo90 size={88} perspective={700} showInfo={false} className="scale-100" />
            </button>
          </div>

          {/* LOYO LETTERS */}
          <div className="hidden md:grid grid-cols-2 gap-2">
            {[
              { k: 'L', bg: 'border-t-loyo-blue' },
              { k: 'o', bg: 'border-t-loyo-mustard' },
              { k: 'Y', bg: 'border-t-loyo-red' },
              { k: 'o', bg: 'border-t-loyo-ink' },
            ].map((it) => (
              <div key={it.k + it.bg} className={`w-16 h-16 bg-white border-2 border-loyo-ink rounded-xl flex items-center justify-center font-black text-2xl shadow-brutal-2 ${it.bg} border-t-4`}>
                {it.k}
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="text-xs tracking-[0.2em] font-semibold text-loyo-ink/60">PREMIUM</div>
            <div className="font-heading font-black text-3xl leading-none">DEVELOPER</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {onToggleCursorMode && (
            <button
              onClick={onToggleCursorMode}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-white border-2 border-loyo-ink shadow-brutal-3 flex items-center justify-center hover:translate-y-[1px] hover:shadow-brutal-2 transition-all"
              title="Bublinky"
            >
              <span className="text-lg">◍</span>
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 sm:h-11 px-4 rounded-xl sm:rounded-2xl bg-loyo-ink text-white border-2 border-loyo-ink shadow-brutal-3 flex items-center gap-2 font-heading font-bold text-sm hover:translate-y-[1px] transition-all"
          >
            <Menu size={16} /> MENU
          </button>
          <button
            onClick={() => onOpenQuestionnaire()}
            className="h-10 sm:h-11 px-4 rounded-xl sm:rounded-2xl bg-loyo-blue text-white border-2 border-loyo-ink shadow-brutal-3 flex items-center gap-2 font-heading font-bold text-sm hover:translate-y-[1px] transition-all"
          >
            <Sparkles size={16} /> DOTAZNÍK
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border-[3px] border-loyo-ink rounded-[16px] shadow-[8px_8px_0px_#18181b] p-4 z-50">
            <button onClick={() => setIsMenuOpen(false)} className="ml-auto flex items-center gap-2 mb-4"><X size={16}/> Zavřít</button>
            <div className="grid gap-2">
              <button onClick={() => { onNavigateToPage('automatizace'); setIsMenuOpen(false); }} className="text-left p-2 hover:bg-loyo-bg rounded">Automatizace</button>
              <button onClick={() => { onNavigateToPage('fullstack'); setIsMenuOpen(false); }} className="text-left p-2 hover:bg-loyo-bg rounded">Fullstack</button>
              <button onClick={() => { onNavigateToPage('weby'); setIsMenuOpen(false); }} className="text-left p-2 hover:bg-loyo-bg rounded">Weby</button>
            </div>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <MiniFallingCubesInGap />
      </Suspense>
    </div>
  );
};
