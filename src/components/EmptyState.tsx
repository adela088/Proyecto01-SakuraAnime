import React from 'react';
import { LucideIcon} from 'lucide-react';
import { SakuraIcon } from './SakuraIcon';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SakuraIcon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      role="status"
      className="w-full max-w-md mx-auto my-12 p-8 text-center flex flex-col items-center justify-center gap-4 bg-white/50 dark:bg-[#1a1122]/50 rounded-3xl border border-rose-100 dark:border-rose-950/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-400 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40">
        <Icon className="w-10 h-10" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-display">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 px-5 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
