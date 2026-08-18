import React, { useState } from 'react';
import { Property } from '../../types';
import { 
  X, MapPin, Maximize2, ShieldCheck, CheckCircle2, 
  MessageCircle, Calendar, Phone, Share2, Sparkles, Building, Trees, ArrowRight
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

  const images = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'];

  const rawPrice = Number(property.price) || 0;
  const propCurrency = property.currency || 'S/';

  const displayPrice = (() => {
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

  const pType = (property.type || '').toLowerCase();
  const pOp = (property.operation || '').toLowerCase();
  const pProj = (property.projectName || '').trim();
  const isProject = pType === 'proyecto_preventa' || pOp === 'preventa' || pProj.length > 0;

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = visitorName.trim() || 'Un cliente interesado';
    const dateText = preferredDate ? `para el ${preferredDate}` : 'para este fin de semana';
    const msg = `¡Hola Elvis! Mi nombre es ${name}. Deseo coordinar una visita guiada con movilidad al ${property.projectName || property.title} ${dateText}. ¿Qué horarios tienen disponibles?`;
    onWhatsAppClick(property, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#181818] rounded-3xl border border-[#E5E7EB] dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md border-b border-[#F1F3F5] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F1F3F5] dark:bg-slate-800 text-[#1154FF]">
              {isProject ? 'Proyecto en Preventa' : 'Propiedad'}
            </span>
            <span className="text-xs font-medium text-slate-400 font-mono">
              {property.code || 'INM-001'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F8FA] dark:bg-slate-800 hover:bg-[#F1F3F5] dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Galería */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={images[activeImageIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-medium">
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
                      activeImageIdx === idx ? 'border-[#1154FF]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Datos y Precio */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#F1F3F5] dark:border-slate-800 pb-5">
            <div>
              <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#202020] dark:text-white leading-tight">
                {property.projectName ? `${property.projectName} - ${property.title}` : property.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{property.address || 'Ubicación exclusiva'} • {property.zone ? `${property.zone}, ${property.city}` : property.city}</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0 bg-[#F7F8FA] dark:bg-slate-800 p-3.5 rounded-2xl border border-[#E5E7EB] dark:border-slate-700">
              <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block">Inversión Total</span>
              <span className="font-manrope font-extrabold text-2xl text-[#1154FF] block">
                {displayPrice}
              </span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Financiamiento directo sin intereses
              </span>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {property.areaTotal > 0 && (
              <div className="p-3 bg-[#F7F8FA] dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Área</span>
                <span className="font-manrope font-bold text-sm text-[#202020] dark:text-white">{property.areaTotal} m²</span>
              </div>
            )}
            <div className="p-3 bg-[#F7F8FA] dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tipo</span>
              <span className="font-manrope font-bold text-sm text-[#202020] dark:text-white capitalize">
                {property.type ? property.type.replace('_', ' ') : 'Inmueble'}
              </span>
            </div>
            <div className="p-3 bg-[#F7F8FA] dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Operación</span>
              <span className="font-manrope font-bold text-sm text-[#202020] dark:text-white capitalize">
                {property.operation || 'Venta'}
              </span>
            </div>
            <div className="p-3 bg-[#F7F8FA] dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Estado</span>
              <span className="font-manrope font-bold text-sm text-emerald-600 dark:text-emerald-400 capitalize">
                {property.status ? property.status.replace('_', ' ') : 'Disponible'}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h4 className="font-manrope font-bold text-xs uppercase tracking-wider text-slate-400">Descripción</h4>
            <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {property.description || 'Lote campestre de alta plusvalía ubicado en zona privilegiada con sol todo el año y seguridad permanente.'}
            </p>
          </div>

          {/* Formulario de Visita */}
          <div className="p-5 rounded-2xl bg-[#F7F8FA] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1154FF] text-white flex items-center justify-center font-manrope font-bold text-xs">
                  EM
                </div>
                <div>
                  <div className="font-manrope font-bold text-xs text-[#202020] dark:text-white">Elvis Meza</div>
                  <div className="text-[11px] text-slate-400">Asesor Comercial</div>
                </div>
              </div>

              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
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
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 outline-none focus:border-[#1154FF]"
                />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 outline-none focus:border-[#1154FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
                <span>Agendar Visita Guiada por WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
