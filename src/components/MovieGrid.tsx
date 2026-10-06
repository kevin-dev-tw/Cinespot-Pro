import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import type { Movie, MovieCategory } from '../types/movie';
import { MovieCard } from './MovieCard';
import { playUiSound } from '../utils/audio';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  onSelectMovie: (movie: Movie) => void;
  onQuickTrailer: (movie: Movie) => void;
  category: MovieCategory;
  categoryTitle: string;
  categorySubtitle: string;
  totalCount?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const MovieGrid = ({
  movies,
  isLoading,
  onSelectMovie,
  onQuickTrailer,
  categoryTitle,
  categorySubtitle,
  totalCount,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: MovieGridProps) => {
  return (
    <section id="movie-grid" className="relative w-full py-16 px-4 sm:px-6 lg:px-12 bg-[#07080b]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 text-[#ccff00] font-mono-code text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} />
                TMDB ARCHIVE // 01
              </span>
              {totalCount !== undefined && (
                <span className="text-neutral-500 font-mono-code text-xs">
                  共 {totalCount} 部電影收錄
                </span>
              )}
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight">
              {categoryTitle}
            </h2>
          </div>
          <p className="max-w-md font-mono-code text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {categorySubtitle}
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-[#0e1017] border border-white/5 p-4 flex flex-col gap-3 animate-pulse"
              >
                <div className="w-full aspect-[2/3] bg-white/5 rounded-2xl" />
                <div className="h-4 bg-white/10 rounded-full w-2/3" />
                <div className="h-3 bg-white/5 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-3xl border border-white/10 bg-[#0e1017]/60 p-8 flex flex-col items-center justify-center">
            <AlertCircle size={40} className="text-[#00f0ff] mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">
              未找到相關電影
            </h3>
            <p className="font-mono-code text-xs text-neutral-400 max-w-sm">
              請嘗試更換關鍵字或重設篩選條件，重新瀏覽精彩的院線與熱門片單。
            </p>
          </div>
        ) : (
          /* Movie Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
              {movies.map((movie, index) => (
                <MovieCard
                  key={`${movie.id}-${index}`}
                  movie={movie}
                  index={index}
                  onSelectMovie={onSelectMovie}
                  onQuickTrailer={onQuickTrailer}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && onLoadMore && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => {
                    playUiSound('click');
                    onLoadMore();
                  }}
                  disabled={isLoadingMore}
                  className="group px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#ccff00] text-white font-mono-code text-xs md:text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={`text-[#ccff00] ${isLoadingMore ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
                  />
                  <span>{isLoadingMore ? '載入中...' : '載入更多電影'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
