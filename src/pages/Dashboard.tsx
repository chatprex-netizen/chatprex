import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Home, 
  Users, 
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Download
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { useCRM } from '../context/CRMContext';
import { Page } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onOpenNewAppointmentModal: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const DashboardPage: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenNewAppointmentModal,
}) => {
  const { properties, deals, contacts, appointments, pipelineStages, tasks } = useCRM();

  // KPIs Generales
  const openDeals = deals.filter((d) => d.stage !== 'perdido' && d.stage !== 'ganado');
  const totalOpenValue = openDeals.reduce((sum, d) => sum + d.value, 0);

  const wonDeals = deals.filter((d) => d.stage === 'ganado');
  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const availablePropertiesCount = properties.filter((p) => p.status === 'disponible').length;

  // 1. Embudo por Etapa (Real Data)
  const funnelStages = useMemo(() => {
    return pipelineStages.filter(s => s.visible).map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage.id);
      const count = stageDeals.length;
      const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
      return {
        id: stage.id,
        label: stage.name,
        count,
        value,
        color: stage.color || '#10b981'
      };
    });
  }, [pipelineStages, deals]);

  // Métricas de Conversión
  const totalDealsCount = deals.length;
  const wonDealsCountMetric = deals.filter(d => d.stage === 'ganado').length;
  const conversionRate = totalDealsCount > 0 ? ((wonDealsCountMetric / totalDealsCount) * 100).toFixed(1) : '0.0';

  const maxStageValue = Math.max(...funnelStages.map(s => s.value), 1);

  // 2. Canales de Captación
  const channelData = useMemo(() => {
    const counts = contacts.reduce((acc, c) => {
      const channel = c.channel || 'otros';
      acc[channel] = (acc[channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value], idx) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[idx % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [contacts]);

  // 3. Actividad reciente (Mezclando Deals, Contacts y Tasks recientes)
  const recentActivities = useMemo(() => {
    const activities: any[] = [];
    
    // Últimos contactos
    contacts.slice(0, 5).forEach(c => {
      activities.push({
        id: `c-${c.id}`,
        title: `Nuevo contacto registrado: ${c.name}`,
        type: 'Contacto',
        time: new Date(c.createdAt).getTime(),
        dateStr: new Date(c.createdAt).toLocaleDateString()
      });
    });

    // Últimos deals
    deals.slice(0, 5).forEach(d => {
      activities.push({
        id: `d-${d.id}`,
        title: `Oportunidad creada: ${d.title}`,
        type: 'Pipeline',
        time: new Date(d.createdAt).getTime(),
        dateStr: new Date(d.createdAt).toLocaleDateString()
      });
    });

    // Últimas tareas
    tasks.slice(0, 5).forEach(t => {
      activities.push({
        id: `t-${t.id}`,
        title: `Tarea: ${t.title}`,
        type: 'Tarea',
        time: new Date(t.createdAt).getTime(),
        dateStr: new Date(t.createdAt).toLocaleDateString()
      });
    });

    return activities.sort((a, b) => b.time - a.time).slice(0, 6);
  }, [contacts, deals, tasks]);

  // 4. Campañas / Origen de Oportunidades (Gráfico de barras)
  const dealsByChannel = useMemo(() => {
    const data: Record<string, number> = {};
    deals.forEach(deal => {
      const contact = contacts.find(c => c.id === deal.leadId);
      const channel = contact?.channel || 'otros';
      data[channel] = (data[channel] || 0) + 1;
    });
    return Object.entries(data).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      Oportunidades: count
    }));
  }, [deals, contacts]);

import { exportToCSV } from '../lib/exportUtils';

  // ... (inside component)
  const handleExport = () => {
    const exportData = deals.map(d => {
      const contact = contacts.find(c => c.id === d.leadId);
      const stage = pipelineStages.find(s => s.id === d.stage);
      return {
        'Título': d.title,
        'Valor': d.value,
        'Moneda': d.currency,
        'Etapa': stage?.name || d.stage,
        'Probabilidad (%)': d.probability,
        'Contacto': contact?.name || 'Desconocido',
        'Teléfono': contact?.phone || '',
        'Fecha Creación': new Date(d.createdAt).toLocaleDateString()
      };
    });

    const columns = [
      { key: 'Título', label: 'Título del Deal' },
      { key: 'Valor', label: 'Valor' },
      { key: 'Moneda', label: 'Moneda' },
      { key: 'Etapa', label: 'Etapa Pipeline' },
      { key: 'Probabilidad (%)', label: 'Probabilidad (%)' },
      { key: 'Contacto', label: 'Contacto' },
      { key: 'Teléfono', label: 'Teléfono' },
      { key: 'Fecha Creación', label: 'Fecha Creación' },
    ];

    exportToCSV(exportData, 'Reporte_Ventas_Pipeline', columns);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Resumen Comercial</h1>
          <p className="text-sm text-slate-500">Métricas y desempeño en tiempo real</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Exportar Reporte
        </button>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div onClick={() => onNavigate('pipeline')} className="cursor-pointer">
          <StatCard
            title="Pipeline abierto"
            value={`S/ ${totalOpenValue.toLocaleString()}`}
            subtitle={`${openDeals.length} oportunidades`}
            icon={TrendingUp}
            color="emerald"
          />
        </div>

        <div onClick={() => onNavigate('properties')} className="cursor-pointer">
          <StatCard
            title="Unidades disponibles"
            value={`${availablePropertiesCount}`}
            subtitle={`${properties.length} unidades registradas`}
            icon={Home}
            color="emerald"
          />
        </div>

        <div onClick={() => onNavigate('contacts')} className="cursor-pointer">
          <StatCard
            title="Contactos"
            value={`${contacts.length}`}
            subtitle="Base activa"
            icon={Users}
            color="emerald"
          />
        </div>

        <div onClick={() => onNavigate('contracts')} className="cursor-pointer">
          <StatCard
            title="Cierres ganados"
            value={`S/ ${totalWonValue.toLocaleString()}`}
            subtitle={`${wonDeals.length} operaciones`}
            icon={CheckCircle2}
            color="emerald"
          />
        </div>
      </div>

      {/* Row 2: Embudo y Canales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Embudo por etapa */}
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#004aad]" />
              Embudo de Ventas (Pipeline)
            </h3>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Conversión</span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{conversionRate}%</span>
              </div>
              <button
                onClick={() => onNavigate('pipeline')}
                className="text-[11px] font-medium text-[#004aad] hover:underline"
              >
                Ver pipeline
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {funnelStages.map((stage) => {
              const pct = maxStageValue > 0 ? (stage.value / maxStageValue) * 100 : 0;
              return (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {stage.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {stage.count} op. · S/ {stage.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              );
            })}
            {funnelStages.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No hay datos en el pipeline.</p>
            )}
          </div>
        </div>

        {/* Gráfico de Canales de Captación */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col">
          <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-[#004aad]" />
            Canales de Captación
          </h3>
          <div className="flex-1 min-h-[200px]">
            {channelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No hay contactos registrados
              </div>
            )}
          </div>
          {/* Leyenda de canales */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {channelData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Actividad y Rendimiento de Campañas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rendimiento de Campañas (Deals por Canal) */}
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
          <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white mb-4">
            Rendimiento de Campañas (Oportunidades por Canal)
          </h3>
          <div className="h-[250px] w-full">
            {dealsByChannel.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealsByChannel} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="Oportunidades" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No hay oportunidades registradas
              </div>
            )}
          </div>
        </div>

        {/* Actividad reciente y Próximas citas */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white">
                Próximas citas
              </h3>
              <button
                onClick={onOpenNewAppointmentModal}
                className="text-[11px] font-medium text-[#004aad] hover:underline"
              >
                + Agendar
              </button>
            </div>
            <div className="space-y-2.5">
              {appointments.slice(0, 3).map((app, index) => (
                <div key={app.id} className="p-2.5 rounded-lg border border-slate-200/80 dark:bg-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                      {app.title}
                    </span>
                    <Badge variant={app.status === 'realizada' ? 'confirmada' : 'pendiente'} size="sm">
                      {app.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {app.date}, {app.time}
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-[11px] text-slate-400">No hay citas agendadas.</p>
              )}
            </div>
            {appointments.length > 0 && (
              <button
                onClick={() => onNavigate('calendar')}
                className="w-full mt-3 pt-2 text-center text-[11px] font-medium text-slate-500 hover:text-[#004aad] border-t border-slate-100 dark:border-slate-800 transition-colors"
              >
                Ver toda la agenda →
              </button>
            )}
          </div>

          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white mb-3">
              Actividad reciente
            </h3>
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentActivities.map((act, i) => (
                <div key={act.id} className={`flex items-start gap-2.5 ${i > 0 ? 'pt-2.5' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.type === 'Contacto' ? 'bg-blue-500' : act.type === 'Pipeline' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                      {act.type} · {act.dateStr}
                    </div>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-[11px] text-slate-400">No hay actividad reciente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
