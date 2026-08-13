import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: React.ErrorInfo | Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: React.ErrorInfo | Error, _info?: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card text-center space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ocurrió un error en la aplicación</h2>
            <p className="text-xs text-slate-500">
              Puedes intentar volver a cargar la app. Si el problema persiste, revisa la consola del navegador.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-2 px-4 py-2 rounded-lg bg-[#004aad] text-white text-xs font-medium hover:bg-[#003b8a]"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
