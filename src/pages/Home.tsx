import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Film, ArrowRight, Flame, Quote } from 'lucide-react';
import { CatalogItem, GhibliFilm } from '../types/anime';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { GHIBLI_BASE } from '../config/api';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import { fetchKitsuCatalogue } from '../utils/kitsu';
import { SakuraIcon } from '../components/SakuraIcon';

export const Home: React.FC = () => {
  const [topAnime, setTopAnime] = useState<CatalogItem[]>([]);
  const [ghibliFilms, setGhibliFilms] = useState<GhibliFilm[]>([]);
  const [ghibliError, setGhibliError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const fetchData = async () => {
    if (!isMountedRef.current) return;
    setLoading(true);
    setError(null);

    const [animeResult, ghibliResult] = await Promise.allSettled([
      fetchKitsuCatalogue('anime', 1, '', ''),
      (async () => {
        const response = await fetchWithRetry(`${GHIBLI_BASE}/films`);
        if (!response.ok) throw new Error(`Studio Ghibli respondió HTTP ${response.status}`);
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('La API de Studio Ghibli devolvió datos inválidos.');
        return data as GhibliFilm[];
      })(),
    ]);

    if (isMountedRef.current) {
      if (animeResult.status === 'fulfilled') {
        setTopAnime(animeResult.value.items.slice(0, 6));
      } else {
        setError(
          animeResult.reason instanceof Error
            ? animeResult.reason.message
            : 'No se pudieron cargar los animes destacados.'
        );
      }

      if (ghibliResult.status === 'fulfilled') {
        setGhibliFilms(ghibliResult.value.slice(0, 3));
      } else {
        setGhibliError(
          ghibliResult.reason instanceof Error
            ? ghibliResult.reason.message
            : 'No se pudieron cargar las películas de Studio Ghibli.'
        );
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <main className="w-full space-y-16 pb-16">
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-rose-100 dark:border-rose-950/60 bg-gradient-to-b from-rose-50/60 via-pink-50/20 to-transparent dark:from-rose-950/20 dark:via-transparent dark:to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-400/15 to-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <SakuraIcon className="w-3.5 h-3.5" />
            <span>Explorador Otaku con Kitsu & Studio Ghibli</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.15]">
            Descubre el{' '}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent">
              Universo
            </span>{' '}
            Anime
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explora datos fascinantes de tus series y mangas favoritos. Busca títulos en tiempo real,
            filtra por formato o estado de emisión, y guarda tu lista de favoritos persistente.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/favoritos"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-rose-700 dark:text-rose-300 bg-white dark:bg-[#1a1222] hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 shadow-sm transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Mis Favoritos</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-rose-100 dark:border-rose-950/60">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Más populares globales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Anime más popular
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Anime popular según las valoraciones de la comunidad.
            </p>
          </div>

          <Link
            to="/explorar"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading && <LoadingSkeleton count={6} message="Cargando animes destacados..." />}

        {error && !loading && (
          <ErrorMessage
            title="Aviso de conexión"
            message={error}
            onRetry={() => fetchData()}
          />
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {topAnime.map(item => (
              <AnimeCard
                key={`${item.entity}:${item.id}`}
                item={item}
                entityType="anime"
              />
            ))}
          </div>
        )}
      </section>

      {(ghibliFilms.length > 0 || ghibliError) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-200/60 dark:border-rose-900/40">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Film className="w-4 h-4" />
              <span>Colección Especial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-1">
              Obras Maestras de Studio Ghibli
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-xl">
              Datos obtenidos en vivo desde la Studio Ghibli Films API
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ghibliFilms.map(film => (
                <div
                  key={film.id}
                  className="flex flex-col bg-white dark:bg-[#181022] rounded-2xl overflow-hidden border border-rose-100 dark:border-rose-950/60 shadow-sm hover:shadow-md transition-shadow p-4 space-y-3"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-rose-100/50">
                    <img
                      src={film.image}
                      alt={film.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {ghibliError && (
                    <ErrorMessage
                      title="No se pudieron cargar las películas"
                      message={ghibliError}
                      onRetry={fetchData}
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                      {film.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {film.director} • {film.release_date}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {film.description}
                  </p>
                  <div className="pt-2 border-t border-rose-100/60 dark:border-rose-950/40 flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      Rotten Tomatoes: {film.rt_score}%
                    </span>
                    <span className="text-slate-400 italic text-[11px]">
                      {film.original_title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#160e1e] border border-rose-100 dark:border-rose-950/60 shadow-sm space-y-3">
          <Quote className="w-8 h-8 text-rose-400 mx-auto opacity-70" />
          <p className="text-base sm:text-lg italic text-slate-700 dark:text-slate-200">
            «Si no te gusta tu destino, no lo aceptes. En cambio, ten el coraje para cambiarlo como quieras que sea.»
          </p>
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            — Naruto Uzumaki (Naruto Shippuden)
          </p>
        </div>
      </section>
    </main>
  );
};
