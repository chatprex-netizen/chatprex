import React, { useState } from 'react';
import { MessageCircle, Building2, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';

interface DualContactSectionProps {
  currency: 'S/' | 'USD';
  onSendMessage: (msg: string) => void;
}

export const DualContactSection: React.FC<DualContactSectionProps> = ({
  currency,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'comprador' | 'vendedor'>('comprador');

  // Formulario Comprador
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerType, setBuyerType] = useState('Lote / Terreno');
  const [buyerBudget, setBuyerBudget] = useState('');
  const [buyerZone, setBuyerZone] = useState('');

  // Formulario Vendedor / Desarrollador
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [propertyType, setPropertyType] = useState('Terreno / Lote');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyEstimatedPrice, setPropertyEstimatedPrice] = useState('');
  const [hasSunarpTitle, setHasSunarpTitle] = useState(true);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmitBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `¡Hola! Mi nombre es ${buyerName || 'un interesado'}. Busco un ${buyerType} en ${buyerZone || 'zona a evaluar'}, con presupuesto de ${currency} ${buyerBudget || 'a evaluar'}. Celular: ${buyerPhone}. ¿Qué opciones tienen disponibles?`;
    onSendMessage(msg);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleSubmitSeller = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `¡Hola! Mi nombre es ${sellerName || 'un propietario'}. Deseo comercializar un inmueble (${propertyType}) en ${propertyLocation || 'Perú'}. Precio estimado: ${currency} ${propertyEstimatedPrice || 'a convenir'}. Título Sunarp: ${hasSunarpTitle ? 'Sí' : 'En trámite'}. Celular: ${sellerPhone}.`;
    onSendMessage(msg);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contacto" className="w-full max-w-5xl mx-auto px-4 py-16 font-sans">
      <div className="bg-white dark:bg-[#12151E] rounded-3xl border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm overflow-hidden transition-colors">
        
        {/* Header & Tab Selector */}
        <div className="p-6 sm:p-8 bg-[#F7F8FA] dark:bg-[#181C27] border-b border-[#E5E7EB] dark:border-white/[0.08] text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white dark:bg-[#1E2333] text-[#1154FF] dark:text-[#38BDF8] border border-[#E5E7EB] dark:border-white/[0.08]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Asesoría Inmobiliaria Personalizada</span>
          </div>

          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[#202020] dark:text-white tracking-tight">
            ¿En qué podemos ayudarte?
          </h2>

          {/* Toggle Dual Comprador vs Vendedor */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-[#F1F3F5] dark:bg-[#1E2333] rounded-xl border border-[#E5E7EB] dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab('comprador')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'comprador'
                    ? 'bg-white dark:bg-[#12151E] text-[#1154FF] dark:text-[#38BDF8] shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#202020] dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Quiero Comprar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vendedor')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'vendedor'
                    ? 'bg-white dark:bg-[#12151E] text-[#1154FF] dark:text-[#38BDF8] shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#202020] dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Quiero Vender</span>
              </button>
            </div>
          </div>
        </div>

        {/* Formularios */}
        <div className="p-6 sm:p-10">
          {activeTab === 'comprador' ? (
            /* Formulario Comprador */
            <form onSubmit={handleSubmitBuyer} className="max-w-xl mx-auto space-y-4 animate-fade-in">
              <div className="text-center space-y-1 pb-2">
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#202020] dark:text-white">
                  Encuentra el Inmueble que Buscas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cuéntanos tus requerimientos y te contactaremos de inmediato por WhatsApp con opciones disponibles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Tipo de Inmueble
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  >
                    <option value="Lote / Terreno de Campo">Lote / Terreno de Campo</option>
                    <option value="Proyecto en Preventa">Proyecto en Preventa</option>
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Presupuesto ({currency})
                  </label>
                  <input
                    type="text"
                    value={buyerBudget}
                    onChange={(e) => setBuyerBudget(e.target.value)}
                    placeholder="Ej. 150,000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Zona o Ciudad de Interés
                </label>
                <input
                  type="text"
                  value={buyerZone}
                  onChange={(e) => setBuyerZone(e.target.value)}
                  placeholder="Ej. Arequipa, Chiguata, Sabandía, Yanahuara..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
                  <span>Consultar Disponibilidad por WhatsApp</span>
                </button>
              </div>
            </form>
          ) : (
            /* Formulario Vendedor */
            <form onSubmit={handleSubmitSeller} className="max-w-xl mx-auto space-y-4 animate-fade-in">
              <div className="text-center space-y-1 pb-2">
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#202020] dark:text-white">
                  Comercializa tu Inmueble con Nosotros
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vendemos tu terreno, proyecto o propiedad con nuestra red de compradores y marketing digital.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Nombre o Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="Ej. Carlos M."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Tipo de Inmueble
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  >
                    <option value="Terreno / Lote">Terreno / Lote</option>
                    <option value="Proyecto Completo">Proyecto Completo</option>
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Precio Estimado ({currency})
                  </label>
                  <input
                    type="text"
                    value={propertyEstimatedPrice}
                    onChange={(e) => setPropertyEstimatedPrice(e.target.value)}
                    placeholder="Ej. 250,000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Ubicación / Distrito
                </label>
                <input
                  type="text"
                  value={propertyLocation}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  placeholder="Distrito o referencia..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F8FA] dark:bg-[#1E2333] border border-[#E5E7EB] dark:border-white/[0.1] outline-none focus:border-[#1154FF] dark:focus:border-[#38BDF8] text-[#202020] dark:text-slate-100 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sunarpCheck"
                  checked={hasSunarpTitle}
                  onChange={(e) => setHasSunarpTitle(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1154FF] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="sunarpCheck" className="text-xs text-[#202020] dark:text-slate-300 font-medium cursor-pointer">
                  Inscrito en SUNARP (Título de Propiedad)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enviar Inmueble para Evaluación</span>
                </button>
              </div>
            </form>
          )}

          {submitted && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Consulta enviada con éxito hacia WhatsApp.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
