import React from 'react';
import { ArrowRight, Coffee } from 'lucide-react';
import { ServiceId } from '../types';
import { Section } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';

interface ConsultationSlimBannerProps {
  onOpenQuestionnaireForService: (serviceId: ServiceId) => void;
}

export const ConsultationSlimBanner: React.FC<ConsultationSlimBannerProps> = ({
  onOpenQuestionnaireForService,
}) => {
  return (
    <Section id="konzultace-banner" className="pt-0 pb-10">
      <div className="group relative bg-white border-2 border-loyo-ink rounded-3xl p-5 sm:p-6 lg:p-7 shadow-brutal-6 hover:shadow-brutal-8 hover:-translate-y-0.5 transition-all duration-200">
        {/* HLAVNÍ HORIZONTÁLNÍ ÚZKÝ ROZKLAD */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 sm:gap-6">
          {/* LEVÁ ČÁST: SVISLÝ / KOMPAKTNÍ NADPIS A IKONKA */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0 border-b lg:border-b-0 lg:border-r-2 border-loyo-ink/15 pb-4 lg:pb-0 lg:pr-6">
            {/* Kulatá ikona konzultace */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-loyo-ink text-white border-2 border-loyo-ink shadow-[3px_3px_0px_#555] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Coffee className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            {/* Nadpis sekce */}
            <div>
              <div className="flex items-center gap-2">
                <Badge size="sm">4. SLUŽBA</Badge>
                <span className="font-mono text-[11px] font-bold text-loyo-subtle uppercase">
                  1 na 1 & Online
                </span>
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-loyo-ink tracking-tight mt-1">
                KONZULTACE & AUDIT
              </h3>
            </div>
          </div>

          {/* STŘEDNÍ ČÁST: POPIS + 3 HORIZONTÁLNÍ PRVKY */}
          <div className="flex-1 flex flex-col justify-center space-y-2.5">
            <p className="text-xs sm:text-sm font-heading font-medium text-[#3f3f46] leading-snug">
              Nezávislé technologické posouzení vašeho nápadu u dobré kávy nebo přes videohovor. Bez
              omáčky a žargonu.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-2.5 py-1 bg-loyo-paper border border-loyo-ink/20 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-loyo-ink shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-medium text-loyo-ink-soft">
                  Osobně nebo videohovor
                </span>
              </div>
              <div className="px-2.5 py-1 bg-loyo-paper border border-loyo-ink/20 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-loyo-ink shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-medium text-loyo-ink-soft">
                  Předání know-how a zaškolení
                </span>
              </div>
              <div className="px-2.5 py-1 bg-loyo-paper border border-loyo-ink/20 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-loyo-ink shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-medium text-loyo-ink-soft">
                  Technický a bezpečnostní audit
                </span>
              </div>
            </div>
          </div>

          {/* VPRAVO DOLE: TLAČÍTKO VÍCE INFO */}
          <div className="shrink-0 flex items-center justify-end pt-2 lg:pt-0">
            <button
              onClick={() => onOpenQuestionnaireForService('consultation')}
              id="btn-more-info-consultation"
              className="w-full sm:w-auto py-2.5 px-6 bg-loyo-ink hover:bg-[#2c2c31] text-white border-2 border-loyo-ink rounded-xl shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] font-heading font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>VÍCE INFO</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};
