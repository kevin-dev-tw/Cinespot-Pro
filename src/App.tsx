import { useState, useEffect, useMemo } from 'react';
import { FloatingPillNav } from './components/FloatingPillNav';
import { MovieHeroSection } from './components/MovieHeroSection';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailModal } from './components/MovieDetailModal';
import { fetchMovieSummary, fetchMoviesByCategory, searchMovies } from './services/tmdb';
import type { Movie, MovieCategory } from './types/movie';

const FEATURED_MOVIE_ID = 1228834;
const FEATURED_MOVIE_FALLBACK: Movie = {
  id: FEATURED_MOVIE_ID,
  title: 'The Fix',
  original_title: 'The Fix',
  overview:
    'Disillusioned by the end of the war in Afghanistan, a group of disgraced, war-torn ex-CIA operatives set out to Tehran to take down a life-changing score.',
  poster_path: null,
  backdrop_path: null,
  release_date: '2026-09-11',
  vote_average: 0,
  vote_count: 0,
  popularity: 0,
  genre_ids: [28, 53],
  tagline: 'Settle the score.',
};

export function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentCategory, setCurrentCategory] = useState<MovieCategory>('now_playing');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Search & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Movie for Modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [initialPlayTrailer, setInitialPlayTrailer] = useState<boolean>(false);

  // Featured Hero Movie
  const [featuredMovie, setFeaturedMovie] = useState<Movie>(FEATURED_MOVIE_FALLBACK);

  useEffect(() => {
    let isCancelled = false;

    fetchMovieSummary(FEATURED_MOVIE_ID).then((movie) => {
      if (!isCancelled && movie) {
        setFeaturedMovie(movie);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Lightweight IntersectionObserver for active section (Zero Layout Thrashing)
  useEffect(() => {
    const heroEl = document.getElementById('hero');
    const gridEl = document.getElementById('movie-grid');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'hero') {
              setActiveSection('hero');
            } else if (entry.target.id === 'movie-grid') {
              setActiveSection(currentCategory);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroEl) observer.observe(heroEl);
    if (gridEl) observer.observe(gridEl);

    return () => observer.disconnect();
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

  const sortedMovies = useMemo(
    () =>
      [...movies].sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
      }),
    [movies]
  );

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectMovie = (movie: Movie, playTrailer = false) => {
    setInitialPlayTrailer(playTrailer);
    setSelectedMovie(movie);
  };

  const categoryTitles: Record<MovieCategory, { title: string; subtitle: string }> = {
    now_playing: {
      title: 'Now Playing in Theaters',
      subtitle: 'Catch the latest blockbuster releases currently screening in cinemas worldwide.',
    },
    popular: {
      title: 'Popular & Trending',
      subtitle: 'The most watched and talked-about cinematic releases right now.',
    },
    top_rated: {
      title: 'Top Rated Classics',
      subtitle: 'Critically acclaimed masterpieces and audience all-time favorites.',
    },
  };

  return (
    <div className="relative min-h-screen bg-[#06070a] text-[#f1f3f9] overflow-x-hidden selection:bg-[#e50914] selection:text-white">
      {/* Floating Pill Navigation Bar */}
      <FloatingPillNav
        activeSection={activeSection}
        currentCategory={currentCategory}
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Landing & Cinema Feed */}
      <main>
        {/* 01 // Spotlight Hero Section */}
        <MovieHeroSection
          featuredMovie={featuredMovie}
          onOpenDetails={(movie) => handleSelectMovie(movie, false)}
          onPlayTrailer={(movie) => handleSelectMovie(movie, true)}
        />

        {/* 02 // Movie Grid Section */}
        <MovieGrid
          movies={sortedMovies}
          isLoading={isLoading}
          onSelectMovie={(m) => handleSelectMovie(m, false)}
          onQuickTrailer={(m) => handleSelectMovie(m, true)}
          category={currentCategory}
          categoryTitle={
            searchQuery.trim()
              ? `Search Results for "${searchQuery}"`
              : categoryTitles[currentCategory].title
          }
          categorySubtitle={
            searchQuery.trim()
              ? `Found ${movies.length} movies matching your query`
              : categoryTitles[currentCategory].subtitle
          }
          totalCount={movies.length}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />

        {/* Simplified Footer - Copyright Only */}
        <footer className="w-full py-8 px-4 text-center border-t border-white/10 bg-[#040507]">
          <p className="text-xs text-neutral-500 font-normal">
            © 2026 CINESPOT PRO. ALL RIGHTS RESERVED.
          </p>
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
