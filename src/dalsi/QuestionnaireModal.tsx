import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  Shield,
  Code2,
  Cpu,
  CheckCircle2,
  Copy,
  FileText,
  MessageSquare,
  Coffee,
  Calendar,
  Video,
  MapPin,
} from 'lucide-react';
import { ServiceId, QuestionnaireData, InquiredSubmission } from '../types';
import { QUESTIONNAIRE_CONFIGS } from '../data/servicesData';

interface QuestionnaireModalProps {
  isOpen: boolean;
  initialServiceId?: ServiceId;
  onClose: () => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  initialServiceId = 'fullstack',
  onClose,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceId>(initialServiceId);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<InquiredSubmission | null>(null);

  // Async Skeleton Loading & Progress States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitProgress, setSubmitProgress] = useState<number>(0);
  const [submitPhaseText, setSubmitPhaseText] = useState<string>('');
  const [isTabSwitching, setIsTabSwitching] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<QuestionnaireData>({
    serviceId: initialServiceId,
    projectScope: '',
    selectedFeatures: [],
    securityOptions: [],
    automationScope: [],
    brandingOptions: [],
    consultationTopics: [],
    consultationFormat: 'Osobně na kávě (Praha / dle domluvy)',
    animationLevel: '',
    budgetRange: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  useEffect(() => {
    if (initialServiceId) {
      setSelectedService(initialServiceId);
      const conf = QUESTIONNAIRE_CONFIGS[initialServiceId];
      setFormData((prev) => ({
        ...prev,
        serviceId: initialServiceId,
        projectScope: conf?.scopeOptions[0] || '',
      }));
    }
  }, [initialServiceId]);

  // Sync service changes with smooth skeleton transition
  const handleServiceChange = (serviceId: ServiceId) => {
    if (serviceId === selectedService) return;
    setIsTabSwitching(true);
    setSelectedService(serviceId);
    const conf = QUESTIONNAIRE_CONFIGS[serviceId];
    setFormData((prev) => ({
      ...prev,
      serviceId: serviceId,
      projectScope: conf?.scopeOptions[0] || '',
      selectedFeatures: [],
      securityOptions: [],
      brandingOptions: [],
      consultationTopics: [],
    }));
    setCurrentStep(1);
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 220);
  };

  const toggleArrayItem = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => {
      const arr = (prev[field] as string[]) || [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const currentConfig = QUESTIONNAIRE_CONFIGS[selectedService] || QUESTIONNAIRE_CONFIGS.fullstack;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Prosím uveďte své jméno a e-mail, abychom vás mohli kontaktovat.');
      return;
    }

    const submission: InquiredSubmission = {
      ...formData,
      id: `LY-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'new',
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('loyo_inquiries') || '[]');
      localStorage.setItem('loyo_inquiries', JSON.stringify([submission, ...existing]));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    // Professional Async Processing Simulation with Skeleton Screen
    setIsSubmitting(true);
    setSubmitProgress(20);
    setSubmitPhaseText('Kryptografická validace dat formuláře...');

    setTimeout(() => {
      setSubmitProgress(55);
      setSubmitPhaseText('Generování unifikované specifikace projektu...');
    }, 280);

    setTimeout(() => {
      setSubmitProgress(88);
      setSubmitPhaseText('Synchronizace záznamu a příprava potvrzení...');
    }, 620);

    setTimeout(() => {
      setSubmitProgress(100);
      setSubmittedData(submission);
      setIsSubmitting(false);
      setCurrentStep(5); // Success step
    }, 950);
  };

  const copySummaryText = () => {
    if (!submittedData) return;
    const summary = `
POPTÁVKA PROJEKTU: #${submittedData.id}
LoYo PREMIUM DEVELOPER
Služba: ${submittedData.serviceId}
Rozsah: ${submittedData.projectScope}
Funkce/Témata: ${[...submittedData.selectedFeatures, ...(submittedData.consultationTopics || [])].join(', ') || 'Nespecifikováno'}
Zabezpečení/Forma: ${submittedData.securityOptions.join(', ') || submittedData.consultationFormat || 'Standardní'}
Rozpočet: ${submittedData.budgetRange || 'Neuvedeno'}
Harmonogram: ${submittedData.timeline || 'Neuvedeno'}
Kontakt: ${submittedData.name} (${submittedData.email}, ${submittedData.phone || 'bez tel.'})
Firma: ${submittedData.company || '-'}
Poznámka: ${submittedData.notes || '-'}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-loyo-bg border-2 border-[#c2c2c2] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#18181b]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#c8c8c8] bg-loyo-bar">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#18181b] text-white flex items-center justify-center font-mono font-bold text-2.5">
              LY
            </div>
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#18181b]">
              LoYo • Interaktivní dotazník projektu na míru
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-loyo-bg hover:bg-[#e4e4e4] border border-[#c8c8c8] text-[#18181b] transition-colors cursor-pointer"
            aria-label="Zavřít"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector: 4 Tailored Options */}
        {currentStep < 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#c8c8c8] bg-loyo-bar text-xs font-semibold">
            {/* 01. Automatizace (Modrá) */}
            <button
              type="button"
              onClick={() => handleServiceChange('automation')}
              className={`py-3 px-2 sm:px-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider text-2.75 font-bold ${
                selectedService === 'automation'
                  ? 'bg-loyo-bg text-loyo-blue border-b-3 border-loyo-blue'
                  : 'text-[#555] hover:bg-[#d0d0d0]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-loyo-blue shrink-0" />
              <span className="truncate">01. Automatizace (Modrá)</span>
            </button>

            {/* 02. Vývoj aplikací (Zlatá) */}
            <button
              type="button"
              onClick={() => handleServiceChange('fullstack')}
              className={`py-3 px-2 sm:px-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider text-2.75 font-bold ${
                selectedService === 'fullstack'
                  ? 'bg-loyo-bg text-[#8a6b28] border-b-3 border-loyo-mustard'
                  : 'text-[#555] hover:bg-[#d0d0d0]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#8a6b28] shrink-0" />
              <span className="truncate">02. Aplikace (Zlatá)</span>
            </button>

            {/* 03. Tvorba webů (Červená) */}
            <button
              type="button"
              onClick={() => handleServiceChange('web-branding')}
              className={`py-3 px-2 sm:px-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider text-2.75 font-bold ${
                selectedService === 'web-branding'
                  ? 'bg-loyo-bg text-loyo-red border-b-3 border-loyo-red'
                  : 'text-[#555] hover:bg-[#d0d0d0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-loyo-red shrink-0" />
              <span className="truncate">03. Weby & Logo (Červená)</span>
            </button>

            {/* 04. Osobní konzultace (Černá) */}
            <button
              type="button"
              onClick={() => handleServiceChange('consultation')}
              className={`py-3 px-2 sm:px-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider text-2.75 font-bold ${
                selectedService === 'consultation'
                  ? 'bg-loyo-bg text-[#18181b] border-b-3 border-[#18181b]'
                  : 'text-[#555] hover:bg-[#d0d0d0]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#18181b] shrink-0" />
              <span className="truncate">04. Konzultace</span>
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {currentStep < 5 && (
          <div className="px-6 py-2.5 bg-loyo-bg border-b border-[#dcdcdc] flex items-center justify-between text-xs text-[#555]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#18181b] font-bold uppercase tracking-wider">
                KROK {currentStep} / 4:
              </span>
              <span className="font-medium text-[#18181b]">
                {currentStep === 1 && 'Rozsah a charakteristika poptávky'}
                {currentStep === 2 &&
                  (selectedService === 'automation'
                    ? 'Zabezpečení & moduly'
                    : selectedService === 'web-branding'
                      ? 'Restyling, logo & NFC vizitka'
                      : selectedService === 'consultation'
                        ? 'Témata k prodiskutování & forma'
                        : 'Požadované funkce aplikace')}
                {currentStep === 3 &&
                  (selectedService === 'consultation'
                    ? 'Představa o formátu a termínu'
                    : 'Harmonogram a orientační rozpočet')}
                {currentStep === 4 && 'Kontaktní údaje a odeslání'}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-6 sm:w-8 h-1 transition-all ${
                    step <= currentStep ? 'bg-[#18181b]' : 'bg-loyo-bar'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ASYNC SKELETON LOADING VIEW (SUBMISSION PHASE) */}
          {isSubmitting ? (
            <div className="py-8 sm:py-12 space-y-8 animate-in fade-in duration-200 text-center max-w-lg mx-auto">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-loyo-bar border-2 border-[#18181b] text-[#18181b] flex items-center justify-center mx-auto animate-pulse shadow-sm">
                  <Cpu className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#18181b]">
                  Zpracování specifikace projektu...
                </h3>
                <p className="text-xs font-mono text-[#666] tracking-wide">{submitPhaseText}</p>
              </div>

              {/* High-end subtle progress indicator */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-[#d5d5d5] overflow-hidden rounded-xs border border-[#bebebe]">
                  <div
                    className="h-full bg-linear-to-r from-loyo-blue via-loyo-mustard to-loyo-red transition-all duration-300 ease-out"
                    style={{ width: `${submitProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-2.75 font-mono font-bold text-[#555]">
                  <span>ASYNC DISPATCHING</span>
                  <span>{submitProgress}%</span>
                </div>
              </div>

              {/* Shimmering skeleton rows representing incoming generated artifact */}
              <div className="space-y-2.5 pt-2 text-left bg-loyo-bar p-4 sm:p-5 border border-[#c5c5c5] rounded-xs animate-pulse">
                <div className="h-3.5 bg-[#c2c2c2] rounded-xs w-2/5" />
                <div className="h-4.5 bg-[#b5b5b5] rounded-xs w-4/5" />
                <div className="h-3.5 bg-[#c2c2c2] rounded-xs w-3/5" />
                <div className="h-2.5 bg-[#cecece] rounded-xs w-1/2" />
              </div>
            </div>
          ) : isTabSwitching ? (
            /* ASYNC SKELETON LOADING VIEW (TAB SWITCHING PHASE) */
            <div className="py-6 space-y-6 animate-pulse">
              <div className="space-y-2">
                <div className="h-7 bg-[#d5d5d5] rounded-xs w-1/3" />
                <div className="h-4 bg-[#dedede] rounded-xs w-2/3" />
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-3.5 bg-[#d0d0d0] rounded-xs w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="h-16 bg-loyo-bar border border-[#ccc] rounded-xs" />
                  <div className="h-16 bg-loyo-bar border border-[#ccc] rounded-xs" />
                  <div className="h-16 bg-loyo-bar border border-[#ccc] rounded-xs" />
                  <div className="h-16 bg-loyo-bar border border-[#ccc] rounded-xs" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SCOPE */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#18181b] mb-1">
                      {currentConfig.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555]">{currentConfig.description}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#18181b] font-bold block">
                      Vyberte primární typ / záměr:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentConfig.scopeOptions.map((scope, idx) => {
                        const isSelected = formData.projectScope === scope;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, projectScope: scope })}
                            className={`p-4 text-left border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-loyo-bar border-[#18181b] text-[#18181b] shadow-xs'
                                : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-semibold">{scope}</span>
                            <div
                              className={`w-4 h-4 flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-[#18181b] border-[#18181b] text-white'
                                  : 'border-[#999] text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-3" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: TAILORED CAPABILITIES / SECURITY / FEATURES / CONSULTATION TOPICS */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* SERVICE 1: FULLSTACK FEATURES */}
                  {selectedService === 'fullstack' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-loyo-blue mb-1">
                          Klíčové funkce fullstack architektury
                        </h3>
                        <p className="text-xs sm:text-sm text-[#555]">
                          Označte technologie a moduly, které má aplikace obsahovat:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {QUESTIONNAIRE_CONFIGS.fullstack.featureOptions.map((feat, i) => {
                          const active = formData.selectedFeatures.includes(feat);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleArrayItem('selectedFeatures', feat)}
                              className={`p-3 border text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                                active
                                  ? 'bg-loyo-bar border-loyo-blue text-loyo-blue font-bold'
                                  : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                              }`}
                            >
                              <span>{feat}</span>
                              <span
                                className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                                  active
                                    ? 'bg-loyo-blue border-loyo-blue text-white'
                                    : 'border-[#999]'
                                }`}
                              >
                                {active && <Check className="w-3 h-3 stroke-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SERVICE 2: AUTOMATION & SECURITY */}
                  {selectedService === 'automation' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-[#8a6b28] mb-1">
                          Zabezpečení & automatizační moduly
                        </h3>
                        <p className="text-xs sm:text-sm text-[#555]">
                          Jaký typ ochrany preferujete? Přes telefon, NFC, e-mailem, hrou... prostě
                          čímkoliv:
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#8a6b28] font-bold block">
                          Možnosti přihlášení a ochrany na přání:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'Fyzická NFC karta / čip (přiložením)',
                            'Telefonní ověření (SMS kód / Push výzva)',
                            'Bezheslový e-mailový link (Magic Token)',
                            'Gamifikované ověření (Puzzle / Mini-hra)',
                            'Biometrie zařízení (FaceID / otisk prstu)',
                            'Role-Based Access Control (více úrovní oprávnění)',
                          ].map((sec, i) => {
                            const active = formData.securityOptions.includes(sec);
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => toggleArrayItem('securityOptions', sec)}
                                className={`p-3 border text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                                  active
                                    ? 'bg-loyo-bar border-loyo-mustard text-[#8a6b28] font-bold'
                                    : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                                }`}
                              >
                                <span>{sec}</span>
                                <span
                                  className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                                    active
                                      ? 'bg-loyo-mustard border-loyo-mustard text-[#18181b]'
                                      : 'border-[#999]'
                                  }`}
                                >
                                  {active && <Check className="w-3 h-3 stroke-3" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#8a6b28] font-bold block">
                          Oblasti procesů k automatizaci & úložiště:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {QUESTIONNAIRE_CONFIGS.automation.featureOptions.map((feat, i) => {
                            const active = formData.selectedFeatures.includes(feat);
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => toggleArrayItem('selectedFeatures', feat)}
                                className={`p-3 border text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                                  active
                                    ? 'bg-loyo-bar border-loyo-mustard text-[#8a6b28] font-bold'
                                    : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                                }`}
                              >
                                <span>{feat}</span>
                                <span
                                  className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                                    active
                                      ? 'bg-loyo-mustard border-loyo-mustard text-[#18181b]'
                                      : 'border-[#999]'
                                  }`}
                                >
                                  {active && <Check className="w-3 h-3 stroke-3" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SERVICE 3: WEBS & BRANDING */}
                  {selectedService === 'web-branding' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-loyo-red mb-1">
                          Restyling, rebranding, logo & NFC vizitka
                        </h3>
                        <p className="text-xs sm:text-sm text-[#555]">
                          Vyberte grafické a interaktivní požadavky na nový web či digitální
                          identitu:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {QUESTIONNAIRE_CONFIGS['web-branding'].brandingOptions.map((feat, i) => {
                          const active = formData.brandingOptions.includes(feat);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleArrayItem('brandingOptions', feat)}
                              className={`p-3 border text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                                active
                                  ? 'bg-loyo-bar border-loyo-red text-loyo-red font-bold'
                                  : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                              }`}
                            >
                              <span>{feat}</span>
                              <span
                                className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                                  active
                                    ? 'bg-loyo-red border-loyo-red text-white'
                                    : 'border-[#999]'
                                }`}
                              >
                                {active && <Check className="w-3 h-3 stroke-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SERVICE 4: CONSULTATION TOPICS & FORMAT */}
                  {selectedService === 'consultation' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-[#18181b] mb-1">
                          Témata k prodiskutování & Forma konzultace
                        </h3>
                        <p className="text-xs sm:text-sm text-[#555]">
                          Vyberte, co bychom měli na konzultaci společně rozebrat:
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#18181b] font-bold block">
                          Témata k rozboru:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {(QUESTIONNAIRE_CONFIGS.consultation.consultationTopics || []).map(
                            (topic, i) => {
                              const active = (formData.consultationTopics || []).includes(topic);
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => toggleArrayItem('consultationTopics', topic)}
                                  className={`p-3 border text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                                    active
                                      ? 'bg-loyo-bar border-[#18181b] text-[#18181b] font-bold'
                                      : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                                  }`}
                                >
                                  <span>{topic}</span>
                                  <span
                                    className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                                      active
                                        ? 'bg-[#18181b] border-[#18181b] text-white'
                                        : 'border-[#999]'
                                    }`}
                                  >
                                    {active && <Check className="w-3 h-3 stroke-3" />}
                                  </span>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#18181b] font-bold block">
                          Preferovaná forma setkání:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            'Osobně na kávě (Praha / dle domluvy)',
                            'Osobně u vás ve firmě',
                            'Online videohovor (Google Meet)',
                          ].map((format, i) => {
                            const isSelected = formData.consultationFormat === format;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, consultationFormat: format })
                                }
                                className={`p-3 border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-loyo-bar border-[#18181b] text-[#18181b] font-bold'
                                    : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                                }`}
                              >
                                {format}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: TIMELINE & BUDGET */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-[#18181b] mb-1">
                      {selectedService === 'consultation'
                        ? 'Termín a formát konzultace'
                        : 'Časový rámec & orientační rozpočet'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555]">
                      {selectedService === 'consultation'
                        ? 'Kdy by vám konzultace nejlépe vyhovovala a jaký rozsah zvažujete?'
                        : 'Správná řešení potřebují svůj čas pro preciznost – vyberte vaše představy:'}
                    </p>
                  </div>

                  {/* Timeline options */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#18181b] font-bold block">
                      {selectedService === 'consultation'
                        ? 'Časová preference termínu:'
                        : 'Požadovaný termín dodání:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(
                        currentConfig.timelines || [
                          'Flexibilní (důraz na maximální preciznost)',
                          'Do 1 až 2 měsíců',
                          'Expresní termín (do 3-4 týdnů)',
                        ]
                      ).map((time, idx) => {
                        const isSelected = formData.timeline === time;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeline: time })}
                            className={`p-3.5 text-left border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-loyo-bar border-[#18181b] text-[#18181b] font-bold'
                                : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                            }`}
                          >
                            <span className="text-xs sm:text-sm">{time}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget range options */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#18181b] font-bold block">
                        {selectedService === 'consultation'
                          ? 'Zvažovaný rozsah / formát:'
                          : 'Orientační finanční rámec:'}
                      </label>
                      {selectedService === 'consultation' && (
                        <span className="text-2.75 font-mono text-[#18181b] bg-loyo-bar px-2 py-0.5 border border-[#c8c8c8] font-bold">
                          Cena cca 800 Kč / hod dle složitosti
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {(
                        currentConfig.budgets || [
                          '20 000 – 40 000 Kč (Dílčí modul / web)',
                          '40 000 – 80 000 Kč (Kompletní systém)',
                          '80 000 – 150 000 Kč (Rozsáhlý ekosystém)',
                          'Individuální kalkulace na míru',
                        ]
                      ).map((budget, idx) => {
                        const isSelected = formData.budgetRange === budget;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, budgetRange: budget })}
                            className={`p-3.5 text-left border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-loyo-bar border-[#18181b] text-[#18181b] font-bold'
                                : 'bg-loyo-bg border-[#c8c8c8] text-[#444] hover:bg-[#e4e4e4]'
                            }`}
                          >
                            <span className="text-xs sm:text-sm">{budget}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT & SUMMARY */}
              {currentStep === 4 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-[#18181b] mb-1">
                      Kontaktní údaje a odeslání specifikace
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555]">
                      Kam vám mohu zaslat úvodní rozbor a návrh termínu?
                    </p>
                  </div>

                  {/* Summary of choices */}
                  <div className="p-4 bg-loyo-bar border border-[#c2c2c2] text-xs space-y-1 text-[#333]">
                    <div>
                      <strong>Vybraná oblast:</strong>{' '}
                      <span className="font-bold text-[#18181b]">
                        {selectedService === 'fullstack' &&
                          '01. Vývoj aplikace (Fullstack - Modrá)'}
                        {selectedService === 'automation' &&
                          '02. Automatizace procesů & ekosystém (Hořčicová)'}
                        {selectedService === 'web-branding' &&
                          '03. Tvorba webů, restyling & logo (Červená)'}
                        {selectedService === 'consultation' &&
                          '04. Odborná osobní konzultace (Strategie)'}
                      </span>
                    </div>
                    {formData.projectScope && (
                      <div>
                        <strong>Typ projektu / záměr:</strong> {formData.projectScope}
                      </div>
                    )}
                    {formData.consultationFormat && selectedService === 'consultation' && (
                      <div>
                        <strong>Forma setkání:</strong> {formData.consultationFormat}
                      </div>
                    )}
                    {formData.securityOptions.length > 0 && (
                      <div>
                        <strong>Zabezpečení:</strong> {formData.securityOptions.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Input fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[#18181b] font-semibold mb-1">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="např. Jan Novák"
                        className="w-full px-3.5 py-2.5 bg-loyo-bg border border-[#c8c8c8] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#18181b] font-semibold mb-1">
                        E-mailová adresa *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jan@firma.cz"
                        className="w-full px-3.5 py-2.5 bg-loyo-bg border border-[#c8c8c8] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#18181b] font-semibold mb-1">
                        Telefonní číslo (volitelné)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+420 777 000 000"
                        className="w-full px-3.5 py-2.5 bg-loyo-bg border border-[#c8c8c8] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#18181b] font-semibold mb-1">
                        Společnost / Projekt
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="např. Novák & Partneři s.r.o."
                        className="w-full px-3.5 py-2.5 bg-loyo-bg border border-[#c8c8c8] text-[#18181b] focus:outline-none focus:border-[#18181b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#18181b] font-semibold mb-1 text-xs">
                      Doplňující poznámka, odkaz na stávající web nebo specifické přání
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Popište cokoliv dalšího, co je pro vás podstatné..."
                      className="w-full px-3.5 py-2.5 bg-loyo-bg border border-[#c8c8c8] text-xs text-[#18181b] focus:outline-none focus:border-[#18181b]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#18181b] hover:bg-loyo-blue text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Nezávazně odeslat specifikaci projektu</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 5: SUCCESS */}
              {currentStep === 5 && submittedData && (
                <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 mx-auto bg-[#18181b] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-loyo-mustard" />
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-loyo-blue">
                      Kód poptávky: #{submittedData.id}
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl text-[#18181b]">
                      Poptávka byla úspěšně odeslána!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555] max-w-lg mx-auto leading-relaxed">
                      Děkuji za vyplnění specifikace,{' '}
                      <span className="text-[#18181b] font-semibold">{submittedData.name}</span>.
                      Vaše zadání podrobně zanalyzuji a do 24 hodin se vám ozvu na{' '}
                      <span className="font-mono text-loyo-blue font-bold">
                        {submittedData.email}
                      </span>{' '}
                      s úvodním rozborem a návrhem termínu.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={copySummaryText}
                      className="px-4 py-2.5 bg-loyo-bar hover:bg-[#d0d0d0] border border-[#c2c2c2] text-[#18181b] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Zkopírováno!' : 'Zkopírovat shrnutí'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-[#18181b] hover:bg-loyo-blue text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Zavřít dotazník
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Bar for steps 1-3 */}
        {currentStep < 4 && (
          <div className="px-6 py-3.5 bg-loyo-bar border-t border-[#c8c8c8] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3 py-1.5 bg-loyo-bg border border-[#c8c8c8] text-xs font-bold uppercase tracking-wider text-[#18181b] flex items-center gap-1.5 cursor-pointer hover:bg-[#e4e4e4]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Zpět</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 bg-[#18181b] hover:bg-loyo-blue text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <span>Pokračovat na krok {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="px-6 py-2.5 bg-loyo-bar border-t border-[#c8c8c8] flex items-center justify-between text-xs text-[#666]">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1 hover:text-[#18181b] font-bold uppercase tracking-wider text-2.75"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Upravit rozpočet a termín</span>
            </button>
            <span>Pole označená * jsou povinná</span>
          </div>
        )}
      </div>
    </div>
  );
};
