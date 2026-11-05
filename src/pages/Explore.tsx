import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CatalogItem, FilterState } from '../types/anime';
import { AnimeCard } from '../components/AnimeCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog, ConfirmationDialogHandle } from '../components/ConfirmationDialog';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, ChevronRight, Film, SearchX } from 'lucide-react';
import { GHIBLI_BASE } from '../config/api';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import { GhibliFilm } from '../types/anime';
import { fetchKitsuCatalogue } from '../utils/kitsu';

export const Explore: React.FC = () => {
  const { removeFavorite } = useFavorites();
  const { showToast } = useToast();

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [ghibliFilms, setGhibliFilms] = useState<GhibliFilm[]>([]);
  const [ghibliLoading, setGhibliLoading] = useState(false);
  const [ghibliError, setGhibliError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    type: '',
    status: '',
    minScore: 0,
    entity: 'anime',
  });

  const confirmDialogRef = useRef<ConfirmationDialogHandle>(null);
  const [itemToRemove, setItemToRemove] = useState<CatalogItem | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const ghibliLoadedRef = useRef(false);

  const fetchCatalogue = useCallback(
    async (currentPage: number, currentFilters: FilterState) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        setGhibliError(null);
        if (currentFilters.entity === 'anime' && !ghibliLoadedRef.current) {
          setGhibliLoading(true);
          void (async () => {
            try {
              const response = await fetchWithRetry(`${GHIBLI_BASE}/films`, {
                signal: controller.signal,
              });
              if (!response.ok) {
                throw new Error(`Error del servidor Ghibli: HTTP ${response.status}`);
              }
              const data: unknown = await response.json();
              if (!Array.isArray(data)) {
                throw new Error('La API de Studio Ghibli devolvió una respuesta inválida.');
              }
              if (!controller.signal.aborted) {
                setGhibliFilms(data as GhibliFilm[]);
                ghibliLoadedRef.current = true;
              }
            } catch (err: unknown) {
              if (controller.signal.aborted) return;
              setGhibliError(
                err instanceof Error
                  ? err.message
                  : 'No se pudieron cargar las películas de Studio Ghibli.'
              );
            } finally {
              if (!controller.signal.aborted) setGhibliLoading(false);
            }
          })();
        } else {
          setGhibliLoading(false);
        }
        const result = await fetchKitsuCatalogue(
          currentFilters.entity,
          currentPage,
          currentFilters.query,
          currentFilters.status,
          controller.signal
        );
        if (controller.signal.aborted) return;
        setItems(result.items);
        setHasNextPage(result.hasNextPage);
        setTotalItems(result.total);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const msg =
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el catálogo de anime y manga.';
        setError(msg);
        setItems([]);
        setHasNextPage(false);
        setTotalItems(undefined);
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
          abortRef.current = null;
        }
      }
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCatalogue(page, filters);
    }, 700);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [page, filters, fetchCatalogue]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setPage(1);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCatalogue(1, filters);
  };

  const handleResetFilters = () => {
    const defaults: FilterState = {
      query: '',
      type: '',
      status: '',
      minScore: 0,
      entity: 'anime',
    };
    setPage(1);
    setFilters(defaults);
  };

  const handleRequestRemove = (item: CatalogItem) => {
    setItemToRemove(item);
    confirmDialogRef.current?.open();
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFavorite(itemToRemove);
      showToast(`"${itemToRemove.title}" quitado de favoritos`, 'info');
      setItemToRemove(null);
    }
  };

  const filteredGhibliFilms = ghibliFilms.filter(film =>
    film.title.toLocaleLowerCase().includes(filters.query.trim().toLocaleLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Explorar {filters.entity === 'anime' ? 'Anime' : 'Manga'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Busca títulos, filtra por estado y descubre anime y manga con Kitsu.
        </p>
      </div>

      <SearchBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSubmitSearch={handleSearchSubmit}
        onReset={handleResetFilters}
        totalResults={totalItems}
      />

      {loading && (
        <LoadingSkeleton
          count={8}
          message={`Buscando ${filters.entity === 'anime' ? 'animes' : 'mangas'}...`}
        />
      )}

      {error && !loading && (
        <ErrorMessage
          title="Error al cargar el catálogo"
          message={error}
          onRetry={() => fetchCatalogue(page, filters)}
        />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="Sin resultados"
          description={`No encontramos ${filters.entity === 'anime' ? 'animes' : 'mangas'}${filters.query ? ` que coincidan con "${filters.query}"` : ''}.`}
          actionLabel="Restablecer filtros"
          onAction={handleResetFilters}
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <AnimeCard
                key={`${item.entity}:${item.id}`}
                item={item}
                entityType={filters.entity}
                onRequestRemove={handleRequestRemove}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-rose-100 dark:border-rose-950/60">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              aria-label="Página anterior"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#181120] border border-rose-200 dark:border-rose-900/60 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Página <strong className="text-slate-900 dark:text-white">{page}</strong>
            </span>

            <button
              type="button"
              disabled={!hasNextPage}
              onClick={() => setPage(p => p + 1)}
              aria-label="Página siguiente"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#181120] border border-rose-200 dark:border-rose-900/60 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {filters.entity === 'anime' && (
        <section className="space-y-5" aria-labelledby="ghibli-catalog-heading">
          <div className="border-b border-rose-100 pb-3 dark:border-rose-950/60">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
              <Film className="h-4 w-4" />
              <span>Catálogo Studio Ghibli</span>
            </div>
            <h2
              id="ghibli-catalog-heading"
              className="text-2xl font-extrabold text-slate-900 dark:text-white font-display"
            >
              Películas de Studio Ghibli
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Películas disponibles desde la API oficial de datos de Studio Ghibli.
            </p>
          </div>

          {ghibliLoading && (
            <LoadingSkeleton count={4} message="Cargando películas de Studio Ghibli..." />
          )}

          {ghibliError && !ghibliLoading && (
            <ErrorMessage
              title="No se pudo cargar Studio Ghibli"
              message={ghibliError}
              onRetry={() => fetchCatalogue(page, filters)}
            />
          )}

          {!ghibliLoading && !ghibliError && filteredGhibliFilms.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredGhibliFilms.map(film => (
                  <article
                    key={film.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-rose-950/60 dark:bg-[#1a1222]"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-rose-50 dark:bg-rose-950/30">
                      <img
                        src={film.image}
                        alt={`Póster de ${film.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">{film.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {film.director} · {film.release_date}
                      </p>
                      <p className="line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {film.description}
                      </p>
                      <p className="mt-auto border-t border-rose-100 pt-2 text-xs font-semibold text-rose-600 dark:border-rose-950/40 dark:text-rose-400">
                        Rotten Tomatoes: {film.rt_score}%
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          )}
          {!ghibliLoading && !ghibliError && ghibliFilms.length > 0 && filteredGhibliFilms.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hay películas de Studio Ghibli que coincidan con «{filters.query}».
            </p>
          )}
        </section>
      )}

      <ConfirmationDialog
        ref={confirmDialogRef}
        title="¿Quitar de favoritos?"
        message={`¿Estás seguro de que deseas eliminar "${itemToRemove?.title ?? ''}" de tus favoritos?`}
        confirmLabel="Quitar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmRemove}
        variant="danger"
      />
    </main>
  );
};
