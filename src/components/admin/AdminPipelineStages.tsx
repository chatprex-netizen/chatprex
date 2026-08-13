import React, { useState } from 'react';
import { Columns, Plus, Edit2, Trash2, X, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PipelineStageConfig } from '../../types';

export const AdminPipelineStages: React.FC = () => {
  const { pipelineStages, addPipelineStage, updatePipelineStage, deletePipelineStage } = useCRM();
  
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

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta etapa?')) {
      deletePipelineStage(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStage) {
      updatePipelineStage(editingStage.id, { 
        name, 
        color,
        visible
      });
    } else {
      addPipelineStage({ 
        name, 
        color,
        visible,
        order: pipelineStages.length + 1
      });
    }
    
    setIsModalOpen(false);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Etapas del Pipeline
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administra las fases por las que pasan tus oportunidades de venta.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir nueva
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 w-16">Orden</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Etapa</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Estado</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedStages.map((stage, index) => (
              <tr key={stage.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={() => moveOrder(index, 'up')}
                      disabled={index === 0}
                      className="text-slate-400 hover:text-[#2563eb] disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveOrder(index, 'down')}
                      disabled={index === sortedStages.length - 1}
                      className="text-slate-400 hover:text-[#2563eb] disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: stage.color }}
                    >
                      <Columns className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {stage.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {stage.visible ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ACTIVA
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      OCULTA
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(stage)}
                      className="p-1.5 text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(stage.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pipelineStages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingStage ? 'Editar Etapa' : 'Nueva Etapa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre de la Etapa
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Negociación"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Color Identificador
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 px-1 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="visible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="rounded border-slate-300 text-[#004aad] focus:ring-[#004aad]"
                />
                <label htmlFor="visible" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  Etapa Activa (Visible en el Pipeline)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#004aad] hover:bg-[#003c8b] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
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
