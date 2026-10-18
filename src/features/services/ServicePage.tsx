import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ServiceId } from '../../types';
import { Button } from '../../components/ui/Button';
import { scrollToTop } from '../../lib/motion';

interface ServicePageProps {
  serviceId: ServiceId;
  onBackToHome: () => void;
}

/* Jedna šablona pro všechny stránky služeb; obsah je v servicePages.ts */
export const ServicePage: React.FC<ServicePageProps> = ({ serviceId, onBackToHome }) => {
  // Always scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [serviceId]);

  return (
    <div className="min-h-screen bg-transparent text-loyo-ink pt-20 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            onClick={scrollToTop}
            className="text-xs font-mono font-bold text-loyo-subtle hover:text-loyo-ink uppercase cursor-pointer"
          >
            Nahoru ↑
          </button>
        </div>
      </div>
    </div>
  );
};
