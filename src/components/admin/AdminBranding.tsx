import React, { useState, useRef } from 'react';
import { Palette, Image as ImageIcon, UploadCloud, X, Check, Globe } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const AdminBranding: React.FC = () => {
  const { appBranding, updateBranding } = useCRM();
  
  const [appName, setAppName] = useState(appBranding.appName);
  const [appDescription, setAppDescription] = useState(appBranding.appDescription);
  const [logoPreview, setLogoPreview] = useState<string | null>(appBranding.logoUrl);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(appBranding.faviconUrl);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Solo para pruebas locales, convertimos a base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'logo') setLogoPreview(result);
      if (type === 'favicon') setFaviconPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateBranding({
      appName,
      appDescription,
      logoUrl: logoPreview,
      faviconUrl: faviconPreview,
    });
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs max-w-5xl mx-auto">
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#004aad]" />
            Personalización de Marca
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Modifica el nombre de la plataforma, logo y favicon para personalizar la experiencia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identidad de Marca */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-500" />
              Identidad de la Aplicación
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre de la Plataforma
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Ej. ChatPrex"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Descripción (Slogan o meta tags)
              </label>
              <input
                type="text"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                placeholder="Gestión inteligente..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Imágenes (Logo y Favicon) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              Imágenes de la Plataforma
            </h3>
          </div>

          <div className="space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Logo Principal (Barra lateral)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Cambiar Logo
                    </button>
                    {logoPreview && (
                      <button
                        onClick={() => setLogoPreview(null)}
                        className="px-3 py-1.5 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Quitar
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400">Recomendado: PNG transparente, 512x512px.</p>
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Favicon (Ícono de pestaña del navegador)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  {faviconPreview ? (
                    <img src={faviconPreview} alt="Favicon" className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <Globe className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={faviconInputRef}
                    accept="image/x-icon,image/png,image/svg+xml"
                    onChange={(e) => handleImageUpload(e, 'favicon')}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => faviconInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Cambiar Favicon
                    </button>
                    {faviconPreview && (
                      <button
                        onClick={() => setFaviconPreview(null)}
                        className="px-3 py-1.5 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Quitar
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400">Recomendado: Archivo .ico o .png de 32x32px.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {saveSuccess && (
          <span className="flex items-center gap-1 text-emerald-500 text-[11px] font-semibold animate-fade-in">
            <Check className="w-4 h-4" /> Guardado exitosamente
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-[#004aad] hover:bg-[#003c8b] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};
