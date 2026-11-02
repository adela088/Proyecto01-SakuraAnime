import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center space-y-6 flex flex-col items-center justify-center animate-in fade-in">
      <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 font-display tracking-tight drop-shadow-sm">
        404
      </h1>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Página no encontrada
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          La página que buscas no existe o ha sido movida.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/30 transition-all hover:scale-105 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
        <Link
          to="/explorar"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explorar catálogo</span>
        </Link>
      </div>
    </main>
  );
};
