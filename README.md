# ToTuJeštěNebylo.cz — LoYo Premium Developer

Firemní web / portfolio **LoYo Developer & Design**: zakázkový vývoj systémů na míru, automatizace a weby s AI.
Veřejná adresa: https://www.totujestenebylo.cz

**Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, Lucide Icons. Minihra v hlavičce používá Supabase (společné počítadlo a HIGHSCORE).

## Spuštění lokálně

```bash
pnpm install
cp .env.example .env   # doplň hodnoty Supabase (viz níže), bez nich minihra funguje jen lokálně
pnpm dev               # http://localhost:3000
```

### Skripty

| Příkaz           | Co dělá                                      |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | vývojový server na portu 3000                |
| `pnpm build`     | produkční build do složky `dist`             |
| `pnpm preview`   | náhled hotového buildu                       |
| `pnpm typecheck` | kontrola typů TypeScriptu (`tsc --noEmit`)   |
| `pnpm check`     | kontrola typů + build (pusť před nasazením)  |

## Proměnné prostředí

Definují se v souboru `.env` (lokálně) a ve Vercelu (Settings -> Environment Variables). Šablona je v `.env.example`.

| Proměnná                 | Význam                                                      |
| ------------------------ | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | adresa Supabase projektu                                    |
| `VITE_SUPABASE_ANON_KEY` | **veřejný** klíč (`sb_publishable_...` nebo starý `anon`)   |

**Nikdy** nevkládej `sb_secret_...` ani `service_role` klíč. Proměnné s předponou `VITE_` jsou součástí webu a vidí je každý.
Soubor `.env` je v `.gitignore` a na hosting se nenahrává, proto se proměnné musí zadat i ve Vercelu a po jejich změně udělat nový deploy.

## Supabase (minihra)

1. V Supabase otevři SQL Editor -> New query, vlož obsah `supabase/tetris.sql` a spusť (stačí jednou).
2. Skript vytvoří tabulky `tetris_scores` a `tetris_stats` se zapnutým RLS a bez přístupu pro veřejný klíč.
3. Web smí volat jen čtyři funkce: `tetris_get_finished`, `tetris_add_finished`, `tetris_top_scores`, `tetris_submit_score`.
4. Kontrola probíhá na serveru (přezdívka 3 znaky A-Z/0-9, skóre 1 až 150000, max. 60 uložených výsledků za minutu pro celý web).

Při výpadku serveru nebo bez nastavených proměnných hra funguje dál a zobrazuje poslední známá data z tohoto prohlížeče.

## Struktura projektu

```
src/
  App.tsx, main.tsx, types.ts
  layout/            Navbar, hlavička (LoyoHeaderCard), patička (Footer)
  components/ui/     základní komponenty (Button, Card, Badge, Section, MagneticButton)
  components/brand/  logo (3D kostka)
  features/home/     hlavní stránka (HomeBody, banery služeb, Po projektu)
  features/services/ stránky služeb (šablona + obsah v servicePages.ts)
  features/inquiry/  dotazníky a formuláře
  features/minigame/ minihra v hlavičce (načítá se líně)
  features/effects/  animované pozadí, kurzor, favicon
  data/              adresy služeb (routes.ts) a data služeb
  lib/, styles/      pomocné funkce, barvy a design tokeny
supabase/
  tetris.sql         databáze pro počítadlo a HIGHSCORE minihry
```

## Adresy (routing)

- `/` hlavní stránka; `/automatizace`, `/aplikace`, `/weby`, `/konzultace` stránky služeb (react-router).
- Adresy služeb jsou na jednom místě v `src/data/routes.ts`.
- Hosting musí neznámé adresy přesměrovat na `index.html` (SPA fallback), jinak přímý odkaz vrátí 404. Na Vercelu to řeší `vercel.json`.

## Stránky služeb

- Všechny čtyři stránky služeb vykresluje jedna šablona `src/features/services/ServicePage.tsx`.
- Texty karet, barva a speciální bloky (kalkulačka, demo zabezpečení, srovnání) se nastavují v `src/features/services/servicePages.ts`.
- Nová služba = nový záznam v `servicePages.ts`, `ServiceId` v `types.ts`, adresa v `routes.ts` a data v `servicesData.ts`.

## Minihra v hlavičce

- Je v `src/features/minigame/` a načítá se líně (`React.lazy` v `LoyoHeaderCard`), takže není v hlavním balíčku.
- Tetris na 60 sekund: pole začíná 4 sloupce široké a každých 10 s se zvětší o 2 sloupce.
- Ovládání: `←` `→` pohyb, `↓` rychlý pád, `MEZERNÍK` bomba (cooldown 30 s).
- Kolečko vlevo dole ukazuje, kolik lidí vydrželo celou minutu (dohraná minuta = +1, přetečení se nepočítá), HIGHSCORE je společná tabulka všech hráčů.
- Herní pravidla jsou jako čisté funkce v `engine.ts`, stav a časování v `useCubesGame.ts`, komunikace se Supabase v `tetrisApi.ts`, vzhled v malých komponentách.

## Design tokeny a komponenty

- Barvy, stíny a fonty jsou v `src/styles/tokens.css` (třídy `bg-loyo-blue`, `text-loyo-ink`, `shadow-brutal-3` ...).
- Stejné barvy pro JavaScript (canvas, SVG) jsou v `src/lib/colors.ts`. Při změně barvy uprav oba soubory.
- Animace (keyframes) jsou v `src/index.css`.
- Základní komponenty jsou v `src/components/ui/` (`Button`, `Card`, `Badge`, `Section`).

## Nasazení (Vercel)

1. Nahraj projekt do repozitáře a propoj ho s Vercelem (framework: Vite, příkaz `pnpm build`, výstup `dist`).
2. Přidej proměnné `VITE_SUPABASE_URL` a `VITE_SUPABASE_ANON_KEY`.
3. Před nasazením spusť lokálně `pnpm check`.

© 2025 LoYo Developer and Design