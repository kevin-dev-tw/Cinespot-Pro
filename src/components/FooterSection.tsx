import { useState } from 'react';
import { Mail, Send, CheckCircle2, PhoneCall, Ticket } from 'lucide-react';
import { TICKET_TIERS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

interface FooterSectionProps {
  onOpenTicketsWithTier: (tierId: string) => void;
  onOpenTickets: () => void;
}

export const FooterSection = ({ onOpenTicketsWithTier, onOpenTickets }: FooterSectionProps) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    type: 'General Inquiry',
    message: '',
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    playUiSound('success');
    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', type: 'General Inquiry', message: '' });
    }, 4000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    playUiSound('success');
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSuccess(false);
    }, 4000);
  };

  return (
    <footer id="tickets" className="relative w-full bg-[#050608] text-white pt-24 pb-32 px-4 sm:px-6 lg:px-12 border-t border-white/10">
      {/* Background glow highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-gradient-to-b from-[#ccff00]/10 via-[#00f0ff]/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Pass Tier Cards Showcase */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#ccff00] font-mono-code text-xs uppercase tracking-wider">
                  06 // PASS REGISTRATION
                </span>
                <span className="text-neutral-500 font-mono-code text-xs">LIMITED TOKYO CAPACITY</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.9]">
                JOIN THE <span className="text-transparent text-stroke-strong">SUMMIT</span>
              </h2>
            </div>
            <p className="max-w-md font-mono-code text-xs sm:text-sm text-neutral-400">
              Select your tier for 3 days of cutting-edge keynotes, hands-on spatial labs, and Tokyo nocturnal showcases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TICKET_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.01] ${
                  tier.popular
                    ? 'bg-neutral-900/90 border-[#ccff00] shadow-[0_0_35px_rgba(204,255,0,0.18)]'
                    : 'bg-[#0f1016]/80 border-white/15 hover:border-white/30'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[#ccff00] text-black font-mono-code text-[10px] font-extrabold tracking-wider">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight mb-1">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 my-4">
                    <span className="font-display font-black text-4xl text-white">
                      ${tier.price}
                    </span>
                    <span className="text-xs font-mono-code text-neutral-400">USD / ATTENDEE</span>
                  </div>

                  <ul className="space-y-3 mb-8 pt-4 border-t border-white/10">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                        <span className="text-[#ccff00] font-bold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => {
                      playUiSound('click');
                      onOpenTicketsWithTier(tier.id);
                    }}
                    onMouseEnter={() => playUiSound('hover')}
                    className={`w-full py-4 rounded-2xl font-display font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-[#ccff00] hover:bg-white text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                        : 'bg-white/10 hover:bg-white hover:text-black text-white'
                    }`}
                  >
                    <Ticket size={16} />
                    <span>Select {tier.name}</span>
                  </button>
                  <span className="block text-center text-[11px] font-mono-code text-neutral-500 mt-2">
                    {tier.available} passes remaining
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Partnership Form Block */}
        <div id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 border-t border-white/10 items-start mb-20">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider block mb-2">
                DIRECT INQUIRIES & PARTNERSHIPS
              </span>
              <h3 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-[0.95] mb-4">
                GET IN TOUCH WITH THE CURATORS
              </h3>
              <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed mb-8">
                Interested in presenting at Synthesis 2026, enterprise delegation passes, press credentials, or sponsoring the Tokyo venue installation? Drop our production team a line.
              </p>

              <div className="space-y-4 text-xs font-mono-code text-neutral-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ccff00]">
                    <Mail size={15} />
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">DIRECT CURATORIAL EMAIL</span>
                    <a href="mailto:curators@synthesis2026.design" className="hover:text-white underline">
                      curators@synthesis2026.design
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00f0ff]">
                    <PhoneCall size={15} />
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">TOKYO HQ DESK</span>
                    <span>+81 3 5555 2026 (Mon-Fri 10:00 - 18:00 JST)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-10 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-xs font-mono-code text-[#ccff00] uppercase block mb-1">
                SUMMIT DISPATCH BULLETIN
              </span>
              <p className="text-xs text-neutral-400 mb-3">
                Receive confidential keynotes, speaker release announcements, and WebGPU code snippets directly.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@studio.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-white text-black font-mono-code text-xs font-bold transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
              {newsletterSuccess && (
                <span className="text-[11px] font-mono-code text-emerald-400 mt-2 block">
                  ✓ Subscribed! You will receive Dispatch #01 shortly.
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0f1016]/90 border border-white/15 p-6 sm:p-8">
            <h4 className="font-display font-bold text-xl text-white uppercase mb-2">
              Send a Transmission
            </h4>
            <p className="text-xs font-mono-code text-neutral-400 mb-6">
              Our Tokyo curatorial team replies within 12 standard business hours.
            </p>

            {formSubmitted ? (
              <div className="py-12 text-center bg-black/40 rounded-2xl border border-white/10">
                <CheckCircle2 size={40} className="text-[#ccff00] mx-auto mb-3" />
                <h5 className="font-display font-bold text-lg text-white mb-1">
                  TRANSMISSION RECEIVED
                </h5>
                <p className="text-xs font-mono-code text-neutral-400 max-w-sm mx-auto">
                  Thank you, {contactForm.name || 'Friend'}. A summit curator has received your inquiry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                      Your Name *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Elena Rostova"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                      Email Address *
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="elena@studio.ch"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                    Inquiry Classification
                  </span>
                  <select
                    value={contactForm.type}
                    onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                  >
                    <option>General Inquiry</option>
                    <option>Enterprise & Bulk Passes</option>
                    <option>Press & Media Pass</option>
                    <option>Exhibitor & Stage Sponsorship</option>
                    <option>Student / Academic Subsidy</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                    Your Message
                  </span>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your team, query, or proposal..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => playUiSound('hover')}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-[#ccff00] text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Inquiry Transmission</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Giant Typographic Signoff */}
        <div className="pt-16 pb-8 border-t border-white/10 flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div className="font-display font-black text-4xl sm:text-6xl text-white/20 select-none tracking-tighter uppercase">
            SYNTHESIS 2026
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono-code text-neutral-400">
            <span>© 2026 SYNTHESIS GUILD</span>
            <span>•</span>
            <a href="#hero" className="hover:text-white transition-colors">TOP OF PAGE ↑</a>
            <span>•</span>
            <span className="text-[#ccff00]">POWERED BY LOCOMOTIVE FLUIDITY</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Quick Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0b10]/90 backdrop-blur-md border-t border-white/10 py-2.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono-code">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium">SYNTHESIS 2026 TOKYO</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">OCT 28-30</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:curators@synthesis2026.design"
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Mail size={13} className="text-[#00f0ff]" />
              <span>curators@synthesis2026.design</span>
            </a>
            <button
              onClick={() => {
                playUiSound('click');
                onOpenTickets();
              }}
              className="px-3.5 py-1 rounded-full bg-[#ccff00] text-black font-bold text-[11px] uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              Get Passes
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
