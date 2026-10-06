import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Play,
  Globe,
  ExternalLink,
  Film,
  Users,
  CheckCircle2,
  DollarSign,
  Clapperboard,
  Loader2,
  Clock,
  Calendar,
} from 'lucide-react';
import type { Movie, MovieDetail, Trailer } from '../types/movie';
import {
  fetchMovieDetails,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from '../services/tmdb';
import { playUiSound } from '../utils/audio';

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

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playUiSound('close');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isCancelled = true;
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
    if (!val || val <= 0) return '未公開';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatRuntime = (mins: number | null) => {
    if (!mins) return '未提供';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}小時 ${m}分` : `${m}分鐘`;
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={() => {
          playUiSound('close');
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0e1017] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
        >
          {/* Close Button (Netflix/Apple Style) */}
          <button
            onClick={() => {
              playUiSound('close');
              onClose();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-neutral-800 border border-white/20 text-white transition-all cursor-pointer z-30 backdrop-blur-md"
            aria-label="關閉"
          >
            <X size={18} />
          </button>

          {/* Cinematic Top Backdrop Banner */}
          <div className="relative h-60 sm:h-80 md:h-96 w-full overflow-hidden bg-neutral-950">
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
                    onClick={() => {
                      playUiSound('click');
                      setActiveTab('trailers');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-display font-bold text-xs sm:text-sm hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
                  >
                    <Play size={15} className="fill-black" />
                    <span>播放預告片 ({current.trailers.length})</span>
                  </button>
                )}

                {/* Official Website Button */}
                {current.homepage ? (
                  <a
                    href={current.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playUiSound('click')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-colors backdrop-blur-md"
                  >
                    <Globe size={15} />
                    <span>官方網站</span>
                    <ExternalLink size={12} className="text-neutral-300" />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(current.title + ' official site')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playUiSound('click')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Globe size={15} />
                    <span>官方搜尋</span>
                    <ExternalLink size={12} className="text-neutral-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Apple TV+ Minimalist Tabs) */}
          <div className="px-6 pt-3 border-b border-white/10 bg-[#0e1017] sticky top-0 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab('overview');
                }}
                className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                電影概述
                {activeTab === 'overview' && (
                  <motion.div
                    layoutId="streamingModalTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e50914]"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab('cast');
                }}
                className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'cast' ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users size={14} />
                演出陣容
                {current.cast?.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-neutral-300">
                    {current.cast.length}
                  </span>
                )}
                {activeTab === 'cast' && (
                  <motion.div
                    layoutId="streamingModalTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e50914]"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab('trailers');
                }}
                className={`relative px-4 py-3 text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'trailers' ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film size={14} />
                相關預告片
                {current.trailers?.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-neutral-300">
                    {current.trailers.length}
                  </span>
                )}
                {activeTab === 'trailers' && (
                  <motion.div
                    layoutId="streamingModalTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e50914]"
                  />
                )}
              </button>
            </div>

            {/* Quality & Score Strip */}
            <div className="hidden sm:flex items-center gap-3 py-2 text-xs text-neutral-300">
              {isLoading && (
                <span className="flex items-center gap-1 text-[11px] text-[#e50914]">
                  <Loader2 size={12} className="animate-spin" />
                  載入資料中
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
                    {current.homepage && (
                      <a
                        href={current.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Globe size={14} className="text-[#e50914]" />
                          訪問官方網站
                        </span>
                        <ExternalLink size={12} />
                      </a>
                    )}

                    <a
                      href={`https://www.themoviedb.org/movie/${current.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Clapperboard size={14} className="text-sky-400" />
                        TMDB 資料庫專頁
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
                          IMDb 影評頁
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
                      98% 喜愛度配對
                    </span>
                    <span className="text-neutral-500">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-neutral-400" />
                      <span>{current.release_date || '未定'}</span>
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
                      劇情簡介
                    </h4>
                    <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed">
                      {current.overview || '目前尚無詳細劇情說明。'}
                    </p>
                  </div>

                  {/* Genres */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      影片類型
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
                        導演與主要主創
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {current.directors?.map((dir) => (
                          <div key={dir.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 border border-white/10">
                              <img
                                src={getProfileUrl(dir.profile_path)}
                                alt={dir.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#e50914] font-bold block">
                                導演 (DIRECTOR)
                              </span>
                              <span className="text-xs font-bold text-white">
                                {dir.name} ({dir.original_name})
                              </span>
                            </div>
                          </div>
                        ))}

                        {current.composers?.slice(0, 1).map((comp) => (
                          <div key={comp.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 border border-white/10">
                              <img
                                src={getProfileUrl(comp.profile_path)}
                                alt={comp.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-sky-400 font-bold block">
                                原創配樂 (MUSIC)
                              </span>
                              <span className="text-xs font-bold text-white">
                                {comp.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial & Production Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                        製作預算
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-white">
                        <DollarSign size={13} className="text-emerald-400" />
                        {formatCurrency(current.budget)}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                        全球票房
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-white">
                        <DollarSign size={13} className="text-amber-400" />
                        {formatCurrency(current.revenue)}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                        發行狀態
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {current.status === 'Released' ? '全球院線正式上映' : current.status}
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
                    主要演員陣容
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    全體共 {current.cast?.length || 0} 位演出人員
                  </p>
                </div>

                {/* Cast Portrait Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {current.cast?.map((member) => (
                    <div
                      key={member.id}
                      className="group p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 transition-all flex flex-col"
                    >
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 border border-white/10 mb-2">
                        <img
                          src={getProfileUrl(member.profile_path)}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h5 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1">
                        {member.name}
                      </h5>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        飾 {member.character || '演員'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Additional Crew */}
                {current.crew?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="font-display font-bold text-base text-white mb-3">
                      幕後核心編劇與製作團隊
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
                    相關官方預告片與影音特輯
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    可直接於播放器內觀看 YouTube 高畫質影片
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
                            現正播放 // {activeTrailer.type}
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
                          <span>在 YouTube 觀看</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}

                    {/* Other Trailers List */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                        切換其他預告片
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {current.trailers.map((t) => {
                          const isSelected = activeTrailer?.id === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                playUiSound('click');
                                setActiveTrailer(t);
                              }}
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
                                    官方
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
                      暫無直接相關預告片。
                    </p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(current.title + ' trailer')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      <Play size={13} />
                      在 YouTube 搜尋預告
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
