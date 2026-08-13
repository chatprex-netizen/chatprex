import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Property } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MapPin, 
  CheckCircle2, 
  Coins, 
  MessageSquare
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onOpenEdit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  onClose,
  property,
  onOpenEdit,
}) => {
  const { agents, conversations, sendMessage, setActiveConversationId } = useCRM();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sharedToast, setSharedToast] = useState(false);

  if (!property) return null;

  const agent = agents.find((a) => a.id === property.agentId);
  const calculatedCommission = (property.price * property.commissionPct) / 100;

  const handleShareWhatsApp = () => {
    if (conversations.length > 0) {
      sendMessage(
        conversations[0].id,
        `Hola! Te comparto la ficha técnica de esta propiedad: ${property.title} - $${property.price.toLocaleString()} ${property.currency}`,
        property
      );
      setActiveConversationId(conversations[0].id);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={property.title}
      subtitle={`Ficha Técnica Oficial • ${property.code} • ${property.zone}, ${property.city}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Main Photo & Gallery */}
        <div className="space-y-2">
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={property.images[selectedImageIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant={property.status}>
                {property.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                {property.operation}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-white">
              {selectedImageIndex + 1} / {property.images.length || 1} Fotos
            </div>
          </div>

          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Commission Block */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Precio de Lista
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-100">
              ${property.price.toLocaleString()} <span className="text-sm font-bold">{property.currency}</span>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-200 dark:border-emerald-800/60 pt-2 sm:pt-0 sm:pl-4">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Comisión Agencia ({property.commissionPct}%)
            </span>
            <div className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-emerald-200 flex items-center sm:justify-end gap-1">
              <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ${calculatedCommission.toLocaleString()} {property.currency}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <Bed className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400">Recámaras</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{property.bedrooms}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <Bath className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400">Baños</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{property.bathrooms}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400">Cocheras</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{property.parkingSpots}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <Maximize2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400">Superficie</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{property.areaTotal} m²</div>
            </div>
          </div>
        </div>

        {/* Address & Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Ubicación
          </h4>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {property.address}, {property.zone}, {property.city}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Descripción del Inmueble
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {property.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Amenidades y Características
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {property.features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Agent */}
        {agent && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Asesor Responsable</span>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{agent.name}</div>
                <div className="text-[11px] text-slate-500">{agent.phone} • {agent.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Enviar a Chat / WhatsApp
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenEdit(property);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Editar Ficha
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </div>

        {sharedToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-xl text-center shadow-lg animate-fade-in">
            ✓ Ficha compartida correctamente con el cliente en la bandeja de mensajería
          </div>
        )}
      </div>
    </Modal>
  );
};
