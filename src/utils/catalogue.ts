import { CatalogSource, EntityType } from '../types/anime';
import { fetchJikanCatalogue, JikanCatalogueResult } from './jikan';
import { fetchKitsuCatalogue } from './kitsu';

export interface CatalogueResult extends JikanCatalogueResult {
  source: CatalogSource;
  fallbackReason?: string;
}

export async function fetchCatalogue(
  entity: EntityType,
  page: number,
  query: string,
  status: string,
  signal?: AbortSignal
): Promise<CatalogueResult> {
  try {
    const result = await fetchJikanCatalogue(entity, page, query, status, signal);
    return { ...result, source: 'jikan' };
  } catch (error: unknown) {
    if (signal?.aborted || (error instanceof Error && error.name === 'AbortError')) {
      throw error;
    }

    const fallback = await fetchKitsuCatalogue(entity, page, query, status, signal);
    return {
      ...fallback,
      source: 'kitsu',
      fallbackReason:
        error instanceof Error ? error.message : 'Jikan no está disponible en este momento.',
    };
  }
}
