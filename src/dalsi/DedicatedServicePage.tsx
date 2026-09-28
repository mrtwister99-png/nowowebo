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
  Layers,
  Database,
  Smartphone,
  Mail,
  Wifi,
  Gamepad2,
  Gauge,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { ServiceId } from '../types';
import { BigSectionLetter } from './BigSectionLetter';
import { IntegratedQuestionnaire } from './IntegratedQuestionnaire';
import { BRAND } from '../lib/colors';
import { Button } from '../components/ui/Button';
import { Card, CardEyebrow, CardNote, CardText, CardTitle } from '../components/ui/Card';

interface DedicatedServicePageProps {
  serviceId: ServiceId;
  onBackToHome: () => void;
}

export const DedicatedServicePage: React.FC<DedicatedServicePageProps> = ({
  serviceId,
  onBackToHome,
}) => {
  // Always scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [serviceId]);

  // Security demo states for automation
  const [securityTab, setSecurityTab] = useState<'phone' | 'email' | 'nfc' | 'game'>('phone');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
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
    <div className="min-h-screen bg-transparent text-loyo-ink pt-20 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 py-4 mb-6 border-b border-loyo-line-field">
          <Button
            variant="secondary"
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Zpět na hlavní přehled</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={scrollToQuestionnaire}
              className="flex items-center gap-1.5"
            >
              <span>Přeskočit na dotazník</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
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
              wordRemainder="UTOMATIZACE"
              fillColor={BRAND.blue}
              subtitle="Chytrá propojení systémů, úspora desítek hodin a zakázkové zabezpečení • MODRÁ SPECIALIZACE"
            />

            {/* In-depth feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Rozsah */}
              <Card>
                <CardEyebrow tone="blue">
                  <Workflow className="w-4 h-4" />
                  <span>Rozsah implementace</span>
                </CardEyebrow>
                <CardTitle>Od 1 procesu po celou firmu</CardTitle>
                <CardText>
                  Začněte klidně jednoduchou synchronizací objednávek nebo skladových zásob.
                  Kdykoliv později lze architekturu rozšířit na kompletní automatizovaný ekosystém
                  bez nutnosti přepisovat kód.
                </CardText>
                <CardNote>✓ REST API • Webhooks • Integromat/Make • Custom Node skripty</CardNote>
              </Card>

              {/* Card 2: AI Zapojení */}
              <Card>
                <CardEyebrow tone="blue">
                  <Zap className="w-4 h-4" />
                  <span>Inteligentní AI pipeline</span>
                </CardEyebrow>
                <CardTitle>Automatické zpracování dat</CardTitle>
                <CardText>
                  Zapojte moderní jazykové modely pro automatické třídění e-mailů, vytěžování
                  faktur, generování souhrnů schůzek a asistenci vašim operátorům v reálném čase.
                </CardText>
                <CardNote>✓ Vytěžování PDF • Chytrá kategorizace • 0 chyb v datech</CardNote>
              </Card>

              {/* Card 3: Nezávislost */}
              <Card>
                <CardEyebrow tone="blue">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garance spolehlivosti</span>
                </CardEyebrow>
                <CardTitle>100% Nezávislost & vlastnictví</CardTitle>
                <CardText>
                  Automatizační skripty a integrační můstky běží na vaší infrastruktuře. Žádné
                  závislosti na drahých předplatných a nečekaných výpadcích cizích platforem.
                </CardText>
                <CardNote>✓ Kompletní dokumentace • Monitoring • Zaškolení týmu</CardNote>
              </Card>
            </div>

            {/* Interactive Time & Cost Savings Calculator */}
            <div className="bg-loyo-bar border-2 border-loyo-ink p-6 sm:p-8 shadow-xs">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bg border border-loyo-line text-xs font-mono font-bold uppercase text-loyo-blue mb-2">
                  <span>KALKULAČKA FINANČNÍ NÁVRATNOSTI</span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-loyo-ink">
                  Kolik hodin a peněz ušetříte správnou automatizací?
                </h3>
                <p className="text-xs sm:text-sm text-loyo-body mt-1 leading-relaxed">
                  Posuňte táhla níže a zjistěte, kolik času a firemních nákladů ušetříte eliminací
                  manuální rutiny.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
                {/* Sliders Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold text-loyo-ink mb-1">
                      <span>UŠETŘENÉ HODINY TÝDNĚ PRO CELÝ TÝM:</span>
                      <span className="text-loyo-blue text-sm">
                        {hoursSavedPerWeek} hodin / týdně
                      </span>
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
                    Investice do automatizace se ve většině případů zaplatí již během prvních 2 až 3
                    měsíců.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Security & Custom Auth Demo */}
            <div className="bg-loyo-bar border-2 border-loyo-ink p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bg border border-loyo-line text-xs font-mono font-bold uppercase text-loyo-blue mb-2">
                  <span>INTERAKTIVNÍ DEMO ZABEZPEČENÍ</span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-loyo-ink">
                  Zakázkové metody autentizace a přihlašování
                </h3>
                <p className="text-xs sm:text-sm text-loyo-body mt-1 max-w-3xl leading-relaxed">
                  Vyzkoušejte si níže funkční prototypy jednotlivých metod přihlášení, které vám
                  mohu do systému zakomponovat.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-loyo-line pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => setSecurityTab('phone')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'phone'
                      ? 'bg-loyo-blue text-white'
                      : 'bg-loyo-bg text-loyo-body hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>1. Mobilní ověření</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('email')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'email'
                      ? 'bg-loyo-blue text-white'
                      : 'bg-loyo-bg text-loyo-body hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>2. Magický e-mail link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('nfc')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'nfc'
                      ? 'bg-loyo-blue text-white'
                      : 'bg-loyo-bg text-loyo-body hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>3. NFC čip / karta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('game')}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    securityTab === 'game'
                      ? 'bg-loyo-blue text-white'
                      : 'bg-loyo-bg text-loyo-body hover:bg-[#e0e0e0]'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>4. Gamifikované ověření</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="bg-loyo-bg border border-loyo-line p-6 max-w-xl">
                {securityTab === 'phone' && (
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-bold uppercase text-loyo-blue block">
                      Ověření SMS kódem nebo mobilním tokenem
                    </span>
                    <p className="text-xs text-loyo-muted">
                      Zadejte testovací ověřovací kód (např. <strong>8492</strong>):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        placeholder="8492"
                        className="px-3 py-2 bg-white border border-loyo-line font-mono text-center text-base tracking-widest w-32"
                      />
                      <button
                        type="button"
                        onClick={() => setPhoneVerified(phoneCode === '8492')}
                        className="px-4 py-2 bg-loyo-blue text-white font-mono text-xs font-bold uppercase cursor-pointer"
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
                    <span className="font-mono text-xs font-bold uppercase text-loyo-blue block">
                      Jednorázový magický link bez hesla
                    </span>
                    <p className="text-xs text-loyo-muted">
                      Uživatel nemusí pamatovat žádné heslo. Kliknutím níže simulujete doručení a
                      autorizaci linku:
                    </p>
                    <button
                      type="button"
                      onClick={() => setEmailVerified(true)}
                      className="px-4 py-2 bg-loyo-blue text-white font-mono text-xs font-bold uppercase cursor-pointer"
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
                    <span className="font-mono text-xs font-bold uppercase text-loyo-blue block">
                      Autorizace fyzickou NFC kartou nebo přívěskem
                    </span>
                    <p className="text-xs text-loyo-muted">
                      Ideální pro fyzické terminály, skladníky nebo operátory v kanceláři:
                    </p>
                    <button
                      type="button"
                      onClick={() => setNfcAuthorized(true)}
                      className="px-4 py-2 bg-loyo-blue text-white font-mono text-xs font-bold uppercase cursor-pointer flex items-center gap-2"
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
                    <span className="font-mono text-xs font-bold uppercase text-loyo-blue block">
                      Grafická / gamifikovaná autentizace
                    </span>
                    <p className="text-xs text-loyo-muted">
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
                            gameCode === shape
                              ? 'bg-loyo-blue text-white border-loyo-blue'
                              : 'bg-white text-loyo-strong border-loyo-line'
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
              wordRemainder="PLIKACE"
              fillColor={BRAND.mustard}
              subtitle="Zakázkový full-stack vývoj, 100% nezávislý čistý kód a komplexní backend • ZLATÁ SPECIALIZACE"
            />

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardEyebrow tone="mustard">
                  <Code2 className="w-4 h-4" />
                  <span>Čistý kód</span>
                </CardEyebrow>
                <CardTitle>100% Nezávislost & vlastnictví</CardTitle>
                <CardText>
                  Žádný vendor lock-in. Všechny zdrojové kódy, repozitáře, databázové struktury i
                  přístupy jsou vaším výhradním majetkem od prvního commitu.
                </CardText>
                <CardNote>✓ TypeScript • React / Node.js • Nezávislost na platformách</CardNote>
              </Card>

              <Card>
                <CardEyebrow tone="mustard">
                  <Database className="w-4 h-4" />
                  <span>Komplexní backend</span>
                </CardEyebrow>
                <CardTitle>Architektura na míru</CardTitle>
                <CardText>
                  Promyšlený relační databázový model, bleskové API, cachování dotazů a bezpečnostní
                  vrstvy, které s přehledem obslouží tisíce aktivních uživatelů.
                </CardText>
                <CardNote>✓ SQL / PostgreSQL • JWT ověření • Real-time WebSockets</CardNote>
              </Card>

              <Card>
                <CardEyebrow tone="mustard">
                  <Layers className="w-4 h-4" />
                  <span>Intuitivní rozhraní</span>
                </CardEyebrow>
                <CardTitle>Plynulé ovládání bez čekání</CardTitle>
                <CardText>
                  Uživatelské rozhraní stavěné na míru vašim zaměstnancům nebo klientům. Žádné
                  zbytečné klikání navíc – vše je logické, rychlé a responzivní na každém zařízení.
                </CardText>
                <CardNote>✓ Responzivní design • Okamžitá odezva • Role a oprávnění</CardNote>
              </Card>
            </div>

            {/* Architecture Comparison Table */}
            <div className="bg-loyo-bar border-2 border-loyo-ink p-6 sm:p-8 shadow-xs">
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
                      <th className="p-3 uppercase text-loyo-mustard-dark font-black">
                        LoYo Vývoj na míru
                      </th>
                      <th className="p-3 uppercase text-loyo-subtle">Krabicové SaaS / No-Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-loyo-line">
                    <tr>
                      <td className="p-3 font-bold text-loyo-ink">Vlastnictví kódu</td>
                      <td className="p-3 font-bold text-loyo-mustard-dark">
                        100 % vaše výhradní vlastnictví
                      </td>
                      <td className="p-3 text-loyo-faint">Pronájem, nemůžete kód exportovat</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-loyo-ink">Měsíční licenční poplatky</td>
                      <td className="p-3 font-bold text-emerald-700">
                        0 Kč (pouze vaše levný hosting)
                      </td>
                      <td className="p-3 text-loyo-faint">
                        Desítky tisíc ročně za uživatelské účty
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-loyo-ink">Rychlost a odezva</td>
                      <td className="p-3 font-bold text-loyo-mustard-dark">Blesková pod 100 ms</td>
                      <td className="p-3 text-loyo-faint">Těžkopádné, pomalé načítání</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-loyo-ink">Přizpůsobení logiky</td>
                      <td className="p-3 font-bold text-loyo-mustard-dark">
                        Neomezené – cokoliv téměř
                      </td>
                      <td className="p-3 text-loyo-faint">Omezené mantinely šablony</td>
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
              wordRemainder="VORBA"
              fillColor={BRAND.red}
              subtitle="Restyling stávajících webů, unikátní design od čistého listu a 60 FPS animace • ČERVENÁ SPECIALIZACE"
            />

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardEyebrow tone="red">
                  <Palette className="w-4 h-4" />
                  <span>Hloubkový restyling</span>
                </CardEyebrow>
                <CardTitle>Oživení zastaralého webu</CardTitle>
                <CardText>
                  Vezmeme váš stávající obsah a přetavíme ho do suverénní moderní podoby. Odstraníme
                  balast, zrychlíme načítání a vytvoříme vizuál hodný roku 2026.
                </CardText>
                <CardNote>✓ Zachování SEO pozic • Čistý kód • Moderní typografie</CardNote>
              </Card>

              <Card>
                <CardEyebrow tone="red">
                  <Sparkles className="w-4 h-4" />
                  <span>Vlastní podoba stránky</span>
                </CardEyebrow>
                <CardTitle>Návrh přímo podle vaší vize</CardTitle>
                <CardText>
                  Žádné prefabrikované šablony z WordPressu, které mají stovky dalších webů.
                  Vytvořím unikátní vizuální jazyk navržený od prvního pixelu přímo pro váš obor.
                </CardText>
                <CardNote>✓ Unikátní rozvržení • Vektorová loga • Přehledná hierarchie</CardNote>
              </Card>

              <Card>
                <CardEyebrow tone="red">
                  <Gauge className="w-4 h-4" />
                  <span>Dynamické animace</span>
                </CardEyebrow>
                <CardTitle>Plynulých 60 snímků za sekundu</CardTitle>
                <CardText>
                  Kinetické titulky, plynulé přechody sekcí a elegantní mikrointerakce při najetí
                  myší. Web okamžitě upoutá a zanechá dojem špičkové řemeslné práce.
                </CardText>
                <CardNote>✓ Náběh pod 0.8s • Skóre 95+ v PageSpeed • Mobilní optimalizace</CardNote>
              </Card>
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
              wordRemainder="ONZULTACE"
              fillColor={BRAND.ink}
              subtitle="Osobní odborné poradenství 1 na 1, technická oponentura a ochrana rozpočtu • OSOBNÍ KONZULTACE"
            />

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardEyebrow tone="ink">
                  <Coffee className="w-4 h-4" />
                  <span>Osobně i online</span>
                </CardEyebrow>
                <CardTitle>1 na 1 u kávy nebo videohovoru</CardTitle>
                <CardText>
                  Přímý kontakt bez projektových manažerů či obchodníků. Sejdeme se v příjemné
                  kavárně nebo se spojíme přes Google Meet. Věcná diskuze zaměřená na konkrétní
                  výsledky.
                </CardText>
                <CardNote>✓ Praha & celá ČR • Flexibilní termíny • Férové jednání</CardNote>
              </Card>

              <Card>
                <CardEyebrow tone="ink">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Záchrana rozpočtu</span>
                </CardEyebrow>
                <CardTitle>MVP plán před kódováním</CardTitle>
                <CardText>
                  Než začnete utrácet statisíce za nákladný vývoj, ověříme technickou
                  proveditelnost. Navrhnu nejkratší a nejlevnější cestu k funkčnímu prvnímu
                  prototypu.
                </CardText>
                <CardNote>✓ Eliminace slepých uliček • Sazba ~800 Kč/hod • Úspora peněz</CardNote>
              </Card>

              <Card>
                <CardEyebrow tone="ink">
                  <Zap className="w-4 h-4" />
                  <span>Předání know-how</span>
                </CardEyebrow>
                <CardTitle>Plná podpora & zaškolení</CardTitle>
                <CardText>
                  Nezůstanete v nevědomosti. Vysvětlím vám, jak váš systém funguje, jak do něj
                  bezpečně zapojit AI nástroje a jak jej udržovat bez nutnosti platit drahé externí
                  agentury.
                </CardText>
                <CardNote>✓ Architektonické schéma • Záznam hovoru • Písemný souhrn</CardNote>
              </Card>
            </div>

            {/* INTEGRATED QUESTIONNAIRE AT THE BOTTOM */}
            <IntegratedQuestionnaire serviceId="consultation" />
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-loyo-line-field flex items-center justify-between">
          <Button
            size="lg"
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Zpět na hlavní přehled</span>
          </Button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-mono font-bold text-loyo-subtle hover:text-loyo-ink uppercase cursor-pointer"
          >
            Nahoru ↑
          </button>
        </div>
      </div>
    </div>
  );
};
