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

  const budgetOptions = selectedCurrency === 'S/' 
    ? [100000, 150000, 200000, 300000, 500000]
    : [30000, 50000, 80000, 120000, 200000];

  return (
    <div className="relative w-full max-w-4xl mx-auto z-30 font-sans">
      {/* Contenedor Cápsula Minimalista Translúcido Premium */}
      <div className="bg-white/90 dark:bg-[#151821]/90 backdrop-blur-2xl rounded-2xl md:rounded-full border border-white/60 dark:border-white/[0.12] shadow-2xl p-1.5 md:p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1 transition-all">
        
        {/* 1. Ubicación */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('zone')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-3 ${
              activeDropdown === 'zone' ? 'bg-black/5 dark:bg-white/[0.06]' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F3F5] dark:bg-[#1E2230] flex items-center justify-center text-[#1154FF] dark:text-[#38BDF8] shrink-0 shadow-sm">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ubicación</div>
              <div className="text-[14px] font-manrope font-bold text-[#202020] dark:text-white truncate">
                {selectedZone || 'Todas las zonas'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Zonas */}
          {activeDropdown === 'zone' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white/98 dark:bg-[#151821]/98 backdrop-blur-2xl rounded-2xl border border-[#E5E7EB] dark:border-white/[0.12] shadow-2xl p-2.5 space-y-1 animate-fade-in z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">Selecciona una zona</div>
              <button
                type="button"
                onClick={() => { onSelectZone(''); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-between transition-colors ${
                  !selectedZone ? 'bg-[#1154FF] text-white' : 'text-[#202020] dark:text-slate-200 hover:bg-[#F7F8FA] dark:hover:bg-white/[0.08]'
                }`}
              >
                <span>Todas las zonas</span>
                {!selectedZone && <span className="text-[11px]">✓</span>}
              </button>

              {availableZones.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { onSelectZone(z); closeDropdown(); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-between transition-colors ${
                    selectedZone === z ? 'bg-[#1154FF] text-white' : 'text-[#202020] dark:text-slate-200 hover:bg-[#F7F8FA] dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{z}</span>
                  {selectedZone === z && <span className="text-[11px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-7 bg-[#E5E7EB] dark:bg-white/[0.1]" />

        {/* 2. Categoría / Tipo */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('type')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-3 ${
              activeDropdown === 'type' ? 'bg-black/5 dark:bg-white/[0.06]' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F3F5] dark:bg-[#1E2230] flex items-center justify-center text-[#1154FF] dark:text-[#38BDF8] shrink-0 shadow-sm">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo</div>
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
            <div className="absolute top-full left-0 mt-2 w-72 bg-white/98 dark:bg-[#151821]/98 backdrop-blur-2xl rounded-2xl border border-[#E5E7EB] dark:border-white/[0.12] shadow-2xl p-2.5 space-y-1 animate-fade-in z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">Categoría</div>
              <button
                type="button"
                onClick={() => { onSelectCategory('all'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  selectedCategory === 'all' ? 'bg-[#1154FF] text-white' : 'hover:bg-[#F7F8FA] dark:hover:bg-white/[0.08] text-[#202020] dark:text-slate-200'
                }`}
              >
                Ver Todo el Catálogo
              </button>
              <button
                type="button"
                onClick={() => { onSelectCategory('proyectos'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  selectedCategory === 'proyectos' ? 'bg-[#1154FF] text-white' : 'hover:bg-[#F7F8FA] dark:hover:bg-white/[0.08] text-[#202020] dark:text-slate-200'
                }`}
              >
                Proyectos & Preventas (Lotes / Casas)
              </button>
              <button
                type="button"
                onClick={() => { onSelectCategory('independientes'); closeDropdown(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  selectedCategory === 'independientes' ? 'bg-[#1154FF] text-white' : 'hover:bg-[#F7F8FA] dark:hover:bg-white/[0.08] text-[#202020] dark:text-slate-200'
                }`}
              >
                Propiedades Independientes
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-7 bg-[#E5E7EB] dark:bg-white/[0.1]" />

        {/* 3. Presupuesto */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggleDropdown('price')}
            className={`w-full text-left px-4 py-2.5 rounded-xl md:rounded-full hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-3 ${
              activeDropdown === 'price' ? 'bg-black/5 dark:bg-white/[0.06]' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F3F5] dark:bg-[#1E2230] flex items-center justify-center text-[#1154FF] dark:text-[#38BDF8] shrink-0 shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Presupuesto</div>
              <div className="text-[14px] font-manrope font-bold text-[#202020] dark:text-white truncate">
                {maxBudget > 0 ? `Hasta ${selectedCurrency} ${maxBudget.toLocaleString('en-US')}` : 'Cualquier precio'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Dropdown: Presupuesto */}
          {activeDropdown === 'price' && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white/98 dark:bg-[#151821]/98 backdrop-blur-2xl rounded-2xl border border-[#E5E7EB] dark:border-white/[0.12] shadow-2xl p-4 space-y-3 animate-fade-in z-50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Presupuesto Máximo</span>
                <button
                  type="button"
                  onClick={onToggleCurrency}
                  className="text-xs font-bold text-[#1154FF] dark:text-[#38BDF8] hover:underline cursor-pointer"
                >
                  Cambiar a {selectedCurrency === 'S/' ? 'USD $' : 'Soles S/'}
                </button>
              </div>

              {/* Rango de Presupuesto */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-manrope font-bold text-[#202020] dark:text-white">
                  <span>Cualquiera</span>
                  <span>{selectedCurrency} {maxBudget > 0 ? maxBudget.toLocaleString('en-US') : 'Sin Límite'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedCurrency === 'S/' ? 600000 : 200000}
                  step={selectedCurrency === 'S/' ? 10000 : 5000}
                  value={maxBudget}
                  onChange={(e) => onChangeMaxBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F1F3F5] dark:bg-[#1E2230] rounded-lg appearance-none cursor-pointer accent-[#1154FF] dark:accent-[#38BDF8]"
                />
              </div>

              {/* Botones rápidos de presupuesto */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => { onChangeMaxBudget(0); closeDropdown(); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                    maxBudget === 0 ? 'bg-[#1154FF] text-white' : 'bg-[#F7F8FA] dark:bg-[#1E2230] text-[#202020] dark:text-slate-200 hover:bg-[#F1F3F5]'
                  }`}
                >
                  Todos
                </button>
                {budgetOptions.slice(0, 5).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => { onChangeMaxBudget(amount); closeDropdown(); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      maxBudget === amount ? 'bg-[#1154FF] text-white' : 'bg-[#F7F8FA] dark:bg-[#1E2230] text-[#202020] dark:text-slate-200 hover:bg-[#F1F3F5]'
                    }`}
                  >
                    &lt; {selectedCurrency} {amount / 1000}k
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Botón de Búsqueda */}
        <div className="p-1">
          <button
            type="button"
            onClick={() => { closeDropdown(); onSearch(); }}
            className="w-full md:w-auto px-6 py-3 rounded-xl md:rounded-full bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
