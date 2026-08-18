import React from 'react';
import { ShieldCheck, Zap, Key, TrendingUp, Sun, MapPin } from 'lucide-react';

export const LegalSecuritySection: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Títulos Independizados en SUNARP',
      description: 'Partida registral independiente en Registros Públicos. Seguridad jurídica total en tu compra.',
    },
    {
      icon: Zap,
      title: 'Servicios de Luz y Agua',
      description: 'Redes completas de agua potable, electricidad, alumbrado y pórtico de seguridad.',
    },
    {
      icon: Key,
      title: 'Entrega Inmediata y Posesión',
      description: 'Construye tu casa de campo o capitaliza tu inversión desde el primer día.',
    },
    {
      icon: TrendingUp,
      title: 'Plusvalía Garantizada (+18%)',
      description: 'Ubicados en los polos de mayor desarrollo y expansión campestre de Arequipa.',
    },
  ];

  return (
    <section id="beneficios" className="w-full max-w-6xl mx-auto px-4 py-16 font-sans">
      
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#F7F8FA] dark:bg-slate-800 text-[#1154FF] border border-[#E5E7EB] dark:border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Garantía & Seguridad</span>
        </div>
        <h2 className="font-manrope font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#202020] dark:text-white">
          Tu Inversión 100% Segura y Certificada
        </h2>
        <p className="text-[15px] text-slate-500 dark:text-slate-400">
          Documentación legal transparente y obras de habilitación de primer nivel.
        </p>
      </div>

      {/* Grid de 4 Pilares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-slate-800 shadow-sm hover:border-[#1154FF]/40 transition-colors space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] dark:bg-slate-800 flex items-center justify-center text-[#1154FF]">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[16px] text-[#202020] dark:text-white leading-snug">
                {p.title}
              </h3>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sección Ubicación Estratégica (id="ubicacion") */}
      <div id="ubicacion" className="mt-16 p-6 sm:p-10 rounded-3xl bg-[#F7F8FA] dark:bg-[#181818] border border-[#E5E7EB] dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 text-[#1154FF] border border-[#E5E7EB] dark:border-slate-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>Ubicación Privilegiada</span>
            </div>
            <h3 className="font-manrope font-bold text-2xl sm:text-3xl text-[#202020] dark:text-white leading-tight">
              A solo 25 minutos del centro de Arequipa
            </h3>
            <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Disfruta del mejor clima de la región, aire puro y vistas despejadas a la campiña. Acceso directo por vías asfaltadas y cercanía a centros comerciales y colegios.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800">
                <span className="font-manrope font-extrabold text-lg text-[#1154FF] block">365 días</span>
                <span className="text-xs text-slate-500 font-medium">Sol garantizado</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800">
                <span className="font-manrope font-extrabold text-lg text-[#1154FF] block">25 min</span>
                <span className="text-xs text-slate-500 font-medium">De la Plaza de Armas</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=80"
              alt="Campiña Arequipa"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
