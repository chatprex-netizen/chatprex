import React from 'react';
import { Trees, Building2, Sparkles, Landmark, ShieldCheck, CheckCircle2, Home, Waves } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: 'all' | 'proyectos' | 'independientes';
  onSelectCategory: (cat: 'all' | 'proyectos' | 'independientes') => void;
  activeFeature: string;
  onSelectFeature: (feat: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  activeFeature,
  onSelectFeature,
}) => {
  const mainCategories = [
    { id: 'all', label: 'Todos los Inmuebles', icon: Sparkles },
    { id: 'proyectos', label: 'Proyectos & Preventas', icon: Trees },
    { id: 'independientes', label: 'Propiedades Independientes', icon: Building2 },
  ];

  const quickFilterPills = [
    { id: '', label: 'Todos' },
    { id: 'terreno', label: 'Lotes de Campo' },
    { id: 'frente a parque', label: 'Frente a Parque' },
    { id: 'esquina', label: 'En Esquina' },
    { id: 'sunarp', label: 'Título SUNARP' },
    { id: 'servicios', label: 'Agua y Luz' },
    { id: 'casa', label: 'Casas de Campo' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-4 font-sans">
      {/* Pestañas Principales */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {mainCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[14px] font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#202020] dark:bg-white text-white dark:text-[#202020] shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-[#202020]/70 dark:text-slate-400 border border-[#E5E7EB] dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#1154FF] dark:text-[#1154FF]' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Píldoras de Filtros Rápidos */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar justify-start md:justify-center">
        {quickFilterPills.map((pill) => {
          const isSelected = (pill.id === '' && !activeFeature) || (pill.id !== '' && activeFeature.toLowerCase().includes(pill.id));
          return (
            <button
              key={pill.id}
              onClick={() => onSelectFeature(pill.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1154FF] text-white'
                  : 'bg-[#F1F3F5] dark:bg-slate-800/80 text-[#202020]/80 dark:text-slate-300 hover:bg-[#E5E7EB] dark:hover:bg-slate-700'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
