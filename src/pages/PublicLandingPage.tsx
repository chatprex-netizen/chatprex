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

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-[#202020] dark:text-slate-100 font-sans transition-colors selection:bg-[#1154FF] selection:text-white">
      
      {/* 1. Header Minimalista */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-4 bg-[#F7F8FA] dark:bg-[#141414] border-b border-[#F1F3F5] dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shadow-sm text-xs font-semibold text-[#202020] dark:text-slate-200 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#1154FF]" />
            <span>Terrenos de Campo Exclusivos en Arequipa</span>
          </div>

          {/* Titular Principal H1 (Escala: 34-40px mobile, 48-56px desktop, 800) */}
          <h1 className="font-manrope font-extrabold text-[34px] sm:text-[44px] md:text-[52px] text-[#202020] dark:text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Tu Casa de Campo Soñada a 25 min de la Ciudad
          </h1>

          {/* Subtítulo (Escala: 15-17px desktop, 400/500, line-height 1.55) */}
          <p className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-[1.55] font-normal">
            Lotes campestres desde 500 m² con servicios de luz y agua, títulos independizados en SUNARP y financiamiento directo sin intereses.
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
        </div>
      </section>

      {/* 3. Pestañas de Categoría */}
      <section id="proyectos" className="pt-10 pb-4">
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
            <h2 className="font-manrope font-bold text-[22px] sm:text-[26px] md:text-[32px] text-[#202020] dark:text-white tracking-tight leading-[1.15]">
              {selectedCategory === 'proyectos' ? 'Proyectos & Preventas' :
               selectedCategory === 'independientes' ? 'Propiedades Independientes' :
               'Catálogo Disponible'}
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
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
              className="text-[13px] font-semibold text-[#1154FF] hover:underline cursor-pointer"
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

      {/* 6. Beneficios y Ubicación */}
      <LegalSecuritySection />

      {/* 7. Módulo de Contacto Dual */}
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
