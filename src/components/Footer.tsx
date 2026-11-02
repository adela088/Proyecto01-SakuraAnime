import React from 'react';
import { Link } from 'react-router-dom';
import { SakuraIcon } from './SakuraIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-rose-100 dark:border-rose-950/70 bg-white/60 dark:bg-[#120a17]/80 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-lg"
              aria-label="Ir a la página principal de SakuraAnime"
            >
              <SakuraIcon className="w-5 h-5" />
              <span>SakuraAnime</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left max-w-sm">
              Explorador SPA de anime y manga con Jikan, Kitsu como respaldo y Studio Ghibli.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página" className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link to="/" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Inicio
            </Link>
            <Link to="/explorar" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Explorar Catálogo
            </Link>
            <Link to="/favoritos" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Favoritos
            </Link>
            <Link to="/contacto" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Contacto
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-rose-100/60 dark:border-rose-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} SakuraAnime - Proyecto 01.</p>
        </div>
      </div>
    </footer>
  );
};
