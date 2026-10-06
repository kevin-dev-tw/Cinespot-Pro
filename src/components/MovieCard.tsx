import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Info } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getPosterUrl, getGenreNames } from '../services/tmdb';
import { playUiSound } from '../utils/audio';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onQuickTrailer?: (movie: Movie) => void;
  index?: number;
}

export const MovieCard = ({
  movie,
  onSelectMovie,
  onQuickTrailer,
  index = 0,
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const posterSrc = imgError
    ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'
    : getPosterUrl(movie.poster_path, 'w500');

  const genres = getGenreNames(movie.genre_ids);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2024';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      onMouseEnter={() => {
        playUiSound('hover');
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        playUiSound('click');
        onSelectMovie(movie);
      }}
      className={`group relative rounded-2xl overflow-hidden bg-[#0d0f18] border transition-all duration-300 flex flex-col cursor-pointer ${
        isHovered
          ? 'scale-104 -translate-y-1.5 border-white/40 shadow-[0_20px_45px_rgba(0,0,0,0.9)] z-10'
          : 'border-white/10 hover:border-white/20 shadow-lg'
      }`}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Streaming Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f18] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Rating Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span>{rating}</span>
          </div>

          {/* 4K Stream Tag */}
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono-code font-bold text-neutral-300">
            4K HDR
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div
          className={`absolute inset-0 bg-black/65 backdrop-blur-xs p-4 flex flex-col justify-end transition-opacity duration-200 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-xs text-neutral-200 line-clamp-3 leading-relaxed mb-3 font-normal">
            {movie.overview || '點擊探索電影詳情、演出人員陣容與官方預告片。'}
          </p>

          <div className="flex items-center gap-2">
            {onQuickTrailer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playUiSound('click');
                  onQuickTrailer(movie);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white text-black font-display font-bold text-xs hover:bg-neutral-200 transition-colors shadow-md cursor-pointer"
              >
                <Play size={12} className="fill-black" />
                <span>預告片</span>
              </button>
            )}

            <button
              onClick={() => {
                playUiSound('click');
                onSelectMovie(movie);
              }}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/20 text-white transition-colors cursor-pointer"
              title="查看電影詳細資料"
            >
              <Info size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Bottom Area */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#0d0f18]">
        {/* Title */}
        <div>
          <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-white transition-colors leading-snug line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1 font-medium">
            {movie.original_title}
          </p>
        </div>

        {/* Bottom Specs Line */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span>{releaseYear}</span>
            <span>•</span>
            <span className="line-clamp-1 text-neutral-400">{genres[0] || '電影'}</span>
          </div>
          <span className="text-emerald-400 font-semibold text-[10px]">
            熱度 {Math.round(movie.popularity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
