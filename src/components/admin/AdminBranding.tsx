import React, { useState, useRef } from 'react';
import { Palette, Image as ImageIcon, UploadCloud, X, Check, Globe, Building2, Phone, Mail, DollarSign, Moon, Sun, RotateCcw } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminBranding: React.FC = () => {
  const { appBranding, updateBranding, resetToDemoData } = useCRM();
  const { theme, toggleTheme } = useTheme();
  
  const [appName, setAppName] = useState(appBranding.appName || 'Inmobiliaria CRM');
  const [appDescription, setAppDescription] = useState(appBranding.appDescription || 'Gestión inteligente de proyectos y propiedades');
  const [agencyPhone, setAgencyPhone] = useState('+51 957 100 984');
  const [agencyEmail, setAgencyEmail] = useState('contacto@inmobiliaria.com');
  const [currency, setCurrency] = useState('PEN');
  const [logoPreview, setLogoPreview] = useState<string | null>(appBranding.logoUrl);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(appBranding.faviconUrl);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

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
            <Building2 className="w-4 h-4 text-[#004aad]" />
            Empresa y Marca
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Personaliza los datos comerciales de tu inmobiliaria, moneda, logotipos y apariencia general.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identidad de la Empresa y Contacto */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-5 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#004aad]" />
              Identidad de la Empresa y Moneda
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre Comercial / Marca
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Ej. Inmobiliaria Costa Azul"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Slogan / Descripción de la Empresa
              </label>
              <input
                type="text"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                placeholder="Desarrollo de proyectos campestres y urbanos de alta plusvalía"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Teléfono de Atención
                </label>
                <input
                  type="text"
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  placeholder="+51 957 100 984"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  placeholder="contacto@inmobiliaria.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-500" />
                Moneda Principal de la Plataforma
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-[#004aad] text-slate-900 dark:text-slate-100"
              >
                <option value="PEN">S/ (Soles peruanos)</option>
                <option value="USD">USD (Dólares americanos)</option>
                <option value="EUR">EUR (Euros)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logotipo e Imágenes */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-5 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#004aad]" />
              Logotipos e Imagen Corporativa
            </h3>
          </div>

          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Logo Principal (Barra lateral y encabezados)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
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
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                <div className="flex-1 space-y-1.5">
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

      {/* Preferencias del Sistema y Restablecimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Modo Oscuro */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-amber-100 text-amber-600'}`}>
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                Tema de la Plataforma (Modo {theme === 'dark' ? 'Oscuro' : 'Claro'})
              </div>
              <div className="text-[10px] text-slate-400">Ajusta la apariencia visual de la interfaz</div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Alternar Modo
          </button>
        </div>

        {/* Restablecer Datos */}
        <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/80 dark:border-rose-900/30 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-rose-900 dark:text-rose-400">
              Restablecer Datos Iniciales
            </h4>
            <p className="text-[10px] text-rose-700/80 dark:text-rose-300/70 mt-0.5">
              Vuelve a cargar los datos iniciales de prueba (irrevocable).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Seguro que deseas restablecer todos los datos iniciales? Esta acción no se puede deshacer.')) {
                resetToDemoData();
                alert('Datos restablecidos exitosamente.');
                window.location.reload();
              }
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pt-2">
        {saveSuccess && (
          <span className="flex items-center gap-1 text-emerald-500 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4" /> Configuración guardada exitosamente
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#004aad] hover:bg-[#003c8b] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 active:scale-95"
        >
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
};
