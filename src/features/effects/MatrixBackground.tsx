import React, { useEffect, useRef } from 'react';

/**
 * "Obrácený matrix": čtverce padají shora dolů a hlava sloupce je nahoře (FALL_DOWN; port z Matrix-Ctverce-Scroll-77).
 * Barvy (LoYo OS — Royal Dark): pozadí #2b2b2b, sloupce světle šedé #b5b5b5 (ocas se vytrácí průhledností
 * do pozadí), hlava sloupce bliká do bílé (každý sloupec svým tempem, HEAD_BLINK_*).
 * Viditelnost celého pozadí je LAYER_OPACITY (1 = barvy přesně jak jsou zadané, 0.5 = napůl, zbytek je barva webu).
 *
 * Rychlost: znaky se předkreslí jednou do atlasu (sprite sheet) a pak se jen kopírují (drawImage),
 * canvas má velikost obrazovky a otáčí se uvnitř (ne přes CSS), filtr a průhlednost jsou
 * "vypálené" přímo do barev. Při pomalém běhu se kvalita sama sníží (rozlišení, pak 30 FPS).
 */

const GLYPHS = ['■', '□', '▪', '▫', '▬', '▭', '▮', '▯', '░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '◼', '◻', '◾', '◽'];
const GLITCH_GLYPHS = ['■', '◼', '█', '▓', '◾'].map((g) => GLYPHS.indexOf(g)); // indexy do GLYPHS

const BG_COLOR = '#2b2b2b'; // POZADÍ (tmavší šedá)
const HEAD_COLOR = '#b5b5b5'; // ČTVERCE (sloupce, hlava i ocas) - světlá šedá
// Hlava sloupce bliká do bílé: každý sloupec má vlastní tempo (perioda HEAD_BLINK_MIN_MS až MAX_MS)
const HEAD_BLINK_COLOR = '#ffffff';
const HEAD_BLINK_MIN_MS = 700;
const HEAD_BLINK_MAX_MS = 1800;
const FALL_DOWN = true; // true = padá shora dolů a hlava je nahoře; false = zdola nahoru, hlava dole (dřívější stav)
// Glitch hlav sloupců do červené: každý sloupec má svůj vlastní čas (jednou za 10 s) a při něm je šance 44,22 %
const GLITCH_HEAD_COLOR = '#ff1a1a';
const GLITCH_HEAD_EVERY_MS = 10000;
const GLITCH_HEAD_CHANCE = 0.4422;
const GLITCH_HEAD_MS = 700; // jak dlouho glitch trvá

// Sloupec, kterým projde kurzor, zableskne do #ff4800; mezery mezi bliknutími se zkracují, až zůstane celý oranžový
const HIT_COLOR = '#ff4800';
const HIT_BLINK_MS = 160; // jak dlouho jedno bliknutí svítí
const HIT_FIRST_GAP_MS = 900; // pauza po prvním bliknutí
const HIT_GAP_FACTOR = 0.7; // každá další pauza je o tolik kratší (0.7 = o 30 %)
const HIT_MIN_GAP_MS = 80; // kratší pauza už není: sloupec zůstane oranžový
// Oranžový sloupec má hlavu, která náhodně glitchne do #bbff00 (v náhodném čase 0 až 7,88 s)
const HIT_HEAD_COLOR = '#bbff00';
const HIT_HEAD_MAX_MS = 7880;
const HIT_HEAD_MS = 400;

// Začátky jednotlivých bliknutí (ms od zásahu); od posledního je sloupec oranžový napořád
const HIT_BLINK_STARTS: number[] = (() => {
  const starts = [0];
  let gap = HIT_FIRST_GAP_MS;
  while (gap >= HIT_MIN_GAP_MS) {
    starts.push(starts[starts.length - 1] + HIT_BLINK_MS + gap);
    gap *= HIT_GAP_FACTOR;
  }
  return starts;
})();
const hitIsOn = (elapsed: number): boolean => {
  if (elapsed >= HIT_BLINK_STARTS[HIT_BLINK_STARTS.length - 1]) return true; // už napořád
  return HIT_BLINK_STARTS.some((start) => elapsed >= start && elapsed < start + HIT_BLINK_MS);
};

const SPEED = 1; // rychlost 1.00x
const GLITCH = true; // glitch kolem kurzoru (180 px)
const LAYER_OPACITY = 1; // viditelnost celého pozadí (1 = barvy přesně jak jsou zadané)
const SITE_BG_FALLBACK: RGB = [43, 43, 43]; // #2B2B2B = --color-loyo-bg

const ANGLE = (-7.77 * Math.PI) / 180; // náklon
const SCALE = 1.12;
const COL_GAP = 18; // rozteč sloupců (počítač)
const COL_GAP_MOBILE = 32; // telefon: řidší sloupce
const GLITCH_RADIUS = 180; // dosah glitche kolem kurzoru (počítač)
const GLITCH_RADIUS_MOBILE = 90; // telefon: menší dosah
const GLITCH_AMP_MOBILE = 0.45; // telefon: slabší vychylování (1 = jako na počítači)
const ROW_H = 20; // výška řádku
const FONT_PX = 14;
const BUCKETS = 40; // počet odstínů mezi hlavou a ocasem
// Řádky atlasu za odstíny: hlava, hlava glitch modrá, hlava glitch zelenožlutá, oranžový znak, oranžová hlava
const ROW_HEAD = BUCKETS;
const ROW_GLITCH = BUCKETS + 1;
const ROW_HIT_HEAD_GLITCH = BUCKETS + 2;
const ROW_HIT = BUCKETS + 3;
const ROW_HIT_BIG = BUCKETS + 4;
const ROW_HEAD_BLINK = BUCKETS + 5; // hlava v bílé fázi blikání
const ATLAS_ROWS = BUCKETS + 6;
const FONT_FAMILY = '"Geist Mono", "IBM Plex Mono", monospace';

type RGB = [number, number, number];

interface Column {
  x: number;
  baseY: number;
  speed: number;
  length: number;
  glyphs: number[]; // indexy do GLYPHS
  timers: number[];
  phase: number;
  glitchAt: number; // kdy má sloupec další šanci na glitch hlavy do #00bbff (čas běhu v ms)
  glitchUntil: number; // do kdy glitch hlavy trvá
  hitStart: number; // kdy sloupcem prošel kurzor (-1 = ještě ne, nebo od posledního vynoření nic)
  hitHeadAt: number; // kdy zkusí hlava oranžového sloupce glitchnout do #bbff00
  hitHeadUntil: number;
  blinkSpeed: number; // rychlost blikání hlavy do bílé (rad/ms)
}

const randomGlyph = () => Math.floor(Math.random() * GLYPHS.length);
const toCss = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

const parseHex = (hex: string): RGB | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches; // telefon / tablet
    const colGap = coarse ? COL_GAP_MOBILE : COL_GAP;
    const glitchR = coarse ? GLITCH_RADIUS_MOBILE : GLITCH_RADIUS;
    const glitchAmp = coarse ? GLITCH_AMP_MOBILE : 1;
    const hitHalfWidth = Math.min(colGap / 2, 11); // jak blízko sloupci musí být kurzor, aby ho "protnul"
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = reducedQuery.matches; // omezený pohyb: jen jeden statický snímek (mění se i za běhu)

    // ---------- barvy ----------
    const siteBg =
      parseHex(getComputedStyle(document.documentElement).getPropertyValue('--color-loyo-bg')) ??
      SITE_BG_FALLBACK;
    // průhlednost vrstvy nad pozadím webu je vypálená rovnou do barev
    const bake = (c: RGB): RGB =>
      c.map((v, i) => LAYER_OPACITY * v + (1 - LAYER_OPACITY) * siteBg[i]) as RGB;

    const bgRaw = parseHex(BG_COLOR) ?? [51, 51, 51];
    const bgCss = toCss(bake(bgRaw));

    const head = parseHex(HEAD_COLOR) ?? [181, 181, 181];
    const headCss = toCss(bake(head));
    const headBlinkCss = toCss(bake(parseHex(HEAD_BLINK_COLOR) ?? [255, 255, 255]));
    // glitch hlav: čistá barva bez 50% zesvětlení, ať je vidět jako výrazná (krátká) vlna
    const glitchHeadCss = toCss(parseHex(GLITCH_HEAD_COLOR) ?? [255, 26, 26]);
    const hitCss = toCss(parseHex(HIT_COLOR) ?? [255, 72, 0]);
    const hitHeadCss = toCss(parseHex(HIT_HEAD_COLOR) ?? [187, 255, 0]);
    // ocas má stejnou barvu jako hlava, vytrácí se průhledností (viz fade níže)
    const bucketCss: string[] = Array.from({ length: BUCKETS }, () => headCss);

    // ---------- stav ----------
    let rs = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5); // pixely canvasu na CSS px
    let W = 0;
    let H = 0;
    let hx = 0; // polovina scény (po otočení pokrývá celou obrazovku)
    let hy = 0;
    let lastW = 0;
    let lastInnerH = 0;
    let columns: Column[] = [];
    const atlas = document.createElement('canvas');
    let cell = 0;
    let spriteSize = 0;

    let scrollY = window.scrollY;
    let time = 0;
    let last = performance.now();
    let frameInterval = 0; // 0 = bez omezení, jinak minimum ms mezi snímky
    let frames = 0;
    let slow = 0;
    let shown = false;
    let raf = 0;
    let resizeTimer = 0;
    const mouse = { x: -1000, y: -1000, active: false };

    const cosA = Math.cos(ANGLE);
    const sinA = Math.sin(ANGLE);

    // ---------- atlas znaků: každý znak v každém odstínu jednou předkreslený ----------
    const buildAtlas = () => {
      const ds = rs * SCALE; // fyzické pixely na jednotku scény
      const font = FONT_PX * ds;
      cell = Math.ceil(font * 1.18 * 1.3) + 4;
      spriteSize = cell / ds;
      atlas.width = GLYPHS.length * cell;
      atlas.height = ATLAS_ROWS * cell; // odstíny, pak zvětšená hlava a její barevné varianty (viz ROW_*)
      const a = atlas.getContext('2d');
      if (!a) return;
      a.textAlign = 'center';
      a.textBaseline = 'middle';
      for (let row = 0; row < ATLAS_ROWS; row++) {
        const isHead = row >= BUCKETS && row !== ROW_HIT; // hlavy jsou o 18 % větší
        a.font = `${isHead ? font * 1.18 : font}px ${FONT_FAMILY}`;
        a.fillStyle =
          row < BUCKETS
            ? bucketCss[row]
            : row === ROW_GLITCH
              ? glitchHeadCss
              : row === ROW_HIT_HEAD_GLITCH
                ? hitHeadCss
                : row === ROW_HIT || row === ROW_HIT_BIG
                  ? hitCss
                  : row === ROW_HEAD_BLINK
                    ? headBlinkCss
                    : headCss;
        for (let g = 0; g < GLYPHS.length; g++) {
          a.fillText(GLYPHS[g], g * cell + cell / 2, row * cell + cell / 2);
        }
      }
    };

    const newColumn = (x: number): Column => {
      const length = 8 + Math.floor(Math.random() * 18) + (Math.random() < 0.15 ? 12 : 0);
      return {
        x,
        baseY: -hy + Math.random() * (2 * hy + length * ROW_H),
        speed: 0.3 + Math.random() * 1.5,
        length,
        glyphs: Array.from({ length }, randomGlyph),
        timers: Array.from({ length }, () => Math.random() * 100),
        phase: Math.random() * Math.PI * 2,
        glitchAt: time + Math.random() * GLITCH_HEAD_EVERY_MS, // každý sloupec má svůj čas
        glitchUntil: 0,
        hitStart: -1,
        hitHeadAt: 0,
        hitHeadUntil: 0,
        blinkSpeed:
          (2 * Math.PI) /
          (HEAD_BLINK_MIN_MS + Math.random() * (HEAD_BLINK_MAX_MS - HEAD_BLINK_MIN_MS)),
      };
    };

    const setup = () => {
      lastW = window.innerWidth;
      lastInnerH = window.innerHeight;
      W = lastW;
      // na telefonu rezerva, aby nevznikl pruh při schování lišty prohlížeče
      H = coarse ? Math.round(lastInnerH * 1.15) : lastInnerH;
      canvas.width = Math.round(W * rs);
      canvas.height = Math.round(H * rs);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      hx = ((W / 2) * Math.abs(cosA) + (H / 2) * Math.abs(sinA)) / SCALE + 20;
      hy = ((W / 2) * Math.abs(sinA) + (H / 2) * Math.abs(cosA)) / SCALE + 20;

      buildAtlas();
      const count = Math.ceil((2 * hx) / colGap) + 2;
      columns = Array.from({ length: count }, (_, i) =>
        newColumn(-hx + i * colGap + (Math.random() * 4 - 2)),
      );
    };

    // pomalý běh: nejdřív nižší rozlišení, pak 30 FPS
    const degrade = () => {
      frames = 0;
      slow = 0;
      if (rs > 1.01) {
        rs = Math.max(1, rs - 0.25);
        setup();
      } else {
        frameInterval = 1000 / 30;
      }
    };

    // náhodná výměna znaku, když kurzor není poblíž
    const idle = (col: Column, q: number, chance: number, step: number) => {
      col.timers[q] += 0.15 * step;
      if (col.timers[q] > 120 + Math.random() * 200) {
        col.timers[q] = 0;
        if (Math.random() < chance) col.glyphs[q] = randomGlyph();
      }
    };

    const frame = (now: number) => {
      if (!reduced) raf = requestAnimationFrame(frame);
      const dt = now - last;
      if (dt < frameInterval - 2) return; // omezení FPS
      last = now;

      // hlídání výkonu (jen když není omezené FPS; první snímky se přeskočí)
      if (frameInterval === 0 && dt < 500) {
        frames++;
        if (frames > 90) {
          slow = dt > 26 ? slow + 1 : Math.max(0, slow - 1);
          if (slow >= 40) degrade();
        }
      }

      const step = Math.min(dt, 100) / 16.667; // pohyb nezávisí na FPS displeje
      time += Math.min(dt, 100);

      ctx.setTransform(rs, 0, 0, rs, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = bgCss;
      ctx.fillRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2);
      ctx.rotate(ANGLE);
      ctx.scale(SCALE, SCALE);

      // kurzor přepočtený do souřadnic otočené scény
      const glitchOn = GLITCH && mouse.active;
      let mx = 0;
      let my = 0;
      if (glitchOn) {
        const dx = (mouse.x - W / 2) / SCALE;
        const dy = (mouse.y - H / 2) / SCALE;
        mx = dx * cosA + dy * sinA;
        my = -dx * sinA + dy * cosA;
      }

      const top = -hy;
      const bottom = hy;
      const parallax = scrollY * 0.12;
      const half = spriteSize / 2;

      for (const col of columns) {
        col.baseY -= col.speed * SPEED * 1.2 * step; // pohyb (na obrazovce podle FALL_DOWN)
        if (col.baseY + col.length * ROW_H < top - ROW_H) {
          // vyjel nahoře ven -> objeví se dole (oranžová se tím vynuluje)
          col.baseY = bottom + Math.random() * 200;
          col.hitStart = -1;
          if (Math.random() < 0.3) {
            col.length = 8 + Math.floor(Math.random() * 20);
            col.glyphs = Array.from({ length: col.length }, randomGlyph);
            col.timers = Array.from({ length: col.length }, () => 0);
          }
        }

        // vlastní čas sloupce: jednou za 10 s je šance 44,22 % na glitch hlavy do #00bbff
        if (time >= col.glitchAt) {
          if (Math.random() < GLITCH_HEAD_CHANCE) col.glitchUntil = time + GLITCH_HEAD_MS;
          col.glitchAt = time + GLITCH_HEAD_EVERY_MS;
        }
        // oranžový sloupec: hlava občas (v náhodném čase 0 až 7,88 s) glitchne do #bbff00
        if (col.hitStart >= 0 && time >= col.hitHeadAt) {
          col.hitHeadUntil = time + HIT_HEAD_MS;
          col.hitHeadAt = time + Math.random() * HIT_HEAD_MAX_MS;
        }

        const near = glitchOn && Math.abs(col.x - mx) < glitchR + 40;
        const headWhite = Math.sin(time * col.blinkSpeed + col.phase) > 0.35; // hlava právě svítí bíle
        const shiftY = parallax * (0.2 + col.speed * 0.1);

        for (let q = 0; q < col.length; q++) {
          // pohyb se počítá zdola nahoru, na obrazovce se zrcadlí (FALL_DOWN: padá dolů, hlava nahoře)
          const yBase = col.baseY - q * ROW_H;
          const y = (FALL_DOWN ? -yBase : yBase) + shiftY;
          if (y < top - ROW_H || y > bottom + ROW_H) continue;

          const t = q / col.length; // 0 = hlava, 1 = konec ocasu
          let fade = 1 - t * 0.85;
          let dist = 0;
          let offX = 0;
          let offY = 0;

          if (near) {
            const d = Math.hypot(col.x - mx, y - my);
            if (d < glitchR) {
              // glitch rádius (na telefonu menší)
              dist = 1 - d / glitchR;
              offX =
                (Math.sin(y * 0.045 + time * 0.008 + col.phase) * dist * 22 +
                  (Math.random() - 0.5) * dist * 16) *
                glitchAmp;
              offY = Math.cos(y * 0.03 + time * 0.012) * dist * 4 * glitchAmp;
              col.timers[q] += (dist * 4 + 0.5) * step;
              if (col.timers[q] > 6 + Math.random() * 8) {
                col.timers[q] = 0;
                col.glyphs[q] =
                  Math.random() < 0.7
                    ? GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)]
                    : randomGlyph();
              }
              fade = fade * (0.6 + Math.random() * 0.7) + dist * 0.3;
            } else {
              idle(col, q, 0.08, step);
            }
          } else {
            idle(col, q, 0.06, step);
          }

          const alpha = Math.max(0.08, Math.min(1, fade));
          const bucket = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
          const sx = col.glyphs[q] * cell;
          const isHead = t < 0.08;

          // kurzor prošel přímo sloupcem: začne oranžové blikání
          if (near && col.hitStart < 0 && Math.abs(col.x - mx) < hitHalfWidth && Math.abs(y - my) < ROW_H * 0.6) {
            col.hitStart = time;
            col.hitHeadAt = time + Math.random() * HIT_HEAD_MAX_MS;
          }
          const hitOn = col.hitStart >= 0 && hitIsOn(time - col.hitStart); // sloupec teď svítí oranžově
          const hitGlitch = isHead && col.hitStart >= 0 && time < col.hitHeadUntil; // hlava oranžového sloupce: #bbff00
          const cyan = isHead && !hitGlitch && time < col.glitchUntil; // hlava glitchuje do #00bbff
          const glitchRow = hitGlitch ? ROW_HIT_HEAD_GLITCH : ROW_GLITCH;
          const gx = col.x + offX + (cyan || hitGlitch ? (Math.random() - 0.5) * 6 : 0) - half;
          const gy = y + offY - half;

          if (cyan || hitGlitch) {
            // posunutý "duch" za hlavou: efekt glitche
            ctx.globalAlpha = alpha * 0.4;
            ctx.drawImage(
              atlas,
              sx,
              glitchRow * cell,
              cell,
              cell,
              gx + (Math.random() < 0.5 ? 4 : -4),
              gy,
              spriteSize,
              spriteSize,
            );
          }

          if (!coarse && dist > 0.4) {
            // záře kolem kurzoru
            ctx.globalAlpha = alpha * 0.18 * dist;
            ctx.drawImage(
              atlas,
              sx,
              bucket * cell,
              cell,
              cell,
              gx + 3 * (dist > 0.7 ? 1 : -1),
              gy,
              spriteSize,
              spriteSize,
            );
          }
          ctx.globalAlpha = alpha;
          // hlava sloupce (t < 0.08) je o 18 % větší, má vlastní řádek v atlasu
          ctx.drawImage(
            atlas,
            sx,
            (cyan || hitGlitch
              ? glitchRow
              : hitOn
                ? isHead
                  ? ROW_HIT_BIG
                  : ROW_HIT
                : isHead
                  ? headWhite
                    ? ROW_HEAD_BLINK
                    : ROW_HEAD
                  : bucket) * cell,
            cell,
            cell,
            gx,
            gy,
            spriteSize,
            spriteSize,
          );
          if (!coarse && dist > 0.5 && q % 3 === 0) {
            // jiskřičky
            ctx.globalAlpha = 0.06 * dist;
            ctx.fillStyle = t < 0.08 ? headCss : bucketCss[bucket];
            ctx.fillRect(gx + half - 1, gy + half, 2, 2);
          }
        }
      }
      ctx.globalAlpha = 1;

      if (!shown) {
        shown = true;
        canvas.style.visibility = 'visible'; // až po prvním vykreslení (bez černého záblesku)
      }
    };

    // ---------- události ----------
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    // resize s odstupem; na telefonu se ignoruje schovávání lišty prohlížeče (mění jen výšku)
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const h = window.innerHeight;
        const heightChanged = coarse ? Math.abs(h - lastInnerH) > lastInnerH * 0.2 : h !== lastInnerH;
        if (window.innerWidth !== lastW || heightChanged) {
          setup();
          if (reduced) frame(performance.now()); // setup smazal canvas, znovu vykreslit statický snímek
        }
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    // ---------- omezený pohyb (i za běhu) a skrytá záložka ----------
    const startLoop = () => {
      cancelAnimationFrame(raf);
      last = performance.now(); // ať první snímek nepočítá dobu, kdy se nekreslilo
      raf = requestAnimationFrame(frame);
    };
    const onReducedChange = () => {
      reduced = reducedQuery.matches;
      if (reduced) {
        cancelAnimationFrame(raf);
        frame(performance.now()); // zastavit a nechat jeden statický snímek
      } else if (!document.hidden) {
        startLoop();
      }
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf); // skrytá záložka: nic se nekreslí (šetří baterii)
      else if (!reduced) startLoop();
    };
    reducedQuery.addEventListener('change', onReducedChange);
    document.addEventListener('visibilitychange', onVisibility);

    setup();
    last = performance.now();
    if (reduced) frame(last + 16); // jen jeden statický snímek, bez smyčky
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      reducedQuery.removeEventListener('change', onReducedChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-loyo-bg select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 block"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
};
