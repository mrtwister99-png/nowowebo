/**
 * Značkové barvy pro JavaScript: canvas, SVG atributy, inline styly a data (LoYo OS — Royal Dark).
 * Hodnoty musí odpovídat tokenům v src/styles/tokens.css.
 * V Tailwind třídách používej tokeny (bg-loyo-blue, text-loyo-text ...), ne tuto konstantu.
 */
export const BRAND: Readonly<Record<'blue' | 'gold' | 'mustard' | 'red' | 'ink' | 'line', string>> = {
  blue: '#12a4ff', // 10 %: primární akce, aktivní stav, progress
  gold: '#c9a45c', // 1 %: PREMIUM
  mustard: '#9a9a9a', // dřív "zlatá" služba, teď neutrální šedá
  red: '#ff1e00', // 4 %: jen malá live tečka
  ink: '#9a9a9a', // neutrální značka (tečky v menu)
  line: '#444444',
};
