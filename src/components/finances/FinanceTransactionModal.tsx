import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { Modal } from '../common/Modal';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Editar Transacción' : 'Nueva Transacción Financiera'}
      subtitle="Registra ingresos por comisión o egresos operativos de la agencia"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Movimiento *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FinanceTransactionType)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
              required
            >
              <option value="ingreso">Ingreso (+)</option>
              <option value="egreso">Egreso (-)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Categoría *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FinanceCategory)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
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
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Negociación / Venta
                </label>
                <select
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
                >
                  <option value="">Selecciona una oportunidad</option>
                  {deals.filter(d => d.stage === 'ganado' || d.stage === 'reserva' || d.stage === 'negociacion').map(deal => (
                    <option key={deal.id} value={deal.id}>{deal.title} ({deal.currency} {deal.value.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              {category === 'Comisión a agente' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                    Asesor Inmobiliario
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Selecciona un agente</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                    % de Comisión
                  </label>
                  <input
                    type="number"
                    value={customCommissionPct}
                    onChange={(e) => setCustomCommissionPct(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej: 5"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Concepto / Descripción *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Comisión por venta departamento 402 Edificio Miraflores"
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Monto *
            </label>
            <div className="flex gap-1">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-20 px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="USD">USD</option>
                <option value="PEN">S/</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] font-semibold text-emerald-600 dark:text-emerald-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FinanceStatus)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 capitalize"
                required
              >
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all active:scale-95"
          >
            {transaction ? 'Guardar Cambios' : 'Registrar Transacción'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
