import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Compass, Calendar, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

interface HeroSectionProps {
  onOpenTickets: () => void;
  onExploreAgenda: () => void;
}

export const HeroSection = ({ onOpenTickets, onExploreAgenda }: HeroSectionProps) => {
  // Live countdown timer calculation for Oct 28, 2026
  const targetDate = new Date('2026-10-28T09:00:00+09:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#07080b]"
    >
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glow Gradients */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#ccff00]/8 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[#00f0ff]/8 blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-[#ff5533]/8 blur-[180px]" />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,8,11,0.85)_100%)]" />
      </div>

      {/* Top Metadata Badges */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-neutral-300"
        >
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
          <span className="text-[#ccff00] font-semibold">EDITION 04</span>
          <span className="text-white/30">•</span>
          <span>GLOBAL CREATIVE TECH SUMMIT</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4 text-xs font-mono-code text-neutral-400"
        >
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#00f0ff]" />
            {EVENT_DETAILS.location}
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Calendar size={13} className="text-[#ccff00]" />
            {EVENT_DETAILS.dates}
          </span>
        </motion.div>
      </div>

      {/* Main Center Typographic Display */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 md:py-14">
        {/* Subhead Tag */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-mono-code text-xs md:text-sm tracking-[0.3em] uppercase text-[#ccff00] mb-3 flex items-center gap-2"
        >
          <Sparkles size={14} className="text-[#ccff00]" />
          <span>Interactive Kinetics // Tokyo 2026</span>
        </motion.p>

        {/* Oversized Typographic Monument */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-6xl sm:text-8xl md:text-[10.5vw] lg:text-[11vw] leading-[0.88] tracking-tighter uppercase text-white selection:bg-[#ccff00] select-none"
          >
            SYNTHESIS
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2"
          >
            <span className="font-display font-black text-4xl sm:text-6xl md:text-[6.2vw] leading-[0.9] tracking-tighter uppercase text-transparent text-stroke-strong hover:text-white transition-all duration-300">
              BEYOND FORM
            </span>
            <span className="font-mono-code text-xs sm:text-sm md:text-base text-neutral-400 max-w-md text-left sm:text-right font-light leading-relaxed">
              Where physical architecture disintegrates into pure WebGPU computation, generative
              intelligence, and kinetic choreographies.
            </span>
          </motion.div>
        </div>

        {/* Cinematic Floating Media Card + Action Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end"
        >
          {/* Action Buttons & Countdown Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  playUiSound('click');
                  onOpenTickets();
                }}
                onMouseEnter={() => playUiSound('hover')}
                className="group relative px-8 py-4 rounded-full bg-[#ccff00] text-black font-display font-black text-sm md:text-base tracking-wider uppercase flex items-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(204,255,0,0.4)] cursor-pointer"
              >
                <span className="relative z-10">Reserve Pass</span>
                <ArrowDownRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover:rotate-[-45deg]"
                />
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
              </button>

              <button
                onClick={() => {
                  playUiSound('click');
                  onExploreAgenda();
                }}
                onMouseEnter={() => playUiSound('hover')}
                className="px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono-code text-xs md:text-sm tracking-wider uppercase flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
              >
                <Compass size={16} className="text-[#00f0ff]" />
                <span>Explore Agenda</span>
              </button>
            </div>

            {/* Live Countdown Grid */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono-code uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  Countdown to Keynote
                </span>
                <span className="text-[10px] font-mono-code text-neutral-500">JST • UTC+9</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <span className="block font-display font-extrabold text-xl md:text-2xl text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono-code text-neutral-500 uppercase">Days</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <span className="block font-display font-extrabold text-xl md:text-2xl text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono-code text-neutral-500 uppercase">Hours</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <span className="block font-display font-extrabold text-xl md:text-2xl text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono-code text-neutral-500 uppercase">Mins</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                  <span className="block font-display font-extrabold text-xl md:text-2xl text-[#ccff00]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono-code text-neutral-500 uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cinematic Visual Teaser Banner */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/60 p-4">
            <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
                alt="Synthesis Summit Stage Installation"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono-code text-white">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                  STAGE ALPHA // PREVIEW
                </span>
                <span className="text-[#ccff00]">120 FPS WebGPU</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-mono-code">
                <ShieldCheck size={14} className="text-emerald-400" />
                Verified ISO Digital Security
              </span>
              <span className="font-mono-code text-[11px] text-neutral-500">35.6762° N</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Key Metric Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto w-full pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {EVENT_DETAILS.stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
              {stat.value}
            </span>
            <span className="text-xs font-mono-code uppercase text-neutral-400 tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
