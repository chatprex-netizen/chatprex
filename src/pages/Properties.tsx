import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Property } from '../types';
import { PropertyModal } from '../components/properties/PropertyModal';
import { 
  Plus, 
  Search, 
  X,
  FolderTree,
  Building2,
  Sparkles,
  Maximize2,
  Trash2,
  Edit2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ProjectsList } from '../components/properties/ProjectsList';

import { INITIAL_PROPERTIES } from '../data/initialData';

interface PropertiesPageProps {
  onOpenNewPropertyModal: () => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onOpenNewPropertyModal,
}) => {
  const { properties, propertiesTotal, fetchProperties, searchQuery, setSearchQuery, deleteProperty } = useCRM();

  const [page, setPage] = useState(1);
  const limit = 20;

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'properties' | 'projects'>('properties');

  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch from API
  React.useEffect(() => {
    fetchProperties(page, searchQuery, (selectedType !== 'all' ? `&type=${selectedType}` : '') + (selectedOperation !== 'all' ? `&operation=${selectedOperation}` : '') + (selectedStatus !== 'all' ? `&status=${selectedStatus}` : ''));
  }, [page, searchQuery, selectedType, selectedOperation, selectedStatus]);

  // Use properties from context, but fallback to INITIAL_PROPERTIES if empty
  const sourceProperties = properties.length > 0 ? properties : INITIAL_PROPERTIES;
  const listProperties = sourceProperties;
  const totalPages = Math.ceil((propertiesTotal > 0 ? propertiesTotal : listProperties.length) / limit);

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

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de eliminar la unidad "${name}"?`)) {
      await deleteProperty(id);
    }
  };

  return (
    <div className="space-y-3.5 animate-fade-in text-xs">
      {/* Header, Search & Filters all grouped in the single top box */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        {/* Top Row: Title + Tabs + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#004aad]" />
              <span>Inventario y Proyectos</span>
            </h2>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setActiveTab('properties')}
                className={`text-[11px] font-semibold pb-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'properties'
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Unidades / Inmuebles
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`text-[11px] font-semibold pb-1.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'projects'
                    ? 'border-[#004aad] text-[#004aad]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Desarrollos / Proyectos</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search/Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1.5 px-2.5 cursor-pointer ${
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

            <button
              onClick={activeTab === 'properties' ? onOpenNewPropertyModal : () => document.dispatchEvent(new CustomEvent('open-new-project-modal'))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'properties' ? 'Nueva unidad' : 'Nuevo proyecto'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Search Box & Filter Selectors (Hidden by default) */}
        {showFilters && (
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center animate-fade-in">
            <div className="relative w-full sm:w-[40%] min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por identificador, código, proyecto o característica..."
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
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="terreno">Lote / Terreno</option>
              <option value="departamento">Departamento</option>
              <option value="casa">Casa</option>
              <option value="penthouse">Penthouse</option>
              <option value="oficina">Oficina</option>
            </select>

            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">Operación</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="preventa">Preventa</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
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
      ) : listProperties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No hay unidades registradas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No se encontraron unidades o inmuebles con los filtros seleccionados. Puedes registrar una nueva unidad haciendo clic en el botón superior.
          </p>
          <button
            onClick={onOpenNewPropertyModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#004aad] text-white text-xs font-medium hover:bg-[#003b8a] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar unidad</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[860px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Código / Unidad</th>
                  <th className="py-3 px-4">Proyecto Matriz</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Área (m²)</th>
                  <th className="py-3 px-4">Características / Ubicación</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-normal">
                {listProperties.map((prop) => {
                  const currencyLabel = prop.currency === 'PEN' ? 'S/' : prop.currency || 'USD';
                  const rawFeature = prop.unitFeature || (Array.isArray(prop.features) && prop.features.length > 0 ? prop.features.join(', ') : null);

                  return (
                    <tr
                      key={prop.id}
                      onClick={() => handleEdit(prop)}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      {/* Código e Identificador de la Unidad */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="min-w-0 space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white truncate block text-[12px]">
                            {prop.title || 'Sin identificar'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                            {prop.code || 'UND-000'}
                          </span>
                        </div>
                      </td>

                      {/* Proyecto Perteneciente */}
                      <td className="py-3 px-4 max-w-[180px]">
                        {prop.projectName ? (
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold truncate">
                            <Building2 className="w-3.5 h-3.5 text-[#004aad] shrink-0" />
                            <span className="truncate">{prop.projectName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Independiente</span>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="py-3 px-4 capitalize font-medium text-slate-600 dark:text-slate-300">
                        {prop.type === 'terreno' ? 'Lote / Terreno' : (prop.type || 'departamento').replace('_', ' ')}
                      </td>

                      {/* Área (m²) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                          <Maximize2 className="w-3 h-3 text-slate-400" />
                          <span>{prop.areaTotal ? `${Number(prop.areaTotal).toLocaleString('en-US')} m²` : '-'}</span>
                        </div>
                      </td>

                      {/* Características / Ubicación Específica */}
                      <td className="py-3 px-4 max-w-[220px]">
                        {rawFeature ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#004aad] dark:text-[#38BDF8] border border-blue-100 dark:border-blue-800/40 text-[11px] font-semibold truncate max-w-full">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span className="truncate">{rawFeature}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Precio */}
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {currencyLabel} {(parseFloat(prop.price as any) || 0).toLocaleString('en-US')}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant={prop.status || 'disponible'} size="sm">
                          {(prop.status || 'disponible').replace('_', ' ')}
                        </Badge>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(prop)}
                            className="p-1.5 text-slate-400 hover:text-[#004aad] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Editar unidad"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, prop.id, prop.title || prop.code)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar unidad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 pb-4">
          <span className="text-slate-500 text-xs">
            Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, propertiesTotal || listProperties.length)} de {propertiesTotal || listProperties.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Anterior
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Edit & Detail Modal */}
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
