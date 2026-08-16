import React, { useState } from 'react';
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
  Smartphone,
  ChevronDown,
  ChevronRight,
  Workflow,
  Link
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';
import { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentAgent, conversations, tasks, appBranding, logout } = useCRM();
  
  // Keep track of which collapsible menus are open
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Automatización': false,
    'Integraciones': false
  });

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPendingTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'completada').length;

  type NavItem = {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    highlight?: boolean;
  };

  type NavGroup = {
    title: string;
    isCollapsible: boolean;
    icon?: React.ElementType;
    items: NavItem[];
  };

  const navGroups: NavGroup[] = [
    {
      title: '',
      isCollapsible: false,
      items: [
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
      ]
    },
    {
      title: 'Automatización',
      isCollapsible: true,
      icon: Workflow,
      items: [
        { id: 'ai-assistants', label: 'Asistentes IA', icon: Bot, highlight: true },
        { id: 'campaigns', label: 'Campañas', icon: Megaphone },
        { id: 'ai-copilot', label: 'Copiloto IA', icon: Sparkles, highlight: true },
      ]
    },
    {
      title: 'Integraciones',
      isCollapsible: true,
      icon: Link,
      items: [
        { id: 'whatsapp-config', label: 'WhatsApp', icon: Smartphone },
        { id: 'messenger-config', label: 'Messenger', icon: MessageSquareText },
        { id: 'instagram-config', label: 'Instagram', icon: Smartphone },
        { id: 'hubspot-config', label: 'HubSpot / Otros', icon: LayoutDashboard },
      ]
    },
    {
      title: '',
      isCollapsible: false,
      items: [
        { id: 'settings', label: 'Configuración', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-950 flex flex-col transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-20' : 'w-72'}`}>
        {/* Brand Header */}
        <div className={`h-16 flex items-center px-5 border-b border-slate-800 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            {!isCollapsed && appBranding?.logoUrl ? (
              <img src={appBranding.logoUrl} alt="Logo" className="h-8 max-w-[120px] object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-[#004aad] flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs">
                  CP
                </div>
                {!isCollapsed && (
                  <div>
                    <div className="font-bold text-sm text-white leading-tight">
                      {appBranding?.appName || 'ChatPrex'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      {appBranding?.appDescription || 'Gestión comercial'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!isCollapsed && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className={`flex-1 overflow-y-auto py-3 space-y-2 no-scrollbar ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {navGroups.map((group, idx) => {
            const isExpanded = expandedMenus[group.title];
            const GroupIcon = group.icon;
            
            return (
              <div key={idx} className="space-y-1">
                {/* Main Menu / Category Header */}
                {group.title && group.isCollapsible && (
                  <button
                    onClick={() => {
                      if (isCollapsed && onToggleCollapse) {
                        onToggleCollapse();
                      }
                      toggleMenu(group.title);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                    title={isCollapsed ? group.title : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      {GroupIcon ? <GroupIcon className="w-4 h-4 text-slate-400" /> : <div className="w-4 h-4" />}
                      {!isCollapsed && <span className="text-xs font-semibold">{group.title}</span>}
                    </div>
                    {!isCollapsed && (
                      isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )
                    )}
                  </button>
                )}

                {/* Sub Menu Items */}
                {(!group.isCollapsible || isExpanded) && (
                  <div className={group.isCollapsible ? (isCollapsed ? "space-y-1" : "pl-3 space-y-1 border-l border-slate-800 ml-5 mt-1") : "space-y-1"}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            onClose();
                          }}
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#004aad] text-white font-semibold shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                        >
                          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            {!isCollapsed && <span>{item.label}</span>}
                          </div>

                          {!isCollapsed && (
                            <div className="flex items-center gap-1.5">
                              {item.badge && (
                                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                                  isActive ? 'bg-white text-[#004aad]' : 'bg-slate-700 text-slate-300'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                              {item.highlight && !isActive && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-indigo-500/20 text-indigo-300">
                                  IA
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User / Logout Footer matching screenshot */}
        <div className={`p-4 border-t border-slate-800 text-xs ${isCollapsed ? 'space-y-4' : 'space-y-2'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                {currentAgent.email || 'qa.tester2@example.com'}
              </div>
            )}
            
            {/* Dark mode & Collapse toggles */}
            <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'gap-1'}`}>
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
              </button>
              
              <button
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
                className="hidden lg:flex p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 rotate-90" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
            className={`flex items-center text-[11px] text-slate-400 hover:text-rose-400 transition-colors w-full ${isCollapsed ? 'justify-center py-2' : 'gap-2 text-left'}`}
          >
            <LogOut className={isCollapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
