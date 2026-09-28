import React, { useState, useEffect } from 'react';
import { Navbar } from './head';
import { HomeBody } from './body';
import {
  DedicatedServicePage,
  QuestionnaireModal,
  CursorOilBubbles,
  InteractiveGridBackground,
} from './dalsi';
import { ServiceId, CursorParticleMode } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeSection, setActiveSection] = useState<string>('uvod');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceId>('automation');
  const [cursorMode, setCursorMode] = useState<CursorParticleMode>(() => {
    try {
      const saved = localStorage.getItem('loyo_cursor_mode');
      if (saved === 'bubbles') return 'bubbles';
    } catch {
      // localStorage nedostupný (např. soukromý režim) - použije se výchozí hodnota
    }
    return 'none';
  });

  const handleToggleCursorMode = () => {
    setCursorMode((prev) => {
      const next = prev === 'bubbles' ? 'none' : 'bubbles';
      try {
        localStorage.setItem('loyo_cursor_mode', next);
      } catch {
        // uložení se nepovedlo - přepnutí funguje dál, jen se nezapamatuje
      }
      return next;
    });
  };

  // Navigate to dedicated page
  const handleNavigateToPage = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Back to home page
  const handleBackToHome = (targetSectionId?: string) => {
    setCurrentPage('home');
    if (targetSectionId && targetSectionId !== 'uvod') {
      setTimeout(() => {
        handleScrollToSection(targetSectionId);
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('uvod');
    }
  };

  // Open modal if triggered
  const handleOpenQuestionnaire = (serviceId?: ServiceId) => {
    if (serviceId) {
      // If user chose a service from navbar dropdown, navigate directly to that dedicated page!
      handleNavigateToPage(serviceId);
    } else {
      setModalOpen(true);
    }
  };

  // Smooth scroll to a section on home page
  const handleScrollToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        performScroll(sectionId);
      }, 50);
    } else {
      performScroll(sectionId);
    }
  };

  const performScroll = (sectionId: string) => {
    if (sectionId === 'uvod') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setActiveSection('uvod');
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const header = document.querySelector('header');
      const navOffset = header ? header.offsetHeight : 72;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  // Active section spy for home page
  useEffect(() => {
    if (currentPage !== 'home') return;

    const sectionIds = [
      'uvod',
      'automatizace',
      'fullstack',
      'weby',
      'konzultace',
      'zprava',
      'kontakty',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-loyo-bg text-loyo-ink flex flex-col font-sans selection:bg-loyo-ink selection:text-white pb-12 relative">
      {/* 3D Interactive Grid Background with LoYo Brand Colors & Cursor-Lifting Squares */}
      <InteractiveGridBackground />

      {/* Interactive cursor particles (Oil bubbles or 3 nested squares) */}
      <CursorOilBubbles mode={cursorMode} />

      {/* When on subpage, render top Navbar for easy return */}
      {currentPage !== 'home' && (
        <Navbar
          activeSection={activeSection}
          currentPage={currentPage}
          cursorMode={cursorMode}
          onToggleCursorMode={handleToggleCursorMode}
          onOpenQuestionnaire={handleOpenQuestionnaire}
          onScrollToSection={handleScrollToSection}
          onNavigateToPage={handleNavigateToPage}
          onBackToHome={() => handleBackToHome()}
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main
        className={`flex-1 flex flex-col justify-start ${currentPage !== 'home' ? 'pt-24' : 'pt-6 sm:pt-10'}`}
      >
        {currentPage === 'home' ? (
          <HomeBody
            activeSection={activeSection}
            currentPage={currentPage}
            cursorMode={cursorMode}
            onToggleCursorMode={handleToggleCursorMode}
            onOpenQuestionnaire={handleOpenQuestionnaire}
            onNavigateToPage={handleNavigateToPage}
            onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onOpenQuestionnaireForService={(serviceId) => {
              setSelectedServiceForModal(serviceId);
              setModalOpen(true);
            }}
          />
        ) : (
          /* DEDICATED STANDALONE PAGE */
          <DedicatedServicePage
            serviceId={currentPage as ServiceId}
            onBackToHome={() =>
              handleBackToHome(
                currentPage === 'automation'
                  ? 'automatizace'
                  : currentPage === 'fullstack'
                    ? 'fullstack'
                    : currentPage === 'web-branding' || currentPage === 'webs'
                      ? 'weby'
                      : 'konzultace',
              )
            }
          />
        )}
      </main>

      {/* 3. QUESTIONNAIRE MODAL */}
      <QuestionnaireModal
        isOpen={modalOpen}
        initialServiceId={selectedServiceForModal}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
