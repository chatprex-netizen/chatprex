import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Property } from '../types';
import { PropertyCard } from '../components/properties/PropertyCard';
import { PropertyModal } from '../components/properties/PropertyModal';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Table2, 
  X,
  FolderTree,
  Building2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ProjectsList } from '../components/properties/ProjectsList';

interface PropertiesPageProps {
  onOpenNewPropertyModal: () => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onOpenNewPropertyModal,
}) => {
  const { properties, propertiesTotal, fetchProperties, searchQuery, setSearchQuery } = useCRM();

  const [page, setPage] = useState(1);
  const limit = 12;

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'properties' | 'projects'>('properties');

  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  // Fetch from API
  React.useEffect(() => {
    fetchProperties(page, searchQuery + (selectedType !== 'all' ? `&type=${selectedType}` : '') + (selectedOperation !== 'all' ? `&operation=${selectedOperation}` : '') + (selectedStatus !== 'all' ? `&status=${selectedStatus}` : ''));
  }, [page, searchQuery, selectedType, selectedOperation, selectedStatus]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Paginación y Filtrado delegados al Servidor
  const filteredProperties = properties;
  const totalPages = Math.ceil(propertiesTotal / limit);

  const [showFilters, setShowFilters] = useState(false);

  // Contador de filtros activos
  const activeFiltersCount = [
    selectedType !== 'all',
    selectedOperation !== 'all',
    selectedStatus !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  const handleEdit = (prop: Property) => {
    setPropertyToEdit(prop);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-3.5 animate-fade-in text-xs">
      {/* Header, Search & Filters all grouped in the single top box */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        {/* Top Row: Title + View Switcher + New Property Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#004aad]" />
              <span>Inventario y Proyectos</span>
            </h2>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setActiveTab('properties')}
                className={`text-[11px] font-semibold pb-1.5 border-b-2 transition-colors ${
                  activeTab === 'properties'
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Unidades / Inmuebles
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`text-[11px] font-semibold pb-1.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                Desarrollos / Proyectos
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search/Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1.5 px-2.5 ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#004aad] border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Buscar y filtrar"
            >
              <Search className={`w-3.5 h-3.5 ${showFilters || activeFiltersCount > 0 ? 'text-[#004aad]' : 'text-slate-500'}`} />
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
                title="Vista en tarjetas"
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
                title="Vista en tabla"
              >
                <Table2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={activeTab === 'properties' ? onOpenNewPropertyModal : () => document.dispatchEvent(new CustomEvent('open-new-project-modal'))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeTab === 'properties' ? 'Publicar propiedad' : 'Nuevo proyecto'}</span>
              <span className="sm:hidden">{activeTab === 'properties' ? 'Publicar' : 'Nuevo'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Search Box & Filter Selectors inside the same box (Hidden by default) */}
        {showFilters && (
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center animate-fade-in">
            <div className="relative w-full sm:w-[40%] min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, código o zona..."
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

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">Todos los tipos</option>
              <option value="departamento">Departamento</option>
              <option value="casa">Casa</option>
              <option value="penthouse">Penthouse</option>
              <option value="terreno">Terreno</option>
              <option value="oficina">Oficina</option>
              <option value="proyecto_preventa">Preventa</option>
            </select>

            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">Operación</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="preventa">Preventa</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">Estado</option>
              <option value="disponible">Disponible</option>
              <option value="en_negociacion">En negociación</option>
              <option value="reservada">Reservada</option>
              <option value="vendida">Vendida</option>
            </select>
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'projects' ? (
        <ProjectsList />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[800px]">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Propiedad</th>
                  <th className="py-2.5 px-4">Tipo</th>
                  <th className="py-2.5 px-4">Operación</th>
                  <th className="py-2.5 px-4">Precio</th>
                  <th className="py-2.5 px-4">Ubicación</th>
                  <th className="py-2.5 px-4">Estado</th>
                  <th className="py-2.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-normal">
                {filteredProperties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {prop.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize">{prop.type.replace('_', ' ')}</td>
                    <td className="py-3 px-4 capitalize">{prop.operation}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {prop.currency || 'USD'} {(parseFloat(prop.price as any) || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {[prop.zone, prop.city].filter(Boolean).join(', ')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={prop.status} size="sm">
                        {prop.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(prop)}
                        className="text-[#004aad] hover:underline font-medium text-xs"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 pb-4">
          <span className="text-slate-500 text-xs">
            Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, propertiesTotal)} de {propertiesTotal}
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

      {/* Edit & Detail Modals */}
      <PropertyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setPropertyToEdit(null);
        }}
        propertyToEdit={propertyToEdit}
      />
    </div>
  );
};
