import React from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  FolderGit2, 
  HeartHandshake, 
  Layers
} from 'lucide-react';
import { ServiceId } from '../types';

interface PoProjektuProps {
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

export const PoProjektu: React.FC<PoProjektuProps> = ({ onOpenQuestionnaire }) => {
  return (
    <section id="poprojektu" className="py-20 bg-[#dbdbdb] text-[#18181b] border-b border-[#c2c2c2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-l-4 border-[#18181b] pl-5 sm:pl-6 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#18181b] text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              DŮVĚRA & PARTNERSTVÍ
            </span>
            <span className="text-xs font-mono text-[#555] font-bold">100% Vlastnictví & Péče</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#18181b] tracking-tight">
            A co po dokončení projektu?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#444] max-w-3xl leading-relaxed">
            Předáním práce to pro mě nekončí. Žádné licenční pasti, žádné tajené přístupy. <strong>Produkt je samozřejmě plně váš a vše k němu patří.</strong>
          </p>
        </div>

        {/* 3 Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: 100% Váš produkt a kód */}
          <div className="bg-[#ededed] border-2 border-[#18181b] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#18181b] text-white flex items-center justify-center mb-4">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#18181b] mb-2">
                Produkt je 100% váš
              </h3>
              <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-4">
                Předám vám kompletní zdrojový kód, veškeré přihlašovací údaje, přístupy k serverům, doménám i databázím. Vše k němu patří a stává se výhradně vaším majetkem.
              </p>
            </div>
            <div className="pt-3 border-t border-[#dcdcdc] text-xs text-[#333] space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Kompletní zdrojové kódy (Git / ZIP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Všechny administrátorské klíče a účty</span>
              </div>
            </div>
          </div>

          {/* Card 2: Dlouhodobá správa a dohlížení */}
          <div className="bg-[#ededed] border-2 border-[#18181b] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#18181b] text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#18181b] mb-2">
                Správa & Dohlížení
              </h3>
              <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-4">
                Pokud nechcete řešit technické starosti, můžeme se domluvit na pravidelné údržbě, <strong>kontrole verzí knihoven</strong>, dohledu nad dostupností a zálohami, aby systém běžel spolehlivě bez výpadků a bezpečnostních rizik.
              </p>
            </div>
            <div className="pt-3 border-t border-[#dcdcdc] text-xs text-[#333] space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span><strong>Kontrola verzí knihoven</strong> a závislostí</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Pravidelné bezpečnostní aktualizace a záplaty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Monitoring serveru a rychlá technická pomoc</span>
              </div>
            </div>
          </div>

          {/* Card 3: Úpravy a rozšiřování */}
          <div className="bg-[#ededed] border-2 border-[#18181b] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#18181b] text-white flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#18181b] mb-2">
                Změny & Rozšíření
              </h3>
              <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-4">
                Váš byznys se vyvíjí a software poroste s vámi. Kdykoliv se můžeme domluvit na doprogramování nových modulů, úpravách designu či napojení na další služby.
              </p>
            </div>
            <div className="pt-3 border-t border-[#dcdcdc] text-xs text-[#333] space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Modulární architektura připravená na růst</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Okamžité zapracování nových nápadů</span>
              </div>
            </div>
          </div>

        </div>

        {/* Reassurance Banner */}
        <div className="bg-[#ededed] border border-[#c2c2c2] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-[#18181b] shrink-0" />
            <span className="text-xs sm:text-sm text-[#333] leading-relaxed">
              <strong>Férový přístup bez háčků:</strong> Nemám zájem dělat si z klientů rukojmí. Mým cílem je, abyste byli maximálně spokojeni a v budoucnu se na mě sami rádi obrátili.
            </span>
          </div>
          <button
            onClick={() => onOpenQuestionnaire()}
            className="px-5 py-2.5 bg-[#18181b] hover:bg-[#040b8d] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
          >
            Spustit poptávku
          </button>
        </div>

      </div>
    </section>
  );
};
