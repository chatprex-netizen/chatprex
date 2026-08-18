import React from 'react';
import { Building2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const LandingFooter: React.FC = () => {
  const { appBranding } = useCRM();

  return (
    <footer className="w-full bg-[#202020] text-slate-400 text-xs border-t border-slate-800 pt-12 pb-24 md:pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Marca */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-manrope font-extrabold text-base">
              <div className="w-7 h-7 rounded-lg bg-[#1154FF] text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span>{appBranding?.appName || 'Inmobiliaria Premium'}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
              Especialistas en el desarrollo y comercialización de terrenos campestres exclusivos en Arequipa y propiedades de alta plusvalía.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Proyectos legalizados con título en SUNARP</span>
            </div>
          </div>

          {/* Col 2: Contacto */}
          <div className="space-y-2.5">
            <h4 className="text-white font-manrope font-bold text-xs uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-2 text-xs font-normal">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1154FF] shrink-0" />
                <span>+51 957 100 984 (Elvis Meza)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1154FF] shrink-0" />
                <span>ventas@inmobiliaria.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Arequipa, Perú</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div className="space-y-2.5">
            <h4 className="text-white font-manrope font-bold text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-1.5 text-xs font-normal">
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
                  Exclusión de Datos
                </a>
              </li>
              <li className="pt-1">
                <a href="#/dashboard" className="text-[#1154FF] hover:underline font-semibold">
                  Acceso CRM →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {appBranding?.appName || 'Inmobiliaria Premium'}. Todos los derechos reservados.
          </div>
          <div>
            <span>Plataforma Inmobiliaria Inteligente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
