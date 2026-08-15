import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { FinanceTransaction, FinanceTransactionType, FinanceCategory, FinanceStatus, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface FinanceTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: FinanceTransaction;
}

export const FinanceTransactionModal: React.FC<FinanceTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { addFinanceTransaction, updateFinanceTransaction, deals, properties, agents } = useCRM();

  const [type, setType] = useState<FinanceTransactionType>('ingreso');
  const [category, setCategory] = useState<FinanceCategory>(INCOME_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState('USD');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<FinanceStatus>('pagado');

  const [selectedDealId, setSelectedDealId] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [customCommissionPct, setCustomCommissionPct] = useState<number | ''>('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setCategory(transaction.category);
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setCurrency(transaction.currency);
      setDate(transaction.date);
      setStatus(transaction.status);
    } else {
      setType('ingreso');
      setCategory(INCOME_CATEGORIES[0]);
      setDescription('');
      setAmount('');
      setCurrency('USD');
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('pagado');
    }
  }, [transaction, isOpen]);

  // Si cambia el tipo, resetear la categoría
  useEffect(() => {
    if (!transaction) {
      setCategory(type === 'ingreso' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    }
  }, [type, transaction]);

  useEffect(() => {
    if (!selectedDealId) return;
    
    const deal = deals.find(d => d.id === selectedDealId);
    if (!deal) return;

    if (category === 'Comisión por venta') {
      const property = properties.find(p => p.id === deal.propertyId);
      const defaultPct = property ? property.commissionPct : 5;
      const pct = customCommissionPct !== '' ? Number(customCommissionPct) : defaultPct;
      setAmount((deal.value * pct) / 100);
      setCurrency(deal.currency);
      setDescription(`Comisión por venta - ${deal.title} (${pct}%)`);
    } else if (category === 'Comisión a agente') {
      // Por defecto, asumamos que el agente gana la mitad de la comisión de la empresa, es decir, el 50% del ingreso,
      // o un porcentaje directo del valor de la propiedad. Asumiremos un 2.5% por defecto si no hay input.
      const pct = customCommissionPct !== '' ? Number(customCommissionPct) : 2.5;
      setAmount((deal.value * pct) / 100);
      setCurrency(deal.currency);
      const agent = agents.find(a => a.id === selectedAgentId);
      setDescription(`Pago a asesor ${agent ? agent.name : ''} - ${deal.title} (${pct}%)`);
    }
  }, [selectedDealId, selectedAgentId, customCommissionPct, category, deals, properties, agents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const data = {
      type,
      category,
      description,
      amount: Number(amount),
      currency,
      date,
      status,
    };

    if (transaction) {
      updateFinanceTransaction(transaction.id, data);
    } else {
      addFinanceTransaction(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#004aad]" />
            {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="financeForm" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tipo
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as FinanceTransactionType)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FinanceCategory)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                >
                  {type === 'ingreso' ? (
                    INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  ) : (
                    EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  )}
                </select>
              </div>
            </div>

            {(category === 'Comisión por venta' || category === 'Comisión a agente') && (
              <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Propiedad Vendida (Deal)
                    </label>
                    <select
                      value={selectedDealId}
                      onChange={(e) => setSelectedDealId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="">Selecciona una oportunidad</option>
                      {deals.filter(d => d.stage === 'ganado' || d.stage === 'cierre' || d.stage === 'negociacion').map(deal => (
                        <option key={deal.id} value={deal.id}>{deal.title} ({deal.currency} {deal.value.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>

                  {category === 'Comisión a agente' ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Agente / Asesor
                      </label>
                      <select
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      >
                        <option value="">Selecciona un agente</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        % de Comisión
                      </label>
                      <input
                        type="number"
                        value={customCommissionPct}
                        onChange={(e) => setCustomCommissionPct(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Ej. 5"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  )}

                  {category === 'Comisión a agente' && (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        % de Comisión (Asesor)
                      </label>
                      <input
                        type="number"
                        value={customCommissionPct}
                        onChange={(e) => setCustomCommissionPct(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Ej. 2.5"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Comisión por venta de Casa Miraflores"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Monto
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Moneda
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                >
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FinanceStatus)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                >
                  <option value="pagado">Pagado / Cobrado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            
          </form>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="financeForm"
            className="px-4 py-2 text-sm font-medium text-white bg-[#004aad] hover:bg-[#003c8b] rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {transaction ? 'Guardar Cambios' : 'Registrar Transacción'}
          </button>
        </div>
      </div>
    </div>
  );
};
