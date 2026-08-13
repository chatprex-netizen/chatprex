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
  code: z.string().min(1, 'El código es requerido').optional(),
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').optional(),
  description: z.string().optional(),
  type: z.string().min(1, 'El tipo es requerido').optional(),
  operation: z.string().min(1, 'La operación es requerida').optional(),
  price: z.number().min(0, 'El precio no puede ser negativo').optional(),
  currency: z.string().optional(),
  areaTotal: z.number().min(0).optional(),
  areaBuilt: z.number().min(0).optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parkingSpots: z.number().min(0).optional(),
  address: z.string().min(1, 'La dirección es requerida').optional(),
  zone: z.string().min(1, 'La zona es requerida').optional(),
  city: z.string().min(1, 'La ciudad es requerida').optional(),
  features: z.array(z.string()).optional(),
  status: z.enum(['disponible', 'separado', 'vendido', 'alquilado']).optional(),
  images: z.array(z.string()).optional(),
  agentId: z.string().min(1, 'El agente asignado es requerido').optional(),
  commissionPct: z.number().min(0).max(100).optional(),
  featured: z.boolean().optional(),
  projectName: z.string().optional(),
  developer: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').optional(),
  email: z.string().email('El correo electrónico no es válido').optional().or(z.literal('')),
  phone: z.string().min(1, 'El teléfono es requerido').optional(),
  type: z.string().optional(),
  channel: z.string().optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().optional(),
  pipelineStage: z.string().optional(),
  interestedProperty: z.string().optional(),
  preferredZones: z.array(z.string()).optional(),
  preferredTypes: z.array(z.string()).optional(),
  leadScore: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  assignedAgentId: z.string().min(1, 'El agente asignado es requerido').optional(),
  nextFollowUpDate: z.string().optional().nullable(),
  statusFollowUp: z.enum(['al_dia', 'proximo', 'urgente', 'sin_contacto']).optional(),
});

export const dealSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').optional(),
  leadId: z.string().min(1, 'El contacto es requerido').optional(),
  propertyId: z.string().optional(),
  stage: z.string().optional(),
  value: z.number().min(0, 'El valor no puede ser negativo').optional(),
  currency: z.string().optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().optional().nullable(),
  agentId: z.string().min(1, 'El agente es requerido').optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional(),
  notes: z.string().optional(),
});

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
        const errorMessages = error.errors.map(err => \`\${err.path.join('.')}: \${err.message}\`);
        return res.status(400).json({ error: 'Validación fallida', details: errorMessages });
      }
      next(error);
    }
  };
};
