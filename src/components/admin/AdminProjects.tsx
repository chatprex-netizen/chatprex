import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Project } from '../../types';

export const AdminProjects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useCRM();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [name, setName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleOpenNew = () => {
    setEditingProject(null);
    setName('');
    setDeveloper('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDeveloper(project.developer || '');
    setContactName(project.contactName || '');
    setContactEmail(project.contactEmail || '');
    setContactPhone(project.contactPhone || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto/desarrollo?')) {
      deleteProject(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, { 
        name, 
        developer,
        contactName,
        contactEmail,
        contactPhone
      });
    } else {
      addProject({ 
        name, 
        developer,
        contactName,
        contactEmail,
        contactPhone
      });
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Proyectos y Desarrollos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administra los desarrollos inmobiliarios y sus contactos.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir nuevo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Proyecto</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Desarrolladora</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Contacto</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map(project => (
              <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {project.name}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                        ID: {project.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {project.developer || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900 dark:text-white">
                    {project.contactName || '-'}
                  </div>
                  {project.contactPhone && (
                    <div className="text-xs text-slate-500">{project.contactPhone}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No hay proyectos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Torre Marina"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Empresa Desarrolladora (Opcional)
                </label>
                <input
                  type="text"
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  placeholder="Ej. Inmobiliaria Costa Azul"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div className="pt-2 pb-1">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Datos de Contacto (Opcional)</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ej. Ing. Carlos Robles"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Ej. +51 987..."
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="correo@empresa.com"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#004aad] hover:bg-[#003c8b] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingProject ? 'Guardar Cambios' : 'Añadir Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
