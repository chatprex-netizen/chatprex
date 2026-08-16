import React, { useState } from 'react';
import { DealStage, Deal } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { DealCard } from './DealCard';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  onOpenNewDealModal: (stage?: DealStage) => void;
  onEditDeal: (deal: Deal) => void;
}


export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onOpenNewDealModal,
  onEditDeal,
}) => {
  const { deals, moveDealStage, searchQuery, pipelineStages } = useCRM();
  const [draggedOverStage, setDraggedOverStage] = useState<DealStage | null>(null);

  // Filtrado con la barra de búsqueda global
  const filteredDeals = deals.filter((deal) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      deal.title.toLowerCase().includes(q) ||
      deal.notes.toLowerCase().includes(q) ||
      deal.value.toString().includes(q)
    );
  });

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedOverStage !== stage) {
      setDraggedOverStage(stage);
    }
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      moveDealStage(dealId, stage);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 pr-6 snap-x snap-mandatory sm:snap-none">
      {pipelineStages.filter(s => s.visible && s.id !== 'ganado' && s.id !== 'perdido').sort((a, b) => a.order - b.order).map((column) => {
        const columnDeals = filteredDeals.filter((d) => d.stage === column.id);
        const isDraggedOver = draggedOverStage === column.id;
        const stageId = column.id as DealStage;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, stageId)}
            onDragLeave={() => setDraggedOverStage(null)}
            onDrop={(e) => handleDrop(e, stageId)}
            className={`w-[82vw] sm:w-80 shrink-0 flex flex-col rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border-t-4 border-x border-b border-slate-200/80 dark:border-slate-800 p-3.5 transition-colors snap-center ${
              isDraggedOver ? 'bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/50' : ''
            }`}
            style={{ borderTopColor: column.color }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {column.name}
                </h3>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {columnDeals.length}
                </span>
              </div>

              <button
                onClick={() => onOpenNewDealModal(stageId)}
                title="Agregar oportunidad en esta etapa"
                className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards Container with bottom padding so last card is fully visible */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-270px)] min-h-[150px] pr-1 pb-12">
              {columnDeals.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl text-xs text-slate-400">
                  Sin oportunidades
                </div>
              ) : (
                columnDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onEdit={onEditDeal}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
