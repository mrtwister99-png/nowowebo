# LoYo Developer & Design — Portfolio v2

Moderní portfolio / web pro ToMoWeb. React 19 + Vite + Tailwind 4.

**Stack:** React, TypeScript, Vite, TailwindCSS, Lucide Icons

### Spuštění lokálně
```bash
npm install
npm run dev
```

### Adresy (routing)

- `/` hlavní stránka, `/automatizace`, `/aplikace`, `/weby`, `/konzultace` stránky služeb (react-router).
- Adresy služeb jsou na jednom místě v `src/data/routes.ts`.
- Hosting musí neznámé adresy přesměrovat na `index.html` (SPA fallback), jinak přímý odkaz vrátí 404.

### Stránky služeb

- Všechny čtyři stránky služeb vykresluje jedna šablona `src/features/services/ServicePage.tsx`.
- Texty karet, barva a speciální bloky (kalkulačka, demo zabezpečení, srovnání) se nastavují v `src/features/services/servicePages.ts`.

### Design tokeny a komponenty

- Barvy, stíny a fonty jsou v `src/styles/tokens.css` (třídy `bg-loyo-blue`, `text-loyo-ink`, `shadow-brutal-3` ...).
- Stejné barvy pro JavaScript (canvas, SVG) jsou v `src/lib/colors.ts`. Při změně barvy upravit oba soubory.
- Základní komponenty jsou v `src/components/ui/` (`Button`, `Card`, `Badge`, `Section`).

© 2025 LoYo Developer and Design