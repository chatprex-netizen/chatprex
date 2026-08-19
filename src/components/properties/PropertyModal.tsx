import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Property, PropertyType, PropertyOperation, PropertyStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Check, Flame, Building2 } from 'lucide-react';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
}

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: 'departamento', label: 'Departamento' },
  { id: 'casa', label: 'Casa' },
  { id: 'penthouse', label: 'Penthouse' },
  { id: 'terreno', label: 'Terreno / Lote' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'local_comercial', label: 'Local Comercial' },
  { id: 'proyecto_preventa', label: 'Preventa / Proyecto' },
];

const AVAILABLE_FEATURES = [
  'Piscina',
  'Seguridad 24/7',
  'Ascensor Directo',
  'Gimnasio',
  'Terraza / Rooftop',
  'Pet Friendly',
  'Domótica',
  'Jardín',
  'Área de Asador',
  'Co-working',
  'Amoblado',
  'Paneles Solares',
  'Cuarto de Servicio',
  'Cancha de Pádel',
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
    description: '',
    type: 'departamento' as PropertyType,
    operation: 'venta' as PropertyOperation,
    price: '' as string | number,
    priceMax: '' as string | number,
    currency: 'PEN' as 'USD' | 'EUR' | 'MXN' | 'PEN',
    areaTotal: '' as string | number,
    areaMax: '' as string | number,
    areaBuilt: '' as string | number,
    bedrooms: '' as string | number,
    bathrooms: '' as string | number,
    parkingSpots: '' as string | number,
    address: '',
    zone: '',
    city: '',
    features: [] as string[],
    status: 'disponible' as PropertyStatus,
    images: [] as string[],
    agentId: agents[0]?.id || '',
    commissionPct: 5.0,
    imageUrlInput: '',
    projectName: '',
    developer: '',
    soldPercentage: '' as string | number,
    isProject: false,
    featured: false,
  });

  const isLandOrPresale = formData.type === 'terreno' || formData.type === 'proyecto_preventa' || formData.isProject;

  const formatNumberWithCommas = (val: string | number) => {
    if (val === '' || val === null || val === undefined) return '';
    const clean = val.toString().replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    const integerPart = parts[0] ? parseInt(parts[0], 10).toLocaleString('en-US') : '';
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        code: propertyToEdit.code,
        title: propertyToEdit.title,
        description: propertyToEdit.description,
        type: propertyToEdit.type,
        operation: propertyToEdit.operation,
        price: propertyToEdit.price || '',
        priceMax: propertyToEdit.priceMax || '',
        currency: propertyToEdit.currency || 'PEN',
        areaTotal: propertyToEdit.areaTotal || '',
        areaMax: propertyToEdit.areaMax || '',
        areaBuilt: propertyToEdit.areaBuilt || '',
        bedrooms: propertyToEdit.bedrooms || '',
        bathrooms: propertyToEdit.bathrooms || '',
        parkingSpots: propertyToEdit.parkingSpots || '',
        address: propertyToEdit.address,
        zone: propertyToEdit.zone,
        city: propertyToEdit.city || '',
        features: propertyToEdit.features || [],
        status: propertyToEdit.status,
        images: propertyToEdit.images || [],
        agentId: propertyToEdit.agentId,
        commissionPct: propertyToEdit.commissionPct,
        imageUrlInput: '',
        projectName: propertyToEdit.projectName || '',
        developer: propertyToEdit.developer || '',
        soldPercentage: propertyToEdit.soldPercentage !== undefined ? propertyToEdit.soldPercentage : '',
        isProject: !!propertyToEdit.isProject || propertyToEdit.type === 'proyecto_preventa',
        featured: !!propertyToEdit.featured,
      });
    } else {
      const codeNumber = Math.floor(100 + Math.random() * 900);
      setFormData({
        code: `INM-${new Date().getFullYear()}-${codeNumber}`,
        title: '',
        description: '',
        type: 'departamento',
        operation: 'venta',
        price: '',
        priceMax: '',
        currency: 'PEN',
        areaTotal: '',
        areaMax: '',
        areaBuilt: '',
        bedrooms: '',
        bathrooms: '',
        parkingSpots: '',
        address: '',
        zone: '',
        city: 'Arequipa',
        features: ['Seguridad 24/7', 'Ascensor Directo'],
        status: 'disponible',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'],
        agentId: agents[0]?.id || '',
        commissionPct: 5.0,
        imageUrlInput: '',
        projectName: '',
        developer: '',
        soldPercentage: '',
        isProject: false,
        featured: false,
      });
    }
  }, [propertyToEdit, isOpen, agents]);

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleAddImage = () => {
    if (formData.imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageUrlInput.trim()],
        imageUrlInput: '',
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.address.trim()) {
      alert('Por favor completa el título y la dirección del inmueble.');
      return;
    }

    const payload: Partial<Property> = {
      ...formData,
      price: formData.price === '' ? 0 : Number(formData.price.toString().replace(/,/g, '')),
      priceMax: formData.priceMax === '' ? undefined : Number(formData.priceMax.toString().replace(/,/g, '')),
      areaTotal: formData.areaTotal === '' ? 0 : Number(formData.areaTotal),
      areaMax: formData.areaMax === '' ? undefined : Number(formData.areaMax),
      areaBuilt: formData.areaBuilt === '' ? 0 : Number(formData.areaBuilt),
      bedrooms: formData.bedrooms === '' ? 0 : Number(formData.bedrooms),
      bathrooms: formData.bathrooms === '' ? 0 : Number(formData.bathrooms),
      parkingSpots: formData.parkingSpots === '' ? 0 : Number(formData.parkingSpots),
      commissionPct: Number(formData.commissionPct),
      soldPercentage: formData.soldPercentage === '' ? undefined : Number(formData.soldPercentage),
      isProject: formData.isProject || formData.type === 'proyecto_preventa',
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
      title={propertyToEdit ? 'Editar Inmueble / Proyecto' : 'Registrar Inmueble o Proyecto'}
      subtitle="Configura precios desde/hasta, áreas, porcentaje vendido y detalles del catálogo"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Título & Proyecto Check */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Título del Inmueble o Desarrollo *
            </label>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#004aad] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isProject}
                onChange={(e) => setFormData({ ...formData, isProject: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-[#004aad] cursor-pointer"
              />
              <span>¿Es Proyecto / Desarrollo? (Precios desde/hasta)</span>
            </label>
          </div>
          <input
            type="text"
            required
            placeholder="Ej: Residencial Las Praderas - Lotes y Casas de Campo"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Type & Operation & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Inmueble
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const val = e.target.value as PropertyType;
                setFormData({ 
                  ...formData, 
                  type: val,
                  isProject: val === 'proyecto_preventa' ? true : formData.isProject
                });
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Operación
            </label>
            <select
              value={formData.operation}
              onChange={(e) => setFormData({ ...formData, operation: e.target.value as PropertyOperation })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize font-medium"
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="preventa">Preventa</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              <option value="disponible">Disponible</option>
              <option value="en_negociacion">En Negociación</option>
              <option value="reservada">Reservada</option>
              <option value="vendida">Vendida</option>
              <option value="alquilada">Alquilada</option>
            </select>
          </div>
        </div>

        {/* Pricing (Desde - Hasta) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Moneda
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="PEN">S/ (Soles)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="MXN">MXN</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              {formData.isProject ? 'Precio Desde *' : 'Precio / Monto *'}
            </label>
            <input
              type="text"
              placeholder="Ej: 15,000"
              value={formatNumberWithCommas(formData.price)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, '');
                setFormData({ ...formData, price: raw });
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 font-semibold text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Precio Hasta (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: 35,000"
              value={formatNumberWithCommas(formData.priceMax)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, '');
                setFormData({ ...formData, priceMax: raw });
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 font-semibold text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>% Vendido (Foto)</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Ej: 60"
              value={formData.soldPercentage}
              onChange={(e) => setFormData({ ...formData, soldPercentage: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Surfaces and Rooms */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              {formData.isProject ? 'm² Desde *' : 'm² Totales *'}
            </label>
            <input
              type="number"
              placeholder="Ej: 90"
              value={formData.areaTotal}
              onChange={(e) => setFormData({ ...formData, areaTotal: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              m² Hasta (Opcional)
            </label>
            <input
              type="number"
              placeholder="Ej: 200"
              value={formData.areaMax}
              onChange={(e) => setFormData({ ...formData, areaMax: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Dormitorios
            </label>
            <input
              type="number"
              placeholder="Ej: 3"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Baños
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="Ej: 2"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Cocheras
            </label>
            <input
              type="number"
              placeholder="Ej: 1"
              value={formData.parkingSpots}
              onChange={(e) => setFormData({ ...formData, parkingSpots: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Project association & developer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Proyecto Asociado
            </label>
            <select
              value={formData.projectName || ''}
              onChange={(e) => {
                const pName = e.target.value;
                const proj = projects.find(p => p.name === pName);
                setFormData({ 
                  ...formData, 
                  projectName: pName,
                  developer: proj ? proj.developer : formData.developer
                });
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">Ninguno / Inmueble Independiente</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Desarrollador / Constructora
            </label>
            <input
              type="text"
              value={formData.developer || ''}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              placeholder="Ej: Inmobiliaria Constructora"
              disabled={!!projects.find(p => p.name === formData.projectName)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Dirección *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Av. Las Palmeras 1420, Dpto 402"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Ciudad
            </label>
            <input
              type="text"
              placeholder="Ej: Arequipa"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amenidades y Características
          </label>
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            {AVAILABLE_FEATURES.map((feat) => {
              const selected = formData.features.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`px-2 py-0.5 text-[10.5px] rounded-lg font-medium transition-all flex items-center gap-1 ${
                    selected
                      ? 'bg-[#004aad] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {selected && <Check className="w-2.5 h-2.5" />}
                  {feat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Descripción Detallada
          </label>
          <textarea
            rows={2}
            placeholder="Describe acabados, vistas, facilidades de pago o ventajas del inmueble/proyecto..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
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
            {propertyToEdit ? 'Guardar Cambios' : 'Registrar Inmueble'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
