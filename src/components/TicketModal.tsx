import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Ticket, CreditCard, ShieldCheck, Download, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TICKET_TIERS, EVENT_DETAILS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTierId?: string;
}

export const TicketModal = ({ isOpen, onClose, initialTierId }: TicketModalProps) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTierId || 'tier-pro');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studio: '',
    role: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentTier = TICKET_TIERS.find((t) => t.id === selectedTierId) || TICKET_TIERS[1];
  const subtotal = currentTier.price * ticketCount;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'LOCOMOTIVE' || code === 'SYNTHESIS' || code === 'DEVIN') {
      playUiSound('success');
      setDiscountPercent(20);
      setPromoApplied(code);
      setPromoError('');
    } else {
      playUiSound('close');
      setPromoError('Invalid promotion code. Try: LOCOMOTIVE or SYNTHESIS');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    setIsSubmitting(true);
    playUiSound('click');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      playUiSound('success');

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#00f0ff', '#ff5533', '#ffffff'],
      });
    }, 700);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
        onClick={() => {
          playUiSound('close');
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0d0e14] border border-white/20 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] my-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              playUiSound('close');
              onClose();
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          {!isSuccess ? (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#ccff00] mb-1">
                  <Ticket size={14} />
                  <span>OFFICIAL SUMMIT REGISTRATION</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  RESERVE YOUR PASS
                </h3>
                <p className="text-xs sm:text-sm font-mono-code text-neutral-400 mt-1">
                  {EVENT_DETAILS.dates} • {EVENT_DETAILS.location}
                </p>
              </div>

              {/* Step 1: Select Tier */}
              <div className="mb-8">
                <label className="block text-xs font-mono-code text-neutral-400 uppercase tracking-wider mb-3">
                  01. Choose Pass Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {TICKET_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => {
                          playUiSound('switch');
                          setSelectedTierId(tier.id);
                        }}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-neutral-900 border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.2)]'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/5'
                        }`}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-[#ccff00] text-black font-mono-code text-[9px] font-bold">
                            {tier.badge}
                          </span>
                        )}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-display font-bold text-sm text-white">
                              {tier.name}
                            </span>
                            {isSelected && (
                              <Check size={14} className="text-[#ccff00]" />
                            )}
                          </div>
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="font-display font-black text-2xl text-white">
                              ${tier.price}
                            </span>
                            <span className="text-[11px] font-mono-code text-neutral-400">USD</span>
                          </div>
                          <ul className="space-y-1.5 mb-4">
                            {tier.features.slice(0, 3).map((f, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-neutral-300 font-sans flex items-start gap-1.5"
                              >
                                <span className="text-[#ccff00] mt-0.5">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[10px] font-mono-code text-neutral-500 flex justify-between">
                          <span>Capacity</span>
                          <span className="text-emerald-400">{tier.available} passes left</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Attendee Form & Summary */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Form inputs */}
                  <div className="md:col-span-7 flex flex-col gap-3">
                    <label className="block text-xs font-mono-code text-neutral-400 uppercase tracking-wider">
                      02. Attendee Credentials
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                          Full Name *
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maya Chen"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                          Work Email *
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="maya@studio.design"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                          Company / Studio
                        </span>
                        <input
                          type="text"
                          placeholder="Autonomous Lab"
                          value={formData.studio}
                          onChange={(e) =>
                            setFormData({ ...formData, studio: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                          Pass Quantity
                        </span>
                        <div className="flex items-center gap-3 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              playUiSound('click');
                              setTicketCount(Math.max(1, ticketCount - 1));
                            }}
                            className="text-white hover:text-[#ccff00] font-bold text-base px-2 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono-code text-xs text-white font-bold flex-1 text-center">
                            {ticketCount} {ticketCount > 1 ? 'Passes' : 'Pass'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              playUiSound('click');
                              setTicketCount(Math.min(10, ticketCount + 1));
                            }}
                            className="text-white hover:text-[#ccff00] font-bold text-base px-2 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="pt-2">
                      <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                        Promo Code (Try: LOCOMOTIVE or SYNTHESIS)
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="LOCOMOTIVE"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white uppercase placeholder-neutral-600 focus:outline-none focus:border-[#ccff00]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono-code text-white transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <span className="text-[11px] font-mono-code text-emerald-400 mt-1 block">
                          ✓ Code applied: 20% discount unlocked
                        </span>
                      )}
                      {promoError && (
                        <span className="text-[11px] font-mono-code text-red-400 mt-1 block">
                          {promoError}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Summary Column */}
                  <div className="md:col-span-5 rounded-2xl bg-black/70 border border-white/15 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider block mb-3">
                        Order Summary
                      </span>
                      <div className="space-y-2 text-xs font-mono-code mb-4">
                        <div className="flex justify-between text-neutral-300">
                          <span>{currentTier.name} × {ticketCount}</span>
                          <span>${subtotal} USD</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Promo Discount (20%)</span>
                            <span>-${discountAmount} USD</span>
                          </div>
                        )}
                        <div className="flex justify-between text-neutral-400">
                          <span>Taxes & Service Fees</span>
                          <span className="text-emerald-400">Waived</span>
                        </div>
                        <div className="pt-3 border-t border-white/15 flex justify-between items-baseline text-white">
                          <span className="font-display font-bold text-sm">TOTAL DUE</span>
                          <span className="font-display font-black text-2xl text-[#ccff00]">
                            ${finalTotal} <span className="text-xs font-mono-code text-neutral-400">USD</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 py-3.5 rounded-xl bg-[#ccff00] hover:bg-white text-black font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(204,255,0,0.3)] disabled:opacity-50"
                    >
                      <CreditCard size={16} />
                      <span>{isSubmitting ? 'GENERATING PASS...' : `CONFIRM & PAY $${finalTotal}`}</span>
                    </button>

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono-code text-neutral-400 text-center">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>256-bit encrypted checkout • Instant pass issue</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Success Digital Pass State */
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#ccff00]/20 border border-[#ccff00] text-[#ccff00] flex items-center justify-center mx-auto mb-4">
                <Check size={28} />
              </div>

              <span className="text-xs font-mono-code text-[#ccff00] tracking-widest uppercase block mb-1">
                REGISTRATION CONFIRMED
              </span>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mb-2">
                WELCOME TO SYNTHESIS 2026
              </h3>
              <p className="text-sm font-sans text-neutral-300 max-w-md mx-auto mb-6">
                Your pass has been officially issued to{' '}
                <span className="text-[#00f0ff] font-semibold">{formData.email}</span>. Bring your digital pass or QR badge to the Tokyo Arch Pavilion.
              </p>

              {/* Digital Boarding Pass Ticket */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-neutral-900 border-2 border-[#ccff00]/60 relative overflow-hidden text-left mb-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-white/20 mb-4">
                  <div>
                    <span className="font-display font-black text-lg text-white">SYNTHESIS 2026</span>
                    <span className="block text-[11px] font-mono-code text-[#ccff00]">
                      {currentTier.name.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono-code text-neutral-400 block">PASS ID</span>
                    <span className="font-mono-code text-xs text-white font-bold">
                      #SYN-26-{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono-code mb-4">
                  <div>
                    <span className="text-neutral-500 block">ATTENDEE</span>
                    <span className="text-white font-semibold">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">ORGANIZATION</span>
                    <span className="text-white font-semibold">{formData.studio || 'Creative Technologist'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">DATES</span>
                    <span className="text-white">OCT 28-30, 2026</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">LOCATION</span>
                    <span className="text-white">TOKYO ARCH PAVILION</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode size={36} className="text-white" />
                    <span className="text-[10px] font-mono-code text-neutral-400">
                      SCAN FOR FAST CHECK-IN
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    ACTIVE • READY
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    playUiSound('click');
                    alert('Digital pass barcode downloaded to your device!');
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono-code text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download size={14} />
                  <span>Save to Apple / Google Wallet</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-[#ccff00] text-black font-mono-code text-xs font-bold cursor-pointer hover:bg-white transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
