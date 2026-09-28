import React, { useState } from 'react';
import { Check, Send, CheckCircle2, Copy, Clock } from 'lucide-react';
import { ServiceId, QuestionnaireData, InquiredSubmission } from '../types';
import { QUESTIONNAIRE_CONFIGS } from '../data/servicesData';

interface IntegratedQuestionnaireProps {
  serviceId: ServiceId;
}

export const IntegratedQuestionnaire: React.FC<IntegratedQuestionnaireProps> = ({ serviceId }) => {
  const config =
    (QUESTIONNAIRE_CONFIGS as any)[serviceId] || (QUESTIONNAIRE_CONFIGS as any).automation;
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<InquiredSubmission | null>(null);

  // Form State
  const [formData, setFormData] = useState<QuestionnaireData>({
    serviceId: serviceId,
    projectScope: config.scopeOptions[0] || '',
    selectedFeatures: [],
    securityOptions: [],
    automationScope: [],
    brandingOptions: [],
    consultationTopics: [],
    consultationFormat: 'Osobně na kávě (Praha / dle domluvy)',
    animationLevel: 'Vyvážené elegantní mikrointerakce a plynulé přechody',
    budgetRange: (config as any).budgets[1] || (config as any).budgets[0],
    timeline: (config as any).timelines[1] || (config as any).timelines[0],
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  const toggleFeature = (feat: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feat)
        ? prev.selectedFeatures.filter((f) => f !== feat)
        : [...prev.selectedFeatures, feat],
    }));
  };

  const toggleSecurityOption = (sec: string) => {
    setFormData((prev) => ({
      ...prev,
      securityOptions: prev.securityOptions.includes(sec)
        ? prev.securityOptions.filter((s) => s !== sec)
        : [...prev.securityOptions, sec],
    }));
  };

  const toggleConsultationTopic = (top: string) => {
    setFormData((prev) => ({
      ...prev,
      consultationTopics: (prev.consultationTopics ?? []).includes(top)
        ? (prev.consultationTopics ?? []).filter((t) => t !== top)
        : [...(prev.consultationTopics ?? []), top],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const submission: InquiredSubmission = {
        ...formData,
        id: `INQ-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toLocaleDateString('cs-CZ', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'new',
      };
      setSubmittedData(submission);
    }, 900);
  };

  const handleCopySummary = () => {
    if (!submittedData) return;
    const text = `LoYo Dotazník Poptávky [${submittedData.id}]:
Služba: ${submittedData.serviceId}
Jméno: ${submittedData.name}
E-mail: ${submittedData.email}
Telefon: ${submittedData.phone || 'Neuvedeno'}
Rozsah: ${submittedData.projectScope}
Rozpočet: ${submittedData.budgetRange}
Termín: ${submittedData.timeline}
Poznámky: ${submittedData.notes || 'Bez poznámek'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="dotaznik-sekce"
      className="bg-loyo-bar border-2 border-loyo-ink p-6 sm:p-8 lg:p-10 shadow-sm scroll-mt-24"
    >
      {/* Header of Questionnaire */}
      <div className="border-b border-loyo-line pb-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-loyo-bg text-loyo-ink text-2.5 font-mono font-bold uppercase tracking-wider border border-[#c5c5c5]">
            INTEGROVANÝ DOTAZNÍK NA MÍRU
          </span>
          <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-loyo-ink">
          {config.title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-loyo-muted max-w-2xl leading-relaxed">
          {config.description} Vyplnění vám zabere 2 minuty a umožní mi připravit konkrétní návrh
          realizace.
        </p>
      </div>

      {submittedData ? (
        /* Success Confirmation View */
        <div className="py-8 text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="font-heading font-black text-2xl text-loyo-ink">
            Poptávkový dotazník byl úspěšně zaznamenán!
          </h4>
          <p className="text-sm text-loyo-body max-w-lg mx-auto">
            Děkuji vám, <strong>{submittedData.name}</strong>. Vaše zadání pod referenčním číslem{' '}
            <strong>#{submittedData.id}</strong> bylo odesláno. Ozvu se vám na{' '}
            <strong>{submittedData.email}</strong> do 24 hodin.
          </p>

          <div className="p-4 bg-loyo-bg border border-loyo-line max-w-md mx-auto text-left font-mono text-xs space-y-1">
            <div className="text-loyo-subtle uppercase text-2.5 pb-1 border-b border-[#ddd]">
              Souhrn zadání:
            </div>
            <div>
              <strong className="text-loyo-ink">Rozsah:</strong> {submittedData.projectScope}
            </div>
            <div>
              <strong className="text-loyo-ink">Rozpočet:</strong> {submittedData.budgetRange}
            </div>
            <div>
              <strong className="text-loyo-ink">Termín:</strong> {submittedData.timeline}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2.5 bg-loyo-bg hover:bg-[#e0e0e0] border border-loyo-ink font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Souhrn zkopírován!' : 'Zkopírovat souhrn poptávky'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSubmittedData(null)}
              className="px-4 py-2.5 bg-loyo-ink text-white hover:bg-loyo-blue font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Upravit nebo odeslat nový
            </button>
          </div>
        </div>
      ) : (
        /* The Detailed Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Main Scope Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase text-loyo-ink">
              1. Zvolte zaměření a rozsah projektu *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(config as any).scopeOptions.map((opt: string) => {
                const isSelected = formData.projectScope === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, projectScope: opt }))}
                    className={`p-3 text-left border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-loyo-ink text-white border-loyo-ink shadow-xs'
                        : 'bg-loyo-bg text-loyo-strong border-loyo-line hover:border-loyo-ink'
                    }`}
                  >
                    <span className="text-xs font-bold leading-snug">{opt}</span>
                    <span
                      className={`w-4 h-4 rounded-xs flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-white text-loyo-ink border-white'
                          : 'border-loyo-line-strong'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Service-Specific Features / Details */}
          {serviceId === 'automation' && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase text-loyo-ink">
                2. Požadované typy zabezpečení a autentizace (volitelné)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Ověření přes mobilní telefon (SMS kód / autentizační notifikace)',
                  'Fyzické NFC karty nebo stolní čipy pro zaměstnance',
                  'E-mailové magické jednorázové linky (bez hesel)',
                  'Gamifikované / grafické ověření (minihra na míru)',
                  'Standardní šifrované přihlašování s dvoufázovým 2FA',
                  'Automatické zálohování a auditní bezpečnostní logy',
                ].map((sec: string) => {
                  const isChecked = formData.securityOptions.includes(sec);
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => toggleSecurityOption(sec)}
                      className={`p-2.5 text-left border text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isChecked
                          ? 'bg-loyo-blue text-white border-loyo-blue'
                          : 'bg-loyo-bg text-loyo-body border-[#c5c5c5] hover:border-[#888]'
                      }`}
                    >
                      <span>{sec}</span>
                      <span
                        className={`w-3.5 h-3.5 border rounded-xs shrink-0 flex items-center justify-center ${
                          isChecked
                            ? 'bg-white text-loyo-blue border-white'
                            : 'border-loyo-line-strong'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {serviceId === 'fullstack' && (config as any).featureOptions && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase text-loyo-ink">
                2. Vyberte klíčové funkce systému
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(config as any).featureOptions.map((feat: string) => {
                  const isChecked = formData.selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`p-2.5 text-left border text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isChecked
                          ? 'bg-loyo-mustard-dark text-white border-loyo-mustard-dark'
                          : 'bg-loyo-bg text-loyo-body border-[#c5c5c5] hover:border-[#888]'
                      }`}
                    >
                      <span>{feat}</span>
                      <span
                        className={`w-3.5 h-3.5 border rounded-xs shrink-0 flex items-center justify-center ${
                          isChecked
                            ? 'bg-white text-loyo-mustard-dark border-white'
                            : 'border-loyo-line-strong'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {serviceId === 'web-branding' && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase text-loyo-ink">
                2. Styl, animace & požadavky na grafiku
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Kompletní restyling stávajícího webu (oživení & modernizace)',
                  'Unikátní vizuální jazyk od čistého listu (bez šablon)',
                  'Plynulé 60 FPS mikrointerakce a kinetická typografie',
                  'Tvorba nebo vektorový redraw loga',
                  'Ultra-rychlý náběh (Google PageSpeed 95+)',
                  'Napojení na kontaktní formuláře a analytiku',
                ].map((feat) => {
                  const isChecked = formData.selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`p-2.5 text-left border text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isChecked
                          ? 'bg-loyo-red text-white border-loyo-red'
                          : 'bg-loyo-bg text-loyo-body border-[#c5c5c5] hover:border-[#888]'
                      }`}
                    >
                      <span>{feat}</span>
                      <span
                        className={`w-3.5 h-3.5 border rounded-xs shrink-0 flex items-center justify-center ${
                          isChecked
                            ? 'bg-white text-loyo-red border-white'
                            : 'border-loyo-line-strong'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {serviceId === 'consultation' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-loyo-ink mb-2">
                  2. Formát setkání
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Osobně na kávě (Praha / dle domluvy v ČR)',
                    'Online videohovor (Google Meet / Zoom)',
                  ].map((fmt: string) => {
                    const isSelected = formData.consultationFormat === fmt;
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, consultationFormat: fmt }))
                        }
                        className={`p-3 text-left border text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-loyo-ink text-white border-loyo-ink'
                            : 'bg-loyo-bg text-loyo-strong border-loyo-line'
                        }`}
                      >
                        <span>{fmt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-loyo-ink mb-2">
                  Témata k prodiskutování
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Posouzení nápadu na aplikaci & reálná proveditelnost',
                    'Procesní audit firmy & kde ušetřit desítky hodin týdně',
                    'Ochrana rozpočtu & sestavení efektivního MVP plánu',
                    'Výběr správných technologií & zapojení moderní AI',
                    'Technická oponentura stávajícího dodavatele / softwaru',
                    'Předání know-how a zaškolení do systému',
                  ].map((top: string) => {
                    const isChecked = (formData.consultationTopics ?? []).includes(top);
                    return (
                      <button
                        key={top}
                        type="button"
                        onClick={() => toggleConsultationTopic(top)}
                        className={`p-2.5 text-left border text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-loyo-ink text-white border-loyo-ink'
                            : 'bg-loyo-bg text-loyo-body border-[#c5c5c5]'
                        }`}
                      >
                        <span>{top}</span>
                        {isChecked && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label
                htmlFor="int-budget"
                className="block text-xs font-mono font-bold uppercase text-loyo-ink mb-1"
              >
                3. Orientační rozpočet
              </label>
              <select
                id="int-budget"
                value={formData.budgetRange}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetRange: e.target.value }))}
                className="w-full px-3 py-2.5 bg-loyo-bg border border-loyo-line text-xs font-sans text-loyo-ink"
              >
                {(config as any).budgets.map((b: string) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="int-timeline"
                className="block text-xs font-mono font-bold uppercase text-loyo-ink mb-1"
              >
                4. Požadovaný termín realizace
              </label>
              <select
                id="int-timeline"
                value={formData.timeline}
                onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                className="w-full px-3 py-2.5 bg-loyo-bg border border-loyo-line text-xs font-sans text-loyo-ink"
              >
                {(config as any).timelines.map((t: string) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 4: Contact Information */}
          <div className="pt-2 border-t border-[#c5c5c5] space-y-3">
            <span className="block text-xs font-mono font-bold uppercase text-loyo-ink">
              5. Vaše kontaktní údaje
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="int-name"
                  className="block text-2.75 font-mono font-bold uppercase text-loyo-body mb-1"
                >
                  Jméno a Příjmení *
                </label>
                <input
                  id="int-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Jan Novák"
                  className="w-full px-3 py-2 bg-loyo-bg border border-loyo-line text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="int-email"
                  className="block text-2.75 font-mono font-bold uppercase text-loyo-body mb-1"
                >
                  E-mail *
                </label>
                <input
                  id="int-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="jan@firma.cz"
                  className="w-full px-3 py-2 bg-loyo-bg border border-loyo-line text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="int-phone"
                  className="block text-2.75 font-mono font-bold uppercase text-loyo-body mb-1"
                >
                  Telefon (volitelně)
                </label>
                <input
                  id="int-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+420 777 123 456"
                  className="w-full px-3 py-2 bg-loyo-bg border border-loyo-line text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="int-company"
                  className="block text-2.75 font-mono font-bold uppercase text-loyo-body mb-1"
                >
                  Název firmy / Projektu (volitelně)
                </label>
                <input
                  id="int-company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="MojeFirma s.r.o."
                  className="w-full px-3 py-2 bg-loyo-bg border border-loyo-line text-xs"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="int-notes"
                className="block text-2.75 font-mono font-bold uppercase text-loyo-body mb-1"
              >
                Doplňující poznámka nebo specifické požadavky
              </label>
              <textarea
                id="int-notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Popište podrobněji váš současný stav, jaké systémy využíváte nebo na co se chcete zaměřit..."
                className="w-full px-3 py-2 bg-loyo-bg border border-loyo-line text-xs resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-loyo-subtle">
              <Clock className="w-3.5 h-3.5 text-loyo-blue" />
              <span>Osobní vyhodnocení zadání a odpověď do 24 hodin</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-loyo-ink hover:bg-loyo-blue text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Odesílám dotazník...</span>
              ) : (
                <>
                  <span>Odeslat poptávkový dotazník</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
