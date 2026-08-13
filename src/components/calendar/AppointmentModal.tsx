import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { AppointmentStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addAppointment, properties, contacts, agents } = useCRM();

  const [formData, setFormData] = useState({
    title: '',
    propertyId: properties[0]?.id || '',
    contactId: contacts[0]?.id || '',
    agentId: agents[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    durationMinutes: 60,
    status: 'programada' as AppointmentStatus,
    location: properties[0]?.address || 'En la propiedad',
    notes: '',
  });

  const handlePropertyChange = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    setFormData((prev) => ({
      ...prev,
      propertyId,
      location: prop ? `${prop.address}, ${prop.zone}` : prev.location,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addAppointment(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Nueva Visita / Cita"
      subtitle="Programa una visita a propiedad con el cliente y asigna al asesor"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Motivo o Título de la Cita *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Primera visita técnica y entrega de brochure"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Propiedad a Visitar
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cliente Asistente
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fecha
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hora
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Duración (min)
            </label>
            <select
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asesor Asignado
            </label>
            <select
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estado de la Cita
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AppointmentStatus })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="programada">Programada</option>
              <option value="confirmada">Confirmada</option>
              <option value="realizada">Realizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Punto de Encuentro / Dirección
          </label>
          <input
            type="text"
            placeholder="Dirección exacta o punto de reunión"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notas Adicionales (Llaves, accesos, etc.)
          </label>
          <textarea
            rows={2}
            placeholder="Instrucciones para caseta de vigilancia, llaves o materiales necesarios..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 resize-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            Agendar Visita
          </button>
        </div>
      </form>
    </Modal>
  );
};
