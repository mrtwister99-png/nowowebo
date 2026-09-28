import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';

/* Interaktivní kalkulačka: kolik hodin a peněz firma ušetří automatizací */
export const SavingsCalculator: React.FC = () => {
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(450);

  const annualHoursSaved = hoursSavedPerWeek * 48;
  const annualSavingsCZK = annualHoursSaved * hourlyCost;

  return (
    <Card className="sm:p-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bg border border-loyo-line text-xs font-mono font-bold uppercase text-loyo-blue mb-2">
          <span>KALKULAČKA FINANČNÍ NÁVRATNOSTI</span>
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-loyo-ink">
          Kolik hodin a peněz ušetříte správnou automatizací?
        </h3>
        <p className="text-xs sm:text-sm text-loyo-body mt-1 leading-relaxed">
          Posuňte táhla níže a zjistěte, kolik času a firemních nákladů ušetříte eliminací manuální
          rutiny.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-loyo-ink mb-1">
              <span>UŠETŘENÉ HODINY TÝDNĚ PRO CELÝ TÝM:</span>
              <span className="text-loyo-blue text-sm">{hoursSavedPerWeek} hodin / týdně</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              step={5}
              value={hoursSavedPerWeek}
              onChange={(e) => setHoursSavedPerWeek(Number(e.target.value))}
              className="w-full accent-loyo-blue cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-loyo-subtle mt-0.5">
              <span>5 hod (dílčí proces)</span>
              <span>40 hod (1 plný úvazek)</span>
              <span>80 hod (celý tým)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-loyo-ink mb-1">
              <span>PRŮMĚRNÁ HODINOVÁ MZDA / NÁKLAD PRACOVNÍKA:</span>
              <span className="text-loyo-blue text-sm">{hourlyCost} Kč / hod</span>
            </div>
            <input
              type="range"
              min={250}
              max={1000}
              step={50}
              value={hourlyCost}
              onChange={(e) => setHourlyCost(Number(e.target.value))}
              className="w-full accent-loyo-blue cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-loyo-subtle mt-0.5">
              <span>250 Kč/h</span>
              <span>500 Kč/h</span>
              <span>1000 Kč/h</span>
            </div>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-5 bg-loyo-bg border border-loyo-line p-5 space-y-4 text-center">
          <div>
            <span className="font-mono text-[10px] uppercase text-loyo-subtle block">
              ROČNÍ ÚSPORA ČASU:
            </span>
            <span className="font-heading font-black text-3xl sm:text-4xl text-loyo-blue block mt-0.5">
              {annualHoursSaved.toLocaleString('cs-CZ')} hodin
            </span>
          </div>

          <div className="pt-3 border-t border-[#d5d5d5]">
            <span className="font-mono text-[10px] uppercase text-loyo-subtle block">
              ROČNÍ FINANČNÍ ÚSPORA VAŠÍ FIRMY:
            </span>
            <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-700 block mt-0.5">
              {annualSavingsCZK.toLocaleString('cs-CZ')} Kč
            </span>
          </div>

          <p className="text-[11px] text-loyo-muted italic">
            Investice do automatizace se ve většině případů zaplatí již během prvních 2 až 3 měsíců.
          </p>
        </div>
      </div>
    </Card>
  );
};
