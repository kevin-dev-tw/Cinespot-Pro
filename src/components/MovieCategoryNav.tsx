import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Flame, Sparkles, Trophy, X, SlidersHorizontal } from 'lucide-react';
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

const CATEGORIES: { id: MovieCategory; label: string; icon: typeof Flame }[] = [
  { id: 'now_playing', label: '現正上映', icon: Flame },
  { id: 'popular', label: '熱門強檔', icon: Sparkles },
  { id: 'top_rated', label: '高分口碑', icon: Trophy },
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
    <div
      id="movie-filter-section"
      className="sticky top-0 z-30 w-full py-4 px-4 sm:px-8 lg:px-16 bg-[#06070a]/90 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 shadow-md"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-3">
        {/* Row 1: Categories + Search Bar + Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main 3 Streaming Categories (Netflix Style Pill Tabs) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
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
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryStreaming"
                      className="absolute inset-0 bg-[#e50914] rounded-xl z-[-1] shadow-[0_4px_18px_rgba(229,9,20,0.45)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Icon
                    size={14}
                    className={isActive ? 'text-white' : 'text-neutral-400'}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜尋電影、演員、導演..."
                className="w-full py-2 pl-9 pr-8 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/40 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all"
              />
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => {
                playUiSound('click');
                setShowGenreFilter(!showGenreFilter);
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                showGenreFilter || selectedGenreId !== null
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-neutral-300 hover:text-white border-white/10'
              }`}
              title="篩選電影類型"
            >
              <SlidersHorizontal size={15} />
            </button>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => {
                playUiSound('switch');
                onSortChange(e.target.value as 'popularity' | 'vote_average' | 'release_date');
              }}
              aria-label="排序方式"
              className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="popularity" className="bg-[#0b0d14] text-white">
                排序：熱度最高
              </option>
              <option value="vote_average" className="bg-[#0b0d14] text-white">
                排序：口碑評分
              </option>
              <option value="release_date" className="bg-[#0b0d14] text-white">
                排序：上映日期
              </option>
            </select>
          </div>
        </div>

        {/* Row 2: Genre Pills (Netflix Horizontal Filter Rail) */}
        {(showGenreFilter || selectedGenreId !== null) && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 pb-1"
          >
            <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap mr-1">
              類型：
            </span>
            <button
              onClick={() => {
                playUiSound('click');
                onSelectGenre(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedGenreId === null
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              全部
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-sm'
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
