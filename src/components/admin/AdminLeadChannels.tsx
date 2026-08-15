import React, { useState } from 'react';
import { Share2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { LeadChannelConfig } from '../../types';

export const AdminLeadChannels: React.FC = () => {
  const { leadChannels, addLeadChannel, updateLeadChannel, deleteLeadChannel } = useCRM();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<LeadChannelConfig | null>(null);
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [details, setDetails] = useState('');
  const [visible, setVisible] = useState(true);

  const handleOpenNew = () => {
    setEditingChannel(null);
    setName('');
    setColor('#2563eb');
    setDetails('');
    setVisible(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (channel: LeadChannelConfig) => {
    setEditingChannel(channel);
    setName(channel.name);
    setColor(channel.color);
    setDetails(channel.details || '');
    setVisible(channel.visible);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta fuente de origen?')) {
      deleteLeadChannel(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingChannel) {
      updateLeadChannel(editingChannel.id, { 
        name, 
        color,
        details,
        visible
      });
    } else {
      addLeadChannel({ 
        name, 
        color,
        details,
        visible
      });
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Fuentes de Origen
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Administra los canales por donde llegan tus leads.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir nuevo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">Canal</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">Detalles</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">Estado</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leadChannels.map(channel => (
              <tr key={channel.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: channel.color }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {channel.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400">
                  {channel.details || '-'}
                </td>
                <td className="px-4 py-2">
                  {channel.visible ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ACTIVO
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      OCULTO
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(channel)}
                      className="p-1 text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(channel.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {leadChannels.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500 text-xs">
                  No hay fuentes registradas.
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
                {editingChannel ? 'Editar Fuente' : 'Nueva Fuente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Fuente
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Facebook Ads"
                  required
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detalles (Opcional)
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ej. Campaña 2026"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Color
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
                  Canal Activo (Visible en el CRM)
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
                  {editingChannel ? 'Guardar Cambios' : 'Añadir Fuente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
