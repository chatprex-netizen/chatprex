import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { FinanceTransactionModal } from '../components/finances/FinanceTransactionModal';
import { FinanceTransaction } from '../types';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

type DisplayCurrency = 'USD' | 'PEN' | 'MXN';

export const FinancesPage: React.FC = () => {
  const { financeTransactions, deleteFinanceTransaction } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<FinanceTransaction | undefined>(undefined);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'egreso'>('todos');
  
  // Settings
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>('USD');
  const [exchangeRatePEN, setExchangeRatePEN] = useState(3.75);
  const [exchangeRateMXN, setExchangeRateMXN] = useState(17.50);
  const [showSettings, setShowSettings] = useState(false);

  const convertToDisplay = (amount: number, currency: string): number => {
    // 1. Convert to USD first
    let inUSD = amount;
    if (currency === 'PEN') inUSD = amount / exchangeRatePEN;
    if (currency === 'MXN') inUSD = amount / exchangeRateMXN;
    if (currency === 'EUR') inUSD = amount * 1.08; // Fixed approx EUR for simplicity

    // 2. Convert from USD to displayCurrency
    if (displayCurrency === 'USD') return inUSD;
    if (displayCurrency === 'PEN') return inUSD * exchangeRatePEN;
    if (displayCurrency === 'MXN') return inUSD * exchangeRateMXN;
    return inUSD;
  };

  const formatCurrency = (amount: number, curr: string = displayCurrency) => {
    let validCurr = curr;
    if (validCurr === 'S/') validCurr = 'PEN';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: validCurr,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return `${validCurr} ${amount.toFixed(2)}`;
    }
  };

  const filteredTx = useMemo(() => {
    return (financeTransactions || []).filter(tx => {
      const desc = tx.description || '';
      const cat = tx.category || '';
      const matchSearch = desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'todos' || tx.type === filterType;
      return matchSearch && matchType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [financeTransactions, searchTerm, filterType]);

  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    financeTransactions.forEach(tx => {
      if (tx.status !== 'pagado') return; // Only count paid
      const val = convertToDisplay(tx.amount, tx.currency);
      if (tx.type === 'ingreso') totalIncome += val;
      if (tx.type === 'egreso') totalExpense += val;
    });

    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense
    };
  }, [financeTransactions, displayCurrency, exchangeRatePEN, exchangeRateMXN]);

  // Chart Data: Category Breakdown
  const categoryData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    financeTransactions.forEach(tx => {
      if (tx.type === 'egreso' && tx.status === 'pagado') {
        const val = convertToDisplay(tx.amount, tx.currency);
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + val;
      }
    });
    return Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  }, [financeTransactions, displayCurrency, exchangeRatePEN, exchangeRateMXN]);

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#06b6d4'];

  const handleEdit = (tx: FinanceTransaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      deleteFinanceTransaction(id);
    }
  };

  const handleOpenNew = () => {
    setSelectedTx(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#004aad]" />
            Finanzas Inmobiliarias
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona ingresos, egresos, comisiones compartidas y métricas.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Ver en: {displayCurrency}
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-10 animate-fade-in">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Configuración de Moneda</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">Moneda Base</label>
                    <select 
                      value={displayCurrency}
                      onChange={e => setDisplayCurrency(e.target.value as DisplayCurrency)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PEN">PEN (S/)</option>
                      <option value="MXN">MXN ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">Tasa de Cambio PEN</label>
                    <input 
                      type="number" step="0.01" value={exchangeRatePEN} onChange={e => setExchangeRatePEN(Number(e.target.value))}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-sm text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">Tasa de Cambio MXN</label>
                    <input 
                      type="number" step="0.01" value={exchangeRateMXN} onChange={e => setExchangeRateMXN(Number(e.target.value))}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-sm text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={handleOpenNew}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#004aad] hover:bg-[#003c8b] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Transacción
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ingresos (Pagados)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(stats.totalIncome)}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Egresos (Pagados)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(stats.totalExpense)}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            stats.net >= 0 ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-orange-100 dark:bg-orange-500/20'
          }`}>
            <TrendingUp className={`w-6 h-6 ${stats.net >= 0 ? 'text-[#004aad] dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Neto</p>
            <h3 className={`text-2xl font-bold mt-1 ${stats.net >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatCurrency(stats.net)}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Egresos por Categoría</h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No hay egresos registrados
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-medium">Motor Multimoneda Activo</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Tus transacciones se unifican automáticamente a {displayCurrency} para los reportes, 
            pero mantienen su moneda original en el registro detallado.
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar transacción..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#004aad] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="text-sm bg-transparent border-none text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer"
            >
              <option value="todos">Todos los tipos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">Fecha</th>
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">Descripción</th>
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">Categoría</th>
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 text-right">Monto Original</th>
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 text-right">Valor ({displayCurrency})</th>
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 text-center">Estado</th>
                <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-sm">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron transacciones.
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => {
                  const convertedAmount = convertToDisplay(tx.amount, tx.currency);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {new Date(tx.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${tx.type === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {tx.type === 'ingreso' ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-500 dark:text-slate-400">
                        {formatCurrency(convertedAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === 'pagado'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleEdit(tx)}
                          className="text-slate-400 hover:text-[#004aad] p-1 transition-colors mr-2"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FinanceTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
};
