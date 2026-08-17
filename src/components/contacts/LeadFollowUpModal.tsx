import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Contact, LeadActivityType } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { 
  Phone, 
  MessageCircle, 
  Home, 
  FileText, 
  Mail, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  User, 
  Building,
  Sparkles,
  TrendingUp,
  Tag,
  Flame
} from 'lucide-react';
import { evaluateScoreCriteria, TEMPERATURE_CONFIG } from '../../lib/leadScoring';

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
  const { 
    leadActivities, 
    fetchLeadActivities,
    addLeadActivity, 
    deleteLeadActivity,
    updateLeadNextContact, 
    addTask, 
    currentAgent,
    properties,
    projects,
    leadChannels,
    pipelineStages
  } = useCRM();

  const [activityType, setActivityType] = useState<LeadActivityType>('llamada');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState<'interesado' | 'solicito_visita' | 'no_contesto' | 'pidio_descuento' | 'descartado' | 'neutro'>('interesado');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [createFollowUpTask, setCreateFollowUpTask] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load activities when modal opens for this contact
  useEffect(() => {
    if (isOpen && contact?.id) {
      fetchLeadActivities(contact.id);
      
      // Default follow-up date: existing or +2 days from now
      if (contact.nextFollowUpDate) {
        setNextFollowUpDate(contact.nextFollowUpDate);
      } else {
        const defaultDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setNextFollowUpDate(defaultDate);
      }
      setSummary('');
      setDescription('');
      setOutcome('interesado');
      setActivityType('llamada');
    }
  }, [isOpen, contact?.id]);

  if (!contact) return null;

  const activities = leadActivities[contact.id] || [];

  // Helper: Format real contact budget cleanly without $ and with commas
  const formatContactBudget = () => {
    const rawCurrency = contact.currency || 'S/';
    const currency = rawCurrency === 'PEN' ? 'S/' : rawCurrency;
    const budget = parseFloat(contact.budget as any) || 0;
    const min = contact.budgetMin || 0;
    const max = contact.budgetMax || 0;

    if (budget > 0) {
      return `${currency} ${budget.toLocaleString('en-US')}`;
    }
    if (min > 0 && max > 0) {
      return `${currency} ${min.toLocaleString('en-US')} - ${max.toLocaleString('en-US')}`;
    }
    if (max > 0) {
      return `${currency} ${max.toLocaleString('en-US')}`;
    }
    if (min > 0) {
      return `${currency} ${min.toLocaleString('en-US')}`;
    }
    return 'Sin definir';
  };

  // Helper: Resolve real property/project accurately
  const getInterestInfo = () => {
    const target = contact.interestedProperty;
    if (target && target.trim().length > 0) {
      // 1. Buscar en propiedades
      const prop = properties.find(p => p.id === target || (p.projectName && p.projectName.toLowerCase() === target.toLowerCase()) || (p.title && p.title.toLowerCase() === target.toLowerCase()));
      if (prop) {
        return {
          type: 'property',
          label: prop.projectName ? prop.projectName : prop.title,
          sublabel: prop.projectName && prop.title !== prop.projectName ? prop.title : (prop.zone || prop.city)
        };
      }

      // 2. Buscar en proyectos
      const proj = projects?.find(p => p.id === target || (p.name && p.name.toLowerCase() === target.toLowerCase()));
      if (proj) {
        return {
          type: 'property',
          label: proj.name,
          sublabel: proj.developer || 'Proyecto Inmobiliario'
        };
      }

      // 3. Texto directo del proyecto ingresado
      return {
        type: 'property',
        label: target,
        sublabel: 'Proyecto / Inmueble de interés'
      };
    }

    return {
      type: 'none',
      label: 'Sin proyecto asignado',
      sublabel: undefined
    };
  };

  const interestInfo = getInterestInfo();

  // Helper: Resolve channel name and style
  const channelInfo = (() => {
    const ch = leadChannels?.find(c => c.id === contact.channel || c.name.toLowerCase() === (contact.channel || '').toLowerCase());
    return {
      name: ch ? ch.name : (contact.channel ? contact.channel.charAt(0).toUpperCase() + contact.channel.slice(1) : 'WhatsApp'),
      color: ch?.color || '#25D366'
    };
  })();

  // Helper: Resolve stage name
  const stageName = (() => {
    const st = pipelineStages?.find(s => s.id === contact.pipelineStage || s.name.toLowerCase() === (contact.pipelineStage || '').toLowerCase());
    return st ? st.name : (contact.pipelineStage ? contact.pipelineStage.replace(/_/g, ' ') : 'Nuevo prospecto');
  })();

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    setIsSubmitting(true);
    try {
      await addLeadActivity(contact.id, {
        type: activityType,
        summary: summary.trim(),
        description: description.trim() || undefined,
        resultOutcome: outcome,
      });

      if (nextFollowUpDate) {
        await updateLeadNextContact(contact.id, nextFollowUpDate, 'al_dia');
      }

      if (createFollowUpTask && nextFollowUpDate) {
        const taskTypeMap: Record<string, any> = {
          whatsapp: 'whatsapp',
          llamada: 'llamada',
          visita: 'visita',
          correo: 'correo',
          nota: 'seguimiento_general'
        };

        await addTask({
          title: `Seguimiento: ${contact.name} - ${summary.trim()}`,
          description: description.trim() || `Seguimiento programado tras ${activityType}.`,
          type: taskTypeMap[activityType] || 'llamada',
          priority: outcome === 'interesado' || outcome === 'solicito_visita' ? 'alta' : 'media',
          status: 'pendiente',
          dueDate: nextFollowUpDate,
          dueTime: '10:00',
          agentId: currentAgent.id,
          contactId: contact.id,
        });
      }

      setSummary('');
      setDescription('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('¿Deseas eliminar este registro de interacción?')) {
      await deleteLeadActivity(contact.id, activityId);
    }
  };

  const getOutcomeBadge = (res?: string) => {
    switch (res) {
      case 'interesado':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Interesado</span>;
      case 'solicito_visita':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Solicitó visita</span>;
      case 'pidio_descuento':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Negociando</span>;
      case 'no_contesto':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">No contestó</span>;
      case 'descartado':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Descartado</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">En espera</span>;
    }
  };

  const getActivityIcon = (type: LeadActivityType) => {
    switch (type) {
      case 'llamada':
        return <Phone className="w-3.5 h-3.5 text-blue-500" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'visita':
        return <Home className="w-3.5 h-3.5 text-purple-500" />;
      case 'correo':
        return <Mail className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const evalData = evaluateScoreCriteria(contact, activities);
  const score = Math.min(100, Math.max(0, evalData.score));
  const tempConfig = TEMPERATURE_CONFIG[evalData.temperature];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Seguimiento: ${contact.name}`}
      subtitle={`Tel: ${contact.phone || 'Sin teléfono'} · Lead Score: ${score} pts (${tempConfig.label})`}
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Real Lead Overview Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Presupuesto */}
          <div>
            <span className="text-[10px] text-slate-400 block font-normal flex items-center gap-1">
              <span>Presupuesto</span>
            </span>
            <span className="font-bold text-slate-800 dark:text-white text-xs block truncate mt-0.5">
              {formatContactBudget()}
            </span>
          </div>

          {/* Interés / Proyecto */}
          <div>
            <span className="text-[10px] text-slate-400 block font-normal flex items-center gap-1">
              <Building className="w-3 h-3 text-[#004aad]" />
              <span>Proyecto de Interés</span>
            </span>
            <span className="text-slate-800 dark:text-slate-100 font-semibold block truncate mt-0.5" title={interestInfo.label}>
              {interestInfo.label}
            </span>
            {interestInfo.sublabel && (
              <span className="text-[10px] text-slate-400 block truncate">
                {interestInfo.sublabel}
              </span>
            )}
          </div>

          {/* Próximo contacto */}
          <div>
            <span className="text-[10px] text-slate-400 block font-normal flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Próximo contacto</span>
            </span>
            <span className={`font-semibold text-xs block mt-0.5 ${contact.nextFollowUpDate ? 'text-[#004aad] dark:text-blue-400' : 'text-slate-400'}`}>
              {contact.nextFollowUpDate || 'Sin programar'}
            </span>
          </div>

          {/* Etapa & Canal */}
          <div>
            <span className="text-[10px] text-slate-400 block font-normal flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>Etapa / Canal</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#004aad] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {stageName}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                vía {channelInfo.name}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Score & Temperature Diagnostic Bar */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="font-bold text-xs text-slate-800 dark:text-white">
                Calificación Comercial del Lead
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                {score} / 100 pts
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tempConfig.bgLight} ${tempConfig.color} ${tempConfig.border}`}>
                <span>{tempConfig.emoji}</span>
                <span>{tempConfig.label}</span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                score >= 81 ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                score >= 61 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                score >= 41 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                score >= 21 ? 'bg-gradient-to-r from-teal-400 to-emerald-500' :
                'bg-slate-400'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Diagnostic pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {evalData.breakdown.map((item) => (
              <span
                key={item.key}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                  item.achieved 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through opacity-60'
                }`}
              >
                {item.achieved ? '✓' : '✗'} {item.label} (+{item.points})
              </span>
            ))}
          </div>
        </div>

        {/* Form to Log New Activity */}
        <form onSubmit={handleAddActivity} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#004aad]" />
              <span>Registrar nueva interacción</span>
            </h4>
            <span className="text-[10px] text-slate-400">
              Asesor: <strong className="text-slate-700 dark:text-slate-200">{currentAgent?.name}</strong>
            </span>
          </div>

          {/* Activity Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {[
              { id: 'llamada', label: 'Llamada', icon: Phone, color: 'text-blue-600' },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600' },
              { id: 'visita', label: 'Visita', icon: Home, color: 'text-purple-600' },
              { id: 'correo', label: 'Correo', icon: Mail, color: 'text-amber-600' },
              { id: 'nota', label: 'Nota', icon: FileText, color: 'text-slate-600' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = activityType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActivityType(t.id as any)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#004aad] text-white border-[#004aad] shadow-sm font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : t.color}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Summary Input */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Resumen de la interacción *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Se presentó el proyecto Residencial Las Praderas y se coordinó cita"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] transition-all text-xs"
            />
          </div>

          {/* Description/Notes textarea */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Notas y detalles de la conversación <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Detalles sobre lo conversado, objeciones, preferencias de pago, requerimientos específicos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] transition-all text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Resultado de la interacción
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 text-xs font-medium"
              >
                <option value="interesado">🔥 Interesado (Caliente)</option>
                <option value="solicito_visita">🏡 Solicitó visita / cita</option>
                <option value="pidio_descuento">💬 En negociación</option>
                <option value="no_contesto">📵 No contestó / Volver a llamar</option>
                <option value="neutro">⏳ En espera de decisión</option>
                <option value="descartado">❌ Descartado / No califica</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Próximo seguimiento programado
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={createFollowUpTask}
                onChange={(e) => setCreateFollowUpTask(e.target.checked)}
                className="rounded text-[#004aad] focus:ring-[#004aad] w-4 h-4 cursor-pointer"
              />
              <span>Crear tarea automática en la agenda para la fecha de seguimiento</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !summary.trim()}
              className="px-4 py-2 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Registrar actividad'}</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ Actividad registrada correctamente y contacto actualizado</span>
            </div>
          )}
        </form>

        {/* Timeline of Past Activities */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#004aad]" />
              <span>Historial de interacciones ({activities.length})</span>
            </h4>
            <span className="text-[10px] text-slate-400">
              Orden cronológico (más reciente arriba)
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                <Clock className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No hay actividades registradas aún
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Registra llamadas, notas o acuerdos con {contact.name} en el formulario superior para mantener la trazabilidad del cliente.
                </p>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {act.summary}
                          </span>
                          {getOutcomeBadge(act.resultOutcome)}
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">
                          Tipo: <strong className="text-slate-600 dark:text-slate-300">{act.type}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {act.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {act.description && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      {act.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>
                      Asesor: <strong className="text-slate-600 dark:text-slate-300">{act.agentName || 'Sistema'}</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

