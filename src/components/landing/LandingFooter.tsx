import React from 'react';
import { Building2, ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const LandingFooter: React.FC = () => {
  const { appBranding } = useCRM();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Marca y Misión */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <div className="w-7 h-7 rounded-lg bg-[#004aad] text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span>{appBranding?.appName || 'Inmobiliaria Premium'}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Especialistas en el desarrollo y comercialización de terrenos campestres exclusivos en Arequipa y propiedades de alta plusvalía en el Perú.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Proyectos 100% legalizados con título en SUNARP</span>
            </div>
          </div>

          {/* Col 2: Contacto Oficial */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Contacto & Asesoría</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+51 957 100 984 (Elvis Meza)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>ventas@inmobiliaria.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Arequipa, Perú</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Enlaces Legales Meta & CRM */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Transparencia & Legal</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#/privacy" className="hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#/terms" className="hover:text-white transition-colors">
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a href="#/data-deletion" className="hover:text-white transition-colors">
                  Exclusión de Datos (Opt-Out)
                </a>
              </li>
              <li className="pt-1">
                <a href="#/dashboard" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                  Acceso Administrativo CRM →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra de Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {appBranding.appName || 'Inmobiliaria Premium'}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Plataforma Inmobiliaria Inteligente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
