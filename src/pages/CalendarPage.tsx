import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Badge } from '../components/common/Badge';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  User,
  Building2, 
  Trash2,
  Search,
  Pencil
} from 'lucide-react';

interface CalendarPageProps {
  onOpenNewAppointmentModal: () => void;
  onEditAppointment: (app: any) => void; // Using any or importing Appointment
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onOpenNewAppointmentModal,
  onEditAppointment,
}) => {
  const { 
    appointments, 
    fetchAppointments,
    updateAppointmentStatus, 
    deleteAppointment, 
    addNotification,
    properties, 
    contacts, 
    agents 
  } = useCRM();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  React.useEffect(() => {
    // Cargar citas del mes actual (para aliviar memoria, en lugar de todas las de la historia)
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(date.getFullYear(), date.getMonth() + 2, 0).toISOString().split('T')[0]; // +2 meses para tener un margen
    fetchAppointments(startDate, endDate);
  }, []);
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = filterStatus !== 'all' ? 1 : 0;

  const filteredAppointments = appointments.filter((app) => {
    return filterStatus === 'all' || app.status === filterStatus;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header & Filters grouped in the single top box */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        {/* Top Row: Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#004aad]" />
              <span>Agenda de visitas</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-normal">
              {appointments.length} citas programadas con clientes compradores
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1.5 px-2.5 ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#004aad] border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Filtrar"
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
              onClick={onOpenNewAppointmentModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Agendar visita</span>
              <span className="sm:hidden">Agendar</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Filters (Hidden by default) */}
        {showFilters && (
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar animate-fade-in">
            {[
              { id: 'all', label: 'Todas las citas' },
              { id: 'programada', label: 'Programadas' },
              { id: 'confirmada', label: 'Confirmadas' },
              { id: 'realizada', label: 'Realizadas' },
              { id: 'cancelada', label: 'Canceladas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium shrink-0 transition-all ${
                  filterStatus === tab.id
                    ? 'bg-[#004aad] text-white shadow-xs'
                    : 'bg-[#f1f1f1] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="space-y-2.5">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <p className="font-medium text-xs text-slate-600 dark:text-slate-300">
              No hay citas con este filtro.
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const property = properties.find((p) => p.id === app.propertyId);
            const contact = contacts.find((c) => c.id === app.contactId);
            const agent = agents.find((a) => a.id === app.agentId);

            return (
              <div
                key={app.id}
                className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Left Side: Date/Time Badge & Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center shrink-0 min-w-[65px]">
                    <span className="text-[10px] text-[#004aad] dark:text-blue-300 block font-medium capitalize">
                      {app.date}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 block mt-0.5">
                      {app.time}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {app.title}
                      </h3>
                      <Badge variant={app.status} size="sm">
                        {app.status}
                      </Badge>
                    </div>

                    {property && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#004aad]" />
                        <span>{property.title}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400">
                      {contact && (
                        <span className="flex items-center gap-1 text-[#004aad]">
                          <User className="w-3 h-3" />
                          {contact.name} ({contact.phone})
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {app.location}
                      </span>
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Agent info & Quick Status Switcher */}
                <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  {agent && (
                    <span className="text-[11px] text-slate-400">
                      {agent.name.split(' ')[0]}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {app.status !== 'confirmada' && (
                      <button
                        onClick={() => updateAppointmentStatus(app.id, 'confirmada')}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        Confirmar
                      </button>
                    )}

                    {app.status !== 'realizada' && (
                      <button
                        onClick={async () => {
                          await updateAppointmentStatus(app.id, 'realizada');
                          addNotification('Cita Realizada', `La cita "${app.title}" fue marcada como realizada.`, 'success');
                        }}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-blue-50 text-[#004aad] hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        Realizada
                      </button>
                    )}

                    <button
                      onClick={() => onEditAppointment && onEditAppointment(app)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`¿Eliminar la cita "${app.title}"?`)) {
                          try {
                            await deleteAppointment(app.id);
                            addNotification('Cita Eliminada', `La cita "${app.title}" ha sido eliminada.`, 'info');
                          } catch (err: any) {
                            addNotification('Error al eliminar', err.message || 'No se pudo eliminar la cita.', 'error');
                          }
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
