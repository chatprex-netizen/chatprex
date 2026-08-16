import { Contact, LeadScoreCriteria, LeadTemperature, LeadActivity } from '../types';

export const SCORE_WEIGHTS = {
  budgetCompatible: 20,    // Presupuesto compatible
  paymentCapacity: 15,     // Tiene capacidad de pago
  needDefined: 15,         // Necesidad definida
  urgencyUnder30Days: 20,  // Quiere comprar en menos de 30 días
  hasInteracted: 10,       // Respondió al asesor
  hasVisited: 15,          // Visitó el proyecto
  hasSelectedProperty: 5,  // Eligió un inmueble/lote específico
} as const;

export const TEMPERATURE_CONFIG: Record<
  LeadTemperature,
  {
    label: string;
    range: string;
    color: string;
    bgLight: string;
    border: string;
    emoji: string;
    priority: number;
  }
> = {
  muy_caliente: {
    label: 'Muy Caliente / Cierre',
    range: '81 - 100',
    color: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-300 dark:border-rose-800',
    emoji: '🔥',
    priority: 1,
  },
  caliente: {
    label: 'Caliente',
    range: '61 - 80',
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-300 dark:border-amber-800',
    emoji: '🔴',
    priority: 2,
  },
  calificado: {
    label: 'Calificado',
    range: '41 - 60',
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-300 dark:border-blue-800',
    emoji: '🟠',
    priority: 3,
  },
  interesado: {
    label: 'Interesado',
    range: '21 - 40',
    color: 'text-teal-600 dark:text-teal-400',
    bgLight: 'bg-teal-50 dark:bg-teal-500/10',
    border: 'border-teal-300 dark:border-teal-800',
    emoji: '🟡',
    priority: 4,
  },
  frio: {
    label: 'Frío',
    range: '0 - 20',
    color: 'text-slate-500 dark:text-slate-400',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
    emoji: '🔵',
    priority: 5,
  },
};

export function getTemperatureFromScore(score: number): LeadTemperature {
  if (score >= 81) return 'muy_caliente';
  if (score >= 61) return 'caliente';
  if (score >= 41) return 'calificado';
  if (score >= 21) return 'interesado';
  return 'frio';
}

export function evaluateScoreCriteria(
  contact: Partial<Contact>,
  activities: LeadActivity[] = []
): {
  criteria: LeadScoreCriteria;
  score: number;
  temperature: LeadTemperature;
  breakdown: Array<{ key: keyof LeadScoreCriteria; label: string; points: number; achieved: boolean }>;
} {
  const explicit = contact.scoreCriteria || {};

  // Detección automática o valor manual
  const budgetVal = typeof contact.budget === 'number' ? contact.budget : parseFloat((contact.budget as any) || '0');
  const budgetCompatible = explicit.budgetCompatible ?? (budgetVal > 0);

  const paymentCapacity = explicit.paymentCapacity ?? false;

  const hasDefinedNeeds = Boolean(
    (contact.preferredZones && contact.preferredZones.length > 0) ||
    (contact.preferredTypes && contact.preferredTypes.length > 0) ||
    (contact.notes && contact.notes.trim().length > 15)
  );
  const needDefined = explicit.needDefined ?? hasDefinedNeeds;

  const urgencyUnder30Days = explicit.urgencyUnder30Days ?? false;

  const hasInteractedActivities = activities.some(
    (a) => a.type === 'llamada' || a.type === 'whatsapp' || a.outcome === 'respondio' || a.outcome === 'interesado'
  );
  const hasInteracted = explicit.hasInteracted ?? (Boolean(contact.lastContactDate) || hasInteractedActivities);

  const hasVisitedActivity = activities.some((a) => a.type === 'visita' || a.outcome === 'asistio');
  const isVisitedStage = contact.pipelineStage === 'visita_realizada' || contact.pipelineStage === 'negociacion' || contact.pipelineStage === 'reserva' || contact.pipelineStage === 'ganado';
  const hasVisited = explicit.hasVisited ?? (hasVisitedActivity || isVisitedStage);

  const hasSelectedProp = Boolean(contact.interestedProperty && contact.interestedProperty.trim().length > 0);
  const hasSelectedProperty = explicit.hasSelectedProperty ?? hasSelectedProp;

  const criteria: LeadScoreCriteria = {
    budgetCompatible,
    paymentCapacity,
    needDefined,
    urgencyUnder30Days,
    hasInteracted,
    hasVisited,
    hasSelectedProperty,
  };

  let score = 0;
  if (criteria.budgetCompatible) score += SCORE_WEIGHTS.budgetCompatible;
  if (criteria.paymentCapacity) score += SCORE_WEIGHTS.paymentCapacity;
  if (criteria.needDefined) score += SCORE_WEIGHTS.needDefined;
  if (criteria.urgencyUnder30Days) score += SCORE_WEIGHTS.urgencyUnder30Days;
  if (criteria.hasInteracted) score += SCORE_WEIGHTS.hasInteracted;
  if (criteria.hasVisited) score += SCORE_WEIGHTS.hasVisited;
  if (criteria.hasSelectedProperty) score += SCORE_WEIGHTS.hasSelectedProperty;

  score = Math.min(100, Math.max(0, score));
  const temperature = getTemperatureFromScore(score);

  const breakdown = [
    { key: 'budgetCompatible' as const, label: 'Presupuesto compatible', points: SCORE_WEIGHTS.budgetCompatible, achieved: criteria.budgetCompatible },
    { key: 'urgencyUnder30Days' as const, label: 'Compra en menos de 30 días', points: SCORE_WEIGHTS.urgencyUnder30Days, achieved: criteria.urgencyUnder30Days },
    { key: 'paymentCapacity' as const, label: 'Capacidad de pago / Precalificado', points: SCORE_WEIGHTS.paymentCapacity, achieved: criteria.paymentCapacity },
    { key: 'needDefined' as const, label: 'Necesidad y requerimientos definidos', points: SCORE_WEIGHTS.needDefined, achieved: criteria.needDefined },
    { key: 'hasVisited' as const, label: 'Visitó el proyecto / inmueble', points: SCORE_WEIGHTS.hasVisited, achieved: criteria.hasVisited },
    { key: 'hasInteracted' as const, label: 'Respondió al asesor comercial', points: SCORE_WEIGHTS.hasInteracted, achieved: criteria.hasInteracted },
    { key: 'hasSelectedProperty' as const, label: 'Eligió lote/inmueble específico', points: SCORE_WEIGHTS.hasSelectedProperty, achieved: criteria.hasSelectedProperty },
  ];

  return { criteria, score, temperature, breakdown };
}
