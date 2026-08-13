import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Task, TaskType } from '../types';
import { TaskModal } from '../components/tasks/TaskModal';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface TasksPageProps {
  onOpenNewTaskModal: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  onOpenNewTaskModal,
}) => {
  const { 
    tasks, 
    toggleTaskComplete, 
    deleteTask, 
    contacts, 
    properties, 
    agents,
    searchQuery
  } = useCRM();

  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'pending' | 'overdue' | 'completed'>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasksCount = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'completada').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'completada').length;
  const overdueTasksCount = tasks.filter((t) => t.dueDate < todayStr && t.status !== 'completada').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = 
      filterTab === 'all' ? true :
      filterTab === 'today' ? task.dueDate === todayStr :
      filterTab === 'pending' ? task.status !== 'completada' :
      filterTab === 'overdue' ? (task.dueDate < todayStr && task.status !== 'completada') :
      task.status === 'completada';

    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesAgent = selectedAgent === 'all' || task.agentId === selectedAgent;

    return matchesSearch && matchesTab && matchesPriority && matchesAgent;
  });

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'llamada': return '📞';
      case 'whatsapp': return '💬';
      case 'visita': return '🏡';
      case 'documentacion': return '📄';
      case 'firma_contrato': return '✍️';
      case 'correo': return '📧';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#004aad]" />
            <span>Gestión de tareas</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Control de llamadas, visitas y seguimiento diario
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-medium shadow-xs transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva tarea</span>
        </button>
      </div>

      {/* KPI Cards: 2 tarjetas por fila en modo celular (grid-cols-2 lg:grid-cols-4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <StatCard
          title="Tareas para hoy"
          value={`${todayTasksCount}`}
          subtitle="Programadas hoy"
          icon={Clock}
          color="emerald"
        />

        <StatCard
          title="Pendientes totales"
          value={`${pendingTasksCount}`}
          subtitle="Por resolver"
          icon={AlertCircle}
          color="amber"
        />

        <StatCard
          title="Tareas vencidas"
          value={`${overdueTasksCount}`}
          subtitle="Atrasadas"
          icon={AlertTriangle}
          color="rose"
        />

        <StatCard
          title="Tareas completadas"
          value={`${completedTasksCount}`}
          subtitle="Cerradas con éxito"
          icon={CheckCircle2}
          color="blue"
        />
      </div>

      {/* Filter Tabs & Selectors */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'today', label: `Hoy (${todayTasksCount})` },
            { id: 'pending', label: `Pendientes (${pendingTasksCount})` },
            { id: 'overdue', label: `Vencidas (${overdueTasksCount})` },
            { id: 'completed', label: `Completadas (${completedTasksCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-all ${
                filterTab === tab.id
                  ? 'bg-[#004aad] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="all">Prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="all">Todos los asesores</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-400">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <p className="font-medium text-xs text-slate-600 dark:text-slate-300">
              No tienes tareas en esta sección.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completada';
            const contact = contacts.find((c) => c.id === task.contactId);
            const property = properties.find((p) => p.id === task.propertyId);
            const agent = agents.find((a) => a.id === task.agentId);
            const isDueToday = task.dueDate === todayStr;
            const isOverdue = task.dueDate < todayStr && !isCompleted;

            return (
              <div
                key={task.id}
                className={`p-3 bg-white dark:bg-slate-900 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-card hover:shadow-card-hover ${
                  isCompleted 
                    ? 'opacity-60 border-slate-200/80 dark:border-slate-800 bg-slate-50/50' 
                    : isOverdue
                    ? 'border-rose-300 dark:border-rose-900 ring-1 ring-rose-500/20'
                    : isDueToday 
                    ? 'border-blue-300 dark:border-blue-900 ring-1 ring-[#004aad]/20' 
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-0.5 text-[#004aad] hover:scale-105 transition-transform shrink-0"
                    title={isCompleted ? 'Marcar pendiente' : 'Marcar completada'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 fill-[#004aad] text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 hover:text-[#004aad]" />
                    )}
                  </button>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm">{getTaskTypeIcon(task.type)}</span>
                      <h4 className={`font-semibold text-xs text-slate-900 dark:text-white truncate ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}>
                        {task.title}
                      </h4>
                      <Badge variant={task.priority} size="sm">
                        {task.priority}
                      </Badge>
                      {isDueToday && !isCompleted && (
                        <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-blue-50 text-[#004aad]">
                          Hoy
                        </span>
                      )}
                      {isOverdue && (
                        <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-rose-50 text-rose-600 border border-rose-200">
                          Vencida
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400 pt-0.5">
                      <span className={`flex items-center gap-1 font-normal ${isOverdue ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Vence: {task.dueDate} {task.dueTime ? `(${task.dueTime} hrs)` : ''}
                      </span>

                      {contact && (
                        <span className="flex items-center gap-1 text-[#004aad]">
                          <User className="w-3 h-3" />
                          {contact.name}
                        </span>
                      )}

                      {property && (
                        <span className="flex items-center gap-1 text-slate-400 truncate max-w-[160px]">
                          <Building2 className="w-3 h-3" />
                          {property.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                  {agent && (
                    <span className="text-[11px] text-slate-400">
                      {agent.name.split(' ')[0]}
                    </span>
                  )}

                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
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

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
