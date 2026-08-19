import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Modal } from '../common/Modal';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (projectToEdit) {
      updateProject(projectToEdit.id, formData as Project);
    } else {
      addProject(formData as Omit<Project, 'id' | 'createdAt'>);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto Inmobiliario'}
      subtitle="Registra el proyecto matriz, constructora y datos de contacto"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Nombre del Proyecto *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Residencial Las Praderas"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Desarrollador / Constructora *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Constructora & Inmobiliaria Viva"
              value={formData.developer || ''}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Dirección / Ubicación
            </label>
            <input
              type="text"
              placeholder="Ej: Av. Javier Prado Este 2500"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Persona de Contacto
            </label>
            <input
              type="text"
              placeholder="Ej: Ing. Carlos Robles"
              value={formData.contactName || ''}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Teléfono
            </label>
            <input
              type="text"
              placeholder="Ej: +51 987 654 321"
              value={formData.contactPhone || ''}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="contacto@constructora.com"
              value={formData.contactEmail || ''}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Notas Adicionales
          </label>
          <textarea
            rows={2}
            placeholder="Anota etapas de entrega, comisiones acordadas o especificaciones..."
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all active:scale-95"
          >
            {projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
