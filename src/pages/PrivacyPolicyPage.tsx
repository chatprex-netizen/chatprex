import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, MessageCircle, ArrowLeft, Mail, Globe, Server, UserCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = '16 de agosto de 2026';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">Prexup CRM</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Plataforma Inmobiliaria Omnicanal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/terms"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Términos de Servicio
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
            <Lock className="w-3.5 h-3.5" />
            <span>Documento Legal Oficial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Política de Privacidad y Tratamiento de Datos
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Última actualización: <strong className="text-slate-200">{lastUpdated}</strong>. Esta política describe de manera transparente cómo <strong>Prexup CRM</strong> recopila, utiliza, almacena y protege los datos personales de nuestros usuarios y los prospectos comerciales gestionados a través de integraciones oficiales de mensajería (incluyendo <strong>Meta Platforms, WhatsApp Cloud API, Facebook Messenger e Instagram Direct</strong>).
          </p>
        </div>

        {/* Section 1: Responsable del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">1</span>
            <span>Responsable del Tratamiento de los Datos</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong>Prexup CRM</strong> (en adelante, &quot;la Plataforma&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;) opera como proveedor de tecnología de Customer Relationship Management (CRM) para agencias, asesores y desarrolladores inmobiliarios.
            </p>
            <p>
              Para cualquier consulta, solicitud de ejercicio de derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) o dudas sobre este documento, puedes contactarnos al correo oficial: <a href="mailto:privacidad@prexup.com" className="text-blue-400 hover:underline font-semibold">privacidad@prexup.com</a>.
            </p>
          </div>
        </section>

        {/* Section 2: Información que Recopilamos */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">2</span>
            <span>Información que Recopilamos</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Recopilamos la información estrictamente necesaria para la prestación del servicio de gestión comercial inmobiliaria y comunicación omnicanal:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Datos de Identificación y Contacto</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nombres, apellidos, número de teléfono (WhatsApp), dirección de correo electrónico, presupuesto estimado y preferencias de inmuebles/proyectos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Mensajería e Interacciones</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contenido de mensajes de texto, audios, archivos multimedia intercambiados entre clientes y asesores a través de WhatsApp, Messenger e Instagram, así como estados de entrega y lectura.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Integración con Servicios de Meta */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">3</span>
            <span>Uso de las APIs y Servicios de Meta (WhatsApp, Messenger, Instagram)</span>
          </h2>
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              Nuestra aplicación utiliza las APIs oficiales de <strong>Meta Platforms, Inc.</strong> (Meta for Developers), incluyendo la <strong>WhatsApp Business Cloud API</strong>, <strong>Messenger Platform API</strong> e <strong>Instagram Graph API</strong>.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Finalidad exclusiva:</strong> La información de mensajería y perfiles públicos de Meta se utiliza únicamente para permitir que los asesores de la agencia inmobiliaria respondan consultas y atiendan requerimientos comerciales solicitados por el propio usuario.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No transferencia a terceros:</strong> Los datos obtenidos mediante las APIs de Meta no se venden, no se comparten con anunciantes ni se utilizan para fines ajenos a la atención inmobiliaria autorizada por el usuario.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cumplimiento de Políticas de Meta:</strong> Operamos bajo estricto cumplimiento de la Política de Datos de Meta y los Términos del Servicio de WhatsApp Business.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Finalidad del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">4</span>
            <span>Finalidad del Tratamiento de los Datos</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>Los datos recabados son tratados para las siguientes finalidades comerciales legítimas:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-400">
              <li>Gestionar y dar respuesta a las solicitudes de información inmobiliaria (proyectos, departamentos, lotes, casas).</li>
              <li>Coordinar citas, visitas guiadas a proyectos y reuniones con asesores inmobiliarios.</li>
              <li>Elaborar cotizaciones, propuestas comerciales y generación de minutas/contratos solicitados por el cliente.</li>
              <li>Calcular el puntaje de calificación comercial (Lead Score) para agilizar la atención de prospectos con alta intención de compra.</li>
              <li>Envío de notificaciones y confirmaciones de citas autorizadas por el usuario.</li>
            </ol>
          </div>
        </section>

        {/* Section 5: Seguridad y Almacenamiento */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">5</span>
            <span>Seguridad y Almacenamiento de la Información</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Implementamos rigurosas medidas técnicas, administrativas y físicas de seguridad:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <Server className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Encriptación en tránsito:</strong> Todo el tráfico entre clientes, servidores y APIs de Meta viaja encriptado mediante protocolo HTTPS/TLS 1.3.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Bases de datos protegidas:</strong> Almacenamiento con autenticación estricta, copias de seguridad continuas y control de acceso por roles.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Instrucciones de Eliminación de Datos (Meta Requirement) */}
        <section className="space-y-4" id="eliminacion-de-datos">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-extrabold">6</span>
            <span>Instrucciones para la Eliminación de Datos de Usuario (Data Deletion)</span>
          </h2>
          <div className="p-5 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              De conformidad con las directrices para desarrolladores de <strong>Meta Platforms</strong> y las normativas de protección de datos personales, cualquier usuario tiene el derecho inalienable de solicitar la eliminación total y permanente de sus datos y registros de mensajería almacenados en nuestra plataforma.
            </p>
            
            <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 space-y-2">
              <h3 className="font-bold text-xs sm:text-sm text-white">¿Cómo solicitar la eliminación de tus datos?</h3>
              <p className="text-xs text-slate-400">
                Puedes solicitar la eliminación mediante cualquiera de las siguientes 2 opciones:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
                <li>
                  <strong>Solicitud por Correo Electrónico:</strong> Envía un mensaje a <a href="mailto:soporte@prexup.com?subject=Solicitud%20de%20Eliminacion%20de%20Datos" className="text-blue-400 font-semibold hover:underline">soporte@prexup.com</a> indicando tu nombre y tu número de teléfono o correo asociado. Procesaremos la eliminación definitiva en un plazo máximo de <strong>48 horas hábiles</strong> y te enviaremos la confirmación correspondiente.
                </li>
                <li>
                  <strong>Desde la Configuración de Facebook / Meta:</strong>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Ve a tu perfil de Facebook &gt; <em>Configuración y Privacidad</em> &gt; <em>Configuración</em> &gt; <em>Apps y sitios web</em> &gt; Busca nuestra app &gt; Haz clic en <em>Eliminar</em> o <em>Ver detalles &gt; Solicitar eliminación de datos</em>.
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 7: Derechos ARCO */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold">7</span>
            <span>Derechos de los Titulares de Datos</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Como titular de datos personales, tienes derecho a:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
              <li>Conocer qué información personal tuya conservamos en nuestro sistema.</li>
              <li>Solicitar la corrección o actualización de datos inexactos o incompletos.</li>
              <li>Revocar en cualquier momento el consentimiento otorgado para el envío de comunicaciones comerciales.</li>
              <li>Exigir la supresión o bloqueo de tus datos cuando no sean necesarios para los fines estipulados.</li>
            </ul>
          </div>
        </section>

        {/* Section 8: Contacto */}
        <section className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Contacto y Consultas Legales</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Si tienes cualquier duda o requieres asistencia sobre nuestra Política de Privacidad o la gestión de datos en Meta / WhatsApp, puedes escribirnos directamente a:
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
            <a href="mailto:privacidad@prexup.com" className="flex items-center gap-1.5 text-blue-400 hover:underline">
              <Mail className="w-3.5 h-3.5" />
              <span>privacidad@prexup.com</span>
            </a>
            <a href="https://prexup.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Globe className="w-3.5 h-3.5" />
              <span>https://prexup.com</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} Prexup CRM. Todos los derechos reservados.</p>
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
