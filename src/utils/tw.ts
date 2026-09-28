/**
 * LoYo Tailwind Canonical Tokens & Helpers
 * Stack: Vite + Tailwind v4.1.14, VS Code 1.131.0
 * Purpose: převod arbitrary [px] na canonical třídy + jednotné design tokeny
 */

// ============================================================================
// 1. LoYo Design Tokens (jediný zdroj pravdy, používá @theme v index.css)
// ============================================================================
export const loyoColors = {
  bg: '#ededed',
  bar: '#dbdbdb',
  blue: '#040b8d',
  red: '#ac0001',
  mustard: '#CDA24D',
  ink: '#18181b',
} as const;

export const loyoZ = {
  header: 70,
  backdrop: 65,
  dropdown: 72,
  card: 20,
  logo: 30,
} as const;

// ============================================================================
// 2. PX -> Tailwind Canonical Map (Tailwind scale: 1 = 0.25rem = 4px)
// ============================================================================
export const pxToCanonical: Record<string, string> = {
  '1px': 'px',
  '2px': '0.5',
  '3px': '0.75',
  '4px': '1',
  '5px': '1.25',
  '6px': '1.5',
  '7px': '1.75',
  '8px': '2',
  '10px': '2.5',
  '11px': '2.75',
  '12px': '3',
  '14px': '3.5',
  '15px': '3.75',
  '16px': '4',
  '20px': '5',
  '21px': '5.25',
  '22px': '5.5',
  '24px': '6',
  '28px': '7',
  '31px': '7.75',
  '32px': '8',
  '36px': '9',
  '37px': '9.25',
  '38px': '9.5',
  '40px': '10',
  '88px': '22',
  '96px': '24',
};

// ============================================================================
// 3. Helper: převede arbitrary třídu na canonical
// ============================================================================
export function toCanonical(cls: string): string {
  const arbitrary = cls.match(/^(-?)([a-z-]+)-\[(.+)\]$/);
  if (!arbitrary) return cls;
  const [, dash, prefix, raw] = arbitrary;
  const isNegative = dash === '-' || raw.startsWith('-');
  const value = raw.replace('-', '').trim();
  const canonical = pxToCanonical[value];
  if (!canonical) return cls;
  if (canonical === 'px') {
    return `${isNegative? '-' : ''}${prefix}-px`;
  }
  return `${isNegative? '-' : ''}${prefix}-${canonical}`;
}

// ============================================================================
// 4. Helper: batch fix pro celý className string
// ============================================================================
export function fixClassName(className: string): string {
  return className
   .split(/\s+/)
   .map(toCanonical)
   .join(' ')
   .replace(/\bz-\[(\d+)\]/g, 'z-$1')
   .replace(/\bbreak-words\b/g, 'wrap-break-word');
}

// ============================================================================
// 5. LoYo Animations Tokens
// ============================================================================
export const loyoBubbles = {
  active: [
    { pos: '-left-1.5', size: 'w-2.5 h-2.5', color: 'bg-loyo-blue' },
    { pos: 'left-0.5', size: 'w-3 h-3', color: 'bg-loyo-mustard' },
    { pos: 'left-4', size: 'w-2 h-2', color: 'bg-loyo-red' },
    { pos: 'left-5.5', size: 'w-3.5 h-3.5', color: 'bg-loyo-blue' },
    { pos: 'left-8', size: 'w-2.5 h-2.5', color: 'bg-loyo-mustard' },
    { pos: 'left-9.5', size: 'w-2 h-2', color: 'bg-loyo-red' },
  ],
  idle: [
    { pos: '-left-1.75', size: 'w-2 h-2', color: 'bg-loyo-mustard' },
    { pos: 'left-px', size: 'w-3.5 h-3.5', color: 'bg-loyo-blue' },
    { pos: 'left-3.75', size: 'w-2.5 h-2.5', color: 'bg-loyo-red' },
    { pos: 'left-5.25', size: 'w-3 h-3', color: 'bg-loyo-mustard' },
    { pos: 'left-7.75', size: 'w-2 h-2', color: 'bg-loyo-blue' },
    { pos: 'left-9.25', size: 'w-3 h-3', color: 'bg-loyo-red' },
  ],
} as const;

export const tw = {
  colors: loyoColors,
  z: loyoZ,
  toCanonical,
  fix: fixClassName,
  bubbles: loyoBubbles,
};