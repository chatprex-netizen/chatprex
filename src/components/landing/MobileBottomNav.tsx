import React from 'react';
import { Home, Calculator, Building2, MessageCircle } from 'lucide-react';

interface MobileBottomNavProps {
  onScrollTo: (sectionId: string) => void;
  onWhatsAppClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onScrollTo,
  onWhatsAppClick,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0C10]/95 backdrop-blur-xl border-t border-[#F1F3F5] dark:border-white/[0.08] shadow-lg px-3 py-2 font-sans transition-colors">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        
        {/* 1. Explorar */}
        <button
          type="button"
          onClick={() => onScrollTo('proyectos')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1154FF] dark:text-slate-400 dark:hover:text-[#38BDF8] transition-colors p-1 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-medium">Proyectos</span>
        </button>

        {/* 2. Simulador */}
        <button
          type="button"
          onClick={() => onScrollTo('financiamiento')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1154FF] dark:text-slate-400 dark:hover:text-[#38BDF8] transition-colors p-1 cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px] font-medium">Cuotas</span>
        </button>

        {/* 3. Vender */}
        <button
          type="button"
          onClick={() => onScrollTo('contacto')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1154FF] dark:text-slate-400 dark:hover:text-[#38BDF8] transition-colors p-1 cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[10px] font-medium">Vender</span>
        </button>

        {/* 4. CTA Disponibilidad / WhatsApp */}
        <button
          type="button"
          onClick={onWhatsAppClick}
          className="px-4 py-2 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[12px] flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-transform active:scale-98 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
          <span>Disponibilidad</span>
        </button>
      </div>
    </div>
  );
};
