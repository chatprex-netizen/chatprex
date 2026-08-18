import React from 'react';
import { Sparkles, Trees, Building2, Home, Landmark, CheckCircle2, ShieldCheck, Waves } from 'lucide-react';

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
    { id: 'proyectos', label: 'Proyectos y Preventas', icon: Trees, count: 'Destacado' },
    { id: 'independientes', label: 'Propiedades Independientes', icon: Building2 },
  ];

  const quickFilterPills = [
    { id: '', label: '✨ Ver Todos', icon: null },
    { id: 'terreno', label: '🏔️ Lotes de Campo', icon: Trees },
    { id: 'frente a parque', label: '🌳 Frente a Parque', icon: Trees },
    { id: 'esquina', label: '📐 En Esquina', icon: Landmark },
    { id: 'sunarp', label: '📜 Con Título Sunarp', icon: ShieldCheck },
    { id: 'servicios', label: '💡 Agua y Luz', icon: CheckCircle2 },
    { id: 'casa', label: '🏡 Casas de Campo', icon: Home },
    { id: 'piscina', label: '🏊 Con Piscina / Club', icon: Waves },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-4">
      {/* Pestañas Principales Estilo Airbnb */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
        {mainCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as any)}
              className={`relative px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/15 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400 dark:text-[#004aad]' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              {cat.count && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-500/30 text-blue-200 dark:text-blue-700' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                }`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Píldoras Rápidas de Características Táctiles */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar justify-start md:justify-center">
        {quickFilterPills.map((pill) => {
          const isSelected = (pill.id === '' && !activeFeature) || (pill.id !== '' && activeFeature.toLowerCase().includes(pill.id));
          return (
            <button
              key={pill.id}
              onClick={() => onSelectFeature(pill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#004aad] text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
