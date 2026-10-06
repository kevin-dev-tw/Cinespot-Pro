import { RefreshCw, AlertCircle } from 'lucide-react';
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
    <section id="movie-grid" className="relative w-full py-12 px-4 sm:px-8 lg:px-16 bg-[#06070a]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
              <span>{categoryTitle}</span>
              {totalCount !== undefined && totalCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-neutral-400">
                  {totalCount}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-normal">
              {categorySubtitle}
            </p>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#0d0f18] border border-white/5 p-3 flex flex-col gap-3 animate-pulse"
              >
                <div className="w-full aspect-[2/3] bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/10 rounded-full w-3/4" />
                <div className="h-3 bg-white/5 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center rounded-2xl border border-white/10 bg-[#0d0f18]/60 p-8 flex flex-col items-center justify-center">
            <AlertCircle size={36} className="text-neutral-400 mb-3" />
            <h3 className="font-display font-bold text-lg text-white mb-1">
              未找到符合的電影
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm">
              請嘗試更換搜尋關鍵字，或切換其他類型分類探索。
            </p>
          </div>
        ) : (
          /* Streaming Movie Grid */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
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

            {/* Load More Button */}
            {hasMore && onLoadMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => {
                    playUiSound('click');
                    onLoadMore();
                  }}
                  disabled={isLoadingMore}
                  className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-display font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={`text-white ${isLoadingMore ? 'animate-spin' : ''}`}
                  />
                  <span>{isLoadingMore ? '正在載入...' : '瀏覽更多電影'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
