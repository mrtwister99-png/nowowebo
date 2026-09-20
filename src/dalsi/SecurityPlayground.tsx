import React, { useState } from 'react';
import { Smartphone, Radio, Mail, Gamepad2, ShieldCheck, CheckCircle2, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { ServiceId } from '../types';

interface SecurityPlaygroundProps {
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

type SecurityMode = 'phone' | 'nfc' | 'email' | 'game';

export const SecurityPlayground: React.FC<SecurityPlaygroundProps> = ({ onOpenQuestionnaire }) => {
  const [activeMode, setActiveMode] = useState<SecurityMode>('nfc');
  const [nfcState, setNfcState] = useState<'idle' | 'scanning' | 'authorized'>('idle');
  const [phoneCode, setPhoneCode] = useState<string>('8492');
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  
  // Game state (sequence of 3 nodes: 1, 3, 2)
  const [gameSequence, setGameSequence] = useState<number[]>([]);
  const [gameUnlocked, setGameUnlocked] = useState<boolean>(false);

  const triggerNfcScan = () => {
    setNfcState('scanning');
    setTimeout(() => {
      setNfcState('authorized');
    }, 1200);
  };

  const handleGameNodeClick = (nodeId: number) => {
    if (gameUnlocked) return;
    const nextSeq = [...gameSequence, nodeId];
    setGameSequence(nextSeq);
    if (nextSeq.length === 3) {
      if (nextSeq[0] === 1 && nextSeq[1] === 2 && nextSeq[2] === 3) {
        setGameUnlocked(true);
      } else {
        // wrong sequence feedback, reset after brief delay
        setTimeout(() => {
          setGameSequence([]);
        }, 500);
      }
    }
  };

  return (
    <section id="security-demo" className="py-20 lg:py-28 bg-[#050058] relative overflow-hidden border-t border-b border-white/10">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#000182]/30 blur-[140px] pointer-events-none rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 z-10">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#000182]/50 border border-white/10 text-xs font-mono text-[#CE9B01] uppercase tracking-widest mb-4">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Zakázková Ochrana & Autentizace</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] tracking-tight mb-4">
            Zabezpečení a přihlášení přesně podle vás.
          </h2>
          <p className="text-base sm:text-lg text-[#D9EAF5] opacity-80 border-l-2 border-[#CE9B01] pl-6 leading-relaxed">
            Telefon, fyzická NFC karta, magický e-mailový link nebo interaktivní minihra? Váš interní systém či firemní nástroj zabezpečíme přesně takovým způsobem, který vašemu týmu dává největší smysl a pohodlí. Vyzkoušejte interaktivní simulaci:
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 max-w-2xl">
          <button
            onClick={() => setActiveMode('nfc')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'nfc'
                ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                : 'bg-[#000182]/50 text-[#D9EAF5] hover:border-[#CE9B01] border border-white/10'
            }`}
            id="tab-security-nfc"
          >
            <Radio className="w-4 h-4" />
            <span>Fyzické NFC</span>
          </button>

          <button
            onClick={() => setActiveMode('phone')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'phone'
                ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                : 'bg-[#000182]/50 text-[#D9EAF5] hover:border-[#CE9B01] border border-white/10'
            }`}
            id="tab-security-phone"
          >
            <Smartphone className="w-4 h-4" />
            <span>Telefon & SMS</span>
          </button>

          <button
            onClick={() => setActiveMode('email')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'email'
                ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                : 'bg-[#000182]/50 text-[#D9EAF5] hover:border-[#CE9B01] border border-white/10'
            }`}
            id="tab-security-email"
          >
            <Mail className="w-4 h-4" />
            <span>E-mail Magic Link</span>
          </button>

          <button
            onClick={() => setActiveMode('game')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'game'
                ? 'bg-[#CE9B01] text-[#050058] shadow-sm'
                : 'bg-[#000182]/50 text-[#D9EAF5] hover:border-[#CE9B01] border border-white/10'
            }`}
            id="tab-security-game"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Gamifikované Ověření</span>
          </button>
        </div>

        {/* Interactive Sandbox Card */}
        <div className="max-w-3xl rounded-sm bg-[#000182]/50 border border-white/10 p-6 sm:p-10 shadow-sm relative">
          {/* Top card metadata */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#CE9B01]"></div>
              <span className="font-mono text-xs text-[#D9EAF5]/80 uppercase tracking-widest">
                Simulátor zabezpečení • Protokol v2.4
              </span>
            </div>
            <span className="text-xs text-[#CE9B01] font-mono font-bold tracking-wider">ŠIFROVÁNO 256-BIT AES</span>
          </div>

          {/* MODE: NFC */}
          {activeMode === 'nfc' && (
            <div className="text-center py-4 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-sm bg-[#050058] border border-[#CE9B01] flex items-center justify-center relative shadow-sm">
                {nfcState === 'scanning' ? (
                  <div className="relative">
                    <Radio className="w-8 h-8 text-[#CE9B01] animate-spin" />
                    <span className="absolute -inset-3 rounded-sm border border-[#CE9B01] animate-ping opacity-60"></span>
                  </div>
                ) : nfcState === 'authorized' ? (
                  <CheckCircle2 className="w-10 h-10 text-[#CE9B01]" />
                ) : (
                  <Radio className="w-8 h-8 text-[#D9EAF5]" />
                )}
              </div>

              <div>
                <h4 className="font-heading font-bold text-xl text-[#FFFFFF] mb-2">
                  {nfcState === 'authorized'
                    ? 'NFC Token Rozpoznán — Přístup Schválen!'
                    : nfcState === 'scanning'
                    ? 'Skenuji NFC frekvenci...'
                    : 'Předveďte přiložení fyzického NFC čipu / karty'}
                </h4>
                <p className="text-sm text-[#D9EAF5]/75 max-w-md mx-auto leading-relaxed">
                  Zaměstnanec jednoduše položí kartu nebo přívěsek na stůl k USB/NFC čtečce a systém se okamžitě přihlásí s konkrétní rolí a oprávněním bez nutnosti vyplňovat heslo.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={triggerNfcScan}
                  disabled={nfcState === 'scanning'}
                  className="px-6 py-3 rounded-sm bg-[#CE9B01] hover:bg-[#e6b107] text-[#050058] font-bold text-xs uppercase tracking-widest shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  id="btn-simulate-nfc-tap"
                >
                  Simulovat přiložení NFC karty
                </button>
                {nfcState === 'authorized' && (
                  <button
                    onClick={() => setNfcState('idle')}
                    className="p-3 rounded-sm bg-[#050058] border border-white/10 text-[#D9EAF5] hover:text-[#FFFFFF] text-sm"
                    title="Resetovat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {nfcState === 'authorized' && (
                <div className="p-4 rounded-sm bg-[#050058] border border-white/10 text-left max-w-md mx-auto space-y-1 font-mono text-xs">
                  <div className="text-[#CE9B01] font-bold">✓ Karta: NXP MIFARE Classic 4K</div>
                  <div className="text-[#D9EAF5]/80">UID: 04:A2:89:1B:77:40:91</div>
                  <div className="text-[#D9EAF5]/80">Uživatel: Ředitel výroby (Úroveň 5)</div>
                  <div className="text-emerald-400">Stav: Autorizováno v reálném čase</div>
                </div>
              )}
            </div>
          )}

          {/* MODE: PHONE */}
          {activeMode === 'phone' && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-sm bg-[#050058] border border-[#CE9B01] flex items-center justify-center shadow-sm">
                <Smartphone className="w-8 h-8 text-[#CE9B01]" />
              </div>

              <div>
                <h4 className="font-heading font-bold text-xl text-[#FFFFFF] mb-2">
                  Mobilní dvoufázové ověření (SMS / Auth App)
                </h4>
                <p className="text-sm text-[#D9EAF5]/75 max-w-md mx-auto leading-relaxed">
                  Generování časově omezených TOTP kódů, push notifikací na vyhrazený telefon nebo biometrie přes WebAuthn.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-3">
                <div className="flex justify-center gap-2">
                  {['8', '4', '9', '2'].map((digit, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-14 rounded-sm bg-[#050058] border border-white/10 flex items-center justify-center font-mono font-bold text-xl text-[#CE9B01] shadow-inner"
                    >
                      {phoneVerified ? digit : '•'}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setPhoneVerified(!phoneVerified)}
                  className="w-full py-3 rounded-sm bg-[#CE9B01] text-[#050058] font-bold text-xs uppercase tracking-widest hover:bg-[#e6b107] transition-all cursor-pointer"
                  id="btn-simulate-phone-verify"
                >
                  {phoneVerified ? 'Resetovat kód' : 'Ověřit mobilní OTP token'}
                </button>

                {phoneVerified && (
                  <p className="text-xs text-emerald-400 font-medium">
                    ✓ Telefon +420 777 ••• 123 úspěšně potvrzen!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* MODE: EMAIL */}
          {activeMode === 'email' && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-sm bg-[#050058] border border-[#CE9B01] flex items-center justify-center shadow-sm">
                <Mail className="w-8 h-8 text-[#CE9B01]" />
              </div>

              <div>
                <h4 className="font-heading font-bold text-xl text-[#FFFFFF] mb-2">
                  Bezheslový Magický Odkaz (Magic Link)
                </h4>
                <p className="text-sm text-[#D9EAF5]/75 max-w-md mx-auto leading-relaxed">
                  Uživatel nemusí pamatovat žádné heslo. Stačí zadat firemní e-mail, kliknout na kryptograficky podepsaný odkaz a během vteřiny je bezpečně přihlášen.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="vedeni@vase-firma.cz"
                    className="flex-1 px-4 py-2.5 rounded-sm bg-[#050058] border border-white/10 text-sm text-[#D9EAF5] font-mono"
                  />
                  <button
                    onClick={() => setEmailSent(true)}
                    className="px-5 py-2.5 rounded-sm bg-[#CE9B01] text-[#050058] font-bold text-xs uppercase tracking-widest hover:bg-[#e6b107] cursor-pointer"
                    id="btn-simulate-magic-link"
                  >
                    Odeslat link
                  </button>
                </div>

                {emailSent && (
                  <div className="p-3 rounded-sm bg-[#050058] border border-emerald-500/40 text-left text-xs text-[#D9EAF5] space-y-1">
                    <div className="text-emerald-400 font-bold">✓ E-mail byl vygenerován a odeslán</div>
                    <div className="text-[#D9EAF5]/70 truncate font-mono">
                      Token: https://auth.ekosystem.cz/verify?t=9fa2e48bce9b...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE: GAME */}
          {activeMode === 'game' && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-sm bg-[#050058] border border-[#CE9B01] flex items-center justify-center shadow-sm">
                <Gamepad2 className="w-8 h-8 text-[#CE9B01]" />
              </div>

              <div>
                <h4 className="font-heading font-bold text-xl text-[#FFFFFF] mb-2">
                  Gamifikované Ověření (Vzorová mini-hra)
                </h4>
                <p className="text-sm text-[#D9EAF5]/75 max-w-md mx-auto leading-relaxed">
                  Pro specifické týmy nebo zážitkové portály lze navrhnout interaktivní vizuální puzzle nebo logický postup. Klikněte na body v pořadí 1 → 2 → 3:
                </p>
              </div>

              {/* 3 interactive nodes */}
              <div className="flex justify-center items-center gap-6 py-4">
                {[1, 2, 3].map((nodeId) => {
                  const isSelected = gameSequence.includes(nodeId);
                  return (
                    <button
                      key={nodeId}
                      onClick={() => handleGameNodeClick(nodeId)}
                      className={`w-16 h-16 rounded-sm flex flex-col items-center justify-center font-heading font-bold text-lg border transition-all cursor-pointer ${
                        gameUnlocked
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : isSelected
                          ? 'bg-[#CE9B01] border-[#FFFFFF] text-[#050058] scale-105'
                          : 'bg-[#050058] border-white/10 text-[#D9EAF5] hover:border-[#CE9B01]'
                      }`}
                    >
                      <span>{nodeId}</span>
                      <span className="text-[9px] font-mono text-[#D9EAF5]/60">UZEL</span>
                    </button>
                  );
                })}
              </div>

              {gameUnlocked ? (
                <div className="p-3 rounded-sm bg-emerald-950/60 border border-emerald-500/50 max-w-sm mx-auto text-emerald-300 text-xs font-semibold">
                  🎉 Gratulace! Gamifikovaný vzor úspěšně ověřen — přístup udělen.
                </div>
              ) : (
                <div className="text-xs text-[#D9EAF5]/60 font-mono">
                  Zvoleno: [{gameSequence.join(' → ')}] (Požadováno: 1 → 2 → 3)
                </div>
              )}

              {gameSequence.length > 0 && (
                <button
                  onClick={() => {
                    setGameSequence([]);
                    setGameUnlocked(false);
                  }}
                  className="text-xs text-[#CE9B01] uppercase tracking-wider hover:underline font-bold"
                >
                  Resetovat puzzle
                </button>
              )}
            </div>
          )}

          {/* Bottom Callout */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#D9EAF5]/75 text-center sm:text-left">
              Chcete ve své firmě zkombinovat NFC karty pro skladníky s SMS kódem pro vedení?
            </p>
            <button
              onClick={() => onOpenQuestionnaire('automation')}
              className="px-5 py-2.5 rounded-sm bg-[#CE9B01] text-[#050058] font-bold text-xs uppercase tracking-widest hover:bg-[#e6b107] whitespace-nowrap transition-colors cursor-pointer"
            >
              Nakonfigurovat v dotazníku
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
