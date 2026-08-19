import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Contact, ContactType, LeadChannel, DealStage, PropertyType, LeadTemperature } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Building, Flame, Zap, HelpCircle, MessageSquareText, Home } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: Contact | null;
}

const TEMPERATURE_OPTIONS: { id: LeadTemperature; label: string; desc: string; icon: any; color: string; bg: string; border: string; score: number }[] = [
  {
    id: 'muy_caliente',
    label: 'Muy Caliente / Cierre Inmediato',
    desc: 'Compra en < 30 días, capacidad o fondos aprobados',
    icon: Flame,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/70',
    border: 'border-rose-200 dark:border-rose-800',
    score: 90
  },
  {
    id: 'caliente',
    label: 'Caliente / Alto Interés',
    desc: 'Proyecto definido y presupuesto compatible',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/70',
    border: 'border-amber-200 dark:border-amber-800',
    score: 70
  },
  {
    id: 'calificado',
    label: 'Calificado / Evaluando',
    desc: 'Interesado, solicitó información o visita',
    icon: HelpCircle,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/70',
    border: 'border-blue-200 dark:border-blue-800',
    score: 45
  },
  {
    id: 'frio',
    label: 'Informativo / Frío',
    desc: 'Consulta inicial de catálogo o precios',
    icon: Home,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/70',
    border: 'border-slate-200 dark:border-slate-700',
    score: 20
  }
];

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

  const handleSelectTemperature = (opt: typeof TEMPERATURE_OPTIONS[0]) => {
    setFormData(prev => ({
      ...prev,
      leadTemperature: opt.id,
      leadScore: opt.score
    }));
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
            title: `Negociación con ${formData.name}`,
            leadId: contact.id,
            propertyId: formData.interestedProperty || undefined,
            stage: formData.pipelineStage || 'nuevo_prospecto',
            value: formData.budget || 0,
            currency: formData.currency as any,
            probability: formData.leadTemperature === 'muy_caliente' ? 80 : (formData.leadTemperature === 'caliente' ? 60 : (formData.leadTemperature === 'calificado' ? 35 : 15)),
            expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            agentId: formData.assignedAgentId || agents[0]?.id || 'agent-1',
            priority: (formData.leadTemperature === 'muy_caliente' || formData.leadTemperature === 'caliente') ? 'alta' : 'media',
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
      subtitle="Registra los datos de contacto, requerimientos, proyecto y nivel de interés"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Datos Personales */}
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
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Teléfono / WhatsApp *
            </label>
            <input
              type="text"
              required
              placeholder="+51 987 654 321"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
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
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Contacto
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactType })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="comprador">Comprador</option>
              <option value="inversionista">Inversionista</option>
              <option value="propietario">Propietario</option>
              <option value="inquilino">Inquilino</option>
            </select>
          </div>
        </div>

        {/* 2. Canal y Etapa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Canal de Captación
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value as LeadChannel })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
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
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="">-- Sin etapa --</option>
              {pipelineStages.filter(s => s.visible).sort((a, b) => a.order - b.order).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Proyecto de Interés y Presupuesto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#004aad]" />
              <span>Proyecto de Interés</span>
            </label>
            <select
              value={formData.interestedProperty}
              onChange={(e) => setFormData({ ...formData, interestedProperty: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Presupuesto Aproximado
            </label>
            <div className="flex gap-1.5">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-20 px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
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
                className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] font-medium"
              />
            </div>
          </div>
        </div>

        {/* 4. Asesor Responsable y Tipo de Inmueble */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Inmueble Preferido
            </label>
            <select
              value={formData.preferredTypes[0] || 'departamento'}
              onChange={(e) => setFormData({ ...formData, preferredTypes: [e.target.value as PropertyType] })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asesor Responsable
            </label>
            <select
              value={formData.assignedAgentId}
              onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Nivel de Interés Comercial */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Nivel / Grado de Interés del Cliente
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEMPERATURE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = formData.leadTemperature === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleSelectTemperature(opt)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? `${opt.bg} ${opt.border} ring-2 ring-[#004aad]/20 shadow-xs`
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-800'} shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${opt.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Detalles de la Conversación y Requerimientos */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <MessageSquareText className="w-3.5 h-3.5 text-[#004aad]" />
            <span>Detalles de la Conversación y Requerimientos Clave</span>
          </label>
          <textarea
            rows={3}
            placeholder="Anota acuerdos, requerimientos del cliente (ej. 3 dormitorios, piso alto, vista a parque, precalificación bancaria, fecha de visita acordada o detalles conversados por WhatsApp/llamada)..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
          />
        </div>

        {/* Botones de acción */}
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
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-md shadow-blue-900/20 transition-all active:scale-95"
          >
            {contactToEdit ? 'Guardar Cambios' : 'Registrar Contacto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
