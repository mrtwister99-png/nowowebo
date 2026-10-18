import { useEffect, useState } from 'react';

/** Plynulé rolování jen bez zapnutého omezení pohybu v systému (prefers-reduced-motion), jinak okamžité. */
export const smoothBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/** Plynule posune stránku na prvek s daným id (s odsazením o výšku fixní hlavičky). Vrací false, když prvek neexistuje. */
export const scrollToElement = (id: string): boolean => {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.querySelector('header');
  const navOffset = header ? header.offsetHeight : 72;
  const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: smoothBehavior() });
  return true;
};

/** Odroluje na začátek stránky (plynule, nebo okamžitě při omezeném pohybu). */
export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: smoothBehavior() });
};

/**
 * Drží panel menu v DOM do konce animace zavření (vrací true, dokud má být panel vykreslený).
 * Délku zavření čte z CSS proměnné --menu-close-ms (index.css), záloha 450 ms.
 * Použití: const menuMounted = useMenuMount(isOpen); ... {(isOpen || menuMounted) && <Panel />}
 */
export const useMenuMount = (isOpen: boolean): boolean => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return;
    }
    const parsed = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--menu-close-ms'),
    );
    const closeMs = Number.isNaN(parsed) ? 450 : parsed; // 0 při reduced motion je platná hodnota
    const t = window.setTimeout(() => setMounted(false), closeMs);
    return () => window.clearTimeout(t);
  }, [isOpen]);
  return mounted;
};