import React from 'react';
import { Home, Calculator, Building2, MessageCircle, Phone } from 'lucide-react';

interface MobileBottomNavProps {
  onScrollTo: (sectionId: string) => void;
  onWhatsAppClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onScrollTo,
  onWhatsAppClick,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-2xl px-3 py-2">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        
        {/* 1. Explorar */}
        <button
          type="button"
          onClick={() => onScrollTo('catalogo')}
          className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors p-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-bold">Catálogo</span>
        </button>

        {/* 2. Simulador */}
        <button
          type="button"
          onClick={() => onScrollTo('simulador')}
          className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors p-1.5 cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[9px] font-bold">Cuotas</span>
        </button>

        {/* 3. Vender Propiedad */}
        <button
          type="button"
          onClick={() => onScrollTo('contacto')}
          className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors p-1.5 cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[9px] font-bold">Vender</span>
        </button>

        {/* 4. WhatsApp Prominente */}
        <button
          type="button"
          onClick={onWhatsAppClick}
          className="px-3.5 py-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-[11px] flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
