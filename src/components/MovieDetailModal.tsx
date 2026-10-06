import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Play,
  ExternalLink,
  Film,
  Users,
  CheckCircle2,
  DollarSign,
  Clapperboard,
  Loader2,
  Clock,
  Calendar,
  Info,
} from 'lucide-react';
import type { Movie, MovieDetail, Trailer } from '../types/movie';
import { ActiveUnderline } from './ActiveUnderline';
import {
  fetchMovieDetails,
  getBackdropUrl,
  getPosterUrl,
} from '../services/tmdb';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  initialPlayTrailer?: boolean;
}

export const MovieDetailModal = ({
  movie,
  onClose,
  initialPlayTrailer = false,
}: MovieDetailModalProps) => {
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<Trailer | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'trailers'>('overview');

  useEffect(() => {
    if (!movie) {
      setDetail(null);
      setActiveTrailer(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    fetchMovieDetails(movie.id)
      .then((data) => {
        if (!isCancelled) {
          setDetail(data);
          if (data.trailers.length > 0) {
            setActiveTrailer(data.trailers[0]);
            if (initialPlayTrailer) {
              setActiveTab('trailers');
            }
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        if (!isCancelled) setIsLoading(false);
      });

    // Prevent background scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isCancelled = true;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movie, initialPlayTrailer, onClose]);

  if (!movie) return null;

  const current = detail || {
    ...movie,
    runtime: null,
    status: 'Released',
    tagline: '',
    homepage: null,
    imdb_id: null,
    budget: 0,
    revenue: 0,
    production_companies: [],
    cast: [],
    crew: [],
    directors: [],
    writers: [],
    composers: [],
    trailers: [],
  };

  const backdropSrc = getBackdropUrl(current.backdrop_path, 'w1280');
  const posterSrc = getPosterUrl(current.poster_path, 'w500');

  const formatCurrency = (val: number) => {
    if (!val || val <= 0) return 'Undisclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatRuntime = (mins: number | null) => {
    if (!mins) return 'N/A';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <AnimatePresence>
      <div
        style={{ overscrollBehavior: 'contain' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 overflow-y-auto overscroll-contain"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: 'contain' }}
          className="relative max-w-6xl 2xl:max-w-7xl w-full max-h-[94vh] overflow-y-auto rounded-3xl bg-[#0c0e16] border border-white/15 shadow-[0_25px_90px_rgba(0,0,0,0.95)] overscroll-contain"
        >
          {/* Close Button (Netflix/Apple Style) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black hover:bg-neutral-800 border border-white/20 text-white transition-all cursor-pointer z-30"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Cinematic Top Backdrop Banner */}
          <div className="relative h-64 sm:h-96 md:h-[460px] 2xl:h-[520px] w-full overflow-hidden bg-neutral-950">
            <img
              src={backdropSrc}
              alt={current.title}
              className="w-full h-full object-cover filter brightness-[0.7] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1017] via-transparent to-transparent opacity-80" />

            {/* Backdrop Title & Action Cluster */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight drop-shadow-md">
                  {current.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 font-semibold mt-1 drop-shadow-sm">
                  {current.original_title}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {current.trailers && current.trailers.length > 0 && (
                  <button
                    onClick={() => setActiveTab('trailers')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-display font-bold text-xs sm:text-sm hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
                  >
                    <Play size={15} className="fill-black" />
                    <span>Play Trailer ({current.trailers.length})</span>
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* Navigation Tabs (Underline Tabs Style) */}
          <div className="px-6 pt-3 border-b border-white/10 bg-[#0e1017] sticky top-0 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'overview' ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Info size={14} className={activeTab === 'overview' ? 'text-[#e50914]' : 'text-neutral-400'} />
                <span>Overview</span>
                {activeTab === 'overview' && (
                  <ActiveUnderline layoutId="streamingModalTab" className="left-0 right-0" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('cast')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'cast' ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users size={14} className={activeTab === 'cast' ? 'text-[#e50914]' : 'text-neutral-400'} />
                <span>Cast & Crew</span>
                {current.cast?.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-neutral-300 font-semibold">
                    {current.cast.length}
                  </span>
                )}
                {activeTab === 'cast' && (
                  <ActiveUnderline layoutId="streamingModalTab" className="left-0 right-0" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('trailers')}
                className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'trailers' ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film size={14} className={activeTab === 'trailers' ? 'text-[#e50914]' : 'text-neutral-400'} />
                <span>Trailers & Clips</span>
                {current.trailers?.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-neutral-300 font-semibold">
                    {current.trailers.length}
                  </span>
                )}
                {activeTab === 'trailers' && (
                  <ActiveUnderline layoutId="streamingModalTab" className="left-0 right-0" />
                )}
              </button>
            </div>

            {/* Quality & Score Strip */}
            <div className="hidden sm:flex items-center gap-3 py-2 text-xs text-neutral-300">
              {isLoading && (
                <span className="flex items-center gap-1 text-[11px] text-[#e50914]">
                  <Loader2 size={12} className="animate-spin" />
                  Loading details...
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star size={13} className="fill-amber-400" />
                <span className="text-white">{current.vote_average ? current.vote_average.toFixed(1) : 'NR'}</span>
              </div>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Column: Poster & External Links */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl mb-4">
                    <img
                      src={posterSrc}
                      alt={current.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Official Links */}
                  <div className="w-full flex flex-col gap-2">
                    <a
                      href={`https://www.themoviedb.org/movie/${current.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Clapperboard size={14} className="text-sky-400" />
                        TMDB Database
                      </span>
                      <ExternalLink size={12} />
                    </a>

                    {current.imdb_id && (
                      <a
                        href={`https://www.imdb.com/title/${current.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2 text-amber-400 font-bold">
                          IMDb Page
                        </span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Metadata & Synopsis */}
                <div className="md:col-span-8 flex flex-col gap-6">
                  {/* Streaming Metadata Bar */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-300 border-b border-white/10 pb-4">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      98% Match
                    </span>
                    <span className="text-neutral-500">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-neutral-400" />
                      <span>{current.release_date || 'TBD'}</span>
                    </div>
                    <span className="text-neutral-500">•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-neutral-400" />
                      <span>{formatRuntime(current.runtime)}</span>
                    </div>
                    <span className="text-neutral-500">•</span>
                    <span className="px-1.5 py-0.5 rounded border border-white/20 text-[10px] text-neutral-300">
                      4K Ultra HD
                    </span>
                  </div>

                  {/* Synopsis */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Storyline
                    </h4>
                    <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed">
                      {current.overview || 'No storyline description available for this title.'}
                    </p>
                  </div>

                  {/* Genres */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {current.genres?.map((g) => (
                        <span
                          key={g.id}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-neutral-200"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Creators */}
                  {(current.directors?.length > 0 || current.composers?.length > 0) && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
                        Director & Key Creators
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {current.directors?.map((dir) => (
                          <div key={dir.id}>
                            <span className="text-[10px] text-[#e50914] font-bold block">
                              DIRECTOR
                            </span>
                            <span className="text-xs font-bold text-white">
                              {dir.name} ({dir.original_name})
                            </span>
                          </div>
                        ))}

                        {current.composers?.slice(0, 1).map((comp) => (
                          <div key={comp.id}>
                            <span className="text-[10px] text-sky-400 font-bold block">
                              ORIGINAL MUSIC
                            </span>
                            <span className="text-xs font-bold text-white">
                              {comp.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial & Production Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                        Budget
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-white">
                        <DollarSign size={13} className="text-emerald-400" />
                        {formatCurrency(current.budget)}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                        Box Office
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-white">
                        <DollarSign size={13} className="text-amber-400" />
                        {formatCurrency(current.revenue)}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                        Status
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {current.status === 'Released' ? 'Released' : current.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CAST & CREW */}
            {activeTab === 'cast' && (
              <div>
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-white">
                    Top Billed Cast
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Full cast of {current.cast?.length || 0} performers
                  </p>
                </div>

                {/* Cast Portrait Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-3.5">
                  {current.cast?.map((member) => (
                    <div
                      key={member.id}
                      className="group p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 transition-all flex flex-col"
                    >
                      <h5 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1">
                        {member.name}
                      </h5>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        as {member.character || 'Self'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Additional Crew */}
                {current.crew?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="font-display font-bold text-base text-white mb-3">
                      Key Crew & Writers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {current.crew?.slice(0, 9).map((c, idx) => (
                        <div
                          key={`${c.id}-${idx}`}
                          className="p-3 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase block">
                              {c.job || c.department}
                            </span>
                            <span className="font-bold text-white">
                              {c.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TRAILERS */}
            {activeTab === 'trailers' && (
              <div>
                <div className="mb-4">
                  <h3 className="font-display font-bold text-xl text-white">
                    Official Trailers & Videos
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Stream official high-definition YouTube previews directly
                  </p>
                </div>

                {current.trailers && current.trailers.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {/* Main Embed Player */}
                    {activeTrailer && (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${activeTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
                          title={activeTrailer.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                    )}

                    {/* Active Trailer Info */}
                    {activeTrailer && (
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <div>
                          <span className="text-[10px] font-bold text-[#e50914] uppercase tracking-wider block">
                            NOW PLAYING // {activeTrailer.type}
                          </span>
                          <h4 className="font-display font-bold text-sm sm:text-base text-white">
                            {activeTrailer.name}
                          </h4>
                        </div>

                        <a
                          href={`https://www.youtube.com/watch?v=${activeTrailer.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                        >
                          <Play size={12} className="fill-current" />
                          <span>Watch on YouTube</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}

                    {/* Other Trailers List */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                        More Trailers & Clips
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {current.trailers.map((t) => {
                          const isSelected = activeTrailer?.id === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setActiveTrailer(t)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-[#e50914]/15 border-[#e50914] text-white shadow-md'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-300'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] mb-1">
                                <span className={isSelected ? 'text-[#e50914] font-bold' : 'text-neutral-400'}>
                                  {t.type}
                                </span>
                                {t.official && (
                                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-neutral-300 font-semibold">
                                    OFFICIAL
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-xs line-clamp-2">
                                {t.name}
                              </h5>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center rounded-xl bg-white/[0.02] border border-white/10">
                    <p className="text-sm text-neutral-400 mb-3">
                      No official trailers found for this title.
                    </p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(current.title + ' trailer')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      <Play size={13} />
                      Search on YouTube
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
