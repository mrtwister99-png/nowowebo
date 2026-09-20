import React, { useState } from 'react';
import { Search, Compass, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { ServiceId } from '../types';

interface ProcessSectionProps {
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenQuestionnaire }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Hloubkový výzkum & Analýza potřeb',
      shortDesc: 'Nenasazuji náhodná řešení. Detailně zmapuji aktuální stav firmy, tok e-mailů a manuální rutinu.',
      detail: 'Před napsáním jediného řádku kódu se ponořím do fungování vašeho týmu. Identifikuji, kde ztrácíte drahocenný čas, kde hrozí chybovost a jaké konkrétní procesy má smysl automatizovat ihned versus ve druhé fázi.',
      icon: Search,
      deliverable: 'Kompletní audit stavu a doporučená roadmapa'
    },
    {
      num: '02',
      title: 'Architektura & Bezpečnostní koncept',
      shortDesc: 'Návrh optimálního technologického stacku a způsobu ověření (NFC, telefon, e-mail, biometrie či hra).',
      detail: 'Navrhnu datový model, rozhraní API a především bezpečnostní architekturu. Definujeme, jak se budou uživatelé přihlašovat a jaká úroveň šifrování zajistí stoprocentní ochranu vašich firemních dat.',
      icon: Compass,
      deliverable: 'Schéma ekosystému a interaktivní prototyp'
    },
    {
      num: '03',
      title: 'Precizní vývoj, animace & branding',
      shortDesc: 'Psaní čistého, modulárního kódu, ladění plynulých animací a tvorba loga na míru.',
      detail: 'Průběžně sledujete vývoj ve staging prostředí. Každá funkce prochází testováním, animace jsou laděny s důrazem na plynulost a estetickou harmonii barev Navy, White a Gold.',
      icon: Cpu,
      deliverable: 'Plně funkční systém v testovacím prostředí'
    },
    {
      num: '04',
      title: 'Nasazení, zaškolení & podpora',
      shortDesc: 'Hladký náběh do ostrého provozu s minimálním narušením vašeho každodenního fungování.',
      detail: 'Převedení dat, konfigurace cloudového serveru a zaškolení vás i vašeho týmu. Jsem vám k dispozici pro dlouhodobý rozvoj a technické poradenství bez prostředníků.',
      icon: CheckCircle2,
      deliverable: 'Ostrá produkce, zdrojový kód a dokumentace'
    }
  ];

  return (
    <section id="process-section" className="py-20 lg:py-28 bg-[#050058] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#000182]/50 border border-white/10 text-xs font-mono text-[#CE9B01] uppercase tracking-widest mb-4">
            <span>Metodika & Přístup</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] tracking-tight mb-4">
            Hloubkový výzkum. Žádné dohady.
          </h2>
          <p className="text-base sm:text-lg text-[#D9EAF5] opacity-80 border-l-2 border-[#CE9B01] pl-6 leading-relaxed">
            Každá úspěšná automatizace i aplikace začíná pochopením reality vaší firmy. Postupuji strukturovaně od detailní analýzy až po bezpečné nasazení do provozu.
          </p>
        </div>

        {/* 4 Interactive Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 sm:p-7 rounded-sm border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#000182] border-[#CE9B01] shadow-sm'
                    : 'bg-[#000182]/50 border-white/10 hover:border-[#CE9B01]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-extrabold text-[#CE9B01]">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-sm bg-[#050058] border border-white/10 flex items-center justify-center text-[#CE9B01]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#FFFFFF] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#D9EAF5]/75 leading-relaxed mb-4">
                    {step.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#CE9B01] uppercase tracking-wider block mb-0.5">Výstup:</span>
                  <span className="text-xs text-[#FFFFFF] font-medium">{step.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Box for Active Step */}
        <div className="rounded-sm bg-[#000182]/50 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#CE9B01] font-bold uppercase tracking-widest">
              <span>PODROBNOSTI KROKU {steps[activeStep].num}</span>
            </div>
            <h4 className="font-heading font-bold text-xl text-[#FFFFFF]">
              {steps[activeStep].title}
            </h4>
            <p className="text-sm text-[#D9EAF5]/85 leading-relaxed">
              {steps[activeStep].detail}
            </p>
          </div>

          <button
            onClick={() => onOpenQuestionnaire('automation')}
            className="px-6 py-3 rounded-sm bg-[#CE9B01] text-[#050058] font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-[#e6b107] whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Zadat požadavky na výzkum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
