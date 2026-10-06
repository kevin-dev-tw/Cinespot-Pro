import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Coffee } from 'lucide-react';
import { playUiSound } from '../utils/audio';

export const VenueExperience = () => {
  const [activeZone, setActiveZone] = useState(0);
  const [tokyoTime, setTokyoTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTokyoTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const zones = [
    {
      id: 'sanctuary',
      title: 'Main Sanctuary (Stage A)',
      capacity: '2,200 Seats',
      desc: 'Featuring a 360-degree curved LED volume, spatial Meyer Sound audio arrays, and kinetic ceiling elements that descend during live AV sets.',
      spec: '16K Ultra-Res Projection • 64-Channel Spatial Audio',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'fluid',
      title: 'Stage B (The Fluid Room)',
      capacity: '800 Seats',
      desc: 'An intimate amphitheater crafted for live coding, WebGPU shader breakdowns, and masterclasses where code is mirrored on peripheral tactile screens.',
      spec: 'Direct HDMI/WebGPU feeds • Dual-deck DJ workstation',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'subterranean',
      title: 'Subterranean AV Dome',
      capacity: '1,200 Standing',
      desc: 'Deep underground brutalist concrete bunker dedicated to the Nocturne laser showcase, spatial rave, and generative ambient sessions.',
      spec: 'Atmospheric Fog Turbines • 100kW Sub-bass Foundation',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'skyline',
      title: 'Sky Garden Level 54',
      capacity: '400 VIP Guests',
      desc: 'Panoramic rooftop overlooking Tokyo Tower and Mt. Fuji. Open bar, curated culinary pairings, and exclusive speaker evening salon.',
      spec: 'Private High-Speed Lifts • Heated Glass Atrium',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <section id="experience" className="relative w-full py-24 md:py-36 px-4 sm:px-6 lg:px-12 bg-[#07080b] border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00f0ff] font-mono-code text-xs uppercase tracking-wider">
                05 // PHYSICAL SPATIAL ARCHITECTURE
              </span>
              <span className="text-neutral-500 font-mono-code text-xs">
                TOKYO LOCAL TIME: <span className="text-[#ccff00] font-bold">{tokyoTime} JST</span>
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.9]">
              THE TOKYO <span className="text-transparent text-stroke-strong">PAVILION</span>
            </h2>
          </div>
          <div className="font-mono-code text-xs sm:text-sm text-neutral-400 max-w-sm">
            <span className="text-white block font-semibold mb-1">Tokyo Arch & Spatial Center</span>
            <span>Roppongi Hills Tech District • 35.6628° N, 139.7314° E</span>
          </div>
        </div>

        {/* Zone Selector and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left: Zone Tabs */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-2.5">
              {zones.map((zone, idx) => {
                const isActive = activeZone === idx;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      playUiSound('switch');
                      setActiveZone(idx);
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                        : 'bg-[#0e0f15]/70 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-lg text-white">
                        {zone.title}
                      </span>
                      <span className="text-xs font-mono-code text-[#00f0ff]">
                        {zone.capacity}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-neutral-400 line-clamp-2">
                      {zone.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Travel perks */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-2 gap-3 text-xs font-mono-code text-neutral-300 mt-2">
              <div className="flex items-center gap-2">
                <Plane size={15} className="text-[#ccff00]" />
                <span>Haneda: 25 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee size={15} className="text-[#00f0ff]" />
                <span>Craft Matcha Bar</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Big Venue Image Stage */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-white/20 min-h-[420px] bg-neutral-900 group">
            <motion.img
              key={zones[activeZone].id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={zones[activeZone].image}
              alt={zones[activeZone].title}
              className="w-full h-full object-cover filter brightness-80 contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="text-xs font-mono-code text-[#ccff00] uppercase tracking-wider block mb-1">
                {zones[activeZone].spec}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
                {zones[activeZone].title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl">
                {zones[activeZone].desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
