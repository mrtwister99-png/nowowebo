import React from 'react';
import { LoyoHeaderCard } from '../../layout/LoyoHeaderCard';
import { ConsultationSlimBanner } from './ConsultationSlimBanner';
import { PoProjektu } from './PoProjektu';
import { Footer } from '../../layout/Footer';
import { ServiceId } from '../../types';

interface HomeBodyProps {
  activeSection: string;
  currentPage: string;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
  onNavigateToPage: (page: string) => void;
  onOpenQuestionnaireForService: (serviceId: ServiceId) => void;
}

export const HomeBody: React.FC<HomeBodyProps> = ({
  activeSection,
  currentPage,
  onOpenQuestionnaire,
  onNavigateToPage,
  onOpenQuestionnaireForService,
}) => {
  return (
    <>
      {/* 1. HLAVIČKA S KARTAMI, NAVIGACÍ A MINIHROU V MEZEŘE */}
      <LoyoHeaderCard
        activeSection={activeSection}
        currentPage={currentPage}
        onOpenQuestionnaire={onOpenQuestionnaire}
        onNavigateToPage={onNavigateToPage}
      />

      {/* 2. KONZULTACE: PŘES CELOU ŠÍŘKU, ÚZKÝ / TENKÝ PÁS, VPRAVO DOLE VÍCE INFO */}
      <ConsultationSlimBanner onOpenQuestionnaireForService={onOpenQuestionnaireForService} />

      {/* 3. PO PROJEKTU: NADPIS A TLAČÍTKO NEZÁVAZNÉ POPTÁVKY */}
      <PoProjektu onOpenQuestionnaire={onOpenQuestionnaire} />

      {/* 4. ZADEČEK / BOTTOM: VIDITELNÝ JAKO LINKA (POUZE EMAIL, INSTAGRAM, FACEBOOK), PŘI DOJETÍ DOLŮ VYJEDE ZÁVĚR */}
      <Footer />
    </>
  );
};
