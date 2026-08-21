import React from 'react';
import { Property } from '../../types';
import { MapPin, Maximize2, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  currency?: 'S/' | 'USD';
  onSelect: (property: Property) => void;
  onWhatsAppClick: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onWhatsAppClick,
}) => {
  if (!property) return null;

  const rawPriceMin = Number(property.price) || 0;
  const rawPriceMax = Number(property.priceMax) || 0;
  
  // Respetar estrictamente la moneda con la que se ingresó la propiedad (Soles o Dólares)
  const isUSD = (property.currency || '').toUpperCase() === 'USD';
  const currSymbol = isUSD ? 'USD $' : 'S/';

  const formatPrice = (val: number) => {
    return `${currSymbol} ${val.toLocaleString('en-US')}`;
  };

  const pType = (property.type || '').toLowerCase();
  
  // Exclusivo: Solo es Proyecto si está marcado explícitamente como proyecto o tipo proyecto_preventa
  const isProject = Boolean(property.isProject === true || pType === 'proyecto_preventa');

  // Precios: Rangos "Desde... Hasta" solo para proyectos; precio exacto para individuales
  const displayPrice = (() => {
    if (isProject && rawPriceMax > rawPriceMin) {
      return `Desde ${formatPrice(rawPriceMin)} hasta ${formatPrice(rawPriceMax)}`;
    }
    if (isProject && rawPriceMin > 0) {
      return `Desde ${formatPrice(rawPriceMin)}`;
    }
    return formatPrice(rawPriceMin);
  })();

  // Áreas: Rango solo para proyectos; área exacta para individuales
  const displayArea = (() => {
    if (isProject && property.areaMax && property.areaMax > property.areaTotal) {
      return `Desde ${property.areaTotal} m² hasta ${property.areaMax} m²`;
    }
    if (property.areaTotal > 0) {
      return `${property.areaTotal} m²`;
    }
    return '';
  })();

  const monthlyEstimate = (() => {
    const saldo = rawPriceMin * 0.70;
    const cuota = Math.round(saldo / 36);
    return `${currSymbol} ${cuota.toLocaleString('en-US')}`;
  })();

  // % de ventas: EXCLUSIVO para proyectos (nunca para propiedades individuales)
  const soldPct = (isProject && property.soldPercentage !== undefined && property.soldPercentage !== null && Number(property.soldPercentage) > 0)
    ? Number(property.soldPercentage)
    : undefined;

  // Estado del Inmueble (Disponible, Separado, Vendido, etc.)
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

        {/* Badges superiores: Estado a la izquierda; % vendido (solo proyectos) y Destacado a la derecha */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-1.5">
          {/* Estado del Inmueble */}
          <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold ${statusConfig.bg} shadow-sm flex items-center gap-1 backdrop-blur-md`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            <span>{statusConfig.label}</span>
          </span>

          {/* Badges de Ventas (EXCLUSIVO de Proyectos) y Destacado */}
          <div className="flex items-center gap-1">
            {isProject && soldPct !== undefined && soldPct > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1 backdrop-blur-sm">
                <span>🔥</span>
                <span>{Math.round(soldPct)}% vendido</span>
              </span>
            )}
            {property.featured && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1154FF] text-white shadow-sm">
                Destacado
              </span>
            )}
          </div>
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
            {property.projectName && !isProject ? `${property.projectName} - ${property.title}` : property.title}
          </h3>

          {/* Especificaciones y Características */}
          <div className="space-y-1.5 mt-1">
            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 flex-wrap">
              {displayArea && (
                <span className="flex items-center gap-0.5 font-medium text-[#202020] dark:text-slate-200">
                  <Maximize2 className="w-3 h-3 text-slate-400" />
                  {displayArea}
                </span>
              )}
              {property.bedrooms && property.bedrooms > 0 && !isProject && (
                <span className="font-medium text-[#202020] dark:text-slate-200">
                  {property.bedrooms} hab.
                </span>
              )}
            </div>

            {/* Características de la propiedad */}
            {Array.isArray(property.features) && property.features.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {property.features.slice(0, 2).map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-[#F1F3F5] dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 truncate max-w-[120px]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bloque de Precio y Financiación */}
        <div className="pt-2 sm:pt-2.5 border-t border-[#F1F3F5] dark:border-white/[0.08] space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Precio</span>
              <span className="font-manrope font-extrabold text-[13px] sm:text-[15px] text-[#202020] dark:text-white leading-none">
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
