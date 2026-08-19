import React, { useState } from 'react';
import { Home, Moon, Sun, Menu, X, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';

interface LandingHeaderProps {
  currency?: 'S/' | 'USD';
  onToggleCurrency?: () => void;
  onWhatsAppClick?: (msg?: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = () => {
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
    
    const currentHash = (window.location.hash || '').toLowerCase();
    if (currentHash.includes('catalog')) {
      window.location.hash = `#/portal`;
      setTimeout(() => {
        const targetId = link.href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          const yOffset = -74;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    e.preventDefault();
    const targetId = link.href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -74;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    const currentHash = (window.location.hash || '').toLowerCase();
    if (currentHash.includes('catalog') || currentHash.includes('catalogo')) {
      window.location.hash = '#/portal';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0B0C10] border-b border-[#E5E7EB] dark:border-white/[0.08] transition-colors h-[68px] flex items-center shadow-sm">
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

          {/* Navegación Desktop */}
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

          {/* Acciones: Candado CRM + Tema Oscuro + Menú Móvil */}
          <div className="flex items-center gap-2">
            
            {/* Acceso CRM en Desktop (solo icono de candado) */}
            <a
              href={typeof window !== 'undefined' && window.location.hostname.includes('casaya.app') ? 'https://crm.casaya.app' : '#/dashboard'}
              title="Ingreso a CRM CasaYa"
              aria-label="Ingreso a CRM"
              className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#151821] hover:bg-[#F1F3F5] dark:hover:bg-[#1C202C] text-[#202020] dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-4 h-4 text-slate-700 dark:text-slate-300 hover:text-[#1154FF] transition-colors" />
            </a>

            {/* Toggle Modo Oscuro / Claro */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar Tema"
              className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#151821] hover:bg-[#F1F3F5] dark:hover:bg-[#1C202C] text-[#202020] dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
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
      </header>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 top-[68px] z-40 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="lg:hidden fixed top-[68px] left-0 right-0 z-50 bg-white dark:bg-[#0D1017] border-b border-[#E5E7EB] dark:border-white/[0.12] shadow-2xl p-5 space-y-4 animate-fade-in">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-3.5 py-3 rounded-xl text-sm font-bold text-[#202020] dark:text-white bg-[#F7F8FA] dark:bg-[#181C27] hover:bg-[#F1F3F5] dark:hover:bg-[#202533] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-slate-400 text-xs">→</span>
                </a>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#F1F3F5] dark:border-white/[0.08]">
              <a
                href={typeof window !== 'undefined' && window.location.hostname.includes('casaya.app') ? 'https://crm.casaya.app' : '#/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-3.5 rounded-xl bg-slate-100 dark:bg-[#151821] border border-[#E5E7EB] dark:border-white/[0.1] text-[#202020] dark:text-slate-100 text-xs font-bold flex items-center justify-between transition-all cursor-pointer hover:border-[#1154FF]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#1154FF] text-white flex items-center justify-center shadow-sm">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>Ingreso a App CasaYa (CRM)</span>
                </div>
                <span className="text-[#1154FF] dark:text-[#38BDF8] text-xs font-semibold">Acceder →</span>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
};
