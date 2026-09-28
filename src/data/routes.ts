import { ServiceId } from '../types';

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
