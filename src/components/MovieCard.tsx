import { useState } from 'react';
import { Play, Star, Info } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getPosterUrl, getGenreNames } from '../services/tmdb';

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
}: MovieCardProps) => {
  const [imgError, setImgError] = useState(false);

  const posterSrc = imgError
    ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'
    : getPosterUrl(movie.poster_path, 'w500');

  const genres = getGenreNames(movie.genre_ids);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2024';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="group relative rounded-2xl overflow-hidden bg-[#0d0f18] border border-white/10 hover:border-white/40 shadow-lg hover:shadow-[0_20px_45px_rgba(0,0,0,0.9)] transition-transform duration-200 ease-out flex flex-col cursor-pointer hover:scale-104 hover:-translate-y-1.5 hover:z-10"
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
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/85 border border-white/15 text-[11px] font-semibold text-white">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span>{rating}</span>
          </div>

          {/* 4K Stream Tag */}
          <span className="px-1.5 py-0.5 rounded bg-black/85 border border-white/10 text-[9px] font-mono-code font-bold text-neutral-300">
            4K HDR
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/75 p-4 flex flex-col justify-end transition-opacity duration-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
          <p className="text-xs text-neutral-200 line-clamp-3 leading-relaxed mb-3 font-normal">
            {movie.overview || 'Explore full movie details, cast & crew, and official trailers.'}
          </p>

          <div className="flex items-center gap-2">
            {onQuickTrailer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickTrailer(movie);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white text-black font-display font-bold text-xs hover:bg-neutral-200 transition-colors shadow-md cursor-pointer"
              >
                <Play size={12} className="fill-black" />
                <span>Trailer</span>
              </button>
            )}

            <button
              onClick={() => onSelectMovie(movie)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/20 text-white transition-colors cursor-pointer"
              title="View Movie Details"
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
            <span className="line-clamp-1 text-neutral-400">{genres[0] || 'Cinema'}</span>
          </div>
          <span className="text-emerald-400 font-semibold text-[10px]">
            Pop {Math.round(movie.popularity)}
          </span>
        </div>
      </div>
    </div>
  );
};
