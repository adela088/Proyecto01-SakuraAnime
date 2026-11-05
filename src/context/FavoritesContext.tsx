import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CatalogItem } from '../types/anime';

type CatalogItemIdentity = Pick<CatalogItem, 'id' | 'entity'>;

interface FavoritesContextType {
  favorites: CatalogItem[];
  addFavorite: (item: CatalogItem) => void;
  removeFavorite: (item: CatalogItemIdentity) => void;
  isFavorite: (item: CatalogItemIdentity) => boolean;
  clearFavorites: () => void;
}

const STORAGE_KEY = 'sakura_catalog_favorites';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<CatalogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error al leer favoritos de localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Error al guardar favoritos en localStorage:', err);
    }
  }, [favorites]);

  const addFavorite = useCallback((item: CatalogItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id && f.entity === item.entity)) {
        return prev;
      }
      return [item, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((item: CatalogItemIdentity) => {
    setFavorites(prev =>
      prev.filter(f => f.id !== item.id || f.entity !== item.entity)
    );
  }, []);

  const isFavorite = useCallback(
    (item: CatalogItemIdentity): boolean => {
      return favorites.some(f => f.id === item.id && f.entity === item.entity);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};
