import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowUp, ArrowDown, Menu, X, Sparkles, Shuffle } from 'lucide-react';
import type { MovieCategory } from '../types/movie';
import { playUiSound, toggleSound } from '../utils/audio';

interface FloatingPillNavProps {
  activeSection: string;
  currentCategory: MovieCategory;
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: MovieCategory) => void;
  onRandomMovie?: () => void;
  navPosition: 'top' | 'bottom';
  setNavPosition: (pos: 'top' | 'bottom') => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: '焦點', labelEn: 'Featured', number: '01' },
  { id: 'now_playing', label: '正在上映', labelEn: 'Now Playing', number: '02' },
  { id: 'popular', label: '最受歡迎', labelEn: 'Popular', number: '03' },
  { id: 'top_rated', label: '高分口碑', labelEn: 'Top Rated', number: '04' },
];

export const FloatingPillNav = ({
  activeSection,
  currentCategory,
  onNavigate,
  onSelectCategory,
  onRandomMovie,
  navPosition,
  setNavPosition,
}: FloatingPillNavProps) => {
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 40);
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

  const togglePosition = () => {
    playUiSound('switch');
    setNavPosition(navPosition === 'top' ? 'bottom' : 'top');
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
          className="h-full bg-gradient-to-r from-[#ccff00] via-[#00f0ff] to-[#ff5533] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Pill Container */}
      <motion.header
        initial={{ y: navPosition === 'top' ? -50 : 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed z-40 left-0 right-0 flex justify-center px-4 pointer-events-none ${
          navPosition === 'top' ? 'top-5 md:top-6' : 'bottom-5 md:bottom-6'
        }`}
      >
        <div
          className={`pointer-events-auto flex items-center gap-1 md:gap-2 px-2.5 py-2 md:px-3 md:py-2.5 rounded-full border border-white/12 backdrop-blur-xl transition-all duration-300 shadow-2xl ${
            scrolled
              ? 'bg-[#0d0e14]/90 border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
              : 'bg-[#12131c]/75 border-white/10'
          }`}
        >
          {/* Brand Mark with Pulse dot */}
          <button
            onClick={() => handleItemClick('hero')}
            onMouseEnter={() => playUiSound('hover')}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            title="SYNTHESIS CINEMA 首頁"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
            </span>
            <span className="font-display font-extrabold tracking-wider text-xs md:text-sm text-white flex items-center gap-1.5">
              SYNTHESIS
              <span className="text-[#ccff00] font-mono-code text-[11px] font-semibold">CINEMA</span>
            </span>
          </button>

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.id === 'hero'
                  ? activeSection === 'hero'
                  : currentCategory === item.id && activeSection !== 'hero';

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => playUiSound('hover')}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isActive ? 'text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillIndicator"
                      className="absolute inset-0 bg-[#ccff00] rounded-full z-[-1] shadow-[0_0_15px_rgba(204,255,0,0.4)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono-code ${
                        isActive ? 'text-black/70' : 'text-neutral-500'
                      }`}
                    >
                      {item.number}
                    </span>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-white/15" />

          {/* Audio toggle button */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={() => playUiSound('hover')}
            className={`p-2 rounded-full text-xs transition-colors cursor-pointer ${
              soundOn
                ? 'text-[#00f0ff] hover:bg-[#00f0ff]/10'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            }`}
            title={soundOn ? '介面音效開啟 (點擊靜音)' : '介面音效已靜音 (點擊開啟)'}
          >
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Pill Position Switch (Top / Bottom) */}
          <button
            onClick={togglePosition}
            onMouseEnter={() => playUiSound('hover')}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:flex items-center"
            title={`固定至 ${navPosition === 'top' ? '底部' : '頂部'}`}
          >
            {navPosition === 'top' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          </button>

          {/* Random Movie / Surprise CTA */}
          {onRandomMovie && (
            <button
              onClick={() => {
                playUiSound('click');
                onRandomMovie();
              }}
              onMouseEnter={() => playUiSound('hover')}
              className="relative group overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold tracking-tight hover:bg-[#ccff00] transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              title="隨機推薦一部電影"
            >
              <Shuffle size={13} className="transition-transform group-hover:rotate-45" />
              <span>隨機選片</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => {
              playUiSound('switch');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-40 left-4 right-4 max-w-sm mx-auto p-4 rounded-3xl bg-[#0f1017]/95 border border-white/15 backdrop-blur-2xl shadow-2xl ${
              navPosition === 'top' ? 'top-20' : 'bottom-20'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <span className="text-xs font-mono-code text-neutral-400">電影探索導航</span>
              <button
                onClick={togglePosition}
                className="flex items-center gap-1 text-[11px] font-mono-code text-[#ccff00] bg-white/5 px-2 py-1 rounded-full cursor-pointer"
              >
                停靠: {navPosition.toUpperCase()}
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.id === 'hero'
                    ? activeSection === 'hero'
                    : currentCategory === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#ccff00] text-black font-bold'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono-code ${
                          isActive ? 'text-black/60' : 'text-neutral-500'
                        }`}
                      >
                        {item.number}
                      </span>
                      {item.label}
                    </span>
                    {isActive && <Sparkles size={14} />}
                  </button>
                );
              })}
              {onRandomMovie && (
                <div className="pt-2 mt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRandomMovie();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#ccff00] to-[#00f0ff] text-black font-extrabold text-sm uppercase tracking-wider cursor-pointer"
                  >
                    <Shuffle size={16} />
                    隨機推薦一部電影
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
