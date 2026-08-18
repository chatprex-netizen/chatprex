import React from 'react';
import { FileText, Shield, CheckCircle2, AlertTriangle, ArrowLeft, Mail, Globe, Scale, Lock } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  const lastUpdated = '16 de agosto de 2026';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">CasaYa CRM</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Plataforma Inmobiliaria Omnicanal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/privacy"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Política de Privacidad
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Condiciones de Uso del Servicio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Términos y Condiciones de Servicio
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Última actualización: <strong className="text-slate-200">{lastUpdated}</strong>. Te invitamos a leer con atención estos Términos y Condiciones que regulan el acceso, navegación y uso de la plataforma tecnológica <strong>CasaYa CRM</strong> y sus módulos de integración omnicanal.
          </p>
        </div>

        {/* Section 1: Aceptación */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">1</span>
            <span>Aceptación de los Términos</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Al acceder, registrarte o hacer uso de <strong>CasaYa CRM</strong>, aceptas quedar legalmente vinculado por los presentes Términos y Condiciones, así como por nuestra <a href="#/privacy" className="text-blue-400 hover:underline font-semibold">Política de Privacidad</a>. Si no estás de acuerdo con alguna de las disposiciones aquí establecidas, deberás abstenerte de utilizar la plataforma.
            </p>
          </div>
        </section>

        {/* Section 2: Descripción del Servicio */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">2</span>
            <span>Descripción del Servicio y Módulos</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong>CasaYa CRM</strong> provee un software de gestión de relaciones comerciales (CRM) diseñado para el sector inmobiliario que incluye:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
              <li>Gestión y administración de catálogo de propiedades y proyectos de preventa.</li>
              <li>Embudo de ventas y seguimiento comercial con Lead Scoring dinámico.</li>
              <li>Bandeja omnicanal e integración con canales oficiales de mensajería (WhatsApp, Facebook Messenger, Instagram Direct).</li>
              <li>Asistentes virtuales e inteligencia artificial para análisis de conversaciones y redacción de respuestas comerciales.</li>
              <li>Generación de contratos, agenda de citas y reportes de desempeño.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Uso de Integraciones de Meta (WhatsApp, Messenger, Instagram) */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">3</span>
            <span>Reglas de Uso de Servicios e Integraciones de Meta</span>
          </h2>
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              El uso de las funcionalidades que se conectan con <strong>WhatsApp Cloud API</strong>, <strong>Facebook Messenger</strong> e <strong>Instagram Direct</strong> está sujeto a las siguientes condiciones obligatorias:
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Consentimiento del usuario final (Opt-In):</strong> Los usuarios de la plataforma solo deben enviar mensajes y plantillas a prospectos o clientes que hayan solicitado información explícita o proporcionado libremente sus datos de contacto.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Prohibición total de Spam y Mensajería Masiva no solicitada:</strong> Queda estrictamente prohibido utilizar la plataforma para el envío de spam, campañas fraudulentas, esquemas piramidales o contenido que vulnere las Políticas Comerciales de Meta.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cumplimiento de Políticas de WhatsApp Business:</strong> Cada cuenta es responsable de mantener la calidad de su número de teléfono en Meta Business Manager y respetar las ventanas de atención de 24 horas y plantillas aprobadas.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Cuentas y Responsabilidades */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">4</span>
            <span>Cuentas de Usuario y Seguridad de Credenciales</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              El usuario es el único responsable de la confidencialidad de sus credenciales de acceso (usuario y contraseña) y de las claves de API (Meta Access Tokens, OpenAI/DeepSeek API Keys, etc.) ingresadas en la plataforma. CasaYa CRM no se hace responsable por accesos no autorizados derivados del descuido o revelación voluntaria de credenciales por parte del usuario.
            </p>
          </div>
        </section>

        {/* Section 5: Propiedad Intelectual */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">5</span>
            <span>Propiedad Intelectual</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Todos los derechos de propiedad intelectual sobre el código fuente, diseño de interfaces, logotipos, marcas y metodologías de <strong>CasaYa CRM</strong> son de exclusiva titularidad de sus desarrolladores. Los datos, imágenes de inmuebles e información de clientes cargados por el usuario permanecen bajo la exclusiva propiedad del usuario.
            </p>
          </div>
        </section>

        {/* Section 6: Disponibilidad */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-extrabold">6</span>
            <span>Disponibilidad del Servicio y Exclusión de Garantías</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Nos esforzamos por mantener la plataforma operativa de forma ininterrumpida (99.9% uptime). Sin embargo, el servicio se provee &quot;tal cual&quot; y &quot;según disponibilidad&quot;. CasaYa CRM no asume responsabilidad por:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
              <li>Interrupciones temporales ocasionadas por mantenimiento programado o fallas en servidores externos.</li>
              <li>Modificaciones unilaterales en las políticas, cuotas o APIs de terceros (Meta, WhatsApp, OpenAI, Render, Supabase).</li>
              <li>Pérdidas económicas indirectas derivadas del mal uso de las herramientas de IA o del asistente de ventas.</li>
            </ul>
          </div>
        </section>

        {/* Section 7: Cancelación */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">7</span>
            <span>Modificaciones y Cancelación de Cuenta</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios sustanciales serán notificados dentro de la plataforma con al menos 15 días de anticipación. El uso continuo de CasaYa CRM tras la entrada en vigor de los nuevos términos implica su aceptación.
            </p>
          </div>
        </section>

        {/* Section 8: Contacto */}
        <section className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Contacto Legal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Para dudas sobre estos Términos o asuntos de cumplimiento normativo, contáctanos:
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
            <a href="mailto:legal@casaya.app" className="flex items-center gap-1.5 text-blue-400 hover:underline">
              <Mail className="w-3.5 h-3.5" />
              <span>legal@casaya.app</span>
            </a>
            <a href="https://casaya.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Globe className="w-3.5 h-3.5" />
              <span>https://casaya.app</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} CasaYa CRM. Todos los derechos reservados.</p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a href="#/terms" className="text-slate-400 hover:text-slate-200 underline">Términos de Servicio</a>
            <span>·</span>
            <a href="#/privacy" className="text-slate-400 hover:text-slate-200 underline">Política de Privacidad</a>
            <span>·</span>
            <a href="#/inicio" className="text-slate-400 hover:text-slate-200 underline">Acceso al CRM</a>
          </div>
        </footer>
      </main>
    </div>
  );
};
