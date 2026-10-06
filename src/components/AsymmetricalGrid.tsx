import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MoveRight, Radio, Maximize2, Zap } from 'lucide-react';
import { MANIFESTO_ITEMS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

export const AsymmetricalGrid = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      title: "Generative Waveforms",
      meta: "01 // Dynamic Shader Fluidity",
      tag: "WebGL 3.0",
    },
    {
      src: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
      title: "Monolithic Void",
      meta: "02 // Brutalist Structural Sculpture",
      tag: "Architectural Kinetic",
    },
    {
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
      title: "Neural Synapse Grid",
      meta: "03 // High-Density Laser Field",
      tag: "120 FPS Compute",
    },
  ];

  return (
    <section id="concept" className="relative w-full py-24 md:py-36 px-4 sm:px-6 lg:px-12 bg-[#090a0f] border-t border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#ccff00]/5 blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[550px] h-[550px] bg-[#00f0ff]/5 blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header with Oversized Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#ccff00] font-mono-code text-xs uppercase tracking-wider">
                02 // CONCEPT MANIFESTO
              </span>
              <span className="text-neutral-500 font-mono-code text-xs">LOCOMOTIVE SCROLL AESTHETIC</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.9]">
              PHYSICAL <span className="text-transparent text-stroke-strong">MEETS</span> COMPUTATION
            </h2>
          </div>
          <p className="max-w-md font-mono-code text-xs sm:text-sm text-neutral-400 leading-relaxed">
            SYNTHESIS 2026 rejects generic web experiences. We construct asymmetric choreographies where scroll inertia, WebGPU particle compute, and sculptural typography merge into digital reality.
          </p>
        </div>

        {/* ASYMMETRICAL BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 01: Hero Asymmetric Visual (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/60 flex flex-col justify-between min-h-[440px] md:min-h-[540px] p-6 sm:p-8"
          >
            {/* Background Image with Hover Scale */}
            <div className="absolute inset-0 z-0">
              <img
                src={images[0].src}
                alt="Generative Waveforms"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-75 contrast-125 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/40 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono-code text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                {images[0].tag}
              </span>
              <button
                onClick={() => {
                  playUiSound('click');
                  setExpandedImage(images[0].src);
                }}
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/90 transition-colors cursor-pointer"
                title="Expand imagery"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <span className="font-mono-code text-xs text-[#ccff00] tracking-widest uppercase block mb-1">
                {images[0].meta}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight mb-2">
                Fluid Inertia & Kinetic Scroll
              </h3>
              <p className="font-sans text-sm text-neutral-300 max-w-lg leading-relaxed">
                By calculating scroll delta and applying continuous spring equations, pages achieve real organic weight. Experience physics that respond to touch gestures and wheel momentum.
              </p>
            </div>
          </motion.div>

          {/* Card 02: Interactive Audio-Visual Live Widget (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#10121a]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#00f0ff]">
                  <Radio size={14} className="animate-pulse" />
                  <span>SENSORY RADAR // TOKYO</span>
                </div>
                <span className="text-[11px] font-mono-code text-neutral-400">96.4 kHz SPATIAL</span>
              </div>

              <h4 className="font-display font-extrabold text-2xl text-white uppercase tracking-tight mb-3">
                Reactive Soundscapes
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mb-6">
                Curated acoustic installations that morph dynamically in frequency as attendees navigate through physical hall chambers and the web portal.
              </p>

              {/* Interactive Audio Waveform Simulation */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-end justify-between h-28 gap-1.5">
                {[40, 75, 55, 90, 60, 30, 85, 100, 70, 45, 95, 65, 35, 80, 50, 92, 68, 42, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.2 + (i % 5) * 0.2,
                      ease: "easeInOut",
                    }}
                    className={`w-full rounded-full transition-colors ${
                      i % 3 === 0 ? 'bg-[#ccff00]' : i % 2 === 0 ? 'bg-[#00f0ff]' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-6">
              <span className="text-xs font-mono-code text-neutral-400">BINAURAL AUDIO LAB</span>
              <span className="text-xs font-mono-code text-[#ccff00] flex items-center gap-1">
                <Zap size={13} />
                LIVE STREAM READY
              </span>
            </div>
          </motion.div>

          {/* Card 03: Interactive Manifesto Pillars (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#10121a]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono-code text-neutral-500 uppercase tracking-widest block mb-4">
                CORE PHILOSOPHY
              </span>
              <div className="flex flex-col gap-2">
                {MANIFESTO_ITEMS.map((item, index) => {
                  const isSelected = activeTab === index;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        playUiSound('switch');
                        setActiveTab(index);
                      }}
                      className={`text-left p-3.5 rounded-2xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 border border-white/20'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-base text-white flex items-center gap-2">
                          <span className="text-xs font-mono-code text-[#ccff00]">{item.number}</span>
                          {item.title}
                        </span>
                        <MoveRight
                          size={14}
                          className={`transition-transform duration-300 ${
                            isSelected ? 'text-[#ccff00] translate-x-1' : 'text-neutral-500'
                          }`}
                        />
                      </div>
                      {isSelected && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-neutral-300 font-sans leading-relaxed mt-2"
                        >
                          {item.desc}
                        </motion.p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Card 04: Offset Architecture & Brutalist Sculpture (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/60 flex flex-col justify-between min-h-[360px] md:min-h-[420px] p-6 sm:p-8"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={images[1].src}
                alt="Monolithic Void"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-70 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono-code text-[#00f0ff]">
                KINETIC STAGE DESIGN
              </span>
              <Cpu size={18} className="text-[#ccff00]" />
            </div>

            <div className="relative z-10 max-w-lg">
              <span className="font-mono-code text-xs text-[#00f0ff] uppercase tracking-wider block mb-1">
                EXHIBITION SPOTLIGHT
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                Tokyo Arch Spatial Pavilion
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                Featuring motorized 16-meter kinetic LED monoliths that physically pivot according to real-time crowd movement and WebGL spatial coordinates.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Big Quote / Manifesto Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 md:mt-24 p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-neutral-900/80 via-black to-[#090a0f] border border-white/15 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#ccff00]/10 blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="font-mono-code text-xs text-[#ccff00] tracking-[0.3em] uppercase block mb-4">
              [ 2026 SUMMIT CREED ]
            </span>
            <p className="font-display font-bold text-2xl sm:text-3xl md:text-5xl text-white leading-tight tracking-tight uppercase">
              "We do not build pages to be passively browsed. We build sensory worlds that demand to be felt."
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs font-mono-code text-neutral-400">
              <span className="text-white font-semibold">SYNTHESIS CURATORIAL BOARD</span>
              <span>•</span>
              <span>TOKYO // BERLIN // MONTREAL</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Expanded Image Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/20">
            <img src={expandedImage} alt="Expanded Preview" className="w-full h-full object-contain" />
            <span className="absolute top-4 right-4 text-xs font-mono-code bg-black/80 px-3 py-1.5 rounded-full text-white">
              CLICK TO CLOSE
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
