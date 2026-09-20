import React from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { ServiceId } from '../types';

interface PoProjektuProps {
  onOpenQuestionnaire?: (serviceId?: ServiceId) => void;
}

export const PoProjektu: React.FC<PoProjektuProps> = ({ onOpenQuestionnaire }) => {
  return (
    <section id="poprojektu" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-16 select-none">
      
      {/* Hlavní karta Po Projektu s jednotným designem */}
      <div className="bg-white border-2 border-[#18181b] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_#18181b]">
        
        {/* Nadpis a úvod */}
        <div className="border-l-4 border-[#18181b] pl-4 sm:pl-6 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#18181b] text-white text-[11px] font-mono font-black uppercase tracking-wider rounded">
              DŮVĚRA & PARTNERSTVÍ
            </span>
            <span className="text-xs font-mono text-[#666] font-bold">100% Vlastnictví & Péče</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#18181b] tracking-tight">
            A co po dokončení projektu?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#444] max-w-2xl leading-relaxed">
            Předáním hotového díla to pro mě nekončí. Žádné licenční pasti, žádné tajené přístupy. <strong>Produkt je stoprocentně váš a vše k němu patří.</strong>
          </p>
        </div>

        {/* 3 pilíře péče */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
          
          {/* 1. KARTA: 100% Váš produkt */}
          <div className="bg-[#fafafa] border-2 border-[#18181b] rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0px_#18181b] flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#18181b] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#555]">
                <KeyRound className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-[#18181b] mb-2 uppercase">
                Produkt je 100% váš
              </h3>
              <p className="text-xs text-[#555] leading-relaxed mb-4">
                Předám vám kompletní zdrojový kód, administrátorské účty, přístupy k serverům, doménám i cloudovým službám. Vše se stává výhradně vaším vlastnictvím.
              </p>
            </div>
            <div className="pt-3 border-t border-[#18181b]/15 text-xs text-[#27272a] space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Zdrojový kód (Git / ZIP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Veškeré přihlašovací klíče</span>
              </div>
            </div>
          </div>

          {/* 2. KARTA: Správa & Dohlížení */}
          <div className="bg-[#fafafa] border-2 border-[#18181b] rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0px_#18181b] flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#040b8d] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#18181b]">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-[#18181b] mb-2 uppercase">
                Správa & Dohlížení
              </h3>
              <p className="text-xs text-[#555] leading-relaxed mb-4">
                Pokud nechcete řešit technické starosti, zajistím pravidelnou údržbu, kontrolu verzí knihoven, dohled nad dostupností serverů a bezpečné zálohy.
              </p>
            </div>
            <div className="pt-3 border-t border-[#18181b]/15 text-xs text-[#27272a] space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Kontrola závislostí & balíčků</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Dohled nad funkčností & zálohy</span>
              </div>
            </div>
          </div>

          {/* 3. KARTA: Úpravy & Rozšíření */}
          <div className="bg-[#fafafa] border-2 border-[#18181b] rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0px_#18181b] flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#CDA24D] text-[#18181b] flex items-center justify-center mb-4 shadow-[2px_2px_0px_#18181b]">
                <TrendingUp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-[#18181b] mb-2 uppercase">
                Změny & Rozšíření
              </h3>
              <p className="text-xs text-[#555] leading-relaxed mb-4">
                Váš byznys se vyvíjí a software poroste s vámi. Kdykoliv se můžeme domluvit na doprogramování nových modulů, automatizací či změnách designu.
              </p>
            </div>
            <div className="pt-3 border-t border-[#18181b]/15 text-xs text-[#27272a] space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Modulární kód připravený na růst</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Rychlé zapracování nových nápadů</span>
              </div>
            </div>
          </div>

        </div>

        {/* Spodní pás důvěry s tlačítkem */}
        <div className="bg-[#fafafa] border border-[#18181b]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#18181b] text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-[#27272a] leading-tight">
              <strong>Férové partnerství bez háčků:</strong> Mým cílem je vytvořit fungující systém, se kterým budete maximálně spokojeni.
            </p>
          </div>
          {onOpenQuestionnaire && (
            <button
              onClick={() => onOpenQuestionnaire()}
              className="w-full sm:w-auto px-5 py-2 bg-[#18181b] hover:bg-[#2c2c31] text-white border-2 border-[#18181b] rounded-xl shadow-[2px_2px_0px_#000] text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>Nezávazná poptávka</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
