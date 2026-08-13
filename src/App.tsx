import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/Dashboard';
import { PropertiesPage } from './pages/Properties';
import { PipelinePage } from './pages/Pipeline';
import { TasksPage } from './pages/TasksPage';
import { MessagesPage } from './pages/Messages';
import { ContactsPage } from './pages/Contacts';
import { CalendarPage } from './pages/CalendarPage';
import { ContractsPage } from './pages/ContractsPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { AIAssistantsPage } from './pages/AIAssistantsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { FinancesPage } from './pages/FinancesPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { WhatsAppConfigPage } from './pages/WhatsAppConfigPage';
import { PropertyModal } from './components/properties/PropertyModal';
import { DealModal } from './components/pipeline/DealModal';
import { ContactModal } from './components/contacts/ContactModal';
import { AppointmentModal } from './components/calendar/AppointmentModal';
import { TaskModal } from './components/tasks/TaskModal';
import { useCRM } from './context/CRMContext';
import { LoginPage } from './pages/LoginPage';
import { Page } from './types';

const PAGE_ALIASES: Record<string, Page> = {
  inicio: 'dashboard',
  units: 'properties',
  unidades: 'properties',
  inmuebles: 'properties',
  embudo: 'pipeline',
  ventas: 'pipeline',
  tareas: 'tasks',
  actividades: 'tasks',
  mensajes: 'messages',
  chats: 'messages',
  contactos: 'contacts',
  clientes: 'contacts',
  agenda: 'calendar',
  citas: 'calendar',
  contratos: 'contracts',
  documentos: 'contracts',
  finanzas: 'finances',
  ingresos: 'finances',
  egresos: 'finances',
  copilot: 'ai-copilot',
  ia: 'ai-copilot',
  asistentes: 'ai-assistants',
  bots: 'ai-assistants',
  campanas: 'campaigns',
  transmisiones: 'campaigns',
  config: 'settings',
  configuracion: 'settings',
  ajustes: 'settings',
  'whatsapp': 'whatsapp-config',
  'config-whatsapp': 'whatsapp-config',
  'leads': 'pipeline',
};

const VALID_PAGES: Page[] = [
  'dashboard',
  'properties',
  'pipeline',
  'tasks',
  'messages',
  'contacts',
  'calendar',
  'contracts',
  'ai-copilot',
  'ai-assistants',
  'campaigns',
  'whatsapp-config',
  'finances',
  'settings',
];

const readPageFromHash = (): Page => {
  const raw = window.location.hash.replace('#/', '').split('/')[0] || 'dashboard';
  const normalized = PAGE_ALIASES[raw] ?? raw;
  return VALID_PAGES.includes(normalized as Page) ? (normalized as Page) : 'dashboard';
};

export const App: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useCRM();
  const [currentPage, setCurrentPage] = useState<Page>(readPageFromHash);

  useEffect(() => {
    const onHashChange = () => setCurrentPage(readPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (page: string) => {
    const normalized = PAGE_ALIASES[page] ?? page;
    if (!VALID_PAGES.includes(normalized as Page)) return;
    window.location.hash = `#/${normalized}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Modales globales
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={navigate}
            onOpenNewAppointmentModal={() => setIsAppointmentModalOpen(true)}
          />
        );
      case 'properties':
        return (
          <PropertiesPage
            onOpenNewPropertyModal={() => setIsPropertyModalOpen(true)}
          />
        );
      case 'pipeline':
        return (
          <PipelinePage
            onOpenNewDealModal={() => setIsLeadModalOpen(true)}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
          />
        );
      case 'messages':
        return <MessagesPage />;
      case 'contacts':
        return (
          <ContactsPage
            onOpenNewContactModal={() => setIsContactModalOpen(true)}
            onNavigateToChat={() => navigate('messages')}
          />
        );
      case 'calendar':
        return (
          <CalendarPage
            onOpenNewAppointmentModal={() => setIsAppointmentModalOpen(true)}
          />
        );
      case 'contracts':
        return <ContractsPage />;
      case 'finances':
        return <FinancesPage />;
      case 'ai-copilot':
        return <AICopilotPage />;
      case 'ai-assistants':
        return <AIAssistantsPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'whatsapp-config':
        return <WhatsAppConfigPage />;
      case 'settings':
        return <AdministrationPage />;
      default:
        return (
          <DashboardPage
            onNavigate={navigate}
            onOpenNewAppointmentModal={() => setIsAppointmentModalOpen(true)}
          />
        );
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={navigate}
      onOpenNewPropertyModal={() => setIsPropertyModalOpen(true)}
      onOpenNewContactModal={() => setIsContactModalOpen(true)}
      onOpenNewAppointmentModal={() => setIsAppointmentModalOpen(true)}
      onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
    >
      {renderPage()}

      {/* Global Quick Action Modals */}
      <PropertyModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
      />

      <DealModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </Layout>
  );
};
