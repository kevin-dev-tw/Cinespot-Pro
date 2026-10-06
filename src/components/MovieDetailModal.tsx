import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Play,
  Globe,
  ExternalLink,
  Film,
  Calendar,
  Clock,
  Clapperboard,
  Users,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Loader2,
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

    // Disable body scroll when modal is active
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

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
        onClick={() => {
          playUiSound('close');
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0b0d13] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)] custom-scrollbar"
        >
          {/* Close Floating Button */}
          <button
            onClick={() => {
              playUiSound('close');
              onClose();
            }}
            className="absolute top-5 right-5 p-3 rounded-full bg-black/60 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer z-30 backdrop-blur-md"
            aria-label="關閉電影視窗"
          >
            <X size={18} />
          </button>

          {/* Top Cinematic Backdrop Banner */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-neutral-950">
            <img
              src={backdropSrc}
              alt={current.title}
              className="w-full h-full object-cover filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] via-[#0b0d13]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d13] via-transparent to-transparent opacity-80" />

            {/* Backdrop Info Strip */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
              <div className="max-w-2xl">
                {current.tagline && (
                  <p className="text-xs sm:text-sm font-mono-code text-[#ccff00] tracking-widest uppercase mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    {current.tagline}
                  </p>
                )}
                <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-[0.95]">
                  {current.title}
                </h2>
                <p className="font-mono-code text-xs sm:text-sm text-neutral-400 mt-1">
                  {current.original_title} • {current.release_date?.slice(0, 4)}
                </p>
              </div>

              {/* Quick Action cluster in Banner */}
              <div className="flex flex-wrap items-center gap-2.5">
                {current.trailers && current.trailers.length > 0 && (
                  <button
                    onClick={() => {
                      playUiSound('click');
                      setActiveTab('trailers');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#ccff00] text-black font-display font-black text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.35)]"
                  >
                    <Play size={14} className="fill-black" />
                    <span>預告片 ({current.trailers.length})</span>
                  </button>
                )}

                {/* Official Website Button */}
                {current.homepage ? (
                  <a
                    href={current.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playUiSound('click')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono-code text-xs uppercase tracking-wider transition-colors"
                  >
                    <Globe size={14} className="text-[#00f0ff]" />
                    <span>電影官方網站</span>
                    <ExternalLink size={12} className="text-neutral-400" />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(current.title + ' official website')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playUiSound('click')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 font-mono-code text-xs uppercase tracking-wider transition-colors"
                  >
                    <Globe size={14} className="text-[#00f0ff]" />
                    <span>官方資訊搜尋</span>
                    <ExternalLink size={12} className="text-neutral-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-6 pt-4 border-b border-white/10 bg-[#0b0d13] sticky top-0 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab('overview');
                }}
                className={`relative px-4 py-3 text-xs md:text-sm font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                電影總覽
                {activeTab === 'overview' && (
                  <motion.div
                    layoutId="modalTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccff00]"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab('cast');
                }}
                className={`relative px-4 py-3 text-xs md:text-sm font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'cast' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users size={14} />
                演出與幕後人員
                {current.cast?.length > 0 && (
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-white/10">
                    {current.cast.length}
                  </span>
                )}
                {activeTab === 'cast' && (
                  <motion.div
                    layoutId="modalTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccff00]"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab('trailers');
                }}
                className={`relative px-4 py-3 text-xs md:text-sm font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'trailers' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film size={14} />
                相關預告片
                {current.trailers?.length > 0 && (
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-white/10">
                    {current.trailers.length}
                  </span>
                )}
                {activeTab === 'trailers' && (
                  <motion.div
                    layoutId="modalTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccff00]"
                  />
                )}
              </button>
            </div>

            {/* Key Score Indicator & Loading State */}
            <div className="hidden sm:flex items-center gap-3 py-2 font-mono-code text-xs text-neutral-400">
              {isLoading && (
                <span className="flex items-center gap-1 text-[11px] text-[#00f0ff] animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  TMDB 載入中
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <Star size={13} className="text-[#ccff00] fill-[#ccff00]" />
                <span className="text-white font-bold text-sm">
                  {current.vote_average ? current.vote_average.toFixed(1) : 'NR'}
                </span>
                <span>/ 10</span>
              </div>
            </div>
          </div>

          {/* Modal Tab Content Body */}
          <div className="p-6 sm:p-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Column: Poster & Quick Facts */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="w-52 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden border border-white/20 shadow-2xl mb-5 group">
                    <img
                      src={posterSrc}
                      alt={current.title}
                      className="w-full h-full object-cover filter contrast-105"
                    />
                  </div>

                  {/* Official Verification & Studio Badge */}
                  <div className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-4 flex items-center justify-between text-xs font-mono-code">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      TMDB 官方認證
                    </span>
                    <span className="text-[#00f0ff]">ID #{current.id}</span>
                  </div>

                  {/* Official Links Cluster */}
                  <div className="w-full flex flex-col gap-2">
                    {current.homepage && (
                      <a
                        href={current.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] font-mono-code text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Globe size={14} />
                          訪問官方網站
                        </span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    <a
                      href={`https://www.themoviedb.org/movie/${current.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-mono-code text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Clapperboard size={14} className="text-[#00f0ff]" />
                        TMDB 資料專頁
                      </span>
                      <ExternalLink size={13} />
                    </a>

                    {current.imdb_id && (
                      <a
                        href={`https://www.imdb.com/title/${current.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-mono-code text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2 text-amber-400 font-bold">
                          IMDb
                        </span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Key Details, Synopsis & Primary Crew */}
                <div className="md:col-span-8 flex flex-col gap-6">
                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono-code uppercase text-neutral-500 block mb-1">
                        上映日期
                      </span>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono-code text-white">
                        <Calendar size={13} className="text-[#ccff00]" />
                        {current.release_date || '未定'}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono-code uppercase text-neutral-500 block mb-1">
                        片長時間
                      </span>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono-code text-white">
                        <Clock size={13} className="text-[#00f0ff]" />
                        {current.runtime ? `${current.runtime} 分鐘` : '未提供'}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono-code uppercase text-neutral-500 block mb-1">
                        製作預算
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-mono-code text-white">
                        <DollarSign size={13} className="text-emerald-400" />
                        {formatCurrency(current.budget)}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono-code uppercase text-neutral-500 block mb-1">
                        全球票房
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-mono-code text-white">
                        <DollarSign size={13} className="text-[#ccff00]" />
                        {formatCurrency(current.revenue)}
                      </div>
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 mb-2">
                      影片類型
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {current.genres?.map((g) => (
                        <span
                          key={g.id}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono-code text-neutral-200"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Synopsis */}
                  <div>
                    <h4 className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 mb-2">
                      劇情大綱 / Synopsis
                    </h4>
                    <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                      {current.overview || '目前尚無詳細中文劇情介紹。'}
                    </p>
                  </div>

                  {/* Key Creators (Directors & Composers) */}
                  {(current.directors?.length > 0 || current.composers?.length > 0) && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#00f0ff] mb-3">
                        主要核心主創團隊
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
                              <span className="text-[10px] font-mono-code text-[#ccff00] block">
                                導演 (DIRECTOR)
                              </span>
                              <span className="text-xs font-display font-bold text-white">
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
                              <span className="text-[10px] font-mono-code text-[#00f0ff] block">
                                原創配樂 (MUSIC)
                              </span>
                              <span className="text-xs font-display font-bold text-white">
                                {comp.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Production Companies */}
                  {current.production_companies?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 mb-2">
                        發行與製作公司
                      </h4>
                      <div className="flex flex-wrap items-center gap-3">
                        {current.production_companies.map((company) => (
                          <span
                            key={company.id}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono-code text-neutral-300"
                          >
                            {company.name} ({company.origin_country || 'Global'})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: CAST & CREW */}
            {activeTab === 'cast' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white uppercase">
                      演員陣容與幕後團隊
                    </h3>
                    <p className="text-xs font-mono-code text-neutral-400 mt-1">
                      共收錄 {current.cast?.length || 0} 位主要主演與幕後創作者
                    </p>
                  </div>
                </div>

                {/* Cast Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {current.cast?.map((member) => (
                    <div
                      key={member.id}
                      className="group p-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#ccff00] transition-colors flex flex-col"
                    >
                      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 mb-2.5">
                        <img
                          src={getProfileUrl(member.profile_path)}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h5 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#ccff00] transition-colors">
                        {member.name}
                      </h5>
                      <p className="font-mono-code text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        飾 {member.character || '演員'}
                      </p>
                      {member.original_name !== member.name && (
                        <p className="font-mono-code text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                          {member.original_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Crew Section */}
                {current.crew?.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <h4 className="font-display font-bold text-lg text-white mb-4 uppercase">
                      幕後核心編劇與製作名單
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {current.crew?.slice(0, 12).map((c, idx) => (
                        <div
                          key={`${c.id}-${idx}`}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono-code text-[10px] text-[#00f0ff] uppercase block">
                              {c.job || c.department}
                            </span>
                            <span className="font-display font-bold text-white">
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
                <div className="mb-6">
                  <h3 className="font-display font-bold text-2xl text-white uppercase">
                    官方相關預告片與特輯
                  </h3>
                  <p className="text-xs font-mono-code text-neutral-400 mt-1">
                    高畫質 YouTube 預告片播放器，可直接於網頁中即時欣賞
                  </p>
                </div>

                {current.trailers && current.trailers.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {/* Main Video Embed Player */}
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

                    {/* Active Trailer Metadata */}
                    {activeTrailer && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                        <div>
                          <span className="text-[10px] font-mono-code text-[#ccff00] uppercase tracking-wider block">
                            現正播放 // {activeTrailer.type}
                          </span>
                          <h4 className="font-display font-bold text-base text-white">
                            {activeTrailer.name}
                          </h4>
                        </div>

                        <a
                          href={`https://www.youtube.com/watch?v=${activeTrailer.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 font-mono-code text-xs transition-colors"
                        >
                          <Play size={12} className="fill-current" />
                          <span>在 YouTube 上觀看</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}

                    {/* Trailer Selector Carousel */}
                    <div>
                      <h4 className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 mb-3">
                        切換其他預告片與特輯
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {current.trailers.map((t) => {
                          const isSelected = activeTrailer?.id === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                playUiSound('click');
                                setActiveTrailer(t);
                              }}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-[#ccff00]/10 border-[#ccff00] text-white shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-neutral-300'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono-code mb-1">
                                <span className={isSelected ? 'text-[#ccff00]' : 'text-[#00f0ff]'}>
                                  {t.type}
                                </span>
                                {t.official && (
                                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-400">
                                    OFFICIAL
                                  </span>
                                )}
                              </div>
                              <h5 className="font-display font-bold text-xs line-clamp-2">
                                {t.name}
                              </h5>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
                    <p className="font-mono-code text-sm text-neutral-400 mb-3">
                      目前未找到相關 YouTube 預告片。
                    </p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(current.title + ' trailer')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono-code text-xs"
                    >
                      <Play size={13} />
                      搜尋 YouTube 預告
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
