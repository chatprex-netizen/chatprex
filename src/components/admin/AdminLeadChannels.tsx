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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Fuentes de Origen
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administra los canales por donde llegan tus leads.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir nuevo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Canal</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Detalles</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Estado</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leadChannels.map(channel => (
              <tr key={channel.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: channel.color }}
                    >
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {channel.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {channel.details || '-'}
                </td>
                <td className="px-6 py-4">
                  {channel.visible ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ACTIVO
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      OCULTO
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(channel)}
                      className="p-1.5 text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(channel.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {leadChannels.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingChannel ? 'Editar Fuente' : 'Nueva Fuente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre de la Fuente
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Facebook Ads"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Detalles (Opcional)
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ej. Campaña 2026"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Color
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
                  Canal Activo (Visible en el CRM)
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
