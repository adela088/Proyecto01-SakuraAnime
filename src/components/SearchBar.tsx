import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterState } from '../types/anime';
import { SakuraIcon } from './SakuraIcon';

interface SearchBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onSubmitSearch: (e: React.FormEvent) => void;
  onReset: () => void;
  totalResults?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFilterChange,
  onSubmitSearch,
  onReset,
  totalResults,
}) => {
  return (
    <section
      aria-label="Controles de búsqueda y filtrado"
      className="w-full bg-white/70 dark:bg-[#160f1f]/70 border border-rose-100 dark:border-rose-950/60 rounded-2xl p-4 sm:p-5 shadow-sm backdrop-blur-sm mb-6 transition-colors"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-rose-100/60 dark:border-rose-950/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <SakuraIcon className="w-3.5 h-3.5" /> Categoría:
          </span>
          <div className="inline-flex p-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/40">
            <button
              type="button"
              onClick={() => onFilterChange({ entity: 'anime', type: '', status: '' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filters.entity === 'anime'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
              }`}
            >
              Anime (Jikan) + Ghibli
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ entity: 'manga', type: '', status: '' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filters.entity === 'manga'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600'
              }`}
            >
              Manga (Jikan)
            </button>
          </div>
        </div>

        {totalResults !== undefined && (
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Resultados encontrados: <strong className="text-slate-800 dark:text-slate-200">{totalResults}</strong>
          </span>
        )}
      </div>

      <form onSubmit={onSubmitSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Buscar por título
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="search-input"
            value={filters.query}
            onChange={e => onFilterChange({ query: e.target.value })}
            placeholder={
              filters.entity === 'anime'
                ? 'Buscar anime o película Ghibli por título...'
                : 'Buscar manga por título (ej. Berserk, One Piece)...'
            }
            aria-label="Buscar en el catálogo"
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-[#120a17] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-rose-200 dark:border-rose-900/60 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onFilterChange({ query: '' })}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <label htmlFor="filter-status-select" className="sr-only">
            Filtrar por estado
          </label>
          <select
            id="filter-status-select"
            value={filters.status}
            onChange={e => onFilterChange({ status: e.target.value })}
            aria-label="Filtrar por estado"
            className="px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-[#120a17] text-slate-800 dark:text-slate-200 border border-rose-200 dark:border-rose-900/60 focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
          >
            <option value="">Todos los estados</option>
            {filters.entity === 'anime' ? (
              <>
                <option value="airing">En Emisión (Airing)</option>
                <option value="complete">Finalizado (Complete)</option>
                <option value="upcoming">Próximamente (Upcoming)</option>
              </>
            ) : (
              <>
                <option value="publishing">Publicándose</option>
                <option value="complete">Completo</option>
                <option value="hiatus">En pausa</option>
              </>
            )}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-sm shadow-rose-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            Buscar
          </button>

          {(filters.query || filters.status) && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 transition-colors cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
