import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Zap, Cpu, Smartphone, Wifi, Mail, Gamepad2, 
  Play, CheckCircle2, RefreshCw, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Sparkles, Layers, Sliders, AlertTriangle, Send, Inbox, Lock, Key, Award, Flame
} from 'lucide-react';
import { ServiceId } from '../types';

interface DemosSectionProps {
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

export const DemosSection: React.FC<DemosSectionProps> = ({ onOpenQuestionnaire }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'animations' | 'automation'>('security');

  // ==========================================
  // 1. SECURITY STATE
  // ==========================================
  const [securityMethod, setSecurityMethod] = useState<'nfc' | 'phone' | 'email' | 'game'>('nfc');
  
  // NFC state
  const [nfcDropped, setNfcDropped] = useState<boolean>(false);
  const [nfcVerifying, setNfcVerifying] = useState<boolean>(false);
  const [nfcAuthorized, setNfcAuthorized] = useState<boolean>(false);
  const [isDraggingNfc, setIsDraggingNfc] = useState<boolean>(false);

  // Phone state
  const [phoneInput, setPhoneInput] = useState<string>('+420 777 458 912');
  const [phoneSmsSent, setPhoneSmsSent] = useState<boolean>(false);
  const [phoneSmsCodeInput, setPhoneSmsCodeInput] = useState<string>('');
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>('');

  // Email state
  const [emailInput, setEmailInput] = useState<string>('klient@firma.cz');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailCodeInput, setEmailCodeInput] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [emailWaiting, setEmailWaiting] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');

  // Game state
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameLevel, setGameLevel] = useState<number>(1);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 20, y: 110 });
  const [obstacleY, setObstacleY] = useState<number>(30);
  const [obstacleDir, setObstacleDir] = useState<number>(1);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameCollision, setGameCollision] = useState<boolean>(false);
  const [gameCodeVerified, setGameCodeVerified] = useState<boolean>(false);
  const [gameCodeInput, setGameCodeInput] = useState<string>('');
  const [gameMsg, setGameMsg] = useState<string>('');
  const gameLoopRef = useRef<number | null>(null);

  // ==========================================
  // 2. ANIMATION DEMO STATE
  // ==========================================
  // Single active demo at a time, switchable via 1, 2, 3
  const [activeAnimVariant, setActiveAnimVariant] = useState<1 | 2 | 3>(1);

  // Variant 1: Brutal Kinetic Reactor
  const [reactorActive, setReactorActive] = useState<boolean>(false);
  const [reactorStage, setReactorStage] = useState<number>(0); // 0=idle, 1=charge, 2=burst, 3=shockwave, 4=stabilized
  const [reactorHits, setReactorHits] = useState<number>(0);
  const [energyLevel, setEnergyLevel] = useState<number>(12);

  // Variant 2: Long Fluid Transition
  const [fluidTime, setFluidTime] = useState<number>(0);
  const [fluidTension, setFluidTension] = useState<number>(50);
  const [isFluidFlowing, setIsFluidFlowing] = useState<boolean>(true);

  // Variant 3: Interactive Letter Lens (Magnify character on hover)
  const [hoveredCharIndex, setHoveredCharIndex] = useState<number | null>(null);
  const samplePhrase = "LoYo • PREMIUM • DEVELOPER • 2026";

  // ==========================================
  // 3. AUTOMATION STATE
  // ==========================================
  const [autoStep, setAutoStep] = useState<number>(0);
  const [autoRunning, setAutoRunning] = useState<boolean>(false);

  // Reset helpers
  const resetAllSecurity = () => {
    setNfcDropped(false);
    setNfcVerifying(false);
    setNfcAuthorized(false);
    setIsDraggingNfc(false);

    setPhoneSmsSent(false);
    setPhoneSmsCodeInput('');
    setPhoneVerified(false);
    setPhoneError('');

    setEmailSent(false);
    setEmailCodeInput('');
    setEmailVerified(false);
    setEmailWaiting(false);
    setEmailError('');

    setGameStarted(false);
    setGameLevel(1);
    setPlayerPos({ x: 20, y: 110 });
    setGameWon(false);
    setGameCollision(false);
    setGameCodeVerified(false);
    setGameCodeInput('');
    setGameMsg('');
  };

  // ----------------------------------------------------
  // NFC DRAG & DROP LOGIC
  // ----------------------------------------------------
  const handleNfcDrop = () => {
    setNfcDropped(true);
    setNfcVerifying(true);
    setTimeout(() => {
      setNfcVerifying(false);
      setNfcAuthorized(true);
    }, 1200);
  };

  // ----------------------------------------------------
  // PHONE SMS LOGIC
  // ----------------------------------------------------
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setPhoneSmsSent(true);
    setPhoneError('');
  };

  const handleVerifyPhoneCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneSmsCodeInput.replace(/\s+/g, '');
    if (clean === '1235') {
      setPhoneVerified(true);
      setPhoneError('');
    } else {
      setPhoneError('Neplatný kód. Zadejte přesně kód ze zprávy SMS: 1 2 3 5');
    }
  };

  // ----------------------------------------------------
  // EMAIL LOGIC
  // ----------------------------------------------------
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setEmailWaiting(true);
    setEmailError('');
    setTimeout(() => {
      setEmailWaiting(false);
      setEmailSent(true);
    }, 1000);
  };

  const handleVerifyEmailCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = emailCodeInput.replace(/\s+/g, '');
    if (clean === '1236') {
      setEmailVerified(true);
      setEmailError('');
    } else {
      setEmailError('Neplatný kód. Zadejte kód doručený v e-mailu: 1 2 3 6');
    }
  };

  // ----------------------------------------------------
  // MINI-GAME LOGIC (Level 1: Gate, Level 2: Moving Circle obstacle)
  // ----------------------------------------------------
  const startSecurityGame = () => {
    setGameStarted(true);
    setGameLevel(1);
    setPlayerPos({ x: 20, y: 110 });
    setObstacleY(30);
    setObstacleDir(1);
    setGameWon(false);
    setGameCollision(false);
    setGameCodeVerified(false);
    setGameCodeInput('');
    setGameMsg('LEVEL 1: Šipkami přejděte doprava do zelené brány.');
  };

  // Keyboard navigation for game
  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 14;
      const arenaW = 440;
      const arenaH = 220;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      setPlayerPos(prev => {
        let nx = prev.x;
        let ny = prev.y;

        if (e.key === 'ArrowUp') ny = Math.max(12, ny - step);
        if (e.key === 'ArrowDown') ny = Math.min(arenaH - 32, ny + step);
        if (e.key === 'ArrowLeft') nx = Math.max(12, nx - step);
        if (e.key === 'ArrowRight') nx = Math.min(arenaW - 32, nx + step);

        return { x: nx, y: ny };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameWon]);

  // Mobile on-screen movement helper
  const movePlayerDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (!gameStarted || gameWon) return;
    const step = 18;
    const arenaW = 440;
    const arenaH = 220;

    setPlayerPos(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (dir === 'up') ny = Math.max(12, ny - step);
      if (dir === 'down') ny = Math.min(arenaH - 32, ny + step);
      if (dir === 'left') nx = Math.max(12, nx - step);
      if (dir === 'right') nx = Math.min(arenaW - 32, nx + step);
      return { x: nx, y: ny };
    });
  };

  // Obstacle loop & Collision check
  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const interval = setInterval(() => {
      // Move obstacle in Level 2
      if (gameLevel === 2) {
        setObstacleY(prevY => {
          let nextY = prevY + obstacleDir * 4.5;
          if (nextY > 175) {
            setObstacleDir(-1);
            nextY = 175;
          } else if (nextY < 20) {
            setObstacleDir(1);
            nextY = 20;
          }
          return nextY;
        });
      }

      // Check Gate collision
      const gateX = 390;
      const playerSize = 22;

      // Check win for Level 1
      if (gameLevel === 1) {
        if (playerPos.x >= gateX - 10) {
          // Level 1 passed -> enter Level 2!
          setGameLevel(2);
          setPlayerPos({ x: 20, y: 110 });
          setObstacleY(20);
          setObstacleDir(1);
          setGameMsg('VÝBORNĚ! Level 1 splněn. V LEVELU 2 pozor na jezdící kolečko uprostřed!');
        }
      }

      // Check collision in Level 2
      if (gameLevel === 2) {
        // Obstacle is at X: 215, Y: obstacleY, radius: 18
        const obsX = 215;
        const obsY = obstacleY;
        const obsRadius = 18;

        const playerCenterX = playerPos.x + playerSize / 2;
        const playerCenterY = playerPos.y + playerSize / 2;

        const dist = Math.hypot(playerCenterX - obsX, playerCenterY - obsY);
        if (dist < obsRadius + playerSize / 2 - 2) {
          // HIT! Restart Level 2
          setGameCollision(true);
          setPlayerPos({ x: 20, y: 110 });
          setGameMsg('KOLIZE S PŘEKÁŽKOU! Začínáte Level 2 od startu.');
          setTimeout(() => setGameCollision(false), 800);
        }

        // Gate check in Level 2
        if (playerPos.x >= gateX - 10) {
          setGameWon(true);
          setGameMsg('GRATULACE! Brána EXIT odemčena. Váš bezpečnostní kód je: 1 2 3 7');
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [gameStarted, gameLevel, playerPos, obstacleY, obstacleDir, gameWon]);

  const handleVerifyGameCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = gameCodeInput.replace(/\s+/g, '');
    if (clean === '1237') {
      setGameCodeVerified(true);
    } else {
      alert('Zadejte kód získaný z úspěšné hry: 1 2 3 7');
    }
  };

  // ----------------------------------------------------
  // ANIMATIONS LOOP FOR FLUID (Variant 2)
  // ----------------------------------------------------
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (isFluidFlowing) {
        setFluidTime(prev => prev + 0.04);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isFluidFlowing]);

  // Variant 1 multi-stage trigger
  const triggerReactor = () => {
    if (reactorActive) return;
    setReactorActive(true);
    setReactorHits(prev => prev + 1);
    setReactorStage(1);
    setEnergyLevel(35);

    // Stage 1: Overload charge
    setTimeout(() => {
      setReactorStage(2);
      setEnergyLevel(78);

      // Stage 2: Shockwave blast
      setTimeout(() => {
        setReactorStage(3);
        setEnergyLevel(100);

        // Stage 3: Expansion & morph
        setTimeout(() => {
          setReactorStage(4);
          setEnergyLevel(94);

          // Stage 4: Stabilized
          setTimeout(() => {
            setReactorActive(false);
          }, 1800);
        }, 1200);
      }, 900);
    }, 800);
  };

  // ----------------------------------------------------
  // AUTOMATION SIMULATOR PIPELINE
  // ----------------------------------------------------
  const runAutomationPipeline = () => {
    setAutoRunning(true);
    setAutoStep(1);
    setTimeout(() => {
      setAutoStep(2);
      setTimeout(() => {
        setAutoStep(3);
        setTimeout(() => {
          setAutoStep(4);
          setAutoRunning(false);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <section id="ukazky" className="py-20 bg-[#ededed] text-[#18181b] border-b border-[#d0d0d0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-l-4 border-[#18181b] pl-5 sm:pl-6 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#dbdbdb] text-[#18181b] text-[11px] font-mono font-bold uppercase tracking-wider">
              INTERAKTIVNÍ LABORATOŘ • NEJSVĚTLEJŠÍ ŠEDÁ
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#18181b] tracking-tight">
            Ukázky: Zabezpečení, Animace & Automatizace
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#444] max-w-3xl leading-relaxed">
            Vyzkoušejte si přímo v prohlížeči autentické mechanismy. Zabezpečení přetažením čipu, reálnou SMS i e-mail simulaci, interaktivní hru k autorizaci i kinetické animace s reakcí na kurzor myši.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#dbdbdb] p-1.5 border border-[#c2c2c2] max-w-xl">
          <button
            onClick={() => { setActiveTab('security'); resetAllSecurity(); }}
            className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'security'
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'text-[#444] hover:bg-[#c8c8c8]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#CDA24D]" />
            <span>1. Zabezpečení</span>
          </button>

          <button
            onClick={() => setActiveTab('animations')}
            className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'animations'
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'text-[#444] hover:bg-[#c8c8c8]'
            }`}
          >
            <Zap className="w-4 h-4 text-[#ac0001]" />
            <span>2. Animace</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'automation'
                ? 'bg-[#18181b] text-white shadow-xs'
                : 'text-[#444] hover:bg-[#c8c8c8]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#040b8d]" />
            <span>3. Automatizace</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ZABEZPEČENÍ (NFC drag-and-drop, SMS 1235, Email 1236, Hra 1237)   */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="bg-[#ededed] border-2 border-[#c2c2c2] p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
            {/* Header with Sub-tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#dbdbdb] mb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#8a6b28] font-bold block mb-1">
                  Propracovaný autentizační polygon
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[#18181b]">
                  Zvolte způsob ověření identity
                </h3>
              </div>

              {/* Sub-selector buttons */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#dbdbdb] p-1 border border-[#c8c8c8]">
                <button
                  onClick={() => { setSecurityMethod('nfc'); resetAllSecurity(); }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    securityMethod === 'nfc' ? 'bg-[#CDA24D] text-[#18181b]' : 'text-[#555] hover:bg-[#c8c8c8]'
                  }`}
                >
                  NFC Přetažení
                </button>
                <button
                  onClick={() => { setSecurityMethod('phone'); resetAllSecurity(); }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    securityMethod === 'phone' ? 'bg-[#040b8d] text-white' : 'text-[#555] hover:bg-[#c8c8c8]'
                  }`}
                >
                  Telefon (SMS)
                </button>
                <button
                  onClick={() => { setSecurityMethod('email'); resetAllSecurity(); }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    securityMethod === 'email' ? 'bg-[#ac0001] text-white' : 'text-[#555] hover:bg-[#c8c8c8]'
                  }`}
                >
                  E-mail Token
                </button>
                <button
                  onClick={() => { setSecurityMethod('game'); resetAllSecurity(); }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    securityMethod === 'game' ? 'bg-[#18181b] text-white' : 'text-[#555] hover:bg-[#c8c8c8]'
                  }`}
                >
                  Ověřovací Mini-hra
                </button>
              </div>
            </div>

            {/* METHOD 1: NFC DRAG-AND-DROP */}
            {securityMethod === 'nfc' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#dbdbdb] border border-[#c2c2c2] text-[#8a6b28] text-xs font-mono font-bold">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>NFC HARDWARE CHIP SIMULÁTOR</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-[#18181b]">
                    Fyzické přiložení: Přetáhněte čtvereček do čtečky
                  </h4>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                    Uchopte myší (nebo klepněte na mobilu) čtvereček představující váš NFC čip a přetáhněte ho přímo do cílové čtečky. Teprve po fyzickém přiložení čipu dojde k přečtení kryptografického klíče a autorizaci.
                  </p>

                  <div className="bg-[#dbdbdb] p-4 border border-[#c2c2c2] text-xs font-mono space-y-1 text-[#333]">
                    <div>Frekvence: <span className="text-[#040b8d] font-bold">13.56 MHz High-Frequency</span></div>
                    <div>Protokol: <span className="text-[#8a6b28] font-bold">ISO/IEC 14443-A Hardware Token</span></div>
                    <div>Stav čtečky: {nfcAuthorized ? <span className="text-[#040b8d] font-bold">AUTORIZOVÁNO (Odemčeno)</span> : nfcVerifying ? <span className="text-[#CDA24D] font-bold">ČTU HARDWARE TOKEN...</span> : <span className="text-[#666]">ČEKÁ NA PŘILOŽENÍ ČIPU</span>}</div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleNfcDrop}
                      disabled={nfcAuthorized || nfcVerifying}
                      className="px-4 py-2 bg-[#dbdbdb] hover:bg-[#d0d0d0] border border-[#c2c2c2] text-[#18181b] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Wifi className="w-3.5 h-3.5 text-[#CDA24D]" />
                      <span>Rychlé přiložení jedním klikem</span>
                    </button>

                    {nfcAuthorized && (
                      <button
                        onClick={resetAllSecurity}
                        className="text-xs text-[#18181b] underline font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Resetovat čip
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Drag & Drop Arena */}
                <div className="bg-[#dbdbdb] border-2 border-[#c2c2c2] p-6 text-center flex flex-col items-center justify-center min-h-[300px] relative select-none">
                  {!nfcAuthorized ? (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                      {/* DRAGGABLE NFC CHIP SQUARE */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#555] uppercase tracking-wider">
                          VÁŠ NFC ČIP
                        </span>
                        <div
                          draggable
                          onDragStart={() => setIsDraggingNfc(true)}
                          onDragEnd={() => setIsDraggingNfc(false)}
                          onClick={handleNfcDrop}
                          className={`w-24 h-24 bg-[#18181b] border-2 border-[#CDA24D] shadow-md flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-white transition-all transform hover:scale-105 ${
                            nfcDropped ? 'opacity-20 pointer-events-none scale-90' : 'animate-pulse'
                          }`}
                          title="Přetáhněte do čtečky vpravo nebo klikněte"
                        >
                          <Wifi className="w-6 h-6 text-[#CDA24D] mb-1" />
                          <span className="font-mono text-[9px] uppercase tracking-tighter text-[#CDA24D]">
                            NFC CHIP
                          </span>
                          <span className="font-sans text-[8px] text-[#aaa]">Přetáhněte mě</span>
                        </div>
                      </div>

                      {/* ARROW INDICATOR */}
                      <div className="text-[#888] hidden sm:flex flex-col items-center">
                        <ArrowRight className="w-6 h-6 animate-bounce" />
                        <span className="text-[10px] font-mono">PŘILOŽIT</span>
                      </div>

                      {/* TARGET NFC READER SQUARE */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#040b8d] uppercase tracking-wider">
                          CÍLOVÁ ČTEČKA
                        </span>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleNfcDrop();
                          }}
                          className={`w-28 h-28 border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                            nfcVerifying
                              ? 'border-[#040b8d] bg-[#040b8d]/10 animate-pulse'
                              : isDraggingNfc
                              ? 'border-[#CDA24D] bg-[#CDA24D]/20 scale-105'
                              : 'border-[#999] bg-[#ededed]'
                          }`}
                        >
                          {nfcVerifying ? (
                            <>
                              <RefreshCw className="w-7 h-7 text-[#040b8d] animate-spin mb-1" />
                              <span className="font-mono text-[9px] text-[#040b8d] font-bold">ČTU DATA...</span>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 border border-[#999] flex items-center justify-center mb-1 text-[#666]">
                                <Lock className="w-4 h-4" />
                              </div>
                              <span className="font-mono text-[9px] text-[#666] font-semibold text-center px-1">
                                Sem vložte čip
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* AUTHORIZED SUCCESS SCREEN */
                    <div className="py-6 space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 mx-auto bg-[#040b8d] text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-8 h-8 text-[#CDA24D]" />
                      </div>
                      <div>
                        <span className="font-heading font-extrabold text-xl text-[#040b8d] block">
                          NFC ČIP ÚSPĚŠNĚ AUTORIZOVÁN!
                        </span>
                        <span className="text-xs text-[#555] block mt-1 font-mono">
                          Hardware ID: 0x9F42-B8E1 • Relace otevřena s nejvyšším oprávněním.
                        </span>
                      </div>
                      <button
                        onClick={resetAllSecurity}
                        className="px-4 py-2 bg-[#18181b] hover:bg-[#040b8d] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Ověřit další čip
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* METHOD 2: TELEFON SMS (KÓD: 1 2 3 5) */}
            {securityMethod === 'phone' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#dbdbdb] border border-[#c2c2c2] text-[#040b8d] text-xs font-mono font-bold">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>DVOJITÉ OVĚŘENÍ PŘES MOBIL</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-[#18181b]">
                    Vyplňte telefonní číslo a potvrďte
                  </h4>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                    Zadejte telefonní číslo. Po kliknutí na odeslání vám na simulovaný telefon vpravo okamžitě dorazí SMS zpráva obsahující bezpečnostní kód.
                  </p>

                  <form onSubmit={handleSendSms} className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#18181b] mb-1">
                        Telefonní číslo pro zaslání SMS:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          required
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+420 777 000 000"
                          className="flex-1 px-3.5 py-2.5 bg-[#ededed] border border-[#c8c8c8] text-xs font-mono font-bold text-[#18181b] focus:outline-none focus:border-[#040b8d]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-[#040b8d] hover:bg-[#030869] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Odeslat SMS</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Code Verification Input Form */}
                  {phoneSmsSent && !phoneVerified && (
                    <form onSubmit={handleVerifyPhoneCode} className="space-y-3 pt-3 border-t border-[#dbdbdb] animate-in fade-in">
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#18181b] mb-1">
                          Zadejte kód ze zprávy SMS:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={phoneSmsCodeInput}
                            onChange={(e) => setPhoneSmsCodeInput(e.target.value)}
                            placeholder="Zadejte kód (1 2 3 5)"
                            className="w-48 px-3.5 py-2 bg-[#ededed] border border-[#c8c8c8] text-sm font-mono font-bold tracking-widest text-[#18181b] focus:outline-none focus:border-[#040b8d]"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#18181b] hover:bg-[#040b8d] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                          >
                            Potvrdit kód
                          </button>
                        </div>
                        {phoneError && (
                          <span className="text-[11px] text-[#ac0001] font-semibold mt-1 block">
                            {phoneError}
                          </span>
                        )}
                      </div>
                    </form>
                  )}

                  {phoneVerified && (
                    <div className="p-3 bg-[#dbdbdb] border border-[#040b8d] flex items-center gap-3 animate-in zoom-in-95">
                      <CheckCircle2 className="w-5 h-5 text-[#040b8d] shrink-0" />
                      <span className="text-xs font-bold text-[#040b8d]">
                        Telefonické ověření úspěšné! Váš profil byl plně autorizován.
                      </span>
                    </div>
                  )}
                </div>

                {/* Realistic Smartphone Screen Simulator */}
                <div className="bg-[#dbdbdb] border border-[#c2c2c2] p-4 flex flex-col items-center justify-center">
                  <div className="w-[260px] bg-[#18181b] p-3 rounded-2xl border-4 border-[#333] shadow-xl text-white relative">
                    {/* Phone speaker & notch */}
                    <div className="w-16 h-2 bg-[#333] mx-auto rounded-full mb-3" />
                    
                    <div className="bg-[#242426] rounded-xl p-3 min-h-[220px] flex flex-col justify-between">
                      {/* Top status bar */}
                      <div className="flex items-center justify-between text-[10px] text-[#888] font-mono border-b border-[#333] pb-1.5 mb-2">
                        <span>14:32</span>
                        <div className="flex items-center gap-1">
                          <span>5G</span>
                          <span>98%</span>
                        </div>
                      </div>

                      {/* Screen content */}
                      {!phoneSmsSent ? (
                        <div className="text-center py-8 text-[#777] text-xs">
                          <Smartphone className="w-8 h-8 mx-auto mb-2 text-[#555]" />
                          <span>Čekám na odeslání požadavku na SMS...</span>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                          {/* SMS Notification Banner */}
                          <div className="bg-[#ededed] text-[#18181b] p-3 rounded-lg shadow-md border-l-4 border-[#040b8d]">
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#555] mb-1">
                              <span className="font-bold text-[#040b8d]">SMS • LoYo Security</span>
                              <span>Právě teď</span>
                            </div>
                            <p className="text-xs font-mono font-bold text-[#18181b] leading-tight">
                              Váš jednorázový kód je : 1 2 3 5
                            </p>
                            <span className="text-[9px] text-[#777] block mt-1">Platnost 5 minut. Nikomu nesdělujte.</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setPhoneSmsCodeInput('1 2 3 5');
                              setPhoneVerified(true);
                            }}
                            className="w-full py-1.5 bg-[#040b8d] hover:bg-[#030869] text-white text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-colors"
                          >
                            Automaticky vyplnit kód 1235
                          </button>
                        </div>
                      )}

                      {/* Bottom home bar */}
                      <div className="w-20 h-1 bg-[#555] mx-auto rounded-full mt-3" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* METHOD 3: EMAIL (KÓD: 1 2 3 6) */}
            {securityMethod === 'email' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#dbdbdb] border border-[#c2c2c2] text-[#ac0001] text-xs font-mono font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>BEZHESLOVÝ TOKEN PROSTŘEDNICTVÍM E-MAILU</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-[#18181b]">
                    Vyplňte e-mail a vyčkejte na doručení kódu
                  </h4>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                    Zadejte e-mailovou adresu. Po odeslání vám do simulované e-mailové schránky dorazí zpráva s bezpečnostním kódem.
                  </p>

                  <form onSubmit={handleSendEmail} className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#18181b] mb-1">
                        Váš e-mail:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="vas@email.cz"
                          className="flex-1 px-3.5 py-2.5 bg-[#ededed] border border-[#c8c8c8] text-xs font-mono font-bold text-[#18181b] focus:outline-none focus:border-[#ac0001]"
                        />
                        <button
                          type="submit"
                          disabled={emailWaiting}
                          className="px-4 py-2.5 bg-[#ac0001] hover:bg-[#850001] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{emailWaiting ? 'Odesílám...' : 'Odeslat na e-mail'}</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Code Verification Input Form */}
                  {emailSent && !emailVerified && (
                    <form onSubmit={handleVerifyEmailCode} className="space-y-3 pt-3 border-t border-[#dbdbdb] animate-in fade-in">
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#18181b] mb-1">
                          Zadejte kód doručený v e-mailu:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={emailCodeInput}
                            onChange={(e) => setEmailCodeInput(e.target.value)}
                            placeholder="Zadejte kód (1 2 3 6)"
                            className="w-48 px-3.5 py-2 bg-[#ededed] border border-[#c8c8c8] text-sm font-mono font-bold tracking-widest text-[#18181b] focus:outline-none focus:border-[#ac0001]"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#18181b] hover:bg-[#ac0001] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                          >
                            Potvrdit kód
                          </button>
                        </div>
                        {emailError && (
                          <span className="text-[11px] text-[#ac0001] font-semibold mt-1 block">
                            {emailError}
                          </span>
                        )}
                      </div>
                    </form>
                  )}

                  {emailVerified && (
                    <div className="p-3 bg-[#dbdbdb] border border-[#ac0001] flex items-center gap-3 animate-in zoom-in-95">
                      <CheckCircle2 className="w-5 h-5 text-[#ac0001] shrink-0" />
                      <span className="text-xs font-bold text-[#ac0001]">
                        E-mailový token 1236 ověřen! Systém je bezpečně odemčen.
                      </span>
                    </div>
                  )}
                </div>

                {/* Realistic Email Client Simulator */}
                <div className="bg-[#dbdbdb] border border-[#c2c2c2] p-4 flex flex-col justify-center min-h-[260px]">
                  <div className="bg-[#ededed] border border-[#c8c8c8] p-4 text-xs shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#dbdbdb] pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-[#ac0001]" />
                        <span className="font-heading font-extrabold uppercase text-[11px] text-[#18181b]">
                          Doručená pošta • LoYo Mail Gateway
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#777]">Právě teď</span>
                    </div>

                    {!emailSent ? (
                      <div className="py-8 text-center text-[#777]">
                        <Mail className="w-8 h-8 mx-auto mb-2 text-[#999]" />
                        <span>Čekám na vyplnění e-mailu a odeslání...</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5 animate-in fade-in duration-200">
                        <div className="font-mono text-[11px] text-[#555] space-y-0.5">
                          <div><strong>Od:</strong> security@loyo.dev</div>
                          <div><strong>Pro:</strong> {emailInput}</div>
                          <div><strong>Předmět:</strong> Váš bezpečnostní kód pro ověření</div>
                        </div>

                        <div className="p-3 bg-[#dbdbdb] border-l-3 border-[#ac0001] space-y-1 mt-2">
                          <p className="text-xs text-[#333]">
                            Dobrý den, na základě vašeho vyžádání vám zasíláme bezpečnostní kód:
                          </p>
                          <p className="font-mono font-extrabold text-sm text-[#ac0001] tracking-wider pt-1">
                            Váš jednorázový kód je : 1 2 3 6
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEmailCodeInput('1 2 3 6');
                            setEmailVerified(true);
                          }}
                          className="px-3 py-1.5 bg-[#ac0001] hover:bg-[#850001] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Kliknutím přenést kód 1236 do pole
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* METHOD 4: MINI-GAME (Šipkami do brány -> Level 2 jezdící kolečko -> EXIT kód: 1 2 3 7) */}
            {securityMethod === 'game' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#dbdbdb] border border-[#c2c2c2] text-[#18181b] text-xs font-mono font-bold mb-1">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>HERNÍ BOT-RESISTANT MECHANIKA</span>
                    </div>
                    <h4 className="font-heading font-bold text-lg text-[#18181b]">
                      Herní test: Ovládejte čtvereček šipkami a projděte branou
                    </h4>
                    <p className="text-xs sm:text-sm text-[#555]">
                      Level 1: Přejděte doprava do brány. Level 2: Projděte kolem jezdícího kolečka a vezměte kód v bráně EXIT!
                    </p>
                  </div>

                  {!gameStarted && (
                    <button
                      onClick={startSecurityGame}
                      className="px-5 py-2.5 bg-[#18181b] hover:bg-[#040b8d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Spustit test ověření</span>
                    </button>
                  )}
                </div>

                {/* GAME CANVAS ARENA */}
                {gameStarted && (
                  <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-4 sm:p-6 select-none">
                    {/* Game Status Bar */}
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-3 border-b border-[#c8c8c8] pb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-[#18181b] text-white">
                          LEVEL {gameLevel} / 2
                        </span>
                        <span className="text-[#040b8d]">{gameMsg}</span>
                      </div>
                      <button
                        onClick={startSecurityGame}
                        className="text-[11px] underline text-[#555] hover:text-[#18181b] cursor-pointer"
                      >
                        Začít znovu
                      </button>
                    </div>

                    {/* 2D Playing Field */}
                    <div className="relative w-full max-w-[440px] mx-auto h-[220px] bg-[#ededed] border-2 border-[#18181b] overflow-hidden">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:20px_20px]" />

                      {/* START ZONE LABEL */}
                      <div className="absolute left-2 top-2 text-[9px] font-mono text-[#888] font-bold">
                        START
                      </div>

                      {/* PLAYER SQUARE */}
                      <div
                        className={`absolute w-[22px] h-[22px] bg-[#040b8d] border border-[#18181b] shadow-sm transition-all duration-75 flex items-center justify-center text-[9px] text-white font-bold ${
                          gameCollision ? 'bg-[#ac0001] scale-125' : ''
                        }`}
                        style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
                      >
                        LY
                      </div>

                      {/* LEVEL 2 MOVING OBSTACLE (Jezdící kolečko ve sloupečku) */}
                      {gameLevel === 2 && (
                        <>
                          {/* Obstacle track lane */}
                          <div className="absolute left-[214px] top-0 bottom-0 w-[2px] bg-[#ac0001]/20 border-l border-dashed border-[#ac0001]" />
                          <div
                            className="absolute w-[36px] h-[36px] rounded-full bg-[#ac0001] border-2 border-white shadow-md flex items-center justify-center transition-all duration-75 text-white"
                            style={{ left: `200px`, top: `${obstacleY - 9}px` }}
                          >
                            <Flame className="w-4 h-4 animate-spin" />
                          </div>
                        </>
                      )}

                      {/* GATE / EXIT PORTAL */}
                      <div
                        className={`absolute right-2 top-[30px] bottom-[30px] w-[28px] border-2 flex flex-col items-center justify-center font-mono font-bold text-[9px] tracking-tighter ${
                          gameLevel === 1
                            ? 'bg-[#CDA24D] border-[#8a6b28] text-[#18181b] animate-pulse'
                            : 'bg-[#040b8d] border-[#030869] text-white animate-pulse'
                        }`}
                      >
                        <span className="rotate-90">
                          {gameLevel === 1 ? 'BRÁNA 1' : 'EXIT'}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Touch Controls & Keyboard Instructions */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-[11px] font-mono text-[#555]">
                        Ovládání: Klávesové šipky ⬅️ ⬆️ ⬇️ ➡️ nebo dotyková tlačítka:
                      </span>

                      {/* On-screen Direction Pad */}
                      <div className="grid grid-cols-3 gap-1 w-36">
                        <div />
                        <button
                          type="button"
                          onClick={() => movePlayerDirection('up')}
                          className="p-2 bg-[#ededed] hover:bg-[#d0d0d0] border border-[#c8c8c8] flex items-center justify-center cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <div />
                        <button
                          type="button"
                          onClick={() => movePlayerDirection('left')}
                          className="p-2 bg-[#ededed] hover:bg-[#d0d0d0] border border-[#c8c8c8] flex items-center justify-center cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePlayerDirection('down')}
                          className="p-2 bg-[#ededed] hover:bg-[#d0d0d0] border border-[#c8c8c8] flex items-center justify-center cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePlayerDirection('right')}
                          className="p-2 bg-[#ededed] hover:bg-[#d0d0d0] border border-[#c8c8c8] flex items-center justify-center cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* WON MODAL / CODE REVEAL (KÓD: 1 2 3 7) */}
                    {gameWon && (
                      <div className="mt-5 p-4 bg-[#ededed] border-2 border-[#040b8d] space-y-3 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 text-[#040b8d]">
                          <Award className="w-6 h-6 text-[#CDA24D]" />
                          <h5 className="font-heading font-extrabold text-base">
                            BRÁNA EXIT PROJITA! ÚSPĚŠNĚ VYGENEROVÁN KÓD:
                          </h5>
                        </div>
                        <div className="p-3 bg-[#dbdbdb] border border-[#c2c2c2] text-center">
                          <span className="font-mono font-black text-xl text-[#040b8d] tracking-widest block">
                            1 2 3 7
                          </span>
                        </div>

                        {!gameCodeVerified ? (
                          <form onSubmit={handleVerifyGameCode} className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={gameCodeInput}
                              onChange={(e) => setGameCodeInput(e.target.value)}
                              placeholder="Zadejte kód 1237"
                              className="flex-1 px-3 py-2 bg-[#dbdbdb] border border-[#c8c8c8] text-xs font-mono font-bold text-[#18181b]"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#040b8d] text-white font-bold text-xs uppercase cursor-pointer"
                            >
                              Autorizovat hrou
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-bold text-[#040b8d]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Identita potvrzena mini-hrou s kódem 1 2 3 7!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ANIMACE (Vždy 1 ukázka, přepínání [ 1 ] [ 2 ] [ 3 ])              */}
        {/* ========================================================================= */}
        {activeTab === 'animations' && (
          <div className="bg-[#ededed] border-2 border-[#c2c2c2] p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
            {/* Header with Switcher 1, 2, 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dbdbdb] mb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#ac0001] font-bold block mb-1">
                  Kinetická laboratoř • Jednotlivé ukázky
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[#18181b]">
                  {activeAnimVariant === 1 && '1. Brutální kinetický reaktor (Vícefázový impulz)'}
                  {activeAnimVariant === 2 && '2. Prodloužený fluidní přechod & tekutá metamorfóza'}
                  {activeAnimVariant === 3 && '3. Dynamická typografická čočka (Zvětšení při najetí kurzoru)'}
                </h3>
              </div>

              {/* Toggle buttons [ 1 ] [ 2 ] [ 3 ] */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#666] font-bold mr-1">
                  PŘEPNOUT UKÁZKU:
                </span>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setActiveAnimVariant(num as 1 | 2 | 3)}
                    className={`w-10 h-10 flex items-center justify-center font-mono font-black text-sm border-2 cursor-pointer transition-all ${
                      activeAnimVariant === num
                        ? 'bg-[#18181b] border-[#18181b] text-white shadow-md scale-105'
                        : 'bg-[#dbdbdb] border-[#c2c2c2] text-[#444] hover:bg-[#c8c8c8]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* VARIANT 1: BRUTÁLNÍ KINETICKÝ REAKTOR (Delší, propracovaný, multi-fázový) */}
            {activeAnimVariant === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555]">
                  <p>
                    Klikněte na centrální reaktor. Spustí se delší, 4-stupňová kinetická rázová vlna s expandující geometrií a telemetrickým feedbackem.
                  </p>
                  <div className="font-mono font-bold text-[#ac0001]">
                    POČET IMPULZŮ: {reactorHits} • ENERGIE: {energyLevel}%
                  </div>
                </div>

                <div className="bg-[#dbdbdb] border-2 border-[#c2c2c2] p-8 sm:p-12 text-center relative overflow-hidden min-h-[360px] flex flex-col items-center justify-center">
                  {/* Expanding Shockwave Rings */}
                  {reactorStage >= 1 && (
                    <div className="absolute w-44 h-44 rounded-full border-2 border-[#ac0001] animate-ping pointer-events-none opacity-40" />
                  )}
                  {reactorStage >= 2 && (
                    <div className="absolute w-72 h-72 rounded-full border border-[#040b8d] animate-ping pointer-events-none opacity-25" />
                  )}
                  {reactorStage >= 3 && (
                    <div className="absolute w-96 h-96 border border-dashed border-[#CDA24D] animate-spin pointer-events-none opacity-30" />
                  )}

                  {/* Main Kinetic Interactive Button / Trigger */}
                  <div
                    onClick={triggerReactor}
                    className={`relative z-10 w-36 h-36 sm:w-44 sm:h-44 mx-auto flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 ${
                      reactorStage === 1 ? 'scale-90 bg-[#ac0001] text-white shadow-2xl rotate-45' :
                      reactorStage === 2 ? 'scale-125 bg-[#040b8d] text-white shadow-2xl -rotate-45' :
                      reactorStage === 3 ? 'scale-110 bg-[#CDA24D] text-[#18181b] shadow-2xl rotate-90' :
                      reactorStage === 4 ? 'scale-100 bg-[#18181b] text-white' :
                      'bg-[#18181b] text-white hover:scale-105 hover:bg-[#ac0001]'
                    }`}
                  >
                    <Flame className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 transition-transform ${reactorActive ? 'animate-bounce' : ''}`} />
                    <span className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider">
                      {reactorStage === 0 && 'AKTIVOVAT REAKTOR'}
                      {reactorStage === 1 && 'FÁZE 1: PŘETÍŽENÍ'}
                      {reactorStage === 2 && 'FÁZE 2: EXPANZE'}
                      {reactorStage === 3 && 'FÁZE 3: REKONFIGURACE'}
                      {reactorStage === 4 && 'STABILIZOVÁNO'}
                    </span>
                    <span className="text-[9px] font-mono opacity-75 mt-1">
                      {reactorActive ? 'Probíhá sekvence...' : 'Klikněte pro impulz'}
                    </span>
                  </div>

                  {/* Telemetry Stage Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mt-8 text-left text-xs font-mono">
                    <div className={`p-2.5 border ${reactorStage >= 1 ? 'bg-[#ededed] border-[#ac0001] text-[#ac0001]' : 'border-[#bbb] text-[#888]'}`}>
                      <span className="block font-bold">1. Kinetický ráz</span>
                      <span className="text-[10px]">Overload Trigger</span>
                    </div>
                    <div className={`p-2.5 border ${reactorStage >= 2 ? 'bg-[#ededed] border-[#040b8d] text-[#040b8d]' : 'border-[#bbb] text-[#888]'}`}>
                      <span className="block font-bold">2. Tlaková vlna</span>
                      <span className="text-[10px]">Shockwave Blast</span>
                    </div>
                    <div className={`p-2.5 border ${reactorStage >= 3 ? 'bg-[#ededed] border-[#8a6b28] text-[#8a6b28]' : 'border-[#bbb] text-[#888]'}`}>
                      <span className="block font-bold">3. Morfologie</span>
                      <span className="text-[10px]">Dynamic Matrix</span>
                    </div>
                    <div className={`p-2.5 border ${reactorStage >= 4 ? 'bg-[#ededed] border-[#18181b] text-[#18181b]' : 'border-[#bbb] text-[#888]'}`}>
                      <span className="block font-bold">4. Ustálení</span>
                      <span className="text-[10px]">Equilibrium</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VARIANT 2: PRODLOUŽENÝ FLUIDNÍ PŘECHOD (Tekuté vlny, plynulá interpolace) */}
            {activeAnimVariant === 2 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555]">
                  <p>
                    Dlouhý, ultra-hladký organický tok s proměnlivým napětím povrchu a fluidními křivkami.
                  </p>
                  <div className="flex items-center gap-3">
                    <label className="font-mono text-xs font-bold text-[#18181b]">Napětí vlny:</label>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={fluidTension}
                      onChange={(e) => setFluidTension(Number(e.target.value))}
                      className="accent-[#ac0001] cursor-pointer"
                    />
                    <button
                      onClick={() => setIsFluidFlowing(!isFluidFlowing)}
                      className="px-3 py-1 bg-[#18181b] text-white text-[10px] font-mono uppercase font-bold cursor-pointer"
                    >
                      {isFluidFlowing ? 'Pozastavit' : 'Spustit tok'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#dbdbdb] border-2 border-[#c2c2c2] p-6 text-center relative overflow-hidden min-h-[340px] flex items-center justify-center">
                  {/* Fluid Wave Canvas SVG */}
                  <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 240">
                    <defs>
                      <linearGradient id="fluidGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#040b8d" stopOpacity="0.85" />
                        <stop offset="50%" stopColor="#CDA24D" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#ac0001" stopOpacity="0.85" />
                      </linearGradient>
                      <linearGradient id="fluidGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ac0001" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#040b8d" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>

                    {/* Wave Layer 1 */}
                    <path
                      d={`M 0 120 Q 150 ${120 - Math.sin(fluidTime) * fluidTension} 300 120 T 600 120 L 600 240 L 0 240 Z`}
                      fill="url(#fluidGrad2)"
                      className="transition-all duration-300 ease-out"
                    />

                    {/* Wave Layer 2 (Opposite phase, long wave) */}
                    <path
                      d={`M 0 130 Q 150 ${130 + Math.cos(fluidTime * 0.7) * (fluidTension * 1.2)} 300 130 T 600 130 L 600 240 L 0 240 Z`}
                      fill="url(#fluidGrad1)"
                      className="transition-all duration-300 ease-out"
                    />

                    {/* Interactive Floating Morphing Node */}
                    <circle
                      cx={300 + Math.sin(fluidTime * 1.2) * 140}
                      cy={110 + Math.cos(fluidTime * 0.9) * 40}
                      r="16"
                      fill="#18181b"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                    />
                  </svg>

                  {/* Floating Overlay Badge */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-white tracking-widest drop-shadow-md">
                      FLUID MOTION ARCHITECTURE
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#dbdbdb] mt-1 drop-shadow">
                      Bézier Harmonic Interpolation • 60 FPS
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* VARIANT 3: DYNAMICKÁ TYPOGRAFICKÁ ČOČKA (Zvětšení písmenka po najetí myši) */}
            {activeAnimVariant === 3 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555]">
                  <p>
                    Přejeďte kurzorem myši přes písmena – každé písmenko se přímo pod kurzorem dynamicky zvětší a sousední písmena se plynule roztáhnou dle parabolické čočky.
                  </p>
                  <span className="font-mono font-bold text-[#040b8d]">
                    KINETIC FONT LENS
                  </span>
                </div>

                <div className="bg-[#dbdbdb] border-2 border-[#c2c2c2] p-8 sm:p-14 text-center select-none overflow-x-auto min-h-[300px] flex flex-col items-center justify-center">
                  <div
                    className="inline-flex flex-wrap items-center justify-center gap-1 py-8 px-4"
                    onMouseLeave={() => setHoveredCharIndex(null)}
                  >
                    {samplePhrase.split('').map((char, index) => {
                      // Calculate distance from hovered character
                      let scale = 1;
                      let yOffset = 0;
                      let colorClass = 'text-[#18181b]';

                      if (hoveredCharIndex !== null) {
                        const dist = Math.abs(hoveredCharIndex - index);
                        if (dist === 0) {
                          scale = 2.4;
                          yOffset = -14;
                          colorClass = 'text-[#ac0001] font-black drop-shadow-lg';
                        } else if (dist === 1) {
                          scale = 1.7;
                          yOffset = -8;
                          colorClass = 'text-[#040b8d] font-extrabold';
                        } else if (dist === 2) {
                          scale = 1.3;
                          yOffset = -4;
                          colorClass = 'text-[#CDA24D] font-bold';
                        }
                      }

                      return (
                        <span
                          key={index}
                          onMouseEnter={() => setHoveredCharIndex(index)}
                          style={{
                            transform: `scale(${scale}) translateY(${yOffset}px)`,
                            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.18s ease'
                          }}
                          className={`inline-block font-heading font-extrabold text-2xl sm:text-4xl px-0.5 cursor-pointer origin-bottom ${colorClass}`}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      );
                    })}
                  </div>

                  <p className="font-mono text-xs text-[#666] mt-4">
                    {hoveredCharIndex !== null
                      ? `Zvětšeno písmeno: "${samplePhrase[hoveredCharIndex]}" (Index: ${hoveredCharIndex})`
                      : 'Přejeďte myší přes text výše'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTOMATIZACE (Workflow Pipeline Simulátor)                          */}
        {/* ========================================================================= */}
        {activeTab === 'automation' && (
          <div className="bg-[#ededed] border-2 border-[#c2c2c2] p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dbdbdb] mb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#040b8d] font-bold block mb-1">
                  Interaktivní simulátor workflow
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[#18181b]">
                  Zpracování e-mailu & autonomní zápis do systému
                </h3>
              </div>
              <button
                onClick={runAutomationPipeline}
                disabled={autoRunning}
                className="px-5 py-2.5 bg-[#040b8d] hover:bg-[#030869] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{autoRunning ? 'Spouštím pipeline...' : 'Spustit simulaci pipeline'}</span>
              </button>
            </div>

            {/* Pipeline Flow Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Stage 1 */}
              <div className={`p-4 border transition-all ${
                autoStep >= 1 ? 'bg-[#dbdbdb] border-[#040b8d]' : 'bg-[#ededed] border-[#d0d0d0] opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">KROK 1</span>
                  {autoStep >= 1 && <CheckCircle2 className="w-4 h-4 text-[#040b8d]" />}
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#18181b] mb-1">
                  Příchozí e-mail
                </h4>
                <p className="text-[11px] text-[#555]">
                  Klient zaslal zprávu s požadavkem na termín a fakturaci.
                </p>
              </div>

              {/* Stage 2 */}
              <div className={`p-4 border transition-all ${
                autoStep >= 2 ? 'bg-[#dbdbdb] border-[#040b8d]' : 'bg-[#ededed] border-[#d0d0d0] opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">KROK 2</span>
                  {autoStep >= 2 && <CheckCircle2 className="w-4 h-4 text-[#040b8d]" />}
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#18181b] mb-1">
                  AI Analýza & Extrakce
                </h4>
                <p className="text-[11px] text-[#555]">
                  Extrahována částka, IČO, datum a prioritní štítek bez lidské práce.
                </p>
              </div>

              {/* Stage 3 */}
              <div className={`p-4 border transition-all ${
                autoStep >= 3 ? 'bg-[#dbdbdb] border-[#040b8d]' : 'bg-[#ededed] border-[#d0d0d0] opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">KROK 3</span>
                  {autoStep >= 3 && <CheckCircle2 className="w-4 h-4 text-[#040b8d]" />}
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#18181b] mb-1">
                  Zápis do CRM & Kalendáře
                </h4>
                <p className="text-[11px] text-[#555]">
                  Vytvořen nový lead, zaevidován termín a vytvořena položka v účetnictví.
                </p>
              </div>

              {/* Stage 4 */}
              <div className={`p-4 border transition-all ${
                autoStep >= 4 ? 'bg-[#dbdbdb] border-[#040b8d]' : 'bg-[#ededed] border-[#d0d0d0] opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#040b8d]">KROK 4</span>
                  {autoStep >= 4 && <CheckCircle2 className="w-4 h-4 text-[#040b8d]" />}
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#18181b] mb-1">
                  Odeslání odpovědi & Notifikace
                </h4>
                <p className="text-[11px] text-[#555]">
                  Zákazník má obratem potvrzení a vy máte hotovo bez pohnutí prstem.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
