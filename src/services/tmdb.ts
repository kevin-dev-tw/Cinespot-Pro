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

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '62f405bde2f69d2ae44a4f5e09f38b23';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const GENRES_LIST: GenreItem[] = [
  { id: 28, name: '動作', nameEn: 'Action' },
  { id: 12, name: '冒險', nameEn: 'Adventure' },
  { id: 16, name: '動畫', nameEn: 'Animation' },
  { id: 35, name: '喜劇', nameEn: 'Comedy' },
  { id: 80, name: '犯罪', nameEn: 'Crime' },
  { id: 99, name: '紀錄片', nameEn: 'Documentary' },
  { id: 18, name: '劇情', nameEn: 'Drama' },
  { id: 10751, name: '家庭', nameEn: 'Family' },
  { id: 14, name: '奇幻', nameEn: 'Fantasy' },
  { id: 36, name: '歷史', nameEn: 'History' },
  { id: 27, name: '恐怖', nameEn: 'Horror' },
  { id: 10402, name: '音樂', nameEn: 'Music' },
  { id: 9648, name: '懸疑', nameEn: 'Mystery' },
  { id: 10749, name: '愛情', nameEn: 'Romance' },
  { id: 878, name: '科幻', nameEn: 'Sci-Fi' },
  { id: 53, name: '驚悚', nameEn: 'Thriller' },
  { id: 10752, name: '戰爭', nameEn: 'War' },
  { id: 37, name: '西部', nameEn: 'Western' },
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
  if (!genreIds || genreIds.length === 0) return ['電影'];
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
    const endpointMap: Record<MovieCategory, string> = {
      now_playing: '/movie/now_playing',
      popular: '/movie/popular',
      top_rated: '/movie/top_rated',
    };

    const res = await fetch(
      `${BASE_URL}${endpointMap[category]}?api_key=${API_KEY}&language=zh-TW&page=${page}`
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
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=zh-TW&query=${encoded}&page=${page}&include_adult=false`
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

export async function fetchMovieDetails(movieId: number): Promise<MovieDetail> {
  try {
    // 1. Fetch Chinese details with credits and videos
    const resZh = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=zh-TW&append_to_response=credits,videos`
    );

    if (!resZh.ok) {
      throw new Error(`Failed to fetch movie ${movieId}: ${resZh.status}`);
    }

    const dataZh = await resZh.json();

    let rawVideos = dataZh.videos?.results || [];

    // If no videos in Chinese, fetch English videos
    if (rawVideos.length === 0) {
      try {
        const resEnVideos = await fetch(
          `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );
        if (resEnVideos.ok) {
          const dataEnVideos = await resEnVideos.json();
          rawVideos = dataEnVideos.results || [];
        }
      } catch {
        // ignore video fallback error
      }
    }

    const cast: CastMember[] = (dataZh.credits?.cast || []).slice(0, 24);
    const crew: CrewMember[] = dataZh.credits?.crew || [];

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
      id: dataZh.id,
      title: dataZh.title || dataZh.original_title,
      original_title: dataZh.original_title,
      overview: dataZh.overview || '暫無中文劇情簡介。',
      poster_path: dataZh.poster_path,
      backdrop_path: dataZh.backdrop_path,
      release_date: dataZh.release_date || '',
      vote_average: dataZh.vote_average || 0,
      vote_count: dataZh.vote_count || 0,
      popularity: dataZh.popularity || 0,
      genres: dataZh.genres || [],
      runtime: dataZh.runtime || null,
      status: dataZh.status || 'Released',
      tagline: dataZh.tagline || '',
      homepage: dataZh.homepage?.trim() ? dataZh.homepage.trim() : null,
      imdb_id: dataZh.imdb_id || null,
      budget: dataZh.budget || 0,
      revenue: dataZh.revenue || 0,
      production_companies: dataZh.production_companies || [],
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
    // Return basic fallback structure
    return {
      id: movieId,
      title: '電影詳情',
      original_title: 'Movie Details',
      overview: '無法取得該電影詳細資料，請檢查網路連線。',
      poster_path: null,
      backdrop_path: null,
      release_date: '2026',
      vote_average: 8.0,
      vote_count: 100,
      popularity: 50,
      genres: [{ id: 878, name: '科幻' }],
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
