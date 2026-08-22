import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Contact, ContactType, LeadChannel, DealStage, PropertyType, LeadTemperature } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Building, MessageSquareText } from 'lucide-react';

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
  const { addContact, updateContact, addDeal, agents, contacts, properties, projects, leadChannels, pipelineStages } = useCRM();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'comprador' as ContactType,
    channel: 'whatsapp' as LeadChannel,
    budget: 0,
    currency: 'S/',
    pipelineStage: 'nuevo_prospecto' as DealStage,
    interestedProperty: '',
    preferredZones: [] as string[],
    preferredTypes: ['departamento'] as PropertyType[],
    leadScore: 20,
    leadTemperature: 'frio' as LeadTemperature,
    notes: '',
    assignedAgentId: agents[0]?.id || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  const [displayBudget, setDisplayBudget] = useState<string>('');

  // Consolidar lista única de proyectos disponibles
  const projectOptions = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    const seen = new Set<string>();

    projects.forEach(p => {
      if (p.name && !seen.has(p.name.trim().toLowerCase())) {
        seen.add(p.name.trim().toLowerCase());
        list.push({ id: p.id, name: p.name.trim() });
      }
    });

    properties.forEach(p => {
      const pName = p.projectName || (p.type === 'proyecto_preventa' ? p.title : '');
      if (pName && !seen.has(pName.trim().toLowerCase())) {
        seen.add(pName.trim().toLowerCase());
        list.push({ id: p.id, name: pName.trim() });
      }
    });

    return list;
  }, [projects, properties]);

  useEffect(() => {
    if (contactToEdit) {
      const budgetVal = contactToEdit.budget || contactToEdit.budgetMax || 0;
      setFormData({
        name: contactToEdit.name || '',
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || '',
        type: contactToEdit.type || 'comprador',
        channel: contactToEdit.channel || 'whatsapp',
        budget: budgetVal,
        currency: contactToEdit.currency || 'S/',
        pipelineStage: contactToEdit.pipelineStage || 'nuevo_prospecto',
        interestedProperty: contactToEdit.interestedProperty || '',
        preferredZones: contactToEdit.preferredZones || [],
        preferredTypes: contactToEdit.preferredTypes || ['departamento'],
        leadScore: contactToEdit.leadScore ?? 20,
        leadTemperature: (contactToEdit.leadTemperature as LeadTemperature) || 'frio',
        notes: contactToEdit.notes || '',
        assignedAgentId: contactToEdit.assignedAgentId || agents[0]?.id || '',
        avatar: contactToEdit.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
      setDisplayBudget(budgetVal > 0 ? budgetVal.toLocaleString('en-US') : '');
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'comprador',
        channel: 'whatsapp',
        budget: 0,
        currency: 'S/',
        pipelineStage: 'nuevo_prospecto',
        interestedProperty: '',
        preferredZones: [],
        preferredTypes: ['departamento'],
        leadScore: 20,
        leadTemperature: 'frio',
        notes: '',
        assignedAgentId: agents[0]?.id || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
      setDisplayBudget('');
    }
  }, [contactToEdit, isOpen, agents]);

  // Manejo de input de monto con separador de miles
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
    if (!rawDigits) {
      setDisplayBudget('');
      setFormData(prev => ({ ...prev, budget: 0 }));
      return;
    }
    const num = parseInt(rawDigits, 10);
    setDisplayBudget(num.toLocaleString('en-US'));
    setFormData(prev => ({ ...prev, budget: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const phoneExists = contacts.some(c => c.phone === formData.phone && (!contactToEdit || c.id !== contactToEdit.id));
    if (phoneExists && formData.phone.trim()) {
      alert('Este número de teléfono ya está registrado para otro cliente.');
      return;
    }

    try {
      const payload = {
        ...formData,
      };

      if (contactToEdit) {
        await updateContact(contactToEdit.id, payload as Partial<Contact>);
      } else {
        const contact = await addContact(payload as any);
        if (contact && contact.id) {
          await addDeal({
            title: formData.name || 'Nuevo Prospecto',
            leadId: contact.id,
            propertyId: formData.interestedProperty || undefined,
            stage: formData.pipelineStage || 'nuevo_prospecto',
            value: formData.budget || 0,
            currency: formData.currency as any,
            probability: 25,
            expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            agentId: formData.assignedAgentId || agents[0]?.id || 'agent-1',
            priority: 'media',
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
      title={contactToEdit ? 'Editar Contacto / Prospecto' : 'Nuevo Cliente / Prospecto'}
      subtitle="Datos del cliente, requerimientos inmobiliarios y notas de conversación"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* 1. Datos Personales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Nombre Completo (máx 25) *
            </label>
            <input
              type="text"
              required
              maxLength={25}
              placeholder="Ej: Mariana Rodríguez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Teléfono / WhatsApp *
            </label>
            <input
              type="text"
              required
              placeholder="+51 987 654 321"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Contacto
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactType })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="comprador">Comprador</option>
              <option value="inversionista">Inversionista</option>
              <option value="propietario">Propietario</option>
              <option value="inquilino">Inquilino</option>
            </select>
          </div>
        </div>

        {/* 2. Canal y Etapa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Canal de Captación
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value as LeadChannel })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              {leadChannels.filter(c => c.visible).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Etapa (Pipeline)
            </label>
            <select
              value={formData.pipelineStage || ''}
              onChange={(e) => setFormData({ ...formData, pipelineStage: e.target.value as DealStage })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="">-- Sin etapa --</option>
              {pipelineStages.filter(s => s.visible).sort((a, b) => a.order - b.order).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Proyecto de Interés y Presupuesto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-[#004aad]" />
              <span>Proyecto de Interés</span>
            </label>
            <select
              value={formData.interestedProperty}
              onChange={(e) => setFormData({ ...formData, interestedProperty: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin proyecto fijo --</option>
              {projectOptions.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Presupuesto Aproximado
            </label>
            <div className="flex gap-1">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-18 px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="S/">S/</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
              </select>
              <input
                type="text"
                placeholder="Ej: 150,000"
                value={displayBudget}
                onChange={handleBudgetChange}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] font-medium"
              />
            </div>
          </div>
        </div>

        {/* 4. Asesor Responsable y Tipo de Inmueble */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Inmueble Preferido
            </label>
            <select
              value={formData.preferredTypes[0] || 'departamento'}
              onChange={(e) => setFormData({ ...formData, preferredTypes: [e.target.value as PropertyType] })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="departamento">Departamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno / Lote</option>
              <option value="oficina">Oficina</option>
              <option value="local_comercial">Local Comercial</option>
              <option value="proyecto_preventa">Proyecto Preventa</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Asesor Responsable
            </label>
            <select
              value={formData.assignedAgentId}
              onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Detalles de la Conversación y Requerimientos */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <MessageSquareText className="w-3 h-3 text-[#004aad]" />
            <span>Detalles de la Conversación y Requerimientos Clave</span>
          </label>
          <textarea
            rows={2}
            placeholder="Anota acuerdos, requerimientos del cliente (ej. 3 dormitorios, piso alto, vista a parque, precalificación bancaria, fecha de visita acordada)..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
          />
        </div>

        {/* Botones de acción */}
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
            {contactToEdit ? 'Guardar Cambios' : 'Registrar Contacto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
