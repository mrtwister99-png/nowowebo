import React from 'react';
import { Mail, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="kontakty" className="py-14 sm:py-16 bg-transparent text-[#18181b] border-b border-[#d0d0d0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-l-4 border-[#18181b] pl-5 sm:pl-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#dbdbdb] text-[#18181b] text-[11px] font-mono font-bold uppercase tracking-wider">
              06 • KONTAKTY
            </span>
            <div className="inline-flex items-center gap-1.5 ml-2">
              <span className="w-2 h-2 bg-[#040b8d]" />
              <span className="w-2 h-2 bg-[#CDA24D]" />
              <span className="w-2 h-2 bg-[#ac0001]" />
            </div>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#18181b] tracking-tight">
            Přímé kontakty & sociální sítě
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#444] max-w-2xl leading-relaxed">
            Napište mi kdykoliv přímo na e-mail nebo se spojte přes sociální sítě. Na každou zprávu reaguji osobně a věcně.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Email Card */}
          <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#555] mb-2">
                <Mail className="w-4 h-4 text-[#040b8d]" />
                <span>Oficiální e-mail</span>
              </div>
              <a 
                href="mailto:loyo.gruup@gmail.com" 
                className="font-heading font-black text-xl sm:text-2xl text-[#040b8d] hover:underline block break-all pt-1"
              >
                loyo.gruup@gmail.com
              </a>
              <p className="text-xs text-[#555] mt-3 leading-relaxed">
                Preferovaný způsob prvního kontaktu pro zadání projektů, dotazy na kapacity i nabídky spolupráce.
              </p>
            </div>
            
            <div className="mt-6 pt-3 border-t border-[#c2c2c2] flex items-center gap-2 text-xs font-mono text-[#555]">
              <Clock className="w-3.5 h-3.5 text-[#CDA24D]" />
              <span>Odpověď do 24 hodin</span>
            </div>
          </div>

          {/* Social Media Card: Facebook & Instagram */}
          <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-[#555] block mb-2">
                Sociální sítě & profily
              </span>
              <h3 className="font-heading font-black text-xl text-[#18181b]">
                Facebook & Instagram
              </h3>
              <p className="text-xs text-[#555] mt-2 leading-relaxed">
                Připravené oficiální profily pro novinky z vývoje, ukázky realizací a rychlou komunikaci.
              </p>

              <div className="mt-4 space-y-2">
                {/* Facebook Button */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-[#ededed] hover:bg-[#1877F2] hover:text-white border border-[#c2c2c2] font-mono text-xs font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#1877F2]" />
                    <span>Facebook: LoYo Developer</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Instagram Button */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-[#ededed] hover:bg-gradient-to-r hover:from-[#f09433] hover:to-[#bc1888] hover:text-white border border-[#c2c2c2] font-mono text-xs font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#dc2743]" />
                    <span>Instagram: @loyo.developer</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#c2c2c2] text-xs font-mono text-[#666]">
              Odkazy připraveny k propojení
            </div>
          </div>

          {/* Location & Availability Card */}
          <div className="bg-[#dbdbdb] border-2 border-[#18181b] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#555] mb-2">
                <MapPin className="w-4 h-4 text-[#ac0001]" />
                <span>Působnost</span>
              </div>
              <h3 className="font-heading font-black text-xl text-[#18181b]">
                Česká republika & Online
              </h3>
              <p className="text-xs text-[#555] mt-2 leading-relaxed">
                Osobní schůzky v Praze, středních Čechách či dle domluvy kdekoliv v ČR. Pro celou republiku i zahraničí plně online přes Google Meet nebo Zoom.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[#c2c2c2] flex items-center justify-between text-xs font-mono text-[#555]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Kapacita: Přijímám projekty</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
