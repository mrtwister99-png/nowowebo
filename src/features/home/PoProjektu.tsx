import React from 'react';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import { ServiceId } from '../../types';
import { Section } from '../../components/ui/Section';
import { Badge } from '../../components/ui/Badge';

interface PoProjektuProps {
  onOpenQuestionnaire?: (serviceId?: ServiceId) => void;
}

export const PoProjektu: React.FC<PoProjektuProps> = ({ onOpenQuestionnaire }) => {
  return (
    <Section id="poprojektu" className="pt-2 pb-16">
      {/* Hlavní karta Po Projektu s jednotným designem */}
      <div className="bg-loyo-surface/90 backdrop-blur-[2px] border border-loyo-line rounded-3xl p-6 sm:p-8 lg:p-10 shadow-brutal-6">
        {/* Nadpis a úvod */}
        <div className="border-l-2 border-loyo-line-strong pl-4 sm:pl-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge>DŮVĚRA & PARTNERSTVÍ</Badge>
            <span className="text-xs font-mono text-loyo-subtle font-bold">
              100% Vlastnictví & Péče
            </span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-loyo-text tracking-tight">
            A co po dokončení projektu?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-loyo-muted max-w-2xl leading-relaxed">
            Předáním hotového díla to pro mě nekončí. Žádné licenční pasti, žádné tajené přístupy.{' '}
            <strong>Produkt je stoprocentně váš a vše k němu patří.</strong>
          </p>
        </div>

        {/* Spodní pás důvěry s tlačítkem */}
        <div className="bg-loyo-paper border border-loyo-line rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-loyo-panel text-loyo-text flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-loyo-text leading-tight">
              <strong>Férové partnerství bez háčků:</strong> Mým cílem je vytvořit fungující systém,
              se kterým budete maximálně spokojeni.
            </p>
          </div>
          {onOpenQuestionnaire && (
            <button
              onClick={() => onOpenQuestionnaire()}
              className="w-full sm:w-auto px-5 py-2 bg-loyo-panel hover:bg-loyo-hover text-loyo-text border border-loyo-line rounded-xl shadow-brutal-2 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
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
