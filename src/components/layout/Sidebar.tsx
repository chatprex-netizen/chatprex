import React from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Home, 
  Users2, 
  CalendarDays, 
  FileText, 
  CheckSquare, 
  MessageSquareText, 
  Sparkles, 
  Bot,
  Megaphone,
  Settings, 
  Wallet,
  LogOut,
  X,
  Sun,
  Moon,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';
import { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentAgent, conversations, tasks } = useCRM();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPendingTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'completada').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'messages', 
      label: 'Mensajes', 
      icon: MessageSquareText,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined 
    },
    { id: 'pipeline', label: 'Pipeline', icon: KanbanSquare },
    { id: 'contacts', label: 'Contactos', icon: Users2 },
    { 
      id: 'tasks', 
      label: 'Tareas', 
      icon: CheckSquare,
      badge: todayPendingTasks > 0 ? `${todayPendingTasks}` : undefined 
    },
    { id: 'calendar', label: 'Agenda', icon: CalendarDays },
    { id: 'properties', label: 'Unidades', icon: Home },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'finances', label: 'Finanzas', icon: Wallet },
    { id: 'campaigns', label: 'Campañas', icon: Megaphone },
    { id: 'ai-copilot', label: 'Copilot IA', icon: Sparkles, highlight: true },
    { id: 'ai-assistants', label: 'Asistentes IA', icon: Bot, highlight: true },
    { id: 'whatsapp-config', label: 'Config. WhatsApp', icon: Smartphone },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111827] text-slate-300 flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#004aad] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              IN
            </div>
            <div>
              <div className="font-bold text-sm text-white leading-tight">
                Inmobiliaria CRM
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Gestión comercial
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#004aad] text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-[#004aad]' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-purple-950 text-purple-300">
                      IA
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* User / Logout Footer matching screenshot */}
        <div className="p-4 border-t border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
              {currentAgent.email || 'qa.tester2@example.com'}
            </div>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

          <button
            onClick={() => alert('Sesión cerrada')}
            className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-rose-400 transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
