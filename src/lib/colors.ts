/**
 * Značkové barvy pro JavaScript: canvas, SVG atributy, inline styly a data.
 * Hodnoty musí odpovídat tokenům v src/styles/tokens.css.
 * V Tailwind třídách používej tokeny (bg-loyo-blue, text-loyo-ink ...), ne tuto konstantu.
 */
export const BRAND: Readonly<Record<'blue' | 'mustard' | 'red' | 'ink', string>> = {
  blue: '#040b8d',
  mustard: '#cda24d',
  red: '#ac0001',
  ink: '#18181b',
};
