import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Contact, LeadActivityType } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Plus } from 'lucide-react';

interface LeadFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

export const LeadFollowUpModal: React.FC<LeadFollowUpModalProps> = ({
  isOpen,
  onClose,
  contact,
}) => {
  const { leadActivities, addLeadActivity, updateLeadNextContact, addTask, currentAgent } = useCRM();

  const [activityType, setActivityType] = useState<LeadActivityType>('llamada');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState<'interesado' | 'solicito_visita' | 'no_contesto' | 'pidio_descuento' | 'descartado' | 'neutro'>('interesado');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [createFollowUpTask, setCreateFollowUpTask] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!contact) return null;

  const activities = leadActivities[contact.id] || [];

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    addLeadActivity(contact.id, {
      type: activityType,
      summary: summary.trim(),
      description: description.trim() || undefined,
      resultOutcome: outcome,
    });

    updateLeadNextContact(contact.id, nextFollowUpDate, 'al_dia');

    if (createFollowUpTask) {
      addTask({
        title: `Seguimiento con ${contact.name}: ${summary.trim()}`,
        description: `Próximo contacto programado.`,
        type: activityType === 'whatsapp' ? 'whatsapp' : 'llamada',
        priority: 'alta',
        status: 'pendiente',
        dueDate: nextFollowUpDate,
        dueTime: '10:30',
        agentId: currentAgent.id,
        contactId: contact.id,
      });
    }

    setSummary('');
    setDescription('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Seguimiento: ${contact.name}`}
      subtitle={`Tel: ${contact.phone} · Score: ${contact.leadScore} pts`}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Lead Overview Bar */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Presupuesto</span>
            <span className="font-bold text-slate-800 dark:text-white">
              ${contact.budgetMin?.toLocaleString()} - ${contact.budgetMax?.toLocaleString()} USD
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Zonas de interés</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {contact.preferredZones.join(', ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Próximo contacto</span>
            <span className="font-semibold text-[#004aad]">
              {contact.nextFollowUpDate || 'Sin programar'}
            </span>
          </div>
        </div>

        {/* Form to Log New Activity */}
        <form onSubmit={handleAddActivity} className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
          <h4 className="font-semibold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#004aad]" />
            Registrar nueva interacción
          </h4>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'llamada', label: '📞 Llamada' },
              { id: 'whatsapp', label: '💬 WhatsApp' },
              { id: 'visita', label: '🏡 Visita' },
              { id: 'nota', label: '📝 Nota' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActivityType(t.id as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                  activityType === t.id
                    ? 'bg-[#004aad] text-white border-[#004aad] shadow-xs'
                    : 'bg-[#f1f1f1] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Resumen de la interacción *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Se coordinó visita para el fin de semana"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Resultado
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              >
                <option value="interesado">Interesado</option>
                <option value="solicito_visita">Solicitó visita</option>
                <option value="pidio_descuento">Negociando</option>
                <option value="no_contesto">No contestó</option>
                <option value="neutro">En espera</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Próximo seguimiento
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={createFollowUpTask}
                onChange={(e) => setCreateFollowUpTask(e.target.checked)}
                className="rounded text-[#004aad] focus:ring-[#004aad] w-3.5 h-3.5"
              />
              <span>Crear tarea para esa fecha</span>
            </label>

            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-medium text-xs shadow-xs transition-all"
            >
              Registrar actividad
            </button>
          </div>

          {savedSuccess && (
            <div className="text-center text-[11px] font-medium text-emerald-600 animate-fade-in">
              ✓ Actividad guardada con éxito
            </div>
          )}
        </form>

        {/* Timeline of Past Activities */}
        <div>
          <h4 className="font-semibold text-xs text-slate-400 mb-2">
            Historial de interacciones ({activities.length})
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                No hay actividades registradas aún.
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="capitalize text-[#004aad] font-bold">{act.type === 'whatsapp' ? 'WhatsApp' : act.type}:</span>
                      <span>{act.summary}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>

                  {act.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {act.description}
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400">
                    Asesor: <strong className="text-slate-600 dark:text-slate-300">{act.agentName}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
