import React, { useEffect } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { ServiceId } from '../../types';
import { BRAND } from '../../lib/colors';
import { Button } from '../../components/ui/Button';
import { Card, CardEyebrow, CardNote, CardText, CardTitle } from '../../components/ui/Card';
import { BigSectionLetter } from '../../dalsi/BigSectionLetter';
import { IntegratedQuestionnaire } from '../../dalsi/IntegratedQuestionnaire';
import { SERVICE_PAGES, ServiceExtra } from './servicePages';
import { SavingsCalculator } from './SavingsCalculator';
import { SecurityDemo } from './SecurityDemo';
import { ArchitectureComparison } from './ArchitectureComparison';

// Speciální bloky, které si služba vyžádá v servicePages.ts (klíč extras)
const EXTRA_COMPONENTS: Record<ServiceExtra, React.FC> = {
  'savings-calculator': SavingsCalculator,
  'security-demo': SecurityDemo,
  'architecture-comparison': ArchitectureComparison,
};

interface ServicePageProps {
  serviceId: ServiceId;
  onBackToHome: () => void;
}

/* Jedna šablona pro všechny stránky služeb; obsah je v servicePages.ts */
export const ServicePage: React.FC<ServicePageProps> = ({ serviceId, onBackToHome }) => {
  const content = SERVICE_PAGES[serviceId];

  // Always scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [serviceId]);

  // Jump smoothly to the embedded questionnaire
  const scrollToQuestionnaire = () => {
    const el = document.getElementById('dotaznik-sekce');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-loyo-ink pt-20 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 py-4 mb-6 border-b border-loyo-line-field">
          <Button
            variant="secondary"
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Zpět na hlavní přehled</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={scrollToQuestionnaire}
              className="flex items-center gap-1.5"
            >
              <span>Přeskočit na dotazník</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-12">
          {/* Header */}
          <BigSectionLetter
            letter={content.letter}
            wordRemainder={content.wordRemainder}
            fillColor={BRAND[content.tone]}
            subtitle={content.subtitle}
          />

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.cards.map(({ icon: Icon, eyebrow, title, text, note }) => (
              <Card key={title}>
                <CardEyebrow tone={content.tone}>
                  <Icon className="w-4 h-4" />
                  <span>{eyebrow}</span>
                </CardEyebrow>
                <CardTitle>{title}</CardTitle>
                <CardText>{text}</CardText>
                <CardNote>{note}</CardNote>
              </Card>
            ))}
          </div>

          {/* Speciální bloky služby (kalkulačka, demo zabezpečení, srovnání ...) */}
          {content.extras.map((extra) => {
            const Extra = EXTRA_COMPONENTS[extra];
            return <Extra key={extra} />;
          })}

          {/* INTEGRATED QUESTIONNAIRE AT THE BOTTOM */}
          <IntegratedQuestionnaire serviceId={serviceId} />
        </div>

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-loyo-line-field flex items-center justify-between">
          <Button
            size="lg"
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Zpět na hlavní přehled</span>
          </Button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-mono font-bold text-loyo-subtle hover:text-loyo-ink uppercase cursor-pointer"
          >
            Nahoru ↑
          </button>
        </div>
      </div>
    </div>
  );
};
