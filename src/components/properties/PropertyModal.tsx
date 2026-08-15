import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Property, PropertyType, PropertyOperation, PropertyStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Check } from 'lucide-react';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
}

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: 'departamento', label: 'Departamento' },
  { id: 'casa', label: 'Casa' },
  { id: 'penthouse', label: 'Penthouse' },
  { id: 'terreno', label: 'Terreno' },
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
    price: 350000,
    currency: 'USD' as 'USD' | 'EUR' | 'MXN' | 'PEN',
    areaTotal: 120,
    areaBuilt: 100,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
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
  });

  const isLandOrPresale = formData.type === 'terreno' || formData.type === 'proyecto_preventa';

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        code: propertyToEdit.code,
        title: propertyToEdit.title,
        description: propertyToEdit.description,
        type: propertyToEdit.type,
        operation: propertyToEdit.operation,
        price: propertyToEdit.price,
        currency: propertyToEdit.currency,
        areaTotal: propertyToEdit.areaTotal,
        areaBuilt: propertyToEdit.areaBuilt,
        bedrooms: propertyToEdit.bedrooms,
        bathrooms: propertyToEdit.bathrooms,
        parkingSpots: propertyToEdit.parkingSpots,
        address: propertyToEdit.address,
        zone: propertyToEdit.zone,
        city: propertyToEdit.city || '',
        features: propertyToEdit.features,
        status: propertyToEdit.status,
        images: propertyToEdit.images,
        agentId: propertyToEdit.agentId,
        commissionPct: propertyToEdit.commissionPct,
        imageUrlInput: '',
        projectName: propertyToEdit.projectName || '',
        developer: propertyToEdit.developer || '',
      });
    } else {
      setFormData({
        code: `INM-00${Math.floor(Math.random() * 900) + 100}`,
        title: '',
        description: '',
        type: 'departamento',
        operation: 'venta',
        price: 350000,
        currency: 'USD',
        areaTotal: 120,
        areaBuilt: 100,
        bedrooms: 2,
        bathrooms: 2,
        parkingSpots: 1,
        address: '',
        zone: '',
        city: '',
        features: ['Seguridad 24/7', 'Ascensor Directo'],
        status: 'disponible',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
        ],
        agentId: agents[0]?.id || '',
        commissionPct: 5.0,
        imageUrlInput: '',
        projectName: '',
        developer: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const { imageUrlInput, ...payload } = formData;
      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, payload);
      } else {
        await addProperty(payload);
      }
      onClose();
    } catch (err: any) {
      alert('Error al guardar propiedad: ' + (err.message || 'Error del servidor'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={propertyToEdit ? 'Editar Propiedad' : 'Registrar Nuevo Inmueble'}
      subtitle="Ingresa la información detallada para el catálogo de la agencia"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título del Inmueble *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Departamento Penthouse en Providencia"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Type & Operation & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Inmueble
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 capitalize"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Operación
            </label>
            <select
              value={formData.operation}
              onChange={(e) => setFormData({ ...formData, operation: e.target.value as PropertyOperation })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 uppercase font-semibold"
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="preventa">Preventa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="disponible">Disponible</option>
              <option value="en_negociacion">En Negociación</option>
              <option value="reservada">Reservada</option>
              <option value="vendida">Vendida</option>
              <option value="alquilada">Alquilada</option>
            </select>
          </div>
        </div>

        {/* Pricing & Commission */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Precio
            </label>
            <div>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Moneda
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="MXN">MXN ($)</option>
              <option value="PEN">PEN (S/)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Comisión Agencia (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.commissionPct}
              onChange={(e) => setFormData({ ...formData, commissionPct: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Conditionally rendered surfaces and rooms */}
        {!isLandOrPresale && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                m² Totales
              </label>
              <input
                type="number"
                value={formData.areaTotal}
                onChange={(e) => setFormData({ ...formData, areaTotal: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                m² Construidos
              </label>
              <input
                type="number"
                value={formData.areaBuilt}
                onChange={(e) => setFormData({ ...formData, areaBuilt: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recámaras
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Baños
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estacionamiento
              </label>
              <input
                type="number"
                value={formData.parkingSpots}
                onChange={(e) => setFormData({ ...formData, parkingSpots: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {isLandOrPresale && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                m² Totales
              </label>
              <input
                type="number"
                value={formData.areaTotal}
                onChange={(e) => setFormData({ ...formData, areaTotal: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
              <option value="">Ninguno</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Desarrollador
            </label>
            <input
              type="text"
              value={formData.developer || ''}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              placeholder="Ej: Inmobiliaria XYZ"
              disabled={!!projects.find(p => p.name === formData.projectName)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              placeholder="Ej: Av. Las Palmas 1420"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              placeholder="Ej: Ciudad de México"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Amenities Selection (Conditionally rendered) */}
        {!isLandOrPresale && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Amenidades y Características
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              {AVAILABLE_FEATURES.map((feat) => {
                const selected = formData.features.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all flex items-center gap-1 ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-xs'
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
        )}

        {/* Image URLs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Galería de Fotos (URLs)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              placeholder="Pega la URL de una imagen (ej: https://images.unsplash.com/...)"
              value={formData.imageUrlInput}
              onChange={(e) => setFormData({ ...formData, imageUrlInput: e.target.value })}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-colors"
            >
              Agregar
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto py-1">
            {formData.images.map((img, i) => (
              <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <img src={img} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold transition-opacity"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Descripción Detallada
          </label>
          <textarea
            rows={3}
            placeholder="Describe los acabados, orientación solar, vistas y ventajas del inmueble..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none text-slate-900 dark:text-slate-100 resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            {propertyToEdit ? 'Guardar Cambios' : 'Registrar Inmueble'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
