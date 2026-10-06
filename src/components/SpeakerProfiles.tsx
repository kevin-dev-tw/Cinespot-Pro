import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SPEAKERS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

interface SpeakerProfilesProps {
  onSelectSpeaker: (speakerId: string) => void;
}

export const SpeakerProfiles = ({ onSelectSpeaker }: SpeakerProfilesProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="speakers" className="relative w-full py-24 md:py-36 px-4 sm:px-6 lg:px-12 bg-[#090a0f] border-t border-white/10">
      {/* Background glow orbs */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#00f0ff]/8 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-[#ccff00]/8 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#ccff00] font-mono-code text-xs uppercase tracking-wider">
                04 // FACULTY & ART DIRECTORS
              </span>
              <span className="text-neutral-500 font-mono-code text-xs">PIONEERS OF FLUID COMPUTING</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.9]">
              GLOBAL <span className="text-transparent text-stroke-strong">VISIONARIES</span>
            </h2>
          </div>
          <p className="max-w-md font-mono-code text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Leading creative technologists, studio directors, and shader engineers converging in Tokyo to dismantle traditional web conventions.
          </p>
        </div>

        {/* Speakers Grid: Staggered Asymmetric Visual cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SPEAKERS.map((speaker, index) => {
            return (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
                onMouseEnter={() => {
                  playUiSound('hover');
                  setHoveredId(speaker.id);
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  playUiSound('click');
                  onSelectSpeaker(speaker.id);
                }}
                className={`group relative rounded-3xl overflow-hidden border bg-[#10121a]/80 backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] cursor-pointer ${
                  hoveredId === speaker.id ? 'border-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.2)]' : 'border-white/15'
                }`}
              >
                {/* Image Container with duotone to vibrant color transition */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-5 bg-neutral-900">
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top Slot Pill */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono-code text-white">
                      {speaker.timeSlot}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#ccff00] backdrop-blur-md flex items-center justify-center text-white group-hover:text-black transition-colors duration-300">
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Tags on image bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                    {speaker.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono-code px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-neutral-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Speaker Metadata */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider mb-1">
                    <span>{speaker.company}</span>
                    <span className="text-neutral-500">KEYNOTE</span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight group-hover:text-[#ccff00] transition-colors mb-1">
                    {speaker.name}
                  </h3>

                  <p className="text-xs font-sans text-neutral-400 mb-4 line-clamp-1">
                    {speaker.role}
                  </p>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-white/15 transition-colors">
                    <p className="font-mono-code text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      "{speaker.topic}"
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
