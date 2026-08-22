import { z } from 'zod';

// ══════════════════════════════════════════════════
// SCHEMAS
// ══════════════════════════════════════════════════

export const loginSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const agentSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').optional(),
  email: z.string().email('El correo electrónico no es válido').optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  avatar: z.string().url('El avatar debe ser una URL válida').optional().or(z.literal('')),
  active: z.boolean().optional(),
});

export const propertySchema = z.object({
  code: z.string().optional().or(z.literal('')),
  title: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  type: z.string().optional().or(z.literal('')),
  operation: z.string().optional().or(z.literal('')),
  price: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  currency: z.string().optional(),
  areaTotal: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  areaBuilt: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  bedrooms: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  bathrooms: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  parkingSpots: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  address: z.string().optional().or(z.literal('')),
  zone: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  features: z.array(z.string()).optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
  agentId: z.string().optional().or(z.literal('')),
  commissionPct: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  featured: z.boolean().optional(),
  projectName: z.string().optional().or(z.literal('')),
  developer: z.string().optional().or(z.literal('')),
  priceMax: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  areaMax: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  soldPercentage: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  isProject: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  projectId: z.string().optional().or(z.literal('')).nullable(),
});

export const projectSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().optional().or(z.literal('')).nullable(),
  developer: z.string().optional().or(z.literal('')).nullable(),
  type: z.string().optional().or(z.literal('')).nullable(),
  operation: z.string().optional().or(z.literal('')).nullable(),
  currency: z.string().optional().nullable(),
  priceMin: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional().nullable(),
  priceMax: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional().nullable(),
  areaMin: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional().nullable(),
  areaMax: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional().nullable(),
  soldPercentage: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional().nullable(),
  status: z.string().optional().nullable(),
  address: z.string().optional().or(z.literal('')).nullable(),
  zone: z.string().optional().or(z.literal('')).nullable(),
  city: z.string().optional().or(z.literal('')).nullable(),
  features: z.array(z.string()).optional().nullable(),
  description: z.string().optional().or(z.literal('')).nullable(),
  images: z.array(z.string()).optional().nullable(),
  isPublic: z.boolean().optional().nullable(),
  featured: z.boolean().optional().nullable(),
  isProject: z.boolean().optional().nullable(),
  contactName: z.string().optional().or(z.literal('')).nullable(),
  contactEmail: z.string().optional().or(z.literal('')).nullable(),
  contactPhone: z.string().optional().or(z.literal('')).nullable(),
  notes: z.string().optional().or(z.literal('')).nullable(),
}).passthrough();

export const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal('')).nullable(),
  phone: z.string().optional().or(z.literal('')).nullable(),
  type: z.string().optional(),
  channel: z.string().optional(),
  budgetMin: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  budgetMax: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  budget: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  currency: z.string().optional(),
  pipelineStage: z.string().optional(),
  interestedProperty: z.string().optional().or(z.literal('')),
  preferredZones: z.array(z.string()).optional(),
  preferredTypes: z.array(z.string()).optional(),
  leadScore: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  leadTemperature: z.string().optional(),
  scoreCriteria: z.any().optional(),
  notes: z.string().optional().or(z.literal('')),
  assignedAgentId: z.string().optional().or(z.literal('')).nullable(),
  nextFollowUpDate: z.string().optional().nullable(),
  statusFollowUp: z.string().optional(),
  avatar: z.string().optional().or(z.literal('')),
}).passthrough();

export const dealSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional().or(z.literal('')),
  leadId: z.string().optional().or(z.literal('')).nullable(),
  propertyId: z.string().optional().or(z.literal('')).nullable(),
  stage: z.string().optional(),
  value: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  currency: z.string().optional(),
  probability: z.union([z.number(), z.string().transform(v => Number(v) || 0)]).optional(),
  expectedCloseDate: z.string().optional().nullable(),
  agentId: z.string().optional().or(z.literal('')).nullable(),
  priority: z.string().optional(),
  notes: z.string().optional().or(z.literal('')),
}).passthrough();

export const taskSchema = z.object({
  title: z.string().min(3, 'El título es requerido').optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional(),
  status: z.enum(['pendiente', 'en_progreso', 'completada']).optional(),
  dueDate: z.string().min(1, 'La fecha de vencimiento es requerida').optional(),
  dueTime: z.string().optional(),
  agentId: z.string().min(1, 'El agente es requerido').optional(),
  contactId: z.string().optional().nullable(),
  propertyId: z.string().optional().nullable(),
  dealId: z.string().optional().nullable(),
});

export const appointmentSchema = z.object({
  title: z.string().min(3, 'El título es requerido').optional(),
  propertyId: z.string().optional().nullable(),
  contactId: z.string().min(1, 'El contacto es requerido').optional(),
  agentId: z.string().min(1, 'El agente es requerido').optional(),
  date: z.string().min(1, 'La fecha es requerida').optional(),
  time: z.string().min(1, 'La hora es requerida').optional(),
  durationMinutes: z.number().min(5).optional(),
  status: z.enum(['programada', 'completada', 'cancelada', 'reprogramada']).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// ══════════════════════════════════════════════════
// MIDDLEWARE FACTORY
// ══════════════════════════════════════════════════

export const validateData = (schema) => {
  return (req, res, next) => {
    try {
      // Usar partial() para permitir actualizaciones parciales (PUT) si es necesario,
      // pero como ya hicimos los campos opcionales en el schema base, no es necesario.
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formatear errores para el cliente
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json({ error: 'Validación fallida', details: errorMessages });
      }
      next(error);
    }
  };
};
