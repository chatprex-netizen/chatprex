import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Property } from '../types';
import { LandingHeader } from '../components/landing/LandingHeader';
import { PropertyCard } from '../components/landing/PropertyCard';
import { PropertyDetailModal } from '../components/landing/PropertyDetailModal';
import { LandingFooter } from '../components/landing/LandingFooter';
import { 
  Search, SlidersHorizontal, ArrowUpDown, Building2, Trees, MapPin, 
  Maximize2, ShieldCheck, Home, ArrowLeft, RefreshCw, Compass
} from 'lucide-react';

export const PublicCatalogPage: React.FC = () => {
  const { properties } = useCRM();

  // Estados de Configuración
  const [currency, setCurrency] = useState<'S/' | 'USD'>('S/');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Estados de Filtros Avanzados
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [selectedZone, setSelectedZone] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'area-desc'>('recent');

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

  // Filtrado y Ordenamiento Avanzado
  const filteredAndSortedProperties = useMemo(() => {
    let result = propertyList.filter(p => {
      if (!p) return false;

      // 1. Búsqueda por Texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = (p.title || '').toLowerCase().includes(query);
        const inDesc = (p.description || '').toLowerCase().includes(query);
        const inProj = (p.projectName || '').toLowerCase().includes(query);
        const inCode = (p.code || '').toLowerCase().includes(query);
        const inZone = (p.zone || '').toLowerCase().includes(query);
        const inCity = (p.city || '').toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inProj && !inCode && !inZone && !inCity) return false;
      }

      // 2. Tipo de Inmueble
      if (selectedType !== 'all') {
        const pType = (p.type || '').toLowerCase();
        const pOp = (p.operation || '').toLowerCase();
        const isProject = pType === 'proyecto_preventa' || pOp === 'preventa' || Boolean(p.projectName);
        
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
      const rawPrice = Number(p.price) || 0;
      let normalizedPrice = rawPrice;
      if (p.currency === 'USD' && currency === 'S/') normalizedPrice = rawPrice * 3.75;
      if (p.currency === 'S/' && currency === 'USD') normalizedPrice = rawPrice / 3.75;

      if (minPrice > 0 && normalizedPrice < minPrice) return false;
      if (maxPrice > 0 && normalizedPrice > maxPrice) return false;

      // 6. Habitaciones mínimas
      if (minBedrooms > 0 && (Number(p.bedrooms) || 0) < minBedrooms) return false;

      return true;
    });

    // Ordenamiento
    return result.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      const areaA = Number(a.areaTotal) || 0;
      const areaB = Number(b.areaTotal) || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'area-desc') return areaB - areaA;
      return 0; // 'recent'
    });
  }, [
    propertyList, searchQuery, selectedType, selectedOperation, 
    selectedZone, minPrice, maxPrice, minBedrooms, sortBy, currency
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedOperation('all');
    setSelectedZone('');
    setMinPrice(0);
    setMaxPrice(0);
    setMinBedrooms(0);
    setSortBy('recent');
  };

  const handleOpenWhatsApp = (prop?: Property, customMsg?: string) => {
    const phone = '51958716850';
    let msg = customMsg;
    if (!msg) {
      if (prop) {
        msg = `¡Hola CasaYa! Vi en el catálogo el inmueble "${prop.projectName ? `${prop.projectName} - ${prop.title}` : prop.title}" y deseo más información sobre el financiamiento y coordinar una visita.`;
      } else {
        msg = '¡Hola CasaYa! Deseo conocer la disponibilidad actual de inmuebles del catálogo.';
      }
    }
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedType !== 'all',
    selectedOperation !== 'all',
    selectedZone,
    minPrice > 0,
    maxPrice > 0,
    minBedrooms > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen pt-[68px] bg-[#F7F8FA] dark:bg-[#0B0C10] text-[#202020] dark:text-slate-100 font-sans transition-colors selection:bg-[#1154FF] selection:text-white">
      
      {/* 1. Header */}
      <LandingHeader
        currency={currency}
        onToggleCurrency={toggleCurrency}
        onWhatsAppClick={(msg) => handleOpenWhatsApp(undefined, msg)}
      />

      {/* 2. Banner Superior y Breadcrumbs */}
      <div className="bg-white dark:bg-[#12151E] border-b border-[#E5E7EB] dark:border-white/[0.08] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <a href="#/portal" className="hover:text-[#1154FF] dark:hover:text-[#38BDF8] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </a>
            <span>/</span>
            <span className="text-[#202020] dark:text-slate-200">Catálogo Completo</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-[#202020] dark:text-white tracking-tight">
                Catálogo Completo de Propiedades & Proyectos
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explora todo nuestro portafolio disponible con filtros avanzados por ubicación, tipo y presupuesto.
              </p>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  isFilterPanelOpen || activeFiltersCount > 0
                    ? 'bg-[#1154FF] text-white border-[#1154FF]'
                    : 'bg-white dark:bg-[#181C27] text-[#202020] dark:text-slate-200 border-[#E5E7EB] dark:border-white/[0.08] hover:bg-[#F7F8FA]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filtros Avanzados</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#1154FF] text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Selector de Orden */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#181C27] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-200 outline-none focus:border-[#1154FF] cursor-pointer"
                >
                  <option value="recent">Más Recientes</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="area-desc">Mayor Área (m²)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Panel de Filtros Avanzados Desplegable */}
      {isFilterPanelOpen && (
        <div className="bg-white dark:bg-[#151821] border-b border-[#E5E7EB] dark:border-white/[0.08] py-5 px-4 sm:px-6 animate-fade-in shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Fila 1: Búsqueda por texto, tipo, operación y zona */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Buscador */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Palabra Clave o Nombre
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej. Hacienda, Casa, Lote..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-100 outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Tipo de Inmueble
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-100 outline-none focus:border-[#1154FF]"
                >
                  <option value="all">Todos los Tipos</option>
                  <option value="proyectos">Proyectos & Preventas</option>
                  <option value="independientes">Propiedades Independientes</option>
                  <option value="terreno">Lotes y Terrenos</option>
                  <option value="casa">Casas</option>
                  <option value="departamento">Departamentos</option>
                </select>
              </div>

              {/* Operación */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Operación
                </label>
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-100 outline-none focus:border-[#1154FF]"
                >
                  <option value="all">Todas las Operaciones</option>
                  <option value="venta">Venta</option>
                  <option value="preventa">Preventa</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              {/* Zona */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Ubicación / Zona
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-100 outline-none focus:border-[#1154FF]"
                >
                  <option value="">Todas las Zonas</option>
                  {availableZones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fila 2: Presupuesto y Habitaciones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F1F3F5] dark:border-white/[0.06] items-end">
              
              {/* Presupuesto Máximo */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Presupuesto Máx. ({currency})
                </label>
                <input
                  type="number"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Ej. 200000"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-100 outline-none focus:border-[#1154FF]"
                />
              </div>

              {/* Habitaciones */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Habitaciones
                </label>
                <select
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#202020] dark:text-slate-100 outline-none focus:border-[#1154FF]"
                >
                  <option value={0}>Cualquiera</option>
                  <option value={1}>1+ Habitación</option>
                  <option value={2}>2+ Habitaciones</option>
                  <option value={3}>3+ Habitaciones</option>
                  <option value={4}>4+ Habitaciones</option>
                </select>
              </div>

              {/* Botón Limpiar Filtros */}
              <div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="w-full py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Limpiar Todos los Filtros</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Grilla Principal del Catálogo Completo */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        
        {/* Barra de Conteo de Resultados */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-manrope font-bold text-lg sm:text-xl text-[#202020] dark:text-white">
              {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'Inmueble Encontrado' : 'Inmuebles Encontrados'}
            </span>
            <span className="text-xs text-slate-400 block sm:inline-block sm:ml-2">
              (Total en inventario: {propertyList.length})
            </span>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#1154FF] dark:text-[#38BDF8] hover:underline cursor-pointer"
            >
              Restablecer ({activeFiltersCount} filtros activos)
            </button>
          )}
        </div>

        {/* Grilla 4 cols PC, 2 cols Móvil */}
        {filteredAndSortedProperties.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredAndSortedProperties.map((prop) => (
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
          <div className="text-center py-20 bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] p-8 space-y-4 shadow-sm max-w-lg mx-auto">
            <Compass className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-manrope font-bold text-base text-[#202020] dark:text-white">
              No hay inmuebles que coincidan con estos filtros
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Intenta ampliando el rango de precio o eliminando algunos filtros aplicados.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#1154FF] hover:bg-[#0c43cc] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 cursor-pointer transition-all"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        )}
      </main>

      {/* 5. Modal de Detalle */}
      <PropertyDetailModal
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        currency={currency}
        onWhatsAppClick={(p, msg) => handleOpenWhatsApp(p, msg)}
      />

      {/* 6. Footer */}
      <LandingFooter />
    </div>
  );
};
