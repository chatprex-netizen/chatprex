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
