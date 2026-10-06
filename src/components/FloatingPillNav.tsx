import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, Sparkles, Shuffle, Flame, Compass, Trophy } from 'lucide-react';
import type { MovieCategory } from '../types/movie';
import { playUiSound, toggleSound } from '../utils/audio';

interface FloatingPillNavProps {
  activeSection: string;
  currentCategory: MovieCategory;
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: MovieCategory) => void;
  onRandomMovie?: () => void;
}

const NAV_ITEMS: { id: string; label: string; icon: typeof Compass }[] = [
  { id: 'hero', label: '精選焦點', icon: Compass },
  { id: 'now_playing', label: '院線熱映', icon: Flame },
  { id: 'popular', label: '熱門強檔', icon: Sparkles },
  { id: 'top_rated', label: '口碑高分', icon: Trophy },
];

export const FloatingPillNav = ({
  activeSection,
  currentCategory,
  onNavigate,
  onSelectCategory,
  onRandomMovie,
}: FloatingPillNavProps) => {
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 30);
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playUiSound('switch');
  };

  const handleItemClick = (id: string) => {
    playUiSound('click');
    if (id === 'hero') {
      onNavigate('hero');
    } else if (id === 'now_playing' || id === 'popular' || id === 'top_rated') {
      onSelectCategory(id as MovieCategory);
      onNavigate('movie-grid');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top slim scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#e50914] via-[#ff3b30] to-[#e50914] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Streaming Navigation Bar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-40 top-4 left-0 right-0 flex justify-center px-4 pointer-events-none"
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-3.5 py-2.5 sm:px-5 sm:py-2.5 rounded-full border transition-all duration-500 shadow-2xl ${
            scrolled
              ? 'bg-[#0a0c13]/90 border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl'
              : 'bg-[#0e1018]/70 border-white/10 backdrop-blur-xl'
          }`}
        >
          {/* Netflix/Apple TV+ Style Brand Badge */}
          <button
            onClick={() => handleItemClick('hero')}
            onMouseEnter={() => playUiSound('hover')}
            className="group flex items-center gap-2.5 cursor-pointer"
            title="首頁"
          >
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#e50914] to-[#b20710] flex items-center justify-center font-display font-black text-white text-base shadow-[0_0_15px_rgba(229,9,20,0.5)]">
              C
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-sm tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                CINE<span className="text-[#e50914]">STREAM</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono-code text-neutral-400 font-semibold px-1.5 py-0.2 rounded bg-white/10">
                PRO
              </span>
            </div>
          </button>

          {/* Desktop Streaming Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.id === 'hero'
                  ? activeSection === 'hero'
                  : currentCategory === item.id && activeSection !== 'hero';
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => playUiSound('hover')}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeStreamingPill"
                      className="absolute inset-0 bg-white/15 rounded-full z-[-1] border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={13}
                    className={isActive ? 'text-[#e50914]' : 'text-neutral-400'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Sound, Random Pick, Mobile Trigger */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              onMouseEnter={() => playUiSound('hover')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                soundOn
                  ? 'text-neutral-300 hover:text-white hover:bg-white/10'
                  : 'text-neutral-600 hover:text-neutral-400 hover:bg-white/5'
              }`}
              title={soundOn ? '介面音效已開啟' : '介面音效已靜音'}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Random Movie Button (Netflix Shuffle Style) */}
            {onRandomMovie && (
              <button
                onClick={() => {
                  playUiSound('click');
                  onRandomMovie();
                }}
                onMouseEnter={() => playUiSound('hover')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03]"
                title="隨機播放 / 選一部電影"
              >
                <Shuffle size={13} className="text-[#e50914]" />
                <span className="hidden sm:inline">隨機選片</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => {
                playUiSound('switch');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="開啟選單"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed z-40 top-20 left-4 right-4 max-w-sm mx-auto p-4 rounded-3xl bg-[#0c0e16]/95 border border-white/15 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <span className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider">
                串流導航
              </span>
              <span className="text-[11px] font-mono-code text-[#e50914] bg-[#e50914]/10 px-2 py-0.5 rounded-full">
                CINESTREAM
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.id === 'hero'
                    ? activeSection === 'hero'
                    : currentCategory === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#e50914] text-white font-bold shadow-lg shadow-[#e50914]/30'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-neutral-400'} />
                      {item.label}
                    </span>
                    {isActive && <Sparkles size={14} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
