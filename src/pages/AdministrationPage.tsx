import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Users2, 
  ListTodo,
  Share2,
  Globe,
  Settings,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { AdminCompanySettings } from '../components/admin/AdminCompanySettings';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminProjects } from '../components/admin/AdminProjects';
import { AdminPipelineStages } from '../components/admin/AdminPipelineStages';
import { AdminLeadChannels } from '../components/admin/AdminLeadChannels';
import { AdminBranding } from '../components/admin/AdminBranding';

type AdminTab = 'central' | 'users' | 'projects' | 'pipeline' | 'channels' | 'ai-models' | 'web' | 'branding';

export const AdministrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('central');

  return (
    <div className="h-full flex flex-col md:flex-row gap-3 md:gap-4 animate-fade-in">
      {/* Sidebar de Administración */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-3 md:gap-4">
        <div className="flex items-center gap-3 text-[#004aad] px-1 md:px-3">
          <SettingsIcon className="w-5 h-5" />
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Administración</h1>
            <span className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Configuración Central</span>
          </div>
        </div>

        <nav className="flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'branding'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Marca
          </button>

          <button
            onClick={() => setActiveTab('central')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'central'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Configuración General
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'users'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            Usuarios y Agentes
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'projects'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Proyectos
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'pipeline'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            Etapas
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'channels'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Orígenes
          </button>

          <button
            onClick={() => setActiveTab('ai-models')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'ai-models'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Modelos IA
          </button>

          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'web'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Portal Web
          </button>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 min-h-[500px] md:min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 overflow-y-auto">
        {activeTab === 'branding' && <AdminBranding />}
        {activeTab === 'central' && <AdminCompanySettings />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'pipeline' && <AdminPipelineStages />}
        {activeTab === 'channels' && <AdminLeadChannels />}
        {activeTab === 'ai-models' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                Configuración de Modelos IA
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Selecciona y configura los motores de inteligencia artificial. Esta configuración es global y alimenta a los asistentes virtuales de los agentes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* OpenAI Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">OpenAI</div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">API Key</label>
                  <input type="password" placeholder="sk-..." className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Modelo a usar</label>
                  <select className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <option value="gpt-4o">Pro (GPT-4o)</option>
                    <option value="gpt-4o-mini">Básico (GPT-4o Mini)</option>
                    <option value="gpt-3.5-turbo">Económico (GPT-3.5)</option>
                  </select>
                </div>
              </div>

              {/* DeepSeek Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">DeepSeek</div>
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">API Key</label>
                  <input type="password" placeholder="sk-..." className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Modelo a usar</label>
                  <select className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <option value="deepseek-coder">Pro (Coder)</option>
                    <option value="deepseek-chat">Básico (Chat)</option>
                  </select>
                </div>
              </div>

              {/* Groq Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Groq</div>
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">API Key</label>
                  <input type="password" placeholder="gsk_..." className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Modelo a usar</label>
                  <select className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <option value="llama3-70b-8192">Pro (Llama3 70B)</option>
                    <option value="llama3-8b-8192">Básico (Llama3 8B)</option>
                    <option value="mixtral-8x7b-32768">Económico (Mixtral)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 bg-[#004aad] hover:bg-[#003b8a] text-white text-xs font-bold rounded-lg shadow-sm">
                Guardar Configuración IA
              </button>
            </div>
          </div>
        )}
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
