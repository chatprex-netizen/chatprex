import React, { useState, useMemo, useEffect } from 'react';
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
  Edit2,
  SlidersHorizontal,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ProjectsList } from '../components/properties/ProjectsList';

export const PropertiesPage: React.FC<{ onOpenNewPropertyModal: () => void }> = ({
  onOpenNewPropertyModal,
}) => {
  const { 
    properties, 
    propertiesTotal, 
    fetchProperties, 
    deleteProperty,
    projects 
  } = useCRM();

  const [page, setPage] = useState(1);
  const limit = 20;

  // Estados de Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'properties' | 'projects'>('properties');
  const [showFilters, setShowFilters] = useState(false);

  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sincronización con el servidor cuando cambian los filtros principales
  useEffect(() => {
    let filterQuery = '';
    if (selectedProjectId !== 'all') filterQuery += `&projectId=${encodeURIComponent(selectedProjectId)}`;
    if (selectedType !== 'all') filterQuery += `&type=${encodeURIComponent(selectedType)}`;
    if (selectedOperation !== 'all') filterQuery += `&operation=${encodeURIComponent(selectedOperation)}`;
    if (selectedStatus !== 'all') filterQuery += `&status=${encodeURIComponent(selectedStatus)}`;

    fetchProperties(page, searchQuery, filterQuery, limit);
  }, [page, searchQuery, selectedProjectId, selectedType, selectedOperation, selectedStatus]);

  // Filtrado reactivo en el cliente sobre los datos en memoria
  const filteredProperties = useMemo(() => {
    const list = Array.isArray(properties) ? properties : [];

    return list.filter((prop) => {
      if (!prop) return false;

      // 1. Búsqueda por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (prop.title || '').toLowerCase().includes(q);
        const codeMatch = (prop.code || '').toLowerCase().includes(q);
        const projectMatch = (prop.projectName || '').toLowerCase().includes(q);
        const featureMatch = (prop.unitFeature || '').toLowerCase().includes(q) || 
                             (Array.isArray(prop.features) && prop.features.some(f => f.toLowerCase().includes(q)));
        const descMatch = (prop.description || '').toLowerCase().includes(q);
        const addressMatch = (prop.address || '').toLowerCase().includes(q);

        if (!titleMatch && !codeMatch && !projectMatch && !featureMatch && !descMatch && !addressMatch) {
          return false;
        }
      }

      // 2. Filtro por Proyecto Matriz
      if (selectedProjectId !== 'all') {
        if (selectedProjectId === 'independent') {
          if (prop.projectId || (prop.projectName && prop.projectName.trim().length > 0)) {
            return false;
          }
        } else {
          const matchesId = prop.projectId === selectedProjectId;
          const matchesName = projects.find(p => p.id === selectedProjectId)?.name?.toLowerCase() === (prop.projectName || '').toLowerCase();
          if (!matchesId && !matchesName) return false;
        }
      }

      // 3. Filtro por Tipo de Inmueble
      if (selectedType !== 'all') {
        if ((prop.type || '').toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }

      // 4. Filtro por Operación
      if (selectedOperation !== 'all') {
        if ((prop.operation || 'venta').toLowerCase() !== selectedOperation.toLowerCase()) {
          return false;
        }
      }

      // 5. Filtro por Estado
      if (selectedStatus !== 'all') {
        if ((prop.status || 'disponible').toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // 6. Filtro por Rango de Precios
      const numPrice = Number(prop.price) || 0;
      if (minPrice && numPrice < Number(minPrice)) return false;
      if (maxPrice && numPrice > Number(maxPrice)) return false;

      // 7. Filtro por Rango de Área
      const numArea = Number(prop.areaTotal) || 0;
      if (minArea && numArea < Number(minArea)) return false;
      if (maxArea && numArea > Number(maxArea)) return false;

      return true;
    });
  }, [properties, searchQuery, selectedProjectId, selectedType, selectedOperation, selectedStatus, minPrice, maxPrice, minArea, maxArea, projects]);

  const totalPages = Math.ceil((filteredProperties.length || propertiesTotal || 1) / limit);

  // Contador de filtros activos
  const activeFiltersCount = [
    selectedProjectId !== 'all',
    selectedType !== 'all',
    selectedOperation !== 'all',
    selectedStatus !== 'all',
    searchQuery.trim() !== '',
    minPrice !== '',
    maxPrice !== '',
    minArea !== '',
    maxArea !== ''
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProjectId('all');
    setSelectedType('all');
    setSelectedOperation('all');
    setSelectedStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
  };

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
    <div className="space-y-3.5 animate-fade-in text-xs font-sans">
      {/* Caja Principal: Encabezado, Tabs y Filtros Avanzados */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        
        {/* Fila Superior: Título + Tabs + Botones */}
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
                Unidades / Inmuebles ({filteredProperties.length})
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
                <span>Desarrollos / Proyectos ({projects.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón de Filtros Avanzados */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-xl border transition-all flex items-center gap-1.5 px-3 cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#004aad] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Filtros avanzados"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#004aad] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Botón Nuevo */}
            <button
              onClick={activeTab === 'properties' ? onOpenNewPropertyModal : () => document.dispatchEvent(new CustomEvent('open-new-project-modal'))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'properties' ? 'Nueva unidad' : 'Nuevo proyecto'}</span>
            </button>
          </div>
        </div>

        {/* Panel de Filtros Avanzados Desplegable */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
            
            {/* Fila 1: Buscador + Selector de Proyecto + Tipo + Operación + Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              
              {/* Buscador de Texto */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por lote, código, característica..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#004aad] transition-colors"
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

              {/* Filtro por Proyecto Matriz */}
              <div>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 font-semibold focus:border-[#004aad] cursor-pointer"
                >
                  <option value="all">🏢 Todos los Proyectos</option>
                  <option value="independent">🏠 Solo Independientes</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 focus:border-[#004aad] cursor-pointer"
                >
                  <option value="all">Tipos: Todos</option>
                  <option value="terreno">Lote / Terreno</option>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="oficina">Oficina</option>
                  <option value="local_comercial">Local Comercial</option>
                </select>
              </div>

              {/* Filtro por Operación */}
              <div>
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 focus:border-[#004aad] cursor-pointer"
                >
                  <option value="all">Operación: Todas</option>
                  <option value="venta">Venta</option>
                  <option value="preventa">Preventa</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              {/* Filtro por Estado */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300 focus:border-[#004aad] cursor-pointer"
                >
                  <option value="all">Estado: Todos</option>
                  <option value="disponible">🟢 Disponible</option>
                  <option value="en_negociacion">🟡 En negociación</option>
                  <option value="reservada">🟠 Reservada</option>
                  <option value="vendida">🔴 Vendida</option>
                  <option value="alquilada">🟣 Alquilada</option>
                </select>
              </div>
            </div>

            {/* Fila 2: Rangos de Precio y Área + Botón Limpiar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Rango de Precios */}
                <div className="flex items-center gap-1.5 bg-[#F7F8FA] dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10.5px] font-semibold text-slate-500">Precio:</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-16 bg-transparent outline-none text-xs text-slate-900 dark:text-white"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-16 bg-transparent outline-none text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Rango de Área */}
                <div className="flex items-center gap-1.5 bg-[#F7F8FA] dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10.5px] font-semibold text-slate-500">Área (m²):</span>
                  <input
                    type="number"
                    placeholder="Min m²"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    className="w-16 bg-transparent outline-none text-xs text-slate-900 dark:text-white"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max m²"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                    className="w-16 bg-transparent outline-none text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Botón Restablecer / Limpiar Filtros */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar Filtros ({activeFiltersCount})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenido: Proyectos o Tabla de Unidades */}
      {activeTab === 'projects' ? (
        <ProjectsList />
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-card p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {activeFiltersCount > 0 ? 'No se encontraron unidades con los filtros seleccionados' : 'No hay unidades registradas'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeFiltersCount > 0 
              ? 'Prueba modificando o limpiando los filtros para ver más resultados.'
              : 'Puedes registrar una nueva unidad haciendo clic en el botón superior.'}
          </p>
          {activeFiltersCount > 0 ? (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Filtros</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewPropertyModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004aad] text-white text-xs font-semibold hover:bg-[#003b8a] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar unidad</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[900px]">
              {/* ORDEN DE COLUMNAS: 1. Unidad/Proyecto, 2. Ubicación, 3. Área, 4. Moneda y Precio, 5. Estado, 6. Características, 7. Acciones */}
              <thead className="bg-slate-50/90 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Unidad / Proyecto</th>
                  <th className="py-3 px-4">Ubicación</th>
                  <th className="py-3 px-4">Área (m²)</th>
                  <th className="py-3 px-4">Moneda y Precio</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Características</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-normal">
                {filteredProperties.map((prop) => {
                  const currencyLabel = prop.currency === 'PEN' ? 'S/' : prop.currency || 'USD';
                  const rawFeature = prop.unitFeature || (Array.isArray(prop.features) && prop.features.length > 0 ? prop.features.join(', ') : null);

                  // Resolver Ubicación completa: Dirección, Distrito/Zona, Ciudad juntos
                  const projectObj = projects.find(p => p.id === prop.projectId || (p.name && p.name.toLowerCase() === (prop.projectName || '').toLowerCase()));
                  const locationText = (() => {
                    if (projectObj) {
                      const parts = [projectObj.address, projectObj.zone, projectObj.city].filter(Boolean);
                      if (parts.length > 0) return parts.join(', ');
                    }
                    const propParts = [prop.address, prop.zone, prop.city].filter(Boolean);
                    if (propParts.length > 0) return propParts.join(', ');
                    return 'Arequipa';
                  })();

                  return (
                    <tr
                      key={prop.id}
                      onClick={() => handleEdit(prop)}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      {/* 1. Unidad / Proyecto (Identificador y Proyecto Matriz) */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="min-w-0 space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white truncate block text-[12px]">
                            {prop.title || 'Sin identificar'}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {prop.projectName ? (
                              <span className="font-semibold text-[#004aad] dark:text-[#38BDF8] flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3 shrink-0" />
                                <span className="truncate">{prop.projectName}</span>
                              </span>
                            ) : (
                              <span className="italic text-slate-400">Independiente</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Ubicación: Dirección, Distrito, Ciudad juntos */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate" title={locationText}>
                            {locationText}
                          </span>
                        </div>
                      </td>

                      {/* 3. Área (m²) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.areaTotal ? `${Number(prop.areaTotal).toLocaleString('en-US')} m²` : '-'}</span>
                        </div>
                      </td>

                      {/* 4. Moneda y Precio */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {currencyLabel} {(parseFloat(prop.price as any) || 0).toLocaleString('en-US')}
                        </div>
                      </td>

                      {/* 5. Estado */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant={prop.status || 'disponible'} size="sm">
                          {(prop.status || 'disponible').replace('_', ' ')}
                        </Badge>
                      </td>

                      {/* 6. Características / Atributos */}
                      <td className="py-3 px-4 max-w-[220px]">
                        {rawFeature ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#004aad] dark:text-[#38BDF8] border border-blue-100 dark:border-blue-800/40 text-[11px] font-semibold truncate max-w-full">
                            <Sparkles className="w-3.5 h-3.5 text-[#1154FF] dark:text-[#38BDF8] shrink-0" />
                            <span className="truncate">{rawFeature}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* 7. Acciones */}
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 pb-4">
          <span className="text-slate-500 text-xs">
            Mostrando {filteredProperties.length} unidades
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Anterior
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de Edición de Propiedad / Unidad */}
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
