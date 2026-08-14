import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  Megaphone,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Send,
  Search,
  Users2,
  FileText,
  Trash2,
  Eye,
  XCircle,
  Loader2,
  Rocket,
  PartyPopper,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────── */

interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  body: string;
  variables: string[];
}

type CampaignStatus = 'COMPLETED' | 'SCHEDULED' | 'SENDING' | 'DRAFT' | 'FAILED';

interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  recipientCount: number;
  recipientIds: string[];
  status: CampaignStatus;
  date: string;
  sentCount?: number;
  deliveredCount?: number;
  readCount?: number;
  variableValues?: Record<string, string>;
}

/* ─── Seed data ──────────────────────────────────── */

const META_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    name: 'promocion_lanzamiento',
    language: 'es',
    category: 'MARKETING',
    status: 'APPROVED',
    body: '¡Gran Oportunidad! Separación con descuento exclusivo en el proyecto {{1}}. Responde a este mensaje para enviarte el brochure.',
    variables: ['nombre_proyecto'],
  },
  {
    id: 'tpl-2',
    name: 'bienvenida_inmobiliaria',
    language: 'es',
    category: 'MARKETING',
    status: 'APPROVED',
    body: 'Hola {{1}}, gracias por tu interés en nuestro proyecto {{2}}. ¿Te gustaría agendar una visita guiada esta semana?',
    variables: ['nombre_cliente', 'nombre_proyecto'],
  },
  {
    id: 'tpl-3',
    name: 'hello_world',
    language: 'en_US',
    category: 'UTILITY',
    status: 'APPROVED',
    body: 'Hello World! Thank you for contacting Propify CRM.',
    variables: [],
  },
  {
    id: 'tpl-4',
    name: 'seguimiento_visita',
    language: 'es',
    category: 'MARKETING',
    status: 'APPROVED',
    body: 'Hola {{1}}, fue un gusto recibirte en {{2}}. ¿Tienes alguna consulta adicional sobre la unidad que visitaste? Estamos para ayudarte.',
    variables: ['nombre_cliente', 'nombre_proyecto'],
  },
  {
    id: 'tpl-5',
    name: 'recordatorio_pago',
    language: 'es',
    category: 'UTILITY',
    status: 'APPROVED',
    body: 'Estimado/a {{1}}, le recordamos que su cuota del mes de {{2}} por un monto de {{3}} está próxima a vencer. Agradecemos su pronto pago.',
    variables: ['nombre_cliente', 'mes', 'monto'],
  },
  {
    id: 'tpl-6',
    name: 'oferta_exclusiva',
    language: 'es',
    category: 'MARKETING',
    status: 'PENDING',
    body: '🔥 Solo por esta semana: {{1}}% de descuento en la cuota inicial del proyecto {{2}}. ¡No dejes pasar esta oportunidad!',
    variables: ['porcentaje', 'nombre_proyecto'],
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Fiestas Arequipa',
    templateId: 'tpl-1',
    templateName: 'promocion_lanzamiento',
    recipientCount: 1,
    recipientIds: ['cont-1'],
    status: 'COMPLETED',
    date: '7/8/2026',
    sentCount: 1,
    deliveredCount: 1,
    readCount: 1,
  },
  {
    id: 'camp-2',
    name: 'Difusión WhatsApp',
    templateId: 'tpl-2',
    templateName: 'bienvenida_inmobiliaria',
    recipientCount: 3,
    recipientIds: ['cont-1', 'cont-2', 'cont-3'],
    status: 'COMPLETED',
    date: '7/8/2026',
    sentCount: 3,
    deliveredCount: 3,
    readCount: 2,
  },
  {
    id: 'camp-3',
    name: 'Recordatorio Agosto',
    templateId: 'tpl-5',
    templateName: 'recordatorio_pago',
    recipientCount: 5,
    recipientIds: [],
    status: 'SCHEDULED',
    date: '15/8/2026',
  },
];

/* ─── Helpers ────────────────────────────────────── */

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  COMPLETED: {
    label: 'Completado',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  SCHEDULED: {
    label: 'Programado',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    icon: <Clock className="w-3 h-3" />,
  },
  SENDING: {
    label: 'Enviando',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  DRAFT: {
    label: 'Borrador',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    icon: <FileText className="w-3 h-3" />,
  },
  FAILED: {
    label: 'Fallido',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    icon: <XCircle className="w-3 h-3" />,
  },
};

/* ─── Component ──────────────────────────────────── */

export const CampaignsPage: React.FC = () => {
  const { contacts } = useCRM();

  /* main view state */
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [view, setView] = useState<'list' | 'wizard'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'ALL'>('ALL');

  /* wizard state */
  const [wizardStep, setWizardStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [audienceSearch, setAudienceSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendComplete, setSendComplete] = useState(false);

  const selectedTemplate = META_TEMPLATES.find((t) => t.id === selectedTemplateId);

  /* wizard navigation */
  const canGoNext = () => {
    if (wizardStep === 1) return !!selectedTemplateId && campaignName.trim().length > 0;
    if (wizardStep === 2) return selectedContactIds.length > 0;
    if (wizardStep === 3) return true;
    return false;
  };

  const handleNext = () => {
    if (wizardStep < 4 && canGoNext()) setWizardStep(wizardStep + 1);
  };

  const handleBack = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setCampaignName('');
    setSelectedTemplateId('');
    setSelectedContactIds([]);
    setVariableValues({});
    setAudienceSearch('');
    setIsSending(false);
    setSendComplete(false);
  };

  const handleStartNewCampaign = () => {
    resetWizard();
    setView('wizard');
  };

  const handleSendCampaign = () => {
    setIsSending(true);
    setTimeout(() => {
      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        name: campaignName,
        templateId: selectedTemplateId,
        templateName: selectedTemplate?.name || '',
        recipientCount: selectedContactIds.length,
        recipientIds: selectedContactIds,
        status: 'COMPLETED',
        date: new Date().toLocaleDateString('es-ES'),
        sentCount: selectedContactIds.length,
        deliveredCount: selectedContactIds.length,
        readCount: 0,
        variableValues,
      };
      setCampaigns((prev) => [newCampaign, ...prev]);
      setIsSending(false);
      setSendComplete(true);
    }, 2500);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const selectAllContacts = () => {
    if (selectedContactIds.length === contacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(contacts.map((c) => c.id));
    }
  };

  /* Resolve rendered template body */
  const getRenderedBody = () => {
    if (!selectedTemplate) return '';
    let body = selectedTemplate.body;
    selectedTemplate.variables.forEach((v, i) => {
      body = body.replace(`{{${i + 1}}}`, variableValues[v] || `[${v}]`);
    });
    return body;
  };

  /* filter campaigns */
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.templateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  /* filtered audience */
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(audienceSearch.toLowerCase()) ||
      c.phone.toLowerCase().includes(audienceSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(audienceSearch.toLowerCase())
  );

  /* wizard steps config */
  const steps = [
    { num: 1, label: 'Plantilla' },
    { num: 2, label: 'Audiencia' },
    { num: 3, label: 'Resumen' },
    { num: 4, label: 'Enviar' },
  ];

  /* ─── RENDER ──────────────────────────────────── */

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      {/* ═══════════ LIST VIEW ═══════════ */}
      {view === 'list' && (
        <>
          {/* Header */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-[#004aad]" />
                Campañas y Transmisiones
              </h2>
              <p className="text-[11px] text-slate-400 font-normal">
                Envía mensajes masivos y gestiona tus difusiones por WhatsApp
              </p>
            </div>
            <button
              onClick={handleStartNewCampaign}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Transmisión
            </button>
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar campaña o plantilla..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
              />
            </div>
            <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['ALL', 'COMPLETED', 'SCHEDULED', 'SENDING', 'DRAFT'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                    filterStatus === s
                      ? 'bg-white dark:bg-slate-700 text-[#004aad] shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s === 'ALL' ? 'Todas' : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[768px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Plantilla</th>
                  <th className="px-5 py-3">Destinatarios</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-400">No hay campañas</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Crea tu primera transmisión para enviar mensajes masivos
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => {
                    const st = statusConfig[camp.status];
                    return (
                      <tr
                        key={camp.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                          {camp.name}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-[10px] max-w-[150px] truncate">
                          {camp.templateName}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                          {camp.recipientCount} contactos
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${st.bg} ${st.color} whitespace-nowrap`}>
                            {st.icon}
                            {st.label.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-[10px] whitespace-nowrap">
                          {camp.date}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#004aad] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all mr-1">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(camp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>{filteredCampaigns.length} campaña(s) encontrada(s)</span>
            <span>
              Total enviados: {campaigns.reduce((a, c) => a + (c.sentCount || 0), 0)} mensajes
            </span>
          </div>
        </>
      )}

      {/* ═══════════ WIZARD VIEW ═══════════ */}
      {view === 'wizard' && (
        <div className="animate-fade-in">
          {/* Back to list */}
          <button
            onClick={() => { setView('list'); resetWizard(); }}
            className="flex items-center gap-1.5 text-[11px] text-[#004aad] font-medium hover:text-blue-700 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a Campañas
          </button>

          {/* Wizard header */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Nueva transmisión
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Crea y envía un mensaje de difusión a tus contactos.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      wizardStep === step.num
                        ? 'bg-[#004aad] text-white shadow-lg shadow-blue-500/30'
                        : wizardStep > step.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {wizardStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      wizardStep === step.num
                        ? 'text-[#004aad]'
                        : wizardStep > step.num
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mx-2 mt-[-18px] rounded-full transition-colors ${
                      wizardStep > step.num
                        ? 'bg-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step content container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-6">

            {/* ── STEP 1: Plantilla ── */}
            {wizardStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Elija una plantilla aprobada
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Seleccione la plantilla aprobada por Meta para su transmisión.
                  </p>
                </div>

                {/* Campaign name */}
                <div>
                  <label className="block text-[11px] text-[#004aad] font-semibold mb-1.5">
                    Nombre de la campaña
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Ej. Promoción Lanzamiento Agosto"
                    className="w-full sm:w-96 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                  />
                </div>

                {/* Template cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {META_TEMPLATES.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id;
                    const isApproved = tpl.status === 'APPROVED';
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => isApproved && setSelectedTemplateId(tpl.id)}
                        disabled={!isApproved}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-[#004aad] bg-blue-50/50 dark:bg-blue-900/10 shadow-md shadow-blue-500/10'
                            : isApproved
                            ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                              {tpl.name}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Idioma: {tpl.language} | Categoría: {tpl.category}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              tpl.status === 'APPROVED'
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                : tpl.status === 'PENDING'
                                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800'
                                : 'bg-red-50 dark:bg-red-900/30 text-red-600 border-red-200 dark:border-red-800'
                            }`}
                          >
                            {tpl.status}
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {tpl.body}
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#004aad] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Seleccionada
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 2: Audiencia ── */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                      Seleccione la audiencia
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Elija los contactos que recibirán esta transmisión.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#004aad] bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                    {selectedContactIds.length} seleccionado(s)
                  </span>
                </div>

                {/* Search & select all */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={audienceSearch}
                      onChange={(e) => setAudienceSearch(e.target.value)}
                      placeholder="Buscar contacto por nombre, teléfono o email..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                    />
                  </div>
                  <button
                    onClick={selectAllContacts}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium border border-slate-200 dark:border-slate-700 hover:border-[#004aad] hover:text-[#004aad] transition-all"
                  >
                    <Users2 className="w-3.5 h-3.5" />
                    {selectedContactIds.length === contacts.length ? 'Deseleccionar' : 'Seleccionar todos'}
                  </button>
                </div>

                {/* Contact list */}
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {filteredContacts.map((contact) => {
                    const isChecked = selectedContactIds.includes(contact.id);
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => toggleContact(contact.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          isChecked
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-[#004aad]'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isChecked
                              ? 'bg-[#004aad] border-[#004aad]'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                            {contact.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {contact.phone} • {contact.email}
                          </div>
                        </div>
                        {/* Type badge */}
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                          {contact.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 3: Resumen ── */}
            {wizardStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Resumen de la transmisión
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Revise los detalles antes de enviar. Configure las variables de la plantilla.
                  </p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Campaña</div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{campaignName}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Plantilla</div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                      {selectedTemplate?.name}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Destinatarios</div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {selectedContactIds.length} contactos
                    </div>
                  </div>
                </div>

                {/* Variable values */}
                {selectedTemplate && selectedTemplate.variables.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                      Variables de la plantilla
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTemplate.variables.map((v, i) => (
                        <div key={v}>
                          <label className="block text-[10px] text-slate-500 font-medium mb-1">
                            {`{{${i + 1}}}`} — {v}
                          </label>
                          <input
                            type="text"
                            value={variableValues[v] || ''}
                            onChange={(e) =>
                              setVariableValues((prev) => ({ ...prev, [v]: e.target.value }))
                            }
                            placeholder={`Valor para ${v}`}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message preview */}
                <div>
                  <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-2">
                    Vista previa del mensaje
                  </h4>
                  <div className="bg-[#e5ddd5] dark:bg-slate-800 rounded-xl p-4 max-w-md">
                    <div className="bg-white dark:bg-slate-700 rounded-xl p-3 shadow-sm text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed">
                      {getRenderedBody()}
                    </div>
                    <div className="text-right text-[9px] text-slate-500 mt-1 pr-1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                    </div>
                  </div>
                </div>

                {/* Recipients preview */}
                <div>
                  <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-2">
                    Contactos seleccionados
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContactIds.slice(0, 12).map((cid) => {
                      const c = contacts.find((ct) => ct.id === cid);
                      if (!c) return null;
                      return (
                        <span
                          key={cid}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        >
                          {c.name}
                        </span>
                      );
                    })}
                    {selectedContactIds.length > 12 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-500">
                        +{selectedContactIds.length - 12} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Enviar ── */}
            {wizardStep === 4 && (
              <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
                {!isSending && !sendComplete && (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                      <Rocket className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      ¿Listo para enviar?
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 text-center max-w-sm">
                      Se enviará el mensaje con la plantilla{' '}
                      <strong className="text-slate-600 dark:text-slate-300">{selectedTemplate?.name}</strong>{' '}
                      a <strong className="text-slate-600 dark:text-slate-300">{selectedContactIds.length} contactos</strong>.
                    </p>
                    <button
                      onClick={handleSendCampaign}
                      className="mt-6 flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Transmisión
                    </button>
                  </>
                )}

                {isSending && (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <Loader2 className="w-10 h-10 text-[#004aad] animate-spin" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Enviando mensajes...
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Procesando {selectedContactIds.length} mensajes a través de WhatsApp Business API
                    </p>
                    {/* Progress bar */}
                    <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-[#004aad] rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </>
                )}

                {sendComplete && (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                      <PartyPopper className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                      ¡Transmisión enviada!
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 text-center max-w-sm">
                      Se enviaron <strong>{selectedContactIds.length}</strong> mensajes exitosamente
                      usando la plantilla <strong>{selectedTemplate?.name}</strong>.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">{selectedContactIds.length}</div>
                        <div className="text-[10px] text-slate-400">Enviados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{selectedContactIds.length}</div>
                        <div className="text-[10px] text-slate-400">Entregados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-400">0</div>
                        <div className="text-[10px] text-slate-400">Leídos</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setView('list'); resetWizard(); }}
                      className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-semibold transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Volver a Campañas
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wizard navigation footer */}
          {wizardStep < 4 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={wizardStep === 1 ? () => { setView('list'); resetWizard(); } : handleBack}
                className="text-[11px] text-[#004aad] font-medium hover:text-blue-700 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  canGoNext()
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                Próximo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
