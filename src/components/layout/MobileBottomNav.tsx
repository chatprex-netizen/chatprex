import React from 'react';
import { 
  LayoutDashboard, 
  Home, 
  KanbanSquare, 
  MessageSquareText, 
  Menu 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Page } from '../../types';

interface MobileBottomNavProps {
  currentPage: Page;
  onNavigate: (page: string) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenMenu,
}) => {
  const { conversations } = useCRM();
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'properties', label: 'Unidades', icon: Home },
    { id: 'pipeline', label: 'Embudo', icon: KanbanSquare },
    { 
      id: 'messages', 
      label: 'Mensajes', 
      icon: MessageSquareText,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined 
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe transition-colors shadow-mobile-bar">
      <div className="flex items-center justify-around h-13 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive
                  ? 'text-[#004aad] dark:text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#004aad] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-normal">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-6 h-0.5 bg-[#004aad] rounded-full" />
              )}
            </button>
          );
        })}

        {/* Menu Drawer Button */}
        <button
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <Menu className="w-4 h-4 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-normal">
            Más
          </span>
        </button>
      </div>
    </nav>
  );
};
