import React from 'react';
import { ShieldCheck, Sun, TrendingUp, Key, Zap, CheckCircle2 } from 'lucide-react';

export const LegalSecuritySection: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      title: 'Títulos Independizados en SUNARP',
      description: 'Cada lote y propiedad cuenta con partida registral independiente en Registros Públicos. Seguridad jurídica total en tu compraventa.',
    },
    {
      icon: Zap,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      title: 'Servicios de Luz y Agua Garantizados',
      description: 'Instalaciones completas de redes de agua potable, energía eléctrica subterránea, alumbrado público y pórtico de acceso 24/7.',
    },
    {
      icon: Key,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
      title: 'Entrega Inmediata y Posesión',
      description: 'Construye tu casa de campo de inmediato o capitaliza tu inversión desde el primer día con delimitación topográfica certificada.',
    },
    {
      icon: TrendingUp,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
      title: 'Plusvalía Anual Garantizada (+18%)',
      description: 'Ubicados en los polos de mayor desarrollo y expansión campestre de Arequipa, garantizando la valorización constante de tu patrimonio.',
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Garantía & Respaldo Inmobiliario</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Tu Inversión 100% Segura y Certificada
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Respaldamos cada metro cuadrado con documentación legal transparente y obras de habilitación de primer nivel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${p.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
