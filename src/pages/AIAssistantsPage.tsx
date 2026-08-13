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

/* ─── Seed data ──────────────────────────────────── */

const DEFAULT_PERSONALITY = `# ROL Y CONTEXTO
Eres el "Asistente Recepcionista" de la inmobiliaria. Eres el primer punto de contacto. Tu tono debe ser amable, profesional y muy breve (máximo 2 oraciones).

# TU OBJETIVO PRINCIPAL
1. Saludar al cliente y darle la bienvenida.
2. Hacer máximo 2 preguntas para perfilar su interés (¿Qué tipo de propiedad busca? o ¿en qué proyecto está interesado?).
3. Derivar la conversación inmediatamente al especialista adecuado usando tus Herramientas (Tools).

# REGLAS ESTRICTAS DE DERIVACIÓN (Routing)
- Si el cliente menciona un proyecto específico (ej. "Torre Marina"), NO le des detalles de precios ni características. Llama a la función [transferir_conversacion] con el ID del bot de ese proyecto.
- Si el cliente pide hablar con un asesor o humano, se muestra frustrado o hace preguntas complejas (crédito hipotecario), llama a la función [transferir_humano].`;

const DEFAULT_MANUAL_CONTEXT = `Proyecto: Torre Marina
Precios: Desde $85,000 USD
Entrega: Inmediata
Cuota Inicial: 10%

Pregunta Frecuente: ¿Tienen cochera?
Respuesta: Sí, el costo adicional es de $12,000 USD.`;

const INITIAL_ASSISTANTS: AIAssistant[] = [
  {
    id: 'bot-1',
    name: 'Asistente Recepcionista',
    provider: 'openai',
    model: 'gpt-4o-mini',
    active: true,
    personality: DEFAULT_PERSONALITY,
    apiKey: 'sk-proj-••••••••••••••••••••••••••••',
    deepseekKey: '',
    knowledgeFiles: [
      { id: 'f1', name: 'catalogo-torre-marina.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '2026-07-15' },
      { id: 'f2', name: 'precios-agosto-2026.csv', size: '145 KB', type: 'CSV', uploadedAt: '2026-08-01' },
    ],
    manualContext: DEFAULT_MANUAL_CONTEXT,
    settings: {
      audioTranscription: true,
      smartGrouping: true,
      humanizedWriting: false,
      agentIntervention: true,
      orchestratorMode: false,
      activationKeywords: ['Información', 'Precios', 'Cotización'],
    },
  },
];

/* ─── Component ──────────────────────────────────── */

type TabId = 'personalidad' | 'motor-ia' | 'conocimiento' | 'ajustes-pro';

export const AIAssistantsPage: React.FC = () => {
  /* state */
  const [assistants, setAssistants] = useState<AIAssistant[]>(INITIAL_ASSISTANTS);
  const [selectedId, setSelectedId] = useState<string>(assistants[0]?.id || '');
  const [activeTab, setActiveTab] = useState<TabId>('personalidad');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = assistants.find((a) => a.id === selectedId)!;

  /* helpers */
  const updateSelected = (patch: Partial<AIAssistant>) => {
    setAssistants((prev) => prev.map((a) => (a.id === selectedId ? { ...a, ...patch } : a)));
  };

  const updateSettings = (patch: Partial<AssistantSettings>) => {
    updateSelected({ settings: { ...selected.settings, ...patch } });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => setConnectionStatus('ok'), 1200);
  };

  const handleAddBot = () => {
    const newBot: AIAssistant = {
      id: `bot-${Date.now()}`,
      name: 'Nuevo Bot',
      provider: 'openai',
      model: 'gpt-4o-mini',
      active: false,
      personality: '',
      apiKey: '',
      deepseekKey: '',
      knowledgeFiles: [],
      manualContext: '',
      settings: {
        audioTranscription: false,
        smartGrouping: false,
        humanizedWriting: false,
        agentIntervention: false,
        orchestratorMode: false,
        activationKeywords: [],
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
    <div className="flex h-full animate-fade-in text-xs min-h-[calc(100vh-120px)]">
      {/* ───── LEFT PANEL: Bot List ───── */}
      <div className="w-[260px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
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
                selectedId === bot.id
                  ? 'bg-[#004aad] text-white shadow-lg shadow-blue-500/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedId === bot.id
                  ? 'bg-white/20'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <Bot className={`w-4 h-4 ${selectedId === bot.id ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[11px] truncate">{bot.name}</div>
                <div className={`text-[10px] truncate ${
                  selectedId === bot.id ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {bot.provider === 'openai' ? 'OpenAI' : bot.provider} • {bot.model}
                </div>
              </div>
              {/* Delete on hover (only when more than 1 bot) */}
              {assistants.length > 1 && selectedId !== bot.id && (
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

        {/* New bot button */}
        <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleAddBot}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-[#004aad] hover:text-[#004aad] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[11px]">Nuevo Bot</div>
              <div className="text-[10px] text-slate-400">Crear asistente en blanco</div>
            </div>
          </button>
        </div>
      </div>

      {/* ───── RIGHT PANEL: Configuration ───── */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selected.name}
                  onChange={(e) => updateSelected({ name: e.target.value })}
                  className="font-bold text-base text-slate-900 dark:text-white bg-transparent border-none outline-none p-0 w-auto"
                  style={{ width: `${Math.max(selected.name.length, 8)}ch` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Configuración y personalidad del asistente virtual
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-95"
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Instrucciones de comportamiento
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Define la voz, tono y reglas de interacción del bot.
                  </p>
                </div>
                <button
                  onClick={() => updateSelected({ personality: DEFAULT_PERSONALITY })}
                  className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-[#004aad] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar plantilla
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <textarea
                  value={selected.personality}
                  onChange={(e) => updateSelected({ personality: e.target.value })}
                  rows={18}
                  className="w-full px-4 py-3 bg-transparent text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed resize-none outline-none placeholder-slate-300"
                  placeholder="Escribe las instrucciones de comportamiento para tu asistente de IA..."
                />
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3.5">
                <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  <strong>Tip:</strong> Incluya reglas de respuesta corta y un llamado a la acción claro
                  para maximizar las conversiones de sus leads. La IA funciona mejor con instrucciones
                  directas y en viñetas.
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
