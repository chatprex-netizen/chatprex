import React, { useState } from 'react';
import { Home, Moon, Sun, MessageCircle, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';

interface LandingHeaderProps {
  currency: 'S/' | 'USD';
  onToggleCurrency: () => void;
  onWhatsAppClick: (msg?: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  currency,
  onToggleCurrency,
  onWhatsAppClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { appBranding } = useCRM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = appBranding?.appName && appBranding.appName !== 'ChatPrex' ? appBranding.appName : 'CasaYa';

  const navLinks = [
    { label: 'Catálogo Completo', href: '#/catalogo', isPage: true },
    { label: 'Financiamiento', href: '#financiamiento' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { label: string; href: string; isPage?: boolean }) => {
    setMobileMenuOpen(false);
    if (link.isPage) {
      window.location.hash = link.href;
      return;
    }
    
    // Si estamos en otra página (ej. catalogo) y hacemos click en una sección del portal
    const currentHash = (window.location.hash || '').toLowerCase();
    if (currentHash.includes('catalog')) {
      window.location.hash = `#/portal`;
      setTimeout(() => {
        const targetId = link.href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    e.preventDefault();
    const targetId = link.href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const currentHash = (window.location.hash || '').toLowerCase();
    if (currentHash.includes('catalog') || currentHash.includes('catalogo')) {
      window.location.hash = '#/portal';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B0C10]/95 backdrop-blur-xl border-b border-[#E5E7EB]/80 dark:border-white/[0.08] transition-colors h-[68px] flex items-center shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
        
        {/* Logo | Marca CasaYa */}
        <a 
          href="#/portal" 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
        >
          {appBranding?.logoUrl ? (
            <img src={appBranding.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#1154FF] text-white flex items-center justify-center font-manrope font-extrabold text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 stroke-[2.2]" />
            </div>
          )}
          <span className="font-manrope font-extrabold text-lg sm:text-xl tracking-tight text-[#202020] dark:text-white group-hover:text-[#1154FF] dark:group-hover:text-[#38BDF8] transition-colors">
            {brandName}
          </span>
        </a>

        {/* Navegación Desktop Siempre Visible en PC */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-[14px] font-medium text-[#202020]/80 dark:text-slate-200 hover:text-[#1154FF] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Acciones y CTA Principal */}
        <div className="flex items-center gap-2.5">
          
          {/* Selector de Moneda S/ | USD */}
          <button
            type="button"
            onClick={onToggleCurrency}
            aria-label="Cambiar Moneda"
            className="px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#151821] hover:bg-[#F1F3F5] dark:hover:bg-[#1C202C] text-xs font-bold text-[#202020] dark:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{currency}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({currency === 'S/' ? 'PEN' : 'USD'})
            </span>
          </button>

          {/* Toggle Modo Oscuro / Claro */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar Tema"
            className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#151821] hover:bg-[#F1F3F5] dark:hover:bg-[#1C202C] text-[#202020] dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* CTA Principal Desktop: Quiero conocer disponibilidad */}
          <button
            type="button"
            onClick={() => onWhatsAppClick('¡Hola! Quiero conocer la disponibilidad de proyectos y propiedades.')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[13px] shadow-sm transition-all transform active:scale-98 cursor-pointer"
          >
            <span>Quiero conocer disponibilidad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Botón Menú Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#151821] text-[#202020] dark:text-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-white/98 dark:bg-[#0B0C10]/98 backdrop-blur-2xl border-b border-[#E5E7EB] dark:border-white/[0.08] shadow-2xl p-5 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#202020] dark:text-slate-200 hover:bg-[#F7F8FA] dark:hover:bg-[#151821] transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#F1F3F5] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onWhatsAppClick('¡Hola! Quiero conocer la disponibilidad de proyectos y propiedades.');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
              <span>Quiero conocer disponibilidad</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
