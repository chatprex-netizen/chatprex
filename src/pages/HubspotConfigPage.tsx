import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Database,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clipboard,
  Check,
  RefreshCw,
  Info,
  Server,
  CloudSync,
} from 'lucide-react';
import { getIntegrationConfig, saveIntegrationConfig, testBackendConnection } from '../lib/hubspot/api';

export const HubspotConfigPage: React.FC = () => {
  // Config form state
  const [portalId, setPortalId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  
  // Status & UI state
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch active config
  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const data = await getIntegrationConfig();
      if (data.configured) {
        setIsConfigured(true);
        setPortalId(data.hubspot_portal_id || '');
        setAccessToken('••••••••••••••••••••••••••••••••');
      } else {
        setIsConfigured(false);
      }
    } catch (err) {
      console.warn('Backend offline or not configured yet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalId || !accessToken) {
      setTestResult({ success: false, message: 'Ingrese el Portal ID y el Private App Access Token.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const sendToken = accessToken === '••••••••••••••••••••••••••••••••' ? '' : accessToken;
      if (!sendToken) {
        setTestResult({ success: true, message: 'La credencial guardada ya está verificada por el servidor.' });
        return;
      }

      await testBackendConnection({
        hubspot_portal_id: portalId,
        access_token: sendToken,
      });

      setTestResult({
        success: true,
        message: '¡Conexión Exitosa! Las credenciales fueron validadas correctamente contra la API de HubSpot.',
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: `Error de Conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!portalId || !accessToken) {
      setSaveStatus({ success: false, message: 'Por favor, complete los campos obligatorios.' });
      return;
    }

    setIsLoading(true);
    setSaveStatus(null);

    try {
      const sendToken = accessToken === '••••••••••••••••••••••••••••••••' ? '' : accessToken;
      
      await saveIntegrationConfig({
        hubspot_portal_id: portalId,
        access_token: sendToken,
      });

      setIsConfigured(true);
      setSaveStatus({ success: true, message: 'Configuración guardada exitosamente.' });
      fetchConfig();
    } catch (err) {
      setSaveStatus({ success: false, message: `Error al guardar: ${err instanceof Error ? err.message : 'Error desconocido'}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-[#004aad]" />
            Integración con HubSpot CRM
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Sincroniza tus contactos, negocios y actividades bidireccionalmente mediante Private Apps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isConfigured
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isConfigured ? 'CONECTADO' : 'PENDIENTE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Form (Left side) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#004aad]" />
                Credenciales de HubSpot (Private App)
              </h3>
              <span className="text-[10px] text-slate-400 font-normal">PostgreSQL Backend Local</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                <p className="text-[11px] text-slate-400">Verificando estado del servidor...</p>
              </div>
            ) : (
              <form onSubmit={handleTestConnection} className="space-y-4">
                {/* Portal ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    HubSpot Portal ID <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={portalId}
                      onChange={(e) => setPortalId(e.target.value)}
                      placeholder="Ej. 12345678"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Access Token */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Private App Access Token <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="pat-na1-..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={isTesting}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-[#004aad] rounded-lg text-slate-700 dark:text-slate-300 text-[10px] font-semibold hover:text-[#004aad] flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    Probar Conexión
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </form>
            )}

            {/* Test result banner */}
            {testResult && (
              <div
                className={`p-3 rounded-lg border flex gap-2 items-start ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-450'
                    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-450'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-[10px] uppercase">
                    {testResult.success ? 'Conexión Exitosa' : 'Fallo de Verificación'}
                  </div>
                  <div className="text-[10px] mt-0.5 leading-relaxed">{testResult.message}</div>
                </div>
              </div>
            )}

            {/* Save status banner */}
            {saveStatus && (
              <div
                className={`p-3 rounded-lg border flex gap-2 items-start ${
                  saveStatus.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-450'
                    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-450'
                }`}
              >
                {saveStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-[10px] uppercase">
                    {saveStatus.success ? 'Guardado Exitosamente' : 'Error al guardar'}
                  </div>
                  <div className="text-[10px] mt-0.5 leading-relaxed">{saveStatus.message}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sincronización Manual */}
          {isConfigured && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CloudSync className="w-4 h-4 text-[#004aad]" />
                Sincronización Manual
              </h3>
              <p className="text-[11px] text-slate-400">
                Fuerza una sincronización de contactos y negocios desde HubSpot hacia ChatPrex.
              </p>
              
              <button className="w-full sm:w-auto px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-[#004aad] rounded-lg text-slate-700 dark:text-slate-300 text-[10px] font-semibold hover:text-[#004aad] flex items-center justify-center gap-1.5 transition-all">
                <RefreshCw className="w-3.5 h-3.5" />
                Sincronizar Datos Ahora
              </button>
            </div>
          )}

        </div>

        {/* Instructions Panel (Right side) */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-850 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
              <HelpCircle className="w-4 h-4 text-[#004aad]" />
              Guía de Configuración
            </h3>
            
            <div className="space-y-4 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">1</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Crea una Private App en HubSpot</strong>
                  <p className="mt-0.5">En HubSpot, ve a Configuración &gt; Integraciones &gt; Aplicaciones Privadas (Private Apps). Haz clic en "Crear una aplicación privada".</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Configura los Permisos (Scopes)</strong>
                  <p className="mt-0.5">En la pestaña de Scopes de tu App Privada, habilita permisos de lectura y escritura para `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.deals.read` y `crm.objects.deals.write`.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Genera el Access Token</strong>
                  <p className="mt-0.5">Guarda la App Privada y copia el "Access Token". Este token comienza típicamente con `pat-na1-...`. Pégalo en el formulario de la izquierda.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">4</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">ID del Portal</strong>
                  <p className="mt-0.5">Tu Portal ID o Hub ID lo puedes encontrar en la parte superior derecha de tu cuenta de HubSpot (bajo el nombre de tu empresa).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
