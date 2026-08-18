import React, { useState } from 'react';
import { Building2, MessageCircle, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';

interface LandingHeaderProps {
  currency: 'S/' | 'USD';
  onToggleCurrency: () => void;
  onWhatsAppClick: (customMessage?: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  currency,
  onToggleCurrency,
  onWhatsAppClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { appBranding } = useCRM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Proyectos & Inmuebles', href: '#proyectos' },
    { label: 'Financiamiento', href: '#financiamiento' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#F1F3F5] dark:border-slate-800 transition-colors h-[68px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
        
        {/* Logo | Marca */}
        <a href="#/portal" className="flex items-center gap-3 group shrink-0 cursor-pointer">
          {appBranding?.logoUrl ? (
            <img src={appBranding.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#1154FF] text-white flex items-center justify-center font-manrope font-extrabold text-sm shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
          )}
          <span className="font-manrope font-extrabold text-base tracking-tight text-[#202020] dark:text-white">
            {appBranding?.appName || 'Inmobiliaria Premium'}
          </span>
        </a>

        {/* Navegación Desktop Minimalista */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[14px] font-medium text-[#202020]/80 dark:text-slate-300 hover:text-[#1154FF] dark:hover:text-[#1154FF] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Acciones y CTA Principal */}
        <div className="flex items-center gap-3">
          
          {/* Selector de Moneda S/ | USD */}
          <button
            type="button"
            onClick={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#202020] dark:text-slate-200 bg-[#F7F8FA] dark:bg-slate-800 hover:bg-[#F1F3F5] border border-[#F1F3F5] dark:border-slate-700 transition-colors"
            title="Cambiar moneda"
          >
            <span className="text-[#1154FF] font-bold">{currency}</span>
          </button>

          {/* Toggle Modo Oscuro */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-[#202020] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-slate-800 transition-colors"
            title="Tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* CTA Principal */}
          <button
            type="button"
            onClick={() => onWhatsAppClick('¡Hola! Deseo conocer la disponibilidad actual de lotes de campo y proyectos en preventa.')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-sans font-semibold text-[14px] tracking-tight shadow-sm transition-all duration-150 transform active:scale-98 cursor-pointer"
          >
            Quiero conocer disponibilidad
          </button>

          {/* Botón Menú Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#F7F8FA] dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-white dark:bg-[#121212] border-b border-[#F1F3F5] dark:border-slate-800 p-4 space-y-3 shadow-lg animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-sm font-semibold text-[#202020] dark:text-slate-200 hover:bg-[#F7F8FA] dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#F1F3F5] dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onWhatsAppClick('¡Hola! Deseo conocer la disponibilidad actual de lotes de campo y proyectos.');
              }}
              className="w-full py-3 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-sm shadow-sm transition-all"
            >
              Quiero conocer disponibilidad
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
