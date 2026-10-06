import { useState, useEffect, useRef, useMemo } from 'react';
import Lenis from 'lenis';
import { FloatingPillNav } from './components/FloatingPillNav';
import { MovieHeroSection } from './components/MovieHeroSection';
import { MovieCategoryNav } from './components/MovieCategoryNav';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailModal } from './components/MovieDetailModal';
import { MarqueeTicker } from './components/MarqueeTicker';
import { CustomCursor } from './components/CustomCursor';
import { fetchMoviesByCategory, searchMovies } from './services/tmdb';
import type { Movie, MovieCategory } from './types/movie';
import { playUiSound } from './utils/audio';
import { ArrowUp } from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [navPosition, setNavPosition] = useState<'top' | 'bottom'>('top');
  const [currentCategory, setCurrentCategory] = useState<MovieCategory>('now_playing');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'vote_average' | 'release_date'>('popularity');

  // Selected Movie for Modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [initialPlayTrailer, setInitialPlayTrailer] = useState<boolean>(false);

  // Featured Hero Movie
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Locomotive-inspired inertia smooth scroll via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Section Observer for active navigation pill highlight
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroEl = document.getElementById('hero');
      const gridEl = document.getElementById('movie-grid');

      if (gridEl && scrollY >= (gridEl.offsetTop - windowHeight * 0.4)) {
        setActiveSection(currentCategory);
      } else if (heroEl) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [currentCategory]);

  // Load Movies when category changes or search query is altered
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setPage(1);

    const timer = setTimeout(async () => {
      try {
        if (searchQuery.trim()) {
          const data = await searchMovies(searchQuery, 1);
          if (!isCancelled) {
            setMovies(data.results);
            setHasMore(data.total_pages > 1);
            setIsLoading(false);
          }
        } else {
          const data = await fetchMoviesByCategory(currentCategory, 1);
          if (!isCancelled) {
            setMovies(data.results);
            setHasMore(data.total_pages > 1);
            if (!featuredMovie && data.results.length > 0) {
              setFeaturedMovie(data.results[0]);
            }
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
        if (!isCancelled) setIsLoading(false);
      }
    }, searchQuery.trim() ? 350 : 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [currentCategory, searchQuery]);

  // Handle Load More pagination
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      if (searchQuery.trim()) {
        const data = await searchMovies(searchQuery, nextPage);
        setMovies((prev) => [...prev, ...data.results]);
        setHasMore(nextPage < data.total_pages);
        setPage(nextPage);
      } else {
        const data = await fetchMoviesByCategory(currentCategory, nextPage);
        setMovies((prev) => [...prev, ...data.results]);
        setHasMore(nextPage < data.total_pages);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filtered and Sorted Movies
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    if (selectedGenreId !== null) {
      result = result.filter(
        (m) => m.genre_ids && m.genre_ids.includes(selectedGenreId)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'vote_average') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === 'release_date') {
        const dateA = new Date(a.release_date || '1970-01-01').getTime();
        const dateB = new Date(b.release_date || '1970-01-01').getTime();
        return dateB - dateA;
      }
      return (b.popularity || 0) - (a.popularity || 0);
    });

    return result;
  }, [movies, selectedGenreId, sortBy]);

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -20 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectMovie = (movie: Movie, playTrailer = false) => {
    setInitialPlayTrailer(playTrailer);
    setSelectedMovie(movie);
  };

  const handleRandomMovie = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const chosen = movies[randomIndex];
      handleSelectMovie(chosen, false);
    }
  };

  const categoryTitles: Record<MovieCategory, { title: string; subtitle: string }> = {
    now_playing: {
      title: '現正熱映院線',
      subtitle: '即時同步全球各大院線熱映強檔，感受極致視聽盛宴。',
    },
    popular: {
      title: '最受歡迎推薦',
      subtitle: '全球影迷熱議焦點，年度高話題度霸榜大片精選。',
    },
    top_rated: {
      title: '高分口碑殿堂',
      subtitle: '歷經影史考驗與影評讚譽的必看神作名單。',
    },
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#edeef2] overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Custom Fluid Cursor */}
      <CustomCursor />

      {/* Floating Pill Navigation Bar (Fixed Top or Bottom) */}
      <FloatingPillNav
        activeSection={activeSection}
        currentCategory={currentCategory}
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
        }}
        onRandomMovie={handleRandomMovie}
        navPosition={navPosition}
        setNavPosition={setNavPosition}
      />

      {/* Main Landing & Cinema Feed */}
      <main>
        {/* 01 // Spotlight Hero Section */}
        <MovieHeroSection
          featuredMovie={featuredMovie}
          onOpenDetails={(movie) => handleSelectMovie(movie, false)}
          onPlayTrailer={(movie) => handleSelectMovie(movie, true)}
          onExploreCategory={() => handleNavigate('movie-filter-section')}
        />

        {/* Fluid Locomotive Marquee Ticker 1 */}
        <MarqueeTicker
          items={[
            'NOW IN THEATERS',
            'OFFICIAL 4K TRAILERS',
            'VERIFIED CAST & DIRECTORS',
            'TMDB LIVE DATABASE',
            'IMMERSIVE CINEMATIC ARCHIVE',
            'OFFICIAL STUDIO LINKS',
          ]}
        />

        {/* 02 // Category & Filter Switcher */}
        <MovieCategoryNav
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setSearchQuery('');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenreId={selectedGenreId}
          onSelectGenre={setSelectedGenreId}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 03 // Movie Grid Section */}
        <MovieGrid
          movies={filteredAndSortedMovies}
          isLoading={isLoading}
          onSelectMovie={(m) => handleSelectMovie(m, false)}
          onQuickTrailer={(m) => handleSelectMovie(m, true)}
          category={currentCategory}
          categoryTitle={
            searchQuery.trim()
              ? `搜尋結果：「${searchQuery}」`
              : categoryTitles[currentCategory].title
          }
          categorySubtitle={
            searchQuery.trim()
              ? `共找到 ${filteredAndSortedMovies.length} 部符合搜尋的電影`
              : categoryTitles[currentCategory].subtitle
          }
          totalCount={filteredAndSortedMovies.length}
          onLoadMore={handleLoadMore}
          hasMore={hasMore && !selectedGenreId}
          isLoadingMore={isLoadingMore}
        />

        {/* Fluid Locomotive Marquee Ticker 2 (Reverse) */}
        <MarqueeTicker
          reverse
          className="border-t border-b border-white/10 bg-[#06070a]"
          items={[
            'CURATED FILM ARCHIVES',
            'DOLBY ATMOS & VISION',
            'BOX OFFICE INSIGHTS',
            'DIRECTOR SPOTLIGHTS',
            'ORIGINAL SOUNDTRACK COMPOSERS',
            'SYNTHESIS CINEMA 2026',
          ]}
        />

        {/* Footer Section */}
        <footer className="relative w-full py-16 px-4 sm:px-6 lg:px-12 bg-[#050608] border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00]" />
                <span className="font-display font-black text-xl text-white tracking-wider">
                  SYNTHESIS <span className="text-[#ccff00]">CINEMA</span>
                </span>
              </div>
              <p className="font-mono-code text-xs text-neutral-400 max-w-md leading-relaxed">
                極致暗黑未來電影探索平台。整合全球院線熱映、熱門榜單、演出人員名單、YouTube 高畫質預告與官方網站連結。
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono-code text-neutral-500">
                <span>資料來源支援：</span>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f0ff] hover:underline"
                >
                  The Movie Database (TMDB) API
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => {
                  playUiSound('click');
                  handleNavigate('hero');
                }}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono-code text-neutral-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowUp size={13} className="text-[#ccff00]" />
                <span>返回頂部 (BACK TO TOP)</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-500">
                <span>© 2026 SYNTHESIS CINEMA. ALL RIGHTS RESERVED.</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Interactive Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        initialPlayTrailer={initialPlayTrailer}
      />
    </div>
  );
}

export default App;
