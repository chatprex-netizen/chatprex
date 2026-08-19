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
  const { addDeal, updateDeal, contacts, properties, pipelineStages, currentAgent } = useCRM();

  const [formData, setFormData] = useState({
    title: '',
    leadId: '',
    propertyId: '',
    stage: initialStage,
    value: 250000,
    currency: 'USD' as 'USD' | 'PEN',
    probability: 50,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    agentId: currentAgent.id,
    priority: 'media' as 'alta' | 'media' | 'baja',
    notes: '',
  });

  const [displayValue, setDisplayValue] = useState<string>('250,000');

  useEffect(() => {
    if (dealToEdit) {
      setFormData({
        title: dealToEdit.title,
        leadId: dealToEdit.leadId,
        propertyId: dealToEdit.propertyId || '',
        stage: dealToEdit.stage,
        value: dealToEdit.value,
        currency: (dealToEdit.currency === 'S/' ? 'PEN' : dealToEdit.currency) as any || 'USD',
        probability: dealToEdit.probability,
        expectedCloseDate: dealToEdit.expectedCloseDate ? dealToEdit.expectedCloseDate.split('T')[0] : '',
        agentId: dealToEdit.agentId,
        priority: dealToEdit.priority,
        notes: dealToEdit.notes || '',
      });
      setDisplayValue(dealToEdit.value ? dealToEdit.value.toLocaleString('en-US') : '');
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
      setDisplayValue('250,000');
    }
  }, [dealToEdit, isOpen, initialStage, contacts, properties, currentAgent]);

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
    if (!rawDigits) {
      setDisplayValue('');
      setFormData(prev => ({ ...prev, value: 0 }));
      return;
    }
    const num = parseInt(rawDigits, 10);
    setDisplayValue(num.toLocaleString('en-US'));
    setFormData(prev => ({ ...prev, value: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!formData.title.trim() || !formData.leadId) return;

    try {
      if (dealToEdit) {
        await updateDeal(dealToEdit.id, formData);
      } else {
        await addDeal(formData);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Editar Oportunidad' : 'Nueva Oportunidad de Venta'}
      subtitle="Gestiona el valor, inmueble y la etapa del embudo comercial"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {errorMsg && (
          <div className="p-2 bg-red-50 text-red-600 rounded-xl text-[11px] border border-red-200">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Título de la Oportunidad *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Compra Departamento 402 - Mariana Rodríguez"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Cliente Asociado *
            </label>
            <select
              required
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Seleccionar cliente --</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Propiedad de Interés
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin propiedad fija --</option>
              {properties.filter(p => p.status === 'disponible' || p.id === formData.propertyId).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Etapa del Embudo
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              {pipelineStages.filter(s => s.visible).sort((a, b) => a.order - b.order).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
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
              Monto Estimado
            </label>
            <div className="flex gap-1">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-20 px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="USD">USD</option>
                <option value="PEN">S/</option>
              </select>
              <input
                type="text"
                required
                placeholder="Ej: 250,000"
                value={displayValue}
                onChange={handleValueChange}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] font-semibold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Fecha Estimada de Cierre
            </label>
            <input
              type="date"
              required
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Notas de la Negociación
          </label>
          <textarea
            rows={2}
            placeholder="Anota acuerdos de financiamiento, condiciones comerciales, visitas realizadas..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
            {dealToEdit ? 'Guardar Cambios' : 'Crear Oportunidad'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
