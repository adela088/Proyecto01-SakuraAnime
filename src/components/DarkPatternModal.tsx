import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { HeartCrack, X, ShieldAlert, Check } from 'lucide-react';
import { SakuraIcon } from './SakuraIcon';

export interface DarkPatternModalHandle {
  open: () => void;
  close: () => void;
}

interface DarkPatternModalProps {
  onConfirmDanger: () => void;
}

// Patrones oscuros intencionales usados:
// Confirmshaming: usa culpa emocional para desalentar que el usuario borre sus favoritos.
// Misdirection: destaca visualmente la opción de cancelar y minimiza la acción de borrar.
// Pre-checked sneak: activa por defecto la casilla de suscripción sin consentimiento previo.
// Urgencia y pérdida: exagera consecuencias irreversibles para presionar la decisión del usuario.
export const DarkPatternModal = forwardRef<DarkPatternModalHandle, DarkPatternModalProps>(
  ({ onConfirmDanger }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [optInSneak, setOptInSneak] = useState(true);
    const [showExplanation, setShowExplanation] = useState(false);

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

    const handleAbortAndStay = () => {
      dialogRef.current?.close();
    };

    const handleConfirmActualDelete = () => {
      onConfirmDanger();
      dialogRef.current?.close();
    };

    return (
      <dialog
        ref={dialogRef}
        aria-labelledby="dark-pattern-title"
        aria-describedby="dark-pattern-desc"
        className="p-0 rounded-3xl bg-white dark:bg-[#180f22] text-slate-900 dark:text-slate-100 border-2 border-rose-300 dark:border-rose-800 shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm max-w-lg w-11/12 mx-auto overflow-hidden open:animate-in open:zoom-in-95"
      >
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-5 text-white text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md mb-2 shadow-inner">
            <HeartCrack className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h2 id="dark-pattern-title" className="text-xl font-extrabold font-display">
            ¿En serio nos vas a abandonar así? 🥺
          </h2>
          <p className="text-xs text-rose-100 mt-1">
            Tus animes y personajes favoritos quedarán en el olvido absoluto
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div
            id="dark-pattern-desc"
            className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 leading-relaxed"
          >
            <p className="font-semibold mb-1 flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              ¡ADVERTENCIA DE PÉRDIDA IRREVERSIBLE!
            </p>
            Al vaciar tu lista, perderás tu insignia de <strong>Fan Otaku VIP</strong> y tus animes
            favoritos no podrán ser sincronizados en el servidor de recomendaciones personalizadas.
          </div>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={optInSneak}
              onChange={e => setOptInSneak(e.target.checked)}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span>
              <strong>Mantener mi suscripción</strong> al boletín diario de estrenos y recibir hasta 12
              correos semanales con promociones de merchandising.
            </span>
          </label>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAbortAndStay}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <SakuraIcon className="w-4 h-4" />
              <span>¡Sí, quiero conservar a mis favoritos conmigo! (Cancelar)</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowExplanation(prev => !prev)}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
              >
                {showExplanation ? 'Ocultar explicación docente' : '¿Por qué esto es un Dark Pattern?'}
              </button>

              <button
                type="button"
                onClick={handleConfirmActualDelete}
                className="text-xs text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded"
              >
                No me importa, borrar todo de todos modos
              </button>
            </div>
          </div>

          {showExplanation && (
            <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Patrones implementados según la pauta:
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>
                  <strong>Confirmshaming:</strong> Copia que apela a la culpa emocional del usuario.
                </li>
                <li>
                  <strong>Misdirection:</strong> El botón para cancelar es grande y colorido; el de
                  borrar está minimizado.
                </li>
                <li>
                  <strong>Pre-checked checkbox:</strong> Casilla de opt-in activada por defecto.
                </li>
                <li>
                  <strong>Tecnología:</strong> &lt;dialog&gt; nativo con useRef y showModal().
                </li>
              </ul>
            </div>
          )}
        </div>
      </dialog>
    );
  }
);
