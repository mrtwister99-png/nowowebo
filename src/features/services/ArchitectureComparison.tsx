import React from 'react';
import { Card } from '../../components/ui/Card';

interface ComparisonRow {
  feature: string;
  /** Hodnota u vývoje na míru; "green" zvýrazňuje finanční výhodu */
  ours: string;
  oursTone: 'gold' | 'green';
  /** Hodnota u krabicových řešení (SaaS / No-Code) */
  others: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'Vlastnictví kódu',
    ours: '100 % vaše výhradní vlastnictví',
    oursTone: 'gold',
    others: 'Pronájem, nemůžete kód exportovat',
  },
  {
    feature: 'Měsíční licenční poplatky',
    ours: '0 Kč (pouze váš levný hosting)',
    oursTone: 'green',
    others: 'Desítky tisíc ročně za uživatelské účty',
  },
  {
    feature: 'Rychlost a odezva',
    ours: 'Blesková pod 100 ms',
    oursTone: 'gold',
    others: 'Těžkopádné, pomalé načítání',
  },
  {
    feature: 'Přizpůsobení logiky',
    ours: 'Neomezené – cokoliv téměř',
    oursTone: 'gold',
    others: 'Omezené mantinely šablony',
  },
];

const OURS_TONE_CLASS = {
  gold: 'text-loyo-mustard-dark',
  green: 'text-emerald-700',
} as const;

/* Srovnání zakázkového vývoje s krabicovými šablonami / No-Code */
export const ArchitectureComparison: React.FC = () => (
  <Card className="sm:p-8">
    <div className="max-w-2xl mb-6">
      <span className="text-xs font-mono font-bold uppercase text-loyo-mustard-dark block mb-1">
        SROVNÁNÍ PŘÍSTUPŮ
      </span>
      <h3 className="font-heading font-black text-2xl sm:text-3xl text-loyo-ink">
        Krabicové šablony vs. Zakázkový čistý kód
      </h3>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono border-collapse">
        <thead>
          <tr className="border-b-2 border-loyo-ink bg-loyo-bg">
            <th className="p-3 uppercase text-loyo-subtle">Vlastnost</th>
            <th className="p-3 uppercase text-loyo-mustard-dark font-black">LoYo Vývoj na míru</th>
            <th className="p-3 uppercase text-loyo-subtle">Krabicové SaaS / No-Code</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-loyo-line">
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.feature}>
              <td className="p-3 font-bold text-loyo-ink">{row.feature}</td>
              <td className={`p-3 font-bold ${OURS_TONE_CLASS[row.oursTone]}`}>{row.ours}</td>
              <td className="p-3 text-loyo-faint">{row.others}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
