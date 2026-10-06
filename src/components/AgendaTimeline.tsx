import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronDown, Bookmark, Check, Search, Download } from 'lucide-react';
import { AGENDA_ITEMS, SPEAKERS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

interface AgendaTimelineProps {
  onSelectSpeaker: (speakerId: string) => void;
}

export const AgendaTimeline = ({ onSelectSpeaker }: AgendaTimelineProps) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ 'ag-01': true, 'ag-02': true });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['ag-02']);

  const days = [
    { day: 1, date: 'OCT 28', theme: 'The Kinetic Frontier' },
    { day: 2, date: 'OCT 29', theme: 'Neural Space & Form' },
    { day: 3, date: 'OCT 30', theme: 'Synthesis Web Labs' },
  ];

  const categories = ['All', 'Keynote', 'Interactive Lab', 'Panel', 'Night Showcase'];

  const filteredItems = useMemo(() => {
    return AGENDA_ITEMS.filter((item) => {
      const matchDay = item.day === selectedDay;
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.stage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDay && matchCat && matchSearch;
    });
  }, [selectedDay, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    playUiSound('switch');
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playUiSound('click');
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportSchedule = () => {
    playUiSound('success');
    const scheduleData = JSON.stringify(filteredItems, null, 2);
    const blob = new Blob([scheduleData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthesis-2026-day0${selectedDay}-schedule.json`;
    a.click();
  };

  return (
    <section id="agenda" className="relative w-full py-24 md:py-36 px-4 sm:px-6 lg:px-12 bg-[#07080c] border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00f0ff] font-mono-code text-xs uppercase tracking-wider">
                03 // SUMMIT CHOREOGRAPHY
              </span>
              <span className="text-neutral-500 font-mono-code text-xs">OCTOBER 28—30, 2026</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.9]">
              EVENT <span className="text-transparent text-stroke-strong">TIMELINE</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportSchedule}
              className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono-code text-neutral-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download size={14} className="text-[#ccff00]" />
              <span>Export Day 0{selectedDay} JSON</span>
            </button>
          </div>
        </div>

        {/* Day Selector Pill Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {days.map((item) => {
            const isActive = selectedDay === item.day;
            return (
              <button
                key={item.day}
                onClick={() => {
                  playUiSound('switch');
                  setSelectedDay(item.day);
                }}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900/90 border-[#ccff00]/60 shadow-[0_0_25px_rgba(204,255,0,0.15)]'
                    : 'bg-[#0f1016]/60 border-white/10 hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono-code text-xs uppercase tracking-wider font-semibold ${
                      isActive ? 'text-[#ccff00]' : 'text-neutral-400'
                    }`}
                  >
                    DAY 0{item.day} • {item.date}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                  )}
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  {item.theme}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0f1016]/90 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playUiSound('hover');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono-code transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Search sessions or labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-black/50 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ccff00] transition-colors"
            />
          </div>
        </div>

        {/* Timeline Sessions List */}
        <div className="relative">
          {/* Vertical central spine line on large screens */}
          <div className="absolute left-6 md:left-32 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#ccff00]/40 via-[#00f0ff]/30 to-white/10 hidden sm:block" />

          <div className="flex flex-col gap-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/30 rounded-3xl border border-white/10">
                <p className="font-mono-code text-sm text-neutral-400">
                  No sessions match your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-white/10 text-xs text-white hover:bg-white/20 transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = expandedItems[item.id];
                const isBookmarked = bookmarkedIds.includes(item.id);
                const sessionSpeakers = SPEAKERS.filter((s) => item.speakerIds.includes(s.id));

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => toggleExpand(item.id)}
                    className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      item.featured
                        ? 'bg-[#12141e]/90 border-white/20 hover:border-[#ccff00]/60'
                        : 'bg-[#0c0d13]/80 border-white/10 hover:border-white/25'
                    }`}
                  >
                    {item.featured && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-[#ccff00] text-black text-[10px] font-mono-code font-bold rounded-bl-xl tracking-wider uppercase">
                        KEYNOTE SPOTLIGHT
                      </div>
                    )}

                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Time & Stage metadata */}
                      <div className="flex md:flex-col items-baseline md:items-start gap-2 md:w-56 shrink-0">
                        <div className="flex items-center gap-2 font-mono-code text-sm font-semibold text-white">
                          <Clock size={14} className="text-[#ccff00]" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono-code text-neutral-400">
                          <MapPin size={12} className="text-[#00f0ff]" />
                          <span>{item.stage}</span>
                        </div>
                      </div>

                      {/* Center: Title & Category */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-mono-code px-2.5 py-0.5 rounded-full border ${
                              item.category === 'Keynote'
                                ? 'bg-[#ccff00]/10 border-[#ccff00]/40 text-[#ccff00]'
                                : item.category === 'Interactive Lab'
                                ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff]'
                                : item.category === 'Night Showcase'
                                ? 'bg-[#ff5533]/10 border-[#ff5533]/40 text-[#ff5533]'
                                : 'bg-white/10 border-white/20 text-neutral-300'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-[#ccff00] transition-colors leading-snug">
                          {item.title}
                        </h4>

                        {/* Speaker Avatars */}
                        {sessionSpeakers.length > 0 && (
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex -space-x-2 overflow-hidden">
                              {sessionSpeakers.map((spk) => (
                                <img
                                  key={spk.id}
                                  src={spk.avatar}
                                  alt={spk.name}
                                  className="inline-block h-7 w-7 rounded-full ring-2 ring-black object-cover"
                                />
                              ))}
                            </div>
                            <span className="text-xs font-mono-code text-neutral-300">
                              {sessionSpeakers.map((s) => s.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                            isBookmarked
                              ? 'bg-[#ccff00] text-black border-[#ccff00]'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                          title={isBookmarked ? 'Saved to personal agenda' : 'Save to agenda'}
                        >
                          {isBookmarked ? <Check size={14} /> : <Bookmark size={14} />}
                        </button>

                        <div className="p-2.5 rounded-full bg-white/5 text-neutral-400 group-hover:text-white transition-colors">
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Session Details Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-white/10 bg-black/40"
                        >
                          <p className="text-sm text-neutral-300 font-sans leading-relaxed mb-4 max-w-3xl">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              {sessionSpeakers.map((spk) => (
                                <button
                                  key={spk.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectSpeaker(spk.id);
                                  }}
                                  className="text-xs font-mono-code text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer bg-white/5 px-2.5 py-1 rounded-full"
                                >
                                  View profile: {spk.name} →
                                </button>
                              ))}
                            </div>

                            <span className="text-[11px] font-mono-code text-neutral-500">
                              RECORDED FOR DIGITAL PASS HOLDERS • SIMULCAST IN METAVERSE
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
