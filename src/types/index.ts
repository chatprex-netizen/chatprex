export type Page =
  | 'dashboard'
  | 'properties'
  | 'pipeline'
  | 'tasks'
  | 'messages'
  | 'contacts'
  | 'calendar'
  | 'contracts'
  | 'ai-copilot'
  | 'ai-assistants'
  | 'campaigns'
  | 'whatsapp-config'
  | 'messenger-config'
  | 'instagram-config'
  | 'hubspot-config'
  | 'settings'
  | 'finances';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PropertyType = 
  | 'departamento' 
  | 'casa' 
  | 'penthouse' 
  | 'terreno' 
  | 'oficina' 
  | 'local_comercial' 
  | 'proyecto_preventa';

export type PropertyOperation = 'venta' | 'alquiler' | 'preventa';

export type PropertyStatus = 
  | 'disponible' 
  | 'en_negociacion' 
  | 'reservada' 
  | 'vendida' 
  | 'alquilada';

export interface Property {
  id: string;
  code: string;
  title: string;
  description: string;
  type: PropertyType;
  operation: PropertyOperation;
  price: number;
  currency: 'USD' | 'EUR' | 'MXN' | 'PEN';
  areaTotal: number;
  areaBuilt: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  address: string;
  zone: string;
  city: string;
  features: string[];
  status: PropertyStatus;
  images: string[];
  agentId: string;
  commissionPct: number;
  featured?: boolean;
  projectName?: string;
  developer?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export type DealStage =
  | 'nuevo_prospecto'
  | 'contactado'
  | 'visita_programada'
  | 'visita_realizada'
  | 'negociacion'
  | 'reserva'
  | 'ganado'
  | 'perdido';

export interface PipelineStageConfig {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  order: number;
}

export interface Deal {
  id: string;
  title: string;
  leadId: string;
  propertyId?: string;
  stage: DealStage;
  value: number;
  currency: 'USD' | 'EUR' | 'MXN' | 'PEN';
  probability: number;
  expectedCloseDate: string;
  agentId: string;
  priority: 'alta' | 'media' | 'baja';
  notes: string;
  createdAt: string;
}

export type ContactType = 'comprador' | 'propietario' | 'inversionista' | 'inquilino';
export type LeadChannel = string;

export interface LeadChannelConfig {
  id: string;
  name: string;
  color: string;
  details?: string;
  visible: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: ContactType;
  channel: LeadChannel;
  budgetMin?: number;
  budgetMax?: number;
  budget?: number;
  currency?: string;
  pipelineStage?: DealStage;
  interestedProperty?: string;
  preferredZones: string[];
  preferredTypes: PropertyType[];
  leadScore: number; // 0 - 100
  notes: string;
  assignedAgentId: string;
  lastContactDate: string;
  nextFollowUpDate?: string;
  statusFollowUp?: 'al_dia' | 'proximo' | 'urgente' | 'sin_contacto';
  createdAt: string;
}

export type TaskType = 
  | 'llamada' 
  | 'whatsapp' 
  | 'visita' 
  | 'correo' 
  | 'documentacion' 
  | 'firma_contrato' 
  | 'seguimiento_general';

export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: 'alta' | 'media' | 'baja';
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  agentId: string;
  contactId?: string;
  propertyId?: string;
  dealId?: string;
  completedAt?: string;
  createdAt: string;
}

export type LeadActivityType = 
  | 'llamada' 
  | 'whatsapp' 
  | 'visita' 
  | 'correo' 
  | 'nota' 
  | 'cambio_etapa' 
  | 'oferta_recibida'
  | 'tarea';

export interface LeadActivity {
  id: string;
  contactId: string;
  agentId: string;
  agentName: string;
  type: LeadActivityType;
  summary: string;
  description?: string;
  resultOutcome?: 'interesado' | 'solicito_visita' | 'no_contesto' | 'pidio_descuento' | 'descartado' | 'neutro';
  timestamp: string;
}

export type AppointmentStatus = 'programada' | 'confirmada' | 'realizada' | 'cancelada';

export interface Appointment {
  id: string;
  title: string;
  propertyId: string;
  contactId: string;
  agentId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  location: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'contact' | 'agent' | 'system';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  propertyAttachment?: Property;
  isPrivateNote?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  channel: 'whatsapp' | 'instagram' | 'webchat' | 'email';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'open' | 'pending' | 'resolved';
  assignedAgentId: string;
}

export type AgentRole = 'propietario' | 'supervisor' | 'agente' | 'asistente';

export interface Agent {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: AgentRole;
  avatar: string;
  active: boolean;
  activeDealsCount: number;
  salesVolume: number;
}

export interface Commission {
  id: string;
  dealId: string;
  propertyTitle: string;
  clientName: string;
  agentId: string;
  agentName: string;
  totalSale: number;
  commissionTotal: number;
  agencyAmount: number;
  agentAmount: number;
  status: 'pendiente' | 'facturado' | 'pagado';
  date: string;
}

export type ContractType = 'Separación' | 'Compraventa' | 'Arras' | 'Alquiler';
export type ContractStatus = 'Firmado' | 'Enviado' | 'Pendiente' | 'Borrador';

export interface Contract {
  id: string;
  code: string;
  type: ContractType;
  amount: number;
  currency: string;
  unit: string;
  propertyId?: string;
  client: string;
  contactId?: string;
  agentId?: string;
  createdDate: string;
  status: ContractStatus;
  notes?: string;
  clientDniRuc?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientMaritalStatus?: 'Soltero/a' | 'Casado/a' | 'Divorciado/a' | 'Viudo/a' | string;
  spouseName?: string;
  spouseDni?: string;
}

export type FinanceTransactionType = 'ingreso' | 'egreso';

export type FinanceStatus = 'pagado' | 'pendiente';

export const INCOME_CATEGORIES = [
  'Comisión por venta',
  'Comisión por alquiler',
  'Bono',
  'Venta directa',
  'Otro ingreso',
] as const;

export const EXPENSE_CATEGORIES = [
  'Comisión a agente',
  'Alquiler de oficina',
  'Publicidad',
  'Luz',
  'Agua',
  'Internet y telefonía',
  'Planilla',
  'Otro egreso',
] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type FinanceCategory = IncomeCategory | ExpenseCategory;

export interface FinanceTransaction {
  id: string;
  type: FinanceTransactionType;
  category: FinanceCategory;
  description: string;
  amount: number;
  currency: string;
  date: string; // YYYY-MM-DD
  status: FinanceStatus;
  agentId?: string;
  createdAt: string;
}

export interface AppBranding {
  logoUrl: string | null;
  faviconUrl: string | null;
  appName: string;
  appDescription: string;
}
