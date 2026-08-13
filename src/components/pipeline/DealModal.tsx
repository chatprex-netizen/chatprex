import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Deal, DealStage } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
  initialStage?: DealStage;
}

export const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  dealToEdit,
  initialStage = 'nuevo_prospecto',
}) => {
  const { 
    contacts, 
    properties, 
    currentAgent, 
    addDeal, 
    updateDeal,
    pipelineStages 
  } = useCRM();

  const [formData, setFormData] = useState({
    title: '',
    leadId: '',
    propertyId: '',
    stage: initialStage,
    value: 150000,
    currency: 'USD' as 'USD' | 'EUR' | 'MXN' | 'PEN',
    probability: 50,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    agentId: currentAgent.id,
    priority: 'media' as 'alta' | 'media' | 'baja',
    notes: '',
  });

  useEffect(() => {
    if (dealToEdit) {
      setFormData({
        title: dealToEdit.title,
        leadId: dealToEdit.leadId,
        propertyId: dealToEdit.propertyId || '',
        stage: dealToEdit.stage,
        value: dealToEdit.value,
        currency: dealToEdit.currency,
        probability: dealToEdit.probability,
        expectedCloseDate: dealToEdit.expectedCloseDate,
        agentId: dealToEdit.agentId,
        priority: dealToEdit.priority,
        notes: dealToEdit.notes,
      });
    } else {
      setFormData({
        title: '',
        leadId: contacts[0]?.id || '',
        propertyId: properties[0]?.id || '',
        stage: initialStage,
        value: 250000,
        currency: 'USD',
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        agentId: currentAgent.id,
        priority: 'media',
        notes: '',
      });
    }
  }, [dealToEdit, isOpen, initialStage, contacts, properties, currentAgent]);

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!formData.title.trim() || !formData.leadId) return;

    let err;
    if (dealToEdit) {
      err = await updateDeal(dealToEdit.id, formData);
    } else {
      err = await addDeal(formData);
    }
    
    if (err) {
      setErrorMsg(err);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Editar oportunidad' : 'Nueva oportunidad de venta'}
      subtitle="Gestiona el valor y la etapa del embudo comercial"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        {errorMsg && (
          <div className="p-2 bg-red-50 text-red-600 rounded text-[11px] border border-red-200">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Título de la oportunidad *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Compra Departamento - Juan Pérez"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Cliente asociado *
            </label>
            <select
              required
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Propiedad de interés
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin propiedad fija --</option>
              {properties.filter(p => p.status === 'disponible' || p.status === 'en_negociacion' || p.id === formData.propertyId).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Etapa del embudo
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              {pipelineStages.filter(s => s.visible).sort((a, b) => a.order - b.order).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Monto estimado ($)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Fecha estimada de cierre
            </label>
            <input
              type="date"
              required
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Notas de la negociación
          </label>
          <textarea
            rows={2}
            placeholder="Comentarios adicionales..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 resize-none"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-medium shadow-xs transition-all"
          >
            {dealToEdit ? 'Guardar cambios' : 'Crear oportunidad'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
