import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sparkles,
  Flame,
  Compass,
  Trophy,
  Search,
} from 'lucide-react';
import type { MovieCategory } from '../types/movie';
import { ActiveUnderline } from './ActiveUnderline';

interface FloatingPillNavProps {
  activeSection: string;
  currentCategory: MovieCategory;
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: MovieCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const NAV_ITEMS: { id: string; label: string; icon: typeof Compass }[] = [
  { id: 'hero', label: 'Featured', icon: Compass },
  { id: 'now_playing', label: 'In Theaters', icon: Flame },
  { id: 'popular', label: 'Popular', icon: Sparkles },
  { id: 'top_rated', label: 'Top Rated', icon: Trophy },
];

const SearchInput = ({
  value,
  onChange,
  className = '',
  inputClassName = '',
}: {
  value: string;
  onChange: (query: string) => void;
  className?: string;
  inputClassName?: string;
}) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search movies, actors, directors..."
      className={`w-full py-2 pl-9 pr-9 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/40 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all ${inputClassName}`}
    />
    <Search
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white cursor-pointer"
        aria-label="Clear Search"
      >
        <X size={13} />
      </button>
    )}
  </div>
);

export const FloatingPillNav = ({
  activeSection,
  currentCategory,
  onNavigate,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: FloatingPillNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleItemClick = (id: string) => {
    if (id === 'hero') {
      onNavigate('hero');
    } else if (id === 'now_playing' || id === 'popular' || id === 'top_rated') {
      onSelectCategory(id as MovieCategory);
      onNavigate('movie-grid');
    }
    setMobileMenuOpen(false);
  };

  const handleViewResults = () => {
    setMobileMenuOpen(false);
    onNavigate('movie-grid');
  };

  return (
    <>
      {/* Full-Bleed Streaming Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-14 sm:h-16 bg-[#06070a] border-b border-white/10 shadow-md">
        <div className="w-full h-full px-4 sm:px-8 lg:px-14 2xl:px-20 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Desktop Nav Tabs */}
          <div className="flex items-center gap-6 lg:gap-10 min-w-0">
            {/* Logo */}
            <button
              onClick={() => handleItemClick('hero')}
              className="flex items-center cursor-pointer group shrink-0"
              title="Home"
            >
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                CINESPOT PRO
              </span>
            </button>

            {/* Desktop Navigation Links (Underline Tabs Style) */}
            <nav className="hidden lg:flex items-center gap-1">
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
                    className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon
                      size={14}
                      className={isActive ? 'text-[#e50914]' : 'text-neutral-400'}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <ActiveUnderline layoutId="activeNavUnderline" className="left-0 right-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action: Search & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-3">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                className="w-52 xl:w-72"
              />
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-0 top-14 sm:top-16 bottom-0 z-40 lg:hidden bg-[#06070a] overflow-y-auto overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="w-full min-h-full px-4 sm:px-8 py-6 flex flex-col">
              {/* Mobile Search */}
              <div className="mb-7">
                <span className="block text-[10px] font-mono-code text-neutral-500 uppercase tracking-[0.2em] mb-2.5">
                  Search
                </span>
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                  inputClassName="py-3.5 pl-10 pr-11 rounded-2xl text-sm bg-white/[0.07]"
                />
                {searchQuery.trim() && (
                  <button
                    onClick={handleViewResults}
                    className="mt-3 w-full py-3 rounded-2xl bg-[#e50914] text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    View Results
                  </button>
                )}
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1">
                <span className="block text-[10px] font-mono-code text-neutral-500 uppercase tracking-[0.2em] mb-2.5">
                  Browse
                </span>
                <nav className="flex flex-col">
                  {NAV_ITEMS.map((item) => {
                    const isActive =
                      item.id === 'hero'
                        ? activeSection === 'hero'
                        : currentCategory === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`relative min-h-[48px] flex items-center px-1 text-base font-display font-bold transition-colors text-left cursor-pointer border-b border-white/5 ${
                          isActive
                            ? 'text-white'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <ActiveUnderline layoutId="activeMobileNavUnderline" className="left-0 w-14" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
