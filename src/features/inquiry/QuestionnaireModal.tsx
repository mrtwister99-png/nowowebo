import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, Clock, Shield, Zap, FileText, Users, Video } from 'lucide-react';
import { ServiceId } from '../../types';
import { LEVEL_CONFIG, LeadLevel, TEAM_SIZE, TOOLS, HOURS, DATA_HANDLING } from './questionnaireLevels';
import { saveLeadToFolder, sendLeadToEmail, saveLeadToApi, LoyoLead } from '../../lib/loyoLeadStorage';

interface Props {
  isOpen: boolean;
  initialServiceId?: ServiceId;
  onClose: () => void;
}

type FormState = {
  jmeno: string; firma: string; web: string; email: string; telefon: string;
  coZereCas: string; otazkaNaMe: string; doplnujici: string;
  velikostTymu: string; nastroje: string[];
  proces1: string; proces2: string; proces3: string;
  hodinyTydne: string; chodDat: string;
  detailPoptavka: string; chybyZdrzeni: string; lidiProces: string;
  uspech: string; loomLink: string; citlivost: string[];
  api: string; detektivka: string;
  budget: string; timeline: string;
};

type LoyoLeadExtended = LoyoLead & Pick<FormState, 'citlivost' | 'api' | 'detektivka' | 'budget' | 'timeline'>;

export const QuestionnaireModal: React.FC<Props> = ({ isOpen, initialServiceId = 'automation', onClose }) => {
  const [level, setLevel] = useState<LeadLevel>('standard');
  const [titleKey, setTitleKey] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serviceId] = useState<ServiceId>(initialServiceId);
  const [step, setStep] = useState(1);

  const [f, setF] = useState<FormState>({
    jmeno: '', firma: '', web: '', email: '', telefon: '',
    coZereCas: '', otazkaNaMe: '', doplnujici: '',
    velikostTymu: '', nastroje: [],
    proces1: '', proces2: '', proces3: '',
    hodinyTydne: '', chodDat: '',
    detailPoptavka: '', chybyZdrzeni: '', lidiProces: '',
    uspech: '', loomLink: '', citlivost: [],
    api: '', detektivka: '',
    budget: '', timeline: '',
  });

  const changeLevel = (l: LeadLevel) => { if (l===level) return; setLevel(l); setTitleKey(k=>k+1); setStep(1); };
  
  const upd = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF(s => ({ ...s, [k]: v }));
  };
  
  const toggle = (arr: 'nastroje' | 'citlivost', v: string) => setF(s => {
    const current = s[arr];
    return { ...s, [arr]: current.includes(v) ? current.filter(x=>x!==v) : [...current, v] };
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.jmeno || !f.email) { alert('Jméno + email povinné'); return; }
    setIsSending(true);
    
    const lead: LoyoLeadExtended = {
      id: `LY-${Date.now().toString().slice(-6)}`,
      level, serviceId,
      jmeno: f.jmeno, firma: f.firma, web: f.web, email: f.email, telefon: f.telefon,
      coZereCas: f.coZereCas, otazkaNaMe: f.otazkaNaMe, doplnujici: f.doplnujici,
      velikostTymu: f.velikostTymu, nastroje: f.nastroje,
      proces1: f.proces1, proces2: f.proces2, proces3: f.proces3,
      hodinyTydne: f.hodinyTydne, chodDat: f.chodDat,
      detailPoptavka: f.detailPoptavka, chybyZdrzeni: f.chybyZdrzeni, lidiProces: f.lidiProces,
      uspech: f.uspech, loomLink: f.loomLink,
      timestamp: new Date().toISOString(),
      citlivost: f.citlivost,
      api: f.api,
      detektivka: f.detektivka,
      budget: f.budget,
      timeline: f.timeline,
    };

    saveLeadToFolder(lead);
    await saveLeadToApi(lead);
    sendLeadToEmail(lead);
    setTimeout(()=>{ setIsSending(false); setSent(true); }, 600);
  };

  if (!isOpen) return null;
  const cfg = LEVEL_CONFIG[level];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-loyo-surface border border-loyo-line rounded-3xl shadow-brutal-10 flex flex-col overflow-hidden">
        {/* HEADER 56px s animovaným nadpisem */}
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-loyo-line bg-loyo-surface">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex gap-1 shrink-0">
              <div className="w-5 h-5 bg-loyo-blue border border-loyo-blue rounded-md flex items-center justify-center text-[10px] font-heading font-bold text-loyo-text">L</div>
              <div className="w-5 h-5 bg-loyo-panel border border-loyo-line rounded-md flex items-center justify-center text-[10px] font-heading font-bold text-loyo-text">O</div>
              <div className="w-5 h-5 bg-loyo-panel border border-loyo-line rounded-md flex items-center justify-center text-[10px] font-heading font-bold text-loyo-text">Y</div>
              <div className="w-5 h-5 bg-loyo-panel border border-loyo-line rounded-md flex items-center justify-center text-[10px] font-heading font-bold text-loyo-text">O</div>
            </div>
            <div key={titleKey} className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0 animate-[pulse_1.2s_infinite]" style={{ background: cfg.dotColor }} />
                <h2 className="font-heading font-bold text-lg sm:text-xl leading-none tracking-tight truncate animate-[titleIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">{cfg.title}</h2>
                <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-loyo-panel border border-loyo-line rounded-full text-[10px] text-loyo-muted font-mono font-bold uppercase">{serviceId}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-loyo-line bg-loyo-panel hover:bg-loyo-hover text-loyo-text flex items-center justify-center shrink-0 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LEVEL SWITCHER + PROGRESS */}
        <div className="px-4 py-3 bg-loyo-bg/60 border-b border-loyo-line space-y-3">
          <div className="flex p-1 bg-loyo-panel border border-loyo-line rounded-xl gap-1">
            {(Object.keys(LEVEL_CONFIG) as LeadLevel[]).map((l) => {
              const c = LEVEL_CONFIG[l];
              const active = level===l;
              return (
                  <button key={l} type="button" onClick={()=>changeLevel(l)} className={`flex-1 h-9 rounded-lg text-[11px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5 ${active?'bg-loyo-blue text-white border-loyo-blue shadow-brutal-3':'bg-transparent text-loyo-muted border-transparent hover:text-loyo-text hover:bg-loyo-hover'}`}>
                  {l==='rychly' && <Zap className="w-3.5 h-3.5" />}
                  {l==='standard' && <Clock className="w-3.5 h-3.5" />}
                  {l==='deep' && <Shield className="w-3.5 h-3.5" />}
                  {c.label} • {c.shortLabel}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-loyo-muted">{cfg.hint} • čím víc detailů, tím lepší cena</div>
            {level==='deep' && (
              <div className="flex items-center gap-1">
                {[1,2,3].map(i=>(
                  <button key={i} type="button" onClick={()=>setStep(i)} className={`w-6 h-6 rounded-full border border-loyo-line text-xs font-bold flex items-center justify-center ${step===i?'bg-loyo-blue border-loyo-blue text-white':step>i?'bg-loyo-blue/20 border-loyo-blue text-loyo-text':'bg-loyo-panel text-loyo-muted'}`}>{i}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-loyo-surface text-loyo-text">
            <div className="w-20 h-20 bg-loyo-panel border border-loyo-line text-loyo-text rounded-full flex items-center justify-center mb-4 
            ">
              <CheckCircle2 className="w-10 h-10 text-loyo-blue" />
            </div>
            <h3 className="font-heading font-bold text-2xl">Odesláno do složky + na email!</h3>
            <p className="font-mono text-xs mt-3 opacity-70 max-w-md leading-relaxed">Uloženo do <b>data/leads/</b> (localStorage + API <b>/api/loyo-lead</b>) + odesláno na <b>loyo.gruup@gmail.com</b>. Ozvu se do 24h s rozborem.</p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={onClose} className="h-11 px-6 bg-loyo-blue hover:bg-loyo-blue-hover text-white rounded-full font-bold text-xs tracking-wider">ZAVŘÍT</button>
              <button type="button" onClick={()=>{ setSent(false); setF(s=>({ ...s, coZereCas:'', detailPoptavka:'' })); }} className="h-11 px-6 bg-loyo-panel hover:bg-loyo-hover border border-loyo-line rounded-full font-bold text-xs tracking-wider">POSLAT DALŠÍ</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden bg-loyo-surface text-loyo-text">
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-loyo-blue text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-widest">Základní info</h3>
                  <div className="flex-1 h-px bg-loyo-line ml-2" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="h-11 px-3 border border-loyo-line rounded-xl text-xs font-medium focus:outline-none focus:border-loyo-blue bg-loyo-panel text-loyo-text" placeholder="Jméno *" value={f.jmeno} onChange={e=>upd('jmeno', e.target.value)} />
                  <input className="h-11 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Firma / Projekt" value={f.firma} onChange={e=>upd('firma', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input className="h-11 px-3 border border-loyo-line rounded-xl text-xs col-span-2 bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Email * (kam mám poslat rozbor)" type="email" value={f.email} onChange={e=>upd('email', e.target.value)} />
                  <input className="h-11 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Telefon" value={f.telefon} onChange={e=>upd('telefon', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Web (pokud máte)" value={f.web} onChange={e=>upd('web', e.target.value)} />
                  <select className="h-10 px-2 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" value={f.velikostTymu} onChange={e=>upd('velikostTymu', e.target.value)}>
                    <option value="">Velikost týmu</option>
                    {TEAM_SIZE.map(v=><option key={v} value={v}>{v} lidí</option>)}
                  </select>
                  <select className="h-10 px-2 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" value={f.hodinyTydne} onChange={e=>upd('hodinyTydne', e.target.value)}>
                    <option value="">Kolik h týdně to žere?</option>
                    {HOURS.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-loyo-panel border border-loyo-line text-loyo-text rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-widest">Co vám žere čas?</h3>
                  <div className="flex-1 h-px bg-loyo-line ml-2" />
                </div>
                <textarea className="w-full min-h-24 p-3 border border-loyo-line rounded-xl text-xs resize-none focus:outline-none focus:border-loyo-blue bg-loyo-panel text-loyo-text" placeholder="Popiš co nejvíc detailně - např. 'Každý den 2h přepisuju objednávky z emailu do Pohody, pak ručně dělám faktury...'" value={f.coZereCas} onChange={e=>upd('coZereCas', e.target.value)} />
                {level !== 'rychly' && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Žrout času #1 (největší)" value={f.proces1} onChange={e=>upd('proces1', e.target.value)} />
                      <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Žrout času #2" value={f.proces2} onChange={e=>upd('proces2', e.target.value)} />
                      <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Žrout času #3" value={f.proces3} onChange={e=>upd('proces3', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase opacity-60 flex items-center gap-1"><FileText className="w-3 h-3" /> Nástroje které používáte</label>
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {TOOLS.map(t=>(
                          <button key={t} type="button" onClick={()=>toggle('nastroje', t)} className={`h-7 px-3 rounded-full border border-loyo-line text-xs font-bold transition-all ${f.nastroje.includes(t)?'bg-loyo-blue border-loyo-blue text-white shadow-brutal-2':'bg-loyo-panel hover:bg-loyo-hover'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" value={f.chodDat} onChange={e=>upd('chodDat', e.target.value)}>
                        <option value="">Jak mají chodit data?</option>
                        {DATA_HANDLING.map(v=><option key={v} value={v}>{v}</option>)}
                      </select>
                      <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Máte API? K jakým systémům?" value={f.api} onChange={e=>upd('api', e.target.value)} />
                    </div>
                  </>
                )}
              </div>

              {level === 'deep' && (
                <div className="space-y-4 border border-loyo-line rounded-2xl p-4 bg-loyo-bg/60 shadow-brutal-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-loyo-panel border border-loyo-line text-loyo-text rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <h3 className="font-heading font-bold text-xs uppercase tracking-widest">Deep dive - pro nejlevnější řešení</h3>
                    <Sparkles className="w-4 h-4 text-loyo-gold" />
                  </div>

                  {step === 1 && (
                    <div className="space-y-3 animate-[fadeIn_0.3s_ease]">
                      <textarea className="w-full min-h-24 p-3 border border-loyo-line rounded-xl text-xs resize-none bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="DETAIL: Jak přesně probíhá poptávka / zakázka krok za krokem? Kdo co dělá?" value={f.detailPoptavka} onChange={e=>upd('detailPoptavka', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <textarea className="min-h-24 p-3 border border-loyo-line rounded-xl text-xs resize-none bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Kde vznikají chyby / zdržení?" value={f.chybyZdrzeni} onChange={e=>upd('chybyZdrzeni', e.target.value)} />
                        <textarea className="min-h-24 p-3 border border-loyo-line rounded-xl text-xs resize-none bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Kolik lidí se toho účastní? Kdo schvaluje?" value={f.lidiProces} onChange={e=>upd('lidiProces', e.target.value)} />
                      </div>
                      <button type="button" onClick={()=>setStep(2)} className="w-full h-10 bg-loyo-panel hover:bg-loyo-hover text-loyo-text border border-loyo-line rounded-xl font-bold text-xs">POKRAČOVAT NA KROK 2 →</button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3 animate-[fadeIn_0.3s_ease]">
                      <div className="grid grid-cols-2 gap-2">
                        <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Co je pro vás úspěch? Kolik hodin chcete ušetřit?" value={f.uspech} onChange={e=>upd('uspech', e.target.value)} />
                        <input className="h-10 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Loom video link (natočte proces)" value={f.loomLink} onChange={e=>upd('loomLink', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold uppercase opacity-70 flex items-center gap-1"><Shield className="w-3 h-3" /> Citlivost dat / GDPR</label>
                        <div className="flex gap-1.5 flex-wrap mt-1">
                          {['GDPR citlivé','Fakturace','Osobní údaje','Interní only','Veřejné'].map(v=>(
                            <button key={v} type="button" onClick={()=>toggle('citlivost', v)} className={`h-7 px-3 rounded-full border border-loyo-line text-xs font-bold ${f.citlivost.includes(v)?'bg-loyo-blue border-loyo-blue text-white':'bg-loyo-panel hover:bg-loyo-hover'}`}>{v}</button>
                          ))}
                        </div>
                      </div>
                      <textarea className="w-full min-h-24 p-3 border border-loyo-line rounded-xl text-xs resize-none bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Detektivka: Co jste už zkoušeli automatizovat a nefungovalo? Proč?" value={f.detektivka} onChange={e=>upd('detektivka', e.target.value)} />
                      <div className="flex gap-2">
                        <button type="button" onClick={()=>setStep(1)} className="h-10 px-4 bg-loyo-panel hover:bg-loyo-hover border border-loyo-line rounded-xl font-bold text-xs">← ZPĚT</button>
                        <button type="button" onClick={()=>setStep(3)} className="flex-1 h-10 bg-loyo-panel hover:bg-loyo-hover text-loyo-text border border-loyo-line rounded-xl font-bold text-xs">KROK 3 → ROZPOČET</button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3 animate-[fadeIn_0.3s_ease]">
                      <div className="grid grid-cols-2 gap-2">
                        <input className="h-11 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Rozpočet (orientačně)" value={f.budget} onChange={e=>upd('budget', e.target.value)} />
                        <input className="h-11 px-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Kdy to potřebujete?" value={f.timeline} onChange={e=>upd('timeline', e.target.value)} />
                      </div>
                      <div className="p-3 bg-loyo-panel border border-loyo-line rounded-xl">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase"><Video className="w-3.5 h-3.5" /> Tip pro nejlepší cenu</div>
                        <p className="text-xs opacity-70 mt-1 leading-relaxed">Natočte 2-3 min Loom video jak to děláte teď ručně. Ušetří mi to 2h analýzy a dám vám lepší cenu. Link vložte výše.</p>
                      </div>
                      <button type="button" onClick={()=>setStep(2)} className="w-full h-10 bg-loyo-panel hover:bg-loyo-hover border border-loyo-line rounded-xl font-bold text-xs">← ZPĚT NA KROK 2</button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 pt-2 border-t-2 border-dashed border-loyo-line">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <h4 className="font-mono font-bold text-xs uppercase tracking-widest">Poslední krok</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <textarea className="min-h-24 p-3 border border-loyo-line rounded-xl text-xs bg-loyo-panel resize-none text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Otázka na mě? Co vás zajímá? (např. jak to bude fungovat, co když...)" value={f.otazkaNaMe} onChange={e=>upd('otazkaNaMe', e.target.value)} />
                  <textarea className="min-h-24 p-3 border border-loyo-line rounded-xl text-xs resize-none bg-loyo-panel text-loyo-text focus:outline-none focus:border-loyo-blue" placeholder="Doplňující info, odkazy, cokoliv co pomůže" value={f.doplnujici} onChange={e=>upd('doplnujici', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-loyo-line bg-loyo-surface shrink-0">
                           <button type="submit" disabled={isSending} className="w-full h-13 bg-loyo-blue hover:bg-loyo-blue-hover text-white rounded-xl font-bold text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 shadow-brutal-5 hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal-7 active:translate-x-0 active:translate-y-0 active:shadow-brutal-3 transition-all disabled:opacity-50">
                {isSending ? 'UKLÁDÁM DO SLOŽKY + POSÍLÁM NA EMAIL...' : `ODESLAT ${level.toUpperCase()} DOTAZNÍK NA EMAIL`}
                <span className="w-8 h-8 bg-white/15 text-white rounded-full flex items-center justify-center"><Send className="w-4 h-4" /></span>
              </button>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="font-mono text-xs opacity-40">Uloží se do složky data/leads/ + email</span>
                <span className="w-1 h-1 bg-loyo-line rounded-full" />
                <span className="font-mono text-xs opacity-40">Odpověď do 24h • žádný spam</span>
              </div>
            </div>
          </form>
        )}
      </div>
      <style>{`@keyframes titleIn{from{transform:translateY(12px);filter:blur(8px);opacity:0}to{transform:translateY(0);filter:blur(0);opacity:1}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};