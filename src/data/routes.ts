import { ServiceId } from '../types';
import { BRAND } from '../lib/colors';

/** Adresa webu bez lomítka na konci (pro canonical odkazy). */
export const SITE_URL = 'https://www.totujestenebylo.cz';
export const SITE_NAME = 'ToTuJeštěNebylo.cz';

interface ServiceRoute {
  /** Adresa stránky služby v prohlížeči */
  path: string;
  /** id prvku na hlavní stránce, kam vede tlačítko "Zpět na hlavní přehled" */
  homeAnchorId: string;
}

/**
 * Jediné místo, kde se páruje služba s adresou.
 * Přidání nové služby = nový řádek zde + položka v ServiceId (types.ts) a servicesData.ts.
 */
export const SERVICE_ROUTES: Record<ServiceId, ServiceRoute> = {
  automation: { path: '/automatizace', homeAnchorId: 'three-service-banners' },
  fullstack: { path: '/aplikace', homeAnchorId: 'three-service-banners' },
  'web-branding': { path: '/weby', homeAnchorId: 'three-service-banners' },
  consultation: { path: '/konzultace', homeAnchorId: 'konzultace-banner' },
};

export const SERVICE_IDS = Object.keys(SERVICE_ROUTES) as ServiceId[];

/** Z adresy (např. "/weby/") zjistí službu, nebo null pro hlavní stránku a neznámé adresy. */
export const serviceIdFromPath = (pathname: string): ServiceId | null => {
  const clean = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  return SERVICE_IDS.find((id) => SERVICE_ROUTES[id].path === clean) ?? null;
};

/** Položka menu hlavní stránky – sdílí ji hlavička (LoyoHeaderCard) i Navbar, ať se texty a barvy neopakují. */
export interface MenuSection {
  /** id prvku na hlavní stránce, kam menu odscrolluje */
  id: string;
  /** 'home' = jen odscrolluje na sekci, jinak otevře stránku služby */
  page: string;
  /** číslo sekce ('' = bez čísla) */
  num: string;
  /** dlouhý název (hlavička) */
  title: string;
  /** krátký název (Navbar) */
  label: string;
  /** štítek vpravo (Navbar) */
  tag: string;
  /** barva tečky / značky */
  color: string;
  /** barva textu v Navbaru (jen u zvýrazněných položek) */
  textColor?: string;
  /** vzhled tlačítka v Navbaru: accent = barevné s rámečkem, dot = s tečkou, plain = prosté */
  navStyle: 'accent' | 'dot' | 'plain';
  /** false = položka je jen v Navbaru (Úvod) */
  inHeader: boolean;
}

export const MENU_SECTIONS: MenuSection[] = [
  { id: 'uvod', page: 'home', num: '', title: 'Úvod & Představení', label: 'Úvod & Představení', tag: 'START', color: BRAND.ink, navStyle: 'plain', inHeader: false },
  { id: 'automatizace', page: 'automation', num: '01', title: 'Automatizace procesů & ekosystém', label: '01. Automatizace', tag: 'Modrá', color: BRAND.blue, textColor: BRAND.blue, navStyle: 'accent', inHeader: true },
  { id: 'fullstack', page: 'fullstack', num: '02', title: 'Vývoj aplikací fullstack', label: '02. Aplikace', tag: 'Zlatá', color: BRAND.mustard, textColor: BRAND.mustardDark, navStyle: 'accent', inHeader: true },
  { id: 'weby', page: 'web-branding', num: '03', title: 'Tvorba webů, Restyling & Logo', label: '03. Tvorba', tag: 'Červená', color: BRAND.red, textColor: BRAND.red, navStyle: 'accent', inHeader: true },
  { id: 'konzultace', page: 'consultation', num: '04', title: 'Odborná osobní konzultace', label: '04. Konzultace', tag: '1-on-1', color: BRAND.ink, navStyle: 'dot', inHeader: true },
  { id: 'zprava', page: 'home', num: '05', title: 'Rychlá zpráva k projektu', label: '05. Rychlá zpráva', tag: 'Zpráva', color: '#666666', navStyle: 'plain', inHeader: true },
  { id: 'kontakty', page: 'home', num: '06', title: 'Kontakty & Sociální sítě', label: '06. Kontakty', tag: 'Info', color: BRAND.ink, navStyle: 'plain', inHeader: true },
];