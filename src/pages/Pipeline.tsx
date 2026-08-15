import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { KanbanBoard } from '../components/pipeline/KanbanBoard';
import { DealModal } from '../components/pipeline/DealModal';
import { Deal, DealStage } from '../types';
import { Badge } from '../components/common/Badge';
import { 
  Plus, 
  Table2, 
  LayoutGrid, 
  Edit3, 
  Trash2,
  Filter
} from 'lucide-react';
interface PipelinePageProps {
  onOpenNewDealModal?: () => void;
}



export const PipelinePage: React.FC<PipelinePageProps> = ({
  onOpenNewDealModal: _onOpenNewDealModal,
}) => {
  const { 
    deals, 
    contacts, 
    properties, 
    agents, 
    moveDealStage, 
    deleteDeal, 
    searchQuery,
    pipelineStages,
    fetchDeals
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInitialStage, setSelectedInitialStage] = useState<DealStage>('nuevo_prospecto');

  React.useEffect(() => {
    fetchDeals(1, searchQuery, viewMode === 'kanban');
  }, [viewMode, searchQuery]);

  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'perdido')
    .reduce((sum, d) => sum + d.value, 0);

  const filteredDeals = deals.filter((deal) => {
    // Si la etapa es "ganado" o "perdido" y estamos en vista Kanban O el filtro está en "all" en lista, ocultarlos
    if (deal.stage === 'ganado' || deal.stage === 'perdido') {
      if (viewMode === 'kanban' || selectedStageFilter === 'all') return false;
    }

    const matchesSearch = !searchQuery ||
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.value.toString().includes(searchQuery);

    const matchesStage = selectedStageFilter === 'all' || deal.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const handleOpenNewInStage = (stage?: DealStage) => {
    setSelectedInitialStage(stage || 'nuevo_prospecto');
    setDealToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setDealToEdit(deal);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner with Funnel Stats & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#004aad]" />
            <span>Embudo de ventas</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            {viewMode === 'kanban' 
              ? 'Arrastra las tarjetas para cambiar de etapa' 
              : `Vista de lista (${filteredDeals.length} oportunidades)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block mr-2">
            <span className="text-[10px] text-slate-400 block font-normal">Valor en gestión</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              ${totalPipelineValue.toLocaleString()} USD
            </div>
          </div>

          {/* View Switcher: Kanban vs List */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-[#004aad] shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vista tablero"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tablero</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-[#004aad] shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vista lista"
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenNewInStage('nuevo_prospecto')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva oportunidad</span>
          </button>
        </div>
      </div>

      {/* Main View Mode Container */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          onOpenNewDealModal={handleOpenNewInStage}
          onEditDeal={handleEditDeal}
        />
      ) : (
        <div className="space-y-3">
          {/* Stage Filter Pills in List View */}
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedStageFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-all ${
                selectedStageFilter === 'all'
                  ? 'bg-[#004aad] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Activas
            </button>

            {pipelineStages.filter(s => s.visible && s.id !== 'ganado' && s.id !== 'perdido').sort((a, b) => a.order - b.order).map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStageFilter(stage.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-all ${
                  selectedStageFilter === stage.id
                    ? 'bg-[#004aad] text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {stage.name}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">Oportunidad</th>
                    <th className="py-2.5 px-4">Cliente</th>
                    <th className="py-2.5 px-4">Propiedad</th>
                    <th className="py-2.5 px-4">Etapa</th>
                    <th className="py-2.5 px-4">Monto</th>
                    <th className="py-2.5 px-4">Probabilidad</th>
                    <th className="py-2.5 px-4">Prioridad</th>
                    <th className="py-2.5 px-4">Cierre estimado</th>
                    <th className="py-2.5 px-4">Asesor</th>
                    <th className="py-2.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal text-slate-700 dark:text-slate-300">
                  {filteredDeals.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No hay oportunidades con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredDeals.map((deal) => {
                      const contact = contacts.find((c) => c.id === deal.leadId);
                      const property = properties.find((p) => p.id === deal.propertyId);
                      const agent = agents.find((a) => a.id === deal.agentId);

                      return (
                        <tr
                          key={deal.id}
                          onClick={() => handleEditDeal(deal)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 max-w-[200px]">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {deal.title}
                            </div>
                            {deal.notes && (
                              <div className="text-[11px] text-slate-400 truncate">
                                {deal.notes}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {contact ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={contact.avatar}
                                  alt={contact.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white truncate">{contact.name}</div>
                                  <div className="text-[10px] text-slate-400">{contact.phone}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">--</span>
                            )}
                          </td>

                          <td className="py-3 px-4 max-w-[160px]">
                            {property ? (
                              <div className="truncate font-medium text-slate-800 dark:text-slate-200">
                                {property.title}
                              </div>
                            ) : (
                              <span className="text-slate-400">Sin propiedad</span>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={deal.stage}
                              onChange={(e) => moveDealStage(deal.id, e.target.value as DealStage)}
                              className="px-2 py-1 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                            >
                              {pipelineStages.filter(s => s.visible).sort((a, b) => a.order - b.order).map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            ${deal.value.toLocaleString()} {deal.currency}
                          </td>

                          <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                            {deal.probability}%
                          </td>

                          <td className="py-3 px-4">
                            <Badge variant={deal.priority} size="sm">
                              {deal.priority}
                            </Badge>
                          </td>

                          <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {deal.expectedCloseDate}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {agent ? (
                              <span className="text-slate-600 dark:text-slate-300 font-normal">
                                {agent.name.split(' ')[0]}
                              </span>
                            ) : (
                              <span className="text-slate-400">--</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditDeal(deal)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`¿Eliminar la oportunidad "${deal.title}"?`)) {
                                    deleteDeal(deal.id);
                                  }
                                }}
                                className="p-1 rounded text-slate-400 hover:text-rose-600"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Deal Create/Edit Modal */}
      <DealModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setDealToEdit(null);
        }}
        dealToEdit={dealToEdit}
        initialStage={selectedInitialStage}
      />
    </div>
  );
};
