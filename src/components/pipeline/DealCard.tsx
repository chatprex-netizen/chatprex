import React, { useMemo } from 'react';
import { Deal, DealStage } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Building2, 
  Home,
  User, 
  ChevronRight, 
  ChevronLeft,
  Trash2
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { evaluateScoreCriteria, TEMPERATURE_CONFIG } from '../../lib/leadScoring';

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDragStart: (e: React.DragEvent, dealId: string) => void;
}

const STAGE_ORDER: DealStage[] = [
  'nuevo_prospecto',
  'contactado',
  'visita_programada',
  'visita_realizada',
  'negociacion',
  'reserva',
  'ganado',
  'perdido',
];

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onEdit,
  onDragStart,
}) => {
  const { contacts, properties, projects, agents, moveDealStage, deleteDeal } = useCRM();

  const contact = contacts.find((c) => c.id === deal.leadId);
  const agent = agents.find((a) => a.id === deal.agentId);

  // Resolver si es proyecto/preventa o propiedad individual
  const interestInfo = useMemo(() => {
    const targetId = deal.propertyId || contact?.interestedProperty;
    if (!targetId) return null;

    // 1. Buscar en properties
    const prop = properties.find(p => p.id === targetId || (p.projectName && p.projectName.toLowerCase() === targetId.toLowerCase()));
    if (prop) {
      const isProject = prop.type === 'proyecto_preventa' || Boolean(prop.projectName && prop.projectName.trim().length > 0);
      return {
        isProject,
        name: isProject ? (prop.projectName || prop.title) : prop.title,
      };
    }

    // 2. Buscar en projects
    const proj = projects.find(p => p.id === targetId || (p.name && p.name.toLowerCase() === targetId.toLowerCase()));
    if (proj) {
      return {
        isProject: true,
        name: proj.name,
      };
    }

    // 3. Texto directo
    return {
      isProject: true,
      name: targetId,
    };
  }, [deal.propertyId, contact?.interestedProperty, properties, projects]);

  const currentStageIndex = STAGE_ORDER.indexOf(deal.stage);

  const handleMovePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStageIndex > 0) {
      moveDealStage(deal.id, STAGE_ORDER[currentStageIndex - 1]);
    }
  };

  const handleMoveNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStageIndex < STAGE_ORDER.length - 1) {
      moveDealStage(deal.id, STAGE_ORDER[currentStageIndex + 1]);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={() => onEdit(deal)}
      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-150 cursor-grab active:cursor-grabbing group space-y-2"
    >
      {/* Header: Title & Priority & Temperature Score */}
      <div className="flex items-start justify-between gap-1.5">
        <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#004aad] transition-colors">
          {deal.title}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          {contact && (() => {
            const evalData = evaluateScoreCriteria(contact);
            const temp = contact.leadTemperature || evalData.temperature;
            const tempConfig = TEMPERATURE_CONFIG[temp];
            return (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border ${tempConfig.bgLight} ${tempConfig.color} ${tempConfig.border}`} title={`Score: ${evalData.score} pts (${tempConfig.label})`}>
                {tempConfig.emoji} {evalData.score}
              </span>
            );
          })()}
          <Badge variant={deal.priority} size="sm">
            {deal.priority}
          </Badge>
        </div>
      </div>

      {/* Proyecto de Interés o Inmueble */}
      {interestInfo && (
        <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
          {interestInfo.isProject ? (
            <Building2 className="w-3.5 h-3.5 text-[#004aad] shrink-0" />
          ) : (
            <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span className="truncate font-medium" title={interestInfo.name}>
            {interestInfo.name}
          </span>
        </div>
      )}

      {/* Client / Lead */}
      {contact && (
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{contact.name}</span>
        </div>
      )}

      {/* Value & Probability */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-normal block">Valor trato</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {deal.currency || 'USD'} {(parseFloat(deal.value as any) || 0).toLocaleString()}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-normal block">Probabilidad</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {deal.probability}%
          </span>
        </div>
      </div>

      {/* Footer: Agent & Quick Stage Jump */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-hidden">
          {agent && (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-4 h-4 rounded-full object-cover"
              title={agent.name}
            />
          )}
          <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
            {agent?.name.split(' ')[0]}
          </span>
        </div>

        {/* Mobile Stage navigation buttons */}
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          {currentStageIndex > 0 && (
            <button
              onClick={handleMovePrev}
              title="Etapa anterior"
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}

          {currentStageIndex < STAGE_ORDER.length - 1 && (
            <button
              onClick={handleMoveNext}
              title="Avanzar etapa"
              className="p-1 rounded bg-blue-50 dark:bg-blue-950 text-[#004aad] hover:bg-blue-100 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm(`¿Eliminar la oportunidad "${deal.title}"?`)) {
                deleteDeal(deal.id);
              }
            }}
            title="Eliminar oportunidad"
            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
