import { motion } from 'framer-motion';
import { Play, Info, Star, CheckCircle2, Clapperboard, Flame } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getBackdropUrl } from '../services/tmdb';
import { playUiSound } from '../utils/audio';

interface MovieHeroSectionProps {
  featuredMovie: Movie | null;
  onOpenDetails: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
}

export const MovieHeroSection = ({
  featuredMovie,
  onOpenDetails,
  onPlayTrailer,
}: MovieHeroSectionProps) => {
  const backdrop = featuredMovie
    ? getBackdropUrl(featuredMovie.backdrop_path, 'original')
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop';

  const title = featuredMovie?.title || '沙丘：第二部';
  const originalTitle = featuredMovie?.original_title || 'DUNE: PART TWO';
  const rating = featuredMovie?.vote_average ? featuredMovie.vote_average.toFixed(1) : '8.4';
  const releaseYear = featuredMovie?.release_date ? featuredMovie.release_date.slice(0, 4) : '2024';
  const overview = featuredMovie?.overview ||
    '保羅·亞崔迪與荃妮及弗瑞曼人聯手，對摧毀他家族的陰謀者展開報復。在面對一生摯愛與已知宇宙命運之間的抉擇時，他努力阻止只有他能預見的慘烈未來。';

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[92vh] w-full flex flex-col justify-end pb-16 pt-32 px-4 sm:px-8 lg:px-16 overflow-hidden bg-[#06070a]"
    >
      {/* Background Cinematic Backdrop Image with Apple/Netflix Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-105 scale-102"
        />

        {/* Netflix/Apple TV+ Signature Radial & Linear Dark Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06070a] via-[#06070a]/70 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-radial-[circle_at_75%_30%] from-transparent via-transparent to-[#06070a]/80" />
      </div>

      {/* Main Streaming Billboard Content */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col gap-4">
        {/* Top Badges (Netflix TOP 10 + 4K HDR strip) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 sm:gap-3"
        >
          {/* Netflix Red TOP 10 Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e50914] text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            <Flame size={13} className="fill-white" />
            <span>TOP 10 今日霸榜推薦</span>
          </div>

          {/* Quality Tags (Apple TV+ Style) */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-neutral-300">
            <span className="px-1.5 py-0.5 rounded border border-white/20 bg-black/40 backdrop-blur-sm">
              4K ULTRA HD
            </span>
            <span className="px-1.5 py-0.5 rounded border border-white/20 bg-black/40 backdrop-blur-sm">
              DOLBY VISION
            </span>
            <span className="px-1.5 py-0.5 rounded border border-white/20 bg-black/40 backdrop-blur-sm">
              ATMOS
            </span>
          </div>
        </motion.div>

        {/* Movie Title Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-1"
        >
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {title}
          </h1>
          <p className="font-display font-bold text-lg sm:text-2xl text-neutral-300 tracking-wide mt-2 drop-shadow-md">
            {originalTitle}
          </p>
        </motion.div>

        {/* Streaming Info Metadata Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-300"
        >
          {/* Match Score (Netflix green percentage style) */}
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={14} />
            98% 喜愛度配對
          </span>
          <span className="text-neutral-500">•</span>
          <span>{releaseYear}</span>
          <span className="text-neutral-500">•</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={13} className="fill-amber-400" />
            <span className="font-bold text-white">{rating}</span>
            <span className="text-neutral-400">/ 10</span>
          </div>
          <span className="text-neutral-500">•</span>
          <span className="px-1.5 py-0.5 rounded border border-white/20 text-[10px] text-neutral-300">
            13+
          </span>
        </motion.div>

        {/* Synopsis Teaser */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-sm sm:text-base text-neutral-300/90 leading-relaxed max-w-2xl line-clamp-3 drop-shadow-md font-normal"
        >
          {overview}
        </motion.p>

        {/* Streaming Action Buttons (Netflix Play + More Info Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-3.5 mt-2"
        >
          {featuredMovie && (
            <button
              onClick={() => {
                playUiSound('click');
                onPlayTrailer(featuredMovie);
              }}
              onMouseEnter={() => playUiSound('hover')}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-black font-display font-bold text-sm sm:text-base hover:bg-neutral-200 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_4px_25px_rgba(255,255,255,0.25)]"
            >
              <Play size={18} className="fill-black" />
              <span>播放預告片</span>
            </button>
          )}

          {featuredMovie && (
            <button
              onClick={() => {
                playUiSound('click');
                onOpenDetails(featuredMovie);
              }}
              onMouseEnter={() => playUiSound('hover')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-display font-semibold text-sm sm:text-base backdrop-blur-md border border-white/15 transition-all duration-200 cursor-pointer"
            >
              <Info size={18} />
              <span>更多資訊與演職人員</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Floating Bottom Right Badge (Sound & Tech Specs) */}
      <div className="hidden lg:flex absolute bottom-12 right-12 flex-col items-end gap-1.5 text-right">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-xs text-neutral-300">
          <Clapperboard size={14} className="text-[#e50914]" />
          <span>IMAX Enhanced • Dolby Atmos</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-medium">
          4K HDR 頂級視聽體驗
        </span>
      </div>
    </section>
  );
};
