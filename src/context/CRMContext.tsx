import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Property, 
  Deal, 
  Contact, 
  Appointment, 
  Conversation, 
  ChatMessage, 
  Agent, 
  Commission, 
  DealStage, 
  AppointmentStatus,
  Task,
  LeadActivity,
  Contract,
  ContractStatus,
  FinanceTransaction,
  PipelineStageConfig,
  LeadChannelConfig,
  Project,
  PropertyStatus,
  PaginatedResponse,
  AppBranding,
  AIConfig
} from '../types';
import { apiClient } from '../lib/api-client';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

interface CRMContextType {
  properties: Property[];
  deals: Deal[];
  contacts: Contact[];
  appointments: Appointment[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  agents: Agent[];
  commissions: Commission[];
  tasks: Task[];
  contracts: Contract[];
  financeTransactions: FinanceTransaction[];
  leadActivities: Record<string, LeadActivity[]>;
  pipelineStages: PipelineStageConfig[];
  leadChannels: LeadChannelConfig[];
  projects: Project[];
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  currentAgent: Agent;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  appBranding: AppBranding;
  updateBranding: (branding: Partial<AppBranding>) => void;
  aiConfig: AIConfig;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  
  // Acciones de Etapas, Canales y Proyectos
  addPipelineStage: (stage: Omit<PipelineStageConfig, 'id'>) => Promise<void>;
  updatePipelineStage: (id: string, stage: Partial<PipelineStageConfig>) => Promise<void>;
  deletePipelineStage: (id: string) => Promise<void>;
  addLeadChannel: (channel: Omit<LeadChannelConfig, 'id'>) => Promise<void>;
  updateLeadChannel: (id: string, channel: Partial<LeadChannelConfig>) => Promise<void>;
  deleteLeadChannel: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Acciones de Agentes / Usuarios
  addAgent: (agent: Omit<Agent, 'id'>) => Promise<void>;
  updateAgent: (id: string, agent: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  
  // Paginación y Filtrado
  fetchProperties: (page?: number, search?: string) => Promise<void>;
  fetchContacts: (page?: number, search?: string) => Promise<void>;
  fetchDeals: (page?: number, search?: string, kanban?: boolean) => Promise<void>;
  fetchTasks: (startDate?: string, endDate?: string) => Promise<void>;
  fetchAppointments: (startDate?: string, endDate?: string) => Promise<void>;
  
  propertiesTotal: number;
  contactsTotal: number;
  dealsTotal: number;
  
  // Acciones de Propiedades
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<Property>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Acciones de Pipeline / Deals
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Promise<Deal>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<string | void>;
  moveDealStage: (dealId: string, newStage: DealStage) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  
  // Acciones de Contactos / Leads
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'lastContactDate'>) => Promise<Contact>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Acciones de Contratos
  addContract: (contract: Omit<Contract, 'id' | 'createdDate'>) => Promise<void>;
  updateContract: (id: string, contract: Partial<Contract>) => Promise<void>;
  updateContractStatus: (id: string, status: ContractStatus) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;

  // Acciones de Finanzas
  addFinanceTransaction: (transaction: Omit<FinanceTransaction, 'id' | 'createdAt'>) => Promise<void>;
  updateFinanceTransaction: (id: string, transaction: Partial<FinanceTransaction>) => Promise<void>;
  deleteFinanceTransaction: (id: string) => Promise<void>;

  // Acciones de Seguimiento de Leads
  addLeadActivity: (contactId: string, activity: Omit<LeadActivity, 'id' | 'contactId' | 'timestamp' | 'agentId' | 'agentName'>) => Promise<void>;
  updateLeadNextContact: (contactId: string, nextFollowUpDate: string, statusFollowUp?: 'al_dia' | 'proximo' | 'urgente' | 'sin_contacto') => Promise<void>;
  updateLeadScore: (contactId: string, points: number) => Promise<void>;
  
  // Acciones de Tareas
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Acciones de Citas / Agenda
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, updated: Partial<Appointment>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  
  // Acciones de Chat & Mensajería
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string, propertyAttachment?: Property, isPrivateNote?: boolean) => Promise<void>;
  
  // Notificaciones
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Reiniciar datos de prueba
  resetToDemoData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'prexup_data_v3_';

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesTotal, setPropertiesTotal] = useState(0);

  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealsTotal, setDealsTotal] = useState(0);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsTotal, setContactsTotal] = useState(0);

  const [contracts, setContracts] = useState<Contract[]>([]);

  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [leadActivities, setLeadActivities] = useState<Record<string, LeadActivity[]>>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStageConfig[]>([]);
  const [leadChannels, setLeadChannels] = useState<LeadChannelConfig[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentAgent, setCurrentAgent] = useState<Agent>({
    id: 'agent-admin',
    name: 'Administrador',
    email: 'admin@prexup.com',
    role: 'propietario',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    active: true,
    activeDealsCount: 0,
    salesVolume: 0,
    phone: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [appBranding, setAppBranding] = useState<AppBranding>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'appBranding');
    return saved ? JSON.parse(saved) : {
      logoUrl: null,
      faviconUrl: null,
      appName: 'ChatPrex',
      appDescription: 'Gestión inteligente para tu negocio',
    };
  });

  const updateBranding = (branding: Partial<AppBranding>) => {
    setAppBranding((prev) => {
      const updated = { ...prev, ...branding };
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'appBranding', JSON.stringify(updated));
      return updated;
    });
  };

  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'aiConfig');
    return saved ? JSON.parse(saved) : {
      provider: 'deepseek',
      apiKey: 'sk-31e59cacf030463c83f93e1dab497a7a',
      model: 'deepseek-chat',
    };
  });

  const updateAIConfig = (config: Partial<AIConfig>) => {
    setAiConfig((prev) => {
      const updated = { ...prev, ...config };
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'aiConfig', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (appBranding.faviconUrl) {
      const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = appBranding.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    document.title = appBranding.appName;
  }, [appBranding]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Fetch all CRM data directly from database on mount
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [
        propertiesData, dealsData, contactsData, contractsData, 
        financeData, pipelineStagesData, leadChannelsData, projectsData, agentsData,
        tasksData, appointmentsData, notificationsData
      ] = await Promise.allSettled([
        apiClient.get<PaginatedResponse<Property>>('/properties?limit=100'),
        apiClient.get<PaginatedResponse<Deal>>('/deals?limit=100'),
        apiClient.get<PaginatedResponse<Contact>>('/contacts?limit=100'),
        apiClient.get<Contract[]>('/contracts'),
        apiClient.get<FinanceTransaction[]>('/finance-transactions'),
        apiClient.get<PipelineStageConfig[]>('/pipeline-stages'),
        apiClient.get<LeadChannelConfig[]>('/lead-channels'),
        apiClient.get<Project[]>('/projects'),
        apiClient.get<Agent[]>('/agents'),
        apiClient.get<Task[]>('/tasks'),
        apiClient.get<Appointment[]>('/appointments'),
        apiClient.get<NotificationItem[]>('/notifications'),
      ]);

      if (propertiesData.status === 'fulfilled' && propertiesData.value?.data) {
        setProperties(propertiesData.value.data);
        setPropertiesTotal(propertiesData.value.total || propertiesData.value.data.length);
      }
      if (dealsData.status === 'fulfilled' && dealsData.value?.data) {
        setDeals(dealsData.value.data);
        setDealsTotal(dealsData.value.total || dealsData.value.data.length);
      }
      if (contactsData.status === 'fulfilled' && contactsData.value?.data) {
        // Initial set; may be overridden below by urgency evaluation
        setContacts(contactsData.value.data);
        setContactsTotal(contactsData.value.total || contactsData.value.data.length);
      }
      if (contractsData.status === 'fulfilled' && Array.isArray(contractsData.value)) {
        setContracts(contractsData.value);
      }
      if (financeData.status === 'fulfilled' && Array.isArray(financeData.value)) {
        setFinanceTransactions(financeData.value);
      }
      if (pipelineStagesData.status === 'fulfilled' && Array.isArray(pipelineStagesData.value)) {
        setPipelineStages(pipelineStagesData.value);
      }
      if (leadChannelsData.status === 'fulfilled' && Array.isArray(leadChannelsData.value)) {
        setLeadChannels(leadChannelsData.value);
      }
      if (projectsData.status === 'fulfilled' && Array.isArray(projectsData.value)) {
        setProjects(projectsData.value);
      }
      if (agentsData.status === 'fulfilled' && Array.isArray(agentsData.value)) {
        setAgents(agentsData.value);
      }

      let loadedTasks: Task[] = [];
      let loadedAppointments: Appointment[] = [];
      if (tasksData.status === 'fulfilled' && Array.isArray(tasksData.value)) {
        loadedTasks = tasksData.value;
        setTasks(loadedTasks);
      }
      if (appointmentsData.status === 'fulfilled' && Array.isArray(appointmentsData.value)) {
        loadedAppointments = appointmentsData.value;
        setAppointments(loadedAppointments);
      }

      if (notificationsData.status === 'fulfilled' && Array.isArray(notificationsData.value)) {
        setNotifications(notificationsData.value);
      }

      // Evaluar tareas vencidas para marcar contactos como 'urgente' y buscar leads fríos
      if (contactsData.status === 'fulfilled' && contactsData.value?.data) {
        const now = new Date();
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const urgentContactIds = new Set<string>();

        loadedTasks.forEach(t => {
          if (t.status === 'pendiente' && new Date(t.dueDate) < now && t.contactId) {
            urgentContactIds.add(t.contactId);
          }
        });

        loadedAppointments.forEach(a => {
          if (a.status === 'programada' && new Date(`${a.date}T${a.time || '00:00'}`) < now && a.contactId) {
            urgentContactIds.add(a.contactId);
          }
        });

        const updatedContacts = [...contactsData.value.data];
        let stateChanged = false;

        for (let i = 0; i < updatedContacts.length; i++) {
          const c = updatedContacts[i];
          let updated = false;

          // Urgency check
          if (urgentContactIds.has(c.id) && c.statusFollowUp !== 'urgente') {
            c.statusFollowUp = 'urgente';
            updated = true;
          }

          // Cold lead check
          const lastContactDate = c.lastContactDate ? new Date(c.lastContactDate) : new Date(c.createdAt || Date.now());
          const daysSinceContact = (now.getTime() - lastContactDate.getTime());
          if (daysSinceContact > SEVEN_DAYS_MS && c.statusFollowUp !== 'sin_contacto' && c.pipelineStage !== 'ganado' && c.pipelineStage !== 'perdido') {
            c.statusFollowUp = 'sin_contacto';
            updated = true;
            
            // Generate auto-task for cold lead
            const taskId = `task-auto-${Date.now()}-${c.id}`;
            apiClient.post('/tasks', {
              id: taskId,
              title: `Seguimiento automático: Lead Frío (${c.name})`,
              description: `El contacto no ha tenido interacción en más de 7 días. Último contacto: ${lastContactDate.toLocaleDateString('es-ES')}`,
              type: 'seguimiento_general',
              priority: 'media',
              status: 'pendiente',
              dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              agentId: c.assignedAgentId || 'agent-1',
              contactId: c.id
            }).catch(console.error);

            // Add notification
            apiClient.post('/notifications', {
              title: 'Lead Frío Detectado',
              message: `El contacto ${c.name} lleva más de 7 días sin interacción. Tarea de seguimiento creada.`,
              type: 'warning'
            }).catch(console.error);
          }

          if (updated) {
            apiClient.put('/contacts/' + c.id, { statusFollowUp: c.statusFollowUp }).catch(() => {});
            stateChanged = true;
          }
        }

        if (stateChanged) {
          setContacts(updatedContacts);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de PostgreSQL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchProperties = async (page = 1, search = '') => {
    try {
      const res = await apiClient.get<PaginatedResponse<Property>>(`/properties?page=${page}&limit=12&search=${encodeURIComponent(search)}`);
      setProperties(res.data || []);
      setPropertiesTotal(res.total || 0);
    } catch(e) {}
  };

  const fetchContacts = async (page = 1, search = '') => {
    try {
      const res = await apiClient.get<PaginatedResponse<Contact>>(`/contacts?page=${page}&limit=12&search=${encodeURIComponent(search)}`);
      setContacts(res.data || []);
      setContactsTotal(res.total || 0);
    } catch(e) {}
  };

  const fetchDeals = async (page = 1, search = '', kanban = false) => {
    try {
      const res = await apiClient.get<PaginatedResponse<Deal>>(`/deals?page=${page}&limit=50&search=${encodeURIComponent(search)}&kanban=${kanban}`);
      setDeals(res.data || []);
      setDealsTotal(res.total || 0);
    } catch(e) {}
  };

  const fetchTasks = async (startDate?: string, endDate?: string) => {
    try {
      let url = '/tasks';
      if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
      const data = await apiClient.get<Task[]>(url);
      setTasks(Array.isArray(data) ? data : []);
    } catch(e) {}
  };

  const fetchAppointments = async (startDate?: string, endDate?: string) => {
    try {
      let url = '/appointments';
      if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
      const data = await apiClient.get<Appointment[]>(url);
      setAppointments(Array.isArray(data) ? data : []);
    } catch(e) {}
  };

  // Manejo de Etapas, Canales y Proyectos
  const login = async (email: string, pass: string) => {
    try {
      const res = await apiClient.post<{token: string, agent: Agent}>('/auth/login', { email, password: pass });
      localStorage.setItem('prexup_auth_token', res.token);
      setCurrentAgent(res.agent);
      setIsAuthenticated(true);
      await fetchAllData();
    } catch (e: any) {
      console.warn("Login directo o demo:", e);
      setIsAuthenticated(true);
      await fetchAllData();
    }
  };

  const logout = () => {
    localStorage.removeItem('prexup_auth_token');
    setIsAuthenticated(false);
    setCurrentAgent({} as Agent);
  };

  const addPipelineStage = async (newStage: Omit<PipelineStageConfig, 'id'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/pipeline-stages', newStage);
      setPipelineStages(prev => [...prev, { ...newStage, id: res.id }]);
    } catch(err: any) { console.error(err); return err.message; }
  };
  const updatePipelineStage = async (id: string, updated: Partial<PipelineStageConfig>) => {
    try {
      await apiClient.put('/pipeline-stages/' + id, updated);
      setPipelineStages(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deletePipelineStage = async (id: string) => {
    try {
      await apiClient.delete('/pipeline-stages/' + id);
      setPipelineStages(prev => prev.filter(s => s.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const addLeadChannel = async (newChannel: Omit<LeadChannelConfig, 'id'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/lead-channels', newChannel);
      setLeadChannels(prev => [...prev, { ...newChannel, id: res.id }]);
    } catch(err: any) { console.error(err); return err.message; }
  };
  const updateLeadChannel = async (id: string, updated: Partial<LeadChannelConfig>) => {
    try {
      await apiClient.put('/lead-channels/' + id, updated);
      setLeadChannels(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteLeadChannel = async (id: string) => {
    try {
      await apiClient.delete('/lead-channels/' + id);
      setLeadChannels(prev => prev.filter(c => c.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const addProject = async (newProj: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/projects', newProj);
      setProjects(prev => [...prev, { ...newProj, id: res.id, createdAt: new Date().toISOString() }]);
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    try {
      await apiClient.put('/projects/' + id, updated);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiClient.delete('/projects/' + id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Manejo de Agentes
  const addAgent = async (newAgent: Omit<Agent, 'id'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/agents', newAgent);
      setAgents(prev => [...prev, { ...newAgent, id: res.id }]);
    } catch(err: any) { console.error(err); throw err; }
  };

  const updateAgent = async (id: string, updated: Partial<Agent>) => {
    try {
      await apiClient.put('/agents/' + id, updated);
      setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    } catch(err: any) { console.error(err); throw err; }
  };

  const deleteAgent = async (id: string) => {
    try {
      await apiClient.delete('/agents/' + id);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch(err: any) { console.error(err); throw err; }
  };

  // Manejo de Propiedades
  const addProperty = async (newProp: Omit<Property, 'id' | 'createdAt'>) => {
    try {
      const res = await apiClient.post<{id: string, message: string}>('/properties', newProp);
      const property: Property = {
        ...newProp,
        id: res.id || `prop-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProperties(prev => [property, ...prev]);
      setPropertiesTotal(prev => prev + 1);
      return property;
    } catch(err: any) {
      console.error('Error al registrar propiedad en backend:', err);
      throw err;
    }
  };

  const updateProperty = async (id: string, updated: Partial<Property>) => {
    try {
      await apiClient.put('/properties/' + id, updated);
      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch(err: any) { console.error(err); throw err; }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiClient.delete('/properties/' + id);
      setProperties(prev => prev.filter(p => p.id !== id));
      setPropertiesTotal(prev => Math.max(0, prev - 1));
    } catch(err: any) { console.error(err); throw err; }
  };

  // Manejo de Deals
  const addDeal = async (newDeal: Omit<Deal, 'id' | 'createdAt'>) => {
    try {
      const res = await apiClient.post<{id: string, message: string}>('/deals', newDeal);
      const deal: Deal = {
        ...newDeal,
        id: res.id || `deal-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setDeals(prev => [deal, ...prev]);
      setDealsTotal(prev => prev + 1);
      return deal;
    } catch(err: any) {
      console.error('Error al registrar deal en backend:', err);
      throw err;
    }
  };

  const updateDeal = async (id: string, updated: Partial<Deal>) => {
    try {
      await apiClient.put('/deals/' + id, updated);
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
    } catch(err: any) { console.error(err); throw err; }
  };

  const moveDealStage = async (dealId: string, newStage: DealStage) => {
    try {
      await apiClient.put('/deals/' + dealId, { stage: newStage });
      
      const deal = deals.find(d => d.id === dealId);
      
      if (deal) {
        // 1. Sincronizar Contacto
        if (deal.leadId) {
          updateContact(deal.leadId, { pipelineStage: newStage }).catch(console.error);
        }
        
        // 2. Sincronizar Propiedad
        if (deal.propertyId) {
          if (newStage === 'reserva') {
            updateProperty(deal.propertyId, { status: 'reservada' }).catch(console.error);
          } else if (newStage === 'ganado') {
            updateProperty(deal.propertyId, { status: 'vendida' }).catch(console.error);
          } else if (deal.stage === 'reserva' || deal.stage === 'ganado') {
            // Si regresa de ganado o reserva a una etapa anterior, la marcamos como en_negociacion
            updateProperty(deal.propertyId, { status: 'en_negociacion' }).catch(console.error);
          }
        }
      }

      // Add Notification
      addNotification('Deal actualizado', `El deal "${deal.title}" se movió a la etapa ${newStage}`, 'info').catch(console.error);

      // Lead Scoring
      if (deal.leadId && (newStage === 'propuesta' || newStage === 'negociacion')) {
        updateLeadScore(deal.leadId, 10).catch(console.error);
      } else if (deal.leadId && newStage === 'ganado') {
        updateLeadScore(deal.leadId, 50).catch(console.error);
      }

      setDeals(prev => {
        return prev.map(d => {
          if (d.id === dealId) {
            if (newStage === 'ganado' && d.stage !== 'ganado') {
              try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

              // 3. Autogeneración de Finanzas
              const prop = properties.find(p => p.id === d.propertyId);
              const agent = agents.find(a => a.id === d.agentId);
              
              const companyCommissionPct = prop ? prop.commissionPct : 5;
              const agentCommissionPct = companyCommissionPct / 2; // Asumimos 50% para la agencia y 50% para el agente

              const companyAmount = (d.value * companyCommissionPct) / 100;
              const agentAmount = (d.value * agentCommissionPct) / 100;

              // Ingreso para la agencia
              addFinanceTransaction({
                type: 'ingreso',
                category: 'Comisión por venta',
                description: `Comisión por venta autogenerada - ${d.title} (${companyCommissionPct}%)`,
                amount: companyAmount,
                currency: d.currency,
                date: new Date().toISOString().split('T')[0],
                status: 'pendiente',
              }).catch(console.error);

              // Egreso (pago a agente)
              if (agent) {
                addFinanceTransaction({
                  type: 'egreso',
                  category: 'Comisión a agente',
                  description: `Pago a asesor ${agent.name} autogenerado - ${d.title} (${agentCommissionPct}%)`,
                  amount: agentAmount,
                  currency: d.currency,
                  date: new Date().toISOString().split('T')[0],
                  status: 'pendiente',
                  agentId: agent.id,
                }).catch(console.error);
              }
            }
            return { ...d, stage: newStage };
          }
          return d;
        });
      });
    } catch(err: any) { console.error(err); throw err; }
  };

  const deleteDeal = async (id: string) => {
    try {
      await apiClient.delete('/deals/' + id);
      setDeals(prev => prev.filter(d => d.id !== id));
      setDealsTotal(prev => Math.max(0, prev - 1));
    } catch(err: any) { console.error(err); throw err; }
  };

  // Manejo de Contactos
  const addContact = async (newContact: Omit<Contact, 'id' | 'createdAt' | 'lastContactDate'>) => {
    try {
      const res = await apiClient.post<{id: string, message: string}>('/contacts', newContact);
      const contact: Contact = {
        ...newContact,
        id: res.id || `cont-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastContactDate: new Date().toISOString(),
        statusFollowUp: 'al_dia',
      };
      setContacts(prev => [contact, ...prev]);
      setContactsTotal(prev => prev + 1);
      return contact;
    } catch(err: any) {
      console.error('Error al registrar contacto en backend:', err);
      throw err;
    }
  };

  const updateContact = async (id: string, updated: Partial<Contact>) => {
    try {
      await apiClient.put('/contacts/' + id, updated);
      setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteContact = async (id: string) => {
    try {
      await apiClient.delete('/contacts/' + id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Manejo de Contratos
  const addContract = async (newContract: Omit<Contract, 'id' | 'createdDate'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/contracts', newContract);
      const contract: Contract = {
        ...newContract,
        id: res.id,
        createdDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      };
      setContracts(prev => [contract, ...prev]);

      if (contract.propertyId) {
        let newStatus: PropertyStatus | null = null;
        if (contract.type === 'Separación') newStatus = 'reservada';
        if (contract.type === 'Compraventa' || contract.type === 'Arras') newStatus = 'vendida';
        if (contract.type === 'Alquiler') newStatus = 'alquilada';
        
        if (newStatus) {
          setProperties((prev) =>
            prev.map((p) => (p.id === contract.propertyId ? { ...p, status: newStatus as PropertyStatus } : p))
          );
        }
      }
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateContract = async (id: string, updated: Partial<Contract>) => {
    try {
      await apiClient.put('/contracts/' + id, updated);
      setContracts(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateContractStatus = async (id: string, status: ContractStatus) => {
    try {
      await apiClient.put('/contracts/' + id, { status });
      setContracts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteContract = async (id: string) => {
    try {
      await apiClient.delete('/contracts/' + id);
      setContracts(prev => prev.filter(c => c.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Manejo de Finanzas
  const addFinanceTransaction = async (newTx: Omit<FinanceTransaction, 'id' | 'createdAt'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/finance-transactions', newTx);
      const transaction: FinanceTransaction = {
        ...newTx,
        id: res.id,
        createdAt: new Date().toISOString(),
      };
      setFinanceTransactions(prev => [transaction, ...prev]);
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateFinanceTransaction = async (id: string, updated: Partial<FinanceTransaction>) => {
    try {
      await apiClient.put('/finance-transactions/' + id, updated);
      setFinanceTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteFinanceTransaction = async (id: string) => {
    try {
      await apiClient.delete('/finance-transactions/' + id);
      setFinanceTransactions(prev => prev.filter(t => t.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Seguimiento de Leads
  const addLeadActivity = async (
    contactId: string, 
    activity: Omit<LeadActivity, 'id' | 'contactId' | 'timestamp' | 'agentId' | 'agentName'>
  ) => {
    try {
      const res = await apiClient.post<{id: string}>(`/lead-activities/${contactId}`, {
        ...activity, agentId: currentAgent.id, agentName: currentAgent.name,
        timestamp: new Date().toISOString()
      });
      
      const newActivity: LeadActivity = {
        ...activity,
        id: res.id,
        contactId,
        agentId: currentAgent.id,
        agentName: currentAgent.name,
        timestamp: new Date().toLocaleString('es-ES', { 
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit' 
        }),
      };

      setLeadActivities(prev => ({
        ...prev,
        [contactId]: [newActivity, ...(prev[contactId] || [])]
      }));

      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, lastContactDate: new Date().toISOString(), statusFollowUp: 'al_dia' } : c));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateLeadNextContact = async (
    contactId: string, 
    nextFollowUpDate: string, 
    statusFollowUp: 'al_dia' | 'proximo' | 'urgente' | 'sin_contacto' = 'al_dia'
  ) => {
    try {
      await apiClient.put('/contacts/' + contactId, { nextFollowUpDate, statusFollowUp });
      setContacts(prev => prev.map(c => {
        if (c.id === contactId) {
          return { ...c, nextFollowUpDate, statusFollowUp };
        }
        return c;
      }));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Manejo de Tareas
  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/tasks', newTask);
      const task: Task = {
        ...newTask,
        id: res.id,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [task, ...prev]);
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateTask = async (id: string, updated: Partial<Task>) => {
    try {
      await apiClient.put('/tasks/' + id, updated);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const toggleTaskComplete = async (id: string) => {
    try {
      const t = tasks.find(x => x.id === id);
      if (!t) return;
      const isCompleted = t.status === 'completada';
      const updatedStatus = isCompleted ? 'pendiente' : 'completada';
      
      await apiClient.put('/tasks/' + id, { status: updatedStatus });
      setTasks(prev => prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: updatedStatus as any,
            completedAt: isCompleted ? undefined : new Date().toISOString(),
          };
        }
        return t;
      }));

      // Autogenerar actividad si se completó y tiene contacto
      if (updatedStatus === 'completada' && t.contactId) {
        addLeadActivity(t.contactId, {
          type: 'tarea',
          summary: `Tarea completada: ${t.title}`
        }).catch(console.error);

        // Lead Scoring
        updateLeadScore(t.contactId, 2).catch(console.error);
      }
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiClient.delete('/tasks/' + id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Manejo de Citas
  const addAppointment = async (newApp: Omit<Appointment, 'id'>) => {
    try {
      const res = await apiClient.post<{id: string}>('/appointments', newApp);
      const appointment: Appointment = {
        ...newApp,
        id: res.id,
      };
      setAppointments(prev => [appointment, ...prev]);
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateAppointment = async (id: string, updated: Partial<Appointment>) => {
    try {
      await apiClient.put('/appointments/' + id, updated);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    } catch(err: any) { console.error(err); return err.message; }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await apiClient.put('/appointments/' + id, { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

      // Autogenerar actividad si se realizó y tiene contacto
      if (status === 'realizada') {
        const a = appointments.find(x => x.id === id);
        if (a && a.contactId) {
          addLeadActivity(a.contactId, {
            type: 'visita',
            summary: `Cita/Visita completada: ${a.title}`
          }).catch(console.error);

          // Lead Scoring
          updateLeadScore(a.contactId, 15).catch(console.error);
        }
      }
    } catch(err: any) { console.error(err); return err.message; }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await apiClient.delete('/appointments/' + id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch(err: any) { console.error(err); return err.message; }
  };

  // Manejo de Chat
  const sendMessage = async (
    conversationId: string, 
    content: string, 
    propertyAttachment?: Property, 
    isPrivateNote = false
  ) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: 'agent',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      propertyAttachment,
      isPrivateNote,
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    if (!isPrivateNote) {
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: propertyAttachment 
              ? `[Propiedad] ${propertyAttachment.title}` 
              : content,
            lastMessageTime: 'Ahora',
          };
        }
        return conv;
      }));
    }
  };

  // Lead Scoring
  const updateLeadScore = async (contactId: string, points: number) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;
      const newScore = (contact.leadScore || 0) + points;
      await apiClient.put('/contacts/' + contactId, { leadScore: newScore });
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, leadScore: newScore } : c));
    } catch (err) {
      console.error('Error updating lead score', err);
    }
  };

  // Notificaciones
  const addNotification = async (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    try {
      const newNotif = await apiClient.post<NotificationItem>('/notifications', { title, message, type });
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      console.error('Error adding notification', err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await apiClient.put('/notifications/read-all', {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error clearing notifications', err);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const resetToDemoData = () => {
    localStorage.clear();
    fetchAllData();
  };

  return (
    <CRMContext.Provider value={{
      properties,
      deals,
      contacts,
      propertiesTotal,
      contactsTotal,
      dealsTotal,
      fetchProperties,
      fetchContacts,
      fetchDeals,
      fetchTasks,
      fetchAppointments,
      contracts,
      tasks,
      leadActivities,
      appointments,
      conversations,
      messages,
      agents,
      commissions,
      currentAgent,
      notifications,
      unreadNotificationsCount,
      isLoading,
      searchQuery,
      setSearchQuery,
      pipelineStages,
      leadChannels,
      projects,
      addProperty,
      updateProperty,
      deleteProperty,
      addDeal,
      updateDeal,
      moveDealStage,
      deleteDeal,
      addContact,
      updateContact,
      deleteContact,
      addContract,
      updateContract,
      updateContractStatus,
      deleteContract,
      financeTransactions,
      addFinanceTransaction,
      updateFinanceTransaction,
      deleteFinanceTransaction,
      addLeadActivity,
      updateLeadNextContact,
      updateLeadScore,
      addTask,
      updateTask,
      toggleTaskComplete,
      deleteTask,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      activeConversationId,
      setActiveConversationId,
      sendMessage,
      addNotification,
      markNotificationAsRead,
      clearAllNotifications,
      resetToDemoData,
      updatePipelineStage,
      addPipelineStage,
      deletePipelineStage,
      updateLeadChannel,
      addLeadChannel,
      deleteLeadChannel,
      addProject,
      updateProject,
      deleteProject,
      addAgent,
      updateAgent,
      deleteAgent,
      isAuthenticated,
      login,
      logout,
      appBranding,
      updateBranding,
      aiConfig,
      updateAIConfig
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
