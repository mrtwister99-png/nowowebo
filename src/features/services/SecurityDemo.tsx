import React, { useState } from 'react';
import { Check, Gamepad2, Mail, Smartphone, Wifi, type LucideIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';

type SecurityTab = 'phone' | 'email' | 'nfc' | 'game';

const SECURITY_TABS: { id: SecurityTab; label: string; icon: LucideIcon }[] = [
  { id: 'phone', label: '1. Mobilní ověření', icon: Smartphone },
  { id: 'email', label: '2. Magický e-mail link', icon: Mail },
  { id: 'nfc', label: '3. NFC čip / karta', icon: Wifi },
  { id: 'game', label: '4. Gamifikované ověření', icon: Gamepad2 },
];

/* Zelená hláška o úspěšném ověření */
const SuccessNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
    <Check className="w-4 h-4 text-emerald-700" />
    <span>{children}</span>
  </div>
);

/* Interaktivní demo zakázkových metod přihlášení (SMS, e-mail link, NFC, hra) */
export const SecurityDemo: React.FC = () => {
  const [securityTab, setSecurityTab] = useState<SecurityTab>('phone');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [nfcAuthorized, setNfcAuthorized] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [gameVerified, setGameVerified] = useState(false);

  return (
    <Card className="sm:p-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bg border border-loyo-line text-xs font-mono font-bold uppercase text-loyo-blue mb-2">
          <span>INTERAKTIVNÍ DEMO ZABEZPEČENÍ</span>
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-loyo-ink">
          Zakázkové metody autentizace a přihlašování
        </h3>
        <p className="text-xs sm:text-sm text-loyo-body mt-1 max-w-3xl leading-relaxed">
          Vyzkoušejte si níže funkční prototypy jednotlivých metod přihlášení, které vám mohu do
          systému zakomponovat.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-loyo-line pb-3 mb-6">
        {SECURITY_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSecurityTab(id)}
            className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              securityTab === id
                ? 'bg-loyo-blue text-white'
                : 'bg-loyo-bg text-loyo-body hover:bg-[#e0e0e0]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
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
              <SuccessNote>Identita úspěšně ověřena přes mobilní zařízení!</SuccessNote>
            )}
          </div>
        )}

        {securityTab === 'email' && (
          <div className="space-y-4">
            <span className="font-mono text-xs font-bold uppercase text-loyo-blue block">
              Jednorázový magický link bez hesla
            </span>
            <p className="text-xs text-loyo-muted">
              Uživatel nemusí pamatovat žádné heslo. Kliknutím níže simulujete doručení a autorizaci
              linku:
            </p>
            <button
              type="button"
              onClick={() => setEmailVerified(true)}
              className="px-4 py-2 bg-loyo-blue text-white font-mono text-xs font-bold uppercase cursor-pointer"
            >
              Ověřit jednorázový token linku
            </button>
            {emailVerified && (
              <SuccessNote>Kryptografický e-mailový token ověřen. Přístup povolen.</SuccessNote>
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
              <SuccessNote>Hardware čip UID: 04:A2:88:1C úspěšně autorizován.</SuccessNote>
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
            {gameVerified && <SuccessNote>Bezpečnostní vzor souhlasí! Přihlášeno.</SuccessNote>}
          </div>
        )}
      </div>
    </Card>
  );
};
