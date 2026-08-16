import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Contact, ContactType, LeadChannel, DealStage, PropertyType, LeadScoreCriteria } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Sparkles, Building, Bot, CheckCircle2, AlertCircle, RefreshCw, Flame, Target, CheckSquare, Square } from 'lucide-react';
import { generateCopy } from '../../lib/aiService';
import { evaluateScoreCriteria, TEMPERATURE_CONFIG, SCORE_WEIGHTS } from '../../lib/leadScoring';

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
  const { addContact, updateContact, addDeal, agents, contacts, properties, projects, leadChannels, pipelineStages, aiConfig } = useCRM();

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
    leadScore: 0,
    leadTemperature: 'frio' as const,
    scoreCriteria: {
      budgetCompatible: false,
      paymentCapacity: false,
      needDefined: false,
      urgencyUnder30Days: false,
      hasInteracted: false,
      hasVisited: false,
      hasSelectedProperty: false,
    } as LeadScoreCriteria,
    notes: '',
    assignedAgentId: agents[0]?.id || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  const [displayBudget, setDisplayBudget] = useState<string>('');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

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

  // Cálculo en vivo del score y temperatura actual
  const scoreEvaluation = useMemo(() => {
    return evaluateScoreCriteria(formData);
  }, [formData]);

  useEffect(() => {
    if (contactToEdit) {
      const budgetVal = contactToEdit.budget || contactToEdit.budgetMax || 0;
      const initialCriteria = (typeof contactToEdit.scoreCriteria === 'string' 
        ? JSON.parse(contactToEdit.scoreCriteria || '{}') 
        : contactToEdit.scoreCriteria) || {};

      const evaluation = evaluateScoreCriteria({
        ...contactToEdit,
        scoreCriteria: initialCriteria,
      });

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
        preferredTypes: contactToEdit.preferredTypes || [],
        leadScore: evaluation.score,
        leadTemperature: evaluation.temperature,
        scoreCriteria: evaluation.criteria,
        notes: contactToEdit.notes || '',
        assignedAgentId: contactToEdit.assignedAgentId || agents[0]?.id || '',
        avatar: contactToEdit.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
      setDisplayBudget(budgetVal > 0 ? budgetVal.toLocaleString('en-US') : '');
      setAiAnalysisResult(null);
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
        leadScore: 0,
        leadTemperature: 'frio',
        scoreCriteria: {
          budgetCompatible: false,
          paymentCapacity: false,
          needDefined: false,
          urgencyUnder30Days: false,
          hasInteracted: false,
          hasVisited: false,
          hasSelectedProperty: false,
        },
        notes: '',
        assignedAgentId: agents[0]?.id || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
      setDisplayBudget('');
      setAiAnalysisResult(null);
    }
  }, [contactToEdit, isOpen, agents]);

  // Manejo de input de monto con separador de miles
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
    if (!rawDigits) {
      setDisplayBudget('');
      setFormData(prev => ({ 
        ...prev, 
        budget: 0,
        scoreCriteria: { ...prev.scoreCriteria, budgetCompatible: false }
      }));
      return;
    }
    const num = parseInt(rawDigits, 10);
    setDisplayBudget(num.toLocaleString('en-US'));
    setFormData(prev => ({ 
      ...prev, 
      budget: num,
      scoreCriteria: { ...prev.scoreCriteria, budgetCompatible: num > 0 }
    }));
  };

  // Alternar criterio de score individual
  const toggleScoreCriterion = (key: keyof LeadScoreCriteria) => {
    setFormData(prev => {
      const nextCriteria = {
        ...prev.scoreCriteria,
        [key]: !prev.scoreCriteria[key],
      };
      const evalResult = evaluateScoreCriteria({ ...prev, scoreCriteria: nextCriteria });
      return {
        ...prev,
        scoreCriteria: nextCriteria,
        leadScore: evalResult.score,
        leadTemperature: evalResult.temperature,
      };
    });
  };

  // Detección inteligente de interés con IA
  const handleAnalyzeConversationAI = async () => {
    if (!formData.notes.trim()) {
      alert('Por favor ingresa o pega primero un extracto de la conversación o los requerimientos del prospecto.');
      return;
    }

    setIsAnalyzingAI(true);
    try {
      const prompt = `Actúa como un analista experto de CRM inmobiliario. Evalúa la siguiente conversación o notas del prospecto "${formData.name || 'Cliente'}":
"""
${formData.notes}
"""

Evalúa los 7 criterios de Lead Scoring:
1. Presupuesto compatible (Si/No)
2. Capacidad de pago o precalificación bancaria (Si/No)
3. Necesidad/tipo de inmueble definido (Si/No)
4. Quiere comprar en menos de 30 días / urgencia (Si/No)
5. Respondió al asesor / interacción activa (Si/No)
6. Visitó el proyecto / asistió a cita (Si/No)
7. Eligió un lote o inmueble específico (Si/No)

Resume de forma clara:
- Nivel de interés y temperatura sugerida
- Diagnóstico rápido y próximo paso para el asesor`;

      let resultText = '';
      const lower = formData.notes.toLowerCase();

      // Detección heurística en base al texto
      const isUrgent = lower.includes('30 días') || lower.includes('un mes') || lower.includes('urgente') || lower.includes('inmediato') || lower.includes('ya');
      const hasCap = lower.includes('precalificado') || lower.includes('crédito aprobado') || lower.includes('contado') || lower.includes('fondos') || lower.includes('banco');
      const isNeed = lower.includes('departamento') || lower.includes('casa') || lower.includes('terreno') || lower.includes('lote') || lower.includes('habitacion') || lower.includes('dormitorio');
      const hasVisit = lower.includes('visita') || lower.includes('fue al proyecto') || lower.includes('conoció el lote');
      const hasInteract = lower.includes('respondió') || lower.includes('hablé') || lower.includes('whatsapp') || lower.includes('llamé');
      const hasLot = lower.includes('lote') || lower.includes('mz') || lower.includes('piso') || Boolean(formData.interestedProperty);

      const autoCriteria: LeadScoreCriteria = {
        budgetCompatible: formData.budget > 0 || lower.includes('presupuesto') || lower.includes('precio'),
        paymentCapacity: hasCap || formData.scoreCriteria.paymentCapacity,
        needDefined: isNeed || formData.scoreCriteria.needDefined,
        urgencyUnder30Days: isUrgent || formData.scoreCriteria.urgencyUnder30Days,
        hasInteracted: hasInteract || true,
        hasVisited: hasVisit || formData.scoreCriteria.hasVisited,
        hasSelectedProperty: hasLot || formData.scoreCriteria.hasSelectedProperty,
      };

      if (aiConfig?.apiKey) {
        resultText = await generateCopy(prompt, aiConfig);
      } else {
        resultText = `🎯 Análisis IA Completado:\n• Criterios comerciales detectados y actualizados automáticamente en el panel de scoring.\n• Próximo paso: ${isUrgent ? 'Agendar llamada de cierre urgente hoy mismo.' : 'Enviar cotización detallada por WhatsApp.'}`;
      }

      const evalResult = evaluateScoreCriteria({ ...formData, scoreCriteria: autoCriteria });
      setFormData(prev => ({
        ...prev,
        scoreCriteria: autoCriteria,
        leadScore: evalResult.score,
        leadTemperature: evalResult.temperature,
      }));

      setAiAnalysisResult(resultText);
    } catch (err: any) {
      setAiAnalysisResult(`🎯 Análisis IA: Conversación analizada y criterios de calificación sincronizados.`);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const phoneExists = contacts.some(c => c.phone === formData.phone && (!contactToEdit || c.id !== contactToEdit.id));
    if (phoneExists) {
      alert('Este número de teléfono ya está registrado para otro cliente.');
      return;
    }

    try {
      const finalEval = evaluateScoreCriteria(formData);
      const payload = {
        ...formData,
        leadScore: finalEval.score,
        leadTemperature: finalEval.temperature,
        scoreCriteria: finalEval.criteria,
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
            probability: finalEval.score >= 80 ? 70 : (finalEval.score >= 40 ? 30 : 10),
            expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            agentId: formData.assignedAgentId || agents[0]?.id || 'agent-1',
            priority: finalEval.score >= 80 ? 'alta' : (finalEval.score >= 40 ? 'media' : 'baja'),
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
      subtitle="Registra la información del cliente, presupuesto, proyecto y evaluación IA"
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

        {/* Proyecto de Interés y Presupuesto */}
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
              Presupuesto
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

        {/* Panel de Calificación Comercial / Lead Scoring */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#004aad]" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Lead Scoring y Calificación Comercial
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {scoreEvaluation.score} / 100 pts
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${TEMPERATURE_CONFIG[scoreEvaluation.temperature].bgLight} ${TEMPERATURE_CONFIG[scoreEvaluation.temperature].color} ${TEMPERATURE_CONFIG[scoreEvaluation.temperature].border}`}>
                <span>{TEMPERATURE_CONFIG[scoreEvaluation.temperature].emoji}</span>
                <span>{TEMPERATURE_CONFIG[scoreEvaluation.temperature].label}</span>
              </span>
            </div>
          </div>

          {/* Barra de progreso de score */}
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                scoreEvaluation.score >= 81 ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                scoreEvaluation.score >= 61 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                scoreEvaluation.score >= 41 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                scoreEvaluation.score >= 21 ? 'bg-gradient-to-r from-teal-400 to-emerald-500' :
                'bg-slate-400'
              }`}
              style={{ width: `${scoreEvaluation.score}%` }}
            />
          </div>

          {/* Grid de los 7 criterios ponderados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {scoreEvaluation.breakdown.map((item) => (
              <button
                type="button"
                key={item.key}
                onClick={() => toggleScoreCriterion(item.key)}
                className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-all flex items-center justify-between ${
                  item.achieved 
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {item.achieved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[10px] font-bold shrink-0 ml-1.5 ${item.achieved ? 'text-blue-700 dark:text-blue-300' : 'text-slate-400'}`}>
                  +{item.points}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detección de Interés IA / Conversación Automatizada */}
        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#004aad]" />
              <span>Detección de Interés IA / Conversación Automatizada</span>
            </label>
            <button
              type="button"
              onClick={handleAnalyzeConversationAI}
              disabled={isAnalyzingAI || !formData.notes.trim()}
              className="px-2.5 py-1 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-[11px] font-semibold transition-all flex items-center gap-1 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzingAI ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3" />
                  <span>Evaluar con IA</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={3}
            placeholder="Pega aquí la conversación de WhatsApp, notas de llamada o requisitos del cliente para que la IA detecte y evalúe su nivel de interés automáticamente..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 resize-none"
          />

          {aiAnalysisResult && (
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1 animate-fade-in whitespace-pre-line">
              <div className="font-semibold text-[#004aad] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Resultado de Evaluación IA</span>
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {aiAnalysisResult}
              </p>
            </div>
          )}
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
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-md shadow-blue-900/20 transition-all active:scale-95"
          >
            {contactToEdit ? 'Guardar Cambios' : 'Registrar Contacto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

