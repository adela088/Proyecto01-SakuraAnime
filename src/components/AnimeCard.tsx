import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Tv, BookOpen, Film, Eye } from 'lucide-react';
import { CatalogItem, EntityType } from '../types/anime';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

interface AnimeCardProps {
  item: CatalogItem;
  entityType?: EntityType;
  onRequestRemove?: (item: CatalogItem) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  item,
  entityType = 'anime',
  onRequestRemove,
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);

  const isFav = isFavorite(item);
  const imageUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
      if (onRequestRemove) {
        onRequestRemove(item);
      } else {
        removeFavorite(item);
        showToast(`"${item.title}" quitado de tus favoritos`, 'info');
      }
    } else {
      addFavorite(item);
      showToast(`♥ "${item.title}" agregado a tus favoritos`, 'success');
    }
  };

  const getTypeIcon = () => {
    const t = (item.type || '').toLowerCase();
    if (t === 'movie') return <Film className="w-3.5 h-3.5 text-rose-500" />;
    if (t === 'manga' || t === 'manhwa' || t === 'novel')
      return <BookOpen className="w-3.5 h-3.5 text-pink-500" />;
    return <Tv className="w-3.5 h-3.5 text-rose-500" />;
  };

  const actualEntity = item.entity || entityType;
  const detailPath = `/${actualEntity}/${item.id}`;

  return (
    <article className="group relative flex flex-col bg-white dark:bg-[#1a1222] rounded-2xl overflow-hidden border border-rose-100/90 dark:border-rose-950/60 shadow-sm hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-300/80 dark:hover:border-rose-700/60 transition-all duration-300">
      <Link
        to={detailPath}
        className="relative block aspect-[3/4] overflow-hidden bg-rose-50 dark:bg-rose-950/30"
        aria-label={`Ver detalles de ${item.title}`}
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={`Poster oficial de ${item.title}`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-950 dark:to-[#1e1327] text-rose-600 dark:text-rose-400">
            <Tv className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-xs text-center font-medium line-clamp-2">{item.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={
            isFav
              ? `Quitar a ${item.title} de favoritos`
              : `Guardar a ${item.title} en favoritos`
          }
          className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-md z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav
                ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                : 'text-white hover:text-rose-300'
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md font-medium">
            {getTypeIcon()}
            <span>{item.type || 'Anime'}</span>
          </span>

          {item.score !== null && item.score !== undefined && item.score > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{item.score.toFixed(1)}</span>
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display line-clamp-2 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors leading-snug">
            {item.title}
          </h3>

          {item.title_english && item.title_english !== item.title && (
            <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 italic">
              {item.title_english}
            </p>
          )}

          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {item.genres.slice(0, 2).map(genre => (
                <span
                  key={genre.id}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-rose-100/60 dark:border-rose-950/40 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {item.episodes ? `${item.episodes} episodios` : item.chapters ? `${item.chapters} caps` : item.status}
          </span>

          <Link
            to={detailPath}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/50 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Eye className="w-3 h-3" />
            <span>Ver Detalle</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
