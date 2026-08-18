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
  const { properties } = useCRM();

  // Estados de Filtros y Moneda
  const [currency, setCurrency] = useState<'S/' | 'USD'>('S/');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'proyectos' | 'independientes'>('all');
  const [maxBudget, setMaxBudget] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState('');
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

      // 4. Filtro por Característica
      if (selectedFeature) {
        const featLower = selectedFeature.toLowerCase();
        const inTitle = (p.title || '').toLowerCase().includes(featLower);
        const inDesc = (p.description || '').toLowerCase().includes(featLower);
        const inFeats = Array.isArray(p.features) && p.features.some(f => (f || '').toLowerCase().includes(featLower));
        const inType = pType.includes(featLower);
        const inProj = pProj.toLowerCase().includes(featLower);
        if (!inTitle && !inDesc && !inFeats && !inType && !inProj) return false;
      }

      return true;
    });
  }, [propertyList, selectedCategory, selectedZone, maxBudget, selectedFeature, currency]);

  // Helper de contacto WhatsApp
  const handleOpenWhatsApp = (prop?: Property, customMsg?: string) => {
    const phone = '51957100984'; // Asesor Elvis Meza
    let msg = customMsg;
    if (!msg) {
      if (prop) {
        msg = `¡Hola Elvis! Vi en el portal el inmueble "${prop.projectName ? `${prop.projectName} - ${prop.title}` : prop.title}" y deseo más información sobre el financiamiento y coordinar una visita.`;
      } else {
        msg = '¡Hola Elvis! Deseo conocer la disponibilidad actual de lotes de campo y proyectos.';
      }
    }
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [activeHeroImg, setActiveHeroImg] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
      label: 'Residencias & Casas Modernas',
    },
    {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
      label: 'Lotes Campestres & Vistas Panorámicas',
    },
    {
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
    <div className="min-h-screen bg-white dark:bg-[#121212] text-[#202020] dark:text-slate-100 font-sans transition-colors selection:bg-[#1154FF] selection:text-white">
      
      {/* 1. Header Minimalista */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 2. Hero Section con 3 Imágenes Animadas (Cambio cada 5s) */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 overflow-hidden border-b border-[#F1F3F5] dark:border-slate-800/80">
        
        {/* Carrusel de Fondo Animado */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
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
          {/* Overlay suave para mantener contraste y legibilidad impecable */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/92 via-white/88 to-white/95 dark:from-[#121212]/92 dark:via-[#121212]/88 dark:to-[#121212]/95 backdrop-blur-[2px]" />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-30 max-w-4xl mx-auto text-center space-y-5">
          
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#E5E7EB] dark:border-slate-700 shadow-sm text-xs font-semibold text-[#202020] dark:text-slate-200 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#1154FF] animate-pulse" />
            <span>Proyectos en Preventa & Propiedades Exclusivas</span>
          </div>

          {/* Titular Principal H1 (Escala: 34-40px mobile, 48-56px desktop, 800) */}
          <h1 className="font-manrope font-extrabold text-[34px] sm:text-[44px] md:text-[52px] text-[#202020] dark:text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Encuentra tu Próxima Propiedad o Proyecto Inmobiliario
          </h1>

          {/* Subtítulo (Escala: 15-17px desktop, 400/500, line-height 1.55) */}
          <p className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-[1.55] font-normal">
            Casas, departamentos, lotes de campo y desarrollos en preventa con alta plusvalía y facilidades de financiamiento a tu medida.
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
                    ? 'w-8 bg-[#1154FF]'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Grilla de Propiedades & Lotes (4 cols PC, 2 cols Móvil) */}
      <section id="proyectos" className="max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <h2 className="font-manrope font-bold text-[20px] sm:text-[26px] md:text-[30px] text-[#202020] dark:text-white tracking-tight leading-[1.15]">
              {selectedCategory === 'proyectos' ? 'Proyectos & Preventas' :
               selectedCategory === 'independientes' ? 'Propiedades Independientes' :
               'Catálogo Disponible'}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-slate-400 mt-0.5">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'inmueble disponible' : 'inmuebles disponibles'}
            </p>
          </div>

          {(selectedZone || maxBudget > 0 || selectedFeature || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedZone('');
                setMaxBudget(0);
                setSelectedFeature('');
                setSelectedCategory('all');
              }}
              className="text-[12px] sm:text-[13px] font-semibold text-[#1154FF] hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                currency={currency}
                onSelect={(p) => setSelectedProperty(p)}
                onWhatsAppClick={(p) => handleOpenWhatsApp(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F7F8FA] dark:bg-[#181818] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 p-8 space-y-3">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-manrope font-bold text-base text-[#202020] dark:text-white">No encontramos inmuebles con esos filtros</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Intenta ampliando el rango de presupuesto o seleccionando otra ubicación.
            </p>
            <button
              onClick={() => {
                setSelectedZone('');
                setMaxBudget(0);
                setSelectedFeature('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#1154FF] text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        )}
      </section>

      {/* 5. Simulador de Financiamiento */}
      <FinanceSimulator
        currency={currency}
        onSendSimulation={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 6. Módulo de Contacto Dual */}
      <DualContactSection
        currency={currency}
        onSendMessage={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 8. Modal de Detalle */}
      <PropertyDetailModal
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        currency={currency}
        onWhatsAppClick={(p, msg) => handleOpenWhatsApp(p, msg)}
      />

      {/* 9. Barra Móvil Fija */}
      <MobileBottomNav
        onScrollTo={handleScrollTo}
        onWhatsAppClick={() => handleOpenWhatsApp(undefined, '¡Hola! Quiero conocer la disponibilidad de lotes de campo.')}
      />

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
};
