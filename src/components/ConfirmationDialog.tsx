import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmationDialogHandle {
  open: () => void;
  close: () => void;
}

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'info';
}

export const ConfirmationDialog = forwardRef<ConfirmationDialogHandle, ConfirmationDialogProps>(
  (
    {
      title,
      message,
      confirmLabel = 'Confirmar',
      cancelLabel = 'Cancelar',
      onConfirm,
      onCancel,
      variant = 'danger',
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (dialogRef.current && !dialogRef.current.open) {
          dialogRef.current.showModal();
        }
      },
      close: () => {
        if (dialogRef.current && dialogRef.current.open) {
          dialogRef.current.close();
        }
      },
    }));

    const handleConfirm = () => {
      onConfirm();
      dialogRef.current?.close();
    };

    const handleCancel = () => {
      onCancel?.();
      dialogRef.current?.close();
    };

    return (
      <dialog
        ref={dialogRef}
        onCancel={handleCancel}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        className="p-0 rounded-2xl bg-white dark:bg-[#191022] text-slate-900 dark:text-slate-100 border border-rose-200 dark:border-rose-900/80 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-xs max-w-md w-11/12 mx-auto open:animate-in open:fade-in open:zoom-in-95"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span
                className={`p-2.5 rounded-xl ${
                  variant === 'danger'
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
                    : 'bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 id="dialog-title" className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {title}
              </h2>
            </div>
            <button
              onClick={handleCancel}
              aria-label="Cerrar modal"
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p id="dialog-desc" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-sm ${
                variant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/25'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);
