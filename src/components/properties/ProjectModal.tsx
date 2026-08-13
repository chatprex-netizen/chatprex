import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Project } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { addProject, updateProject } = useCRM();

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    developer: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (projectToEdit) {
      setFormData(projectToEdit);
    } else {
      setFormData({
        name: '',
        developer: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
        notes: '',
      });
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectToEdit) {
      updateProject(projectToEdit.id, formData as Project);
    } else {
      addProject(formData as Omit<Project, 'id' | 'createdAt'>);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#004aad]" />
            {projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Torre Marina"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                  Desarrollador / Constructora *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Inmobiliaria Costa Azul"
                  value={formData.developer || ''}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ubicación del proyecto"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Datos de Contacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Ing. Carlos Robles"
                    value={formData.contactName || ''}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Teléfono"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                    Correo
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-sm">
                Notas adicionales
              </label>
              <textarea
                rows={3}
                placeholder="Información extra..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] resize-none"
              />
            </div>
          </form>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="project-form"
            className="px-4 py-2 text-sm font-medium text-white bg-[#004aad] hover:bg-[#003b8a] rounded-lg transition-colors shadow-sm"
          >
            {projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
          </button>
        </div>
      </div>
    </div>
  );
};
