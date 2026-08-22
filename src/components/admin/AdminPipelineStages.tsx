import React, { useState } from 'react';
import { Columns, Plus, Edit2, Trash2, X, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PipelineStageConfig } from '../../types';

export const AdminPipelineStages: React.FC = () => {
  const { pipelineStages, addPipelineStage, updatePipelineStage, deletePipelineStage, addNotification } = useCRM();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStageConfig | null>(null);
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [visible, setVisible] = useState(true);

  // Ordenar por el campo order
  const sortedStages = [...pipelineStages].sort((a, b) => a.order - b.order);

  const handleOpenNew = () => {
    setEditingStage(null);
    setName('');
    setColor('#2563eb');
    setVisible(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stage: PipelineStageConfig) => {
    setEditingStage(stage);
    setName(stage.name);
    setColor(stage.color);
    setVisible(stage.visible);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, stageName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la etapa "${stageName}"?`)) {
      try {
        await deletePipelineStage(id);
        addNotification('Etapa Eliminada', `La etapa "${stageName}" ha sido eliminada.`, 'info');
      } catch (err: any) {
        addNotification('Error al eliminar', err.message || 'No se pudo eliminar la etapa.', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingStage) {
        await updatePipelineStage(editingStage.id, { 
          name, 
          color,
          visible
        });
        addNotification('Etapa Actualizada', `Se guardaron los cambios de "${name}".`, 'success');
      } else {
        await addPipelineStage({ 
          name, 
          color,
          visible,
          order: pipelineStages.length + 1
        });
        addNotification('Etapa Creada', `La etapa "${name}" fue añadida al embudo.`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      addNotification('Error al guardar etapa', err.message || 'Error del servidor.', 'error');
    }
  };

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const current = sortedStages[index];
      const prev = sortedStages[index - 1];
      updatePipelineStage(current.id, { order: prev.order });
      updatePipelineStage(prev.id, { order: current.order });
    } else if (direction === 'down' && index < sortedStages.length - 1) {
      const current = sortedStages[index];
      const next = sortedStages[index + 1];
      updatePipelineStage(current.id, { order: next.order });
      updatePipelineStage(next.id, { order: current.order });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Etapas del Pipeline
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Administra las fases por las que pasan tus oportunidades de venta.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir nueva
        </button>
      </div>

      <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 w-16 text-center">Orden</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">Etapa</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 w-28 text-center">Estado</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 w-24 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedStages.map((stage, index) => (
              <tr key={stage.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => moveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-[#004aad] hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => moveOrder(index, 'down')}
                      disabled={index === sortedStages.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-[#004aad] hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs"
                      style={{ backgroundColor: stage.color }}
                    >
                      <Columns className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {stage.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  {stage.visible ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                      ACTIVA
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      OCULTA
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(stage)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                      title="Editar etapa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(stage.id, stage.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar etapa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pipelineStages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-xs">
                  No hay etapas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                {editingStage ? 'Editar Etapa' : 'Nueva Etapa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Etapa
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Negociación"
                  required
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Color Identificador
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 px-1 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id="visible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="rounded border-slate-300 text-[#004aad] focus:ring-[#004aad] w-3.5 h-3.5"
                />
                <label htmlFor="visible" className="text-[11px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Etapa Activa (Visible en el Pipeline)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#004aad] hover:bg-[#003c8b] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editingStage ? 'Guardar Cambios' : 'Añadir Etapa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
