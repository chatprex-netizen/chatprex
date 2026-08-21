import React, { useState, useRef } from 'react';
import { 
  Globe, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  HelpCircle,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { HeroImageItem, PortalConfig } from '../../types';

export const AdminPortalWeb: React.FC = () => {
  const { 
    portalConfig, 
    updatePortalConfig, 
    resetPortalConfig, 
    addNotification,
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
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Subir imagen para Hero Banner desde la PC
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addNotification('Archivo pesado', 'Te recomendamos usar imágenes de menos de 5MB.', 'warning');
      return;
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

  // Guardar Configuración Global del Portal
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
    addNotification('Configuración Guardada', 'Las secciones de la Landing Page (Hero y Redes) han sido actualizadas.', 'success');
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetAllConfig = () => {
    if (confirm('¿Estás seguro de restablecer los datos del portal a los valores originales?')) {
      resetPortalConfig();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

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
            <span>Panel de Control de Landing Page</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Personalización de la Web Pública
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Configura el <strong>Hero Banner</strong>, los <strong>Botones de Redes Sociales</strong> y los <strong>Datos de Contacto</strong>.
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

      {/* Nota Informativa sobre la Base de Datos Unificada de Propiedades */}
      <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-[#151928] border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-200">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#004aad] text-white shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Base de Datos Unificada de Propiedades y Proyectos:</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Las propiedades y proyectos se gestionan centralmente en el módulo <strong>Propiedades</strong>. Desde allí puedes marcar si un inmueble es <strong>"Visible en Landing"</strong> o <strong>"Destacado en Portada"</strong>.
            </p>
          </div>
        </div>

        <a
          href="#/properties"
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#004aad] text-[#004aad] dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <span>Ir a Propiedades</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
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
      {/* SECCIÓN 2: REDES SOCIALES & CONTACTO DIRECTO                              */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F3F5] dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1154FF]/10 text-[#1154FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Redes Sociales & Datos de Contacto Directo
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Configura tus canales oficiales de atención</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Enlace Directo de WhatsApp (Asesoría)
            </label>
            <input
              type="text"
              value={socialWhatsApp}
              onChange={(e) => setSocialWhatsApp(e.target.value)}
              placeholder="https://wa.me/51958716850"
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
              placeholder="https://facebook.com/tuempresa"
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

          {/* Correo */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Correo Electrónico de Contacto
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="ventas@casaya.pe"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Ciudad / Sede Principal
            </label>
            <input
              type="text"
              value={contactCity}
              onChange={(e) => setContactCity(e.target.value)}
              placeholder="Arequipa, Perú"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.08] text-slate-900 dark:text-white outline-none focus:border-[#1154FF]"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 3: ENLACES PARA ANUNCIOS (ADS) & ENRUTAMIENTO DE DOMINIO          */}
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
      {/* BARRA FLOTANTE INFERIOR: GUARDAR TODO Y RESTABLECER                       */}
      {/* ========================================================================= */}
      <div className="sticky bottom-4 z-30 p-4 bg-white/95 dark:bg-[#151821]/95 backdrop-blur-md rounded-2xl border border-[#E5E7EB] dark:border-white/[0.1] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Los cambios del Portal Web han sido guardados con éxito!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Guarda tus cambios para sincronizar Hero Banner y Redes Sociales en la web en vivo.
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
    </div>
  );
};
