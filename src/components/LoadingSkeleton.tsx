import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  count?: number;
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 8,
  message = 'Cargando datos...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full space-y-6 animate-in fade-in"
    >
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-rose-500 dark:text-rose-400">
        <Loader2 className="w-9 h-9 animate-spin text-rose-500" />
        <p className="text-sm font-medium animate-pulse text-slate-600 dark:text-slate-300">
          {message}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-2xl overflow-hidden border border-rose-100/70 dark:border-rose-950/40 bg-white/60 dark:bg-[#181120]/60 p-0 shadow-xs animate-pulse"
          >
            <div className="aspect-[3/4] bg-rose-100/50 dark:bg-rose-950/40 w-full" />

            <div className="p-4 space-y-3">
              <div className="h-4 bg-rose-200/60 dark:bg-rose-900/40 rounded-md w-3/4" />
              <div className="h-3 bg-rose-100/70 dark:bg-rose-950/60 rounded-md w-1/2" />
              <div className="pt-2 border-t border-rose-100/50 dark:border-rose-950/30 flex justify-between">
                <div className="h-3 bg-rose-100/60 dark:bg-rose-950/40 rounded-md w-1/3" />
                <div className="h-3 bg-rose-100/60 dark:bg-rose-950/40 rounded-md w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
