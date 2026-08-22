import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Property, PropertyType, PropertyOperation, PropertyStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Building2, Home, MapPin, DollarSign, UserCheck, Sparkles, Tag } from 'lucide-react';

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

// Sugerencias rápidas de características según el tipo de inmueble
const LAND_FEATURE_SUGGESTIONS = [
  'Frente a Parque',
  'Esquina',
  'Frontera Exterior',
  'Av. Principal',
  'Cerca al Pórtico',
  'Frente a Área Verde',
  'Calle Secundaria',
  'Cerca al Club House',
  'Zona Comercial',
];

const BUILDING_FEATURE_SUGGESTIONS = [
  'Flat',
  'Dúplex',
  'Triplex',
  'Vista Exterior (Calle)',
  'Vista Interior',
  'Piso 1 con Terraza/Patio',
  'Piso Alto con Balcón',
  'Frente a Ascensor',
  'Penthouse con Terraza',
  'Vista Panorámica',
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
    unitFeature: '',
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
        unitFeature: propertyToEdit.unitFeature || (propertyToEdit.features && propertyToEdit.features[0]) || '',
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
        unitFeature: '',
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

  const handleSelectFeatureChip = (chip: string) => {
    setFormData(prev => {
      if (!prev.unitFeature.trim()) {
        return { ...prev, unitFeature: chip };
      }
      if (prev.unitFeature.includes(chip)) {
        const cleaned = prev.unitFeature
          .split(',')
          .map(s => s.trim())
          .filter(s => s !== chip)
          .join(', ');
        return { ...prev, unitFeature: cleaned };
      }
      return { ...prev, unitFeature: `${prev.unitFeature}, ${chip}` };
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!formData.title.trim()) {
      setErrorMsg('Por favor completa el nombre o identificador de la unidad (ej. Lote 14 Mz B).');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: Partial<Property> = {
        ...formData,
        price: formData.price === '' ? 0 : Number(formData.price.toString().replace(/,/g, '')),
        areaTotal: formData.areaTotal === '' ? 0 : Number(formData.areaTotal),
        areaBuilt: formData.areaBuilt === '' ? 0 : Number(formData.areaBuilt),
        bedrooms: formData.bedrooms === '' ? 0 : Number(formData.bedrooms),
        bathrooms: formData.bathrooms === '' ? 0 : Number(formData.bathrooms),
        parkingSpots: formData.parkingSpots === '' ? 0 : Number(formData.parkingSpots),
        commissionPct: Number(formData.commissionPct) || 0,
        features: formData.unitFeature ? formData.unitFeature.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, payload);
      } else {
        await addProperty(payload as Omit<Property, 'id' | 'createdAt'>);
      }
      onClose();
    } catch (err: any) {
      console.error('Error al guardar unidad:', err);
      setErrorMsg(err.message || 'Error al guardar los cambios de la unidad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSuggestions = isLand ? LAND_FEATURE_SUGGESTIONS : BUILDING_FEATURE_SUGGESTIONS;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={propertyToEdit ? 'Editar Unidad Inmobiliaria' : 'Registrar Nueva Unidad (Inventario)'}
      subtitle="Gestiona el lote, departamento o inmueble individual para el CRM y contratos"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        {errorMsg && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs border border-rose-200 dark:border-rose-800">
            {errorMsg}
          </div>
        )}
        
        {/* Selector de Proyecto Perteneciente */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#1154FF]" />
            <span>Proyecto / Desarrollo Perteneciente</span>
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100 font-semibold"
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
              placeholder="Ej. Lote 08, Mz B"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100 font-semibold"
            />
          </div>
        </div>

        {/* Campo de Características / Atributo Clave para Identificación Rápida */}
        <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-[#1E2333]/40 border border-blue-100 dark:border-blue-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1154FF] dark:text-[#38BDF8]" />
              <span>Características & Ubicación Específica de la Unidad</span>
            </label>
            <span className="text-[10px] text-slate-400">
              {isLand ? 'Para Lotes de Proyecto' : 'Para Departamentos / Casas'}
            </span>
          </div>

          <input
            type="text"
            placeholder={isLand ? 'Ej. Frente a Parque, Esquina, Frontera Exterior...' : 'Ej. Flat, Dúplex, Vista Exterior a Calle, Piso 1 con Jardín...'}
            value={formData.unitFeature}
            onChange={(e) => setFormData({ ...formData, unitFeature: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#12151E] border border-blue-200 dark:border-blue-800/60 focus:border-[#1154FF] outline-none text-slate-900 dark:text-white"
          />

          {/* Chips de selección rápida de 1 clic */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              Selección rápida de 1 clic:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentSuggestions.map((chip, idx) => {
                const isSelected = formData.unitFeature.includes(chip);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectFeatureChip(chip)}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1154FF] text-white shadow-xs scale-102'
                        : 'bg-white dark:bg-[#12151E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1154FF]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{chip}
                  </button>
                );
              })}
            </div>
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
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100 font-bold"
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

        {/* Asesor Responsable y Comisión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#1154FF]" />
              <span>Asesor Asignado</span>
            </label>
            <select
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
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
              onChange={(e) => setFormData({ ...formData, commissionPct: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Notas Internas */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notas Internas (CRM)
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Información adicional del lote, colindancias, número de partida electrónica..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#1154FF] outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Footer con Botones */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#1154FF] hover:bg-[#0043D6] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {propertyToEdit ? 'Guardar Cambios' : 'Registrar Unidad'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
