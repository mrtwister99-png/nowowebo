import React, { useState } from 'react';
import { 
  MessageSquare, 
  Coffee, 
  Compass, 
  Lightbulb, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Lock, 
  BookOpen, 
  Headphones, 
  HeartHandshake,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ServiceId } from '../types';

interface ConsultationSectionProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({ 
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

  return (
    <section id="konzultace" className="py-14 sm:py-16 bg-loyo-bg text-[#18181b] border-b border-[#d0d0d0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: 04. PILÍŘ • GRAFITOVÁ / ČERNÁ S TRIKOLÓROU */}
        <div className="border-l-4 border-[#18181b] pl-5 sm:pl-6 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#18181b] text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              04. PILÍŘ • OSOBNÍ KONZULTACE
            </span>
            <span className="px-2 py-0.5 bg-loyo-bar border border-[#c2c2c2] text-[#18181b] text-[11px] font-mono font-bold">
              ORIENTAČNĚ OKOLO 800 KČ / HOD
            </span>
            <div className="inline-flex items-center gap-1.5 ml-2">
              <span className="w-2 h-2 bg-loyo-blue" />
              <span className="w-2 h-2 bg-loyo-mustard" />
              <span className="w-2 h-2 bg-loyo-red" />
            </div>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#18181b] tracking-tight">
            Odborná osobní konzultace & Partnerství
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#333] max-w-3xl leading-relaxed">
            Máte nápad nebo jen myšlenku, jak něco vylepšit a urychlit? <strong>Domluvte si se mnou odbornou konzultaci, a to klidně osobně u kávy nebo online.</strong> Vše probereme, prodiskutujeme a poradíme se. <strong>Cena se pohybuje okolo 800 Kč na hodinu</strong> dle konkrétní složitosti daného případu.
          </p>
        </div>

        {/* Hlavní karta se 3 jasnými body */}
        <div className="bg-loyo-bar border-2 border-[#18181b] p-6 sm:p-8 shadow-xs">
          
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#18181b] font-bold block mb-1">
              3 hlavní pilíře konzultace:
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#18181b]">
              Přímý lidský přístup a ochrana vaší investice před slepými uličkami
            </h3>
          </div>

          {/* 3 JASNÉ BODY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* Bod 1 */}
            <div className="bg-loyo-bg p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Lidský přístup (káva nebo online)
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Žádný odosobněný korporát ani obchodní nátlak. Potkáme se u kávy nebo na videohovoru a věcně probereme váš záměr s férovou hodinovou sazbou.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-loyo-bar text-[11px] font-mono text-[#18181b] font-bold">
                Osobní 1-on-1 debata
              </div>
            </div>

            {/* Bod 2 */}
            <div className="bg-loyo-bg p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Validace nápadu & návrh MVP
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Zpřesnění myšlenky, posouzení technické proveditelnosti a stanovení štíhlého postupu, abyste neutráceli statisíce za zbytečné funkce.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-loyo-bar text-[11px] font-mono text-[#18181b] font-bold">
                Úspora nákladů a času
              </div>
            </div>

            {/* Bod 3 */}
            <div className="bg-loyo-bg p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Co po skončení & Filozofie
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  100% vlastnictví vašeho produktu i kódů, důkladné zaškolení a možnost dlouhodobého dohledu. Individuální přístup ke každému klientovi.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-loyo-bar text-[11px] font-mono text-[#18181b] font-bold">
                100% jistota & žádné zámky
              </div>
            </div>
          </div>

          {/* SPODNÍ LIŠTA: V PRAVO DOLE TLAČÍTKO "ZJISTIT VÍCE" */}
          <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <span className="w-2 h-2 rounded-full bg-[#18181b]" />
              <span>Konzultační pilíř • Příklady, co po skončení projektu & individuální filozofie</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenQuestionnaire('consultation')}
                className="px-4 py-2 bg-loyo-bg hover:bg-[#e0e0e0] border border-[#18181b] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                id="btn-consultation-dotaznik-preview"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dotazník pro konzultaci</span>
              </button>

              <button
                onClick={handleToggle}
                disabled={isExpanding}
                className="px-5 py-2.5 bg-[#18181b] hover:bg-loyo-blue text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-80"
                id="btn-consultation-toggle-details"
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
          <div className="mt-8 bg-loyo-bg border-2 border-[#18181b] p-6 sm:p-8 space-y-6 animate-pulse">
            <div className="flex items-center justify-between pb-4 border-b border-[#c8c8c8]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs font-bold text-[#18181b] uppercase tracking-wider">
                  Inicializace témat konzultace, case studies a metodiky...
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#777]">04. KONZULTACE</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-28 bg-loyo-bar p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
              <div className="h-28 bg-loyo-bar p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
              <div className="h-28 bg-loyo-bar p-4 space-y-2 border border-[#ccc]">
                <div className="h-3 w-1/3 bg-[#c2c2c2] rounded-xs" />
                <div className="h-5 w-3/4 bg-[#b5b5b5] rounded-xs" />
                <div className="h-3 w-1/2 bg-[#c8c8c8] rounded-xs" />
              </div>
            </div>

            <div className="h-36 bg-loyo-bar p-5 space-y-3 border border-[#ccc]">
              <div className="h-4 w-44 bg-[#b8b8b8] rounded-xs" />
              <div className="h-3 w-full bg-[#cecece] rounded-xs" />
              <div className="h-3 w-4/5 bg-[#cecece] rounded-xs" />
            </div>
          </div>
        )}

        {/* ROZBALENÉ DETAILY (Když uživatel klikne na "Zjistit více") */}
        {isExpanded && (
          <div className="mt-8 bg-loyo-bg border-2 border-[#18181b] p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            
            {/* 1. PŘÍKLADY KONZULTACÍ */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#18181b] font-bold">
                  Konkrétní situace z praxe:
                </span>
                <span className="text-xs font-mono text-[#666]">Příklady témat pro konzultaci</span>
              </div>
              <h4 className="font-heading font-black text-xl text-[#18181b] mb-4">
                S čím vám mohu na konzultaci konkrétně pomoci?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-loyo-bar p-4 border border-[#c2c2c2] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#18181b] mb-1.5">
                      1. Posouzení myšlenky & návrh MVP
                    </h5>
                    <p className="text-xs text-[#555] leading-relaxed">
                      Máte nový záměr pro aplikaci nebo službu? Zanalyzujeme, jak myšlenku otestovat na reálném trhu za co nejnižší vstupní náklady bez zbytečných omylů.
                    </p>
                  </div>
                </div>

                <div className="bg-loyo-bar p-4 border border-[#c2c2c2] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                      <Compass className="w-4 h-4" />
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#18181b] mb-1.5">
                      2. Audit firemních procesů
                    </h5>
                    <p className="text-xs text-[#555] leading-relaxed">
                      Projdeme vaše denní operace (faktury, e-maily, zakázky, sklady). Identifikujeme úzká hrdla a spočítáme, kde automatizací ušetříte desítky hodin měsíčně.
                    </p>
                  </div>
                </div>

                <div className="bg-loyo-bar p-4 border border-[#c2c2c2] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#18181b] mb-1.5">
                      3. Výběr technologií bez vendor lock-in
                    </h5>
                    <p className="text-xs text-[#555] leading-relaxed">
                      Doporučím moderní, nezávislé technologie, abyste nebyli rukojmím jedné agentury. Budete mít 100% kontrolu nad vlastním kódem i infrastrukturou.
                    </p>
                  </div>
                </div>

                <div className="bg-loyo-bar p-4 border border-[#c2c2c2] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 bg-[#18181b] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#18181b] mb-1.5">
                      4. Revize bezpečnosti & záloh
                    </h5>
                    <p className="text-xs text-[#555] leading-relaxed">
                      Zkontrolujeme zabezpečení citlivých údajů, přístupy zaměstnanců, šifrování a automatické zálohování na lokální disky i do cloudu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CO PO SKONČENÍ PROJEKTU? */}
            <div className="bg-loyo-bar border-2 border-[#18181b] p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#18181b] font-bold">
                  100% Jistota & Partnerství:
                </span>
                <span className="px-2 py-0.5 bg-loyo-bg text-[#18181b] font-mono text-[10px] font-bold border border-[#c2c2c2]">
                  BEZPEČÍ PRO VÁŠ BYZNYS
                </span>
              </div>
              <h4 className="font-heading font-black text-xl text-[#18181b] mb-2">
                Co se děje po dokončení projektu?
              </h4>
              <p className="text-xs sm:text-sm text-[#444] max-w-3xl leading-relaxed mb-6">
                Dokončením projektu naše spolupráce nekončí, pokud si to nepřejete. Na rozdíl od běžných agentur vás nezamknu do žádné proprietární pasti:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-loyo-bg p-4 border border-[#c2c2c2]">
                  <div className="flex items-center gap-2 text-[#18181b] font-heading font-bold text-sm mb-2">
                    <Lock className="w-4 h-4 text-loyo-blue" />
                    <span>100% váš produkt & kód</span>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Veškerý kód, repozitáře, přístupové údaje i databáze jsou výhradně vaše. Nic nezadržuji, nemám žádná tajná zadní vrátka.
                  </p>
                </div>

                <div className="bg-loyo-bg p-4 border border-[#c2c2c2]">
                  <div className="flex items-center gap-2 text-[#18181b] font-heading font-bold text-sm mb-2">
                    <BookOpen className="w-4 h-4 text-loyo-mustard" />
                    <span>Kompletní zaškolení</span>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Systém vám i vašemu týmu srozumitelně předvedu a vysvětlím v lidské řeči. Budete přesně vědět, jak každá část funguje a jak ji spravovat.
                  </p>
                </div>

                <div className="bg-loyo-bg p-4 border border-[#c2c2c2]">
                  <div className="flex items-center gap-2 text-[#18181b] font-heading font-bold text-sm mb-2">
                    <Headphones className="w-4 h-4 text-loyo-red" />
                    <span>Dlouhodobý dohled & správa</span>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Pokud budete chtít, postarám se o pravidelné aktualizace, monitoring běhu systému a rychlé rozšiřování o nové funkce podle růstu firmy.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. FILOZOFIE INDIVIDUÁLNÍHO PŘÍSTUPU KE KAŽDÉMU */}
            <div className="bg-loyo-bg border border-[#c8c8c8] border-l-4 border-l-[#18181b] p-6">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="w-5 h-5 text-[#18181b]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#18181b] font-bold">
                  Moje osobní filozofie:
                </span>
              </div>
              <h4 className="font-heading font-black text-lg sm:text-xl text-[#18181b] mb-2">
                Striktně individuální přístup ke každému klientovi
              </h4>
              <p className="text-xs sm:text-sm text-[#444] leading-relaxed max-w-3xl mb-3">
                Nevěřím na unifikované krabicové šablony, které nutí vaši firmu přizpůsobit se cizímu programu. Stejně tak odmítám slepé kopírování generovaných AI halucinací bez hlubokého technického porozumění. 
              </p>
              <p className="text-xs sm:text-sm text-[#444] leading-relaxed max-w-3xl font-medium">
                Moderní AI využívám jako mimořádně silný akcelerátor, ale každý řádek kódu, každou tabulku v databázi a každý krok v automatizaci skládám ručně s řemeslnou poctivostí. Jen tak vznikají systémy, které bezchybně fungují i po letech.
              </p>
            </div>

            {/* CTA v rozbaleném stavu */}
            <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-heading font-bold text-sm text-[#18181b] block">
                  Chcete probrat váš projekt nezávazně u kávy nebo online?
                </span>
                <span className="text-xs text-[#666]">
                  Vyplňte krátký dotazník pro konzultaci a já se vám obratem ozvu.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenQuestionnaire('consultation')}
                  className="px-5 py-2.5 bg-[#18181b] hover:bg-loyo-blue text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dotazník pro konzultaci</span>
                </button>
                <button
                  onClick={handleToggle}
                  className="px-4 py-2 bg-loyo-bar hover:bg-[#d0d0d0] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
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
