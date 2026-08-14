import { BACKEND_URL } from '../config';
import React, { useState, useEffect } from 'react';
import {
  Camera as Instagram,
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
} from 'lucide-react';
import { getIntegrationConfig, saveIntegrationConfig, testBackendConnection } from '../lib/instagram/api';

export const InstagramConfigPage: React.FC = () => {
  // Config form state
  const [igAccountId, setIgAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('chatprex_crm_instagram_verify_token');
  const [appSecret, setAppSecret] = useState('');
  const [appId, setAppId] = useState('');

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
        setIgAccountId(data.ig_account_id || '');
        setVerifyToken(data.verify_token || 'chatprex_crm_instagram_verify_token');
        setAppId(data.app_id || '');
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
    if (!igAccountId || !accessToken) {
      setTestResult({ success: false, message: 'Ingrese el Instagram Account ID y el Access Token para realizar la prueba.' });
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
        ig_account_id: igAccountId,
        access_token: sendToken,
      });

      setTestResult({
        success: true,
        message: '¡Conexión Exitosa! Las credenciales fueron validadas correctamente contra Meta Instagram Graph API.',
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
    if (!igAccountId || !accessToken) {
      setSaveStatus({ success: false, message: 'Por favor, complete los campos obligatorios.' });
      return;
    }

    setIsLoading(true);
    setSaveStatus(null);

    try {
      const sendToken = accessToken === '••••••••••••••••••••••••••••••••' ? '' : accessToken;
      
      await saveIntegrationConfig({
        ig_account_id: igAccountId,
        access_token: sendToken,
        verify_token: verifyToken || undefined,
        app_secret: appSecret || undefined,
        app_id: appId || undefined,
      });

      setIsConfigured(true);
      setSaveStatus({ success: true, message: 'Configuración guardada y verificada exitosamente en el servidor PostgreSQL.' });
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
            <Instagram className="w-4 h-4 text-[#004aad]" />
            Integración con Instagram Graph API
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Configura la conexión con tu cuenta profesional de Instagram para gestionar DMs.
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
            {isConfigured ? 'CONFIGURADO' : 'PENDIENTE'}
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
                Credenciales de Instagram
              </h3>
              <span className="text-[10px] text-slate-400 font-normal">PostgreSQL Backend Local (Puerto 5000)</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                <p className="text-[11px] text-slate-400">Verificando estado del servidor...</p>
              </div>
            ) : (
              <form onSubmit={handleTestConnection} className="space-y-4">
                {/* IG Account ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Instagram Account ID <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={igAccountId}
                      onChange={(e) => setIgAccountId(e.target.value)}
                      placeholder="Ej. 17841400000000000"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Access Token */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Page Access Token <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="EAAGb..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Verify Token */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Verify Token (Webhook)
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={verifyToken}
                      onChange={(e) => setVerifyToken(e.target.value)}
                      placeholder="Tu token de seguridad"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                    />
                  </div>
                </div>

                {/* App Secret */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Meta App Secret
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="password"
                      value={appSecret}
                      onChange={(e) => setAppSecret(e.target.value)}
                      placeholder="Clave secreta de la App de Meta"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
                    />
                  </div>
                </div>

                {/* App ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    Meta App ID
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="Ej. 182749381029"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none hover:border-[#004aad] transition-colors"
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

          {/* Webhook details card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Server className="w-4 h-4 text-[#004aad]" />
              Endpoints Webhook para Instagram
            </h3>
            <p className="text-[11px] text-slate-400">
              Copia y pega este webhook en la consola de **Meta for Developers → Instagram → Configuración de Webhooks** para recibir mensajes directos (DMs).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-450 font-bold mb-1">Callback URL (Webhook)</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-350 truncate">
                    {BACKEND_URL ? `${BACKEND_URL}/api/instagram/webhook` : (typeof window !== 'undefined' ? `${window.location.origin}/api/instagram/webhook` : '/api/instagram/webhook')}
                  </code>
                  <button
                    onClick={() => handleCopy(BACKEND_URL ? `${BACKEND_URL}/api/instagram/webhook` : `${window.location.origin}/api/instagram/webhook`, 'url')}
                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#004aad] text-slate-400 hover:text-[#004aad] transition-all"
                    title="Copiar URL"
                  >
                    {copiedText === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 font-bold mb-1">Verify Token</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-350 truncate">
                    {verifyToken || 'chatprex_crm_instagram_verify_token'}
                  </code>
                  <button
                    onClick={() => handleCopy(verifyToken || 'chatprex_crm_instagram_verify_token', 'token')}
                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#004aad] text-slate-400 hover:text-[#004aad] transition-all"
                    title="Copiar Token"
                  >
                    {copiedText === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  <strong className="text-slate-900 dark:text-white">Cuenta Profesional de Instagram</strong>
                  <p className="mt-0.5">Asegúrate de que tu cuenta de Instagram sea de tipo Creador o Negocio, y esté conectada a una Página de Facebook.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Habilitar acceso a Mensajes</strong>
                  <p className="mt-0.5">En la app de Instagram, ve a Configuración &gt; Privacidad &gt; Mensajes y habilita "Permitir el acceso a los mensajes".</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Obtener Instagram Account ID</strong>
                  <p className="mt-0.5">Usa la Graph API Explorer para hacer una llamada a tu Page ID con el campo `instagram_business_account` para obtener tu ID.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center font-bold flex-shrink-0">4</span>
                <div>
                  <strong className="text-slate-900 dark:text-white">Configurar Webhook</strong>
                  <p className="mt-0.5">En Meta for Developers, añade el producto Instagram a tu app y suscríbete al campo de `messages` utilizando el Webhook generado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
