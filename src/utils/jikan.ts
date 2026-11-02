import { CatalogGenre, CatalogItem, EntityType } from '../types/anime';
import { JIKAN_BASE } from '../config/api';
import { fetchWithRetry } from './fetchWithRetry';

interface JikanEntry {
  mal_id: number;
  url?: string;
  images?: {
    jpg?: { image_url?: string; large_image_url?: string };
    webp?: { image_url?: string; large_image_url?: string };
  };
  title?: string;
  title_english?: string | null;
  title_japanese?: string | null;
  type?: string | null;
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  status?: string | null;
  duration?: string | null;
  score?: number | null;
  rank?: number | null;
  popularity?: number | null;
  synopsis?: string | null;
  year?: number | null;
  published?: { from?: string | null };
  genres?: Array<{ mal_id: number; name: string }>;
  studios?: Array<{ mal_id: number; name: string }>;
}

interface JikanResponse<T> {
  data: T;
  pagination?: {
    has_next_page?: boolean;
    items?: { total?: number };
  };
}

export interface JikanCatalogueResult {
  items: CatalogItem[];
  total: number | undefined;
  hasNextPage: boolean;
}

function mapStatus(status: string | null | undefined, entity: EntityType): string {
  if (entity === 'anime') {
    if (status === 'Currently Airing') return 'Currently Airing';
    if (status === 'Finished Airing') return 'Finished Airing';
    if (status === 'Not yet aired') return 'Upcoming';
  } else {
    if (status === 'Publishing') return 'Publishing';
    if (status === 'Finished') return 'Finished';
    if (status === 'On Hiatus') return 'On Hiatus';
    if (status === 'Discontinued') return 'Discontinued';
    if (status === 'Not yet published') return 'Upcoming';
  }
  return status ?? 'Unknown';
}

function mapJikanItem(entry: JikanEntry, entity: EntityType): CatalogItem {
  const image =
    entry.images?.webp?.large_image_url ??
    entry.images?.jpg?.large_image_url ??
    entry.images?.webp?.image_url ??
    entry.images?.jpg?.image_url ??
    '';
  const year = entry.year ?? (entry.published?.from ? Number(entry.published.from.slice(0, 4)) : undefined);

  return {
    id: String(entry.mal_id),
    entity,
    source: 'jikan',
    url: entry.url ?? `${JIKAN_BASE}/${entity}/${entry.mal_id}`,
    images: { jpg: { image_url: image, large_image_url: image } },
    title: entry.title ?? 'Título sin nombre',
    title_english: entry.title_english,
    title_japanese: entry.title_japanese,
    type: entry.type ?? (entity === 'manga' ? 'Manga' : 'Anime'),
    episodes: entry.episodes,
    chapters: entry.chapters,
    volumes: entry.volumes,
    status: mapStatus(entry.status, entity),
    duration: entry.duration ?? undefined,
    score: entry.score && entry.score > 0 ? entry.score : null,
    rank: entry.rank ?? undefined,
    popularity: entry.popularity ?? undefined,
    synopsis: entry.synopsis,
    year: Number.isFinite(year) ? year : undefined,
    studios: entry.studios?.map(studio => ({ id: String(studio.mal_id), name: studio.name })),
    genres: entry.genres?.map((genre): CatalogGenre => ({
      id: String(genre.mal_id),
      name: genre.name,
    })),
  };
}

function mapStatusFilter(status: string, entity: EntityType): string | undefined {
  if (status === 'complete') return 'complete';
  if (entity === 'anime' && status === 'airing') return 'airing';
  if (entity === 'anime' && status === 'upcoming') return 'upcoming';
  if (entity === 'manga' && status === 'publishing') return 'publishing';
  if (entity === 'manga' && status === 'hiatus') return 'hiatus';
  return undefined;
}

async function requestJikan<T>(url: string, signal?: AbortSignal): Promise<JikanResponse<T>> {
  const response = await fetchWithRetry(url, { signal }, 1, 1200, 10000);
  if (!response.ok) {
    throw new Error(`Jikan respondió con HTTP ${response.status}.`);
  }
  return (await response.json()) as JikanResponse<T>;
}

export async function fetchJikanCatalogue(
  entity: EntityType,
  page: number,
  query: string,
  status: string,
  signal?: AbortSignal
): Promise<JikanCatalogueResult> {
  const params = new URLSearchParams({ page: String(page), limit: '16' });
  if (query.trim()) params.set('q', query.trim());
  const apiStatus = mapStatusFilter(status, entity);
  if (apiStatus) params.set('status', apiStatus);

  const result = await requestJikan<JikanEntry[]>(
    `${JIKAN_BASE}/${entity}?${params}`,
    signal
  );
  if (!Array.isArray(result.data)) {
    throw new Error('Jikan devolvió una respuesta de catálogo inválida.');
  }

  return {
    items: result.data.map(item => mapJikanItem(item, entity)),
    total: result.pagination?.items?.total,
    hasNextPage: result.pagination?.has_next_page ?? false,
  };
}

export async function fetchJikanDetail(
  entity: EntityType,
  id: string,
  signal?: AbortSignal
): Promise<CatalogItem> {
  const result = await requestJikan<JikanEntry>(
    `${JIKAN_BASE}/${entity}/${encodeURIComponent(id)}/full`,
    signal
  );
  if (!result.data) {
    throw new Error('Jikan no encontró este título.');
  }
  return mapJikanItem(result.data, entity);
}
