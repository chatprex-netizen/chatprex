import React from 'react';
import { Property } from '../../types';
import { MapPin, Maximize2, Building2, Trees, MessageCircle, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  currency: 'S/' | 'USD';
  onSelect: (property: Property) => void;
  onWhatsAppClick: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  onSelect,
  onWhatsAppClick,
}) => {
  if (!property) return null;

  const rawPrice = Number(property.price) || 0;
  const propCurrency = property.currency || 'S/';

  const displayPrice = (() => {
    if (propCurrency === currency) {
      return `${currency} ${rawPrice.toLocaleString('en-US')}`;
    }
    if (currency === 'USD' && propCurrency === 'S/') {
      const converted = Math.round(rawPrice / 3.75);
      return `USD $${converted.toLocaleString('en-US')}`;
    }
    if (currency === 'S/' && propCurrency === 'USD') {
      const converted = Math.round(rawPrice * 3.75);
      return `S/ ${converted.toLocaleString('en-US')}`;
    }
    return `${currency} ${rawPrice.toLocaleString('en-US')}`;
  })();

  const monthlyEstimate = (() => {
    const saldo = rawPrice * 0.70;
    const cuota = Math.round(saldo / 36);
    return `${property.currency || currency} ${cuota.toLocaleString('en-US')}`;
  })();

  const pType = (property.type || '').toLowerCase();
  const pOp = (property.operation || '').toLowerCase();
  const pProj = (property.projectName || '').trim();
  const isProject = pType === 'proyecto_preventa' || pOp === 'preventa' || pProj.length > 0;
  
  const images = Array.isArray(property.images) ? property.images : [];
  const mainImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white dark:bg-[#151821] rounded-2xl border border-[#E5E7EB] dark:border-white/[0.08] hover:dark:border-[#38BDF8]/40 shadow-sm hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-200 flex flex-col overflow-hidden font-sans">
      
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges superiores sutiles */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-white/95 dark:bg-[#0B0C10]/90 text-[#202020] dark:text-white shadow-sm flex items-center gap-1 backdrop-blur-md border border-black/5 dark:border-white/10">
            {isProject ? <Trees className="w-3 h-3 text-[#1154FF] dark:text-[#38BDF8]" /> : <Building2 className="w-3 h-3 text-[#1154FF] dark:text-[#38BDF8]" />}
            <span className="truncate max-w-[120px]">{isProject ? (property.projectName || 'Proyecto') : 'Propiedad'}</span>
          </span>

          {property.featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1154FF] text-white shadow-sm">
              Destacado
            </span>
          )}
        </div>

        {/* Ubicación Inferior en la Imagen */}
        <div className="absolute bottom-2 left-2.5 right-2.5 text-white pointer-events-none">
          <div className="flex items-center gap-1 text-[12px] font-medium text-slate-100 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{property.zone ? `${property.zone}, ${property.city}` : property.city}</span>
          </div>
        </div>
      </div>

      {/* Contenido de la Ficha */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Título */}
          <h3 
            onClick={() => onSelect(property)}
            className="font-manrope font-bold text-[13px] sm:text-[15px] text-[#202020] dark:text-white group-hover:text-[#1154FF] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-1 cursor-pointer leading-snug"
          >
            {property.projectName ? `${property.projectName} - ${property.title}` : property.title}
          </h3>

          <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 mt-1">
            {property.areaTotal > 0 && (
              <span className="flex items-center gap-0.5 font-medium text-[#202020] dark:text-slate-200">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                {property.areaTotal} m²
              </span>
            )}
            {property.bedrooms && property.bedrooms > 0 && (
              <span className="font-medium text-[#202020] dark:text-slate-200">
                {property.bedrooms} hab.
              </span>
            )}
            {/* Badge SUNARP condicional */}
            {(Array.isArray(property.features) && property.features.some(f => (f || '').toLowerCase().includes('sunarp') || (f || '').toLowerCase().includes('título') || (f || '').toLowerCase().includes('registrado'))) && (
              <span className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-3 h-3" />
                SUNARP
              </span>
            )}
          </div>
        </div>

        {/* Bloque de Precio y Financiación */}
        <div className="pt-2 sm:pt-2.5 border-t border-[#F1F3F5] dark:border-white/[0.08] space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Precio</span>
              <span className="font-manrope font-extrabold text-[14px] sm:text-[17px] text-[#202020] dark:text-white leading-none">
                {displayPrice}
              </span>
            </div>

            {isProject && (
              <div className="text-right hidden sm:block">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block">Cuotas directas</span>
                <span className="font-manrope font-bold text-[11px] text-[#1154FF] dark:text-[#38BDF8]">
                  {monthlyEstimate}/m
                </span>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSelect(property)}
              className="py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] hover:bg-[#F7F8FA] dark:bg-[#1E2230]/70 dark:hover:bg-[#1E2230] text-[#202020] dark:text-slate-200 font-semibold text-[11px] sm:text-[12px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Detalles</span>
            </button>

            <button
              onClick={() => onWhatsAppClick(property)}
              className="py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[11px] sm:text-[12px] flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer transform active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-[#1154FF]" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
