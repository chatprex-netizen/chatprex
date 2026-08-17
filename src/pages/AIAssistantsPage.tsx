import React, { useState, useRef } from 'react';
import {
  Bot,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  CloudUpload,
  RefreshCw,
  Lightbulb,
  Key,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  Zap,
  MessageSquare,
  Mic,
  Layers,
  PenTool,
  UserCheck,
  GitBranch,
  Tag,
  Cloud,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────── */

interface AIAssistant {
  id: string;
  name: string;
  botKey?: string; // ID identificador para enrutamiento (ej: bot-orquestador, bot-campo-arequipa)
  assignedProject?: string; // Proyecto asignado
  roleType?: 'orquestador' | 'especialista' | 'atencion_general';
  provider: string;
  model: string;
  active: boolean;
  personality: string;
  apiKey: string;
  deepseekKey: string;
  knowledgeFiles: KnowledgeFile[];
  manualContext: string;
  settings: AssistantSettings;
}

interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface AssistantSettings {
  audioTranscription: boolean;
  smartGrouping: boolean;
  humanizedWriting: boolean;
  agentIntervention: boolean;
  orchestratorMode: boolean;
  activationKeywords: string[];
}

/* ─── Seed data & Official Templates ──────────────── */

const DEFAULT_ORCHESTRATOR_PERSONALITY = `# ROL E IDENTIDAD
Eres el "Agente Administrador y Orquestador IA" de la inmobiliaria. Eres el cerebro central de recepción para todas las conversaciones entrantes de WhatsApp, Instagram, Messenger y Web. Tu tono es profesional, cordial, ágil y empático (máximo 2 a 3 oraciones por mensaje).

# REGLAS DE AUTOMATIZACIÓN Y REGISTRO EN EL CRM
Cuando ingrese un lead o recibas nuevos datos, ejecuta la función [registrar_lead_crm]:
1. Etapa de Contacto: Registrar por defecto como "Nuevo Prospecto".
2. Canal de Captación: Detectar y registrar automáticamente si proviene de WhatsApp, Instagram, Messenger o Web.
3. Asignación de Asesor: Asignar equitativamente (Round Robin) entre los asesores comerciales activos sin repetir (salvo que haya un único asesor activo).
4. Presupuesto: Extraer moneda (S/ o USD) y monto estimado.
5. Intereses Específicos: Extraer y clasificar requerimientos clave:
   - Ubicación: Frente a parque, en esquina, zona céntrica.
   - Servicios: Con servicios básicos de luz, agua y desagüe.
   - Legalidad: Título de propiedad independizado, inscrito en Registros Públicos (Sunarp), documentos al día.
   - Tipo de inmueble: Lote/Terreno, Departamento, Casa, Preventa/Proyecto.

# PROTOCOLO DE CONVERSACIÓN Y DIRECCIONAMIENTO (ROUTING)

1. CUANDO EL CLIENTE NO INDICA EL PROYECTO EN SU PRIMER MENSAJE:
   - Saluda cordialmente y dale la bienvenida.
   - Haz un MÁXIMO de 2 preguntas breves para perfilar su interés:
     * "¿Qué tipo de propiedad estás buscando (lote, departamento, casa)?"
     * "¿En qué proyecto o zona de tu preferencia te gustaría invertir?"
   - Deriva inmediatamente al especialista adecuado tras su respuesta usando tus herramientas (Tools).

2. SI EL CLIENTE PREGUNTA POR UN PROYECTO DE NUESTRO CATÁLOGO (Ej. "Residencial Las Praderas"):
   - No des especificaciones técnicas extensas.
   - Llama de inmediato a la herramienta [transferir_conversacion] con el ID del bot especialista de dicho proyecto.

3. SI PREGUNTA POR UN PROYECTO O PROPIEDAD NO DISPONIBLE EN EL CATÁLOGO:
   - Informa amablemente y transfiere al asesor humano asignado:
     "Ese proyecto no lo tenemos disponible en este momento, pero tenemos opciones similares de gran plusvalía. Te comunico con el asesor comercial Elvis Meza (Teléfono: 957100984) quien te brindará la información personalizada."
   - Ejecuta la herramienta [transferir_humano].

4. SI SOLICITA UN ASESOR HUMANO, TIENE PREGUNTAS COMPLEJAS O MUESTRA FRUSTRACIÓN:
   - Si pide hablar con una persona, consulta temas legales notariales o crédito hipotecario complejo:
   - Responde: "Con gusto, te comunico directamente con tu asesor asignado Elvis Meza (Teléfono: 957100984) para que te atienda personalmente."
   - Llama a la herramienta [transferir_humano].`;

const DEFAULT_ORCHESTRATOR_CONTEXT = `[CATÁLOGO DE PROYECTOS DISPONIBLES]
- Proyecto: Residencial Las Praderas | Tipo: Lotes de campo y casas de playa | Bot ID: bot-praderas
- Proyecto: Hacienda Los Volcanes Arequipa | Tipo: Lotes de campo exclusivos con servicios y título | Bot ID: bot-campo-arequipa
- Proyecto: Torre Marina | Tipo: Departamentos de estreno frente al mar | Bot ID: bot-torre-marina

[ASESORES ACTIVOS PARA ASIGNACIÓN ROUND-ROBIN]
- Asesor: Elvis Meza | Teléfono: 957100984 | Especialidad: Proyectos y Preventas
- Asesor: Asesor Comercial Turno | Teléfono: 987654321 | Especialidad: Inmuebles Urbanos

[HERRAMIENTAS / TOOLS DISPONIBLES]
- [registrar_lead_crm]: { canal, etapa: "nuevo_prospecto", presupuesto, moneda, intereses_especificos, asesor_id }
- [transferir_conversacion]: { bot_id, motivo }
- [transferir_humano]: { asesor_id, motivo }`;

const SPECIALIST_CAMPO_AREQUIPA_PERSONALITY = `# ROL E IDENTIDAD
Eres el "Asesor Senior Especialista en Terrenos de Campo Exclusivos en Arequipa". Eres un maestro en generar confianza, asesorar con calidez arequipeña y cerrar visitas guiadas en el terreno. Tu estilo es breve, elegante, seguro y siempre orientado al cierre (máximo 2 a 3 oraciones por mensaje).

# REGLA DE ORO #1: CAPTURA Y USO DEL NOMBRE
1. En tu primer mensaje, saluda cordialmente y pregunta amablemente su nombre:
   "¡Hola! Qué gusto saludarte. Bienvenido a nuestros proyectos campestres más exclusivos de Arequipa con clima soleado todo el año. ¿Con quién tengo el gusto de conversar?"
2. Una vez que el cliente te dé su nombre, ÚSALO SIEMPRE en tus respuestas clave y preguntas de cierre para generar alta cercanía y confianza.

# REGLA DE ORO #2: FILTRADO Y PRESENTACIÓN DE 2 ALTERNATIVAS
Cuando el cliente pregunte por un lote o detalle preferencias (ej: en esquina, frente a parque, metraje, servicios):
- Ubica en la base de datos y presenta ÚNICAMENTE 2 alternativas claras:
  1. Opción Destacada: Excelente relación precio/ubicación.
  2. Opción Premium: Ubicación privilegiada (ej. esquina más grande o frente al parque central con vista a la campiña).
- Siempre remata con una pregunta de cierre de doble alternativa:
  "¿{Nombre}, cuál de estas dos opciones te gustaría conocer este fin de semana?"

# REGLA DE ORO #3: GESTIÓN DE CITAS Y AGENDAMIENTO
Tu objetivo máximo es llevar al cliente a vivir la experiencia en el terreno:
- Para Agendar: Cuando el cliente acepte un día y hora, ejecuta la herramienta [agendar_visita].
- Para Reprogramar: Si solicita cambio de fecha/hora, ejecuta la herramienta [reprogramar_visita].
- Para Cancelar: Si no puede asistir, ejecuta la herramienta [cancelar_visita] y ofrece reprogramar.
- Confirmación Obligatoria con Datos del Asesor:
  Una vez registrada la cita (a terreno, oficina o llamada), entrégale siempre los datos de su asesor:
  "¡Perfecto, {Nombre}! Tu visita ha quedado agendada para el {dia} a las {hora}. Tu asesor exclusivo asignado es Elvis Meza (Teléfono: 957100984), quien te recibirá en el proyecto con todos los planos y facilidades."

# REGLA DE ORO #4: CERO INVENTIVA Y ESTRICTA VERACIDAD
- Responde ÚNICAMENTE con datos de tu Base de Conocimiento (precios, metrajes, legalidad Sunarp, servicios de agua y luz).
- NUNCA inventes información. Si no tienes un dato técnico específico, di:
  "Excelente consulta, {Nombre}. Ese detalle técnico puntual te lo brindará personalmente tu asesor Elvis Meza durante el recorrido."
- Sé breve, contundente y enfocado en que el cliente agende su visita.`;

const SPECIALIST_CAMPO_AREQUIPA_CONTEXT = `[PROYECTO: HACIENDA LOS VOLCANES - AREQUIPA]
- Ubicación: Arequipa Campestre (A 25 min de la ciudad, zona de campiña con sol los 365 días del año).
- Servicios: Red de agua potable, energía eléctrica subterránea, alumbrado público, pórtico de seguridad 24/7.
- Legalidad: Títulos de propiedad independizados inscritos en Registros Públicos (SUNARP), entrega inmediata.
- Amenidades: Club House, canchas de tenis/pádel, ciclovías, caballerizas y más de 15,000 m² de áreas verdes y parques.

[INVENTARIO DE LOTES DISPONIBLES]
- Lote A-12 (Destacado): 500 m² | Ubicación: Calle Los Molles | Precio: S/ 145,000 (o $39,000 USD) | Frente regular, ideal para casa de un piso con piscina.
- Lote B-01 (Premium Esquina): 650 m² | Ubicación: Esquina frente al Parque Principal | Precio: S/ 195,000 (o $52,500 USD) | Doble fachada, máxima iluminación y vista directa a los volcanes.
- Lote C-08 (Exclusivo Campiña): 1,000 m² | Ubicación: Borde de campiña | Precio: S/ 285,000 (o $76,500 USD) | Para residencia campestre de lujo con amplios jardines y huerto privado.

[CONDICIONES DE PAGO]
- Al contado con 5% de descuento especial.
- Financiamiento directo: Inicial del 30% y saldo hasta en 36 cuotas sin intereses.

[ASESOR COMERCIAL ASIGNADO]
- Asesor: Elvis Meza | Celular / WhatsApp: 957100984 | Asesor Senior de Proyectos Campestres.`;

export const OFFICIAL_TEMPLATES = [
  {
    id: 'tpl-orquestador',
    name: '🌟 Agente Administrador / Orquestador IA',
    roleType: 'orquestador' as const,
    botKey: 'bot-orquestador',
    personality: DEFAULT_ORCHESTRATOR_PERSONALITY,
    manualContext: DEFAULT_ORCHESTRATOR_CONTEXT,
    keywords: ['Información', 'Precios', 'Proyecto', 'Lotes', 'Departamentos'],
    orchestratorMode: true,
  },
  {
    id: 'tpl-campo-arequipa',
    name: '🏔️ Especialista Terrenos de Campo (Arequipa)',
    roleType: 'especialista' as const,
    botKey: 'bot-campo-arequipa',
    personality: SPECIALIST_CAMPO_AREQUIPA_PERSONALITY,
    manualContext: SPECIALIST_CAMPO_AREQUIPA_CONTEXT,
    keywords: ['Terreno', 'Lote', 'Campo', 'Arequipa', 'Casa de campo', 'Visita'],
    orchestratorMode: false,
  },
];

const INITIAL_ASSISTANTS: AIAssistant[] = [
  {
    id: 'bot-1',
    name: 'Agente Administrador / Orquestador',
    botKey: 'bot-orquestador',
    roleType: 'orquestador',
    assignedProject: 'Todos los proyectos (Orquestador)',
    provider: 'openai',
    model: 'gpt-4o-mini',
    active: true,
    personality: DEFAULT_ORCHESTRATOR_PERSONALITY,
    apiKey: 'sk-proj-••••••••••••••••••••••••••••',
    deepseekKey: '',
    knowledgeFiles: [],
    manualContext: DEFAULT_ORCHESTRATOR_CONTEXT,
    settings: {
      audioTranscription: true,
      smartGrouping: true,
      humanizedWriting: true,
      agentIntervention: true,
      orchestratorMode: true,
      activationKeywords: ['Información', 'Precios', 'Proyecto', 'Lotes', 'Departamentos'],
    },
  },
  {
    id: 'bot-campo-arequipa',
    name: 'Especialista Terrenos de Campo (Arequipa)',
    botKey: 'bot-campo-arequipa',
    roleType: 'especialista',
    assignedProject: 'Hacienda Los Volcanes - Arequipa',
    provider: 'openai',
    model: 'gpt-4o-mini',
    active: true,
    personality: SPECIALIST_CAMPO_AREQUIPA_PERSONALITY,
    apiKey: 'sk-proj-••••••••••••••••••••••••••••',
    deepseekKey: '',
    knowledgeFiles: [],
    manualContext: SPECIALIST_CAMPO_AREQUIPA_CONTEXT,
    settings: {
      audioTranscription: true,
      smartGrouping: true,
      humanizedWriting: true,
      agentIntervention: true,
      orchestratorMode: false,
      activationKeywords: ['Terreno', 'Lote', 'Campo', 'Arequipa', 'Casa de campo', 'Visita'],
    },
  },
];

/* ─── Component ──────────────────────────────────── */

type TabId = 'personalidad' | 'motor-ia' | 'conocimiento' | 'ajustes-pro';

export const AIAssistantsPage: React.FC = () => {
  /* state */
  const [assistants, setAssistants] = useState<AIAssistant[]>(() => {
    const saved = localStorage.getItem('prexup_ai_assistants_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ASSISTANTS;
      }
    }
    return INITIAL_ASSISTANTS;
  });

  const [selectedId, setSelectedId] = useState<string>(assistants[0]?.id || 'bot-1');
  const [activeTab, setActiveTab] = useState<TabId>('personalidad');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = assistants.find((a) => a.id === selectedId) || assistants[0] || INITIAL_ASSISTANTS[0];

  /* helpers */
  const updateSelected = (patch: Partial<AIAssistant>) => {
    setAssistants((prev) => prev.map((a) => (a.id === selected.id ? { ...a, ...patch } : a)));
  };

  const updateSettings = (patch: Partial<AssistantSettings>) => {
    updateSelected({ settings: { ...selected.settings, ...patch } });
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('prexup_ai_assistants_v2', JSON.stringify(assistants));
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('¿Deseas restaurar la lista de Asistentes IA a los Bots Oficiales (Orquestador + Especialista Arequipa)?')) {
      setAssistants(INITIAL_ASSISTANTS);
      setSelectedId(INITIAL_ASSISTANTS[0].id);
      localStorage.setItem('prexup_ai_assistants_v2', JSON.stringify(INITIAL_ASSISTANTS));
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const tpl = OFFICIAL_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    updateSelected({
      personality: tpl.personality,
      manualContext: tpl.manualContext,
      botKey: tpl.botKey,
      roleType: tpl.roleType,
      settings: {
        ...selected.settings,
        orchestratorMode: tpl.orchestratorMode,
        activationKeywords: tpl.keywords,
      },
    });
  };

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => setConnectionStatus('ok'), 1200);
  };

  const handleAddBot = () => {
    const newBot: AIAssistant = {
      id: `bot-${Date.now()}`,
      name: 'Nuevo Asistente IA',
      botKey: `bot-${Date.now().toString().slice(-4)}`,
      roleType: 'especialista',
      assignedProject: 'General',
      provider: 'openai',
      model: 'gpt-4o-mini',
      active: true,
      personality: DEFAULT_ORCHESTRATOR_PERSONALITY,
      apiKey: '',
      deepseekKey: '',
      knowledgeFiles: [],
      manualContext: '',
      settings: {
        audioTranscription: true,
        smartGrouping: true,
        humanizedWriting: true,
        agentIntervention: true,
        orchestratorMode: false,
        activationKeywords: ['Información'],
      },
    };
    setAssistants((prev) => [...prev, newBot]);
    setSelectedId(newBot.id);
    setActiveTab('personalidad');
  };

  const handleDeleteBot = (id: string) => {
    if (assistants.length <= 1) return;
    const remaining = assistants.filter((a) => a.id !== id);
    setAssistants(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id || '');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: KnowledgeFile[] = Array.from(files).map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      uploadedAt: new Date().toISOString().split('T')[0],
    }));
    updateSelected({ knowledgeFiles: [...selected.knowledgeFiles, ...newFiles] });
    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    updateSelected({ knowledgeFiles: selected.knowledgeFiles.filter((f) => f.id !== fileId) });
  };

  const handleAddKeyword = () => {
    const kw = newKeyword.trim();
    if (kw && !selected.settings.activationKeywords.includes(kw)) {
      updateSettings({ activationKeywords: [...selected.settings.activationKeywords, kw] });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    updateSettings({ activationKeywords: selected.settings.activationKeywords.filter((k) => k !== kw) });
  };

  /* tab config */
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'personalidad', label: 'Personalidad', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'motor-ia', label: 'Motor IA', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'conocimiento', label: 'Conocimiento', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'ajustes-pro', label: 'Ajustes Pro', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
  ];

  /* ─── RENDER ──────────────────────────────────── */

  return (
    <div className="flex flex-col md:flex-row h-full animate-fade-in text-xs min-h-[calc(100vh-120px)]">
      {/* ───── LEFT PANEL: Bot List ───── */}
      <div className="w-full md:w-[280px] h-64 md:h-auto flex-shrink-0 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#004aad]" />
            <span className="font-semibold text-sm text-slate-900 dark:text-white">Asistentes IA</span>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full px-2 py-0.5">
            {assistants.length}
          </span>
        </div>

        {/* Bot list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {assistants.map((bot) => (
            <button
              key={bot.id}
              onClick={() => { setSelectedId(bot.id); setActiveTab('personalidad'); }}
              className={`w-full group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                selected.id === bot.id
                  ? 'bg-[#004aad] text-white shadow-lg shadow-blue-500/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selected.id === bot.id
                  ? 'bg-white/20'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <Bot className={`w-4 h-4 ${selected.id === bot.id ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[11px] truncate">{bot.name}</div>
                <div className={`text-[10px] truncate flex items-center gap-1 ${
                  selected.id === bot.id ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  <span className="font-mono text-[9px]">ID: {bot.botKey || bot.id}</span>
                  <span>•</span>
                  <span>{bot.settings?.orchestratorMode ? 'Orquestador' : 'Especialista'}</span>
                </div>
              </div>
              {/* Delete on hover (only when more than 1 bot) */}
              {assistants.length > 1 && selected.id !== bot.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteBot(bot.id); }}
                  className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Buttons: New Bot + Reset defaults */}
        <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <button
            onClick={handleAddBot}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#004aad] hover:text-[#004aad] transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-[11px]">Crear Nuevo Asistente</div>
            </div>
          </button>

          <button
            onClick={handleResetToDefaults}
            className="w-full text-center py-1.5 text-[10px] text-slate-400 hover:text-[#004aad] dark:hover:text-blue-400 font-medium transition-colors"
          >
            Restaurar Bots Recomendados (Orquestador + Arequipa)
          </button>
        </div>
      </div>

      {/* ───── RIGHT PANEL: Configuration ───── */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">
        {/* Top bar with editable Name & Bot ID */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-[#004aad]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={selected.name}
                  onChange={(e) => updateSelected({ name: e.target.value })}
                  className="font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg outline-none focus:border-[#004aad]"
                  placeholder="Nombre del Asistente..."
                />

                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-[#004aad] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {selected.settings?.orchestratorMode ? '🌟 Modo Orquestador' : '🎯 Especialista'}
                </span>
              </div>

              {/* Bot Key ID identifier for routing */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Identificador de Enrutamiento:</span>
                <input
                  type="text"
                  value={selected.botKey || selected.id}
                  onChange={(e) => updateSelected({ botKey: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-200 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 outline-none px-1"
                  placeholder="ej: bot-campo-arequipa"
                  title="El agente orquestador usa este ID para transferir la conversación"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Active toggle */}
            <button
              onClick={() => updateSelected({ active: !selected.active })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                selected.active
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${selected.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {selected.active ? 'Motor Activo' : 'Inactivo'}
            </button>
            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-[11px] font-semibold transition-all shadow-sm active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 px-6 py-5 max-w-4xl">

          {/* ─── TAB: Personalidad ─── */}
          {activeTab === 'personalidad' && (
            <div className="space-y-4 animate-fade-in">
              {/* Template Selector Bar */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <div className="font-bold text-xs text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#004aad]" />
                    <span>Cargar Plantilla Oficial Recomendada:</span>
                  </div>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300">
                    Aplica al instante instrucciones probadas para orquestación o cierres de terrenos.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleApplyTemplate(e.target.value);
                      }
                    }}
                    defaultValue=""
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="" disabled>-- Seleccionar Plantilla --</option>
                    {OFFICIAL_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Instrucciones de comportamiento (System Prompt)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Define la voz, tono, protocolo de agendamiento y reglas de derivación del bot.
                  </p>
                </div>
                <button
                  onClick={() => updateSelected({ personality: DEFAULT_ORCHESTRATOR_PERSONALITY })}
                  className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-[#004aad] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Orquestador
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <textarea
                  value={selected.personality}
                  onChange={(e) => updateSelected({ personality: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 bg-transparent text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed resize-none outline-none placeholder-slate-300"
                  placeholder="Escribe las instrucciones de comportamiento para tu asistente de IA..."
                />
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3.5">
                <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  <strong>Tip de Cierre:</strong> Recuerde solicitar el nombre al iniciar y presentar siempre <strong>2 alternativas de lotes (destacado vs premium)</strong> con llamado a la acción para visita presencial.
                </p>
              </div>
            </div>
          )}

          {/* ─── TAB: Motor IA ─── */}
          {activeTab === 'motor-ia' && (
            <div className="space-y-5 animate-fade-in">
              {/* Provider & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
                    Proveedor tecnológico
                  </label>
                  <div className="relative">
                    <select
                      value={selected.provider}
                      onChange={(e) => updateSelected({ provider: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none appearance-none cursor-pointer hover:border-[#004aad] transition-colors"
                    >
                      <option value="openai">OpenAI (Recomendado)</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                      <option value="google">Google (Gemini)</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="mistral">Mistral AI</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
                    Modelo de razonamiento
                  </label>
                  <div className="relative">
                    <select
                      value={selected.model}
                      onChange={(e) => updateSelected({ model: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none appearance-none cursor-pointer hover:border-[#004aad] transition-colors"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini</option>
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="gpt-4-turbo">gpt-4-turbo</option>
                      <option value="claude-3.5-sonnet">claude-3.5-sonnet</option>
                      <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                      <option value="deepseek-chat">deepseek-chat</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
                  Clave de acceso (API Key)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center">
                    <Key className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={selected.apiKey}
                    onChange={(e) => updateSelected({ apiKey: e.target.value })}
                    placeholder="sk-xxxxxxxx (Opcional)"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none hover:border-[#004aad] transition-colors font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* DeepSeek Key */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
                  Clave DeepSeek (Evaluador de Leads)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center">
                    <Key className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={selected.deepseekKey}
                    onChange={(e) => updateSelected({ deepseekKey: e.target.value })}
                    placeholder="sk-xxxxxxxx (Opcional)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none hover:border-[#004aad] transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Connection status */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {connectionStatus === 'ok' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[11px] font-semibold text-emerald-600">
                        ✓ Conexión establecida y segura
                      </span>
                    </>
                  )}
                  {connectionStatus === 'error' && (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-[11px] font-semibold text-red-600">
                        Error de conexión
                      </span>
                    </>
                  )}
                  {connectionStatus === 'testing' && (
                    <>
                      <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                      <span className="text-[11px] font-semibold text-blue-600">
                        Verificando...
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleTestConnection}
                  className="text-[11px] font-semibold text-[#004aad] hover:text-blue-700 transition-colors"
                >
                  Probar conexión ahora
                </button>
              </div>

              {/* Cloud sync info */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mt-2">
                <Cloud className="w-8 h-8 text-slate-400" />
                <div>
                  <div className="font-semibold text-xs text-slate-700 dark:text-slate-200">Sincronización en la nube</div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                    Los cambios se sincronizan instantáneamente en todos sus servidores de comunicación vinculados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: Conocimiento ─── */}
          {activeTab === 'conocimiento' && (
            <div className="space-y-5 animate-fade-in">
              {/* File upload zone */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                  <CloudUpload className="w-7 h-7 text-emerald-500" />
                </div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Base de conocimiento</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md leading-relaxed">
                  La IA consultará esta información antes de responder.
                  Inserte catálogos (PDF), listas de precios (CSV), manuales o preguntas frecuentes.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.csv,.txt,.docx,.xlsx,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Subir Archivo
                </button>
              </div>

              {/* Uploaded files list */}
              {selected.knowledgeFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Archivos cargados ({selected.knowledgeFiles.length})
                  </h4>
                  {selected.knowledgeFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-[11px] text-slate-800 dark:text-slate-200">{file.name}</div>
                          <div className="text-[10px] text-slate-400">{file.size} • {file.type} • {file.uploadedAt}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Manual context */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Contexto inyectado manualmente
                  </h4>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <textarea
                    value={selected.manualContext}
                    onChange={(e) => updateSelected({ manualContext: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-3 bg-transparent text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed resize-none outline-none placeholder-slate-300"
                    placeholder="Ingresa datos específicos como precios, proyectos, preguntas frecuentes..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: Ajustes Pro ─── */}
          {activeTab === 'ajustes-pro' && (
            <div className="space-y-1 animate-fade-in">
              {/* Toggle items */}
              {[
                {
                  key: 'audioTranscription' as const,
                  icon: <Mic className="w-5 h-5" />,
                  title: 'Transcripción de audios',
                  desc: 'Convierte notas de voz a texto y las procesa con IA.',
                  color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
                },
                {
                  key: 'smartGrouping' as const,
                  icon: <Layers className="w-5 h-5" />,
                  title: 'Agrupación inteligente',
                  desc: 'Agrupa mensajes consecutivos en una sola respuesta.',
                  color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
                },
                {
                  key: 'humanizedWriting' as const,
                  icon: <PenTool className="w-5 h-5" />,
                  title: 'Escritura humanizada',
                  desc: 'Simula el tiempo de escritura y envía mensajes fragmentados.',
                  color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
                },
                {
                  key: 'agentIntervention' as const,
                  icon: <UserCheck className="w-5 h-5" />,
                  title: 'Intervención de agente',
                  desc: 'Pausa el bot si el cliente solicita hablar con un humano.',
                  color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
                },
                {
                  key: 'orchestratorMode' as const,
                  icon: <GitBranch className="w-5 h-5" />,
                  title: 'Convertir en Orquestador',
                  desc: 'Delega conversaciones a otros Bots automáticamente según la intención del cliente.',
                  color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-4 px-1 border-b border-slate-100 dark:border-slate-800 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => updateSettings({ [item.key]: !selected.settings[item.key] })}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      selected.settings[item.key]
                        ? 'bg-[#004aad]'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        selected.settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}

              {/* Activation keywords */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                    Palabras clave de activación
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">
                  El bot se activará al detectar estos términos en el chat.
                </p>

                {/* Keywords display */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selected.settings.activationKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {kw}
                      <button
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add keyword input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    placeholder="Agregar palabra clave..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none hover:border-[#004aad] transition-colors"
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="px-4 py-2 rounded-xl bg-[#004aad] text-white text-[11px] font-semibold hover:bg-[#003b8a] transition-all active:scale-95"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Bottom publish button */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  Publicar asistente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
