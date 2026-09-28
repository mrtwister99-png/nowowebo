import React from 'react';
import {
  KeyRound,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { ServiceId } from '../types';
import { Section } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';

interface PoProjektuProps {
  onOpenQuestionnaire?: (serviceId?: ServiceId) => void;
}

export const PoProjektu: React.FC<PoProjektuProps> = ({ onOpenQuestionnaire }) => {
  return (
    <Section id="poprojektu" className="pt-2 pb-16">
      {/* Hlavní karta Po Projektu s jednotným designem */}
      <div className="bg-white border-2 border-loyo-ink rounded-3xl p-6 sm:p-8 lg:p-10 shadow-brutal-6">
        {/* Nadpis a úvod */}
        <div className="border-l-4 border-loyo-ink pl-4 sm:pl-6 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Badge>DŮVĚRA & PARTNERSTVÍ</Badge>
            <span className="text-xs font-mono text-loyo-subtle font-bold">
              100% Vlastnictví & Péče
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-loyo-ink tracking-tight">
            A co po dokončení projektu?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-loyo-body max-w-2xl leading-relaxed">
            Předáním hotového díla to pro mě nekončí. Žádné licenční pasti, žádné tajené přístupy.{' '}
            <strong>Produkt je stoprocentně váš a vše k němu patří.</strong>
          </p>
        </div>

        {/* 3 pilíře péče */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
          {/* 1. KARTA: 100% Váš produkt */}
          <div className="bg-loyo-paper border-2 border-loyo-ink rounded-2xl p-5 sm:p-6 shadow-brutal-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="w-11 h-11 rounded-xl bg-loyo-ink text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#555]">
                <KeyRound className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-loyo-ink mb-2 uppercase">
                Produkt je 100% váš
              </h3>
              <p className="text-xs text-loyo-muted leading-relaxed mb-4">
                Předám vám kompletní zdrojový kód, administrátorské účty, přístupy k serverům,
                doménám i cloudovým službám. Vše se stává výhradně vaším vlastnictvím.
              </p>
            </div>
            <div className="pt-3 border-t border-loyo-ink/15 text-xs text-loyo-ink-soft space-y-1.5 font-mono">
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
          <div className="bg-loyo-paper border-2 border-loyo-ink rounded-2xl p-5 sm:p-6 shadow-brutal-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="w-11 h-11 rounded-xl bg-loyo-blue text-white flex items-center justify-center mb-4 shadow-brutal-2">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-loyo-ink mb-2 uppercase">
                Správa & Dohlížení
              </h3>
              <p className="text-xs text-loyo-muted leading-relaxed mb-4">
                Pokud nechcete řešit technické starosti, zajistím pravidelnou údržbu, kontrolu verzí
                knihoven, dohled nad dostupností serverů a bezpečné zálohy.
              </p>
            </div>
            <div className="pt-3 border-t border-loyo-ink/15 text-xs text-loyo-ink-soft space-y-1.5 font-mono">
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
          <div className="bg-loyo-paper border-2 border-loyo-ink rounded-2xl p-5 sm:p-6 shadow-brutal-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="w-11 h-11 rounded-xl bg-loyo-mustard text-loyo-ink flex items-center justify-center mb-4 shadow-brutal-2">
                <TrendingUp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-loyo-ink mb-2 uppercase">
                Změny & Rozšíření
              </h3>
              <p className="text-xs text-loyo-muted leading-relaxed mb-4">
                Váš byznys se vyvíjí a software poroste s vámi. Kdykoliv se můžeme domluvit na
                doprogramování nových modulů, automatizací či změnách designu.
              </p>
            </div>
            <div className="pt-3 border-t border-loyo-ink/15 text-xs text-loyo-ink-soft space-y-1.5 font-mono">
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
        <div className="bg-loyo-paper border border-loyo-ink/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-loyo-ink text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-loyo-ink-soft leading-tight">
              <strong>Férové partnerství bez háčků:</strong> Mým cílem je vytvořit fungující systém,
              se kterým budete maximálně spokojeni.
            </p>
          </div>
          {onOpenQuestionnaire && (
            <button
              onClick={() => onOpenQuestionnaire()}
              className="w-full sm:w-auto px-5 py-2 bg-loyo-ink hover:bg-[#2c2c31] text-white border-2 border-loyo-ink rounded-xl shadow-[2px_2px_0px_#000] text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>Nezávazná poptávka</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Section>
  );
};
