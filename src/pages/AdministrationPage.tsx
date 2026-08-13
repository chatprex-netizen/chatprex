import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Users2, 
  ListTodo,
  Share2,
  Globe,
  Settings
} from 'lucide-react';
import { AdminCompanySettings } from '../components/admin/AdminCompanySettings';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminProjects } from '../components/admin/AdminProjects';
import { AdminPipelineStages } from '../components/admin/AdminPipelineStages';
import { AdminLeadChannels } from '../components/admin/AdminLeadChannels';

type AdminTab = 'central' | 'users' | 'projects' | 'pipeline' | 'channels' | 'web';

export const AdministrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('central');

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar de Administración */}
      <div className="w-64 shrink-0 flex flex-col gap-6">
        <div className="flex items-center gap-3 text-[#004aad] px-4">
          <SettingsIcon className="w-6 h-6" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Administración</h1>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Configuración Central</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('central')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'central'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configuración General
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users2 className="w-4 h-4" />
            Usuarios y Agentes
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Proyectos y desarrollos
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            Etapas del pipeline
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'channels'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Fuentes de origen
          </button>

          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'web'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Portal Web
          </button>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 overflow-y-auto">
        {activeTab === 'central' && <AdminCompanySettings />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'pipeline' && <AdminPipelineStages />}
        {activeTab === 'channels' && <AdminLeadChannels />}
        {activeTab === 'web' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Globe className="w-12 h-12 mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Portal Web</h2>
            <p className="text-sm">Configuración del portal en construcción.</p>
          </div>
        )}
      </div>
    </div>
  );
};
