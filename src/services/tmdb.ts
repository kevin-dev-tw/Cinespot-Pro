import type {
  Movie,
  MovieDetail,
  MovieCategory,
  CastMember,
  CrewMember,
  Trailer,
  GenreItem,
} from '../types/movie';
import { FALLBACK_MOVIES, FALLBACK_MOVIE_DETAILS } from '../data/fallbackMovies';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const GENRES_LIST: GenreItem[] = [
  { id: 28, name: 'Action', nameEn: 'Action' },
  { id: 12, name: 'Adventure', nameEn: 'Adventure' },
  { id: 16, name: 'Animation', nameEn: 'Animation' },
  { id: 35, name: 'Comedy', nameEn: 'Comedy' },
  { id: 80, name: 'Crime', nameEn: 'Crime' },
  { id: 99, name: 'Documentary', nameEn: 'Documentary' },
  { id: 18, name: 'Drama', nameEn: 'Drama' },
  { id: 10751, name: 'Family', nameEn: 'Family' },
  { id: 14, name: 'Fantasy', nameEn: 'Fantasy' },
  { id: 36, name: 'History', nameEn: 'History' },
  { id: 27, name: 'Horror', nameEn: 'Horror' },
  { id: 10402, name: 'Music', nameEn: 'Music' },
  { id: 9648, name: 'Mystery', nameEn: 'Mystery' },
  { id: 10749, name: 'Romance', nameEn: 'Romance' },
  { id: 878, name: 'Sci-Fi', nameEn: 'Sci-Fi' },
  { id: 53, name: 'Thriller', nameEn: 'Thriller' },
  { id: 10752, name: 'War', nameEn: 'War' },
  { id: 37, name: 'Western', nameEn: 'Western' },
];

export const getPosterUrl = (
  path: string | null | undefined,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (
  path: string | null | undefined,
  size: 'w780' | 'w1280' | 'original' = 'w1280'
): string => {
  if (!path) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (
  path: string | null | undefined,
  size: 'w185' | 'h632' | 'original' = 'w185'
): string => {
  if (!path) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getGenreNames = (genreIds?: number[]): string[] => {
  if (!genreIds || genreIds.length === 0) return ['Cinema'];
  return genreIds
    .map((id) => GENRES_LIST.find((g) => g.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 3);
};

export async function fetchMoviesByCategory(
  category: MovieCategory,
  page: number = 1
): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  try {
    if (!API_KEY) {
      throw new Error('VITE_TMDB_API_KEY is not configured');
    }

    const endpointMap: Record<MovieCategory, string> = {
      now_playing: '/movie/now_playing',
      popular: '/movie/popular',
      top_rated: '/movie/top_rated',
    };

    const res = await fetch(
      `${BASE_URL}${endpointMap[category]}?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!res.ok) {
      throw new Error(`TMDB HTTP error ${res.status}`);
    }

    const data = await res.json();
    const results: Movie[] = data.results || [];
    return {
      results,
      total_pages: data.total_pages || 1,
      total_results: data.total_results || results.length,
    };
  } catch (err) {
    console.warn('Failed to fetch from TMDB, using fallback dataset:', err);
    const fallbackList = FALLBACK_MOVIES[category] || FALLBACK_MOVIES.now_playing;
    return {
      results: fallbackList,
      total_pages: 1,
      total_results: fallbackList.length,
    };
  }
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  if (!query.trim()) {
    return { results: [], total_pages: 0, total_results: 0 };
  }
  try {
    if (!API_KEY) {
      throw new Error('VITE_TMDB_API_KEY is not configured');
    }

    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encoded}&page=${page}&include_adult=false`
    );
    if (!res.ok) throw new Error(`Search error ${res.status}`);
    const data = await res.json();
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };
  } catch (err) {
    console.warn('Failed to search from TMDB, searching fallbacks:', err);
    const q = query.toLowerCase();
    const all = [
      ...FALLBACK_MOVIES.now_playing,
      ...FALLBACK_MOVIES.popular,
      ...FALLBACK_MOVIES.top_rated,
    ];
    const filtered = all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.original_title.toLowerCase().includes(q)
    );
    return {
      results: filtered,
      total_pages: 1,
      total_results: filtered.length,
    };
  }
}

export async function fetchMovieSummary(movieId: number): Promise<Movie | null> {
  try {
    if (!API_KEY) {
      throw new Error('VITE_TMDB_API_KEY is not configured');
    }

    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch movie summary ${movieId}: ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      title: data.title || data.original_title,
      original_title: data.original_title,
      overview: data.overview || '',
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date || '',
      vote_average: data.vote_average || 0,
      vote_count: data.vote_count || 0,
      popularity: data.popularity || 0,
      genres: data.genres || [],
      runtime: data.runtime || null,
      tagline: data.tagline || '',
    };
  } catch (err) {
    console.warn(`Failed to fetch movie summary for ID ${movieId}:`, err);
    const fallback = Object.values(FALLBACK_MOVIES)
      .flat()
      .find((movie) => movie.id === movieId);
    return fallback || null;
  }
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetail> {
  try {
    if (!API_KEY) {
      throw new Error('VITE_TMDB_API_KEY is not configured');
    }

    // Fetch English details with credits and videos
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch movie ${movieId}: ${res.status}`);
    }

    const data = await res.json();

    const rawVideos = data.videos?.results || [];
    const cast: CastMember[] = (data.credits?.cast || []).slice(0, 24);
    const crew: CrewMember[] = data.credits?.crew || [];

    const directors = crew.filter((c) => c.job === 'Director');
    const writers = crew.filter(
      (c) =>
        c.job === 'Screenplay' ||
        c.job === 'Writer' ||
        c.job === 'Story' ||
        c.department === 'Writing'
    );
    const composers = crew.filter(
      (c) =>
        c.job === 'Original Music Composer' ||
        c.job === 'Music' ||
        c.job === 'Composer'
    );

    // Format trailers
    const trailers: Trailer[] = rawVideos
      .filter((v: { site: string }) => v.site === 'YouTube')
      .map((v: { id: string; key: string; name: string; site: string; type: string; official?: boolean; published_at?: string }) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: Boolean(v.official),
        published_at: v.published_at,
      }))
      .sort((a: Trailer, b: Trailer) => {
        if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
        if (b.type === 'Trailer' && a.type !== 'Trailer') return 1;
        if (a.official && !b.official) return -1;
        return 0;
      });

    const movieDetail: MovieDetail = {
      id: data.id,
      title: data.title || data.original_title,
      original_title: data.original_title,
      overview: data.overview || 'No overview available for this title.',
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date || '',
      vote_average: data.vote_average || 0,
      vote_count: data.vote_count || 0,
      popularity: data.popularity || 0,
      genres: data.genres || [],
      runtime: data.runtime || null,
      status: data.status || 'Released',
      tagline: data.tagline || '',
      homepage: data.homepage?.trim() ? data.homepage.trim() : null,
      imdb_id: data.imdb_id || null,
      budget: data.budget || 0,
      revenue: data.revenue || 0,
      production_companies: data.production_companies || [],
      cast,
      crew,
      directors,
      writers,
      composers,
      trailers,
    };

    return movieDetail;
  } catch (err) {
    console.warn(`Failed to fetch movie detail for ID ${movieId}, checking fallbacks:`, err);
    if (FALLBACK_MOVIE_DETAILS[movieId]) {
      return FALLBACK_MOVIE_DETAILS[movieId];
    }
    return {
      id: movieId,
      title: 'Movie Details',
      original_title: 'Movie Details',
      overview: 'Unable to fetch details for this movie. Please check your network connection.',
      poster_path: null,
      backdrop_path: null,
      release_date: '2026',
      vote_average: 8.0,
      vote_count: 100,
      popularity: 50,
      genres: [{ id: 878, name: 'Sci-Fi' }],
      runtime: 120,
      status: 'Released',
      tagline: '',
      homepage: 'https://www.themoviedb.org/movie/' + movieId,
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
  }
}
