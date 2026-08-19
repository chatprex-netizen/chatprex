import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Task, TaskType, TaskStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const TASK_TYPES: { id: TaskType; label: string; icon: string }[] = [
  { id: 'llamada', label: 'Llamada telefónica', icon: '📞' },
  { id: 'whatsapp', label: 'Mensaje WhatsApp', icon: '💬' },
  { id: 'visita', label: 'Visita a inmueble', icon: '🏡' },
  { id: 'documentacion', label: 'Documentos / Notaría', icon: '📄' },
  { id: 'firma_contrato', label: 'Firma de contrato', icon: '✍️' },
  { id: 'correo', label: 'Enviar correo', icon: '📧' },
  { id: 'seguimiento_general', label: 'Seguimiento general', icon: '📌' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { addTask, updateTask, contacts, properties, currentAgent } = useCRM();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'llamada' as TaskType,
    priority: 'media' as 'alta' | 'media' | 'baja',
    status: 'pendiente' as TaskStatus,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:00',
    agentId: currentAgent.id,
    contactId: '',
    propertyId: '',
    dealId: '',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        type: taskToEdit.type,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate,
        dueTime: taskToEdit.dueTime || '11:00',
        agentId: taskToEdit.agentId,
        contactId: taskToEdit.contactId || '',
        propertyId: taskToEdit.propertyId || '',
        dealId: taskToEdit.dealId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'llamada',
        priority: 'media',
        status: 'pendiente',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '11:00',
        agentId: currentAgent.id,
        contactId: contacts[0]?.id || '',
        propertyId: '',
        dealId: '',
      });
    }
  }, [taskToEdit, isOpen, currentAgent, contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
    } else {
      addTask(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
      subtitle="Programa una actividad comercial con fecha límite"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Título de la Tarea *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Llamar a cliente para coordinar visita al proyecto"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Actividad
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              {TASK_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Fecha Límite
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Hora Límite
            </label>
            <input
              type="time"
              value={formData.dueTime}
              onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Cliente Asociado
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin cliente --</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Propiedad Asociada
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin propiedad --</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Descripción / Notas
          </label>
          <textarea
            rows={2}
            placeholder="Anota acuerdos previos, detalles sobre la llamada o recordatorios importantes..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all active:scale-95"
          >
            {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
