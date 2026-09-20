import React, { useState, useEffect } from 'react';
import { 
  Server, 
  MessageSquare, 
  Users, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw,
  Plus,
  Search,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Code2
} from 'lucide-react';
import { ServiceId } from '../types';

interface FullstackSectionProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenQuestionnaire: (serviceId?: ServiceId) => void;
}

interface NoteItem {
  id: string;
  animal: 'pig' | 'cow';
  title: string;
  preview: string;
  tag: string;
  time: string;
}

export const FullstackSection: React.FC<FullstackSectionProps> = ({ 
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

  // Seznam poznámek: přesně 3x prasátko a 2x kravička
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: '1',
      animal: 'pig',
      title: '🐷 Prasátko',
      preview: 'Návrh custom backendu, API endpointů a optimalizace SQL dotazů.',
      tag: 'Backend',
      time: 'Dnes, 09:15'
    },
    {
      id: '2',
      animal: 'pig',
      title: '🐷 Prasátko',
      preview: 'Ověření šifrování tokenů a zabezpečení komunikace proti útokům.',
      tag: 'Bezpečnost',
      time: 'Dnes, 11:40'
    },
    {
      id: '3',
      animal: 'cow',
      title: '🐮 Kravička',
      preview: 'Real-time WebSocket propojení a okamžité notifikace pro uživatele.',
      tag: 'Real-time',
      time: 'Včera, 14:20'
    },
    {
      id: '4',
      animal: 'pig',
      title: '🐷 Prasátko',
      preview: 'Custom přehled pro zaměstnance, docházka a interní správa rolí.',
      tag: 'Zaměstnanci',
      time: 'Včera, 16:05'
    },
    {
      id: '5',
      animal: 'cow',
      title: '🐮 Kravička',
      preview: 'Pravidelná kontrola verzí knihoven, zálohování a monitoring dohledu.',
      tag: 'DevOps',
      time: 'Před 2 dny'
    }
  ]);

  const [activeNoteId, setActiveNoteId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Vertikální progress bar sloupeček: 0-100%, jde furt dokola od 0 (dole) do 100 (nahoře)
  const [verticalProgress, setVerticalProgress] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  useEffect(() => {
    if (!isLooping) return;
    const interval = setInterval(() => {
      setVerticalProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 45);
    return () => clearInterval(interval);
  }, [isLooping]);

  const handleAddNote = () => {
    const isPig = notes.length % 2 === 0;
    const newNote: NoteItem = {
      id: String(Date.now()),
      animal: isPig ? 'pig' : 'cow',
      title: isPig ? '🐷 Prasátko' : '🐮 Kravička',
      preview: 'Nová zakázková poznámka s libovolným obsahem podle přání klienta.',
      tag: 'Na míru',
      time: 'Právě teď'
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  return (
    <section id="fullstack" className="py-14 sm:py-16 bg-[#ededed] text-[#18181b] border-b border-[#d0d0d0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: 02. PILÍŘ • ZLATÁ #CDA24D */}
        <div className="border-l-4 border-[#CDA24D] pl-5 sm:pl-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#CDA24D] text-[#18181b] text-[11px] font-mono font-bold uppercase tracking-wider">
              02. PILÍŘ • ZLATÁ
            </span>
            <span className="text-xs font-mono text-[#8a6b28] font-bold">#CDA24D</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#8a6b28] tracking-tight">
            Vývoj jakékoliv aplikace (Full-stack na míru)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#333] max-w-3xl leading-relaxed">
            Možný je vývoj <strong>naprosto jakékoliv aplikace</strong> – od bleskového <strong>chatu v reálném čase</strong> přes <strong>osobní aplikaci s custom vymoženostmi napojenou na libovolná API</strong> až po komplexní <strong>systém pro zaměstnance</strong> a interní správu firmy.
          </p>
        </div>

        {/* Hlavní karta se 3 jasnými body */}
        <div className="bg-[#dbdbdb] border-2 border-[#CDA24D] p-6 sm:p-8 shadow-xs">
          
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8a6b28] font-bold block mb-1">
              3 hlavní pilíře vývoje:
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#18181b]">
              Architektura postavená přímo pro váš záměr bez krabicových šablon
            </h3>
          </div>

          {/* 3 JASNÉ BODY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* Bod 1 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Kompletní fullstack architektura
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Čistý a rychlý backend, moderní reaktivní frontend a robustní databáze. Žádné zbytečné knihovny – kód, kterému do puntíku rozumím.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#8a6b28] font-bold">
                100% vlastnictví zdrojového kódu
              </div>
            </div>

            {/* Bod 2 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Zakázkové vymoženosti & API
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Real-time chat, interní portál pro zaměstnance, správa rolí a docházky. Přímé napojení na platební brány, banky, kalendáře i hardware.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#8a6b28] font-bold">
                Neomezené možnosti napojení
              </div>
            </div>

            {/* Bod 3 */}
            <div className="bg-[#ededed] p-5 border border-[#c2c2c2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#18181b] mb-1.5">
                  Absolutní svoboda rozhraní
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Aplikace udělá přesně to, co chcete vy. Žádné kompromisy hotových krabicových šablon – od unikátní logiky až po netradiční vizuální prvky.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#dbdbdb] text-[11px] font-mono text-[#8a6b28] font-bold">
                Řešení bez kompromisů
              </div>
            </div>
          </div>

          {/* SPODNÍ LIŠTA: V PRAVO DOLE TLAČÍTKO "ZJISTIT VÍCE" */}
          <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <span className="w-2 h-2 rounded-full bg-[#CDA24D]" />
              <span>Zlatá sekce • Ukázka svobody vývoje, zvířátka v poznámkách & vertikální průběh</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenQuestionnaire('fullstack')}
                className="px-4 py-2 bg-[#ededed] hover:bg-[#e0e0e0] border border-[#CDA24D] text-[#8a6b28] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                id="btn-fullstack-dotaznik-preview"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dotazník pro vývoj aplikace</span>
              </button>

              <button
                onClick={handleToggle}
                disabled={isExpanding}
                className="px-5 py-2.5 bg-[#CDA24D] hover:bg-[#b88f3e] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-80"
                id="btn-fullstack-toggle-details"
              >
                {isExpanding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin" />
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
          <div className="mt-8 bg-[#ededed] border-2 border-[#CDA24D] p-6 sm:p-8 space-y-6 animate-pulse">
            <div className="flex items-center justify-between pb-4 border-b border-[#c8c8c8]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#8a6b28] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs font-bold text-[#8a6b28] uppercase tracking-wider">
                  Inicializace interaktivní ukázky a architektury poznámek...
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#777]">02. VÝVOJ APLIKACÍ</span>
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

            <div className="h-44 bg-[#dbdbdb] p-5 space-y-3 border border-[#ccc]">
              <div className="h-4 w-44 bg-[#b8b8b8] rounded-xs" />
              <div className="h-3 w-full bg-[#cecece] rounded-xs" />
              <div className="h-3 w-4/5 bg-[#cecece] rounded-xs" />
            </div>
          </div>
        )}

        {/* ROZBALENÉ DETAILY (Když uživatel klikne na "Zjistit více") */}
        {isExpanded && (
          <div className="mt-8 bg-[#ededed] border-2 border-[#CDA24D] p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            
            {/* POUZE NADPIS - HLAVNÍ POPIS A ANIMACE / UKÁZKA */}
            <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-5 sm:p-7 shadow-sm">
              
              {/* Nadpis */}
              <div className="mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#8a6b28] font-bold block mb-1">
                  Příklad absolutní svobody ve vývoji:
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#18181b]">
                  Chcete mít v poznámkách poznámky jako zvířátka? = Máte to mít...
                </h3>
              </div>

              {/* Hlavní popis */}
              <p className="text-xs sm:text-sm text-[#444] max-w-3xl leading-relaxed mb-6">
                Vytvořím od základu kvalitní backend i frontend – <strong>přímo podle toho, jak sami chcete</strong>. Žádné zkopírované šablony, které by vás omezovaly. Aplikace udělá přesně to, co chcete: od chatu, osobní aplikace s custom vymoženostmi a napojením na API, přes portál pro zaměstnance, až po netradiční vizuální prvky, jako jsou zvířátka místo názvů poznámek nebo vertikální průběh od 0 do 100 %.
              </p>

              {/* UKÁZKA APLIKACE: POZNÁMKY VLEVO, PROGRESS BAR VPRAVO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* VLEVO: UKÁZKA APLIKACE POZNÁMKY */}
                <div className="lg:col-span-8 bg-[#ededed] border-2 border-[#18181b] p-4 sm:p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    {/* Hlavička aplikace: Poznámky */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#18181b] mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#CDA24D]" />
                        <h4 className="font-heading font-black text-lg sm:text-xl text-[#18181b] tracking-tight">
                          Poznámky
                        </h4>
                        <span className="text-[11px] font-mono font-bold bg-[#dbdbdb] px-2 py-0.5 border border-[#c2c2c2] text-[#8a6b28]">
                          {notes.length} záznamů (3× 🐷, 2× 🐮)
                        </span>
                      </div>

                      <button
                        onClick={handleAddNote}
                        className="px-2.5 py-1.5 bg-[#18181b] hover:bg-[#CDA24D] hover:text-[#18181b] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        title="Přidat další poznámku se zvířátkem"
                        id="btn-add-animal-note"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Přidat zvířátko</span>
                      </button>
                    </div>

                    {/* Vyhledávací pole */}
                    <div className="relative mb-3">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Hledat v poznámkách..."
                        className="w-full bg-[#dbdbdb] border border-[#c2c2c2] pl-8 pr-3 py-1.5 text-xs text-[#18181b] focus:outline-none focus:border-[#CDA24D]"
                        id="input-search-notes"
                      />
                    </div>

                    {/* Seznam poznámek: přesně 3x prasátko a 2x kravička */}
                    <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                      {filteredNotes.map((note) => {
                        const isSelected = note.id === activeNoteId;
                        return (
                          <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`p-3 border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#dbdbdb] border-[#CDA24D] border-l-4 border-l-[#CDA24D] shadow-xs'
                                : 'bg-[#dbdbdb]/60 border-[#c8c8c8] hover:bg-[#dbdbdb]'
                            }`}
                            id={`note-item-${note.id}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-2xl select-none shrink-0 mt-0.5">
                                {note.animal === 'pig' ? '🐷' : '🐮'}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-heading font-black text-sm text-[#18181b]">
                                    {note.title}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold bg-[#ededed] px-1.5 py-0.2 border border-[#c2c2c2] text-[#555]">
                                    {note.tag}
                                  </span>
                                </div>
                                <p className="text-xs text-[#444] mt-0.5 line-clamp-1">
                                  {note.preview}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#777] shrink-0 whitespace-nowrap">
                              {note.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spodní lišta poznámek */}
                  <div className="mt-3 pt-2.5 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#555] gap-2">
                    <span>Aktivní: <strong className="text-[#8a6b28]">{activeNote?.title}</strong> ({activeNote?.tag})</span>
                    <span className="text-[#777]">Zakázková architektura bez šablon</span>
                  </div>
                </div>

                {/* VPRAVO: PROGRESS BAR SLOUPEČEK 0-100 (0 DOLE, 100 NAHOŘE, VE SMYČCE FURT DOKOLA) */}
                <div className="lg:col-span-4 bg-[#ededed] border-2 border-[#18181b] p-4 sm:p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#c2c2c2] mb-3">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#8a6b28] font-bold">
                        Průběh procesu
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsLooping(!isLooping)}
                          className="p-1 bg-[#dbdbdb] hover:bg-[#d0d0d0] border border-[#c2c2c2] text-[#18181b] cursor-pointer"
                          title={isLooping ? 'Pozastavit smyčku' : 'Spustit smyčku'}
                          id="btn-toggle-vertical-loop"
                        >
                          {isLooping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setVerticalProgress(0)}
                          className="p-1 bg-[#dbdbdb] hover:bg-[#d0d0d0] border border-[#c2c2c2] text-[#18181b] cursor-pointer"
                          title="Resetovat na 0% (dole)"
                          id="btn-reset-vertical-loop"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#555] mb-3">
                      Sloupeček 0 – 100 %, který jde <strong>furt dokola od 0 (dole) do 100 (nahoře)</strong>:
                    </p>
                  </div>

                  {/* Samotný vertikální sloupeček */}
                  <div className="flex items-center justify-center gap-4 py-2 my-auto">
                    
                    {/* Ryska se značkami vlevo */}
                    <div className="flex flex-col justify-between h-56 text-[10px] font-mono text-[#555] text-right select-none py-0.5">
                      <span className="font-bold text-[#18181b]">100% (nahoře)</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span className="font-bold text-[#18181b]">0% (dole)</span>
                    </div>

                    {/* Vertikální sloupový bar */}
                    <div 
                      className="relative w-16 h-56 bg-[#dbdbdb] border-2 border-[#18181b] overflow-hidden flex flex-col justify-end p-1 shadow-inner"
                      id="vertical-progress-column"
                    >
                      {/* Pozadí s jemnou mřížkou po 25% */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#c2c2c2_1px,transparent_1px)] bg-[size:100%_25%] pointer-events-none opacity-40" />

                      {/* Rostoucí sloupec zdola nahoru: 0 (dole) -> 100 (nahoře) */}
                      <div
                        className="w-full bg-[#CDA24D] transition-all duration-75 relative flex items-start justify-center"
                        style={{ height: `${verticalProgress}%` }}
                      >
                        {/* Laserová zářící hladina na vrcholu sloupce */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white shadow-[0_0_10px_#ffffff]" />
                      </div>

                      {/* Ukazatel aktuálních procent ve sloupci */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="font-mono font-black text-xs px-2 py-0.5 bg-[#18181b] text-white border border-[#CDA24D] shadow-md z-10">
                          {verticalProgress}%
                        </span>
                      </div>
                    </div>

                    {/* Indikátor pohybu nahoru */}
                    <div className="flex flex-col items-center justify-center gap-1 text-[#8a6b28]">
                      <ArrowUp className="w-4 h-4 animate-bounce" />
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest [writing-mode:vertical-lr] rotate-180 text-[#666]">
                        0 → 100%
                      </span>
                    </div>
                  </div>

                  {/* Spodní stav smyčky */}
                  <div className="mt-3 pt-2.5 border-t border-[#c2c2c2] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#666]">Směr: zdola nahoru</span>
                    <span className="font-bold text-[#8a6b28] bg-[#dbdbdb] px-2 py-0.5 border border-[#c2c2c2]">
                      {isLooping ? '● SMYČKA BĚŽÍ' : 'PAUZA'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* 4 Core Architecture Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#dbdbdb] border border-[#CDA24D]/40 p-5 hover:border-[#CDA24D] transition-colors shadow-xs">
                <div className="w-9 h-9 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-[#8a6b28] mb-1">
                  Chat & Komunikace
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Real-time messaging, šifrované vlákna, kanály pro týmy nebo zákaznická podpora s okamžitou odezvou.
                </p>
              </div>

              <div className="bg-[#dbdbdb] border border-[#CDA24D]/40 p-5 hover:border-[#CDA24D] transition-colors shadow-xs">
                <div className="w-9 h-9 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold mb-3">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-[#8a6b28] mb-1">
                  Osobní vymoženosti & API
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Aplikace na míru s napojením na vaše oblíbená API, cloudové služby, banky, kalendáře i hardware.
                </p>
              </div>

              <div className="bg-[#dbdbdb] border border-[#CDA24D]/40 p-5 hover:border-[#CDA24D] transition-colors shadow-xs">
                <div className="w-9 h-9 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-[#8a6b28] mb-1">
                  Portál pro zaměstnance
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Správa směn, docházky, zakázek a vnitřních dokumentů, ušitá na míru reálnému chodu vaší firmy.
                </p>
              </div>

              <div className="bg-[#dbdbdb] border border-[#CDA24D]/40 p-5 hover:border-[#CDA24D] transition-colors shadow-xs">
                <div className="w-9 h-9 bg-[#CDA24D] text-[#18181b] flex items-center justify-center font-bold mb-3">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-[#8a6b28] mb-1">
                  Zakázkový backend
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Rychlý, robustní a bezpečný server, který dělá přesně to, co od něj potřebujete, bez kompromisů.
                </p>
              </div>
            </div>

            {/* CTA v rozbaleném stavu */}
            <div className="pt-4 border-t border-[#c2c2c2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-heading font-bold text-sm text-[#18181b] block">
                  Chcete vytvořit aplikaci přesně podle vašich představ?
                </span>
                <span className="text-xs text-[#666]">
                  Vyplňte dotazník pro vývoj – navrhněte si funkce, architekturu i rozpočet.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenQuestionnaire('fullstack')}
                  className="px-5 py-2.5 bg-[#CDA24D] hover:bg-[#b88f3e] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dotazník pro vývoj aplikace</span>
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
