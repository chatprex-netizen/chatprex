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
import { MessengerConfigPage } from './pages/MessengerConfigPage';
import { InstagramConfigPage } from './pages/InstagramConfigPage';
import { HubspotConfigPage } from './pages/HubspotConfigPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { DataDeletionPage } from './pages/DataDeletionPage';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { PropertyModal } from './components/properties/PropertyModal';
import { DealModal } from './components/pipeline/DealModal';
import { ContactModal } from './components/contacts/ContactModal';
import { AppointmentModal } from './components/calendar/AppointmentModal';
import { TaskModal } from './components/tasks/TaskModal';
import { useCRM } from './context/CRMContext';
import { LoginPage } from './pages/LoginPage';
import { Page, Appointment } from './types';

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
  'messenger': 'messenger-config',
  'config-messenger': 'messenger-config',
  'instagram': 'instagram-config',
  'config-instagram': 'instagram-config',
  'hubspot': 'hubspot-config',
  'config-hubspot': 'hubspot-config',
  'leads': 'pipeline',
  'privacy': 'privacy',
  'privacidad': 'privacy',
  'politica-de-privacidad': 'privacy',
  'politicas-de-privacidad': 'privacy',
  'privacy-policy': 'privacy',
  'data-deletion': 'data-deletion',
  'eliminacion-de-datos': 'data-deletion',
  'exclusion-de-datos': 'data-deletion',
  'user-data-deletion': 'data-deletion',
  'opt-out': 'data-deletion',
  'terms': 'terms',
  'terminos': 'terms',
  'terminos-de-servicio': 'terms',
  'terminos-y-condiciones': 'terms',
  'terms-of-service': 'terms',
  'portal': 'portal',
  'landing': 'portal',
  'portal-web': 'portal',
  'web': 'portal',
  'catalogo': 'portal',
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
  'messenger-config',
  'instagram-config',
  'hubspot-config',
  'finances',
  'settings',
  'privacy',
  'terms',
  'data-deletion',
  'portal',
  'landing',
];

const readPageFromLocation = (): Page => {
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();

  // Detección directa y prioritaria para páginas públicas
  if (
    hash.includes('landing') ||
    hash.includes('portal') ||
    hash.includes('catalogo') ||
    hash.includes('inmueble') ||
    path.includes('landing') ||
    path.includes('portal') ||
    path.includes('catalogo')
  ) {
    return 'portal';
  }

  if (hash.includes('privacy') || hash.includes('privacidad') || path.includes('privacy') || path.includes('privacidad')) {
    return 'privacy';
  }

  if (hash.includes('terms') || hash.includes('terminos') || path.includes('terms') || path.includes('terminos')) {
    return 'terms';
  }

  if (hash.includes('data-deletion') || hash.includes('eliminacion') || path.includes('data-deletion') || path.includes('eliminacion')) {
    return 'data-deletion';
  }

  // 1. Revisar hash normal
  const hashRaw = hash.replace(/^#\/?/, '').split('/')[0]?.split('?')[0];
  if (hashRaw) {
    const normalizedHash = PAGE_ALIASES[hashRaw] ?? hashRaw;
    if (VALID_PAGES.includes(normalizedHash as Page)) {
      return normalizedHash as Page;
    }
  }

  // 2. Revisar pathname normal
  const pathRaw = path.replace(/^\//, '').split('/')[0]?.split('?')[0];
  if (pathRaw) {
    const normalizedPath = PAGE_ALIASES[pathRaw] ?? pathRaw;
    if (VALID_PAGES.includes(normalizedPath as Page)) {
      return normalizedPath as Page;
    }
  }

  return 'dashboard';
};

export const App: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useCRM();
  const [currentPage, setCurrentPage] = useState<Page>(readPageFromLocation);

  // Modales globales
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    const onLocationChange = () => setCurrentPage(readPageFromLocation());
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  const navigate = (page: string) => {
    const normalized = PAGE_ALIASES[page] ?? page;
    if (!VALID_PAGES.includes(normalized as Page)) return;
    window.location.hash = `#/${normalized}`;
  };

  // Páginas públicas accesibles sin inicio de sesión (Landing Page, Portal Web, Legal Meta)
  if (currentPage === 'portal' || currentPage === 'landing') {
    return <PublicLandingPage />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicyPage />;
  }

  if (currentPage === 'terms') {
    return <TermsOfServicePage />;
  }

  if (currentPage === 'data-deletion') {
    return <DataDeletionPage />;
  }

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
            onOpenNewAppointmentModal={() => {
              setAppointmentToEdit(null);
              setIsAppointmentModalOpen(true);
            }}
            onEditAppointment={(app) => {
              setAppointmentToEdit(app);
              setIsAppointmentModalOpen(true);
            }}
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
      case 'messenger-config':
        return <MessengerConfigPage />;
      case 'instagram-config':
        return <InstagramConfigPage />;
      case 'hubspot-config':
        return <HubspotConfigPage />;
      case 'settings':
        return <AdministrationPage />;
      case 'portal':
      case 'landing':
        return <PublicLandingPage />;
      default:
        return (
          <DashboardPage
            onNavigate={navigate}
            onOpenNewAppointmentModal={() => {
              setAppointmentToEdit(null);
              setIsAppointmentModalOpen(true);
            }}
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
      onOpenNewAppointmentModal={() => {
        setAppointmentToEdit(null);
        setIsAppointmentModalOpen(true);
      }}
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
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setAppointmentToEdit(null);
        }}
        appointmentToEdit={appointmentToEdit}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </Layout>
  );
};
