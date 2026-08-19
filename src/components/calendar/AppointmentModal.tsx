import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Appointment, AppointmentStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentToEdit?: Appointment | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  appointmentToEdit,
}) => {
  const { addAppointment, updateAppointment, properties, contacts, agents } = useCRM();

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

  React.useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        title: appointmentToEdit.title,
        propertyId: appointmentToEdit.propertyId || properties[0]?.id || '',
        contactId: appointmentToEdit.contactId,
        agentId: appointmentToEdit.agentId,
        date: appointmentToEdit.date,
        time: appointmentToEdit.time,
        durationMinutes: appointmentToEdit.durationMinutes,
        status: appointmentToEdit.status,
        location: appointmentToEdit.location || '',
        notes: appointmentToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        propertyId: properties[0]?.id || '',
        contactId: contacts[0]?.id || '',
        agentId: agents[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        time: '11:00',
        durationMinutes: 60,
        status: 'programada',
        location: properties[0]?.address || 'En la propiedad',
        notes: '',
      });
    }
  }, [appointmentToEdit, isOpen, properties, contacts, agents]);

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

    if (appointmentToEdit) {
      updateAppointment(appointmentToEdit.id, formData);
    } else {
      addAppointment(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointmentToEdit ? 'Editar Cita' : 'Agendar Visita / Reunión'}
      subtitle={appointmentToEdit ? 'Modifica los detalles de la cita' : 'Programa una visita guiada o reunión con un cliente'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Motivo o Título de la Cita *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Primera visita técnica y recorrido de la propiedad"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Propiedad a Visitar
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Cliente Asistente
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Fecha
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Hora
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Duración
            </label>
            <select
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Asesor Asignado
            </label>
            <select
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Estado de la Cita
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AppointmentStatus })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="programada">Programada</option>
              <option value="completada">Completada</option>
              <option value="reprogramada">Reprogramada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Lugar de Encuentro
          </label>
          <input
            type="text"
            placeholder="Ej: Recepción del edificio / Caseta de ventas"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Notas Adicionales
          </label>
          <textarea
            rows={2}
            placeholder="Anota requerimientos previos, llaves en portería, confirmación de asistencia..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
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
            {appointmentToEdit ? 'Guardar Cambios' : 'Agendar Cita'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
