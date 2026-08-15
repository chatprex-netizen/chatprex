import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Contact, ContactType, LeadChannel, DealStage, PropertyType } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: Contact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactToEdit,
}) => {
  const { addContact, updateContact, addDeal, agents, contacts, properties, leadChannels, pipelineStages } = useCRM();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'comprador' as ContactType,
    channel: 'whatsapp' as LeadChannel,
    budget: 200000,
    currency: 'USD',
    pipelineStage: 'nuevo_prospecto' as DealStage,
    interestedProperty: '',
    preferredZones: ['Lomas Altas', 'Polanco'],
    preferredTypes: ['departamento'] as PropertyType[],
    leadScore: 80,
    notes: '',
    assignedAgentId: agents[0]?.id || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        name: contactToEdit.name,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
        type: contactToEdit.type,
        channel: contactToEdit.channel,
        budget: contactToEdit.budget || contactToEdit.budgetMax || 0,
        currency: contactToEdit.currency || 'USD',
        pipelineStage: contactToEdit.pipelineStage || 'nuevo_prospecto',
        interestedProperty: contactToEdit.interestedProperty || '',
        preferredZones: contactToEdit.preferredZones || [],
        preferredTypes: contactToEdit.preferredTypes || [],
        leadScore: contactToEdit.leadScore || 50,
        notes: contactToEdit.notes || '',
        assignedAgentId: contactToEdit.assignedAgentId || agents[0]?.id || '',
        avatar: contactToEdit.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'comprador',
        channel: 'whatsapp',
        budget: 200000,
        currency: 'USD',
        pipelineStage: 'nuevo_prospecto',
        interestedProperty: '',
        preferredZones: ['Lomas Altas', 'Polanco'],
        preferredTypes: ['departamento'],
        leadScore: 80,
        notes: '',
        assignedAgentId: agents[0]?.id || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
    }
  }, [contactToEdit, isOpen, agents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const phoneExists = contacts.some(c => c.phone === formData.phone && (!contactToEdit || c.id !== contactToEdit.id));
    if (phoneExists) {
      alert('Este número de teléfono ya está registrado para otro cliente.');
      return;
    }

    try {
      if (contactToEdit) {
        await updateContact(contactToEdit.id, formData as Partial<Contact>);
      } else {
        const contact = await addContact(formData as any);
        if (contact && contact.id) {
          await addDeal({
            title: `Negociación con ${formData.name}`,
            leadId: contact.id,
            propertyId: formData.interestedProperty || undefined,
            stage: 'nuevo_prospecto',
            value: formData.budget || 0,
            currency: formData.currency as any,
            probability: 10,
            expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            agentId: formData.assignedAgentId || agents[0]?.id || 'agent-1',
            priority: formData.leadScore >= 80 ? 'alta' : (formData.leadScore >= 40 ? 'media' : 'baja'),
            notes: formData.notes || ''
          });
        }
      }
      onClose();
    } catch (err: any) {
      alert('Error al guardar contacto: ' + (err.message || 'Error del servidor'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? 'Editar Contacto / Lead' : 'Nuevo Cliente / Lead'}
      subtitle="Registra la información del cliente, presupuesto y canal de contacto"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre Completo (máx 25) *
            </label>
            <input
              type="text"
              required
              maxLength={25}
              placeholder="Ej: Mariana Rodríguez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Teléfono / WhatsApp *
            </label>
            <input
              type="text"
              required
              placeholder="+52 55 1234 5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Contacto
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactType })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="comprador">Comprador</option>
              <option value="inversionista">Inversionista</option>
              <option value="propietario">Propietario</option>
              <option value="inquilino">Inquilino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Canal de Captación
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value as LeadChannel })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              {leadChannels.filter(c => c.visible).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Etapa (Pipeline)
            </label>
            <select
              value={formData.pipelineStage || ''}
              onChange={(e) => setFormData({ ...formData, pipelineStage: e.target.value as DealStage })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="">-- Sin etapa --</option>
              {pipelineStages.filter(s => s.visible).sort((a, b) => a.order - b.order).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Propiedad de Interés
            </label>
            <select
              value={formData.interestedProperty}
              onChange={(e) => setFormData({ ...formData, interestedProperty: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin propiedad fija --</option>
              {properties
                .filter(p => p.status === 'disponible' || p.status === 'en_negociacion' || p.id === formData.interestedProperty)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName ? `${p.projectName} - ` : ''}{p.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Presupuesto
            </label>
            <div className="flex gap-1.5">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-20 px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="S/">S/</option>
                <option value="MXN">MXN</option>
              </select>
              <input
                type="number"
                min={0}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Asesor Responsable
          </label>
          <select
            value={formData.assignedAgentId}
            onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
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
            Notas y Requisitos Especiales
          </label>
          <textarea
            rows={3}
            placeholder="Zona de preferencia, tiempo estimado para comprar, condiciones de crédito..."
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
            {contactToEdit ? 'Guardar Cambios' : 'Registrar Contacto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
