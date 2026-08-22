import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Property, PropertyType, PropertyOperation, PropertyStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Building2, Home, MapPin, DollarSign, UserCheck } from 'lucide-react';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
}

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: 'terreno', label: 'Lote / Terreno' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'casa', label: 'Casa' },
  { id: 'penthouse', label: 'Penthouse' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'local_comercial', label: 'Local Comercial' },
];

const PROPERTY_OPERATIONS: { id: PropertyOperation; label: string }[] = [
  { id: 'venta', label: 'Venta' },
  { id: 'alquiler', label: 'Alquiler' },
  { id: 'preventa', label: 'Preventa' },
];

const PROPERTY_STATUSES: { id: PropertyStatus; label: string }[] = [
  { id: 'disponible', label: 'Disponible' },
  { id: 'en_negociacion', label: 'En Negociación' },
  { id: 'reservada', label: 'Reservada' },
  { id: 'vendida', label: 'Vendida' },
  { id: 'alquilada', label: 'Alquilada' },
];

export const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  propertyToEdit,
}) => {
  const { addProperty, updateProperty, agents, projects } = useCRM();

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    projectId: '',
    projectName: '',
    description: '',
    type: 'terreno' as PropertyType,
    operation: 'venta' as PropertyOperation,
    price: '' as string | number,
    currency: 'PEN' as 'USD' | 'EUR' | 'MXN' | 'PEN',
    areaTotal: '' as string | number,
    areaBuilt: '' as string | number,
    bedrooms: '' as string | number,
    bathrooms: '' as string | number,
    parkingSpots: '' as string | number,
    status: 'disponible' as PropertyStatus,
    agentId: agents[0]?.id || '',
    commissionPct: 5.0,
    notes: '',
  });

  const isLand = formData.type === 'terreno';

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        code: propertyToEdit.code || '',
        title: propertyToEdit.title || '',
        projectId: propertyToEdit.projectId || '',
        projectName: propertyToEdit.projectName || '',
        description: propertyToEdit.description || '',
        type: propertyToEdit.type || 'terreno',
        operation: propertyToEdit.operation || 'venta',
        price: propertyToEdit.price || '',
        currency: propertyToEdit.currency || 'PEN',
        areaTotal: propertyToEdit.areaTotal || '',
        areaBuilt: propertyToEdit.areaBuilt || '',
        bedrooms: propertyToEdit.bedrooms || '',
        bathrooms: propertyToEdit.bathrooms || '',
        parkingSpots: propertyToEdit.parkingSpots || '',
        status: propertyToEdit.status || 'disponible',
        agentId: propertyToEdit.agentId || agents[0]?.id || '',
        commissionPct: propertyToEdit.commissionPct || 5.0,
        notes: propertyToEdit.notes || '',
      });
    } else {
      const codeNumber = Math.floor(100 + Math.random() * 900);
      setFormData({
        code: `UND-${new Date().getFullYear()}-${codeNumber}`,
        title: '',
        projectId: projects[0]?.id || '',
        projectName: projects[0]?.name || '',
        description: '',
        type: 'terreno',
        operation: 'venta',
        price: '',
        currency: 'PEN',
        areaTotal: '',
        areaBuilt: '',
        bedrooms: '',
        bathrooms: '',
        parkingSpots: '',
        status: 'disponible',
        agentId: agents[0]?.id || '',
        commissionPct: 5.0,
        notes: '',
      });
    }
  }, [propertyToEdit, isOpen, agents, projects]);

  const handleProjectSelect = (projId: string) => {
    const selected = projects.find(p => p.id === projId);
    setFormData(prev => ({
      ...prev,
      projectId: projId,
      projectName: selected ? selected.name : '',
      currency: (selected?.currency as any) || prev.currency,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor completa el nombre o identificador de la unidad (ej. Lote 14 Mz B).');
      return;
    }

    const payload: Partial<Property> = {
      ...formData,
      price: formData.price === '' ? 0 : Number(formData.price.toString().replace(/,/g, '')),
      areaTotal: formData.areaTotal === '' ? 0 : Number(formData.areaTotal),
      areaBuilt: formData.areaBuilt === '' ? 0 : Number(formData.areaBuilt),
      bedrooms: formData.bedrooms === '' ? 0 : Number(formData.bedrooms),
      bathrooms: formData.bathrooms === '' ? 0 : Number(formData.bathrooms),
      parkingSpots: formData.parkingSpots === '' ? 0 : Number(formData.parkingSpots),
      commissionPct: Number(formData.commissionPct),
    };

    if (propertyToEdit) {
      updateProperty(propertyToEdit.id, payload);
    } else {
      addProperty(payload as Omit<Property, 'id' | 'createdAt'>);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={propertyToEdit ? 'Editar Unidad Inmobiliaria' : 'Registrar Nueva Unidad (Inventario)'}
      subtitle="Gestiona el lote, departamento o inmueble individual para el CRM y contratos"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        
        {/* Selector de Proyecto Perteneciente */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#1154FF]" />
            <span>Proyecto / Desarrollo Perteneciente</span>
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
          >
            <option value="">(Ninguno - Propiedad Independiente)</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.developer || 'Desarrollo'})
              </option>
            ))}
          </select>
        </div>

        {/* Código y Nombre/Identificador */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Código de Unidad *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Ej. LOTE-14B"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Identificador / Título *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Lote 14 Mz B - 120m² (Frente a Parque)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Tipo, Operación y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Operación
            </label>
            <select
              value={formData.operation}
              onChange={(e) => setFormData({ ...formData, operation: e.target.value as PropertyOperation })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            >
              {PROPERTY_OPERATIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estado Comercial
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100 font-semibold"
            >
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Precio, Moneda y Área */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Precio de Venta *
            </label>
            <input
              type="number"
              required
              min={0}
              placeholder="Ej. 18500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Moneda
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="PEN">Soles (S/)</option>
              <option value="USD">Dólares (USD $)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Área Total (m²) *
            </label>
            <input
              type="number"
              required
              min={0}
              placeholder="Ej. 120"
              value={formData.areaTotal}
              onChange={(e) => setFormData({ ...formData, areaTotal: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Habitaciones / Baños si no es terreno */}
        {!isLand && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Habitaciones
              </label>
              <input
                type="number"
                min={0}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Baños
              </label>
              <input
                type="number"
                min={0}
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cocheras
              </label>
              <input
                type="number"
                min={0}
                value={formData.parkingSpots}
                onChange={(e) => setFormData({ ...formData, parkingSpots: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {/* Asignación de Agente y Comisión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#1154FF]" />
              <span>Agente Asignado</span>
            </label>
            <select
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Comisión de Venta (%)
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={formData.commissionPct}
              onChange={(e) => setFormData({ ...formData, commissionPct: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Notas Internas */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notas / Observaciones Internas
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Ej. Separado con $500, pendiente firma de contrato el viernes..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Botones del Modal */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            {propertyToEdit ? 'Guardar Cambios de Unidad' : 'Registrar Unidad'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
