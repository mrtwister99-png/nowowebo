import React from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceId, ServiceDetail } from '../types';
import { ArrowRight, CheckCircle2, Code2, Cpu, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

interface ServicesSectionProps {
  onOpenQuestionnaire: (serviceId: ServiceId) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenQuestionnaire }) => {
  const getServiceIcon = (id: ServiceId) => {
    switch (id) {
      case 'fullstack':
        return <Code2 className="w-6 h-6 text-[#CE9B01]" />;
      case 'automation':
        return <Cpu className="w-6 h-6 text-[#CE9B01]" />;
      case 'web-branding':
        return <Sparkles className="w-6 h-6 text-[#CE9B01]" />;
    }
  };

  return (
    <section id="services-main-section" className="py-20 lg:py-28 bg-[#050058] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#000182]/50 border border-white/10 text-xs font-mono text-[#CE9B01] uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Tři pilíře specializace</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] tracking-tight mb-4">
            Každá služba má svůj cíl. Vše propojeno do dokonalosti.
          </h2>
          <p className="text-base sm:text-lg text-[#D9EAF5] opacity-80 border-l-2 border-[#CE9B01] pl-6 leading-relaxed">
            Vyberte si oblast, která řeší váš bezprostřední problém, nebo je zkombinujte do uceleného digitálního ekosystému. Ke každé oblasti je připraven individuální dotazník pro okamžitou specifikaci.
          </p>
        </div>

        {/* 3 Detailed Service Blocks */}
        <div className="space-y-16 lg:space-y-20">
          {SERVICES_DATA.map((service) => {
            return (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className="scroll-mt-28 relative rounded-sm bg-[#000182]/50 border border-white/10 hover:border-[#CE9B01] transition-all p-6 sm:p-10 lg:p-12 shadow-sm group"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-[#050058] border border-white/10 flex items-center justify-center">
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#CE9B01] font-bold tracking-tighter uppercase">
                          PILÍŘ {service.number}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#CE9B01]"></span>
                        <span className="text-xs uppercase tracking-widest text-[#D9EAF5]/60 font-mono">
                          {service.badge}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#FFFFFF]">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenQuestionnaire(service.id)}
                    className="self-start md:self-auto px-6 py-3 rounded-sm bg-[#CE9B01] hover:bg-[#e6b107] text-[#050058] font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md hover:shadow-[#CE9B01]/20 transition-all flex items-center gap-2 cursor-pointer"
                    id={`btn-open-questionnaire-${service.id}`}
                  >
                    <span>{service.quotePrompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
                  {/* Left Column: Descriptions & Highlights (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <p className="text-base sm:text-lg text-[#D9EAF5]/85 leading-relaxed font-normal">
                      {service.fullDesc}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-mono uppercase tracking-tighter text-[#CE9B01] font-bold">
                        Klíčové přednosti & standardy:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-3.5 rounded-sm bg-[#050058]/80 border border-white/10 text-xs sm:text-sm text-[#D9EAF5]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#CE9B01] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ideal For */}
                    <div className="pt-2">
                      <span className="text-xs uppercase tracking-widest text-[#D9EAF5]/60 block mb-2 font-mono">Ideální pro:</span>
                      <div className="flex flex-wrap gap-2">
                        {service.idealFor.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-sm text-xs bg-[#050058] text-[#D9EAF5]/90 border border-white/10"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Capabilities & Deliverables (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Capabilities items */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-tighter text-[#CE9B01] font-bold">
                        Konkrétní realizace:
                      </h4>
                      {service.capabilities.map((cap, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-sm bg-[#050058]/60 border border-white/10 hover:border-[#CE9B01] transition-colors"
                        >
                          <div className="font-heading font-bold text-sm text-[#FFFFFF] mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#CE9B01]"></span>
                            {cap.title}
                          </div>
                          <p className="text-xs text-[#D9EAF5]/70 leading-relaxed">
                            {cap.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables box */}
                    <div className="p-5 rounded-sm bg-[#000182]/50 border border-white/10">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold mb-3">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Co odchází do produkce:</span>
                      </div>
                      <ul className="space-y-2 text-xs text-[#D9EAF5]/85">
                        {service.deliverables.map((del, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-[#CE9B01] font-bold">✓</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
