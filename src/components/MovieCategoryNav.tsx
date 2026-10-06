import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Flame, Sparkles, Trophy, X, Filter } from 'lucide-react';
import type { MovieCategory } from '../types/movie';
import { GENRES_LIST } from '../services/tmdb';
import { playUiSound } from '../utils/audio';

interface MovieCategoryNavProps {
  currentCategory: MovieCategory;
  onSelectCategory: (category: MovieCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGenreId: number | null;
  onSelectGenre: (id: number | null) => void;
  sortBy: 'popularity' | 'vote_average' | 'release_date';
  onSortChange: (sort: 'popularity' | 'vote_average' | 'release_date') => void;
}

const CATEGORIES: { id: MovieCategory; label: string; labelEn: string; icon: typeof Flame }[] = [
  { id: 'now_playing', label: '現正熱映', labelEn: 'NOW PLAYING', icon: Flame },
  { id: 'popular', label: '最受歡迎', labelEn: 'POPULAR', icon: Sparkles },
  { id: 'top_rated', label: '高分口碑', labelEn: 'TOP RATED', icon: Trophy },
];

export const MovieCategoryNav = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedGenreId,
  onSelectGenre,
  sortBy,
  onSortChange,
}: MovieCategoryNavProps) => {
  const [showGenreFilter, setShowGenreFilter] = useState(false);

  return (
    <div id="movie-filter-section" className="sticky top-20 z-30 w-full py-4 px-4 sm:px-6 lg:px-12 bg-[#07080b]/90 backdrop-blur-2xl border-y border-white/10">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
        {/* Row 1: Category Tabs + Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main 3 Categories */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0f1118] border border-white/10 overflow-x-auto custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.id && !searchQuery.trim();
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playUiSound('switch');
                    onSelectCategory(cat.id);
                  }}
                  onMouseEnter={() => playUiSound('hover')}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-black font-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[#ccff00] rounded-xl z-[-1] shadow-[0_0_20px_rgba(204,255,0,0.4)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Icon
                    size={15}
                    className={isActive ? 'text-black' : 'text-[#00f0ff]'}
                  />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-mono-code ${
                      isActive ? 'text-black/70' : 'text-neutral-500'
                    }`}
                  >
                    {cat.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box & Sort Selector */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜尋電影、導演、片名..."
                className="w-full py-2.5 pl-10 pr-9 rounded-full bg-white/5 border border-white/10 hover:border-white/25 focus:border-[#ccff00] text-sm text-white placeholder-neutral-500 outline-none transition-all font-mono-code"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => {
                playUiSound('click');
                setShowGenreFilter(!showGenreFilter);
              }}
              className={`p-2.5 rounded-full border transition-colors cursor-pointer flex items-center justify-center ${
                showGenreFilter || selectedGenreId !== null
                  ? 'bg-[#ccff00] text-black border-[#ccff00]'
                  : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
              }`}
              title="篩選類型"
            >
              <Filter size={16} />
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                playUiSound('switch');
                onSortChange(e.target.value as 'popularity' | 'vote_average' | 'release_date');
              }}
              aria-label="電影排序方式"
              className="py-2.5 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-neutral-300 hover:text-white focus:outline-none focus:border-[#ccff00] cursor-pointer"
            >
              <option value="popularity" className="bg-[#0b0c10] text-white">
                排序：熱門度
              </option>
              <option value="vote_average" className="bg-[#0b0c10] text-white">
                排序：TMDB評分
              </option>
              <option value="release_date" className="bg-[#0b0c10] text-white">
                排序：上映日期
              </option>
            </select>
          </div>
        </div>

        {/* Row 2: Genre Filter Chips (Collapsible / Expandable) */}
        {(showGenreFilter || selectedGenreId !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-2"
          >
            <span className="text-xs font-mono-code text-neutral-500 whitespace-nowrap">
              類型過濾：
            </span>
            <button
              onClick={() => {
                playUiSound('click');
                onSelectGenre(null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono-code transition-colors whitespace-nowrap cursor-pointer ${
                selectedGenreId === null
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              全部類型
            </button>
            {GENRES_LIST.map((genre) => {
              const isSelected = selectedGenreId === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => {
                    playUiSound('click');
                    onSelectGenre(isSelected ? null : genre.id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono-code transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {genre.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};
