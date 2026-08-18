import React, { useState } from 'react';
import { Home, Building2, Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu email y contraseña');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo y Título */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3 justify-center">
            <div className="flex shrink-0 items-center justify-center w-10 h-10 bg-[#1154FF] text-white rounded-xl shadow-lg shadow-blue-500/25">
              <Home className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight m-0 leading-none">
              CasaYa <span className="text-[#38BDF8] text-base font-semibold">CRM</span>
            </h1>
          </div>
          <p className="text-slate-400 mt-3 text-xs text-center">
            Plataforma Inmobiliaria Digital con Inteligencia Artificial
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                    transition-all duration-200"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                    transition-all duration-200"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-500 hover:to-indigo-500 
                disabled:from-blue-600/50 disabled:to-indigo-600/50 disabled:cursor-not-allowed
                text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/25
                transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 mt-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <a href="#/privacy" className="hover:text-slate-200 transition-colors underline">
              Política de Privacidad
            </a>
            <span>·</span>
            <a href="#/terms" className="hover:text-slate-200 transition-colors underline">
              Términos de Servicio
            </a>
            <span>·</span>
            <a href="#/data-deletion" className="hover:text-slate-200 transition-colors underline">
              Exclusión de Datos
            </a>
          </div>
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} CasaYa · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
};
