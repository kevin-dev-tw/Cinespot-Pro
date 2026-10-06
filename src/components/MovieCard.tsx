import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Sparkles, ArrowUpRight, Film } from 'lucide-react';
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
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2026';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      onMouseEnter={() => {
        playUiSound('hover');
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        playUiSound('click');
        onSelectMovie(movie);
      }}
      className={`group relative rounded-3xl overflow-hidden bg-[#0e1017] border transition-all duration-500 flex flex-col cursor-pointer ${
        isHovered
          ? 'border-[#ccff00] shadow-[0_15px_40px_rgba(204,255,0,0.18)] -translate-y-1.5'
          : 'border-white/10 hover:border-white/25 shadow-xl'
      }`}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter contrast-105"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-black/50" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* TMDB Rating Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono-code">
            <Star size={12} className="text-[#ccff00] fill-[#ccff00]" />
            <span className="font-bold text-white">{rating}</span>
            <span className="text-[10px] text-neutral-400">({movie.vote_count})</span>
          </div>

          {/* Release Year Pill */}
          <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono-code text-[#00f0ff]">
            {releaseYear}
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm p-5 flex flex-col justify-end transition-opacity duration-300 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-xs font-sans text-neutral-300 line-clamp-4 leading-relaxed mb-4">
            {movie.overview || '點擊以探索完整電影資訊、演員陣容與官方預告片。'}
          </p>

          <div className="flex items-center gap-2">
            {onQuickTrailer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playUiSound('click');
                  onQuickTrailer(movie);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#ccff00] text-black font-display font-black text-xs uppercase tracking-wider hover:bg-white transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)] cursor-pointer"
              >
                <Play size={13} className="fill-black" />
                <span>播放預告</span>
              </button>
            )}

            <button
              onClick={() => {
                playUiSound('click');
                onSelectMovie(movie);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
              title="查看詳情"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Bottom Strip */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-[#0e1017]">
        {/* Genre Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {genres.map((g, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono-code text-[#00f0ff] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10"
            >
              {g}
            </span>
          ))}
          {movie.popularity > 300 && (
            <span className="flex items-center gap-1 text-[10px] font-mono-code text-[#ff5533] px-2 py-0.5 rounded-full bg-[#ff5533]/10 border border-[#ff5533]/20">
              <Sparkles size={9} />
              HOT
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#ccff00] transition-colors leading-snug line-clamp-1">
            {movie.title}
          </h3>
          <p className="font-mono-code text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
            {movie.original_title}
          </p>
        </div>

        {/* View Details Hint */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-code text-neutral-400">
          <span className="flex items-center gap-1 text-neutral-400 group-hover:text-white transition-colors">
            <Film size={12} className="text-[#ccff00]" />
            詳細資訊與陣容
          </span>
          <span className="text-white/40 group-hover:text-[#ccff00] group-hover:translate-x-0.5 transition-all">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
};
