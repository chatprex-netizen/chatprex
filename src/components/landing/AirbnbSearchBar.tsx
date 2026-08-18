import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, ChevronDown } from 'lucide-react';

interface AirbnbSearchBarProps {
  selectedZone: string;
  onSelectZone: (zone: string) => void;
  selectedCategory: 'all' | 'proyectos' | 'independientes';
  onSelectCategory: (cat: 'all' | 'proyectos' | 'independientes') => void;
  selectedCurrency: 'S/' | 'USD';
  onToggleCurrency: () => void;
  maxBudget: number;
  onChangeMaxBudget: (val: number) => void;
  onSearch: () => void;
  availableZones: string[];
}

export const AirbnbSearchBar: React.FC<AirbnbSearchBarProps> = ({
  selectedZone,
  onSelectZone,
  selectedCategory,
  onSelectCategory,
  selectedCurrency,
  onToggleCurrency,
  maxBudget,
  onChangeMaxBudget,
  onSearch,
  availableZones,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'zone' | 'type' | 'price' | null>(null);

  const toggleDropdown = (dropdown: 'zone' | 'type' | 'price') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => setActiveDropdown(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto z-30">
      {/* Search Pill Container */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl md:rounded-full border border-slate-200/90 dark:border-slate-700/80 shadow-2xl p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 transition-all hover:shadow-blue-500/10">
        
        {/* 1. Ubicación / Zona */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('zone')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 ${
              activeDropdown === 'zone' ? 'bg-slate-100 dark:bg-slate-800' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#004aad] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ubicación</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {selectedZone || 'Todas las zonas'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Zonas */}
          {activeDropdown === 'zone' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-1 animate-fade-in z-50">
              <div className="text-[11px] font-bold text-slate-400 px-2 py-1">Selecciona una zona</div>
              <button
                type="button"
                onClick={() => { onSelectZone(''); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  !selectedZone ? 'bg-[#004aad] text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🌍 Todas las ubicaciones</span>
                {!selectedZone && <span className="text-[10px]">✓</span>}
              </button>
              {(availableZones || []).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { onSelectZone(z); closeDropdown(); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    selectedZone === z ? 'bg-[#004aad] text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>📍 {z}</span>
                  {selectedZone === z && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

        {/* 2. Categoría / Tipo */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('type')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 ${
              activeDropdown === 'type' ? 'bg-slate-100 dark:bg-slate-800' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tipo de Inmueble</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {selectedCategory === 'all' ? 'Todos los tipos' :
                 selectedCategory === 'proyectos' ? '🏗️ Proyectos / Preventas' :
                 '🏡 Propiedades Independientes'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Categoría */}
          {activeDropdown === 'type' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-1.5 animate-fade-in z-50">
              <div className="text-[11px] font-bold text-slate-400 px-2 py-1">Categoría de inmueble</div>
              <button
                type="button"
                onClick={() => { onSelectCategory('all'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  selectedCategory === 'all' ? 'bg-[#004aad] text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                ✨ Ver Todo el Catálogo
              </button>
              <button
                type="button"
                onClick={() => { onSelectCategory('proyectos'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  selectedCategory === 'proyectos' ? 'bg-[#004aad] text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                🏗️ Proyectos & Preventas (Lotes / Casas campo)
              </button>
              <button
                type="button"
                onClick={() => { onSelectCategory('independientes'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  selectedCategory === 'independientes' ? 'bg-[#004aad] text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                🏡 Propiedades Independientes (Casas, Dptos)
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

        {/* 3. Presupuesto & Moneda */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('price')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 ${
              activeDropdown === 'price' ? 'bg-slate-100 dark:bg-slate-800' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Presupuesto Máximo</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {maxBudget > 0 ? `Hasta ${selectedCurrency} ${maxBudget.toLocaleString('en-US')}` : 'Cualquier precio'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Presupuesto */}
          {activeDropdown === 'price' && (
            <div className="absolute top-full left-0 md:right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-4 animate-fade-in z-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Filtro de Presupuesto</span>
                <button
                  type="button"
                  onClick={onToggleCurrency}
                  className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-[#004aad] dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  Moneda: {selectedCurrency}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>{selectedCurrency} 50,000</span>
                  <span className="text-[#004aad] font-extrabold">
                    {maxBudget > 0 ? `${selectedCurrency} ${maxBudget.toLocaleString('en-US')}` : 'Sin límite'}
                  </span>
                  <span>{selectedCurrency} 1,000,000+</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={maxBudget || 1000000}
                  onChange={(e) => onChangeMaxBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#004aad]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { onChangeMaxBudget(0); closeDropdown(); }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={closeDropdown}
                  className="flex-1 py-2 text-xs font-bold bg-[#004aad] text-white rounded-xl shadow-md"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Botón de Búsqueda */}
        <div className="p-1">
          <button
            type="button"
            onClick={() => { closeDropdown(); onSearch(); }}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#004aad] to-[#2563eb] hover:from-[#003b8a] hover:to-[#1d4ed8] text-white rounded-xl md:rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Inmuebles</span>
          </button>
        </div>
      </div>

      {/* Backdrop for closing dropdowns */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown} />
      )}
    </div>
  );
};
