import React, { useState } from 'react';
import { MessageCircle, Building2, UserPlus, Send, CheckCircle2, ShieldCheck, Sparkles, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

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
  const [buyerType, setBuyerType] = useState('Lote de Campo');
  const [buyerBudget, setBuyerBudget] = useState('');
  const [buyerZone, setBuyerZone] = useState('Arequipa Campestre');

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
    const msg = `¡Hola Elvis! Mi nombre es ${buyerName || 'un comprador'}. Estoy buscando un ${buyerType} en la zona de ${buyerZone}, con un presupuesto aproximado de ${currency} ${buyerBudget || 'a evaluar'}. Mi celular de contacto es ${buyerPhone}. ¿Qué opciones tienen disponibles?`;
    onSendMessage(msg);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleSubmitSeller = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `¡Hola Elvis! Mi nombre es ${sellerName || 'un propietario'}. Deseo vender/comercializar un inmueble (${propertyType}) ubicado en ${propertyLocation || 'Arequipa'}. Precio estimado: ${currency} ${propertyEstimatedPrice || 'a convenir'}. Título Sunarp: ${hasSunarpTitle ? 'Sí' : 'En trámite'}. Mi celular es ${sellerPhone}. Deseo asesoría para su venta.`;
    onSendMessage(msg);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contacto" className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header & Tab Selector */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-[#004aad] dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Centro de Contacto & Asesoría Inmobiliaria</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ¿En qué podemos ayudarte hoy?
          </h2>

          {/* Toggle Dual Comprador vs Vendedor */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl border border-slate-300/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('comprador')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'comprador'
                    ? 'bg-white dark:bg-slate-900 text-[#004aad] dark:text-blue-300 shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Quiero Comprar / Invertir</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vendedor')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'vendedor'
                    ? 'bg-white dark:bg-slate-900 text-[#004aad] dark:text-blue-300 shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Quiero Vender mi Propiedad</span>
              </button>
            </div>
          </div>
        </div>

        {/* Formularios Dinámicos */}
        <div className="p-6 sm:p-10">
          {activeTab === 'comprador' ? (
            /* Formulario Comprador */
            <form onSubmit={handleSubmitBuyer} className="max-w-2xl mx-auto space-y-4 animate-fade-in">
              <div className="text-center space-y-1 pb-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Encuentra el Lote o Propiedad Ideal para Ti
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cuéntanos qué buscas y nuestro equipo comercial te enviará las mejores opciones filtradas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Inmueble
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  >
                    <option value="Lote de Campo en Preventa">Lote de Campo en Preventa</option>
                    <option value="Casa de Campo Lista">Casa de Campo Lista</option>
                    <option value="Departamento de Estreno">Departamento de Estreno</option>
                    <option value="Terreno Comercial">Terreno Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Presupuesto Aproximado ({currency})
                  </label>
                  <input
                    type="text"
                    value={buyerBudget}
                    onChange={(e) => setBuyerBudget(e.target.value)}
                    placeholder="Ej. 150,000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Zona de Preferencia
                </label>
                <input
                  type="text"
                  value={buyerZone}
                  onChange={(e) => setBuyerZone(e.target.value)}
                  placeholder="Ej. Arequipa Campestre, Chiguata, Sabandía, Yanahuara..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Enviar Consulta Directa a WhatsApp</span>
                </button>
              </div>
            </form>
          ) : (
            /* Formulario Vendedor / Desarrollador */
            <form onSubmit={handleSubmitSeller} className="max-w-2xl mx-auto space-y-4 animate-fade-in">
              <div className="text-center space-y-1 pb-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Vende tu Terreno, Casa o Proyecto con Nosotros
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comercializamos tu propiedad con campañas digitales de alto rendimiento, agentes especializados e inteligencia artificial.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="Ej. Inversiones del Sur / Carlos M."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Inmueble a Vender
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  >
                    <option value="Terreno / Lote de Campo">Terreno / Lote de Campo</option>
                    <option value="Proyecto / Desarrollo Completo">Proyecto / Desarrollo Completo</option>
                    <option value="Casa o Residencia">Casa o Residencia</option>
                    <option value="Departamento">Departamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Precio Estimado ({currency})
                  </label>
                  <input
                    type="text"
                    value={propertyEstimatedPrice}
                    onChange={(e) => setPropertyEstimatedPrice(e.target.value)}
                    placeholder="Ej. 250,000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ubicación Exacta / Dirección
                </label>
                <input
                  type="text"
                  value={propertyLocation}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  placeholder="Distrito, calle o referencia en Arequipa / Perú..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#004aad] text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sunarpCheck"
                  checked={hasSunarpTitle}
                  onChange={(e) => setHasSunarpTitle(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004aad] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="sunarpCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  El inmueble cuenta con Título de Propiedad inscrito en Registros Públicos (SUNARP)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#004aad] hover:bg-[#003b8a] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Solicitar Evaluación y Venta de mi Inmueble</span>
                </button>
              </div>
            </form>
          )}

          {submitted && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Listo! Se ha generado tu consulta y abierto WhatsApp para atención inmediata.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
