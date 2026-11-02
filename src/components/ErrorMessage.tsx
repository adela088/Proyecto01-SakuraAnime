import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Ocurrió un problema',
  message = 'No se pudo cargar la información. Verifica tu conexión o intenta de nuevo.',
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="w-full max-w-lg mx-auto my-12 p-8 rounded-2xl bg-white dark:bg-[#1a1122] border border-red-200 dark:border-red-950/70 text-center shadow-md flex flex-col items-center justify-center gap-4 transition-colors animate-in fade-in"
    >
      <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      )}
    </div>
  );
};
