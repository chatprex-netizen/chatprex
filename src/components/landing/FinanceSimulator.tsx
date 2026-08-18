import React, { useState } from 'react';
import { Calculator, Sparkles, MessageCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FinanceSimulatorProps {
  currency: 'S/' | 'USD';
  onSendSimulation: (message: string) => void;
}

export const FinanceSimulator: React.FC<FinanceSimulatorProps> = ({
  currency,
  onSendSimulation,
}) => {
  const [propertyPrice, setPropertyPrice] = useState(currency === 'S/' ? 165000 : 45000);
  const [initialPct, setInitialPct] = useState(30);
  const [months, setMonths] = useState(36);

  const initialAmount = Math.round((propertyPrice * initialPct) / 100);
  const loanAmount = propertyPrice - initialAmount;
  const monthlyPayment = Math.round(loanAmount / months);

  const handleSendToWhatsApp = () => {
    const msg = `¡Hola Elvis! Hice una simulación en la web para un lote de ${currency} ${propertyPrice.toLocaleString('en-US')}. Con una inicial del ${initialPct}% (${currency} ${initialAmount.toLocaleString('en-US')}) y saldo en ${months} cuotas de ${currency} ${monthlyPayment.toLocaleString('en-US')}/mes. ¿Cómo podemos iniciar la separación?`;
    onSendSimulation(msg);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1930] to-slate-900 border border-blue-500/20 shadow-2xl p-6 sm:p-10 text-white">
        
        {/* Decoraciones de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header del Simulador */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador de Financiamiento Directo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Calcula tu Cuota Mensual Sin Intereses
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Adquiere tu lote de campo con facilidades de pago directo con la desarrolladora, sin evaluación bancaria engorrosa.
            </p>
          </div>

          {/* Grid: Controles y Resultados */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controles Interactivos (7 cols) */}
            <div className="lg:col-span-7 space-y-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              
              {/* 1. Valor del Lote */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">Valor referencial del terreno</span>
                  <span className="text-lg font-black text-blue-400">
                    {currency} {propertyPrice.toLocaleString('en-US')}
                  </span>
                </div>
                <input
                  type="range"
                  min={currency === 'S/' ? 80000 : 25000}
                  max={currency === 'S/' ? 400000 : 120000}
                  step={currency === 'S/' ? 5000 : 1500}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#004aad]"
                />
              </div>

              {/* 2. Porcentaje de Cuota Inicial */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">Cuota Inicial ({initialPct}%)</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {currency} {initialAmount.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setInitialPct(pct)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        initialPct === pct
                          ? 'bg-[#004aad] text-white shadow-lg shadow-blue-500/30 scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Plazo de Cuotas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">Plazo de Financiamiento</span>
                  <span className="text-sm font-extrabold text-blue-300">{months} Meses</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        months === m
                          ? 'bg-[#004aad] text-white shadow-lg shadow-blue-500/30 scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {m} meses
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0% de interés en pagos puntuales • Título independizado SUNARP</span>
              </div>
            </div>

            {/* Tarjeta de Resumen (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-blue-600 to-[#004aad] border border-blue-400/30 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-blue-200 tracking-wider">Tu Cuota Mensual Estimada</span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {currency} {monthlyPayment.toLocaleString('en-US')}
                  <span className="text-xs font-normal text-blue-200"> / mes</span>
                </div>
              </div>

              <div className="space-y-2 py-3 border-y border-white/20 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-100">Inicial Requerida ({initialPct}%):</span>
                  <span className="font-bold text-white">{currency} {initialAmount.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Saldo a Financiar:</span>
                  <span className="font-bold text-white">{currency} {loanAmount.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Número de Cuotas:</span>
                  <span className="font-bold text-white">{months} cuotas fijas</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all transform active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Solicitar esta Corrida por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
