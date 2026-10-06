import { motion } from 'framer-motion';
import { Play, Sparkles, Film, Star, ArrowDownRight, Globe, Clapperboard } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getBackdropUrl } from '../services/tmdb';
import { playUiSound } from '../utils/audio';

interface MovieHeroSectionProps {
  featuredMovie: Movie | null;
  onOpenDetails: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onExploreCategory: () => void;
}

export const MovieHeroSection = ({
  featuredMovie,
  onOpenDetails,
  onPlayTrailer,
  onExploreCategory,
}: MovieHeroSectionProps) => {
  const backdrop = featuredMovie
    ? getBackdropUrl(featuredMovie.backdrop_path, 'original')
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop';

  const title = featuredMovie?.title || 'SYNTHESIS CINEMA';
  const originalTitle = featuredMovie?.original_title || 'THE CURATED ARCHIVE';
  const rating = featuredMovie?.vote_average ? featuredMovie.vote_average.toFixed(1) : '8.6';
  const overview = featuredMovie?.overview ||
    '探索全球正在上映、最受歡迎與頂級口碑電影。收錄完整演職人員名單、官方高畫質預告片與直達官方網站。';

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#07080b]"
    >
      {/* Background Cinematic Backdrop Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover filter brightness-[0.38] contrast-110 scale-105"
        />

        {/* Ambient Glow Gradients */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#ccff00]/10 blur-[150px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[#00f0ff]/10 blur-[170px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-[#ff5533]/10 blur-[180px]" />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Radial vignette & gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/60 to-transparent" />
      </div>

      {/* Top Metadata Badges */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-mono-code text-neutral-300 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
          <span className="text-[#ccff00] font-semibold">TMDB LIVE SYNC</span>
          <span className="text-white/30">•</span>
          <span>CURATED CINEMATIC ARCHIVE</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 text-xs font-mono-code text-neutral-400"
        >
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Star size={13} className="text-[#ccff00] fill-[#ccff00]" />
            TMDB 評分 ★ {rating}
          </span>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00f0ff]">
            <Clapperboard size={13} />
            4K HDR & DOLBY VISION
          </span>
        </motion.div>
      </div>

      {/* Main Center Typographic Display */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 md:py-14">
        {/* Subhead Tag */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-mono-code text-xs md:text-sm tracking-[0.3em] uppercase text-[#ccff00] mb-3 flex items-center gap-2"
        >
          <Sparkles size={14} className="text-[#ccff00]" />
          <span>SPOTLIGHT SCREENING // 焦點院線</span>
        </motion.p>

        {/* Oversized Typographic Monument */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-5xl sm:text-7xl md:text-[8vw] lg:text-[8.5vw] leading-[0.92] tracking-tighter uppercase text-white selection:bg-[#ccff00] select-none"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-3"
          >
            <span className="font-display font-black text-3xl sm:text-5xl md:text-[5vw] leading-[0.9] tracking-tighter uppercase text-transparent text-stroke-strong hover:text-white transition-all duration-300">
              {originalTitle}
            </span>
            <span className="font-sans text-xs sm:text-sm md:text-base text-neutral-300 max-w-xl text-left sm:text-right font-normal leading-relaxed line-clamp-3">
              {overview}
            </span>
          </motion.div>
        </div>

        {/* Action Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 md:mt-12 flex flex-wrap items-center gap-4"
        >
          {featuredMovie && (
            <button
              onClick={() => {
                playUiSound('click');
                onPlayTrailer(featuredMovie);
              }}
              onMouseEnter={() => playUiSound('hover')}
              className="group relative px-8 py-4 rounded-full bg-[#ccff00] text-black font-display font-black text-sm md:text-base tracking-wider uppercase flex items-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(204,255,0,0.4)] cursor-pointer"
            >
              <Play size={16} className="fill-black relative z-10" />
              <span className="relative z-10">播放預告片</span>
              <ArrowDownRight
                size={18}
                className="relative z-10 transition-transform duration-300 group-hover:rotate-[-45deg]"
              />
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            </button>
          )}

          {featuredMovie && (
            <button
              onClick={() => {
                playUiSound('click');
                onOpenDetails(featuredMovie);
              }}
              onMouseEnter={() => playUiSound('hover')}
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono-code text-xs md:text-sm tracking-wider uppercase flex items-center gap-2.5 transition-all duration-200 cursor-pointer backdrop-blur-md"
            >
              <Film size={16} className="text-[#00f0ff]" />
              <span>演出名單與官方詳情</span>
            </button>
          )}

          <button
            onClick={() => {
              playUiSound('click');
              onExploreCategory();
            }}
            onMouseEnter={() => playUiSound('hover')}
            className="px-6 py-4 rounded-full bg-transparent hover:bg-white/5 border border-white/10 text-neutral-300 hover:text-white font-mono-code text-xs md:text-sm tracking-wider uppercase flex items-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <Globe size={15} className="text-neutral-400" />
            <span>瀏覽榜單清單</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Key Metric Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto w-full pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
            30,000+
          </span>
          <span className="text-xs font-mono-code uppercase text-neutral-400 tracking-wider">
            GLOBAL TMDB DATABASE
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#ccff00]">
            100% 4K
          </span>
          <span className="text-xs font-mono-code uppercase text-neutral-400 tracking-wider">
            YOUTUBE HD TRAILERS
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#00f0ff]">
            VERIFIED
          </span>
          <span className="text-xs font-mono-code uppercase text-neutral-400 tracking-wider">
            OFFICIAL STUDIO SITES
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#ff5533]">
            REAL-TIME
          </span>
          <span className="text-xs font-mono-code uppercase text-neutral-400 tracking-wider">
            IN-THEATERS LIVE SYNC
          </span>
        </div>
      </motion.div>
    </section>
  );
};
