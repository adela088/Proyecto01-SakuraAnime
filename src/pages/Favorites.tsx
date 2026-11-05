import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { CatalogItem } from '../types/anime';
import { AnimeCard } from '../components/AnimeCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog, ConfirmationDialogHandle } from '../components/ConfirmationDialog';
import { DarkPatternModal, DarkPatternModalHandle } from '../components/DarkPatternModal';
import { Heart, Trash2, Star } from 'lucide-react';

export const Favorites: React.FC = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const confirmDialogRef = useRef<ConfirmationDialogHandle>(null);
  const darkPatternDialogRef = useRef<DarkPatternModalHandle>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const handleRequestRemove = (item: CatalogItem) => {
    setSelectedItem(item);
    confirmDialogRef.current?.open();
  };

  const handleConfirmSingleRemove = () => {
    if (selectedItem) {
      removeFavorite(selectedItem);
      showToast(`"${selectedItem.title}" fue eliminado de tus favoritos`, 'info');
      setSelectedItem(null);
    }
  };

  const handleOpenClearAll = () => {
    darkPatternDialogRef.current?.open();
  };

  const handleConfirmClearAll = () => {
    clearFavorites();
    showToast('Se han eliminado todos los favoritos', 'info');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-rose-100 dark:border-rose-950/60">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <span>Mis Favoritos</span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            {favorites.length} {favorites.length === 1 ? 'item guardado' : 'items guardados'}
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenClearAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar lista (Dark Pattern)</span>
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No tienes favoritos guardados"
          description="Explora animes y mangas en el catálogo y presiona el botón de corazón en las tarjetas para guardarlos aquí."
          actionLabel="Explorar y agregar algunos"
          onAction={() => navigate('/explorar')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(item => (
            <AnimeCard
              key={`${item.entity}:${item.id}`}
              item={item}
              entityType={item.entity}
              onRequestRemove={handleRequestRemove}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        ref={confirmDialogRef}
        title="¿Quitar de favoritos?"
        message={`¿Estás seguro de que quieres quitar a "${selectedItem?.title ?? ''}" de tus favoritos?`}
        confirmLabel="Quitar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmSingleRemove}
        variant="danger"
      />

      <DarkPatternModal
        ref={darkPatternDialogRef}
        onConfirmDanger={handleConfirmClearAll}
      />
    </main>
  );
};
