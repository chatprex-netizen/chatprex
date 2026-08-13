import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Home, 
  UserPlus, 
  CalendarPlus, 
  CheckSquare,
  CheckCheck,
  ChevronDown,
  LayoutDashboard,
  Building2,
  Filter,
  MessageSquare,
  Users,
  CalendarDays,
  FileText,
  Sparkles,
  Settings,
  LucideIcon
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Page } from '../../types';

interface HeaderProps {
  currentPage: Page;
  onOpenMobileMenu: () => void;
  onOpenNewPropertyModal: () => void;
  onOpenNewContactModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewTaskModal: () => void;
}

const PAGE_INFO: Record<string, { title: string; subtitle: string; icon: LucideIcon }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Resumen comercial de tu inmobiliaria', icon: LayoutDashboard },
  properties: { title: 'Unidades', subtitle: 'Inventario de departamentos y casas', icon: Building2 },
  pipeline: { title: 'Pipeline', subtitle: 'Embudo de ventas en tiempo real', icon: Filter },
  tasks: { title: 'Tareas', subtitle: 'Gestión diaria de actividades', icon: CheckSquare },
  messages: { title: 'Mensajes', subtitle: 'Centro de mensajería y WhatsApp', icon: MessageSquare },
  contacts: { title: 'Contactos', subtitle: 'Directorio de compradores e inversionistas', icon: Users },
  calendar: { title: 'Agenda', subtitle: 'Programación de visitas a propiedades', icon: CalendarDays },
  contracts: { title: 'Contratos', subtitle: 'Documentos de separación y compraventa', icon: FileText },
  'ai-copilot': { title: 'Copilot IA', subtitle: 'Asistente de redacción y prospección', icon: Sparkles },
  settings: { title: 'Configuración', subtitle: 'Ajustes del sistema', icon: Settings },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onOpenNewPropertyModal,
  onOpenNewContactModal,
  onOpenNewAppointmentModal,
  onOpenNewTaskModal,
}) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    clearAllNotifications,
    searchQuery, 
    setSearchQuery 
  } = useCRM();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const page = PAGE_INFO[currentPage] || { 
    title: 'Inmobiliaria CRM', 
    subtitle: 'Gestión comercial', 
    icon: Building2 
  };
  const IconComponent = page.icon;

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile menu toggle + Page title with Icon */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
            <IconComponent className="w-4 h-4 text-[#004aad]" />
            <span>{page.title}</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-normal">
            {page.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search bar + Quick actions + Notifications */}
      <div className="flex items-center gap-2">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-52 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#004aad]"
          />
        </div>

        {/* Quick Add Button */}
        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-medium text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-modal border border-slate-200 dark:border-slate-800 py-1 z-50 animate-fade-in text-xs">
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  onOpenNewPropertyModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Home className="w-4 h-4 text-[#004aad]" />
                <span>Registrar propiedad</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickActions(false);
                  onOpenNewContactModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Nuevo contacto</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickActions(false);
                  onOpenNewTaskModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4 text-purple-600" />
                <span>Nueva tarea</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickActions(false);
                  onOpenNewAppointmentModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <CalendarPlus className="w-4 h-4 text-amber-600" />
                <span>Agendar visita</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#004aad] rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-modal border border-slate-200 dark:border-slate-800 z-50 animate-fade-in overflow-hidden text-xs">
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-white">Notificaciones</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-[#004aad] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Marcar leídas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    No tienes notificaciones.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
