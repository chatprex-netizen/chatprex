import React, { useState } from 'react';
import { Property } from '../../types';
import { 
  X, MapPin, MessageCircle, ChevronLeft, ChevronRight, Building2, Trees, ShieldCheck
} from 'lucide-react';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  currency: 'S/' | 'USD';
  onWhatsAppClick: (property: Property, customMessage?: string) => void;
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

  const rawPriceMin = Number(property.price) || 0;
  const rawPriceMax = Number(property.priceMax) || 0;
  const propCurrency = property.currency || 'S/';

  const formatPrice = (val: number) => {
    if (propCurrency === currency) {
      return `${currency} ${val.toLocaleString('en-US')}`;
    }
    if (currency === 'USD' && propCurrency === 'S/') {
      return `USD $${Math.round(val / 3.75).toLocaleString('en-US')}`;
    }
    if (currency === 'S/' && propCurrency === 'USD') {
      return `S/ ${Math.round(val * 3.75).toLocaleString('en-US')}`;
    }
    return `${currency} ${val.toLocaleString('en-US')}`;
  };

  const pType = (property.type || '').toLowerCase();
  const pOp = (property.operation || '').toLowerCase();
  const pProj = (property.projectName || '').trim();
  const isProject = property.isProject || pType === 'proyecto_preventa' || pOp === 'preventa' || pProj.length > 0;

  const displayPrice = (() => {
    if (isProject && rawPriceMax > rawPriceMin) {
      return `Desde ${formatPrice(rawPriceMin)} hasta ${formatPrice(rawPriceMax)}`;
    }
    if (isProject) {
      return `Desde ${formatPrice(rawPriceMin)}`;
    }
    return formatPrice(rawPriceMin);
  })();

  const displayArea = (() => {
    if (isProject && property.areaMax && property.areaMax > property.areaTotal) {
      return `${property.areaTotal} - ${property.areaMax} m²`;
    }
    if (property.areaTotal > 0) {
      return `${property.areaTotal} m²`;
    }
    return '-';
  })();

  const soldPct = property.soldPercentage !== undefined && property.soldPercentage !== null
    ? property.soldPercentage
    : (isProject ? 60 : undefined);

  const handleQuickWhatsApp = () => {
    const msg = `¡Hola CasaYa! Vi en la web el inmueble "${property.projectName ? `${property.projectName} - ${property.title}` : property.title}" (${displayPrice}). Deseo coordinar una visita y conocer facilidades de pago.`;
    onWhatsAppClick(property, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg sm:max-w-xl bg-white dark:bg-[#151821] rounded-t-3xl sm:rounded-3xl border border-[#E5E7EB] dark:border-white/[0.1] shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col transition-colors">
        
        {/* Header Compacto con botón de Cierre */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#151821]/95 backdrop-blur-md border-b border-[#F1F3F5] dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-[#F1F3F5] dark:bg-[#1E2333] text-[#1154FF] dark:text-[#38BDF8] flex items-center gap-1">
              {isProject ? <Trees className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
              <span>{isProject ? (property.projectName || 'Proyecto') : 'Propiedad'}</span>
            </span>

            {soldPct !== undefined && soldPct > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                🔥 {soldPct}% vendido
              </span>
            )}

            <span className="text-[11px] font-medium text-slate-400 font-mono">
              {property.code || 'INM-001'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-7 h-7 rounded-full bg-[#F7F8FA] dark:bg-[#1E2333] hover:bg-[#F1F3F5] dark:hover:bg-[#252B3E] flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Galería Compacta */}
          <div className="space-y-1.5">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={images[activeImageIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Botones de navegación de imágenes */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/80"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Indicador de fotos */}
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-medium">
                {activeImageIdx + 1} / {images.length}
              </div>
            </div>

            {/* Miniaturas en fila */}
            {images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#1154FF] dark:border-[#38BDF8]' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Título, Ubicación y Precio */}
          <div className="space-y-1.5 border-b border-[#F1F3F5] dark:border-white/[0.08] pb-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1">
                <h2 className="font-manrope font-bold text-[16px] sm:text-[18px] text-[#202020] dark:text-white leading-tight">
                  {property.projectName ? `${property.projectName} - ${property.title}` : property.title}
                </h2>
                <div className="flex items-center gap-1 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{property.zone ? `${property.zone}, ${property.city}` : property.city}</span>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Precio</span>
                <span className="font-manrope font-extrabold text-[16px] sm:text-[19px] text-[#1154FF] dark:text-[#38BDF8] leading-none block">
                  {displayPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Bloque de Especificaciones */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
            <div className="p-2 bg-[#F7F8FA] dark:bg-[#1E2333] rounded-xl border border-[#F1F3F5] dark:border-white/[0.08]">
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Área</span>
              <span className="font-manrope font-bold text-[11.5px] text-[#202020] dark:text-white truncate block">
                {displayArea}
              </span>
            </div>

            <div className="p-2 bg-[#F7F8FA] dark:bg-[#1E2333] rounded-xl border border-[#F1F3F5] dark:border-white/[0.08]">
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Hab.</span>
              <span className="font-manrope font-bold text-[11.5px] text-[#202020] dark:text-white">
                {property.bedrooms ? `${property.bedrooms}` : '-'}
              </span>
            </div>

            <div className="p-2 bg-[#F7F8FA] dark:bg-[#1E2333] rounded-xl border border-[#F1F3F5] dark:border-white/[0.08]">
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Operación</span>
              <span className="font-manrope font-bold text-[11.5px] text-[#202020] dark:text-white capitalize truncate block">
                {property.operation || 'Venta'}
              </span>
            </div>

            <div className="p-2 bg-[#F7F8FA] dark:bg-[#1E2333] rounded-xl border border-[#F1F3F5] dark:border-white/[0.08]">
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Tipo</span>
              <span className="font-manrope font-bold text-[11.5px] text-[#202020] dark:text-white capitalize truncate block">
                {property.type || 'Inmueble'}
              </span>
            </div>
          </div>

          {/* Características */}
          {Array.isArray(property.features) && property.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#202020] dark:text-white">
                Características Destacadas
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {property.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F1F3F5] dark:bg-[#1E2333] text-slate-700 dark:text-slate-200 border border-[#E5E7EB] dark:border-white/[0.06]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {property.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#202020] dark:text-white">
                Descripción
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Banner de Garantía y Título Sunarp */}
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-[#182138] border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5 text-xs text-[#1154FF] dark:text-[#38BDF8]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Inmueble Verificado</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Documentación en regla, independización y facilidades de financiamiento directo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer con CTA directo a WhatsApp */}
        <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-[#151821]/95 border-t border-[#F1F3F5] dark:border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Asesoría Directa</span>
            <span className="text-xs font-bold text-[#202020] dark:text-white">Respuesta Inmediata</span>
          </div>

          <button
            onClick={handleQuickWhatsApp}
            className="py-2.5 px-5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-xs sm:text-[13px] flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
