import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Project, Property } from '../types';
import { LandingHeader } from '../components/landing/LandingHeader';
import { AirbnbSearchBar } from '../components/landing/AirbnbSearchBar';
import { PropertyCard } from '../components/landing/PropertyCard';
import { PropertyDetailModal } from '../components/landing/PropertyDetailModal';
import { FinanceSimulator } from '../components/landing/FinanceSimulator';
import { DualContactSection } from '../components/landing/DualContactSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Compass } from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  const { projects, properties, portalConfig } = useCRM();

  // Estados de Filtros y Moneda
  const [currency, setCurrency] = useState<'S/' | 'USD'>('S/');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'proyectos' | 'independientes'>('all');
  const [maxBudget, setMaxBudget] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'S/' ? 'USD' : 'S/');
  };

  // Sourcing directo desde projects (con fallback a properties si no hay proyectos creados)
  const propertyList = useMemo(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      return projects.filter(p => p && p.isPublic !== false);
    }
    const list = Array.isArray(properties) ? properties : [];
    return list.filter(p => p && p.isPublic !== false);
  }, [projects, properties]);

  // Lista de zonas disponibles
  const availableZones = useMemo(() => {
    const zones = new Set<string>();
    propertyList.forEach((p: any) => {
      if (p?.zone) zones.add(p.zone);
      if (p?.city) zones.add(p.city);
    });
    return Array.from(zones);
  }, [propertyList]);

  // Filtrado reactivo de proyectos / propiedades
  const filteredProperties = useMemo(() => {
    return propertyList.filter((p: any) => {
      if (!p) return false;

      // 1. Filtro por Categoría
      const pType = (p.type || '').toLowerCase();
      const isProject = p.isProject !== false && (p.isProject === true || pType === 'proyecto_preventa');
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
        const rawPrice = Number(p.priceMin !== undefined ? p.priceMin : p.price) || 0;
        let normalizedPrice = rawPrice;
        if (p.currency === 'USD' && currency === 'S/') normalizedPrice = rawPrice * 3.75;
        if (p.currency === 'S/' && currency === 'USD') normalizedPrice = rawPrice / 3.75;
        if (normalizedPrice > maxBudget) return false;
      }

      return true;
    }).sort((a: any, b: any) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [propertyList, selectedCategory, selectedZone, maxBudget, currency]);

  // Helper de contacto WhatsApp
  const handleOpenWhatsApp = (prop?: any, customMsg?: string) => {
    const phone = portalConfig?.contactInfo?.phone?.replace(/\D/g, '') || '51958716850';
    let msg = customMsg;
    if (!msg) {
      if (prop) {
        const title = prop.name || prop.title;
        msg = `¡Hola CasaYa! Vi en el portal el proyecto "${title}" y deseo más información sobre el financiamiento y coordinar una visita.`;
      } else {
        msg = '¡Hola CasaYa! Deseo conocer la disponibilidad actual de proyectos y propiedades.';
      }
    }
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const heroImages = (portalConfig?.heroImages && portalConfig.heroImages.length > 0)
    ? portalConfig.heroImages
    : [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
          label: 'Residencial Las Praderas - CasaYa'
        }
      ];

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  React.useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0D13] text-[#202020] dark:text-slate-100 font-sans selection:bg-[#1154FF] selection:text-white transition-colors">
      
      {/* 1. Header Global con logo y navegación */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={() => handleOpenWhatsApp()}
      />

      {/* 2. Hero Section con Carrusel Automático de Fondo */}
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        
        {/* Carrusel de Imágenes de Fondo */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover object-center transform transition-transform duration-10000 ease-out"
              />
            </div>
          ))}
          
          {/* Capas de degradado para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#FAFAFB] dark:to-[#0B0D13]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 animate-fade-in px-2">
          
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#1154FF] animate-pulse" />
            <span>{portalConfig?.heroBadge || 'Proyectos en Preventa & Terrenos de Campo'}</span>
          </div>

          {/* Título Principal */}
          <h1 className="font-manrope font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] drop-shadow-md">
            {portalConfig?.heroTitle || 'Encuentra tu Próxima'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#38BDF8]">
              {portalConfig?.heroHighlight || 'Propiedad o Proyecto'}
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed drop-shadow">
            {portalConfig?.heroSubtitle || 'Lotes de campo, casas residenciales y proyectos en preventa con alta plusvalía y financiamiento directo en Arequipa.'}
          </p>

          {/* 3. Buscador estilo Airbnb flotante */}
          <div className="pt-2">
            <AirbnbSearchBar
              availableZones={availableZones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              maxBudget={maxBudget}
              onBudgetChange={setMaxBudget}
              currency={currency}
            />
          </div>
        </div>

        {/* Indicadores de diapositivas del carrusel */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIdx(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentHeroIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                }`}
                title={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Sección de Propiedades Destacadas & Catálogo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Header de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E7EB] dark:border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1154FF] dark:text-[#38BDF8]">
              <Compass className="w-3.5 h-3.5" />
              <span>Inventario Seleccionado</span>
            </div>
            <h2 className="font-manrope font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
              Propiedades & Proyectos Destacados
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explora nuestras oportunidades inmobiliarias con alta plusvalía y financiamiento.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Mostrando <strong>{filteredProperties.length}</strong> inmuebles
            </span>

            <a
              href="#/catalogo"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E2333] dark:hover:bg-[#252C40] text-[#1154FF] dark:text-[#38BDF8] font-bold text-xs transition-colors cursor-pointer"
            >
              Ver Catálogo Completo →
            </a>
          </div>
        </div>

        {/* Grilla de Propiedades: 3 columnas en desktop y 1 columna en móvil */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.slice(0, 9).map((prop: any) => (
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
          <div className="p-12 text-center bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSelectedZone('');
                setSelectedCategory('all');
                setMaxBudget(0);
              }}
              className="px-4 py-2 rounded-xl bg-[#1154FF] text-white font-bold text-xs cursor-pointer"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </section>

      {/* 5. Simulador de Financiamiento */}
      <FinanceSimulator
        currency={currency}
        onConsultWhatsApp={(amount, term) => {
          const msg = `¡Hola CasaYa! Calculé una cuota en el simulador web para un financiamiento de ${currency} ${amount.toLocaleString('en-US')} a ${term} meses. Deseo mayor información y requisitos.`;
          handleOpenWhatsApp(undefined, msg);
        }}
      />

      {/* 6. Sección de Contacto Doble */}
      <DualContactSection
        contactInfo={portalConfig?.contactInfo}
        onWhatsAppClick={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 7. Footer Oficial */}
      <LandingFooter
        portalConfig={portalConfig}
        onWhatsAppClick={() => handleOpenWhatsApp()}
      />

      {/* Modal de Detalle de Inmueble */}
      <PropertyDetailModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        currency={currency}
        onWhatsAppClick={(prop, customMsg) => handleOpenWhatsApp(prop, customMsg)}
      />
    </div>
  );
};
