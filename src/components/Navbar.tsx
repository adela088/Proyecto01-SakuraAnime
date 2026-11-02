import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { Sun, Moon, Heart, Menu, X, Compass, Mail, Home } from 'lucide-react';
import { SakuraIcon } from './SakuraIcon'; 
export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-3.5 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
      isActive
        ? 'text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/50 font-semibold shadow-xs'
        : 'text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#140d1b]/85 border-b border-rose-100 dark:border-rose-950/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-xl tracking-tight whitespace-nowrap shrink-0 group cursor-pointer"
            aria-label="SakuraAnime - Inicio"
          >
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <SakuraIcon className="w-5 h-5" />
            </span>
            <span className="text-slate-900 dark:text-white font-extrabold font-display tracking-tight text-lg sm:text-xl">
              Sakura<span className="text-rose-500">Anime</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-sm" aria-label="Navegación principal">
            <NavLink to="/" end className={navLinkClasses}>
              <Home className="w-4 h-4 opacity-75" />
              <span>Inicio</span>
            </NavLink>
            <NavLink to="/explorar" className={navLinkClasses}>
              <Compass className="w-4 h-4 opacity-75" />
              <span>Explorar</span>
            </NavLink>
            <NavLink to="/favoritos" className={navLinkClasses}>
              <Heart className="w-4 h-4 opacity-75 text-rose-500" />
              <span>Favoritos</span>
              {favorites.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs font-bold rounded-full bg-rose-500 text-white tabular-nums">
                  {favorites.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/contacto" className={navLinkClasses}>
              <Mail className="w-4 h-4 opacity-75" />
              <span>Contacto</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-300 transition-all cursor-pointer shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-rose-500 transition-transform hover:-rotate-12" />
              )}
            </button>

            <Link
              to="/explorar"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-sm shadow-rose-500/25 transition-all hover:shadow-md hover:shadow-rose-500/35 cursor-pointer whitespace-nowrap"
            >
              Explorar Catálogo
            </Link>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-rose-500 rounded-xl bg-rose-50/50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 dark:border-rose-950/80 bg-white/95 dark:bg-[#140d1b]/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClasses}
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </NavLink>
          <NavLink
            to="/explorar"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClasses}
          >
            <Compass className="w-4 h-4" />
            <span>Explorar</span>
          </NavLink>
          <NavLink
            to="/favoritos"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClasses}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Favoritos</span>
            {favorites.length > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                {favorites.length}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/contacto"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClasses}
          >
            <Mail className="w-4 h-4" />
            <span>Contacto</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
