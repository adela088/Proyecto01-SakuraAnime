import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CatalogItem } from '../types/anime';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Star,
  Heart,
  Tv,
  Calendar,
  Clock,
  Award,
  Users,
  BookOpen,
  Film,
  Check
} from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ConfirmationDialog, ConfirmationDialogHandle } from '../components/ConfirmationDialog';
import { fetchKitsuDetail } from '../utils/kitsu';
import { SakuraIcon } from '../components/SakuraIcon';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isManga = location.pathname.startsWith('/manga');
  const entityType = isManga ? 'manga' : 'anime';

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { showToast } = useToast();

  const [item, setItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const confirmDialogRef = useRef<ConfirmationDialogHandle>(null);

  const isFav = item ? isFavorite(item) : false;

  useEffect(() => {
    if (!id) return;
    const itemId = id;

    let isMounted = true;
    const controller = new AbortController();

    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);

        const detail = await fetchKitsuDetail(entityType, itemId, controller.signal);
        if (isMounted) setItem(detail);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Error al obtener los detalles del elemento.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, entityType]);

  const handleFavoriteAction = () => {
    if (!item) return;

    if (isFav) {
      confirmDialogRef.current?.open();
    } else {
      addFavorite(item);
      showToast(`♥ "${item.title}" guardado en tus favoritos`, 'success');
    }
  };

  const handleConfirmRemove = () => {
    if (item) {
      removeFavorite(item);
      showToast(`"${item.title}" quitado de tus favoritos`, 'info');
    }
  };

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <LoadingSkeleton count={1} message="Cargando detalles completos..." />
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <ErrorMessage
          title="No se pudo cargar la información"
          message={error || 'No se encontró el título solicitado.'}
          onRetry={() => window.location.reload()}
        />
        <div className="text-center">
          <Link
            to="/explorar"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al catálogo</span>
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in">
      <div>
        <Link
          to="/explorar"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </Link>
      </div>

      <article className="bg-white dark:bg-[#181022] rounded-3xl overflow-hidden border border-rose-100 dark:border-rose-950/70 shadow-xl flex flex-col md:flex-row">
        <div className="md:w-5/12 relative bg-rose-50 dark:bg-rose-950/30 aspect-[3/4] md:aspect-auto">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={`Póster oficial de ${item.title}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-rose-400">
              <Tv className="w-16 h-16 opacity-40 mb-2" />
              <p className="text-sm font-semibold">{item.title}</p>
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white">
              {item.type || 'Anime'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/90 backdrop-blur-md text-white">
              {item.status}
            </span>
          </div>
        </div>

        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                <SakuraIcon className="w-3.5 h-3.5" /> ID Kitsu #{item.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
                {item.title}
              </h1>
              {item.title_japanese && (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">
                  {item.title_japanese}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 py-3 border-y border-rose-100 dark:border-rose-950/50 text-center">
              <div className="p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/40">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Puntaje</span>
                <span className="text-base font-extrabold text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {item.score ? item.score.toFixed(2) : 'N/A'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/40">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Ranking</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                  <Award className="w-4 h-4 text-rose-500" />
                  {item.rank ? `#${item.rank}` : 'N/A'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/40">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Popularidad</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                  <Users className="w-4 h-4 text-pink-500" />
                  {item.popularity ? `#${item.popularity}` : 'N/A'}
                </span>
              </div>
            </div>

            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.genres.map(g => (
                  <span
                    key={g.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100/70 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Sinopsis
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto pr-2">
                {item.synopsis || 'No hay sinopsis disponible para este título en este momento.'}
              </p>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
              {item.episodes && (
                <p>
                  <strong>Episodios:</strong> {item.episodes} ({item.duration || '24 min/ep'})
                </p>
              )}
              {item.chapters && <p><strong>Capítulos:</strong> {item.chapters}</p>}
              {item.year && <p><strong>Año:</strong> {item.year}</p>}
              {item.studios && item.studios.length > 0 && (
                <p><strong>Estudio:</strong> {item.studios.map(s => s.name).join(', ')}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleFavoriteAction}
              className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isFav
                  ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/25'
              }`}
            >
              {isFav ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>En tus Favoritos (Presiona para quitar)</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>+ Agregar a Favoritos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      <ConfirmationDialog
        ref={confirmDialogRef}
        title="¿Quitar de favoritos?"
        message={`¿Estás seguro de que deseas eliminar a "${item.title}" de tus favoritos?`}
        confirmLabel="Quitar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmRemove}
        variant="danger"
      />
    </main>
  );
};
