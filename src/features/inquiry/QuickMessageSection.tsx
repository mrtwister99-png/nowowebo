import React, { useState } from 'react';
import { Send, CheckCircle2, Clock } from 'lucide-react';

export const QuickMessageSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section
      id="zprava"
      className="py-14 sm:py-16 bg-transparent text-[#18181b] border-b border-[#d0d0d0]/60"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Tag & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-loyo-bar border border-[#c2c2c2] text-[#18181b] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>05 • PŘÍMÉ SPOJENÍ</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#18181b] tracking-tight">
            Rychlá zpráva
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#555] font-medium max-w-xl mx-auto">
            Spojíme se a probereme váš projekt
          </p>
        </div>

        {/* Minimalist Direct Message Box */}
        <div className="bg-loyo-bar border-2 border-[#18181b] p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#18181b]">
                Zpráva byla úspěšně odeslána!
              </h3>
              <p className="text-sm text-[#444] max-w-md mx-auto">
                Děkuji vám, <strong>{formData.name}</strong>. Podívám se na vaše zadání a odpovím
                vám na <strong>{formData.contact}</strong> nejpozději do 24 hodin.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', contact: '', message: '' });
                  }}
                  className="px-4 py-2 bg-[#18181b] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-loyo-blue transition-colors cursor-pointer"
                >
                  Odeslat další zprávu
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Jméno */}
                <div className="space-y-1">
                  <label
                    htmlFor="quick-name"
                    className="block text-xs font-mono font-bold uppercase text-[#333]"
                  >
                    Vaše jméno / Firma *
                  </label>
                  <input
                    id="quick-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="např. Jan Novák"
                    className="w-full px-3 py-2 bg-loyo-bg border border-[#c2c2c2] focus:border-[#18181b] focus:outline-hidden text-sm font-sans"
                  />
                </div>

                {/* E-mail nebo Telefon */}
                <div className="space-y-1">
                  <label
                    htmlFor="quick-contact"
                    className="block text-xs font-mono font-bold uppercase text-[#333]"
                  >
                    Váš e-mail nebo telefon *
                  </label>
                  <input
                    id="quick-contact"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="email@domena.cz nebo +420..."
                    className="w-full px-3 py-2 bg-loyo-bg border border-[#c2c2c2] focus:border-[#18181b] focus:outline-hidden text-sm font-sans"
                  />
                </div>
              </div>

              {/* Zpráva */}
              <div className="space-y-1">
                <label
                  htmlFor="quick-message"
                  className="block text-xs font-mono font-bold uppercase text-[#333]"
                >
                  O čem je váš projekt? *
                </label>
                <textarea
                  id="quick-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Stručně popište, co potřebujete vytvořit, automatizovat, vylepšit nebo zkonzultovat..."
                  className="w-full px-3 py-2 bg-loyo-bg border border-[#c2c2c2] focus:border-[#18181b] focus:outline-hidden text-sm font-sans resize-none"
                />
              </div>

              {/* Zpráva */}
              <div className="space-y-1">
                <label
                  htmlFor="quick-message"
                  className="block text-xs font-mono font-bold uppercase text-[#333]"
                >
                  O čem je váš projekt? *
                </label>
                <textarea
                  id="quick-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Stručně popište, co potřebujete vytvořit, automatizovat, vylepšit nebo zkonzultovat..."
                  className="w-full px-3 py-2 bg-loyo-bg border border-[#c2c2c2] focus:border-[#18181b] focus:outline-hidden text-sm font-sans resize-none"
                />
              </div>
              {/* Footer info & Submit */}
              <div className="pt  -2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#666]">
                  <Clock className="w-3.5 h-3.5 text-loyo-blue" />
                  <span>Garantovaná odpověď do 24 hodin</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#18181b] hover:bg-loyo-blue text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Odeslat zprávu</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
