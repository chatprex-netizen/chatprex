import React, { useMemo } from 'react';
import { Deal, DealStage } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Building2, 
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

  // Limpiar título para mostrar SOLO el nombre del lead
  const leadName = useMemo(() => {
    if (contact?.name && contact.name.trim()) return contact.name.trim();
    if (deal.title) {
      return deal.title
        .replace(/^Negociaci[oó]n con\s+/i, '')
        .replace(/^Inter[eé]s en\s+/i, '')
        .trim();
    }
    return 'Prospecto';
  }, [contact?.name, deal.title]);

  // Resolver EXCLUSIVAMENTE el Proyecto de Interés
  const projectName = useMemo(() => {
    const targetId = deal.propertyId || contact?.interestedProperty;
    if (!targetId) return null;

    // 1. Buscar en projects (prioridad absoluta)
    const proj = projects.find(p => 
      p.id === targetId || 
      (p.name && p.name.toLowerCase() === targetId.toLowerCase())
    );
    if (proj) return proj.name;

    // 2. Buscar en properties (extraer el nombre del proyecto si está vinculado)
    const prop = properties.find(p => 
      p.id === targetId || 
      (p.projectName && p.projectName.toLowerCase() === targetId.toLowerCase()) ||
      (p.title && p.title.toLowerCase() === targetId.toLowerCase())
    );
    if (prop) {
      if (prop.projectName && prop.projectName.trim().length > 0) {
        return prop.projectName;
      }
      return prop.title;
    }

    // 3. Fallback directo al texto
    return targetId;
  }, [deal.propertyId, contact?.interestedProperty, projects, properties]);

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
      className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-150 cursor-grab active:cursor-grabbing group space-y-2.5"
    >
      {/* Header: Lead Name con icono de Usuario + Badges de Score y Prioridad */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-[#1154FF] transition-colors">
            <User className="w-3 h-3" />
          </div>
          <h4 
            className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-[#1154FF] transition-colors"
            title={leadName}
          >
            {leadName}
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {contact && (() => {
            const evalData = evaluateScoreCriteria(contact);
            const temp = contact.leadTemperature || evalData.temperature;
            const tempConfig = TEMPERATURE_CONFIG[temp];
            return (
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold border ${tempConfig.bgLight} ${tempConfig.color} ${tempConfig.border}`} title={`Score: ${evalData.score} pts (${tempConfig.label})`}>
                {tempConfig.emoji} {evalData.score}
              </span>
            );
          })()}
          <Badge variant={deal.priority} size="sm">
            {deal.priority}
          </Badge>
        </div>
      </div>

      {/* Proyecto de Interés con Color Diferenciado y Destacado */}
      {projectName && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#004aad] dark:text-[#38BDF8] bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100/70 dark:hover:bg-blue-950/70 p-1.5 px-2.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 shadow-xs transition-colors">
          <Building2 className="w-3.5 h-3.5 text-[#1154FF] dark:text-[#38BDF8] shrink-0" />
          <span className="truncate font-bold tracking-tight" title={projectName}>
            {projectName}
          </span>
        </div>
      )}

      {/* Valor Trato & Probabilidad */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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

      {/* Footer: Asesor & Navegación Rápida de Etapa */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {agent && (
            <img
              src={agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={agent.name}
              className="w-4 h-4 rounded-full object-cover"
              title={agent.name}
            />
          )}
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[80px]">
            {agent?.name.split(' ')[0] || 'Asignado'}
          </span>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          {currentStageIndex > 0 && (
            <button
              onClick={handleMovePrev}
              title="Etapa anterior"
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}

          {currentStageIndex < STAGE_ORDER.length - 1 && (
            <button
              onClick={handleMoveNext}
              title="Avanzar etapa"
              className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-[#004aad] dark:text-[#38BDF8] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm(`¿Eliminar la oportunidad de "${leadName}"?`)) {
                deleteDeal(deal.id);
              }
            }}
            title="Eliminar oportunidad"
            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
