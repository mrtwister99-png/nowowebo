import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router';
import { Navbar } from './head';
import { HomeBody } from './body';
import { QuestionnaireModal, CursorOilBubbles, InteractiveGridBackground } from './dalsi';
import { ServicePage } from './features/services/ServicePage';
import { ServiceId, CursorParticleMode } from './types';
import { SERVICE_IDS, SERVICE_ROUTES, SITE_NAME, SITE_URL, serviceIdFromPath } from './data/routes';
import { SERVICES_DATA } from './data/servicesData';

// Sekce hlavní stránky, které sleduje scroll-spy (zvýrazňuje aktivní položku v logu)
const SPY_SECTION_IDS = [
  'uvod',
  'automatizace',
  'fullstack',
  'weby',
  'konzultace',
  'zprava',
  'kontakty',
];

// Výchozí titulek stránky je z index.html
const DEFAULT_TITLE = document.title;

/** Plynule posune stránku na prvek s daným id (s odsazením o výšku fixní hlavičky). */
function scrollToElement(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.querySelector('header');
  const navOffset = header ? header.offsetHeight : 72;
  const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  return true;
}

/**
 * Posune na sekci; když prvek na stránce není (nebo jde o 'uvod'), posune nahoru.
 * Vrací id sekce pro scroll-spy, pokud jde o jednu ze sledovaných sekcí.
 */
function scrollToSection(sectionId: string): string | null {
  if (sectionId === 'uvod' || !scrollToElement(sectionId)) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return 'uvod';
  }
  return SPY_SECTION_IDS.includes(sectionId) ? sectionId : null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  // Aktuální stránka se odvozuje z adresy: id služby, nebo null = hlavní stránka
  const routeServiceId = serviceIdFromPath(location.pathname);
  const currentPage: string = routeServiceId ?? 'home';

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

  // Přechod na stránku služby (page = id služby) nebo na hlavní stránku
  const handleNavigateToPage = (page: string) => {
    const id = SERVICE_IDS.find((serviceId) => serviceId === page);
    navigate(id ? SERVICE_ROUTES[id].path : '/');
  };

  // Zpět na hlavní stránku, volitelně s posunem na prvek s daným id
  const handleBackToHome = (targetElementId?: string) => {
    navigate('/', { state: targetElementId ? { scrollTo: targetElementId } : null });
  };

  // Otevře dotazník, nebo (při zadané službě) rovnou stránku služby
  const handleOpenQuestionnaire = (serviceId?: ServiceId) => {
    if (serviceId) {
      handleNavigateToPage(serviceId);
    } else {
      setModalOpen(true);
    }
  };

  // Plynulý posun na sekci hlavní stránky (mimo hlavní stránku se nejdřív přejde domů)
  const handleScrollToSection = (sectionId: string) => {
    if (routeServiceId) {
      handleBackToHome(sectionId);
      return;
    }
    const active = scrollToSection(sectionId);
    if (active) setActiveSection(active);
  };

  // Po každé změně adresy: posun na požadovaný prvek, jinak nahoru
  // (při kroku zpět/vpřed v prohlížeči necháme posun na prohlížeči)
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const targetId = state.scrollTo;
      // krátká pauza, aby se hlavní stránka stihla vykreslit
      const timer = setTimeout(() => {
        const active = scrollToSection(targetId);
        if (active) setActiveSection(active);
      }, 50);
      return () => clearTimeout(timer);
    }
    if (String(navigationType) !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (!routeServiceId) setActiveSection('uvod');
  }, [location.key, location.state, navigationType, routeServiceId]);

  // Titulek a canonical odkaz podle stránky (každá služba má vlastní adresu)
  useEffect(() => {
    const service = SERVICES_DATA.find((item) => item.id === routeServiceId);
    document.title = service ? `${service.title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = `${SITE_URL}${routeServiceId ? SERVICE_ROUTES[routeServiceId].path : '/'}`;
    }
  }, [routeServiceId]);

  // Sledování aktivní sekce při scrollování hlavní stránky
  useEffect(() => {
    if (routeServiceId) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = SPY_SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SPY_SECTION_IDS[i];
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
  }, [routeServiceId]);

  return (
    <div className="min-h-screen bg-loyo-bg text-loyo-ink flex flex-col font-sans selection:bg-loyo-ink selection:text-white pb-12 relative">
      {/* 3D Interactive Grid Background with LoYo Brand Colors & Cursor-Lifting Squares */}
      <InteractiveGridBackground />

      {/* Interactive cursor particles (Oil bubbles or 3 nested squares) */}
      <CursorOilBubbles mode={cursorMode} />

      {/* Na stránce služby se zobrazí horní Navbar pro snadný návrat */}
      {routeServiceId && (
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
        className={`flex-1 flex flex-col justify-start ${routeServiceId ? 'pt-24' : 'pt-6 sm:pt-10'}`}
      >
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          {SERVICE_IDS.map((id) => (
            <Route
              key={id}
              path={SERVICE_ROUTES[id].path}
              element={
                <ServicePage
                  key={id}
                  serviceId={id}
                  onBackToHome={() => handleBackToHome(SERVICE_ROUTES[id].homeAnchorId)}
                />
              }
            />
          ))}
          {/* Neznámá adresa vrací na hlavní stránku */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
