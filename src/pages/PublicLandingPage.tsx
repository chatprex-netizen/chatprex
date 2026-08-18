import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Property } from '../types';
import { LandingHeader } from '../components/landing/LandingHeader';
import { AirbnbSearchBar } from '../components/landing/AirbnbSearchBar';
import { CategoryTabs } from '../components/landing/CategoryTabs';
import { PropertyCard } from '../components/landing/PropertyCard';
import { PropertyDetailModal } from '../components/landing/PropertyDetailModal';
import { FinanceSimulator } from '../components/landing/FinanceSimulator';
import { LegalSecuritySection } from '../components/landing/LegalSecuritySection';
import { DualContactSection } from '../components/landing/DualContactSection';
import { MobileBottomNav } from '../components/landing/MobileBottomNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Trees, Sun, Sparkles, MessageCircle, ArrowRight, ShieldCheck, MapPin, Compass } from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  const { properties, projects } = useCRM();

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

  // Lista única de zonas disponibles
  const availableZones = useMemo(() => {
    const zones = new Set<string>();
    properties.forEach(p => {
      if (p.zone) zones.add(p.zone);
      if (p.city) zones.add(p.city);
    });
    return Array.from(zones);
  }, [properties]);

  // Filtrado reactivo de propiedades
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // 1. Filtro por Categoría (Proyectos vs Independientes)
      const isProject = p.type === 'proyecto_preventa' || p.operation === 'preventa' || (p.projectName && p.projectName.length > 0);
      if (selectedCategory === 'proyectos' && !isProject) return false;
      if (selectedCategory === 'independientes' && isProject) return false;

      // 2. Filtro por Zona
      if (selectedZone) {
        const zoneMatch = (p.zone && p.zone.toLowerCase().includes(selectedZone.toLowerCase())) ||
                          (p.city && p.city.toLowerCase().includes(selectedZone.toLowerCase())) ||
                          (p.address && p.address.toLowerCase().includes(selectedZone.toLowerCase()));
        if (!zoneMatch) return false;
      }

      // 3. Filtro por Presupuesto
      if (maxBudget > 0) {
        const rawPrice = p.price || 0;
        let normalizedPrice = rawPrice;
        if (p.currency === 'USD' && currency === 'S/') normalizedPrice = rawPrice * 3.75;
        if (p.currency === 'S/' && currency === 'USD') normalizedPrice = rawPrice / 3.75;
        if (normalizedPrice > maxBudget) return false;
      }

      // 4. Filtro por Característica / Badge
      if (selectedFeature) {
        const featLower = selectedFeature.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(featLower);
        const inDesc = p.description.toLowerCase().includes(featLower);
        const inFeats = p.features && p.features.some(f => f.toLowerCase().includes(featLower));
        const inType = p.type.toLowerCase().includes(featLower);
        if (!inTitle && !inDesc && !inFeats && !inType) return false;
      }

      return true;
    });
  }, [properties, selectedCategory, selectedZone, maxBudget, selectedFeature, currency]);

  // Helper de contacto WhatsApp
  const handleOpenWhatsApp = (prop?: Property, customMsg?: string) => {
    const phone = '51957100984'; // Asesor Elvis Meza
    let msg = customMsg;
    if (!msg) {
      if (prop) {
        msg = `¡Hola Elvis! Vi en el portal el inmueble "${prop.projectName ? `${prop.projectName} - ${prop.title}` : prop.title}" y deseo más información sobre el financiamiento y coordinar una visita.`;
      } else {
        msg = '¡Hola Elvis! Deseo recibir el catálogo actualizado de lotes de campo exclusivos en Arequipa y preventas disponibles.';
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

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors selection:bg-[#004aad] selection:text-white">
      
      {/* 1. Header Fijo */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={() => handleOpenWhatsApp()}
      />

      {/* 2. Hero Section de Alto Impacto */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-[#f8fafc] dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
        
        {/* Glow Effects de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-850/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Exclusividad en Arequipa • Sol y Campiña los 365 días del año</span>
          </div>

          {/* Titular Principal Persuasivo */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Tu Casa de Campo Soñada a 25 min de la Ciudad
          </h1>

          {/* Subtítulo Aspiracional */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Lotes campestres desde 500 m² hasta 1,000 m² con servicios de luz y agua, títulos independizados en SUNARP y financiamiento directo sin intereses.
          </p>

          {/* Buscador Estilo Airbnb */}
          <div className="pt-4">
            <AirbnbSearchBar
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCurrency={currency}
              onToggleCurrency={toggleCurrency}
              maxBudget={maxBudget}
              onChangeMaxBudget={setMaxBudget}
              onSearch={() => handleScrollTo('catalogo')}
              availableZones={availableZones}
            />
          </div>
        </div>
      </section>

      {/* 3. Pestañas de Categoría & Filtros Táctiles */}
      <section id="catalogo" className="pt-6 pb-4">
        <CategoryTabs
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          activeFeature={selectedFeature}
          onSelectFeature={setSelectedFeature}
        />
      </section>

      {/* 4. Grilla de Propiedades & Lotes */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedCategory === 'proyectos' ? 'Proyectos y Desarrollos Campestres' :
               selectedCategory === 'independientes' ? 'Propiedades y Casas Independientes' :
               'Catálogo Exclusivo Disponible'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'inmueble disponible' : 'inmuebles disponibles'} con entrega inmediata
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
              className="text-xs font-bold text-[#004aad] dark:text-blue-400 hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Compass className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No encontramos propiedades con esos filtros</h3>
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
              className="px-4 py-2 bg-[#004aad] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Ver Todas las Propiedades
            </button>
          </div>
        )}
      </section>

      {/* 5. Simulador Interactivo de Financiamiento */}
      <div id="simulador">
        <FinanceSimulator
          currency={currency}
          onSendSimulation={(msg) => handleOpenWhatsApp(undefined, msg)}
        />
      </div>

      {/* 6. Seguridad Jurídica y SUNARP */}
      <LegalSecuritySection />

      {/* 7. Módulo Dual de Contacto & Captación */}
      <DualContactSection
        currency={currency}
        onSendMessage={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 8. Modal de Detalle Inmersivo */}
      <PropertyDetailModal
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        currency={currency}
        onWhatsAppClick={(p, msg) => handleOpenWhatsApp(p, msg)}
      />

      {/* 9. Barra Inferior Fija para Celulares (Mobile App Feel) */}
      <MobileBottomNav
        onScrollTo={handleScrollTo}
        onWhatsAppClick={() => handleOpenWhatsApp()}
      />

      {/* 10. Footer Legal */}
      <LandingFooter />
    </div>
  );
};
