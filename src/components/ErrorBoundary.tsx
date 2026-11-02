import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary capturó un error de renderizado:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#0c1322] border border-red-200 dark:border-red-900/60 rounded-3xl m-6 shadow-xl"
        >
          <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mb-4 animate-bounce">
            <AlertOctagon className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
            ¡Ups! Algo inesperado salió mal
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mb-6 leading-relaxed">
            Se ha producido un error durante el renderizado de la interfaz. Nuestro sistema de contención
            (Error Boundary) ha interceptado la falla para proteger la sesión.
          </p>

          {this.state.error && (
            <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded-xl text-red-500 max-w-lg overflow-x-auto mb-6 text-left">
              {this.state.error.message}
            </pre>
          )}

          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recargar la aplicación</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
