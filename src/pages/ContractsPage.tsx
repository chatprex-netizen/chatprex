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
  List
} from 'lucide-react';

interface ContractsPageProps {
  onOpenNewContractModal?: () => void;
}

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredContracts.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="font-medium text-xs text-slate-600 dark:text-slate-300">
                No hay contratos registrados con los filtros seleccionados.
              </p>
            </div>
          ) : (
            filteredContracts.map((contract) => (
              <div
                key={contract.id}
                onClick={() => handleView(contract)}
                className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-2.5 cursor-pointer group"
              >
                {/* Top Row: Code + Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {contract.code}
                  </span>
                  <Badge variant={contract.status.toLowerCase()} size="sm">
                    {contract.status}
                  </Badge>
                </div>

                {/* Middle Row: Title & Price */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#004aad] transition-colors">
                    {contract.type}
                  </h3>
                  <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {contract.currency} {(parseFloat(contract.amount as any) || 0).toLocaleString()}
                  </div>
                </div>

                {/* Bottom Details Row */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div className="font-normal truncate" title={contract.unit}>
                    {(() => {
                      if (contract.propertyId) {
                        const prop = properties?.find(p => p.id === contract.propertyId);
                        if (prop && prop.projectName) {
                          return `${prop.projectName} - ${contract.unit}`;
                        }
                      }
                      return contract.unit;
                    })()}
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="truncate">
                      Comprador: <strong className="text-slate-700 dark:text-slate-300 font-medium">{contract.client}</strong> · Creado {contract.createdDate}
                    </span>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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
                  </div>
                </div>
              </div>
            ))
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
                      No hay contratos registrados con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      onClick={() => handleView(contract)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {contract.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {contract.type}
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate" title={contract.unit}>
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
                      <td className="py-3 px-4 font-medium">
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
                        <button
                          onClick={() => handleEdit(contract)}
                          className="text-[#004aad] hover:underline font-medium text-xs mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar el contrato ${contract.code}?`)) {
                              deleteContract(contract.id);
                            }
                          }}
                          className="text-rose-500 hover:underline font-medium text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New & Edit Modal */}
      <ContractModal
        isOpen={isNewModalOpen || isEditModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setIsEditModalOpen(false);
          setContractToEdit(null);
        }}
        contractToEdit={contractToEdit}
      />

      {/* Detail / PDF Preview Modal */}
      <ContractDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setContractToView(null);
        }}
        contract={contractToView}
        onEdit={(c) => {
          setIsDetailModalOpen(false);
          handleEdit(c);
        }}
      />
    </div>
  );
};
