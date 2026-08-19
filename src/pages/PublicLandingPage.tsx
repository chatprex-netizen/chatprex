import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Property } from '../types';
import { LandingHeader } from '../components/landing/LandingHeader';
import { AirbnbSearchBar } from '../components/landing/AirbnbSearchBar';
import { PropertyCard } from '../components/landing/PropertyCard';
import { PropertyDetailModal } from '../components/landing/PropertyDetailModal';
import { FinanceSimulator } from '../components/landing/FinanceSimulator';
import { DualContactSection } from '../components/landing/DualContactSection';
import { MobileBottomNav } from '../components/landing/MobileBottomNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Compass } from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  const { properties, portalConfig } = useCRM();

  // Estados de Filtros y Moneda
  const [currency, setCurrency] = useState<'S/' | 'USD'>('S/');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'proyectos' | 'independientes'>('all');
  const [maxBudget, setMaxBudget] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'S/' ? 'USD' : 'S/');
  };

  const propertyList = Array.isArray(properties) ? properties : [];

  // Lista de zonas disponibles
  const availableZones = useMemo(() => {
    const zones = new Set<string>();
    propertyList.forEach(p => {
      if (p?.zone) zones.add(p.zone);
      if (p?.city) zones.add(p.city);
    });
    return Array.from(zones);
  }, [propertyList]);

  // Filtrado reactivo de propiedades
  const filteredProperties = useMemo(() => {
    return propertyList.filter(p => {
      if (!p) return false;

      // 1. Filtro por Categoría
      const pType = (p.type || '').toLowerCase();
      const pOp = (p.operation || '').toLowerCase();
      const pProj = (p.projectName || '').trim();
      const isProject = pType === 'proyecto_preventa' || pOp === 'preventa' || pProj.length > 0;
      if (selectedCategory === 'proyectos' && !isProject) return false;
      if (selectedCategory === 'independientes' && isProject) return false;

      // 2. Filtro por Zona
      if (selectedZone) {
        const zoneLower = selectedZone.toLowerCase();
        const zoneMatch = (p.zone && p.zone.toLowerCase().includes(zoneLower)) ||
                          (p.city && p.city.toLowerCase().includes(zoneLower)) ||
                          (p.address && p.address.toLowerCase().includes(zoneLower));
        if (!zoneMatch) return false;
      }

      // 3. Filtro por Presupuesto
      if (maxBudget > 0) {
        const rawPrice = Number(p.price) || 0;
        let normalizedPrice = rawPrice;
        if (p.currency === 'USD' && currency === 'S/') normalizedPrice = rawPrice * 3.75;
        if (p.currency === 'S/' && currency === 'USD') normalizedPrice = rawPrice / 3.75;
        if (normalizedPrice > maxBudget) return false;
      }

      return true;
    }).sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [propertyList, selectedCategory, selectedZone, maxBudget, currency]);

  // Helper de contacto WhatsApp
  const handleOpenWhatsApp = (prop?: Property, customMsg?: string) => {
    const phone = portalConfig?.contactInfo?.phone?.replace(/\D/g, '') || '51958716850';
    let msg = customMsg;
    if (!msg) {
      if (prop) {
        msg = `¡Hola CasaYa! Vi en el portal el inmueble "${prop.projectName ? `${prop.projectName} - ${prop.title}` : prop.title}" y deseo más información sobre el financiamiento y coordinar una visita.`;
      } else {
        msg = '¡Hola CasaYa! Deseo conocer la disponibilidad actual de proyectos y propiedades.';
      }
    }
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -74;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const [activeHeroImg, setActiveHeroImg] = useState(0);

  const heroImages = Array.isArray(portalConfig?.heroImages) && portalConfig.heroImages.length > 0
    ? portalConfig.heroImages
    : [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
          label: 'Residencias & Casas Modernas',
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
          label: 'Lotes Campestres & Vistas Panorámicas',
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80',
          label: 'Desarrollos & Proyectos en Preventa',
        },
      ];

  // Cambio automático cada 5 segundos
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroImg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen pt-[68px] bg-[#F7F8FA] dark:bg-[#0B0C10] text-[#202020] dark:text-slate-100 font-sans transition-colors selection:bg-[#1154FF] selection:text-white">
      
      {/* 1. Header Minimalista */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 2. Hero Section con 3 Imágenes Animadas (Cambio cada 5s) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 border-b border-[#F1F3F5] dark:border-white/[0.08]">
        
        {/* Carrusel de Fondo Animado */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroImages.map((img, idx) => (
            <div
              key={img.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                activeHeroImg === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
                  activeHeroImg === idx ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          ))}
          {/* Overlay suave y translúcido para resaltar la viveza de las imágenes con contraste óptimo */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/35 via-black/20 to-black/60" />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-30 max-w-4xl mx-auto text-center space-y-5">
          
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md text-xs font-semibold text-white animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <span>{portalConfig?.heroBadge || 'Proyectos en Preventa & Propiedades Exclusivas'}</span>
          </div>

          {/* Titular Principal H1 con Contraste y Sombra de Lectura */}
          <h1 className="font-manrope font-extrabold text-[34px] sm:text-[44px] md:text-[52px] text-white tracking-tight leading-[1.08] max-w-3xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {portalConfig?.heroTitle || 'Encuentra tu Próxima'}{' '}
            <span className="text-[#38bdf8] drop-shadow-[0_2px_16px_rgba(56,189,248,0.5)]">
              {portalConfig?.heroHighlight || 'Propiedad o Proyecto'}
            </span>{' '}
            Inmobiliario
          </h1>

          {/* Subtítulo con Sombra Suave */}
          <p className="text-[15px] sm:text-[17px] text-slate-100 max-w-2xl mx-auto leading-[1.55] font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            {portalConfig?.heroSubtitle || 'Casas, departamentos, lotes de campo y desarrollos en preventa con alta plusvalía y facilidades de financiamiento a tu medida.'}
          </p>

          {/* Buscador Estilo Airbnb */}
          <div className="pt-3">
            <AirbnbSearchBar
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCurrency={currency}
              onToggleCurrency={toggleCurrency}
              maxBudget={maxBudget}
              onChangeMaxBudget={setMaxBudget}
              onSearch={() => handleScrollTo('proyectos')}
              availableZones={availableZones}
            />
          </div>

          {/* Indicadores de 3 puntos interactivos */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {heroImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHeroImg(idx)}
                aria-label={`Ver foto ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeHeroImg === idx
                    ? 'w-8 bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Grilla de Proyectos y Propiedades Destacadas (Máximo 8 items) */}
      <section id="proyectos" className="max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-manrope font-bold text-[20px] sm:text-[26px] md:text-[30px] text-[#202020] dark:text-white tracking-tight leading-[1.15]">
              Proyectos y Propiedades Destacadas
            </h2>
            <p className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
              Selección exclusiva de inmuebles con alta plusvalía y disponibilidad inmediata
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {(selectedZone || maxBudget > 0 || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedZone('');
                  setMaxBudget(0);
                  setSelectedCategory('all');
                }}
                className="text-[12px] sm:text-[13px] font-semibold text-[#1154FF] dark:text-[#38BDF8] hover:underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            )}

            <a
              href="#/catalogo"
              className="text-[12px] sm:text-[13px] font-bold text-[#1154FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {filteredProperties.slice(0, 8).map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  currency={currency}
                  onSelect={(p) => setSelectedProperty(p)}
                  onWhatsAppClick={(p) => handleOpenWhatsApp(p)}
                />
              ))}
            </div>

            {/* Botón Ver Catálogo Completo */}
            <div className="mt-8 sm:mt-10 text-center">
              <a
                href="#/catalogo"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#151821] border border-[#E5E7EB] dark:border-white/[0.1] hover:border-[#1154FF] dark:hover:border-[#38BDF8] text-[#202020] dark:text-white font-manrope font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <span>Explorar Catálogo Completo ({propertyList.length} Inmuebles Disponibles)</span>
                <span className="text-[#1154FF] dark:text-[#38BDF8] group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#12151E] rounded-2xl border border-[#E5E7EB] dark:border-white/[0.08] p-8 space-y-3 shadow-sm">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-manrope font-bold text-base text-[#202020] dark:text-white">No encontramos inmuebles con esos filtros</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Intenta ampliando el rango de presupuesto o seleccionando otra ubicación.
            </p>
            <a
              href="#/catalogo"
              className="inline-block px-5 py-2.5 bg-[#1154FF] hover:bg-[#0c43cc] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 cursor-pointer"
            >
              Ver Todo el Catálogo Completo
            </a>
          </div>
        )}
      </section>

      {/* 4. Simulador de Financiamiento */}
      <FinanceSimulator
        currency={currency}
        onSendSimulation={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 5. Módulo de Contacto Dual */}
      <DualContactSection
        currency={currency}
        onSendMessage={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 6. Modal de Detalle */}
      <PropertyDetailModal
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        currency={currency}
        onWhatsAppClick={(p, msg) => handleOpenWhatsApp(p, msg)}
      />

      {/* 7. Barra Móvil Fija */}
      <MobileBottomNav
        onScrollTo={handleScrollTo}
        onWhatsAppClick={() => handleOpenWhatsApp(undefined, '¡Hola! Quiero conocer la disponibilidad de proyectos y propiedades.')}
      />

      {/* 8. Footer */}
      <LandingFooter />
    </div>
  );
};
