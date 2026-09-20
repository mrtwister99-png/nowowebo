import React from 'react';
import { ArrowUp, Mail, ExternalLink } from 'lucide-react';
import { LoyoLogoBox } from './LoyoLogoBox';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#dbdbdb] border-t border-[#c2c2c2] text-[#18181b] pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Container */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#c8c8c8]">
          
          {/* Brand Info */}
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-3">
              <LoyoLogoBox activeSection="uvod" />
              <div>
                <span className="font-heading font-black text-base text-[#18181b] block leading-none">
                  LoYo PREMIUM DEVELOPER
                </span>
                <span className="font-mono text-[10px] uppercase text-[#666] tracking-wider block mt-1">
                  Správně fungující, propracované prémiové systémy na míru
                </span>
              </div>
            </div>

            <p className="text-xs text-[#555] leading-relaxed">
              Žádné zkopírované šablony ani polovičatá řešení – stavím přímo na míru cokoliv... cokoliv téměř. 100% vlastnictví vašeho kódu i infrastruktury.
            </p>
          </div>

          {/* Contacts & Social Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Email link */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#666] block">
                Oficiální e-mail:
              </span>
              <a 
                href="mailto:loyo.gruup@gmail.com" 
                className="font-heading font-bold text-sm text-[#040b8d] hover:underline flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>loyo.gruup@gmail.com</span>
              </a>
            </div>

            {/* Social Links Prepared */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#666] block">
                Sociální sítě:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#ededed] hover:bg-[#1877F2] hover:text-white border border-[#c2c2c2] font-mono text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#ededed] hover:bg-[#dc2743] hover:text-white border border-[#c2c2c2] font-mono text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Scroll to Top */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#666]">
          <div>
            <span>© {new Date().getFullYear()} LoYo PREMIUM DEVELOPER. Všechna práva vyhrazena.</span>
          </div>

          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#18181b] hover:text-[#040b8d] font-bold font-mono uppercase text-[11px] cursor-pointer"
            >
              <span>Zpět nahoru</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
