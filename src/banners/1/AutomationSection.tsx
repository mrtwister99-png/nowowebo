import React, { useState } from 'react';
import { 
  Cpu, 
  Coins, 
  CheckCircle2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  HardDrive, 
  Cloud, 
  Lock, 
  KeyRound, 
  Smartphone, 
  Mail, 
  Wifi, 
  Gamepad2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ServiceId } from '../../types';

interface AutomationSectionProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

export const AutomationSection: React.FC<AutomationSectionProps> = ({ 
  isExpanded: controlledExpanded,
  onToggleExpand: controlledToggle,
  onOpenQuestionnaire 
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanding(true);
      setTimeout(() => {
        setIsExpanding(false);
        if (controlledToggle) {
          controlledToggle();
        } else {
          setInternalExpanded(true);
        }
      }, 350);
    } else {
      if (controlledToggle) {
        controlledToggle();
      } else {
        setInternalExpanded(false);
      }
    }
  };

  // Interaktivní security demo v rozbaleném stavu
  const [securityTab, setSecurityTab] = useState<'phone' | 'email' | 'nfc' | 'game'>('phone');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [nfcAuthorized, setNfcAuthorized] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [gameVerified, setGameVerified] = useState(false);

  return (
    <section id="automatizace" className="py-14 sm:py-16 bg-[#ededed] text-[#18181b] border-b border-[#d0d0d0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: 01. PILÍŘ • MODRÁ #040b8d */}
        <div className="border-l-4 border-[#040b8d] pl-5 sm:pl-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#040b8d] text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              01. PILÍŘ • MODRÁ
            </span>
            <span className="text-xs font-mono text-[#040b8d] font-bold">#040b8d</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#040b8d] tracking-tight">
            Automatizace v čemkoliv (Procesy & Ekosystém)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#333] max-w-3xl leading-relaxed">
            Hloubková analýza a propojení celého firemního i osobního ekosystému. Od odstranění zdlouhavých manuálních úloh pro jednotlivce až po <strong>komplexní firemní systém se vším všudy</strong> – včetně lokálního či cloudového úložiště a zabezpečení.
          </p>
        </div>

        {/* Hlavní karta se 3 jasnými body */}
        <div className="bg-[#dbdbdb] border-2 border-[#040b8d] p-6 sm:p-8 shadow-xs">
          
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#040b8d] font-bold block mb-1">
              3 hlavní pilíře automatizace:
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#18181b]">
              Konec přepisování dat a zbytečné manuální práce
            </h3>
          </div>

          {/* 3 JASNÉ BODY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* Bod 1 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#040b8d] text-white flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Úspora 15–40 hodin týdně
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Okamžité vyřazení zdlouhavého ručního přepisování faktur, třídění e-mailů a nekonečné administrativy. Čas vašich lidí je nejcennější investice.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#040b8d] font-bold">
                Okamžitá finanční návratnost
              </div>
            </div>

            {/* Bod 2 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#040b8d] text-white flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Propojení celého ekosystému
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Hladká synchronizace mezi e-maily, účetnictvím, kalendáři, sklady i interními nástroji. Data proudí sama tam, kam patří, bez chyb a zpoždění.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#040b8d] font-bold">
                Lokální i cloudová úložiště
              </div>
            </div>

            {/* Bod 3 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#040b8d] text-white flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Zabezpečení & Autentizace na míru
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Ochrana přístupů přesně podle vašich preferencí: mobil (SMS), autorizační e-mail, fyzická NFC karta, nebo dokonce interaktivní kódová minihra.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#040b8d] font-bold">
                Bezpečnost na enterprise úrovni
              </div>
            </div>
          </div>

          {/* SPODNÍ LIŠTA: V PRAVO DOLE TLAČÍTKO "ZJISTIT VÍCE" */}
          <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <span className="w-2 h-2 rounded-full bg-[#040b8d]" />
              <span>Modrá sekce • Kompletní audit & návrh procesů na míru</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenQuestionnaire('automation')}
                className="px-4 py-2 bg-[#ededed] hover:bg-[#e0e0e0] border border-[#040b8d] text-[#040b8d] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                id="btn-automation-dotaznik-preview"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dotazník pro automatizaci</span>
              </button>

              <button
                onClick={handleToggle}
                disabled={isExpanding}
                className="px-5 py-2.5 bg-[#040b8d] hover:bg-[#030869] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-80"
                id="btn-automation-toggle-details"
              >
                {isExpanding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Načítání...</span>
                  </>
                ) : (
                  <>
                    <span>{isExpanded ? 'Sbalit detaily' : 'Zjistit více'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* SKELETON LOADING VIEW WHEN EXPANDING */}
        {isExpanding && (
          <div className="mt-8 bg-[#ededed] border-2 border-[#040b8d] p-6 sm:p-8 space-y-6 animate-pulse">
            <div className="flex items-center justify-between pb-4 border-b border-[#c8c8c8]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#040b8d] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs font-bold text-[#040b8d] uppercase tracking-wider">
                  Inicializace detailní specifikace a interaktivních modulů...
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#777]">01. AUTOMATIZACE</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-28 bg-[#dbdbdb] p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
              <div className="h-28 bg-[#dbdbdb] p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
              <div className="h-28 bg-[#dbdbdb] p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
            </div>

            <div className="h-36 bg-[#dbdbdb] p-5 space-y-3 border border-[#ccc]">
              <div className="h-4 w-44 bg-[#b8b8b8] rounded-xs" />
              <div className="h-3 w-full bg-[#cecece] rounded-xs" />
              <div className="h-3 w-4/5 bg-[#cecece] rounded-xs" />
            </div>
          </div>
        )}

        {/* ROZBALENÉ DETAILY (Když uživatel klikne na "Zjistit více") */}
        {isExpanded && (
          <div className="mt-8 bg-[#ededed] border-2 border-[#040b8d] p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Finanční dopad a úspora */}
            <div className="bg-[#dbdbdb] border border-[#c2c2c2] p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#040b8d] text-white text-[11px] font-mono font-bold uppercase">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Finanční efektivita</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#18181b]">
                  Ušetření desítek hodin týdně = okamžitá návratnost investice
                </h4>
                <p className="text-xs sm:text-sm text-[#444] max-w-2xl leading-relaxed">
                  Čas strávený ručním dohledáváním příloh, kopírováním kontaktů nebo ověřováním stavu objednávek stojí reálné peníze. Automatizace tyto procesy zkrátí z hodin na milisekundy.
                </p>
              </div>

              <div className="bg-[#ededed] p-4 border border-[#c2c2c2] text-center min-w-[200px]">
                <span className="font-mono text-[10px] uppercase text-[#666] block">Průměrná úspora</span>
                <span className="font-heading font-black text-2xl text-[#040b8d]">15–40 hod / týdně</span>
                <span className="text-[10px] text-[#555] block mt-0.5">Uvolněné ruce pro ziskový byznys</span>
              </div>
            </div>

            {/* 2. 3 etapy: Od malého po komplexní */}
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#040b8d] font-bold block mb-2">
                Postup integrace:
              </span>
              <h4 className="font-heading font-bold text-lg text-[#18181b] mb-4">
                Plynulá cesta od izolovaných úkolů k živému firemnímu ekosystému
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#dbdbdb] border border-[#c2c2c2]">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">FÁZE 01</span>
                  <h5 className="font-heading font-bold text-sm text-[#18181b] mt-1 mb-2">
                    Samostatné procesy
                  </h5>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Automatické stahování faktur, generování přehledů, odesílání potvrzení klientům, synchronizace kalendářů.
                  </p>
                </div>

                <div className="p-4 bg-[#dbdbdb] border border-[#c2c2c2]">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">FÁZE 02</span>
                  <h5 className="font-heading font-bold text-sm text-[#18181b] mt-1 mb-2">
                    Hloubkový výzkum procesů
                  </h5>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Analýza firemních slabých míst, kde dochází ke zbytečným prodlevám a chybovosti. Návrh optimální architektury.
                  </p>
                </div>

                <div className="p-4 bg-[#dbdbdb] border border-[#c2c2c2]">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">FÁZE 03</span>
                  <h5 className="font-heading font-bold text-sm text-[#18181b] mt-1 mb-2">
                    Propojený ekosystém
                  </h5>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Kompletní systém pro zaměstnance se zabezpečeným přihlášením, šifrovanými daty a automatickým zálohováním.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Interaktivní demonstrace zabezpečení (SMS 1235, Mail 1236, NFC, Hra 1237) */}
            <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#c2c2c2]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#040b8d] font-bold block">
                    Interaktivní ukázka zabezpečení:
                  </span>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#18181b]">
                    Vyzkoušejte si různé metody ověření a ochrany
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSecurityTab('phone')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
                      securityTab === 'phone' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#18181b]'
                    }`}
                  >
                    Telefon SMS (1235)
                  </button>
                  <button
                    onClick={() => setSecurityTab('email')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
                      securityTab === 'email' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#18181b]'
                    }`}
                  >
                    E-mail (1236)
                  </button>
                  <button
                    onClick={() => setSecurityTab('nfc')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
                      securityTab === 'nfc' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#18181b]'
                    }`}
                  >
                    NFC Karta
                  </button>
                  <button
                    onClick={() => setSecurityTab('game')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
                      securityTab === 'game' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#18181b]'
                    }`}
                  >
                    Mini Hra (1237)
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-[#ededed] p-4 sm:p-5 border border-[#c2c2c2]">
                {/* 1. Phone SMS */}
                {securityTab === 'phone' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <Smartphone className="w-4 h-4 text-[#040b8d]" />
                      <span>Dvoufaktorová SMS autorizace. Testovací kód je: <strong className="text-[#040b8d] font-mono">1235</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={phoneCode}
                        onChange={(e) => {
                          setPhoneCode(e.target.value);
                          if (e.target.value === '1235') setPhoneVerified(true);
                          else setPhoneVerified(false);
                        }}
                        placeholder="Zadejte kód (1235)"
                        className="bg-[#dbdbdb] border border-[#b8b8b8] px-3 py-1.5 text-xs font-mono text-[#18181b] w-44 focus:outline-none focus:border-[#040b8d]"
                      />
                      {phoneVerified && (
                        <span className="px-2.5 py-1 bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>OVĚŘENO</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Email */}
                {securityTab === 'email' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <Mail className="w-4 h-4 text-[#040b8d]" />
                      <span>Jednorázový autorizační kód do schránky. Testovací kód je: <strong className="text-[#040b8d] font-mono">1236</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => {
                          setEmailCode(e.target.value);
                          if (e.target.value === '1236') setEmailVerified(true);
                          else setEmailVerified(false);
                        }}
                        placeholder="Zadejte kód (1236)"
                        className="bg-[#dbdbdb] border border-[#b8b8b8] px-3 py-1.5 text-xs font-mono text-[#18181b] w-44 focus:outline-none focus:border-[#040b8d]"
                      />
                      {emailVerified && (
                        <span className="px-2.5 py-1 bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PŘÍSTUP POVOLEN</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. NFC Karta */}
                {securityTab === 'nfc' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <Wifi className="w-4 h-4 text-[#040b8d]" />
                      <span>Fyzické přiložení NFC čipu nebo firemní karty ke čtečce.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setNfcAuthorized(true)}
                        className="px-4 py-2 bg-[#18181b] hover:bg-[#040b8d] text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        Přiložit testovací kartu
                      </button>
                      {nfcAuthorized && (
                        <span className="px-2.5 py-1 bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>NFC KARTA NAČTENA • AUTORIZOVÁNO</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Mini Hra */}
                {securityTab === 'game' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <Gamepad2 className="w-4 h-4 text-[#040b8d]" />
                      <span>Unikátní bezpečnostní hádanka. Vítězný přístupový kód je: <strong className="text-[#040b8d] font-mono">1237</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={gameCode}
                        onChange={(e) => {
                          setGameCode(e.target.value);
                          if (e.target.value === '1237') setGameVerified(true);
                          else setGameVerified(false);
                        }}
                        placeholder="Zadejte kód (1237)"
                        className="bg-[#dbdbdb] border border-[#b8b8b8] px-3 py-1.5 text-xs font-mono text-[#18181b] w-44 focus:outline-none focus:border-[#040b8d]"
                      />
                      {gameVerified && (
                        <span className="px-2.5 py-1 bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ÚROVEŇ DOKONČENA • SYSTÉM OTEVŘEN</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Úložiště a zálohy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#dbdbdb] border border-[#c2c2c2] flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-[#040b8d] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-heading font-bold text-sm text-[#18181b]">
                    Lokální privátní úložiště
                  </h5>
                  <p className="text-xs text-[#555] mt-1">
                    Vaše citlivá data nemusí opustit vaše kanceláře. Systém umí běžet na vašem vlastním lokálním serveru.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#dbdbdb] border border-[#c2c2c2] flex items-start gap-3">
                <Cloud className="w-5 h-5 text-[#040b8d] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-heading font-bold text-sm text-[#18181b]">
                    Šifrovaný bezpečný cloud
                  </h5>
                  <p className="text-xs text-[#555] mt-1">
                    Zabezpečený přístup odkudkoliv ze světa s automatickým zálohováním v reálném čase.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA v rozbaleném stavu */}
            <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-heading font-bold text-sm text-[#18181b] block">
                  Chcete ušetřit desítky hodin ve vaší firmě?
                </span>
                <span className="text-xs text-[#666]">
                  Vyplňte krátký dotazník pro automatizaci procesů na míru.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenQuestionnaire('automation')}
                  className="px-5 py-2.5 bg-[#040b8d] hover:bg-[#030869] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dotazník pro automatizaci</span>
                </button>
                <button
                  onClick={handleToggle}
                  className="px-4 py-2 bg-[#dbdbdb] hover:bg-[#d0d0d0] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Sbalit</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
