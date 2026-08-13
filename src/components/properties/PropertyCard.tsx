import React, { useState } from 'react';
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MapPin, 
  Edit3, 
  Trash2, 
  MessageCircle
} from 'lucide-react';
import { Property } from '../../types';
import { Badge } from '../common/Badge';
import { useCRM } from '../../context/CRMContext';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEdit,
}) => {
  const { deleteProperty, agents, conversations, sendMessage, setActiveConversationId } = useCRM();
  const [showShareToast, setShowShareToast] = useState(false);

  const agent = agents.find((a) => a.id === property.agentId);

  const handleShareToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length > 0) {
      sendMessage(
        conversations[0].id,
        `Hola! Te comparto la ficha técnica de esta propiedad: ${property.title} - $${property.price.toLocaleString()} ${property.currency}`,
        property
      );
      setActiveConversationId(conversations[0].id);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-150 overflow-hidden flex flex-col"
    >
      {/* Image Thumbnail & Badges */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-950/40" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <Badge variant={property.status} size="sm">
            {property.status.replace('_', ' ')}
          </Badge>

          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize bg-black/60 text-white backdrop-blur-xs border border-white/20">
            {property.operation}
          </span>
        </div>

        {/* Price & Code on Image Bottom */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
          <div>
            <span className="text-[10px] font-normal text-slate-200 block">
              {property.code}
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              ${property.price.toLocaleString()} <span className="text-xs font-normal text-slate-200">{property.currency}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
            <MapPin className="w-3 h-3 text-[#004aad] shrink-0" />
            <span className="truncate">{property.zone}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#004aad] transition-colors">
            {property.title}
          </h3>

          {/* Key Metrics Icons */}
          <div className="grid grid-cols-4 gap-1.5 py-2 my-1.5 border-y border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
            <div className="flex items-center gap-1">
              <Bed className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{property.bedrooms}</span>
              <span className="text-[10px] text-slate-400">rec</span>
            </div>

            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{property.bathrooms}</span>
              <span className="text-[10px] text-slate-400">bañ</span>
            </div>

            <div className="flex items-center gap-1">
              <Car className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{property.parkingSpots}</span>
              <span className="text-[10px] text-slate-400">est</span>
            </div>

            <div className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{property.areaTotal}</span>
              <span className="text-[10px] text-slate-400">m²</span>
            </div>
          </div>
        </div>

        {/* Footer Agent & Actions */}
        <div className="pt-1.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {agent && (
              <>
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="w-5 h-5 rounded-full object-cover" 
                />
                <span className="text-[11px] text-slate-400 truncate max-w-[90px]">
                  {agent.name.split(' ')[0]}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleShareToWhatsApp}
              title="Compartir por chat/WhatsApp"
              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEdit(property)}
              title="Editar propiedad"
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (window.confirm(`¿Eliminar la propiedad ${property.code}?`)) {
                  deleteProperty(property.id);
                }
              }}
              title="Eliminar propiedad"
              className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showShareToast && (
        <div className="absolute bottom-2 left-2 right-2 bg-emerald-700 text-white text-xs font-medium py-1.5 px-2.5 rounded-lg text-center shadow-md animate-fade-in z-20">
          ✓ Ficha enviada al chat de WhatsApp
        </div>
      )}
    </div>
  );
};
