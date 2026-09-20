import React, { useState } from 'react';
import { ServiceId, QuestionnaireData, InquiredSubmission } from '../types';
import { QUESTIONNAIRE_CONFIGS } from '../data/servicesData';
import { Code2, Cpu, Sparkles, Send, CheckCircle2, Shield, Check, Copy } from 'lucide-react';

interface InquiryHubSectionProps {
  onSuccess?: () => void;
}

export const InquiryHubSection: React.FC<InquiryHubSectionProps> = () => {
  const [selectedService, setSelectedService] = useState<ServiceId>('fullstack');
  const [formData, setFormData] = useState<QuestionnaireData>({
    serviceId: 'fullstack',
    projectScope: QUESTIONNAIRE_CONFIGS.fullstack.scopeOptions[0],
    selectedFeatures: [],
    securityOptions: [],
    automationScope: [],
    brandingOptions: [],
    animationLevel: '',
    budgetRange: QUESTIONNAIRE_CONFIGS.fullstack.budgets[1],
    timeline: QUESTIONNAIRE_CONFIGS.fullstack.timelines[1],
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState<InquiredSubmission | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleServiceTabChange = (sId: ServiceId) => {
    setSelectedService(sId);
    setFormData(prev => ({
      ...prev,
      serviceId: sId,
      projectScope: QUESTIONNAIRE_CONFIGS[sId].scopeOptions[0],
      selectedFeatures: [],
      securityOptions: [],
      brandingOptions: [],
      budgetRange: QUESTIONNAIRE_CONFIGS[sId].budgets[1] || '',
      timeline: QUESTIONNAIRE_CONFIGS[sId].timelines[1] || ''
    }));
    setSubmitted(null);
  };

  const toggleFeature = (feat: string) => {
    setFormData(prev => {
      const exists = prev.selectedFeatures.includes(feat);
      return {
        ...prev,
        selectedFeatures: exists
          ? prev.selectedFeatures.filter(f => f !== feat)
          : [...prev.selectedFeatures, feat]
      };
    });
  };

  const toggleSecurity = (sec: string) => {
    setFormData(prev => {
      const exists = prev.securityOptions.includes(sec);
      return {
        ...prev,
        securityOptions: exists
          ? prev.securityOptions.filter(s => s !== sec)
          : [...prev.securityOptions, sec]
      };
    });
  };

  const toggleBranding = (b: string) => {
    setFormData(prev => {
      const exists = prev.brandingOptions.includes(b);
      return {
        ...prev,
        brandingOptions: exists
          ? prev.brandingOptions.filter(item => item !== b)
          : [...prev.brandingOptions, b]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Prosím uveďte své jméno a e-mail pro zaslání nabídky.');
      return;
    }

    const sub: InquiredSubmission = {
      ...formData,
      id: `VR-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'new'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('vr_inquiries') || '[]');
      localStorage.setItem('vr_inquiries', JSON.stringify([sub, ...existing]));
    } catch (e) {
      console.warn('Local storage write error', e);
    }

    setSubmitted(sub);
  };

  const copySummary = () => {
    if (!submitted) return;
    const text = `
POPTÁVKA #${submitted.id}
Služba: ${submitted.serviceId}
Rozsah: ${submitted.projectScope}
Funkce/Moduly: ${submitted.selectedFeatures.join(', ') || 'Nespecifikováno'}
Zabezpečení: ${submitted.securityOptions.join(', ') || 'Standardní'}
Rozpočet: ${submitted.budgetRange}
Termín: ${submitted.timeline}
Kontakt: ${submitted.name} (${submitted.email})
Firma: ${submitted.company || '-'}
Zpráva: ${submitted.notes || '-'}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentConfig = QUESTIONNAIRE_CONFIGS[selectedService];

  return (
    <section id="inquiry-hub" className="py-20 lg:py-28 bg-[#050058] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#000182]/50 border border-white/10 text-xs font-mono text-[#CE9B01] uppercase tracking-widest mb-4">
            <span>Rychlá Konfigurace & Komunikace</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] tracking-tight mb-4">
            Vyplňte dotazník přímo zde.
          </h2>
          <p className="text-base sm:text-lg text-[#D9EAF5] opacity-80 border-l-2 border-[#CE9B01] pl-6 leading-relaxed">
            Vyberte si oblast, zvolte požadované parametry a získejte promyšlenou nabídku bez zdlouhavého telefonování.
          </p>
        </div>

        {/* Outer Form Card */}
        <div className="max-w-4xl rounded-sm bg-[#000182]/50 border border-white/10 p-6 sm:p-10 shadow-sm relative">
          {/* Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-sm bg-[#050058] border border-white/10 mb-8">
            <button
              type="button"
              onClick={() => handleServiceTabChange('fullstack')}
              className={`py-3 px-3 rounded-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedService === 'fullstack'
                  ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                  : 'text-[#D9EAF5] hover:text-[#FFFFFF] hover:bg-[#000182]/40'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>01 Aplikace na míru</span>
            </button>

            <button
              type="button"
              onClick={() => handleServiceTabChange('automation')}
              className={`py-3 px-3 rounded-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedService === 'automation'
                  ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                  : 'text-[#D9EAF5] hover:text-[#FFFFFF] hover:bg-[#000182]/40'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>02 Automatizace & Bezpečnost</span>
            </button>

            <button
              type="button"
              onClick={() => handleServiceTabChange('web-branding')}
              className={`py-3 px-3 rounded-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedService === 'web-branding'
                  ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                  : 'text-[#D9EAF5] hover:text-[#FFFFFF] hover:bg-[#000182]/40'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>03 Weby & Branding</span>
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Scope Selection */}
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold block mb-3">
                  1. Zvolte rozsah projektu:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentConfig.scopeOptions.map((scope, i) => {
                    const isSelected = formData.projectScope === scope;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectScope: scope })}
                        className={`p-3.5 rounded-sm border text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#000182] border-[#CE9B01] text-[#FFFFFF] font-medium'
                            : 'bg-[#050058]/60 border-white/10 text-[#D9EAF5]/80 hover:border-white/30'
                        }`}
                      >
                        <span>{scope}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#CE9B01] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service 2 Special: Security selection */}
              {selectedService === 'automation' && (
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold flex items-center gap-1.5 mb-3">
                    <Shield className="w-4 h-4" />
                    <span>2. Preferovaný způsob zabezpečení & přihlášení (telefon, NFC, email, hra...):</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {QUESTIONNAIRE_CONFIGS.automation.securityOptions.map((sec, i) => {
                      const active = formData.securityOptions.includes(sec);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleSecurity(sec)}
                          className={`p-3 rounded-sm border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                            active
                              ? 'bg-[#000182] border-[#CE9B01] text-[#FFFFFF]'
                              : 'bg-[#050058]/60 border-white/10 text-[#D9EAF5]/80 hover:border-white/30'
                          }`}
                        >
                          <span>{sec}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                              active ? 'bg-[#CE9B01] border-[#CE9B01] text-[#050058]' : 'border-white/20'
                            }`}
                          >
                            {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features / Capabilities Checklist */}
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold block mb-3">
                  {selectedService === 'automation' ? '3. Procesy k automatizaci:' : '2. Požadované funkce a součásti:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService === 'fullstack' &&
                    QUESTIONNAIRE_CONFIGS.fullstack.featureOptions.map((feat, i) => {
                      const active = formData.selectedFeatures.includes(feat);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`p-3 rounded-sm border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                            active
                              ? 'bg-[#000182] border-[#CE9B01] text-[#FFFFFF]'
                              : 'bg-[#050058]/60 border-white/10 text-[#D9EAF5]/80 hover:border-white/30'
                          }`}
                        >
                          <span>{feat}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                              active ? 'bg-[#CE9B01] border-[#CE9B01] text-[#050058]' : 'border-white/20'
                            }`}
                          >
                            {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}

                  {selectedService === 'automation' &&
                    QUESTIONNAIRE_CONFIGS.automation.featureOptions.map((feat, i) => {
                      const active = formData.selectedFeatures.includes(feat);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`p-3 rounded-sm border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                            active
                              ? 'bg-[#000182] border-[#CE9B01] text-[#FFFFFF]'
                              : 'bg-[#050058]/60 border-white/10 text-[#D9EAF5]/80 hover:border-white/30'
                          }`}
                        >
                          <span>{feat}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                              active ? 'bg-[#CE9B01] border-[#CE9B01] text-[#050058]' : 'border-white/20'
                            }`}
                          >
                            {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}

                  {selectedService === 'web-branding' &&
                    QUESTIONNAIRE_CONFIGS['web-branding'].brandingOptions.map((brand, i) => {
                      const active = formData.brandingOptions.includes(brand);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleBranding(brand)}
                          className={`p-3 rounded-sm border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                            active
                              ? 'bg-[#000182] border-[#CE9B01] text-[#FFFFFF]'
                              : 'bg-[#050058]/60 border-white/10 text-[#D9EAF5]/80 hover:border-white/30'
                          }`}
                        >
                          <span>{brand}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                              active ? 'bg-[#CE9B01] border-[#CE9B01] text-[#050058]' : 'border-white/20'
                            }`}
                          >
                            {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Budget & Timeline row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold block mb-2">
                    Orientační rozpočet:
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-xs sm:text-sm text-[#D9EAF5] focus:outline-none focus:border-[#CE9B01]"
                  >
                    {currentConfig.budgets.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold block mb-2">
                    Časový horizont:
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-xs sm:text-sm text-[#D9EAF5] focus:outline-none focus:border-[#CE9B01]"
                  >
                    {currentConfig.timelines.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <label className="text-xs font-mono uppercase tracking-widest text-[#CE9B01] font-bold block">
                  Kontaktní údaje:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Vaše jméno *"
                    className="px-3.5 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-xs sm:text-sm text-[#FFFFFF] placeholder-[#D9EAF5]/40 focus:outline-none focus:border-[#CE9B01]"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Váš e-mail *"
                    className="px-3.5 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-xs sm:text-sm text-[#FFFFFF] placeholder-[#D9EAF5]/40 focus:outline-none focus:border-[#CE9B01]"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Telefon (volitelné)"
                    className="px-3.5 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-xs sm:text-sm text-[#FFFFFF] placeholder-[#D9EAF5]/40 focus:outline-none focus:border-[#CE9B01]"
                  />
                </div>

                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Poznámka k projektu, specifické potřeby nebo dotaz..."
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-xs sm:text-sm text-[#FFFFFF] placeholder-[#D9EAF5]/40 focus:outline-none focus:border-[#CE9B01]"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-sm bg-[#CE9B01] hover:bg-[#e6b107] text-[#050058] font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md hover:shadow-[#CE9B01]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Odeslat specifikaci poptávky</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-sm bg-[#050058] border border-[#CE9B01] flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#CE9B01]" />
              </div>

              <div>
                <span className="font-mono text-xs text-[#CE9B01] font-bold block mb-1">
                  KÓD: #{submitted.id}
                </span>
                <h3 className="font-heading font-bold text-2xl text-[#FFFFFF] mb-2">
                  Děkuji za odeslání poptávky!
                </h3>
                <p className="text-xs sm:text-sm text-[#D9EAF5]/80 max-w-md mx-auto">
                  Informace jsem přijal a začínám s přípravou návrhu. Ozvu se vám do 24 hodin na <span className="text-[#CE9B01]">{submitted.email}</span>.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={copySummary}
                  className="px-4 py-2 rounded-sm bg-[#000182] text-xs uppercase tracking-wider font-bold text-[#D9EAF5] hover:text-[#FFFFFF] border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#CE9B01]" />
                  <span>{copied ? 'Zkopírováno!' : 'Zkopírovat shrnutí'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="px-4 py-2 rounded-sm bg-[#CE9B01] text-[#050058] text-xs font-bold uppercase tracking-wider hover:bg-[#e6b107] cursor-pointer"
                >
                  Nová konfigurace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
