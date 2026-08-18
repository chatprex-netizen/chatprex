import React from 'react';
import { Building2, MessageCircle, Moon, Sun, DollarSign, Phone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';

interface LandingHeaderProps {
  currency: 'S/' | 'USD';
  onToggleCurrency: () => void;
  onWhatsAppClick: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  currency,
  onToggleCurrency,
  onWhatsAppClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { appBranding } = useCRM();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo & Marca */}
        <a href="#/portal" className="flex items-center gap-2.5 group cursor-pointer">
          {appBranding.logoUrl ? (
            <img src={appBranding.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#004aad] to-[#2563eb] text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-[#004aad] transition-colors">
              {appBranding.appName || 'Inmobiliaria Premium'}
            </div>
            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider hidden sm:block">
              Lotes de Campo & Propiedades Exclusivas
            </div>
          </div>
        </a>

        {/* Acciones & Contacto */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Selector de Moneda */}
          <button
            type="button"
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
            title="Cambiar moneda entre Soles y Dólares"
          >
            <span className="text-[#004aad] font-black">{currency}</span>
            <span className="text-[10px] text-slate-400">{currency === 'S/' ? 'PEN' : 'USD'}</span>
          </button>

          {/* Selector de Tema */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Alternar Modo Oscuro / Claro"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Botón WhatsApp */}
          <button
            type="button"
            onClick={onWhatsAppClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Asesor en Línea</span>
          </button>
        </div>
      </div>
    </header>
  );
};
