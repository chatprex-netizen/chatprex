import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Contract } from '../types';
import { Badge } from '../components/common/Badge';
import { ContractModal } from '../components/contracts/ContractModal';
import { ContractDetailModal } from '../components/contracts/ContractDetailModal';
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Edit3, 
  LayoutGrid,
  List,
  Building,
  User,
  Eye,
  Scroll
} from 'lucide-react';

interface ContractsPageProps {
  onOpenNewContractModal?: () => void;
}

const CONTRACT_STATUS_CONFIG: Record<string, { label: string; color: string; bgLight: string; border: string; dot: string }> = {
  Firmado: {
    label: 'Firmado',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  Enviado: {
    label: 'Enviado',
    color: 'text-blue-700 dark:text-blue-300',
    bgLight: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  Pendiente: {
    label: 'Pendiente',
    color: 'text-amber-700 dark:text-amber-300',
    bgLight: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  Borrador: {
    label: 'Borrador',
    color: 'text-slate-700 dark:text-slate-300',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  Cancelado: {
    label: 'Cancelado',
    color: 'text-rose-700 dark:text-rose-300',
    bgLight: 'bg-rose-50 dark:bg-rose-950/50',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
};

export const ContractsPage: React.FC<ContractsPageProps> = () => {
  const { 
    contracts, 
    deleteContract, 
    searchQuery, 
    setSearchQuery,
    properties
  } = useCRM();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [contractToView, setContractToView] = useState<Contract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Contador de filtros activos
  const activeFiltersCount = [
    selectedType !== 'all',
    selectedStatus !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  // Totales
  const totalAmount = contracts.reduce((sum, c) => sum + (parseFloat(c.amount as any) || 0), 0);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = !searchQuery ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || c.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (contract: Contract) => {
    setContractToEdit(contract);
    setIsEditModalOpen(true);
  };

  const handleView = (contract: Contract) => {
    setContractToView(contract);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-3.5 animate-fade-in text-xs">
      {/* Header, Search & Filters all grouped in the single top box */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        {/* Top Row: Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#004aad]" />
              <span>Contratos</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-normal">
              {contracts.length} documentos · S/ {totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-slate-900 text-[#004aad] shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Vista en lista"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                setContractToEdit(null);
                setIsNewModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo contrato</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Search Box & Filter Selectors (Hidden by default) */}
        {showFilters && (
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center animate-fade-in">
            {/* Quick Search */}
            <div className="relative w-full sm:w-[40%] min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar contrato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#004aad]"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {['all', 'Separación', 'Compraventa', 'Arras', 'Alquiler'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium shrink-0 transition-all ${
                    selectedType === t
                      ? 'bg-[#004aad] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'Todos' : t}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">Todos los estados</option>
              <option value="Firmado">Firmado</option>
              <option value="Enviado">Enviado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Borrador">Borrador</option>
            </select>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredContracts.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="font-medium text-xs text-slate-600 dark:text-slate-300">
                No hay contratos registrados con los filtros seleccionados.
              </p>
            </div>
          ) : (
            filteredContracts.map((contract) => {
              const statusConfig = CONTRACT_STATUS_CONFIG[contract.status] || CONTRACT_STATUS_CONFIG.Borrador;
              const contractUnitFull = (() => {
                if (contract.propertyId) {
                  const prop = properties?.find(p => p.id === contract.propertyId);
                  if (prop && prop.projectName) {
                    return `${prop.projectName} - ${contract.unit}`;
                  }
                }
                return contract.unit;
              })();

              return (
                <div
                  key={contract.id}
                  className="p-3 sm:p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-2">
                    {/* Top Row: Icon + Title + Status Pill */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#004aad] dark:text-blue-300 flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 font-bold text-[10px]">
                          <Scroll className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {contract.type}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {contract.code}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${statusConfig.bgLight} ${statusConfig.color} ${statusConfig.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          <span>{contract.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Tag / Type Badge */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <Badge variant="blue" size="sm">
                        {contract.type}
                      </Badge>
                      <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {contract.currency === 'PEN' ? 'Soles (S/)' : 'Dólares (USD)'}
                      </span>
                      {contract.status === 'Pendiente' && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-amber-50 text-amber-600 border border-amber-200">
                          Por Firmar
                        </span>
                      )}
                    </div>

                    {/* Contract Details */}
                    <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {/* Comprador */}
                      <div className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          Comprador: <strong className="font-medium text-slate-800 dark:text-slate-200">{contract.client}</strong>
                        </span>
                      </div>

                      {/* Monto */}
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs truncate">
                        <span className="truncate">
                          {contract.currency === 'PEN' ? 'S/' : (contract.currency || 'S/')} {(parseFloat(contract.amount as any) || 0).toLocaleString('en-US')}
                        </span>
                      </div>

                      {/* Proyecto / Unidad */}
                      {contractUnitFull && (
                        <div className="flex items-center gap-1 text-slate-400 truncate" title={contractUnitFull}>
                          <Building className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {contractUnitFull}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Manage Button */}
                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleView(contract)}
                      className="w-full py-1 px-2 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-[#004aad] text-slate-600 dark:text-slate-300 text-[10px] font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-[#004aad]" />
                      <span>Gestionar Contrato</span>
                    </button>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                        Creado {contract.createdDate}
                      </span>

                      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleView(contract)}
                          title="Ver detalle y PDF"
                          className="p-1 rounded text-slate-400 hover:text-[#004aad] hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleEdit(contract)}
                          title="Editar"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar el contrato ${contract.code}?`)) {
                              deleteContract(contract.id);
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[800px]">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Código</th>
                  <th className="py-2.5 px-4">Tipo</th>
                  <th className="py-2.5 px-4">Unidad</th>
                  <th className="py-2.5 px-4">Comprador</th>
                  <th className="py-2.5 px-4">Monto</th>
                  <th className="py-2.5 px-4">Fecha</th>
                  <th className="py-2.5 px-4">Estado</th>
                  <th className="py-2.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-normal">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No hay contratos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr 
                      key={contract.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => handleView(contract)}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                        {contract.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {contract.type}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {(() => {
                          if (contract.propertyId) {
                            const prop = properties?.find(p => p.id === contract.propertyId);
                            if (prop && prop.projectName) {
                              return `${prop.projectName} - ${contract.unit}`;
                            }
                          }
                          return contract.unit;
                        })()}
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        {contract.client}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {contract.currency} {(parseFloat(contract.amount as any) || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {contract.createdDate}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={contract.status.toLowerCase()} size="sm">
                          {contract.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(contract)}
                            className="p-1 rounded text-slate-400 hover:text-[#004aad]"
                            title="Ver detalle"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(contract)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar el contrato ${contract.code}?`)) {
                                deleteContract(contract.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      <ContractModal
        isOpen={isNewModalOpen || isEditModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setIsEditModalOpen(false);
          setContractToEdit(null);
        }}
        contractToEdit={contractToEdit}
      />

      <ContractDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setContractToView(null);
        }}
        contract={contractToView}
      />
    </div>
  );
};
