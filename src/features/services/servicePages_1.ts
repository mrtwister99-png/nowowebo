import {
  Code2,
  Coffee,
  Database,
  Gauge,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { ServiceId } from '../../types';

/** Barevný tón služby (modrá / zlatá / červená / černá) - určuje i barvu velkého písmene nadpisu. */
export type ServiceTone = 'ink' | 'blue' | 'red' | 'mustard';

/** Speciální bloky, které se na stránce služby zobrazí mezi kartami a dotazníkem. */
export type ServiceExtra = 'savings-calculator' | 'security-demo' | 'architecture-comparison';

export interface ServiceFeatureCard {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  text: string;
  note: string;
}

export interface ServicePageContent {
  tone: ServiceTone;
  /** První velké písmeno nadpisu + zbytek slova (A + UTOMATIZACE) */
  letter: string;
  wordRemainder: string;
  subtitle: string;
  cards: ServiceFeatureCard[];
  extras: ServiceExtra[];
}

/** Obsah stránek služeb. Nová služba = nový záznam zde + ServiceId v types.ts + adresa v routes.ts. */
export const SERVICE_PAGES: Record<ServiceId, ServicePageContent> = {
  automation: {
    tone: 'blue',
    letter: 'A',
    wordRemainder: 'UTOMATIZACE',
    subtitle:
      'Chytrá propojení systémů, úspora desítek hodin a zakázkové zabezpečení • MODRÁ SPECIALIZACE',
    cards: [
      {
        icon: Workflow,
        eyebrow: 'Rozsah implementace',
        title: 'Od 1 procesu po celou firmu',
        text: 'Začněte klidně jednoduchou synchronizací objednávek nebo skladových zásob. Kdykoliv později lze architekturu rozšířit na kompletní automatizovaný ekosystém bez nutnosti přepisovat kód.',
        note: '✓ REST API • Webhooks • Integromat/Make • Custom Node skripty',
      },
      {
        icon: Zap,
        eyebrow: 'Inteligentní AI pipeline',
        title: 'Automatické zpracování dat',
        text: 'Zapojte moderní jazykové modely pro automatické třídění e-mailů, vytěžování faktur, generování souhrnů schůzek a asistenci vašim operátorům v reálném čase.',
        note: '✓ Vytěžování PDF • Chytrá kategorizace • 0 chyb v datech',
      },
      {
        icon: ShieldCheck,
        eyebrow: 'Garance spolehlivosti',
        title: '100% Nezávislost & vlastnictví',
        text: 'Automatizační skripty a integrační můstky běží na vaší infrastruktuře. Žádné závislosti na drahých předplatných a nečekaných výpadcích cizích platforem.',
        note: '✓ Kompletní dokumentace • Monitoring • Zaškolení týmu',
      },
    ],
    extras: ['savings-calculator', 'security-demo'],
  },
  fullstack: {
    tone: 'mustard',
    letter: 'A',
    wordRemainder: 'PLIKACE',
    subtitle:
      'Zakázkový full-stack vývoj, 100% nezávislý čistý kód a komplexní backend • ZLATÁ SPECIALIZACE',
    cards: [
      {
        icon: Code2,
        eyebrow: 'Čistý kód',
        title: '100% Nezávislost & vlastnictví',
        text: 'Žádný vendor lock-in. Všechny zdrojové kódy, repozitáře, databázové struktury i přístupy jsou vaším výhradním majetkem od prvního commitu.',
        note: '✓ TypeScript • React / Node.js • Nezávislost na platformách',
      },
      {
        icon: Database,
        eyebrow: 'Komplexní backend',
        title: 'Architektura na míru',
        text: 'Promyšlený relační databázový model, bleskové API, cachování dotazů a bezpečnostní vrstvy, které s přehledem obslouží tisíce aktivních uživatelů.',
        note: '✓ SQL / PostgreSQL • JWT ověření • Real-time WebSockets',
      },
      {
        icon: Layers,
        eyebrow: 'Intuitivní rozhraní',
        title: 'Plynulé ovládání bez čekání',
        text: 'Uživatelské rozhraní stavěné na míru vašim zaměstnancům nebo klientům. Žádné zbytečné klikání navíc – vše je logické, rychlé a responzivní na každém zařízení.',
        note: '✓ Responzivní design • Okamžitá odezva • Role a oprávnění',
      },
    ],
    extras: ['architecture-comparison'],
  },
  'web-branding': {
    tone: 'red',
    letter: 'T',
    wordRemainder: 'VORBA',
    subtitle:
      'Restyling stávajících webů, unikátní design od čistého listu a 60 FPS animace • ČERVENÁ SPECIALIZACE',
    cards: [
      {
        icon: Palette,
        eyebrow: 'Hloubkový restyling',
        title: 'Oživení zastaralého webu',
        text: 'Vezmeme váš stávající obsah a přetavíme ho do suverénní moderní podoby. Odstraníme balast, zrychlíme načítání a vytvoříme vizuál hodný roku 2026.',
        note: '✓ Zachování SEO pozic • Čistý kód • Moderní typografie',
      },
      {
        icon: Sparkles,
        eyebrow: 'Vlastní podoba stránky',
        title: 'Návrh přímo podle vaší vize',
        text: 'Žádné prefabrikované šablony z WordPressu, které mají stovky dalších webů. Vytvořím unikátní vizuální jazyk navržený od prvního pixelu přímo pro váš obor.',
        note: '✓ Unikátní rozvržení • Vektorová loga • Přehledná hierarchie',
      },
      {
        icon: Gauge,
        eyebrow: 'Dynamické animace',
        title: 'Plynulých 60 snímků za sekundu',
        text: 'Kinetické titulky, plynulé přechody sekcí a elegantní mikrointerakce při najetí myší. Web okamžitě upoutá a zanechá dojem špičkové řemeslné práce.',
        note: '✓ Náběh pod 0.8s • Skóre 95+ v PageSpeed • Mobilní optimalizace',
      },
    ],
    extras: [],
  },
  consultation: {
    tone: 'ink',
    letter: 'K',
    wordRemainder: 'ONZULTACE',
    subtitle:
      'Osobní odborné poradenství 1 na 1, technická oponentura a ochrana rozpočtu • OSOBNÍ KONZULTACE',
    cards: [
      {
        icon: Coffee,
        eyebrow: 'Osobně i online',
        title: '1 na 1 u kávy nebo videohovoru',
        text: 'Přímý kontakt bez projektových manažerů či obchodníků. Sejdeme se v příjemné kavárně nebo se spojíme přes Google Meet. Věcná diskuze zaměřená na konkrétní výsledky.',
        note: '✓ Praha & celá ČR • Flexibilní termíny • Férové jednání',
      },
      {
        icon: ShieldCheck,
        eyebrow: 'Záchrana rozpočtu',
        title: 'MVP plán před kódováním',
        text: 'Než začnete utrácet statisíce za nákladný vývoj, ověříme technickou proveditelnost. Navrhnu nejkratší a nejlevnější cestu k funkčnímu prvnímu prototypu.',
        note: '✓ Eliminace slepých uliček • Sazba ~800 Kč/hod • Úspora peněz',
      },
      {
        icon: Zap,
        eyebrow: 'Předání know-how',
        title: 'Plná podpora & zaškolení',
        text: 'Nezůstanete v nevědomosti. Vysvětlím vám, jak váš systém funguje, jak do něj bezpečně zapojit AI nástroje a jak jej udržovat bez nutnosti platit drahé externí agentury.',
        note: '✓ Architektonické schéma • Záznam hovoru • Písemný souhrn',
      },
    ],
    extras: [],
  },
};
