import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Smartphone, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Layout, 
  PenTool, 
  RefreshCw, 
  Wifi, 
  Share2, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { ServiceId } from '../types';

interface WebsSectionProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

export const WebsSection: React.FC<WebsSectionProps> = ({ 
  isExpanded: controlledExpanded,
  onToggleExpand: controlledToggle,
  onOpenQuestionnaire 
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanding(true);
      setTimeout(() => {
        setIsExpanding(false);
        if (controlledToggle) {
          controlledToggle();
        } else {
          setInternalExpanded(true);
        }
      }, 350);
    } else {
      if (controlledToggle) {
        controlledToggle();
      } else {
        setInternalExpanded(false);
      }
    }
  };

  const [nfcSimulated, setNfcSimulated] = useState<boolean>(false);

  const handleSimulateNfc = () => {
    setNfcSimulated(true);
    setTimeout(() => setNfcSimulated(false), 3500);
  };

  return (
    <section id="weby" className="py-14 sm:py-16 bg-[#ededed] text-[#18181b] border-b border-[#d0d0d0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: 03. PILÍŘ • ČERVENÁ #ac0001 */}
        <div className="border-l-4 border-[#ac0001] pl-5 sm:pl-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#ac0001] text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              03. PILÍŘ • ČERVENÁ
            </span>
            <span className="text-xs font-mono text-[#ac0001] font-bold">#ac0001</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#ac0001] tracking-tight">
            Tvorba webů, Restyling & Logo na míru
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#333] max-w-3xl leading-relaxed">
            Zaměřeno na <strong>restyling</strong>, <strong>rebranding</strong> a vytvoření silného brandu na míru. Buďto přesně podle vašeho zadání, nebo <strong>to můžete nechat zcela na mně</strong> a já vám za stanovenou dobu pošlu hotovou ukázku webu.
          </p>
        </div>

        {/* Hlavní karta se 3 jasnými body */}
        <div className="bg-[#dbdbdb] border-2 border-[#ac0001] p-6 sm:p-8 shadow-xs">
          
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ac0001] font-bold block mb-1">
              3 hlavní pilíře tvorby webu:
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#18181b]">
              Reprezentativní vizuální prezentace, která buduje důvěru a prodává
            </h3>
          </div>

          {/* 3 JASNÉ BODY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* Bod 1 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#ac0001] text-white flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Unikátní vizuální styl & logo na míru
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Žádné generické šablony ani tuctová grafika. Vytvořím zapamatovatelnou identitu, originální logo a barevnou paletu, která vystihuje vaši odbornost.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#ac0001] font-bold">
                Autorský vizuální podpis
              </div>
            </div>

            {/* Bod 2 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#ac0001] text-white flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Fluidní animace & typografie
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Plynulé kinetické přechody a vyladěné písmo. Každý detail na stránce má svůj optický i funkční smysl a působí exkluzivním dojmem.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#ac0001] font-bold">
                Kinetická elegance bez sekání
              </div>
            </div>

            {/* Bod 3 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#ac0001] text-white flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Blesková rychlost & mobily
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Okamžité načtení na starých i nových zařízeních, Androidu, iOS, macOS i Windows. Čistý HTML/CSS/JS výstup bez zbytečného balastu.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#ac0001] font-bold">
                100% responzivní na všem
              </div>
            </div>
          </div>

          {/* SPODNÍ LIŠTA: V PRAVO DOLE TLAČÍTKO "ZJISTIT VÍCE" */}
          <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <span className="w-2 h-2 rounded-full bg-[#ac0001]" />
              <span>Červená sekce • Restyling starého webu nebo zbrusu nový web s logem</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenQuestionnaire('web-branding')}
                className="px-4 py-2 bg-[#ededed] hover:bg-[#e0e0e0] border border-[#ac0001] text-[#ac0001] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                id="btn-weby-dotaznik-preview"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dotazník pro web a logo</span>
              </button>

              <button
                onClick={handleToggle}
                disabled={isExpanding}
                className="px-5 py-2.5 bg-[#ac0001] hover:bg-[#8f0001] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-80"
                id="btn-weby-toggle-details"
              >
                {isExpanding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Načítání...</span>
                  </>
                ) : (
                  <>
                    <span>{isExpanded ? 'Sbalit detaily' : 'Zjistit více'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* SKELETON LOADING VIEW WHEN EXPANDING */}
        {isExpanding && (
          <div className="mt-8 bg-[#ededed] border-2 border-[#ac0001] p-6 sm:p-8 space-y-6 animate-pulse">
            <div className="flex items-center justify-between pb-4 border-b border-[#c8c8c8]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#ac0001] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs font-bold text-[#ac0001] uppercase tracking-wider">
                  Inicializace detailů designu, restylingu a digitální vizitky...
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#777]">03. TVORBA WEBU</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-[#dbdbdb] p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
              <div className="h-32 bg-[#dbdbdb] p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
            </div>

            <div className="h-40 bg-[#dbdbdb] p-5 space-y-3 border border-[#ccc]">
              <div className="h-4 w-44 bg-[#b8b8b8] rounded-xs" />
              <div className="h-3 w-full bg-[#cecece] rounded-xs" />
              <div className="h-3 w-4/5 bg-[#cecece] rounded-xs" />
            </div>
          </div>
        )}

        {/* ROZBALENÉ DETAILY (Když uživatel klikne na "Zjistit více") */}
        {isExpanded && (
          <div className="mt-8 bg-[#ededed] border-2 border-[#ac0001] p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            
            {/* 2 přístupy: Podle zadání VS Nechat zcela na mně */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#dbdbdb] p-5 border border-[#c2c2c2]">
                <div className="flex items-center gap-2 text-[#ac0001] font-mono text-xs font-bold uppercase mb-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Varianta A</span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#18181b] mb-2">
                  Restyling stávajícího webu
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Máte stávající web, který vypadá zastarale nebo se špatně zobrazuje na telefonech? Přepracuji ho do moderní, čisté podoby se zachováním vašeho obsahu a posílením konverzí.
                </p>
              </div>

              <div className="bg-[#dbdbdb] p-5 border border-[#c2c2c2]">
                <div className="flex items-center gap-2 text-[#ac0001] font-mono text-xs font-bold uppercase mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Varianta B</span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#18181b] mb-2">
                  Nechat to zcela na mně
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Nemáte čas vymýšlet rozložení a detaily? Řeknete mi svůj obor a já vám v dohodnutém termínu pošlu kompletní autorský návrh včetně loga, textů a animací k připomínkování.
                </p>
              </div>
            </div>

            {/* Interaktivní ukázka: Virtuální NFC vizitka */}
            <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#c2c2c2]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#ac0001] font-bold block">
                    Moderní propojení webu & vizitky:
                  </span>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#18181b]">
                    Interaktivní chytrá vizitka s NFC čipem
                  </h4>
                </div>
                <span className="font-mono text-xs text-[#666]">
                  Stačí přiložit mobil k fyzické kartě
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <p className="text-xs sm:text-sm text-[#444] leading-relaxed">
                    K vašemu novému webu můžete mít i moderní fyzickou NFC vizitku. Stačí ji přiložit k telefonu klienta na schůzce a okamžitě se mu otevře vaše portfolio, kontaktní údaje nebo kalkulačka.
                  </p>
                  <button
                    onClick={handleSimulateNfc}
                    className="px-4 py-2 bg-[#ac0001] hover:bg-[#8f0001] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                    id="btn-simulate-nfc-card"
                  >
                    <Wifi className="w-4 h-4" />
                    <span>Simulovat přiložení karty k telefonu</span>
                  </button>
                </div>

                {/* Náhled vizitky v mobilu */}
                <div className="md:col-span-5 bg-[#ededed] p-4 border border-[#c2c2c2] shadow-xs">
                  {nfcSimulated ? (
                    <div className="space-y-2.5 animate-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>NFC SIGNÁL ZACHYCEN</span>
                      </div>
                      <div className="p-3 bg-[#dbdbdb] border border-[#c2c2c2] space-y-1">
                        <span className="font-heading font-black text-sm text-[#18181b] block">LoYo DEVELOPER</span>
                        <span className="text-[11px] text-[#555] block">loyo.gruup@gmail.com</span>
                        <span className="text-[10px] font-mono text-[#ac0001] font-bold block mt-1">Web & Systémy na míru</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#666] block text-center">
                        Kontakt okamžitě uložen v telefonu
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-[#777] space-y-2">
                      <Wifi className="w-8 h-8 mx-auto text-[#aaa] animate-pulse" />
                      <span className="text-xs block font-mono">Klikněte pro ukázku přiložení NFC</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA v rozbaleném stavu */}
            <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-heading font-bold text-sm text-[#18181b] block">
                  Chcete nový reprezentativní web nebo restyling?
                </span>
                <span className="text-xs text-[#666]">
                  Vyplňte dotazník pro web, restyling a tvorbu loga.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenQuestionnaire('web-branding')}
                  className="px-5 py-2.5 bg-[#ac0001] hover:bg-[#8f0001] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dotazník pro web & logo</span>
                </button>
                <button
                  onClick={handleToggle}
                  className="px-4 py-2 bg-[#dbdbdb] hover:bg-[#d0d0d0] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Sbalit</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
