import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Contact } from '../types';
import { ContactModal } from '../components/contacts/ContactModal';
import { LeadFollowUpModal } from '../components/contacts/LeadFollowUpModal';
import { Badge } from '../components/common/Badge';
import { 
  Plus, 
  Search, 
  Phone, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Clock, 
  History, 
  DollarSign, 
  Users, 
  LayoutGrid, 
  Table2, 
  RotateCcw, 
  ArrowDownAZ, 
  Building, 
  User,
  X,
  Download
} from 'lucide-react';

import { exportToCSV } from '../lib/exportUtils';

interface ContactsPageProps {
  onOpenNewContactModal: () => void;
  onNavigateToChat?: () => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({
  onOpenNewContactModal,
  onNavigateToChat,
}) => {
  const { 
    contacts,
    contactsTotal,
    fetchContacts,
    deleteContact, 
    agents, 
    conversations, 
    searchQuery,
    setSearchQuery,
    properties,
    leadChannels
  } = useCRM();

  const [page, setPage] = useState(1);
  const limit = 12;

  // Estados de vista y orden
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'score-desc' | 'recent'>('name-asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtros
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatusFollowUp, setSelectedStatusFollowUp] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>('all');

  // Modales
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [contactForFollowUp, setContactForFollowUp] = useState<Contact | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Paginación API
  React.useEffect(() => {
    fetchContacts(page, searchQuery);
  }, [page, searchQuery]);

  // Contador de filtros activos
  const activeFiltersCount = [
    selectedType !== 'all',
    selectedChannel !== 'all',
    selectedStatusFollowUp !== 'all',
    selectedAgent !== 'all',
    selectedBudgetRange !== 'all',
    sortBy !== 'name-asc',
    searchQuery !== ''
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedChannel('all');
    setSelectedStatusFollowUp('all');
    setSelectedAgent('all');
    setSelectedBudgetRange('all');
    setSortBy('name-asc');
    setSearchQuery('');
  };

  // Paginación delegada
  const totalPages = Math.ceil(contactsTotal / limit);

  // Filtrado y ordenamiento local (restante)
  const filteredContacts = contacts
    .filter((c) => {
      const matchesSearch = true; // Ya lo maneja la API

      const matchesType = selectedType === 'all' || c.type === selectedType;
      const matchesChannel = selectedChannel === 'all' || c.channel === selectedChannel;
      const matchesStatusFollowUp = selectedStatusFollowUp === 'all' || c.statusFollowUp === selectedStatusFollowUp;
      const matchesAgent = selectedAgent === 'all' || c.assignedAgentId === selectedAgent;

      const matchesBudget = selectedBudgetRange === 'all' ? true :
        selectedBudgetRange === 'under-300k' ? (c.budgetMax ? c.budgetMax < 300000 : true) :
        selectedBudgetRange === '300k-500k' ? (c.budgetMin && c.budgetMax ? c.budgetMin >= 300000 && c.budgetMax <= 500000 : true) :
        (c.budgetMax ? c.budgetMax > 500000 : true);

      return matchesSearch && matchesType && matchesChannel && matchesStatusFollowUp && matchesAgent && matchesBudget;
    })
    .sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      
      if (sortBy === 'name-asc') {
        return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
      }
      if (sortBy === 'name-desc') {
        return nameB.localeCompare(nameA, 'es', { sensitivity: 'base' });
      }
      if (sortBy === 'score-desc') {
        return (b.leadScore || 0) - (a.leadScore || 0);
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  const handleEdit = (contact: Contact) => {
    setContactToEdit(contact);
    setIsEditModalOpen(true);
  };

  const handleOpenFollowUp = (contact: Contact) => {
    setContactForFollowUp(contact);
    setIsFollowUpModalOpen(true);
  };

  const handleOpenChatWithContact = (contact: Contact) => {
    const conv = conversations.find((cv) => cv.contactId === contact.id);
    if (conv) {
      setActiveConversationId(conv.id);
    }
    if (onNavigateToChat) {
      onNavigateToChat();
    }
  };

  const handleExport = () => {
    const exportData = filteredContacts.map(c => {
      const agent = agents.find(a => a.id === c.assignedAgentId);
      return {
        'Nombre': c.name,
        'Empresa/Razón': c.company || '',
        'Cargo': c.jobTitle || '',
        'Email': c.email || '',
        'Teléfono': c.phone || '',
        'Tipo': c.type,
        'Canal': c.channel || '',
        'Puntaje (Lead Score)': c.leadScore || 0,
        'Estado Seguimiento': c.statusFollowUp,
        'Último Contacto': c.lastContactDate ? new Date(c.lastContactDate).toLocaleDateString() : '',
        'Próximo Contacto': c.nextFollowUpDate ? new Date(c.nextFollowUpDate).toLocaleDateString() : '',
        'Agente Asignado': agent?.name || 'Sin Asignar',
        'Fecha Creación': new Date(c.createdAt).toLocaleDateString()
      };
    });

    const columns = [
      { key: 'Nombre', label: 'Nombre' },
      { key: 'Empresa/Razón', label: 'Empresa' },
      { key: 'Cargo', label: 'Cargo' },
      { key: 'Email', label: 'Email' },
      { key: 'Teléfono', label: 'Teléfono' },
      { key: 'Tipo', label: 'Tipo' },
      { key: 'Canal', label: 'Canal' },
      { key: 'Puntaje (Lead Score)', label: 'Lead Score' },
      { key: 'Estado Seguimiento', label: 'Estado' },
      { key: 'Último Contacto', label: 'Último Contacto' },
      { key: 'Próximo Contacto', label: 'Próximo Contacto' },
      { key: 'Agente Asignado', label: 'Agente Asignado' },
      { key: 'Fecha Creación', label: 'Fecha Creación' },
    ];

    exportToCSV(exportData, 'Directorio_Contactos', columns);
  };

  return (
    <div className="space-y-3.5 animate-fade-in text-xs">
      {/* Header, Search & Filters all grouped in the single top box */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        {/* Top Row: Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#004aad]" />
              <span>Directorio de contactos</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-normal">
              {filteredContacts.length} de {contacts.length} clientes · Orden alfabético (A-Z)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search/Filter Toggle Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1.5 px-2.5 ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#004aad] border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Buscar y filtrar"
            >
              <Search className={`w-3.5 h-3.5 ${showAdvancedFilters || activeFiltersCount > 0 ? 'text-[#004aad]' : 'text-slate-500'}`} />
              <span className="text-[11px] font-medium hidden sm:inline">Buscar</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#004aad] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-900 text-[#004aad] shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Vista en tarjetas (2 columnas celular / 4 columnas PC)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white dark:bg-slate-900 text-[#004aad] shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Vista en lista / tabla"
              >
                <Table2 className="w-3.5 h-3.5" />
              </button>
              <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
            
              {/* Action Buttons */}
              <button
                onClick={handleExport}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-[11px] font-medium shadow-sm"
                title="Exportar base actual"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar
              </button>
            </div>

            <button
              onClick={onOpenNewContactModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo contacto</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Search Box & Filter Selectors inside the same box (Hidden by default) */}
        {showAdvancedFilters && (
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 animate-fade-in">
            {/* Search and Type Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-[40%] min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono, correo o zona..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#004aad]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {(['all', 'comprador', 'inversionista', 'propietario', 'inquilino'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium shrink-0 transition-all ${
                      selectedType === type
                        ? 'bg-[#004aad] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Filter by Channel */}
              <div>
                <label className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1">
                  <MessageCircle className="w-3 h-3 text-[#004aad]" />
                  <span>Canal de captación</span>
                </label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="all">Todos los canales</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="web">Web inmobiliaria</option>
                  <option value="portal_inmobiliario">Portal inmobiliario</option>
                  <option value="instagram">Instagram</option>
                  <option value="referido">Referido</option>
                </select>
              </div>

              {/* Filter by Status Follow-up */}
              <div>
                <label className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>Estado seguimiento</span>
                </label>
                <select
                  value={selectedStatusFollowUp}
                  onChange={(e) => setSelectedStatusFollowUp(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="all">Todos los estados</option>
                  <option value="al_dia">Al día</option>
                  <option value="proximo">Próximo contacto</option>
                  <option value="urgente">Urgente</option>
                  <option value="sin_contacto">Sin contacto</option>
                </select>
              </div>

              {/* Filter by Agent */}
              <div>
                <label className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1">
                  <User className="w-3 h-3 text-purple-500" />
                  <span>Asesor asignado</span>
                </label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="all">Todos los asesores</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Budget */}
              <div>
                <label className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1">
                  <DollarSign className="w-3 h-3 text-emerald-500" />
                  <span>Rango presupuesto</span>
                </label>
                <select
                  value={selectedBudgetRange}
                  onChange={(e) => setSelectedBudgetRange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="all">Cualquier presupuesto</option>
                  <option value="under-300k">Menos de $300,000 USD</option>
                  <option value="300k-500k">$300,000 - $500,000 USD</option>
                  <option value="over-500k">Más de $500,000 USD</option>
                </select>
              </div>

              {/* Sort By Alphabetical & Other */}
              <div>
                <label className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1">
                  <ArrowDownAZ className="w-3 h-3 text-[#004aad]" />
                  <span>Criterio de orden</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-2 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="name-asc">Nombre (A - Z)</option>
                    <option value="name-desc">Nombre (Z - A)</option>
                    <option value="score-desc">Mayor Lead Score</option>
                    <option value="recent">Más recientes</option>
                  </select>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 bg-slate-100 dark:bg-slate-800 shrink-0 border border-transparent hover:border-rose-200"
                      title="Restablecer filtros"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: Cards Grid (2 Columns in Mobile, 4 Columns in PC) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredContacts.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="font-medium text-xs text-slate-600 dark:text-slate-300">
                No se encontraron contactos con los filtros seleccionados.
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const agent = agents.find((a) => a.id === contact.assignedAgentId);

              return (
                <div
                  key={contact.id}
                  className="p-3 sm:p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-2">
                    {/* Top Row: Avatar + Name + Score */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {contact.name}
                          </h3>
                          <span className="text-[10px] text-slate-400 block truncate">
                            vía {(() => {
                              const ch = leadChannels?.find(c => c.id === contact.channel);
                              return ch ? ch.name : contact.channel;
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {contact.leadScore} pts
                        </span>
                      </div>
                    </div>

                    {/* Tag / Type Badge */}
                    <div className="flex items-center gap-1">
                      <Badge variant="blue" size="sm">
                        {contact.type}
                      </Badge>
                      {contact.statusFollowUp === 'urgente' && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-rose-50 text-rose-600 border border-rose-200">
                          Urgente
                        </span>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 truncate">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </div>

                      {(contact.budget !== undefined && contact.budget !== null) && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium truncate">
                          <span className="truncate">
                            {contact.currency || 'USD'} {(parseFloat(contact.budget as any) || 0).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {contact.interestedProperty && (
                        (() => {
                          const prop = properties.find(p => p.id === contact.interestedProperty);
                          return prop ? (
                            <div className="flex items-center gap-1 text-slate-400 truncate">
                              <Building className="w-3 h-3 shrink-0" />
                              <span className="truncate" title={prop.projectName ? `${prop.projectName} - ${prop.title}` : prop.title}>
                                {prop.projectName ? prop.projectName : prop.title}
                              </span>
                            </div>
                          ) : null;
                        })()
                      )}
                    </div>
                  </div>

                  {/* Actions & Follow up */}
                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenFollowUp(contact)}
                      className="w-full py-1 px-2 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-[#004aad] text-slate-600 dark:text-slate-300 text-[10px] font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <History className="w-3 h-3 text-[#004aad]" />
                      <span>Seguimiento 360°</span>
                    </button>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                        {agent?.name.split(' ')[0]}
                      </span>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleOpenChatWithContact(contact)}
                          title="WhatsApp"
                          className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleEdit(contact)}
                          title="Editar"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar al contacto ${contact.name}?`)) {
                              deleteContact(contact.id);
                            }
                          }}
                          title="Eliminar"
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW 2: DataGrid Table View (Vista Lista) */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500">
                <th className="py-2.5 px-3">Cliente / Contacto</th>
                <th className="py-2.5 px-3">Teléfono & Canal</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Presupuesto & Zonas</th>
                <th className="py-2.5 px-3">Lead Score</th>
                <th className="py-2.5 px-3">Asesor</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No hay contactos con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const agent = agents.find((a) => a.id === contact.assignedAgentId);

                  return (
                    <tr 
                      key={contact.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Cliente */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {contact.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Teléfono & Canal */}
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        <div>{contact.phone}</div>
                        <span className="text-[10px] text-slate-400">
                          vía {(() => {
                            const ch = leadChannels?.find(c => c.id === contact.channel);
                            return ch ? ch.name : contact.channel;
                          })()}
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="py-2.5 px-3">
                        <Badge variant="blue" size="sm">
                          {contact.type}
                        </Badge>
                      </td>

                      {/* Presupuesto */}
                      <td className="py-2.5 px-3">
                        {contact.budget !== undefined && contact.budget !== null ? (
                          <div className="font-medium text-emerald-600 dark:text-emerald-400">
                            {contact.currency || 'USD'} {(parseFloat(contact.budget as any) || 0).toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-slate-400">Sin definir</span>
                        )}
                        {contact.interestedProperty && (
                          (() => {
                            const prop = properties.find(p => p.id === contact.interestedProperty);
                            return prop ? (
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={prop.projectName ? `${prop.projectName} - ${prop.title}` : prop.title}>
                                {prop.projectName ? prop.projectName : prop.title}
                              </div>
                            ) : null;
                          })()
                        )}
                      </td>

                      {/* Score */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="font-bold text-slate-800 dark:text-white">
                            {contact.leadScore}
                          </div>
                          <div className="w-12 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${contact.leadScore}%` }}
                            />
                          </div>
                        </div>
                        {contact.nextFollowUpDate && (
                          <div className="text-[10px] text-[#004aad]">
                            Próx: {contact.nextFollowUpDate}
                          </div>
                        )}
                      </td>

                      {/* Asesor */}
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {agent?.name.split(' ')[0] || 'Sin asignar'}
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenFollowUp(contact)}
                            className="p-1 rounded text-[#004aad] hover:bg-blue-50 transition-colors"
                            title="Seguimiento e historial 360°"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenChatWithContact(contact)}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleEdit(contact)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar al contacto ${contact.name}?`)) {
                                deleteContact(contact.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 pb-4">
          <span className="text-slate-500 text-xs">
            Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, contactsTotal)} de {contactsTotal}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Anterior
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ContactModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setContactToEdit(null);
        }}
        contactToEdit={contactToEdit}
      />

      <LeadFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setContactForFollowUp(null);
        }}
        contact={contactForFollowUp}
      />
    </div>
  );
};
