import React, { useState } from 'react';
import { Calculator, MessageCircle, ShieldCheck } from 'lucide-react';

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
    const msg = `¡Hola! Hice una simulación en la web para un lote de ${currency} ${propertyPrice.toLocaleString('en-US')}. Inicial del ${initialPct}% (${currency} ${initialAmount.toLocaleString('en-US')}) y saldo en ${months} cuotas de ${currency} ${monthlyPayment.toLocaleString('en-US')}/mes. ¿Cómo podemos iniciar la separación?`;
    onSendSimulation(msg);
  };

  return (
    <section id="financiamiento" className="w-full max-w-5xl mx-auto px-4 py-12 font-sans">
      <div className="rounded-3xl bg-[#F7F8FA] dark:bg-[#181818] border border-[#E5E7EB] dark:border-slate-800 p-6 sm:p-10 text-[#202020] dark:text-white">
        
        {/* Header del Simulador */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 text-[#1154FF] border border-[#E5E7EB] dark:border-slate-700">
            <Calculator className="w-3.5 h-3.5" />
            <span>Financiamiento Directo</span>
          </div>
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl tracking-tight text-[#202020] dark:text-white">
            Calcula tu Cuota Mensual Sin Intereses
          </h2>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">
            Facilidades de pago directo con la desarrolladora, sin trámites bancarios.
          </p>
        </div>

        {/* Grid de Controles y Resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Controles (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-sm">
            
            {/* 1. Valor del Terreno */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Valor referencial del terreno</span>
                <span className="font-manrope font-bold text-[17px] text-[#202020] dark:text-white">
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
                className="w-full h-1.5 bg-[#F1F3F5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1154FF]"
              />
            </div>

            {/* 2. Porcentaje de Inicial */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Cuota Inicial ({initialPct}%)</span>
                <span className="font-manrope font-bold text-sm text-[#1154FF]">
                  {currency} {initialAmount.toLocaleString('en-US')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[20, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setInitialPct(pct)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      initialPct === pct
                        ? 'bg-[#1154FF] text-white shadow-sm'
                        : 'bg-[#F7F8FA] dark:bg-slate-800 text-[#202020] dark:text-slate-300 hover:bg-[#F1F3F5]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Plazo en Meses */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Plazo de Financiamiento</span>
                <span className="font-manrope font-bold text-sm text-[#202020] dark:text-white">{months} Meses</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[12, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      months === m
                        ? 'bg-[#1154FF] text-white shadow-sm'
                        : 'bg-[#F7F8FA] dark:bg-slate-800 text-[#202020] dark:text-slate-300 hover:bg-[#F1F3F5]'
                    }`}
                  >
                    {m} meses
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-slate-500 pt-2 border-t border-[#F1F3F5] dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#1154FF] shrink-0" />
              <span>Financiamiento directo y cuotas fijas a tu medida</span>
            </div>
          </div>

          {/* Tarjeta de Resumen (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-[12px] text-slate-400 block font-medium uppercase tracking-wider">Tu Cuota Mensual</span>
              <div className="font-manrope font-extrabold text-3xl sm:text-4xl text-[#1154FF] mt-1 leading-tight">
                {currency} {monthlyPayment.toLocaleString('en-US')}
                <span className="text-xs font-medium text-slate-400"> / mes</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-[#F1F3F5] dark:border-slate-800 text-[13px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Inicial Requerida ({initialPct}%):</span>
                <span className="font-manrope font-bold text-[#202020] dark:text-white">{currency} {initialAmount.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saldo a Financiar:</span>
                <span className="font-manrope font-bold text-[#202020] dark:text-white">{currency} {loanAmount.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Número de Cuotas:</span>
                <span className="font-manrope font-bold text-[#202020] dark:text-white">{months} fijas</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
              <span>Solicitar esta Corrida por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
