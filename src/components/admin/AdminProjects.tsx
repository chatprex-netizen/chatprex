import React, { useState, useRef, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Upload, 
  Star, 
  Globe, 
  Search, 
  Layers, 
  MapPin, 
  Sparkles, 
  Image as ImageIcon,
  ExternalLink,
  Flame,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Project, PropertyType, PropertyOperation, PropertyStatus } from '../../types';

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

export const AdminProjects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, addNotification } = useCRM();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'projects' | 'individual'>('all');

  // Form states
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

  // Abrir Modal de Creación
  const handleOpenNew = () => {
    setEditingProject(null);
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

    setIsModalOpen(true);
  };

  // Abrir Modal de Edición
  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setName(proj.name || '');
    setDeveloper(proj.developer || '');
    setType(proj.type || 'proyecto_preventa');
    setOperation(proj.operation || 'preventa');
    setCurrency(proj.currency || 'PEN');
    setIsProject(proj.isProject !== false);
    setIsPublic(proj.isPublic !== false);
    setFeatured(Boolean(proj.featured));

    setPriceMin(proj.priceMin !== undefined && proj.priceMin !== null ? proj.priceMin : '');
    setPriceMax(proj.priceMax !== undefined && proj.priceMax !== null ? proj.priceMax : '');
    setAreaMin(proj.areaMin !== undefined && proj.areaMin !== null ? proj.areaMin : '');
    setAreaMax(proj.areaMax !== undefined && proj.areaMax !== null ? proj.areaMax : '');
    setSoldPercentage(proj.soldPercentage !== undefined && proj.soldPercentage !== null ? proj.soldPercentage : '');

    setAddress(proj.address || '');
    setZone(proj.zone || '');
    setCity(proj.city || 'Arequipa');
    setFeatures(Array.isArray(proj.features) ? proj.features : []);
    setDescription(proj.description || '');
    setImages(Array.isArray(proj.images) ? proj.images : []);

    setContactName(proj.contactName || '');
    setContactEmail(proj.contactEmail || '');
    setContactPhone(proj.contactPhone || '+51 958 716 850');
    setNotes(proj.notes || '');

    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto/desarrollo?')) {
      deleteProject(id);
      addNotification('Proyecto Eliminado', 'El desarrollo ha sido eliminado correctamente.', 'success');
    }
  };

  // Subir Fotos desde la PC con compresión Canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        addNotification('Formato Inválido', 'Por favor selecciona imágenes (JPG, PNG, WEBP).', 'warning');
        return;
      }

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

    if (editingProject) {
      await updateProject(editingProject.id, payload);
      addNotification('Proyecto Actualizado', `Se guardaron los cambios de "${name}".`, 'success');
    } else {
      await addProject(payload as Omit<Project, 'id' | 'createdAt'>);
      addNotification('Proyecto Creado', `Se registró "${name}" con éxito.`, 'success');
    }
    
    setIsModalOpen(false);
  };

  // Filtrado de proyectos para la lista
  const filteredProjects = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    return list.filter(p => {
      if (!p) return false;
      if (activeFilter === 'featured' && !p.featured) return false;
      if (activeFilter === 'projects' && p.isProject === false) return false;
      if (activeFilter === 'individual' && p.isProject !== false) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = (p.name && p.name.toLowerCase().includes(q)) ||
                      (p.developer && p.developer.toLowerCase().includes(q)) ||
                      (p.zone && p.zone.toLowerCase().includes(q)) ||
                      (p.city && p.city.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="animate-fade-in space-y-5 max-w-7xl font-sans text-xs">
      
      {/* Header Superior con Botón de Creación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#12151E] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1154FF]/10 text-[#1154FF] dark:text-[#38BDF8]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Proyectos & Desarrollos Inmobiliarios
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gestiona los desarrollos y propiedades que alimentan la <strong>Landing Page</strong> y el <strong>Catálogo Web</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleOpenNew}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1154FF] hover:bg-[#0c43cc] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cargar Proyecto / Propiedad</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#12151E] p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, desarrolladora, distrito o ciudad..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#1154FF] text-white shadow-xs'
                : 'bg-slate-50 dark:bg-[#181C27] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Todos ({projects.length})
          </button>

          <button
            onClick={() => setActiveFilter('featured')}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
              activeFilter === 'featured'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-[#181C27] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Destacados en Portada ({projects.filter(p => p.featured).length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('projects')}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors ${
              activeFilter === 'projects'
                ? 'bg-[#1154FF] text-white shadow-xs'
                : 'bg-slate-50 dark:bg-[#181C27] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Proyectos ({projects.filter(p => p.isProject !== false).length})
          </button>

          <button
            onClick={() => setActiveFilter('individual')}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors ${
              activeFilter === 'individual'
                ? 'bg-[#1154FF] text-white shadow-xs'
                : 'bg-slate-50 dark:bg-[#181C27] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Independientes ({projects.filter(p => p.isProject === false).length})
          </button>
        </div>
      </div>

      {/* Grilla / Listado de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(proj => {
          const coverImg = (proj.images && proj.images.length > 0)
            ? proj.images[0]
            : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';
          
          const isPEN = proj.currency === 'PEN' || !proj.currency;
          const currencySymbol = isPEN ? 'S/' : 'USD $';

          return (
            <div 
              key={proj.id}
              className="bg-white dark:bg-[#12151E] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Imagen y Badges */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                <img
                  src={coverImg}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges superiores */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  {proj.isProject !== false ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#1154FF] text-white font-bold text-[10px] shadow-sm">
                      Proyecto / Preventa
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-bold text-[10px] shadow-sm">
                      Propiedad Única
                    </span>
                  )}

                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Destacado</span>
                    </span>
                  )}
                </div>

                {/* Badge de % Vendido (Exclusivo proyectos) */}
                {proj.isProject !== false && proj.soldPercentage && Number(proj.soldPercentage) > 0 && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-sm text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3" />
                    <span>{proj.soldPercentage}% vendido</span>
                  </div>
                )}

                {/* Badge de Precio en la Foto */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white font-bold text-xs">
                  {proj.isProject !== false ? (
                    <span>Desde {currencySymbol} {Number(proj.priceMin || 0).toLocaleString('en-US')}</span>
                  ) : (
                    <span>{currencySymbol} {Number(proj.priceMin || 0).toLocaleString('en-US')}</span>
                  )}
                </div>

                {/* Contador de Fotos */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{proj.images?.length || 1}</span>
                </div>
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1154FF] dark:text-[#38BDF8]">
                      {proj.developer || 'Inmobiliaria CasaYa'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {proj.zone ? `${proj.zone}, ${proj.city}` : proj.city || 'Arequipa'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {proj.name}
                  </h3>

                  {proj.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

                {/* Rangos de Áreas y Amenidades */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span>
                      Área:{' '}
                      <strong>
                        {proj.isProject !== false
                          ? `${proj.areaMin || 90} - ${proj.areaMax || 200} m²`
                          : `${proj.areaMin || 150} m²`}
                      </strong>
                    </span>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      proj.isPublic !== false 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {proj.isPublic !== false ? '🌐 Visible en Web' : '🔒 Solo CRM'}
                    </span>
                  </div>

                  {/* Amenidades Tags */}
                  {proj.features && proj.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.features.slice(0, 3).map((feat, idx) => (
                        <span 
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1E2333] text-[10px] text-slate-600 dark:text-slate-300"
                        >
                          {feat}
                        </span>
                      ))}
                      {proj.features.length > 3 && (
                        <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1E2333] text-[10px] text-slate-400">
                          +{proj.features.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E2333] hover:bg-blue-50 hover:text-[#1154FF] text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Eliminar Proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href="#/portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-[#1154FF] transition-colors"
                    title="Ver en Portal Web"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#12151E] rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
          <Building2 className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No se encontraron proyectos con los filtros seleccionados.
          </p>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-[#1154FF] text-white font-bold text-xs cursor-pointer"
          >
            + Cargar Nuevo Proyecto
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL COMPLETO DE PROYECTO / DESARROLLO INMOBILIARIO                     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#12151E] rounded-3xl border border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors">
            
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#181C27]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1154FF] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingProject ? 'Editar Proyecto / Desarrollo' : 'Registrar Proyecto o Propiedad'}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Configura precios desde/hasta, fotos desde PC, amenidades y publicación web
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario con Scroll */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Opciones de Publicación Web y Tipo */}
              <div className="p-3 bg-blue-50/70 dark:bg-[#181C27] rounded-2xl border border-blue-100 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1154FF] cursor-pointer"
                  />
                  <span>🌐 Visible en Catálogo Web & Landing</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <span>⭐ Destacado en Portada (Landing Page)</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-[#1154FF] dark:text-[#38BDF8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isProject}
                    onChange={(e) => setIsProject(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1154FF] cursor-pointer"
                  />
                  <span>🏗️ Es Proyecto / Desarrollo (Precios desde/hasta)</span>
                </label>
              </div>

              {/* 1. Subida de Fotos desde PC */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Fotografías del Proyecto / Inmueble ({images.length}) *
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
                      className="px-3.5 py-1.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto(s) desde PC</span>
                    </button>
                  </div>
                </div>

                {/* Previsualización de Fotos */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
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
                          Hacer Portada
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                        title="Eliminar Foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="col-span-3 sm:col-span-4 p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#1154FF]"
                    >
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Haz clic aquí para seleccionar imágenes desde tu computadora
                      </span>
                      <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Se optimizarán automáticamente)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Título, Desarrolladora y Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Nombre del Proyecto / Inmueble *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Residencial Las Praderas de La Joya"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Empresa Desarrolladora
                  </label>
                  <input
                    type="text"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="Ej. Inmobiliaria CasaYa"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* 3. Tipo, Operación y Moneda */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Tipo de Inmueble
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  >
                    <option value="proyecto_preventa">Proyecto en Preventa (Lotes/Casas)</option>
                    <option value="terreno">Lote / Terreno de Campo</option>
                    <option value="casa">Casa Residencial</option>
                    <option value="departamento">Edificio de Departamentos</option>
                    <option value="penthouse">Penthouse Exclusivo</option>
                    <option value="local_comercial">Comercial / Oficinas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Tipo de Operación
                  </label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  >
                    <option value="preventa">Preventa Inmobiliaria</option>
                    <option value="venta">Venta Inmediata</option>
                    <option value="alquiler">Alquiler / Arrendamiento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Moneda de Publicación
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'PEN' | 'USD')}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  >
                    <option value="PEN">Soles Peruanos (S/)</option>
                    <option value="USD">Dólares Americanos (USD $)</option>
                  </select>
                </div>
              </div>

              {/* 4. Precios, Áreas y % Vendido */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {isProject ? 'Precio Desde *' : 'Precio *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                {isProject && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Precio Hasta
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="35000"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {isProject ? 'Área Desde (m²)' : 'Área Total (m²)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={areaMin}
                    onChange={(e) => setAreaMin(e.target.value)}
                    placeholder="90"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                {isProject && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Área Hasta (m²)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={areaMax}
                      onChange={(e) => setAreaMax(e.target.value)}
                      placeholder="200"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                    />
                  </div>
                )}

                {isProject && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      % Vendido (Badge)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={soldPercentage}
                      onChange={(e) => setSoldPercentage(e.target.value)}
                      placeholder="60"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                    />
                  </div>
                )}
              </div>

              {/* 5. Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Dirección / Referencia
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Frente a la Carretera Interoceánica"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Distrito / Zona
                  </label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Ej. La Joya, Chiguata, Yanahuara..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Arequipa"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* 6. Amenidades & Servicios (Selección 1 Clic) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amenidades & Servicios (Haz clic para activar/desactivar)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_AMENITIES.map((feat) => {
                    const isSelected = features.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1154FF] text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-[#181C27] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Descripción Comercial */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Descripción Comercial del Desarrollo
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre facilidades de pago, créditos directos, accesos y plusvalía..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                />
              </div>

              {/* 8. Datos de Contacto y Asesor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Asesor de Contacto
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej. Asesor Inmobiliario"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Teléfono WhatsApp Oficial
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+51 958 716 850"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="ventas@casaya.pe"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* Botones de Guardar */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#1E2333] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {editingProject ? 'Guardar Cambios del Proyecto' : 'Crear y Publicar en Web'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
