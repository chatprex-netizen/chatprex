import React, { useState } from 'react';
import { 
  X, MapPin, MessageCircle, ChevronLeft, ChevronRight, Building2, Trees, ShieldCheck
} from 'lucide-react';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  currency: 'S/' | 'USD';
  onWhatsAppClick: (property: any, customMessage?: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  onClose,
  property,
  currency,
  onWhatsAppClick,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isOpen || !property) return null;

  const images = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'];

  const title = property.name || property.title || 'Desarrollo Inmobiliario';
  const rawPriceMin = Number(property.priceMin !== undefined ? property.priceMin : property.price) || 0;
  const rawPriceMax = Number(property.priceMax) || 0;
  
  // Respetar estrictamente la moneda con la que se ingresó la propiedad (Soles o Dólares)
  const isUSD = (property.currency || '').toUpperCase() === 'USD';
  const currSymbol = isUSD ? 'USD $' : 'S/';

  const formatPrice = (val: number) => {
    return `${currSymbol} ${val.toLocaleString('en-US')}`;
  };

  const pType = (property.type || '').toLowerCase();
  
  // Exclusivo: Solo es Proyecto si está marcado explícitamente como proyecto o tipo proyecto_preventa
  const isProject = property.isProject !== false && (property.isProject === true || pType === 'proyecto_preventa');

  const displayPrice = (() => {
    if (isProject && rawPriceMax > rawPriceMin) {
      return `Desde ${formatPrice(rawPriceMin)} hasta ${formatPrice(rawPriceMax)}`;
    }
    if (isProject && rawPriceMin > 0) {
      return `Desde ${formatPrice(rawPriceMin)}`;
    }
    return formatPrice(rawPriceMin);
  })();

  const rawAreaMin = Number(property.areaMin !== undefined ? property.areaMin : property.areaTotal) || 0;
  const rawAreaMax = Number(property.areaMax) || 0;

  const displayArea = (() => {
    if (isProject && rawAreaMax > rawAreaMin) {
      return `${rawAreaMin} - ${rawAreaMax} m²`;
    }
    if (rawAreaMin > 0) {
      return `${rawAreaMin} m²`;
    }
    return '-';
  })();

  // % de ventas: EXCLUSIVO para proyectos (nunca para propiedades individuales)
  const soldPct = (isProject && property.soldPercentage !== undefined && property.soldPercentage !== null && Number(property.soldPercentage) > 0)
    ? Number(property.soldPercentage)
    : undefined;

  // Estado del Inmueble
  const statusConfig = (() => {
    const s = (property.status || 'disponible').toLowerCase();
    if (s === 'vendida' || s === 'vendido') {
      return { label: 'Vendido', bg: 'bg-rose-500 text-white', dot: 'bg-rose-200' };
    }
    if (s === 'en_negociacion' || s === 'reservada' || s === 'separado' || s === 'separada') {
      return { label: 'Separado', bg: 'bg-amber-500 text-white', dot: 'bg-amber-200' };
    }
    if (s === 'alquilada' || s === 'alquilado') {
      return { label: 'Alquilado', bg: 'bg-indigo-500 text-white', dot: 'bg-indigo-200' };
    }
    return { label: 'Disponible', bg: 'bg-emerald-600 text-white', dot: 'bg-emerald-200' };
  })();

  const handleQuickWhatsApp = () => {
    const msg = `¡Hola CasaYa! Vi en la web el inmueble "${title}" (${displayPrice}). Deseo coordinar una visita y conocer facilidades de pago.`;
    onWhatsAppClick(property, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white dark:bg-[#151821] rounded-t-3xl sm:rounded-3xl border border-[#E5E7EB] dark:border-white/[0.1] shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col transition-colors">
        
        {/* Header Compacto con botón de Cierre */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#151821]/95 backdrop-blur-md border-b border-[#F1F3F5] dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            {/* Estado */}
            <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold ${statusConfig.bg} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              <span>{statusConfig.label}</span>
            </span>

            {/* % Vendido (Solo proyectos) */}
            {isProject && soldPct !== undefined && soldPct > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1">
                <span>🔥</span>
                <span>{Math.round(soldPct)}% vendido</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#1E2333] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Galería Compacta */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={images[activeImageIdx]}
            alt={`Foto ${activeImageIdx + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {images.map((_: any, idx: number) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === activeImageIdx ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contenido con Scroll Compacto */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          
          {/* Título, Proyecto y Precio */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1154FF] dark:text-[#38BDF8]">
              {property.developer || 'Inmobiliaria CasaYa'}
            </span>
            <h2 className="font-manrope font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
              {title}
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{property.address ? `${property.address} • ` : ''}{property.zone ? `${property.zone}, ${property.city}` : property.city || 'Arequipa'}</span>
            </div>
          </div>

          {/* Cuadro de Precio Principal */}
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-white/[0.04] border border-blue-100 dark:border-white/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                {isProject ? 'Precio de Preventa' : 'Precio de Venta'}
              </span>
              <div className="font-manrope font-extrabold text-base sm:text-lg text-[#1154FF] dark:text-[#38BDF8]">
                {displayPrice}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Área</span>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {displayArea}
              </span>
            </div>
          </div>

          {/* Amenidades y Servicios */}
          {Array.isArray(property.features) && property.features.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Amenidades & Atributos
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {property.features.map((feat: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F7F8FA] dark:bg-white/[0.04] text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {property.description && (
            <div className="space-y-1">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Descripción
              </h3>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer con Botón WhatsApp */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#151821] border-t border-[#F1F3F5] dark:border-white/[0.08] flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-[10px] text-slate-400 block">Atención Inmediata</span>
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              {property.contactPhone || '+51 958 716 850'}
            </span>
          </div>

          <button
            onClick={handleQuickWhatsApp}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all transform active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
