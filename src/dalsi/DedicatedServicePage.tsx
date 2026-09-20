import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Workflow, 
  Code2, 
  Palette, 
  Coffee, 
  Zap, 
  ShieldCheck, 
  Check, 
  Clock, 
  Layers, 
  Database, 
  KeyRound, 
  Smartphone, 
  Mail, 
  Wifi, 
  Gamepad2,
  Gauge,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ServiceId } from '../types';
import { BigSectionLetter } from './BigSectionLetter';
import { IntegratedQuestionnaire } from './IntegratedQuestionnaire';

interface DedicatedServicePageProps {
  serviceId: ServiceId;
  onBackToHome: () => void;
}

export const DedicatedServicePage: React.FC<DedicatedServicePageProps> = ({
  serviceId,
  onBackToHome
}) => {
  // Always scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [serviceId]);

  // Security demo states for automation
  const [securityTab, setSecurityTab] = useState<'phone' | 'email' | 'nfc' | 'game'>('phone');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [nfcAuthorized, setNfcAuthorized] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [gameVerified, setGameVerified] = useState(false);

  // Time saving calculator states
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(450);

  const annualHoursSaved = hoursSavedPerWeek * 48;
  const annualSavingsCZK = annualHoursSaved * hourlyCost;

  // Jump smoothly to the embedded questionnaire
  const scrollToQuestionnaire = () => {
    const el = document.getElementById('dotaznik-sekce');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#18181b] pt-20 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 py-4 mb-6 border-b border-[#c8c8c8]">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#dbdbdb] hover:bg-[#18181b] hover:text-white border border-[#c2c2c2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Zpět na hlavní přehled</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToQuestionnaire}
              className="px-3.5 py-2 bg-[#18181b] text-white hover:bg-[#040b8d] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Přeskočit na dotazník</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 01. AUTOMATIZACE SPECIFIC CONTENT */}
        {/* ========================================================================= */}
        {serviceId === 'automation' && (
          <div className="space-y-12">
            {/* Header */}
            <BigSectionLetter
              letter="A"
              fillColor="#040b8d"
              number="01"
              title="AUTOMATIZACE"
              subtitle="Chytrá propojení systémů, úspora desítek hodin a zakázkové zabezpečení"
              tagText="MODRÁ SPECIALIZACE"
            />

            {/* In-depth feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Rozsah */}
              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#040b8d] mb-2">
                  <Workflow className="w-4 h-4" />
                  <span>Rozsah implementace</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Od 1 procesu po celou firmu
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Začněte klidně jednoduchou synchronizací objednávek nebo skladových zásob. Kdykoliv později lze architekturu rozšířit na kompletní automatizovaný ekosystém bez nutnosti přepisovat kód.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ REST API • Webhooks • Integromat/Make • Custom Node skripty
                </div>
              </div>

              {/* Card 2: AI Zapojení */}
              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#040b8d] mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Inteligentní AI pipeline</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Automatické zpracování dat
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Zapojte moderní jazykové modely pro automatické třídění e-mailů, vytěžování faktur, generování souhrnů schůzek a asistenci vašim operátorům v reálném čase.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Vytěžování PDF • Chytrá kategorizace • 0 chyb v datech
                </div>
              </div>

              {/* Card 3: Nezávislost */}
              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#040b8d] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garance spolehlivosti</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  100% Nezávislost & vlastnictví
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Automatizační skripty a integrační můstky běží na vaší infrastruktuře. Žádné závislosti na drahých předplatných a nečekaných výpadcích cizích platforem.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Kompletní dokumentace • Monitoring • Zaškolení týmu
                </div>
              </div>

            </div>

            {/* Interactive Time & Cost Savings Calculator */}
            <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 sm:p-8 shadow-xs">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ededed] border border-[#c2c2c2] text-xs font-mono font-bold uppercase text-[#040b8d] mb-2">
                  <span>KALKULAČKA FINANČNÍ NÁVRATNOSTI</span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#18181b]">
                  Kolik hodin a peněz ušetříte správnou automatizací?
                </h3>
                <p className="text-xs sm:text-sm text-[#444] mt-1 leading-relaxed">
                  Posuňte táhla níže a zjistěte, kolik času a firemních nákladů ušetříte eliminací manuální rutiny.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
                {/* Sliders Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold text-[#18181b] mb-1">
                      <span>UŠETŘENÉ HODINY TÝDNĚ PRO CELÝ TÝM:</span>
                      <span className="text-[#040b8d] text-sm">{hoursSavedPerWeek} hodin / týdně</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={80}
                      step={5}
                      value={hoursSavedPerWeek}
                      onChange={(e) => setHoursSavedPerWeek(Number(e.target.value))}
                      className="w-full accent-[#040b8d] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#666] mt-0.5">
                      <span>5 hod (dílčí proces)</span>
                      <span>40 hod (1 plný úvazek)</span>
                      <span>80 hod (celý tým)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold text-[#18181b] mb-1">
                      <span>PRŮMĚRNÁ HODINOVÁ MZDA / NÁKLAD PRACOVNÍKA:</span>
                      <span className="text-[#040b8d] text-sm">{hourlyCost} Kč / hod</span>
                    </div>
                    <input
                      type="range"
                      min={250}
                      max={1000}
                      step={50}
                      value={hourlyCost}
                      onChange={(e) => setHourlyCost(Number(e.target.value))}
                      className="w-full accent-[#040b8d] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#666] mt-0.5">
                      <span>250 Kč/h</span>
                      <span>500 Kč/h</span>
                      <span>1000 Kč/h</span>
                    </div>
                  </div>
                </div>

                {/* Result Column */}
                <div className="lg:col-span-5 bg-[#ededed] border border-[#c2c2c2] p-5 space-y-4 text-center">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#666] block">
                      ROČNÍ ÚSPORA ČASU:
                    </span>
                    <span className="font-heading font-black text-3xl sm:text-4xl text-[#040b8d] block mt-0.5">
                      {annualHoursSaved.toLocaleString('cs-CZ')} hodin
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#d5d5d5]">
                    <span className="font-mono text-[10px] uppercase text-[#666] block">
                      ROČNÍ FINANČNÍ ÚSPORA VAŠÍ FIRMY:
                    </span>
                    <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-700 block mt-0.5">
                      {annualSavingsCZK.toLocaleString('cs-CZ')} Kč
                    </span>
                  </div>

                  <p className="text-[11px] text-[#555] italic">
                    Investice do automatizace se ve většině případů zaplatí již během prvních 2 až 3 měsíců.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Security & Custom Auth Demo */}
            <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ededed] border border-[#c2c2c2] text-xs font-mono font-bold uppercase text-[#040b8d] mb-2">
                  <span>INTERAKTIVNÍ DEMO ZABEZPEČENÍ</span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#18181b]">
                  Zakázkové metody autentizace a přihlašování
                </h3>
                <p className="text-xs sm:text-sm text-[#444] mt-1 max-w-3xl leading-relaxed">
                  Vyzkoušejte si níže funkční prototypy jednotlivých metod přihlášení, které vám mohu do systému zakomponovat.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[#c2c2c2] pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => setSecurityTab('phone')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'phone' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#444] hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>1. Mobilní ověření</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('email')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'email' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#444] hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>2. Magický e-mail link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('nfc')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'nfc' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#444] hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>3. NFC čip / karta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('game')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'game' ? 'bg-[#040b8d] text-white' : 'bg-[#ededed] text-[#444] hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>4. Gamifikované ověření</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="bg-[#ededed] border border-[#c2c2c2] p-6 max-w-xl">
                {securityTab === 'phone' && (
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-bold uppercase text-[#040b8d] block">
                      Ověření SMS kódem nebo mobilním tokenem
                    </span>
                    <p className="text-xs text-[#555]">
                      Zadejte testovací ověřovací kód (např. <strong>8492</strong>):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        placeholder="8492"
                        className="px-3 py-2 bg-white border border-[#c2c2c2] font-mono text-center text-base tracking-widest w-32"
                      />
                      <button
                        type="button"
                        onClick={() => setPhoneVerified(phoneCode === '8492')}
                        className="px-4 py-2 bg-[#040b8d] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                      >
                        Ověřit kód
                      </button>
                    </div>
                    {phoneVerified && (
                      <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Identita úspěšně ověřena přes mobilní zařízení!</span>
                      </div>
                    )}
                  </div>
                )}

                {securityTab === 'email' && (
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-bold uppercase text-[#040b8d] block">
                      Jednorázový magický link bez hesla
                    </span>
                    <p className="text-xs text-[#555]">
                      Uživatel nemusí pamatovat žádné heslo. Kliknutím níže simulujete doručení a autorizaci linku:
                    </p>
                    <button
                      type="button"
                      onClick={() => setEmailVerified(true)}
                      className="px-4 py-2 bg-[#040b8d] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                    >
                      Ověřit jednorázový token linku
                    </button>
                    {emailVerified && (
                      <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Kryptografický e-mailový token ověřen. Přístup povolen.</span>
                      </div>
                    )}
                  </div>
                )}

                {securityTab === 'nfc' && (
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-bold uppercase text-[#040b8d] block">
                      Autorizace fyzickou NFC kartou nebo přívěskem
                    </span>
                    <p className="text-xs text-[#555]">
                      Ideální pro fyzické terminály, skladníky nebo operátory v kanceláři:
                    </p>
                    <button
                      type="button"
                      onClick={() => setNfcAuthorized(true)}
                      className="px-4 py-2 bg-[#040b8d] text-white font-mono text-xs font-bold uppercase cursor-pointer flex items-center gap-2"
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      <span>Simulovat přiložení NFC čipu #4891-B</span>
                    </button>
                    {nfcAuthorized && (
                      <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Hardware čip UID: 04:A2:88:1C úspěšně autorizován.</span>
                      </div>
                    )}
                  </div>
                )}

                {securityTab === 'game' && (
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-bold uppercase text-[#040b8d] block">
                      Grafická / gamifikovaná autentizace
                    </span>
                    <p className="text-xs text-[#555]">
                      Vyberte správnou geometrickou kombinaci pro odemčení přístupu:
                    </p>
                    <div className="flex gap-3">
                      {['KRUH', 'TROJÚHELNÍK', 'ČTVEREC'].map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => {
                            setGameCode(shape);
                            setGameVerified(shape === 'ČTVEREC');
                          }}
                          className={`px-3 py-2 border text-xs font-mono font-bold cursor-pointer ${
                            gameCode === shape ? 'bg-[#040b8d] text-white border-[#040b8d]' : 'bg-white text-[#333] border-[#c2c2c2]'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                    {gameVerified && (
                      <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Bezpečnostní vzor souhlasí! Přihlášeno.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* INTEGRATED QUESTIONNAIRE AT THE BOTTOM */}
            <IntegratedQuestionnaire serviceId="automation" />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 02. APLIKACE SPECIFIC CONTENT */}
        {/* ========================================================================= */}
        {serviceId === 'fullstack' && (
          <div className="space-y-12">
            {/* Header */}
            <BigSectionLetter
              letter="A"
              fillColor="#CDA24D"
              number="02"
              title="APLIKACE"
              subtitle="Zakázkový full-stack vývoj, 100% nezávislý čistý kód a komplexní backend"
              tagText="ZLATÁ SPECIALIZACE"
            />

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#8a6b28] mb-2">
                  <Code2 className="w-4 h-4" />
                  <span>Čistý kód</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  100% Nezávislost & vlastnictví
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Žádný vendor lock-in. Všechny zdrojové kódy, repozitáře, databázové struktury i přístupy jsou vaším výhradním majetkem od prvního commitu.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ TypeScript • React / Node.js • Nezávislost na platformách
                </div>
              </div>

              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#8a6b28] mb-2">
                  <Database className="w-4 h-4" />
                  <span>Komplexní backend</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Architektura na míru
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Promyšlený relační databázový model, bleskové API, cachování dotazů a bezpečnostní vrstvy, které s přehledem obslouží tisíce aktivních uživatelů.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ SQL / PostgreSQL • JWT ověření • Real-time WebSockets
                </div>
              </div>

              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#8a6b28] mb-2">
                  <Layers className="w-4 h-4" />
                  <span>Intuitivní rozhraní</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Plynulé ovládání bez čekání
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Uživatelské rozhraní stavěné na míru vašim zaměstnancům nebo klientům. Žádné zbytečné klikání navíc – vše je logické, rychlé a responzivní na každém zařízení.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Responzivní design • Okamžitá odezva • Role a oprávnění
                </div>
              </div>
            </div>

            {/* Architecture Comparison Table */}
            <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="text-xs font-mono font-bold uppercase text-[#8a6b28] block mb-1">
                  SROVNÁNÍ PŘÍSTUPŮ
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#18181b]">
                  Krabicové šablony vs. Zakázkový čistý kód
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#18181b] bg-[#ededed]">
                      <th className="p-3 uppercase text-[#666]">Vlastnost</th>
                      <th className="p-3 uppercase text-[#8a6b28] font-black">LoYo Vývoj na míru</th>
                      <th className="p-3 uppercase text-[#666]">Krabicové SaaS / No-Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c2c2c2]">
                    <tr>
                      <td className="p-3 font-bold text-[#18181b]">Vlastnictví kódu</td>
                      <td className="p-3 font-bold text-[#8a6b28]">100 % vaše výhradní vlastnictví</td>
                      <td className="p-3 text-[#777]">Pronájem, nemůžete kód exportovat</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#18181b]">Měsíční licenční poplatky</td>
                      <td className="p-3 font-bold text-emerald-700">0 Kč (pouze vaše levný hosting)</td>
                      <td className="p-3 text-[#777]">Desítky tisíc ročně za uživatelské účty</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#18181b]">Rychlost a odezva</td>
                      <td className="p-3 font-bold text-[#8a6b28]">Blesková pod 100 ms</td>
                      <td className="p-3 text-[#777]">Těžkopádné, pomalé načítání</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#18181b]">Přizpůsobení logiky</td>
                      <td className="p-3 font-bold text-[#8a6b28]">Neomezené – cokoliv téměř</td>
                      <td className="p-3 text-[#777]">Omezené mantinely šablony</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTEGRATED QUESTIONNAIRE AT THE BOTTOM */}
            <IntegratedQuestionnaire serviceId="fullstack" />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 03. TVORBA SPECIFIC CONTENT */}
        {/* ========================================================================= */}
        {serviceId === 'web-branding' && (
          <div className="space-y-12">
            {/* Header */}
            <BigSectionLetter
              letter="T"
              fillColor="#ac0001"
              number="03"
              title="TVORBA"
              subtitle="Restyling stávajících webů, unikátní design od čistého listu a 60 FPS animace"
              tagText="ČERVENÁ SPECIALIZACE"
            />

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#ac0001] mb-2">
                  <Palette className="w-4 h-4" />
                  <span>Hloubkový restyling</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Oživení zastaralého webu
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Vezmeme váš stávající obsah a přetavíme ho do suverénní moderní podoby. Odstraníme balast, zrychlíme načítání a vytvoříme vizuál hodný roku 2026.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Zachování SEO pozic • Čistý kód • Moderní typografie
                </div>
              </div>

              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#ac0001] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Vlastní podoba stránky</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Návrh přímo podle vaší vize
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Žádné prefabrikované šablony z WordPressu, které mají stovky dalších webů. Vytvořím unikátní vizuální jazyk navržený od prvního pixelu přímo pro váš obor.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Unikátní rozvržení • Vektorová loga • Přehledná hierarchie
                </div>
              </div>

              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#ac0001] mb-2">
                  <Gauge className="w-4 h-4" />
                  <span>Dynamické animace</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Plynulých 60 snímků za sekundu
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Kinetické titulky, plynulé přechody sekcí a elegantní mikrointerakce při najetí myší. Web okamžitě upoutá a zanechá dojem špičkové řemeslné práce.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Náběh pod 0.8s • Skóre 95+ v PageSpeed • Mobilní optimalizace
                </div>
              </div>
            </div>

            {/* INTEGRATED QUESTIONNAIRE AT THE BOTTOM */}
            <IntegratedQuestionnaire serviceId="web-branding" />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 04. KONZULTACE SPECIFIC CONTENT */}
        {/* ========================================================================= */}
        {serviceId === 'consultation' && (
          <div className="space-y-12">
            {/* Header */}
            <BigSectionLetter
              letter="K"
              fillColor="#18181b"
              number="04"
              title="KONZULTACE"
              subtitle="Osobní odborné poradenství 1 na 1, technická oponentura a ochrana rozpočtu"
              tagText="OSOBNÍ KONZULTACE"
            />

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#18181b] mb-2">
                  <Coffee className="w-4 h-4" />
                  <span>Osobně i online</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  1 na 1 u kávy nebo videohovoru
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Přímý kontakt bez projektových manažerů či obchodníků. Sejdeme se v příjemné kavárně nebo se spojíme přes Google Meet. Věcná diskuze zaměřená na konkrétní výsledky.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Praha & celá ČR • Flexibilní termíny • Férové jednání
                </div>
              </div>

              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#18181b] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Záchrana rozpočtu</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  MVP plán před kódováním
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Než začnete utrácet statisíce za nákladný vývoj, ověříme technickou proveditelnost. Navrhnu nejkratší a nejlevnější cestu k funkčnímu prvnímu prototypu.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Eliminace slepých uliček • Sazba ~800 Kč/hod • Úspora peněz
                </div>
              </div>

              <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#18181b] mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Předání know-how</span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#18181b]">
                  Plná podpora & zaškolení
                </h3>
                <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                  Nezůstanete v nevědomosti. Vysvětlím vám, jak váš systém funguje, jak do něj bezpečně zapojit AI nástroje a jak jej udržovat bez nutnosti platit drahé externí agentury.
                </p>
                <div className="mt-4 pt-3 border-t border-[#c2c2c2] text-[11px] font-mono text-[#555]">
                  ✓ Architektonické schéma • Záznam hovoru • Písemný souhrn
                </div>
              </div>
            </div>

            {/* INTEGRATED QUESTIONNAIRE AT THE BOTTOM */}
            <IntegratedQuestionnaire serviceId="consultation" />
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-[#c8c8c8] flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white hover:bg-[#040b8d] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Zpět na hlavní přehled</span>
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-mono font-bold text-[#666] hover:text-[#18181b] uppercase cursor-pointer"
          >
            Nahoru ↑
          </button>
        </div>

      </div>
    </div>
  );
};
