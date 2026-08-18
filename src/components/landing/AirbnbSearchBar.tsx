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
    <div className="relative w-full max-w-4xl mx-auto z-30 font-sans">
      {/* Contenedor Cápsula Minimalista */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl md:rounded-full border border-[#E5E7EB] dark:border-slate-800 shadow-sm p-1.5 md:p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 transition-all">
        
        {/* 1. Ubicación */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('zone')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-[#F7F8FA] dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 ${
              activeDropdown === 'zone' ? 'bg-[#F7F8FA] dark:bg-slate-800/60' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F3F5] dark:bg-slate-800 flex items-center justify-center text-[#1154FF] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ubicación</div>
              <div className="text-[14px] font-manrope font-bold text-[#202020] dark:text-white truncate">
                {selectedZone || 'Todas las zonas'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Zonas */}
          {activeDropdown === 'zone' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-md p-2.5 space-y-1 animate-fade-in z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">Selecciona una zona</div>
              <button
                type="button"
                onClick={() => { onSelectZone(''); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-between transition-colors ${
                  !selectedZone ? 'bg-[#1154FF] text-white' : 'text-[#202020] dark:text-slate-200 hover:bg-[#F7F8FA] dark:hover:bg-slate-800'
                }`}
              >
                <span>Todas las ubicaciones</span>
                {!selectedZone && <span className="text-[11px]">✓</span>}
              </button>
              {(availableZones || []).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { onSelectZone(z); closeDropdown(); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-between transition-colors ${
                    selectedZone === z ? 'bg-[#1154FF] text-white' : 'text-[#202020] dark:text-slate-200 hover:bg-[#F7F8FA] dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{z}</span>
                  {selectedZone === z && <span className="text-[11px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-7 bg-[#E5E7EB] dark:bg-slate-800" />

        {/* 2. Categoría / Tipo */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('type')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-[#F7F8FA] dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 ${
              activeDropdown === 'type' ? 'bg-[#F7F8FA] dark:bg-slate-800/60' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F3F5] dark:bg-slate-800 flex items-center justify-center text-[#1154FF] shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tipo</div>
              <div className="text-[14px] font-manrope font-bold text-[#202020] dark:text-white truncate">
                {selectedCategory === 'all' ? 'Todos los tipos' :
                 selectedCategory === 'proyectos' ? 'Proyectos & Preventas' :
                 'Propiedades Independientes'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Categoría */}
          {activeDropdown === 'type' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-md p-2.5 space-y-1 animate-fade-in z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">Categoría</div>
              <button
                type="button"
                onClick={() => { onSelectCategory('all'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  selectedCategory === 'all' ? 'bg-[#1154FF] text-white' : 'hover:bg-[#F7F8FA] dark:hover:bg-slate-800 text-[#202020] dark:text-slate-200'
                }`}
              >
                Ver Todo el Catálogo
              </button>
              <button
                type="button"
                onClick={() => { onSelectCategory('proyectos'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  selectedCategory === 'proyectos' ? 'bg-[#1154FF] text-white' : 'hover:bg-[#F7F8FA] dark:hover:bg-slate-800 text-[#202020] dark:text-slate-200'
                }`}
              >
                Proyectos & Preventas (Lotes / Casas)
              </button>
              <button
                type="button"
                onClick={() => { onSelectCategory('independientes'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  selectedCategory === 'independientes' ? 'bg-[#1154FF] text-white' : 'hover:bg-[#F7F8FA] dark:hover:bg-slate-800 text-[#202020] dark:text-slate-200'
                }`}
              >
                Propiedades Independientes
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-7 bg-[#E5E7EB] dark:bg-slate-800" />

        {/* 3. Presupuesto */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('price')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-[#F7F8FA] dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 ${
              activeDropdown === 'price' ? 'bg-[#F7F8FA] dark:bg-slate-800/60' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F3F5] dark:bg-slate-800 flex items-center justify-center text-[#1154FF] shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Presupuesto</div>
              <div className="text-[14px] font-manrope font-bold text-[#202020] dark:text-white truncate">
                {maxBudget > 0 ? `Hasta ${selectedCurrency} ${maxBudget.toLocaleString('en-US')}` : 'Cualquier precio'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Presupuesto */}
          {activeDropdown === 'price' && (
            <div className="absolute top-full left-0 md:right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-md p-4 space-y-4 animate-fade-in z-50">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-manrope font-bold text-[#202020] dark:text-white">Rango de Inversión</span>
                <button
                  type="button"
                  onClick={onToggleCurrency}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F1F3F5] dark:bg-slate-800 text-[#1154FF]"
                >
                  {selectedCurrency}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-manrope font-semibold text-slate-500 dark:text-slate-400">
                  <span>{selectedCurrency} 50,000</span>
                  <span className="text-[#1154FF] font-bold">
                    {maxBudget > 0 ? `${selectedCurrency} ${maxBudget.toLocaleString('en-US')}` : 'Sin límite'}
                  </span>
                  <span>{selectedCurrency} 1M+</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={maxBudget || 1000000}
                  onChange={(e) => onChangeMaxBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F1F3F5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1154FF]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { onChangeMaxBudget(0); closeDropdown(); }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-500 hover:bg-[#F7F8FA] dark:hover:bg-slate-800 rounded-xl"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={closeDropdown}
                  className="flex-1 py-2 text-xs font-semibold bg-[#1154FF] hover:bg-[#0c43cc] text-white rounded-xl shadow-sm"
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
            className="w-full md:w-auto px-6 py-2.5 bg-[#1154FF] hover:bg-[#0c43cc] text-white rounded-xl md:rounded-full font-sans font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-98 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown} />
      )}
    </div>
  );
};
