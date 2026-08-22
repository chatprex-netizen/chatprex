import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Project, Property } from '../types';
import { LandingHeader } from '../components/landing/LandingHeader';
import { PropertyCard } from '../components/landing/PropertyCard';
import { PropertyDetailModal } from '../components/landing/PropertyDetailModal';
import { LandingFooter } from '../components/landing/LandingFooter';
import { 
  Search, SlidersHorizontal, ArrowUpDown, Building2, Trees, MapPin, 
  Maximize2, ShieldCheck, Home, ArrowLeft, RefreshCw, Compass
} from 'lucide-react';

export const PublicCatalogPage: React.FC = () => {
  const { projects, properties, portalConfig } = useCRM();

  // Estados de Configuración
  const [currency, setCurrency] = useState<'S/' | 'USD'>('S/');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Estados de Filtros Avanzados
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [selectedZone, setSelectedZone] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'area-desc'>('recent');

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

  // Filtrado y Ordenamiento Avanzado
  const filteredAndSortedProperties = useMemo(() => {
    let result = propertyList.filter((p: any) => {
      if (!p) return false;

      // 1. Búsqueda por Texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = ((p.name || p.title) || '').toLowerCase().includes(query);
        const inDesc = (p.description || '').toLowerCase().includes(query);
        const inDev = (p.developer || '').toLowerCase().includes(query);
        const inZone = (p.zone || '').toLowerCase().includes(query);
        const inCity = (p.city || '').toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inDev && !inZone && !inCity) return false;
      }

      // 2. Tipo de Inmueble
      if (selectedType !== 'all') {
        const pType = (p.type || '').toLowerCase();
        const isProject = p.isProject !== false && (p.isProject === true || pType === 'proyecto_preventa');
        
        if (selectedType === 'proyectos' && !isProject) return false;
        if (selectedType === 'independientes' && isProject) return false;
        if (selectedType === 'terreno' && !pType.includes('terreno') && !pType.includes('lote')) return false;
        if (selectedType === 'casa' && !pType.includes('casa')) return false;
        if (selectedType === 'departamento' && !pType.includes('departamento')) return false;
      }

      // 3. Operación
      if (selectedOperation !== 'all') {
        const pOp = (p.operation || '').toLowerCase();
        if (pOp !== selectedOperation.toLowerCase()) return false;
      }

      // 4. Zona
      if (selectedZone) {
        const zoneLower = selectedZone.toLowerCase();
        const zoneMatch = (p.zone && p.zone.toLowerCase().includes(zoneLower)) ||
                          (p.city && p.city.toLowerCase().includes(zoneLower));
        if (!zoneMatch) return false;
      }

      // 5. Rango de Precios
      const rawPrice = Number(p.priceMin !== undefined ? p.priceMin : p.price) || 0;
      let normPrice = rawPrice;
      if (p.currency === 'USD' && currency === 'S/') normPrice = rawPrice * 3.75;
      if (p.currency === 'S/' && currency === 'USD') normPrice = rawPrice / 3.75;

      if (minPrice > 0 && normPrice < minPrice) return false;
      if (maxPrice > 0 && normPrice > maxPrice) return false;

      return true;
    });

    // Ordenamiento
    return result.sort((a: any, b: any) => {
      const priceA = Number(a.priceMin !== undefined ? a.priceMin : a.price) || 0;
      const priceB = Number(b.priceMin !== undefined ? b.priceMin : b.price) || 0;
      const areaA = Number(a.areaMin !== undefined ? a.areaMin : a.areaTotal) || 0;
      const areaB = Number(b.areaMin !== undefined ? b.areaMin : b.areaTotal) || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'area-desc') return areaB - areaA;

      // recent / featured default
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [propertyList, searchQuery, selectedType, selectedOperation, selectedZone, minPrice, maxPrice, sortBy, currency]);

  const handleOpenWhatsApp = (prop?: any, customMsg?: string) => {
    const phone = portalConfig?.contactInfo?.phone?.replace(/\D/g, '') || '51958716850';
    let msg = customMsg;
    if (!msg) {
      if (prop) {
        const title = prop.name || prop.title;
        msg = `¡Hola CasaYa! Vi en el catálogo el proyecto "${title}" y deseo consultar disponibilidad, planos y financiamiento directo.`;
      } else {
        msg = '¡Hola CasaYa! Deseo atención personalizada sobre el catálogo de proyectos y propiedades.';
      }
    }
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedOperation('all');
    setSelectedZone('');
    setMinPrice(0);
    setMaxPrice(0);
    setSortBy('recent');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0D13] text-[#202020] dark:text-slate-100 font-sans selection:bg-[#1154FF] selection:text-white transition-colors">
      
      {/* 1. Header Global */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={() => handleOpenWhatsApp()}
      />

      {/* 2. Banner Superior Compacto del Catálogo */}
      <div className="pt-24 pb-6 bg-gradient-to-b from-[#1154FF]/10 via-[#1154FF]/5 to-transparent border-b border-[#E5E7EB] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          <div className="flex items-center gap-2">
            <a
              href="#/portal"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1154FF] dark:text-[#38BDF8] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Portada</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                Catálogo Completo de Proyectos e Inmuebles
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Encuentra lotes de campo, casas residenciales y proyectos en preventa en Arequipa.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#151821] border border-[#E5E7EB] dark:border-white/[0.08] shadow-xs text-xs font-bold text-slate-800 dark:text-slate-200">
              <Compass className="w-4 h-4 text-[#1154FF] dark:text-[#38BDF8]" />
              <span>{filteredAndSortedProperties.length} Inmuebles Disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Filtros Rápidos */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#12151E]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-white/[0.08] py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Input de Búsqueda */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, zona, proyecto o características..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF] transition-colors"
              />
            </div>

            {/* Categorías Rápidas */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-[#1154FF] text-white shadow-xs'
                    : 'bg-[#F7F8FA] dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60'
                }`}
              >
                Todos
              </button>

              <button
                onClick={() => setSelectedType('proyectos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === 'proyectos'
                    ? 'bg-[#1154FF] text-white shadow-xs'
                    : 'bg-[#F7F8FA] dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60'
                }`}
              >
                🏗️ Proyectos / Preventa
              </button>

              <button
                onClick={() => setSelectedType('terreno')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === 'terreno'
                    ? 'bg-[#1154FF] text-white shadow-xs'
                    : 'bg-[#F7F8FA] dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60'
                }`}
              >
                🏞️ Lotes de Campo
              </button>

              <button
                onClick={() => setSelectedType('casa')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === 'casa'
                    ? 'bg-[#1154FF] text-white shadow-xs'
                    : 'bg-[#F7F8FA] dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60'
                }`}
              >
                🏠 Casas
              </button>

              <button
                onClick={() => setSelectedType('departamento')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === 'departamento'
                    ? 'bg-[#1154FF] text-white shadow-xs'
                    : 'bg-[#F7F8FA] dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60'
                }`}
              >
                🏢 Departamentos
              </button>
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="recent">Más Destacados</option>
                  <option value="price-asc">Menor Precio</option>
                  <option value="price-desc">Mayor Precio</option>
                  <option value="area-desc">Mayor Área (m²)</option>
                </select>
              </div>

              {(searchQuery || selectedType !== 'all' || selectedZone || minPrice > 0 || maxPrice > 0) && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  title="Restablecer filtros"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Grilla del Catálogo: 4 columnas en desktop y 2 columnas en celular */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {filteredAndSortedProperties.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredAndSortedProperties.map((prop: any) => (
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
              No se encontraron propiedades que coincidan con tu búsqueda.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#1154FF] text-white font-bold text-xs cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </main>

      {/* 5. Footer Oficial */}
      <LandingFooter
        portalConfig={portalConfig}
        onWhatsAppClick={() => handleOpenWhatsApp()}
      />

      {/* Modal de Detalle */}
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
