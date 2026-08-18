import React, { useState } from 'react';
import { Trash2, ShieldCheck, Mail, CheckCircle2, ArrowLeft, Send, AlertCircle, Phone, Lock, FileText, ExternalLink, HelpCircle } from 'lucide-react';

export const DataDeletionPage: React.FC = () => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email o WhatsApp
  const [reason, setReason] = useState('desvinculacion_general');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) return;

    // Generar código de ticket único de exclusión
    const generatedTicket = `DEL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    setTicketNumber(generatedTicket);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-600 selection:text-white font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">CasaYa CRM</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Instrucciones de Exclusión y Eliminación de Datos</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/privacy"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:inline-block"
            >
              Privacidad
            </a>
            <a
              href="#/terms"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:inline-block"
            >
              Términos
            </a>
            <a
              href="#/inicio"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la App</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Title Header */}
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Directriz de Cumplimiento Meta Platforms (Facebook, WhatsApp, Instagram)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exclusión y Eliminación de Datos de Usuario (Data Deletion Request)
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            De conformidad con las políticas de desarrolladores de <strong>Meta Platforms</strong> y normativas de privacidad internacional, cualquier usuario o cliente que haya interactuado con nuestros canales automatizados (<strong>WhatsApp Cloud API, Facebook Messenger o Instagram Direct</strong>) puede solicitar la exclusión de futuras comunicaciones y la eliminación definitiva de sus datos almacenados.
          </p>
        </div>

        {/* Dos Columnas: Formulario Directo + Instrucciones de Facebook */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Formulario de Solicitud (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-rose-400" />
                  <span>Formulario Directo de Solicitud de Eliminación</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Ingresa tus datos a continuación para registrar tu solicitud formal de supresión de datos.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">¡Solicitud Registrada con Éxito!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hemos generado tu ticket de exclusión de datos:
                  </p>
                  <div className="inline-block px-4 py-2 rounded-lg bg-slate-900 border border-emerald-500/30 font-mono text-sm font-bold text-emerald-400">
                    {ticketNumber}
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Nuestro equipo técnico procesará la eliminación de tus registros en un plazo máximo de <strong>48 horas hábiles</strong> y recibirás la confirmación en el medio de contacto indicado.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setIdentifier('');
                      setDetails('');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nombre completo o Razón Social *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-slate-100 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Número de WhatsApp o Correo Electrónico *
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Ej: +51 999 999 999 o usuario@correo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-slate-100 outline-none transition-colors"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Ingresa el mismo número o correo con el que te comunicaste con nosotros.
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Motivo de la solicitud
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-slate-100 outline-none transition-colors"
                    >
                      <option value="desvinculacion_general">Eliminación total de datos personales y chats</option>
                      <option value="opt_out_comunicaciones">No deseo recibir más mensajes o llamadas (Opt-out)</option>
                      <option value="revocacion_meta">Revocación de permisos de Meta / WhatsApp / Instagram</option>
                      <option value="otro">Otro motivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Detalles o notas adicionales (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Indica cualquier información complementaria si lo deseas..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-rose-500 text-slate-100 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Solicitar Eliminación Definitiva</span>
                  </button>
                </form>
              )}
            </div>

            {/* Qué datos se eliminan */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>¿Qué información se elimina de manera irreversible?</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>Historial completo de conversaciones en WhatsApp, Messenger e Instagram.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>Ficha de contacto con nombre, teléfono, email y preferencias inmobiliarias.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>Puntaje de Lead Score, etiquetas y notas de seguimiento comercial.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>Archivos multimedia, cotizaciones preliminares y documentos adjuntos.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Método desde Facebook + Políticas (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Instrucciones paso a paso Meta */}
            <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-900/40 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Eliminar desde Facebook / Meta</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Si iniciaste sesión o conectaste tu cuenta a través de Facebook/Meta, puedes revocar el acceso directamente:
                </p>
              </div>

              <ol className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold shrink-0 text-[10px]">1</span>
                  <span>Ingresa a tu cuenta de Facebook y ve a <strong>Configuración y privacidad &gt; Configuración</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold shrink-0 text-[10px]">2</span>
                  <span>En el menú lateral izquierdo, haz clic en <strong>Apps y sitios web</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold shrink-0 text-[10px]">3</span>
                  <span>Busca la aplicación <strong>CasaYa CRM</strong> en la lista de aplicaciones activas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold shrink-0 text-[10px]">4</span>
                  <span>Haz clic en <strong>Eliminar</strong> y marca la casilla para solicitar la eliminación de todos los datos asociados.</span>
                </li>
              </ol>
            </div>

            {/* Plazos y Compromiso */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Garantía de Supresión Segura</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todas las solicitudes son auditadas y procesadas con borrado seguro de base de datos sin copias retenidas, garantizando el pleno ejercicio de tus derechos de privacidad.
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div>Plazo máximo de respuesta: <strong className="text-slate-200">48 horas</strong></div>
                <div>Oficial de Privacidad: <a href="mailto:privacidad@casaya.app" className="text-blue-400 hover:underline">privacidad@casaya.app</a></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} CasaYa CRM. Todos los derechos reservados.</p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a href="#/terms" className="text-slate-400 hover:text-slate-200 underline">Términos de Servicio</a>
            <span>·</span>
            <a href="#/privacy" className="text-slate-400 hover:text-slate-200 underline">Política de Privacidad</a>
            <span>·</span>
            <a href="#/data-deletion" className="text-slate-400 hover:text-slate-200 underline">Exclusión de Datos</a>
          </div>
        </footer>
      </main>
    </div>
  );
};
