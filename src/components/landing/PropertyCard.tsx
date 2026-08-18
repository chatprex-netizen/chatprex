import React from 'react';
import { Property } from '../../types';
import { MapPin, Maximize2, Sparkles, Trees, Building2, MessageCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';

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
  // Conversión referencial si la propiedad está en otra moneda
  const displayPrice = (() => {
    const rawPrice = property.price || 0;
    const propCurrency = property.currency || 'S/';
    if (propCurrency === currency) {
      return `${currency} ${rawPrice.toLocaleString('en-US')}`;
    }
    // Tipo de cambio estimado S/ 3.75 por USD
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

  // Cálculo de cuota estimada sin intereses (36 cuotas dando 30% inicial)
  const monthlyEstimate = (() => {
    const rawPrice = property.price || 0;
    const saldo = rawPrice * 0.70;
    const cuota = Math.round(saldo / 36);
    return `${property.currency || currency} ${cuota.toLocaleString('en-US')}`;
  })();

  const isProject = property.type === 'proyecto_preventa' || property.operation === 'preventa' || (property.projectName && property.projectName.length > 0);
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm flex items-center gap-1">
            {isProject ? <Trees className="w-3.5 h-3.5 text-emerald-400" /> : <Building2 className="w-3.5 h-3.5 text-blue-400" />}
            <span>{isProject ? (property.projectName || 'Proyecto Campestre') : 'Propiedad Independiente'}</span>
          </span>

          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Destacado</span>
            </span>
          )}
        </div>

        {/* Ubicación & Metraje Inferior en la Imagen */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{property.zone ? `${property.zone}, ${property.city}` : property.city}</span>
          </div>
        </div>
      </div>

      {/* Contenido de la Ficha */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Título & Metraje */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onSelect(property)}
              className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#004aad] dark:group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
            >
              {property.projectName ? `${property.projectName} - ${property.title}` : property.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
            {property.areaTotal > 0 && (
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300 font-semibold">
                <Maximize2 className="w-3 h-3 text-[#004aad]" />
                {property.areaTotal} m² de terreno
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Título SUNARP
            </span>
          </div>

          {/* Características destacadas */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {property.features.slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 dark:bg-blue-950/40 text-[#004aad] dark:text-blue-300 border border-blue-100 dark:border-blue-900/40"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bloque de Precio y Financiación */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Precio Total</span>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {displayPrice}
              </span>
            </div>

            {isProject && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Cuotas directas desde</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {monthlyEstimate}/mes
                </span>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect(property)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ver Detalles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onWhatsAppClick(property)}
              className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
