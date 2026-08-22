import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Upload, 
  Trash2, 
  Star, 
  Check, 
  Plus, 
  X, 
  Layers 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCRM } from '../../context/CRMContext';
import { Project } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

const PREDEFINED_AMENITIES = [
  'Título en SUNARP',
  'Piscina',
  'Club House',
  'Luz Eléctrica',
  'Agua Potable',
  'Desagüe / Biodigestor',
  'Seguridad 24/7',
  'Canchas Deportivas',
  'Zona de Parrillas',
  'Pórtico de Ingreso',
  'Vistas Panorámicas',
  'Áreas Verdes & Parques',
  'Parque Infantil',
  'Zona Comercial',
  'Ciclovías',
  'Financiamiento Directo',
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { addProject, updateProject, addNotification } = useCRM();

  const [name, setName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [type, setType] = useState<string>('proyecto_preventa');
  const [operation, setOperation] = useState<string>('preventa');
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [isProject, setIsProject] = useState<boolean>(true);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [featured, setFeatured] = useState<boolean>(false);

  const [priceMin, setPriceMin] = useState<string | number>('');
  const [priceMax, setPriceMax] = useState<string | number>('');
  const [areaMin, setAreaMin] = useState<string | number>('');
  const [areaMax, setAreaMax] = useState<string | number>('');
  const [soldPercentage, setSoldPercentage] = useState<string | number>('');

  const [address, setAddress] = useState('');
  const [zone, setZone] = useState('');
  const [city, setCity] = useState('Arequipa');
  const [features, setFeatures] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+51 958 716 850');
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDeveloper(projectToEdit.developer || '');
      setType(projectToEdit.type || 'proyecto_preventa');
      setOperation(projectToEdit.operation || 'preventa');
      setCurrency(projectToEdit.currency || 'PEN');
      setIsProject(projectToEdit.isProject !== false);
      setIsPublic(projectToEdit.isPublic !== false);
      setFeatured(Boolean(projectToEdit.featured));

      setPriceMin(projectToEdit.priceMin !== undefined && projectToEdit.priceMin !== null ? projectToEdit.priceMin : '');
      setPriceMax(projectToEdit.priceMax !== undefined && projectToEdit.priceMax !== null ? projectToEdit.priceMax : '');
      setAreaMin(projectToEdit.areaMin !== undefined && projectToEdit.areaMin !== null ? projectToEdit.areaMin : '');
      setAreaMax(projectToEdit.areaMax !== undefined && projectToEdit.areaMax !== null ? projectToEdit.areaMax : '');
      setSoldPercentage(projectToEdit.soldPercentage !== undefined && projectToEdit.soldPercentage !== null ? projectToEdit.soldPercentage : '');

      setAddress(projectToEdit.address || '');
      setZone(projectToEdit.zone || '');
      setCity(projectToEdit.city || 'Arequipa');
      setFeatures(Array.isArray(projectToEdit.features) ? projectToEdit.features : []);
      setDescription(projectToEdit.description || '');
      setImages(Array.isArray(projectToEdit.images) ? projectToEdit.images : []);

      setContactName(projectToEdit.contactName || '');
      setContactEmail(projectToEdit.contactEmail || '');
      setContactPhone(projectToEdit.contactPhone || '+51 958 716 850');
      setNotes(projectToEdit.notes || '');
    } else {
      setName('');
      setDeveloper('Inmobiliaria CasaYa');
      setType('proyecto_preventa');
      setOperation('preventa');
      setCurrency('PEN');
      setIsProject(true);
      setIsPublic(true);
      setFeatured(false);

      setPriceMin(15000);
      setPriceMax(35000);
      setAreaMin(90);
      setAreaMax(200);
      setSoldPercentage(60);

      setAddress('Carretera Interoceánica Km 12');
      setZone('La Joya');
      setCity('Arequipa');
      setFeatures(['Título en SUNARP', 'Pórtico de Ingreso', 'Luz Eléctrica', 'Agua Potable']);
      setDescription('Exclusivo desarrollo inmobiliario con excelente plusvalía, clima cálido todo el año y facilidades de financiamiento directo.');
      setImages([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80'
      ]);

      setContactName('Asesor de Ventas CasaYa');
      setContactEmail('ventas@casaya.pe');
      setContactPhone('+51 958 716 850');
      setNotes('');
    }
  }, [projectToEdit, isOpen]);

  // Subir fotos con optimización Canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            setImages(prev => [...prev, optimizedBase64]);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
    addNotification('Foto(s) Cargada(s)', 'Imágenes procesadas y optimizadas para la web.', 'success');
  };

  const toggleFeature = (feat: string) => {
    setFeatures(prev => prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]);
  };

  const handleSetCoverImage = (index: number) => {
    setImages(prev => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa el nombre del proyecto o desarrollo.');
      return;
    }

    const payload: Partial<Project> = {
      name: name.trim(),
      developer: developer.trim() || 'Inmobiliaria CasaYa',
      type,
      operation,
      currency,
      isProject,
      isPublic,
      featured,
      priceMin: priceMin !== '' ? Number(priceMin) : undefined,
      priceMax: priceMax !== '' ? Number(priceMax) : undefined,
      areaMin: areaMin !== '' ? Number(areaMin) : undefined,
      areaMax: areaMax !== '' ? Number(areaMax) : undefined,
      soldPercentage: isProject && soldPercentage !== '' ? Number(soldPercentage) : undefined,
      address: address.trim(),
      zone: zone.trim(),
      city: city.trim() || 'Arequipa',
      features,
      description: description.trim(),
      images,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || '+51 958 716 850',
      notes: notes.trim(),
      status: 'disponible',
    };

    if (projectToEdit) {
      await updateProject(projectToEdit.id, payload);
      addNotification('Proyecto Actualizado', `Se guardaron los cambios de "${name}".`, 'success');
    } else {
      await addProject(payload as Omit<Project, 'id' | 'createdAt'>);
      addNotification('Proyecto Creado', `El proyecto "${name}" se registró con éxito.`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Editar Proyecto / Desarrollo' : 'Nuevo Proyecto o Propiedad'}
      subtitle="Configura precios desde/hasta, fotos desde PC, amenidades y publicación web"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        
        {/* Opciones de Publicación Web y Tipo */}
        <div className="p-2.5 bg-blue-50/70 dark:bg-slate-800/70 rounded-xl border border-blue-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded text-[#1154FF] cursor-pointer"
            />
            <span>🌐 Visible en Catálogo Web & Landing</span>
          </label>

          <label className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 cursor-pointer"
            />
            <span>⭐ Destacado en Portada</span>
          </label>

          <label className="flex items-center gap-1.5 font-bold text-[#1154FF] dark:text-[#38BDF8] cursor-pointer">
            <input
              type="checkbox"
              checked={isProject}
              onChange={(e) => setIsProject(e.target.checked)}
              className="w-4 h-4 rounded text-[#1154FF] cursor-pointer"
            />
            <span>🏗️ ¿Es Proyecto / Desarrollo?</span>
          </label>
        </div>

        {/* 1. Subida de Fotos desde PC */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fotografías ({images.length}) *
            </label>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Foto(s) desde PC</span>
              </button>
            </div>
          </div>

          {/* Previsualización de Fotos */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 group">
                <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 ? (
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                    Portada
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCoverImage(idx)}
                    className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-blue-600/80 hover:bg-blue-600 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Título y Desarrolladora */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Nombre del Proyecto / Inmueble *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Residencial Las Praderas de La Joya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Empresa Desarrolladora
            </label>
            <input
              type="text"
              placeholder="Ej: Inmobiliaria CasaYa"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>
        </div>

        {/* 3. Tipo, Operación y Moneda */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Inmueble
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            >
              <option value="proyecto_preventa">Proyecto en Preventa</option>
              <option value="terreno">Lote / Terreno de Campo</option>
              <option value="casa">Casa Residencial</option>
              <option value="departamento">Edificio de Departamentos</option>
              <option value="penthouse">Penthouse</option>
              <option value="local_comercial">Comercial / Oficinas</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Operación
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            >
              <option value="preventa">Preventa</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Moneda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'PEN' | 'USD')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            >
              <option value="PEN">Soles (S/)</option>
              <option value="USD">Dólares (USD $)</option>
            </select>
          </div>
        </div>

        {/* 4. Precios, Áreas y % Vendido */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              {isProject ? 'Precio Desde *' : 'Precio *'}
            </label>
            <input
              type="number"
              required
              min={0}
              placeholder="15000"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>

          {isProject && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Precio Hasta
              </label>
              <input
                type="number"
                min={0}
                placeholder="35000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              {isProject ? 'Área Desde (m²)' : 'Área Total (m²)'}
            </label>
            <input
              type="number"
              min={0}
              placeholder="90"
              value={areaMin}
              onChange={(e) => setAreaMin(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>

          {isProject && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Área Hasta (m²)
              </label>
              <input
                type="number"
                min={0}
                placeholder="200"
                value={areaMax}
                onChange={(e) => setAreaMax(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
              />
            </div>
          )}

          {isProject && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                % Vendido
              </label>
              <input
                type="number"
                min={0}
                max={100}
                placeholder="60"
                value={soldPercentage}
                onChange={(e) => setSoldPercentage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
              />
            </div>
          )}
        </div>

        {/* 5. Ubicación */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Dirección
            </label>
            <input
              type="text"
              placeholder="Ej: Carretera Interoceánica Km 12"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Distrito / Zona
            </label>
            <input
              type="text"
              placeholder="Ej: La Joya, Yanahuara..."
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Ciudad
            </label>
            <input
              type="text"
              placeholder="Arequipa"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
            />
          </div>
        </div>

        {/* 6. Amenidades (1 Clic) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            Amenidades & Servicios
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PREDEFINED_AMENITIES.map((feat) => {
              const isSelected = features.includes(feat);
              return (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1154FF] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                  <span>{feat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Descripción */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Descripción Comercial
          </label>
          <textarea
            rows={2}
            placeholder="Descripción atractiva para los compradores..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#1154FF]"
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
            {projectToEdit ? 'Guardar Cambios' : 'Registrar Proyecto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
