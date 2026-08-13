import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Project } from '../../types';
import { FolderTree, Building2, MapPin, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

export const ProjectsList: React.FC = () => {
  const { projects, deleteProject, searchQuery } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  useEffect(() => {
    const handleOpenModal = () => {
      setProjectToEdit(null);
      setIsModalOpen(true);
    };
    document.addEventListener('open-new-project-modal', handleOpenModal);
    return () => {
      document.removeEventListener('open-new-project-modal', handleOpenModal);
    };
  }, []);

  const filteredProjects = projects.filter(p => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.developer.toLowerCase().includes(lowerQuery) ||
      (p.address && p.address.toLowerCase().includes(lowerQuery))
    );
  });

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este proyecto?')) {
      deleteProject(id);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{project.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{project.developer}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(project)} className="p-1.5 text-slate-400 hover:text-[#004aad] transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              {project.address && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{project.address}</span>
                </div>
              )}
              {project.contactName && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                  <div className="font-medium">{project.contactName}</div>
                </div>
              )}
              {project.contactPhone && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{project.contactPhone}</span>
                </div>
              )}
              {project.contactEmail && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{project.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <FolderTree className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No se encontraron proyectos</p>
            <p className="text-xs mt-1">Crea un nuevo proyecto para empezar</p>
          </div>
        )}
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectToEdit={projectToEdit} 
      />
    </>
  );
};
