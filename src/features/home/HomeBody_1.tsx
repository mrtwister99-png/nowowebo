import React from 'react';
import { LoyoHeaderCard } from '../../layout/LoyoHeaderCard';
import { ThreeServiceBanners } from './ThreeServiceBanners';
import { ConsultationSlimBanner } from './ConsultationSlimBanner';
import { PoProjektu } from './PoProjektu';
import { Footer } from '../../layout/Footer';
import { CursorParticleMode, ServiceId } from '../../types';

interface HomeBodyProps {
  activeSection: string;
  currentPage: string;
  cursorMode?: CursorParticleMode;
  onToggleCursorMode?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
  onNavigateToPage: (page: string) => void;
  onScrollToTop?: () => void;
  onOpenQuestionnaireForService: (serviceId: ServiceId) => void;
}

export const HomeBody: React.FC<HomeBodyProps> = ({
  activeSection,
  currentPage,
  cursorMode = 'none',
  onToggleCursorMode,
  onOpenQuestionnaire,
  onNavigateToPage,
  onScrollToTop,
  onOpenQuestionnaireForService,
}) => {
  return (
    <>
      {/* 1. HLAVIČKA S KARTAMI, NAVIGACÍ A MINIHROU V MEZEŘE */}
      <LoyoHeaderCard
        activeSection={activeSection}
        currentPage={currentPage}
        cursorMode={cursorMode}
        onToggleCursorMode={onToggleCursorMode}
        onOpenQuestionnaire={onOpenQuestionnaire}
        onNavigateToPage={onNavigateToPage}
        onScrollToTop={onScrollToTop}
      />

      {/* 2. TŘiI BANYERY: AUTOMATIZACE (MODRÁ), APLIKACE (ZLATÁ), WEB (ČERVENÁ) */}
      <ThreeServiceBanners onOpenQuestionnaireForService={onOpenQuestionnaireForService} />

      {/* 3. KONZULTACE: PŘES CELOU ŠÍŘKU, ÚZKÝ / TENKÝ PÁS, VPRAVO DOLE VÍCE INFO */}
      <ConsultationSlimBanner onOpenQuestionnaireForService={onOpenQuestionnaireForService} />

      {/* 4. PO PROJEKTU: 100% VLASTNICTVÍ KÓDU, SPRÁVA & DOHLÍŽENÍ, ÚPRAVY & ROZŠÍŘENÍ */}
      <PoProjektu onOpenQuestionnaire={onOpenQuestionnaire} />

      {/* 5. ZADEČEK / BOTTOM: VIDITELNÝ JAKO LINKA (POUZE EMAIL, INSTAGRAM, FACEBOOK), PŘI DOJETÍ DOLŮ VYJEDE ZÁVĚR */}
      <Footer />
    </>
  );
};
