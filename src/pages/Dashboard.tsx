import React from 'react';
import { 
  TrendingUp, 
  Home, 
  Users, 
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { useCRM } from '../context/CRMContext';
import { Page } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onOpenNewAppointmentModal: () => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenNewAppointmentModal,
}) => {
  const { properties, deals, contacts, appointments } = useCRM();

  const openDeals = deals.filter((d) => d.stage !== 'perdido' && d.stage !== 'ganado');
  const totalOpenValue = openDeals.reduce((sum, d) => sum + d.value, 0);

  const wonDeals = deals.filter((d) => d.stage === 'ganado');
  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0) || 342000;
  const availablePropertiesCount = properties.filter((p) => p.status === 'disponible').length;

  const funnelStages = [
    { label: 'Prospección', count: 1, value: 489000, pct: 55 },
    { label: 'Calificación', count: 1, value: 365000, pct: 40 },
    { label: 'Visita', count: 1, value: 298000, pct: 35 },
    { label: 'Propuesta', count: 1, value: 920000, pct: 85 },
    { label: 'Negociación', count: 1, value: 540000, pct: 60 },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Llamada inicial de calificación con el cliente.',
      type: 'Llamada',
      agent: 'Phyllis Yang',
      time: '04-ago., 08:29 p. m.',
    },
    {
      id: '2',
      title: 'Visita realizada a la sala de ventas de Torre Marina.',
      type: 'Visita',
      agent: 'Lucía Ferrer',
      time: '04-ago., 08:29 p. m.',
    },
    {
      id: '3',
      title: 'Oportunidad movida a Negociación.',
      type: 'Cambio etapa',
      agent: 'Jose Moreno',
      time: '04-ago., 08:29 p. m.',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
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
            subtitle={`${wonDeals.length || 1} operaciones`}
            icon={CheckCircle2}
            color="emerald"
          />
        </div>
      </div>

      {/* Funnel breakdown & Upcoming visits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Embudo por etapa */}
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white">
              Embudo por etapa
            </h3>
            <button
              onClick={() => onNavigate('pipeline')}
              className="text-[11px] font-medium text-[#004aad] hover:underline flex items-center gap-1"
            >
              Ver pipeline
            </button>
          </div>

          <div className="space-y-3.5">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {stage.label}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {stage.count} · S/ {stage.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas citas */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
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
                <div
                  key={app.id}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                      {app.title}
                    </span>
                    <Badge variant={index === 1 ? 'confirmada' : 'pendiente'} size="sm">
                      {index === 1 ? 'Confirmada' : 'Pendiente'}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {app.date}, {app.time} · {contacts[index % contacts.length]?.name || 'Cliente'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="w-full mt-3 pt-2 text-center text-[11px] font-medium text-slate-500 hover:text-[#004aad] border-t border-slate-100 dark:border-slate-800 transition-colors"
          >
            Ver toda la agenda →
          </button>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
        <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white mb-3">
          Actividad reciente
        </h3>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
          {recentActivities.map((act, i) => (
            <div key={act.id} className={`flex items-start gap-2.5 ${i > 0 ? 'pt-2.5' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {act.title}
                </div>
                <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                  {act.type} · {act.agent} · {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
