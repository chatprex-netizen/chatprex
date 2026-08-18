import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { Page } from '../../types';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: string) => void;
  onOpenNewPropertyModal: () => void;
  onOpenNewContactModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewTaskModal: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenNewPropertyModal,
  onOpenNewContactModal,
  onOpenNewAppointmentModal,
  onOpenNewTaskModal,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
      {/* Sidebar Desktop & Mobile Drawer */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 pb-20 lg:pb-8 transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <Header
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onOpenNewPropertyModal={onOpenNewPropertyModal}
          onOpenNewContactModal={onOpenNewContactModal}
          onOpenNewAppointmentModal={onOpenNewAppointmentModal}
          onOpenNewTaskModal={onOpenNewTaskModal}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>

        {/* Global Footer with Legal Links */}
        <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <p className="text-[11px]">
              © {new Date().getFullYear()} <strong className="text-slate-700 dark:text-slate-200">CasaYa</strong> · CRM Inmobiliario Inteligente
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-medium">
              <a
                href="#/privacy"
                className="text-slate-500 dark:text-slate-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
              >
                Política de Privacidad
              </a>
              <span>·</span>
              <a
                href="#/terms"
                className="text-slate-500 dark:text-slate-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
              >
                Términos de Servicio
              </a>
              <span>·</span>
              <a
                href="#/data-deletion"
                className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors underline-offset-2 hover:underline"
              >
                Exclusión de Datos
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={onNavigate}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};
