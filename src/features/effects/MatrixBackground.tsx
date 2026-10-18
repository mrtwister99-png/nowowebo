import React, { useEffect, useRef } from 'react';

/**
 * "Obrácený matrix": čtverce padají zdola nahoru (port z Matrix-Ctverce-Scroll-77).
 * Barvy jsou z originálu: pozadí #E6E6E6, hlava sloupce #111111, ocas plynule do #BBBBBB.
 * Celé pozadí je viditelné na 50 % (LAYER_OPACITY), zbytek je barva pozadí webu.
 *
 * Rychlost: znaky se předkreslí jednou do atlasu (sprite sheet) a pak se jen kopírují (drawImage),
 * canvas má velikost obrazovky a otáčí se uvnitř (ne přes CSS), filtr a průhlednost jsou
 * "vypálené" přímo do barev. Při pomalém běhu se kvalita sama sníží (rozlišení, pak 30 FPS).
 */

const GLYPHS = ['■', '□', '▪', '▫', '▬', '▭', '▮', '▯', '░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '◼', '◻', '◾', '◽'];
const GLITCH_GLYPHS = ['■', '◼', '█', '▓', '◾'].map((g) => GLYPHS.indexOf(g)); // indexy do GLYPHS

const BG_COLOR = '#E6E6E6'; // POZADÍ
const HEAD_COLOR = '#111111'; // ČTVERCE (hlava sloupce)
const SPEED = 1; // rychlost 1.00x
const GLITCH = true; // glitch kolem kurzoru (180 px)
const LAYER_OPACITY = 0.5; // viditelnost celého pozadí
const SITE_BG_FALLBACK: RGB = [237, 237, 237]; // #EDEDED = --color-loyo-bg

const ANGLE = (-7.77 * Math.PI) / 180; // náklon
const SCALE = 1.12;
const COL_GAP = 18; // rozteč sloupců
const ROW_H = 20; // výška řádku
const FONT_PX = 14;
const BUCKETS = 40; // počet odstínů mezi hlavou a ocasem
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
}

const randomGlyph = () => Math.floor(Math.random() * GLYPHS.length);
const clamp255 = (v: number) => Math.max(0, Math.min(255, v));
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
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = reducedQuery.matches; // omezený pohyb: jen jeden statický snímek (mění se i za běhu)

    // ---------- barvy ----------
    const siteBg =
      parseHex(getComputedStyle(document.documentElement).getPropertyValue('--color-loyo-bg')) ??
      SITE_BG_FALLBACK;
    // původní filtr contrast(1.05) a 50% průhlednost nad pozadím webu jsou vypálené rovnou do barev
    const bake = (c: RGB): RGB =>
      c.map(
        (v, i) => LAYER_OPACITY * clamp255(1.05 * v - 6.375) + (1 - LAYER_OPACITY) * siteBg[i],
      ) as RGB;

    const bgRaw = parseHex(BG_COLOR) ?? [230, 230, 230];
    const bgDark = bgRaw.map((v) => v * 0.985 * 0.985) as RGB; // původní 2× lehké ztmavení
    const bgCss = toCss(bake(bgDark));

    const head = parseHex(HEAD_COLOR) ?? [17, 17, 17];
    const headCss = toCss(bake(head));
    const bucketCss: string[] = [];
    for (let b = 0; b < BUCKETS; b++) {
      const t = (b + 0.5) / BUCKETS;
      let c: RGB = head;
      if (t >= 0.15) {
        const k = Math.min(1, (t - 0.15) / 0.85);
        const target = t > 0.6 ? 187 : 102 + 85 * k; // ocas -> #BBBBBB
        c = head.map((h) => Math.round(h + (target - h) * k)) as RGB;
      }
      bucketCss.push(toCss(bake(c)));
    }

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
      atlas.height = (BUCKETS + 1) * cell; // poslední řádek = zvětšená hlava sloupce
      const a = atlas.getContext('2d');
      if (!a) return;
      a.textAlign = 'center';
      a.textBaseline = 'middle';
      for (let row = 0; row <= BUCKETS; row++) {
        const isHead = row === BUCKETS;
        a.font = `${isHead ? font * 1.18 : font}px ${FONT_FAMILY}`;
        a.fillStyle = isHead ? headCss : bucketCss[row];
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
      const count = Math.ceil((2 * hx) / COL_GAP) + 2;
      columns = Array.from({ length: count }, (_, i) =>
        newColumn(-hx + i * COL_GAP + (Math.random() * 4 - 2)),
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
        col.baseY -= col.speed * SPEED * 1.2 * step; // proud zdola nahoru
        if (col.baseY + col.length * ROW_H < top - ROW_H) {
          // vyjel nahoře ven -> objeví se dole
          col.baseY = bottom + Math.random() * 200;
          if (Math.random() < 0.3) {
            col.length = 8 + Math.floor(Math.random() * 20);
            col.glyphs = Array.from({ length: col.length }, randomGlyph);
            col.timers = Array.from({ length: col.length }, () => 0);
          }
        }

        const near = glitchOn && Math.abs(col.x - mx) < 220;
        const shiftY = parallax * (0.2 + col.speed * 0.1);

        for (let q = 0; q < col.length; q++) {
          const y = col.baseY - q * ROW_H + shiftY;
          if (y < top - ROW_H || y > bottom + ROW_H) continue;

          const t = q / col.length; // 0 = hlava, 1 = konec ocasu
          let fade = 1 - t * 0.85;
          let dist = 0;
          let offX = 0;
          let offY = 0;

          if (near) {
            const d = Math.hypot(col.x - mx, y - my);
            if (d < 180) {
              // glitch rádius 180 px
              dist = 1 - d / 180;
              offX =
                Math.sin(y * 0.045 + time * 0.008 + col.phase) * dist * 22 +
                (Math.random() - 0.5) * dist * 16;
              offY = Math.cos(y * 0.03 + time * 0.012) * dist * 4;
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
          const gx = col.x + offX - half;
          const gy = y + offY - half;

          if (dist > 0.4) {
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
            (t < 0.08 ? BUCKETS : bucket) * cell,
            cell,
            cell,
            gx,
            gy,
            spriteSize,
            spriteSize,
          );
          if (dist > 0.5 && q % 3 === 0) {
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
