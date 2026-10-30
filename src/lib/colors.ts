/**
 * Značkové barvy pro JavaScript: canvas, SVG atributy, inline styly a data.
 * Hodnoty musí odpovídat tokenům v src/styles/tokens.css.
 * V Tailwind třídách používej tokeny (bg-loyo-blue, text-loyo-ink ...), ne tuto konstantu.
 */
export const BRAND: Readonly<Record<'blue' | 'orange' | 'mustard' | 'mustardDark' | 'red' | 'ink', string>> = {
  blue: '#0088ff',
  orange: '#ff4800', // jen hover a aktivní stavy
  mustard: '#8c8c8c',
  mustardDark: '#6b6b6b',
  red: '#ff4800',
  ink: '#121212',
};
