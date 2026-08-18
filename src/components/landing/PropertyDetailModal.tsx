import React, { useState } from 'react';
import { Property } from '../../types';
import { 
  X, MapPin, Maximize2, ShieldCheck, CheckCircle2, 
  MessageCircle, Calendar, Phone, Share2, Sparkles, Building, Trees, ArrowRight, UserCheck
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
  const [visitorName, setVisitorName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  if (!isOpen || !property) return null;

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'];

  const displayPrice = (() => {
    const rawPrice = property.price || 0;
    const propCurrency = property.currency || 'S/';
    if (propCurrency === currency) {
      return `${currency} ${rawPrice.toLocaleString('en-US')}`;
    }
    if (currency === 'USD' && propCurrency === 'S/') {
      return `USD $${Math.round(rawPrice / 3.75).toLocaleString('en-US')}`;
    }
    if (currency === 'S/' && propCurrency === 'USD') {
      return `S/ ${Math.round(rawPrice * 3.75).toLocaleString('en-US')}`;
    }
    return `${currency} ${rawPrice.toLocaleString('en-US')}`;
  })();

  const isProject = property.type === 'proyecto_preventa' || property.operation === 'preventa' || (property.projectName && property.projectName.length > 0);

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = visitorName.trim() || 'Un cliente interesado';
    const dateText = preferredDate ? `para el ${preferredDate}` : 'para este fin de semana';
    const msg = `¡Hola Elvis! Mi nombre es ${name}. Deseo coordinar una visita guiada con movilidad al ${property.projectName || property.title} ${dateText}. ¿Qué horarios tienen disponibles?`;
    onWhatsAppClick(property, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header con botón de cierre */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-[#004aad] dark:text-blue-300">
              {isProject ? '🏗️ Proyecto en Preventa' : '🏡 Propiedad Independiente'}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Cód: {property.code || 'INM-001'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Deslizable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Galería de Fotos */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={images[activeImageIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                {activeImageIdx + 1} / {images.length}
              </div>
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#004aad] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Datos Principales y Precio */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {property.projectName ? `${property.projectName} - ${property.title}` : property.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{property.address || 'Ubicación exclusiva'} • {property.zone ? `${property.zone}, ${property.city}` : property.city}</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Inversión Total</span>
              <span className="text-2xl font-black text-[#004aad] dark:text-blue-300 block">
                {displayPrice}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Financiamiento directo sin intereses
              </span>
            </div>
          </div>

          {/* Especificaciones Rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {property.areaTotal > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">Área Total</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{property.areaTotal} m²</span>
              </div>
            )}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold block">Situación Legal</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">Título SUNARP</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold block">Servicios</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Luz y Agua</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold block">Entrega</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Inmediata</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Descripción del Inmueble</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {property.description || 'Lote campestre de alta plusvalía ubicado en zona privilegiada con sol todo el año, seguridad y comodidades de primer nivel.'}
            </p>
          </div>

          {/* Características y Amenidades */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Amenidades y Beneficios</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Asesor Asignado y Formulario de Visita */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#004aad] text-white flex items-center justify-center font-bold text-sm">
                  EM
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Elvis Meza</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Asesor Senior de Proyectos Campestres</div>
                </div>
              </div>

              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En línea
              </span>
            </div>

            <form onSubmit={handleBookVisit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Tu Nombre completo..."
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad]"
                />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Agendar Visita con Movilidad por WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
