export interface CatalogGenre {
  id: string;
  name: string;
}

export interface CatalogStudio {
  id: string;
  name: string;
}

export interface CatalogItem {
  id: string;
  entity: EntityType;
  source?: CatalogSource;
  url: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
  };
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  type: string;
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  status: string;
  duration?: string;
  score: number | null;
  rank?: number | null;
  popularity?: number | null;
  synopsis?: string | null;
  year?: number | null;
  studios?: CatalogStudio[];
  genres?: CatalogGenre[];
}

export type CatalogSource = 'jikan' | 'kitsu';

export interface GhibliFilm {
  id: string;
  title: string;
  original_title: string;
  director: string;
  release_date: string;
  rt_score: string;
  description: string;
  image: string;
}

export type EntityType = 'anime' | 'manga';

export interface FilterState {
  query: string;
  type: string;
  status: string;
  minScore: number;
  entity: EntityType;
}

export interface ContactFormData {
  nombre: string;
  email: string;
  mensaje: string;
}

export interface ContactFormErrors {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}
