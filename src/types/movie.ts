export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  order: number;
  popularity?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number | null;
  tagline?: string;
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  status: string;
  tagline: string;
  homepage: string | null;
  imdb_id: string | null;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  cast: CastMember[];
  crew: CrewMember[];
  directors: CrewMember[];
  writers: CrewMember[];
  composers: CrewMember[];
  trailers: Trailer[];
}

export type MovieCategory = 'now_playing' | 'popular' | 'top_rated';

export interface GenreItem {
  id: number;
  name: string;
  nameEn: string;
}
