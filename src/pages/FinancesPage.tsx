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
  Settings,
  Clock
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { FinanceTransactionModal } from '../components/finances/FinanceTransactionModal';
import { FinanceTransaction } from '../types';
import { StatCard } from '../components/common/StatCard';


type DisplayCurrency = 'USD' | 'PEN' | 'MXN';

export const FinancesPage: React.FC = () => {
  const { financeTransactions, deleteFinanceTransaction } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<FinanceTransaction | undefined>(undefined);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'egreso'>('todos');
  
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  
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
      
      const txDate = tx.date; // assuming YYYY-MM-DD
      const matchDate = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);

      return matchSearch && matchType && matchDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [financeTransactions, searchTerm, filterType, startDate, endDate]);

  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let pendingIncome = 0;
    
    financeTransactions.forEach(tx => {
      const val = convertToDisplay(tx.amount, tx.currency);
      if (tx.status === 'pagado') {
        if (tx.type === 'ingreso') totalIncome += val;
        if (tx.type === 'egreso') totalExpense += val;
      } else {
        if (tx.type === 'ingreso') pendingIncome += val;
      }
    });

    return {
      totalIncome,
      totalExpense,
      pendingIncome,
      net: totalIncome - totalExpense
    };
  }, [financeTransactions, displayCurrency, exchangeRatePEN, exchangeRateMXN]);



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
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#004aad]" />
            <span>Finanzas Inmobiliarias</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Gestiona ingresos, egresos, comisiones compartidas y métricas.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Vista: {displayCurrency}
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-10 animate-fade-in">
                <h3 className="font-semibold text-slate-800 dark:text-white text-xs mb-2">Configuración Moneda</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Base</label>
                    <select 
                      value={displayCurrency}
                      onChange={e => setDisplayCurrency(e.target.value as DisplayCurrency)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PEN">PEN (S/)</option>
                      <option value="MXN">MXN ($)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">TC PEN</label>
                      <input 
                        type="number" step="0.01" value={exchangeRatePEN} onChange={e => setExchangeRatePEN(Number(e.target.value))}
                        className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-xs text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">TC MXN</label>
                      <input 
                        type="number" step="0.01" value={exchangeRateMXN} onChange={e => setExchangeRateMXN(Number(e.target.value))}
                        className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1 text-xs text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Transacción</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <StatCard
          title="Ingresos"
          value={formatCurrency(stats.totalIncome)}
          subtitle="Pagados"
          icon={ArrowUpRight}
          color="emerald"
        />

        <StatCard
          title="Egresos"
          value={formatCurrency(stats.totalExpense)}
          subtitle="Pagados"
          icon={ArrowDownRight}
          color="rose"
        />

        <StatCard
          title="Saldo Neto"
          value={formatCurrency(stats.net)}
          subtitle="Balance actual"
          icon={TrendingUp}
          color="blue"
        />

        <StatCard
          title="Cuentas x Cobrar"
          value={formatCurrency(stats.pendingIncome)}
          subtitle="Ingresos pendientes"
          icon={Clock}
          color="amber"
        />
      </div>



      {/* Filter Tabs & Selectors */}
      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative w-full lg:w-64 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar transacción..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200/90 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#004aad] focus:border-[#004aad] outline-none"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-lg px-2 py-1">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-[11px] bg-transparent border-none text-slate-700 dark:text-slate-300 focus:ring-0 p-0 cursor-pointer" />
            <span className="text-slate-400 text-[9px] font-bold uppercase mx-0.5">a</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-[11px] bg-transparent border-none text-slate-700 dark:text-slate-300 focus:ring-0 p-0 cursor-pointer" />
          </div>
          
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-lg px-2 py-1">
            <Filter className="w-3 h-3 text-slate-400 mr-1" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="text-[11px] font-semibold bg-transparent border-none text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer p-0 pr-4"
            >
              <option value="todos">Todos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List Wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold tracking-wider">
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">Fecha</th>
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">Descripción</th>
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">Categoría</th>
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 text-right">Monto Orig.</th>
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 text-right">Valor ({displayCurrency})</th>
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 text-center">Estado</th>
                <th className="px-3 py-2 border-b border-slate-200 dark:border-slate-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron transacciones.
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => {
                  const convertedAmount = convertToDisplay(tx.amount, tx.currency);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {new Date(tx.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-white font-semibold text-[11px]">
                        {tx.description}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap text-right font-bold text-[11px] ${tx.type === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {tx.type === 'ingreso' ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                        {formatCurrency(convertedAmount)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          tx.status === 'pagado'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleEdit(tx)}
                          className="text-slate-400 hover:text-[#004aad] p-1 transition-colors mr-1"
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
