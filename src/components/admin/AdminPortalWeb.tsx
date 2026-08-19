import React, { useState, useRef } from 'react';
import { 
  Globe, 
  Upload, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Share2, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle,
  AlertCircle,
  Star,
  Edit3,
  Search,
  Building,
  Home,
  Check,
  X,
  Sliders
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { HeroImageItem, PortalConfig, Property, PropertyType, PropertyOperation } from '../../types';

export const AdminPortalWeb: React.FC = () => {
  const { 
    portalConfig, 
    updatePortalConfig, 
    resetPortalConfig, 
    addNotification,
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    projects
  } = useCRM();

  // Estados locales del Hero Banner y Redes Sociales
  const [heroBadge, setHeroBadge] = useState(portalConfig?.heroBadge || 'Proyectos en Preventa & Propiedades Exclusivas');
  const [heroTitle, setHeroTitle] = useState(portalConfig?.heroTitle || 'Encuentra tu Próxima');
  const [heroHighlight, setHeroHighlight] = useState(portalConfig?.heroHighlight || 'Propiedad o Proyecto');
  const [heroSubtitle, setHeroSubtitle] = useState(portalConfig?.heroSubtitle || 'Casas, departamentos, lotes de campo y desarrollos en preventa con alta plusvalía y facilidades de financiamiento a tu medida.');
  const [heroImages, setHeroImages] = useState<HeroImageItem[]>(portalConfig?.heroImages || [
    {
      id: 'hero-1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
      label: 'Residencias & Casas Modernas',
    },
    {
      id: 'hero-2',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
      label: 'Lotes Campestres & Vistas Panorámicas',
    },
    {
      id: 'hero-3',
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80',
      label: 'Desarrollos & Proyectos en Preventa',
    },
  ]);

  const [socialWhatsApp, setSocialWhatsApp] = useState(portalConfig?.socialLinks?.whatsapp || 'https://wa.me/51958716850?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20proyectos%20y%20propiedades%20en%20CasaYa');
  const [socialFacebook, setSocialFacebook] = useState(portalConfig?.socialLinks?.facebook || 'https://facebook.com');
  const [socialInstagram, setSocialInstagram] = useState(portalConfig?.socialLinks?.instagram || 'https://instagram.com');
  const [socialTikTok, setSocialTikTok] = useState(portalConfig?.socialLinks?.tiktok || 'https://tiktok.com');
  const [socialYouTube, setSocialYouTube] = useState(portalConfig?.socialLinks?.youtube || 'https://youtube.com');

  const [contactPhone, setContactPhone] = useState(portalConfig?.contactInfo?.phone || '+51 958 716 850');
  const [contactEmail, setContactEmail] = useState(portalConfig?.contactInfo?.email || 'ventas@casaya.pe');
  const [contactCity, setContactCity] = useState(portalConfig?.contactInfo?.city || 'Arequipa, Perú');

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const propertyFileInputRef = useRef<HTMLInputElement>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados para búsqueda y filtrado de propiedades en el panel
  const [propertySearch, setPropertySearch] = useState('');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState<'all' | 'featured' | 'not-featured'>('all');

  // Estados para el Modal de Crear / Editar Propiedad
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const [propTitle, setPropTitle] = useState('');
  const [propType, setPropType] = useState<PropertyType>('terreno');
  const [propOperation, setPropOperation] = useState<PropertyOperation>('venta');
  const [propProjectName, setPropProjectName] = useState('');
  const [propPrice, setPropPrice] = useState<number>(120000);
  const [propCurrency, setPropCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [propAreaTotal, setPropAreaTotal] = useState<number>(200);
  const [propAreaBuilt, setPropAreaBuilt] = useState<number>(0);
  const [propBedrooms, setPropBedrooms] = useState<number>(0);
  const [propBathrooms, setPropBathrooms] = useState<number>(0);
  const [propParking, setPropParking] = useState<number>(0);
  const [propAddress, setPropAddress] = useState('');
  const [propZone, setPropZone] = useState('');
  const [propCity, setPropCity] = useState('Arequipa');
  const [propDescription, setPropDescription] = useState('');
  const [propFeatures, setPropFeatures] = useState<string[]>(['Inscrito en SUNARP', 'Luz / Electricidad', 'Agua Potable']);
  const [propImages, setPropImages] = useState<string[]>([]);
  const [propFeatured, setPropFeatured] = useState<boolean>(true);

  // Características predefinidas para agregar con un solo clic
  const PREDEFINED_FEATURES = [
    'Inscrito en SUNARP',
    'Luz / Electricidad',
    'Agua Potable',
    'Desagüe / Alcantarillado',
    'Pórtico de Ingreso',
    'Seguridad 24/7',
    'Áreas Verdes / Parques',
    'Vistas Panorámicas',
    'Club House',
    'Piscina',
    'Financiamiento Directo',
    'Entrega Inmediata',
    'Zona Residencial'
  ];

  // Subir imagen para Hero Banner desde la PC
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      addNotification('Archivo pesado', 'Te recomendamos usar imágenes de menos de 2MB para mayor velocidad.', 'warning');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const newImg: HeroImageItem = {
        id: `hero-${Date.now()}`,
        url: base64Url,
        label: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      };
      setHeroImages(prev => [...prev, newImg]);
      addNotification('Imagen cargada', 'La imagen fue añadida al carrusel del banner.', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Subir imagen para Propiedad desde la PC
  const handlePropertyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      addNotification('Archivo pesado', 'Te recomendamos optimizar fotos a menos de 2MB.', 'warning');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setPropImages(prev => [...prev, base64Url]);
      addNotification('Foto añadida', 'Foto agregada a la propiedad.', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleToggleFeatureTag = (feature: string) => {
    setPropFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };

  // Abrir Modal para Crear Nueva Propiedad
  const handleOpenCreateProperty = () => {
    setEditingPropertyId(null);
    setPropTitle('');
    setPropType('terreno');
    setPropOperation('venta');
    setPropProjectName('');
    setPropPrice(150000);
    setPropCurrency('PEN');
    setPropAreaTotal(200);
    setPropAreaBuilt(0);
    setPropBedrooms(0);
    setPropBathrooms(0);
    setPropParking(0);
    setPropAddress('');
    setPropZone('');
    setPropCity('Arequipa');
    setPropDescription('');
    setPropFeatures(['Inscrito en SUNARP', 'Luz / Electricidad', 'Agua Potable']);
    setPropImages(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80']);
    setPropFeatured(true);
    setIsPropertyModalOpen(true);
  };

  // Abrir Modal para Editar Propiedad Existente
  const handleOpenEditProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropTitle(prop.title || '');
    setPropType(prop.type || 'terreno');
    setPropOperation(prop.operation || 'venta');
    setPropProjectName(prop.projectName || '');
    setPropPrice(Number(prop.price) || 0);
    setPropCurrency((prop.currency as any) === 'USD' ? 'USD' : 'PEN');
    setPropAreaTotal(prop.areaTotal || 0);
    setPropAreaBuilt(prop.areaBuilt || 0);
    setPropBedrooms(prop.bedrooms || 0);
    setPropBathrooms(prop.bathrooms || 0);
    setPropParking(prop.parkingSpots || 0);
    setPropAddress(prop.address || '');
    setPropZone(prop.zone || '');
    setPropCity(prop.city || 'Arequipa');
    setPropDescription(prop.description || '');
    setPropFeatures(Array.isArray(prop.features) ? prop.features : []);
    setPropImages(Array.isArray(prop.images) && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80']);
    setPropFeatured(Boolean(prop.featured));
    setIsPropertyModalOpen(true);
  };

  // Guardar Propiedad (Crear o Actualizar)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim()) {
      addNotification('Título Requerido', 'Por favor ingresa un título descriptivo para la propiedad.', 'warning');
      return;
    }

    const payload: Partial<Property> = {
      title: propTitle.trim(),
      type: propType,
      operation: propOperation,
      projectName: propProjectName.trim() || undefined,
      price: Number(propPrice) || 0,
      currency: propCurrency as any,
      areaTotal: Number(propAreaTotal) || 0,
      areaBuilt: Number(propAreaBuilt) || 0,
      bedrooms: Number(propBedrooms) || 0,
      bathrooms: Number(propBathrooms) || 0,
      parkingSpots: Number(propParking) || 0,
      address: propAddress.trim(),
      zone: propZone.trim(),
      city: propCity.trim() || 'Arequipa',
      description: propDescription.trim(),
      features: propFeatures,
      images: propImages.length > 0 ? propImages : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
      featured: propFeatured,
      status: 'disponible',
      code: `CASAY-${Date.now().toString().slice(-4)}`,
    };

    try {
      if (editingPropertyId) {
        await updateProperty(editingPropertyId, payload);
        addNotification('Propiedad Actualizada', 'Los cambios se reflejarán de inmediato en la web.', 'success');
      } else {
        await addProperty(payload as any);
        addNotification('Propiedad Creada', 'El nuevo inmueble ya está visible en el catálogo y landing.', 'success');
      }
      setIsPropertyModalOpen(false);
    } catch (err: any) {
      addNotification('Error al guardar', 'No se pudo guardar la propiedad: ' + err.message, 'warning');
    }
  };

  // Toggle rápido de "Destacada en Landing (Visible: Sí/No)"
  const handleToggleFeatured = async (id: string, currentFeatured?: boolean) => {
    const nextState = !currentFeatured;
    try {
      await updateProperty(id, { featured: nextState });
      addNotification(
        nextState ? 'Marcada como Destacada' : 'Retirada de Destacadas',
        nextState ? 'Ahora aparecerá visible en la portada de la Landing Page.' : 'Solo se mostrará en el catálogo completo.',
        'success'
      );
    } catch (err: any) {
      addNotification('Error', 'No se pudo cambiar el estado de destacada: ' + err.message, 'warning');
    }
  };

  // Eliminar propiedad
  const handleDeleteProperty = async (id: string, title: string) => {
    if (confirm(`¿Estás seguro de eliminar la propiedad "${title}" del catálogo?`)) {
      try {
        await deleteProperty(id);
        addNotification('Propiedad Eliminada', 'El inmueble fue retirado del portal.', 'info');
      } catch (err: any) {
        addNotification('Error', 'No se pudo eliminar: ' + err.message, 'warning');
      }
    }
  };

  // Guardar configuración global del Portal Web (Hero + Redes + Contacto)
  const handleSaveAllConfig = () => {
    const updatedConfig: PortalConfig = {
      heroBadge,
      heroTitle,
      heroHighlight,
      heroSubtitle,
      heroImages,
      socialLinks: {
        whatsapp: socialWhatsApp,
        facebook: socialFacebook,
        instagram: socialInstagram,
        tiktok: socialTikTok,
        youtube: socialYouTube,
      },
      contactInfo: {
        phone: contactPhone,
        email: contactEmail,
        city: contactCity,
      },
    };

    updatePortalConfig(updatedConfig);
    setSavedSuccess(true);
    addNotification('Configuración Guardada', 'Todas las secciones de la Landing Page (Hero, Propiedades y Redes) han sido actualizadas.', 'success');
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetAllConfig = () => {
    if (confirm('¿Estás seguro de restablecer todos los datos del portal a los valores originales de CasaYa?')) {
      resetPortalConfig();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  // Filtrado de propiedades para el listado del panel
  const propertyList = Array.isArray(properties) ? properties : [];
  const filteredPanelProperties = propertyList.filter(p => {
    if (!p) return false;
    if (filterFeaturedOnly === 'featured' && !p.featured) return false;
    if (filterFeaturedOnly === 'not-featured' && p.featured) return false;
    if (propertySearch) {
      const q = propertySearch.toLowerCase();
      const match = (p.title && p.title.toLowerCase().includes(q)) ||
                    (p.projectName && p.projectName.toLowerCase().includes(q)) ||
                    (p.zone && p.zone.toLowerCase().includes(q)) ||
                    (p.type && p.type.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const featuredCount = propertyList.filter(p => p.featured).length;
  const portalUrl = typeof window !== 'undefined' && window.location.hostname.includes('casaya.app')
    ? 'https://casaya.app'
    : `${window.location.origin}/#/portal`;

  return (
    <div className="space-y-8 animate-fade-in text-xs max-w-5xl pb-24 font-sans">
      
      {/* 1. Header Principal del Panel de Control */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1154FF]/10 via-[#1154FF]/5 to-transparent border border-[#1154FF]/20 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#1154FF] text-white">
            <Globe className="w-3.5 h-3.5" />
            <span>Panel de Control Integral de Landing Page</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Gestión Total de la Web Pública CasaYa
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Controla en una sola vista: <strong>Hero Banner</strong>, <strong>Propiedades Destacadas y Catálogo</strong>, <strong>Botones de Redes Sociales</strong> y <strong>Captación de Prospectos</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Ver Portal Web en Vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: HERO BANNER PRINCIPAL (TEXTOS & CARRUSEL DE IMÁGENES)         */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F3F5] dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1154FF]/10 text-[#1154FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Hero Banner Principal (Textos & Carrusel de Fotos)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Animación de transición cada 5 segundos</span>
        </div>

        {/* Campos de Textos del Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Badge Superior (Píldora)
            </label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="Ej. Proyectos en Preventa & Propiedades Exclusivas"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Título Inicial (H1)
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Ej. Encuentra tu Próxima"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Texto Resaltado (Azul Eléctrico)
            </label>
            <input
              type="text"
              value={heroHighlight}
              onChange={(e) => setHeroHighlight(e.target.value)}
              placeholder="Ej. Propiedad o Proyecto"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-[#1154FF] dark:text-[#38BDF8] font-bold outline-none focus:border-[#1154FF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Subtítulo Descriptivo del Hero
          </label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Descripción atractiva para los compradores..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
          />
        </div>

        {/* Guía de Especificaciones de Imagen */}
        <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-[#181C27] border border-blue-100 dark:border-white/[0.08] flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-[#1154FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">Especificaciones recomendadas para las imágenes del banner:</span>
            <p>
              • <strong>Medidas:</strong> 1920 × 1080 px o 1600 × 900 px (Formato panorámico 16:9).<br/>
              • <strong>Formatos aceptados:</strong> WebP, JPG, PNG.<br/>
              • <strong>Peso sugerido:</strong> Menor a 2 MB para una carga ultra rápida en celulares.
            </p>
          </div>
        </div>

        {/* Galería de Imágenes del Banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-900 dark:text-white">
              Imágenes Activas en el Carrusel ({heroImages.length})
            </span>

            <div className="flex items-center gap-2">
              <input
                ref={heroFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleHeroFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Imagen desde PC</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroImages.map((img, idx) => (
              <div
                key={img.id}
                className="p-3 bg-[#F7F8FA] dark:bg-[#181C27] rounded-2xl border border-[#E5E7EB] dark:border-white/[0.08] space-y-2.5 group"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                    Foto {idx + 1}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (heroImages.length <= 1) {
                        addNotification('Mínimo requerido', 'El banner debe tener al menos 1 imagen activa.', 'warning');
                        return;
                      }
                      setHeroImages(prev => prev.filter(item => item.id !== img.id));
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-600/90 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                    title="Eliminar de carrusel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-semibold text-slate-400">
                    Etiqueta / Descripción
                  </label>
                  <input
                    type="text"
                    value={img.label}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHeroImages(prev => prev.map(item => item.id === img.id ? { ...item, label: val } : item));
                    }}
                    placeholder="Ej. Condominio Campestre Los Álamos"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: PROPIEDADES DESTACADAS & CATÁLOGO (CARGA, DETALLES Y CHECK)   */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F3F5] dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Propiedades Destacadas & Catálogo Completo</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  {featuredCount} Destacadas Activas
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Activa el check <strong className="text-amber-600 dark:text-amber-400">"Visible en Landing (Destacada)"</strong> en cada inmueble para mostrarlo en la portada (hasta 8 inmuebles).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateProperty}
            className="px-4 py-2.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cargar Nueva Propiedad</span>
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={propertySearch}
              onChange={(e) => setPropertySearch(e.target.value)}
              placeholder="Buscar propiedad por título, proyecto, zona..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#181C27] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterFeaturedOnly('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap cursor-pointer ${
                filterFeaturedOnly === 'all'
                  ? 'bg-[#202020] text-white dark:bg-white dark:text-black'
                  : 'bg-[#F7F8FA] dark:bg-[#181C27] text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos ({propertyList.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterFeaturedOnly('featured')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                filterFeaturedOnly === 'featured'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-[#F7F8FA] dark:bg-[#181C27] text-amber-600 dark:text-amber-400'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Solo Destacadas en Landing ({featuredCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterFeaturedOnly('not-featured')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap cursor-pointer ${
                filterFeaturedOnly === 'not-featured'
                  ? 'bg-[#202020] text-white dark:bg-white dark:text-black'
                  : 'bg-[#F7F8FA] dark:bg-[#181C27] text-slate-600 dark:text-slate-400'
              }`}
            >
              Solo Catálogo ({propertyList.length - featuredCount})
            </button>
          </div>
        </div>

        {/* Grilla de Propiedades con Check Visible Sí/No */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPanelProperties.map((prop) => {
            const pCurrency = prop.currency || 'PEN';
            const pSymbol = pCurrency === 'USD' ? 'USD $' : 'S/';
            const pPrice = Number(prop.price) || 0;
            const mainImg = Array.isArray(prop.images) && prop.images.length > 0 ? prop.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';

            return (
              <div
                key={prop.id}
                className="bg-[#F7F8FA] dark:bg-[#181C27] rounded-2xl border border-[#E5E7EB] dark:border-white/[0.08] shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                {/* Foto & Badges */}
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <img
                    src={mainImg}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />

                  {/* Badge de Proyecto */}
                  {prop.projectName && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold">
                      {prop.projectName}
                    </div>
                  )}

                  {/* Botón de Eliminación Rápida */}
                  <button
                    type="button"
                    onClick={() => handleDeleteProperty(prop.id, prop.title)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-rose-600/90 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                    title="Eliminar del catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Precio en Badge */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#1154FF] text-white text-xs font-extrabold shadow-md">
                    {pSymbol} {pPrice.toLocaleString('en-US')}
                  </div>
                </div>

                {/* Detalles del Inmueble */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <span className="capitalize">{prop.type}</span>
                      <span>•</span>
                      <span>{prop.zone || prop.city || 'Perú'}</span>
                    </div>

                    <h4 className="font-manrope font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {prop.title}
                    </h4>

                    {prop.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {prop.description}
                      </p>
                    )}

                    {/* Características / Tags */}
                    {Array.isArray(prop.features) && prop.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prop.features.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1E2333] text-slate-600 dark:text-slate-300 text-[10px] font-semibold border border-[#E5E7EB] dark:border-white/[0.08]"
                          >
                            {f}
                          </span>
                        ))}
                        {prop.features.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-[#1E2333] text-slate-500 text-[10px]">
                            +{prop.features.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Barra Inferior con Switch "Visible en Landing: Sí/No" y Editar */}
                  <div className="pt-3 border-t border-[#E5E7EB] dark:border-white/[0.08] flex items-center justify-between gap-2">
                    
                    {/* Check / Toggle Switch Destacada */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        prop.featured
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white dark:bg-[#1E2333] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                      title={prop.featured ? 'Visible en portada de Landing' : 'Clic para mostrar en portada'}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${prop.featured ? 'bg-white text-amber-600' : 'bg-slate-300 dark:bg-slate-600 text-transparent'}`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{prop.featured ? 'Visible en Landing: SÍ' : 'Visible en Landing: NO'}</span>
                    </button>

                    {/* Botón Editar */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditProperty(prop)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E2333] hover:bg-[#1154FF] hover:text-white dark:hover:bg-[#1154FF] text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 border border-[#E5E7EB] dark:border-white/[0.08] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 3: BOTONES DE REDES SOCIALES & CANALES DE CONTACTO DIRECTO       */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-[#F1F3F5] dark:border-white/[0.08] pb-3">
          <div className="w-7 h-7 rounded-lg bg-[#1154FF]/10 text-[#1154FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Botones de Redes Sociales & Información de Contacto
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* WhatsApp */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Enlace de WhatsApp Directo
            </label>
            <input
              type="text"
              value={socialWhatsApp}
              onChange={(e) => setSocialWhatsApp(e.target.value)}
              placeholder="https://wa.me/51958716850?text=..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Enlace Página de Facebook
            </label>
            <input
              type="text"
              value={socialFacebook}
              onChange={(e) => setSocialFacebook(e.target.value)}
              placeholder="https://facebook.com/tupagina"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Enlace Perfil de Instagram
            </label>
            <input
              type="text"
              value={socialInstagram}
              onChange={(e) => setSocialInstagram(e.target.value)}
              placeholder="https://instagram.com/tuperfil"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          {/* TikTok */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Enlace Cuenta de TikTok
            </label>
            <input
              type="text"
              value={socialTikTok}
              onChange={(e) => setSocialTikTok(e.target.value)}
              placeholder="https://tiktok.com/@tuusuario"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Enlace Canal de YouTube
            </label>
            <input
              type="text"
              value={socialYouTube}
              onChange={(e) => setSocialYouTube(e.target.value)}
              placeholder="https://youtube.com/@tucanal"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          {/* Teléfono Visible */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Teléfono Oficial de Contacto
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+51 958 716 850"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 4: ENLACES PARA ANUNCIOS (ADS) & ENRUTAMIENTO DE DOMINIO          */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            🔗 Enlace Oficial para Anuncios (Ads) & Tráfico Web
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Usa este enlace en tus campañas de Facebook Ads, TikTok Ads y estados de WhatsApp para dirigir todo el tráfico a tu portal inmobiliario.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={portalUrl}
              className="flex-1 px-3 py-2 text-xs bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl text-slate-700 dark:text-slate-200 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(portalUrl);
                addNotification('Enlace Copiado', 'El enlace público del portal ha sido copiado.', 'success');
              }}
              className="px-3.5 py-2 bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </button>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            🌐 Enrutamiento & Dominio Propio
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Tu landing page y tu CRM funcionan de forma multi-dominio e independiente. Puedes conectar cualquier dominio (ej. <code>www.casaya.pe</code>) mediante DNS.
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span><strong>Estado:</strong> Sistema listo y habilitado para navegación pública y captación.</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BARRA FLOTANTE INFERIOR: GUARDAR TODO Y RESTABLECER                    */}
      {/* ========================================================================= */}
      <div className="sticky bottom-4 z-30 p-4 bg-white/95 dark:bg-[#151821]/95 backdrop-blur-md rounded-2xl border border-[#E5E7EB] dark:border-white/[0.1] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Todas las secciones de la Landing Page han sido guardadas con éxito!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Guarda tus cambios para sincronizar Hero Banner, Destacadas y Redes Sociales en la web en vivo.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetAllConfig}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#1E2333] hover:bg-[#F1F3F5] text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Originales</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAllConfig}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL COMPLETO DE CREACIÓN / EDICIÓN DE PROPIEDAD PARA EL PORTAL WEB      */}
      {/* ========================================================================= */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.1] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors">
            
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-[#F1F3F5] dark:border-white/[0.08] flex items-center justify-between bg-[#F7F8FA] dark:bg-[#181C27]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1154FF] text-white flex items-center justify-center shadow-xs">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-sm text-slate-900 dark:text-white">
                    {editingPropertyId ? 'Editar Propiedad del Portal' : 'Cargar Nueva Propiedad al Portal'}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Configura imágenes, descripción, características y visibilidad destacada
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPropertyModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario con Scroll */}
            <form onSubmit={handleSaveProperty} className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* CHECK DESTACADA EN LANDING (VISIBLE SÍ/NO) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Propiedad Destacada en la Landing Page Principal</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Si está marcado en <strong className="text-amber-600 dark:text-amber-400">"SÍ"</strong>, este inmueble aparecerá en la portada principal de la Landing Page (hasta 8 inmuebles).
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={propFeatured}
                    onChange={(e) => setPropFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-2 font-bold text-xs text-slate-900 dark:text-white">
                    {propFeatured ? 'SÍ' : 'NO'}
                  </span>
                </label>
              </div>

              {/* 1. Subida de Fotos desde PC */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Fotografías del Inmueble ({propImages.length}) *
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      ref={propertyFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handlePropertyFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => propertyFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto desde PC</span>
                    </button>
                  </div>
                </div>

                {/* Previsualización de Fotos */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {propImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 group">
                      <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                          Portada
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setPropImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Título, Proyecto y Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Título Comercial del Inmueble *
                  </label>
                  <input
                    type="text"
                    required
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="Ej. Exclusivo Lote de Campo 500m² con Vista a los Volcanes"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Tipo de Inmueble
                  </label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value as PropertyType)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  >
                    <option value="terreno">Lote / Terreno de Campo</option>
                    <option value="proyecto_preventa">Proyecto en Preventa</option>
                    <option value="casa">Casa Residencial</option>
                    <option value="departamento">Departamento</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="oficina">Oficina Comercial</option>
                    <option value="local_comercial">Local Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Proyecto Asociado (Opcional)
                  </label>
                  <input
                    type="text"
                    value={propProjectName}
                    onChange={(e) => setPropProjectName(e.target.value)}
                    placeholder="Ej. Condominio Valle Escondido"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* 3. Precio, Moneda y Áreas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Precio *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={propPrice}
                    onChange={(e) => setPropPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Moneda
                  </label>
                  <select
                    value={propCurrency}
                    onChange={(e) => setPropCurrency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  >
                    <option value="PEN">Soles (S/)</option>
                    <option value="USD">Dólares (USD $)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Área Total (m²)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={propAreaTotal}
                    onChange={(e) => setPropAreaTotal(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={propBedrooms}
                    onChange={(e) => setPropBedrooms(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* 4. Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Distrito / Zona
                  </label>
                  <input
                    type="text"
                    value={propZone}
                    onChange={(e) => setPropZone(e.target.value)}
                    placeholder="Ej. Chiguata, Sabandía, Yanahuara..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={propCity}
                    onChange={(e) => setPropCity(e.target.value)}
                    placeholder="Arequipa"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                  />
                </div>
              </div>

              {/* 5. Selector Rápido de Características & Servicios */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Características & Servicios (Haz clic para activar/desactivar)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_FEATURES.map((feat) => {
                    const isSelected = propFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => handleToggleFeatureTag(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1154FF] text-white shadow-xs'
                            : 'bg-[#F7F8FA] dark:bg-[#181C27] text-slate-600 dark:text-slate-300 border border-[#E5E7EB] dark:border-white/[0.08]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Descripción */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Descripción Comercial Detallada
                </label>
                <textarea
                  rows={3}
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  placeholder="Detalles sobre facilidades de pago, accesos, clima, vistas, etc..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
                />
              </div>

              {/* Botones del Modal */}
              <div className="pt-3 border-t border-[#F1F3F5] dark:border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-white/[0.1] bg-[#F7F8FA] dark:bg-[#1E2333] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {editingPropertyId ? 'Guardar Cambios de Propiedad' : 'Crear y Publicar en Web'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
