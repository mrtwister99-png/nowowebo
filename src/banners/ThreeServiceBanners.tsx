import React from 'react';
import { ArrowRight, Smartphone, Globe } from 'lucide-react';
import { ServiceId } from '../types';

interface ThreeServiceBannersProps {
  onOpenQuestionnaireForService: (serviceId: ServiceId) => void;
}

export const ThreeServiceBanners: React.FC<ThreeServiceBannersProps> = ({
  onOpenQuestionnaireForService,
}) => {
  const banners: {
    id: string;
    serviceId: ServiceId;
    title: string;
    subtitle: string;
    iconBg: string;
    iconText: string;
    accentColor: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      id: 'automation',
      serviceId: 'automation',
      title: 'AUTOMATIZACE',
      subtitle: 'Autonomní AI procesy & API integrace',
      iconBg: 'bg-[#040b8d]',
      iconText: 'text-white',
      accentColor: '#040b8d',
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 sm:w-11 sm:h-11 anim-wheel"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        >
          <line x1="50" y1="10" x2="50" y2="24" />
          <line x1="50" y1="76" x2="50" y2="90" />
          <line x1="10" y1="50" x2="24" y2="50" />
          <line x1="76" y1="50" x2="90" y2="50" />
          <line x1="22" y1="22" x2="32" y2="32" />
          <line x1="68" y1="68" x2="78" y2="78" />
          <line x1="78" y1="22" x2="68" y2="32" />
          <line x1="32" y1="68" x2="22" y2="78" />
          <circle cx="50" cy="50" r="22" strokeWidth="6" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
        </svg>
      ),
      features: [
        'AI agenti pro rutinní úkoly',
        'Napojení CRM, e-shopů a skladů',
        'Úspora 20+ hodin práce týdně',
      ],
    },
    {
      id: 'fullstack',
      serviceId: 'fullstack',
      title: 'APLIKACE',
      subtitle: 'Zakázkový vývoj webových & mobilních appek',
      iconBg: 'bg-[#CDA24D]',
      iconText: 'text-[#18181b]',
      accentColor: '#CDA24D',
      icon: (
        <div className="relative flex items-center justify-center anim-device">
          <Smartphone className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#040b8d] animate-ping" />
        </div>
      ),
      features: [
        'Moderní React, Node.js & Cloud',
        'Rychlé a bezpečné databáze',
        'Kompletní vlastnictví zdrojáků',
      ],
    },
    {
      id: 'web',
      serviceId: 'web-branding',
      title: 'WEB',
      subtitle: 'Reprezentativní weby, restyling & vizuál',
      iconBg: 'bg-[#ac0001]',
      iconText: 'text-white',
      accentColor: '#ac0001',
      icon: (
        <div className="relative flex items-center justify-center anim-globe">
          <Globe className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.5]" />
        </div>
      ),
      features: [
        'Prvotřídní konverzní design',
        'Bleskové načítání & silné SEO',
        'Vizuální identita na míru',
      ],
    },
  ];

  return (
    <section
      id="three-service-banners"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-12 select-none"
    >
      {/* CSS animace pro ikonky v bannerech */}
      <style>{`
        @keyframes spinWheelSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatDeviceIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(2deg); }
        }
        @keyframes spinGlobeOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .anim-wheel {
          animation: spinWheelSlow 14s linear infinite;
        }
        .anim-device {
          animation: floatDeviceIcon 3s ease-in-out infinite;
        }
        .anim-globe {
          animation: spinGlobeOrbit 18s linear infinite;
        }
      `}</style>

      {/* 3 BANNERS GRID: BÍLÝ BG JAKO ÚVOD / HLAVNÍ INFO, NADPIS SVISLE VLEVO, IKONKA NAHOŘE NA STŘEDU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {banners.map((b) => (
          <div
            key={b.id}
            className="group relative bg-white border-2 border-[#18181b] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#18181b] hover:shadow-[8px_8px_0px_#18181b] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[420px]"
          >
            {/* HORNÍ ČÁST: SVISLÝ NADPIS PODÉL LEVÉ HRANY + STŘEDOVÁ IKONKA A OBSAH */}
            <div className="flex items-stretch gap-4 flex-1">
              {/* NADPIS VLEVO - SVISLE ZE SHORA DOLŮ, PÍSMENKA STOJÍ VZPŘÍMENĚ (OTOČENA ZPĚT NORMÁLNĚ) */}
              <div className="flex items-center justify-center shrink-0 pr-3 sm:pr-4 border-r-2 border-[#18181b]/15 select-none">
                <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 font-heading font-black text-[#18181b]">
                  {b.title.split('').map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className="leading-none text-xs sm:text-sm md:text-base tracking-normal font-black"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* PRAVÁ / HLAVNÍ ČÁST: IKONKA NAHOŘE NA STŘEDU + VÝHODY */}
              <div className="flex-1 flex flex-col items-center justify-between text-center pt-1">
                {/* IKONKA NAHOŘE NA STŘEDU - BAREVNÁ DLE ZADÁNÍ (AUTOMATIZACE MODRÁ, APLIKACE ZLATÁ, WEB ČERVENÁ) */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full ${b.iconBg} ${b.iconText} border-2 border-[#18181b] shadow-[3px_3px_0px_#18181b] flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
                  >
                    {b.icon}
                  </div>

                  <p className="text-xs sm:text-sm font-heading font-bold text-[#18181b] mt-3 max-w-[200px] leading-tight">
                    {b.subtitle}
                  </p>
                </div>

                {/* 3 BODY / VÝHODY */}
                <div className="w-full flex flex-col gap-2 my-4">
                  {b.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="w-full px-3 py-1.5 bg-[#fafafa] border border-[#18181b]/20 rounded-xl flex items-center text-left"
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-2 shrink-0"
                        style={{ backgroundColor: b.accentColor }}
                      />
                      <span className="text-[11px] sm:text-xs font-mono font-medium text-[#27272a] truncate">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DOLE BUTTON: "VÍCE INFO" -> PŘEJDE NA dotazAuto, dotazApp, dotazWeb */}
            <div className="pt-4 border-t border-[#18181b]/10 mt-2">
              <button
                onClick={() => onOpenQuestionnaireForService(b.serviceId)}
                id={`btn-more-info-${b.id}`}
                className="w-full py-2.5 px-4 bg-[#18181b] hover:bg-[#2c2c31] text-white border-2 border-[#18181b] rounded-xl shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] font-heading font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>VÍCE INFO</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
