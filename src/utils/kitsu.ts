import { CatalogGenre, CatalogItem, EntityType } from '../types/anime';
import { KITSU_BASE } from '../config/api';
import { fetchWithRetry } from './fetchWithRetry';

interface KitsuAttributes {
  canonicalTitle?: string;
  titles?: Record<string, string | undefined>;
  averageRating?: string | null;
  popularityRank?: number | null;
  ratingRank?: number | null;
  posterImage?: {
    large?: string | null;
    medium?: string | null;
    original?: string | null;
  } | null;
  subtype?: string | null;
  status?: string | null;
  episodeCount?: number | null;
  chapterCount?: number | null;
  volumeCount?: number | null;
  startDate?: string | null;
  synopsis?: string | null;
}

interface KitsuResource {
  id: string;
  type: string;
  links?: { self?: string };
  attributes: KitsuAttributes;
  relationships?: {
    genres?: { data?: Array<{ id: string }> };
  };
}

interface KitsuResponse {
  data: KitsuResource | KitsuResource[];
  included?: Array<{
    id: string;
    type: string;
    attributes?: { name?: string };
  }>;
  meta?: { count?: number };
}

export interface KitsuCatalogueResult {
  items: CatalogItem[];
  total: number | undefined;
  hasNextPage: boolean;
}

function mapStatus(status: string | null | undefined, entity: EntityType): string {
  if (status === 'current') return entity === 'anime' ? 'Currently Airing' : 'Publishing';
  if (status === 'finished') return entity === 'anime' ? 'Finished Airing' : 'Finished';
  if (status === 'upcoming' || status === 'unreleased') return 'Upcoming';
  return 'Unknown';
}

function cleanSynopsis(synopsis: string | null | undefined): string | null | undefined {
  return synopsis?.replace(/\n*\(Source:[^)]*\)\s*$/i, '').trim();
}

function mapGenres(resource: KitsuResource, included: KitsuResponse['included'] = []): CatalogGenre[] {
  const genreNames = new Map(
    (included ?? [])
      .filter(item => item.type === 'genres' && item.attributes?.name)
      .map(item => [item.id, item.attributes!.name!])
  );

  return (resource.relationships?.genres?.data ?? [])
    .map(genre => ({ id: genre.id, name: genreNames.get(genre.id) }))
    .filter((genre): genre is CatalogGenre => Boolean(genre.name));
}

function mapResource(
  resource: KitsuResource,
  entity: EntityType,
  included?: KitsuResponse['included']
): CatalogItem {
  const attributes = resource.attributes;
  const poster =
    attributes.posterImage?.large ??
    attributes.posterImage?.medium ??
    attributes.posterImage?.original ??
    '';
  const averageRating = Number(attributes.averageRating);
  const year = attributes.startDate ? Number(attributes.startDate.slice(0, 4)) : undefined;
  const title =
    attributes.titles?.en ??
    attributes.canonicalTitle ??
    attributes.titles?.en_jp ??
    attributes.titles?.ja_jp ??
    'Título sin nombre';

  return {
    id: resource.id,
    entity,
    source: 'kitsu',
    url: resource.links?.self ?? `${KITSU_BASE}/${entity}/${resource.id}`,
    images: { jpg: { image_url: poster, large_image_url: poster } },
    title,
    title_english: attributes.titles?.en ?? null,
    title_japanese: attributes.titles?.ja_jp ?? null,
    type: entity === 'manga' ? 'Manga' : attributes.subtype ?? 'Anime',
    episodes: attributes.episodeCount,
    chapters: attributes.chapterCount,
    volumes: attributes.volumeCount,
    status: mapStatus(attributes.status, entity),
    duration: undefined,
    score: Number.isFinite(averageRating) ? averageRating / 10 : null,
    rank: attributes.ratingRank ?? undefined,
    popularity: attributes.popularityRank ?? undefined,
    synopsis: cleanSynopsis(attributes.synopsis),
    year: Number.isFinite(year) ? year : undefined,
    genres: mapGenres(resource, included),
  };
}

function statusFilter(status: string): string | undefined {
  if (status === 'complete') return 'finished';
  if (status === 'airing' || status === 'publishing') return 'current';
  if (status === 'upcoming') return 'upcoming';
  return undefined;
}

async function requestKitsu(
  url: string,
  signal?: AbortSignal
): Promise<KitsuResponse> {
  const response = await fetchWithRetry(url, { signal });
  if (!response.ok) {
    throw new Error(`Error de Kitsu: HTTP ${response.status}`);
  }
  return (await response.json()) as KitsuResponse;
}

export async function fetchKitsuCatalogue(
  entity: EntityType,
  page: number,
  query: string,
  status: string,
  signal?: AbortSignal
): Promise<KitsuCatalogueResult> {
  const limit = 16;
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    'page[limit]': String(limit),
    'page[offset]': String(offset),
    sort: '-userCount',
    include: 'genres',
  });
  if (query.trim()) params.set('filter[text]', query.trim());
  const apiStatus = statusFilter(status);
  if (apiStatus) params.set('filter[status]', apiStatus);

  const result = await requestKitsu(`${KITSU_BASE}/${entity}?${params}`, signal);
  if (!Array.isArray(result.data)) {
    throw new Error('Kitsu devolvió una respuesta de catálogo inválida.');
  }

  const total = result.meta?.count;
  return {
    items: result.data.map(item => mapResource(item, entity, result.included)),
    total,
    hasNextPage: total === undefined ? result.data.length === limit : offset + limit < total,
  };
}

export async function fetchKitsuDetail(
  entity: EntityType,
  id: string,
  signal?: AbortSignal
): Promise<CatalogItem> {
  const result = await requestKitsu(
    `${KITSU_BASE}/${entity}/${encodeURIComponent(id)}?include=genres`,
    signal
  );
  if (Array.isArray(result.data) || !result.data) {
    throw new Error('Kitsu no encontró este título.');
  }
  return mapResource(result.data, entity, result.included);
}
