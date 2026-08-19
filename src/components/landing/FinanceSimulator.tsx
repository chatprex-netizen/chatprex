import React, { useState, useEffect } from 'react';
import { Calculator, MessageCircle, ShieldCheck, DollarSign, Sliders, RefreshCw } from 'lucide-react';

interface FinanceSimulatorProps {
  currency: 'S/' | 'USD';
  onSendSimulation: (message: string) => void;
}

export const FinanceSimulator: React.FC<FinanceSimulatorProps> = ({
  currency: initialCurrency,
  onSendSimulation,
}) => {
  const [activeCurrency, setActiveCurrency] = useState<'S/' | 'USD'>(initialCurrency || 'S/');
  
  // Sincronizar si cambia desde afuera
  useEffect(() => {
    if (initialCurrency) {
      setActiveCurrency(initialCurrency);
    }
  }, [initialCurrency]);

  // Montos según moneda: Soles (min 10,000) / Dólares (min 1,000)
  const isSoles = activeCurrency === 'S/';
  const minPrice = isSoles ? 10000 : 1000;
  const maxPrice = isSoles ? 1000000 : 300000;
  const stepPrice = isSoles ? 2500 : 500;

  const [propertyPrice, setPropertyPrice] = useState(isSoles ? 150000 : 40000);
  const [initialPct, setInitialPct] = useState(30);
  const [months, setMonths] = useState(36);
  const [isCustomMonths, setIsCustomMonths] = useState(false);

  // Reajustar precio al cambiar de moneda
  const handleCurrencyChange = (newCurr: 'S/' | 'USD') => {
    if (newCurr === activeCurrency) return;
    setActiveCurrency(newCurr);
    if (newCurr === 'USD') {
      const converted = Math.max(1000, Math.round(propertyPrice / 3.75 / 500) * 500);
      setPropertyPrice(Math.min(converted, 300000));
    } else {
      const converted = Math.max(10000, Math.round((propertyPrice * 3.75) / 2500) * 2500);
      setPropertyPrice(Math.min(converted, 1000000));
    }
  };

  // Cálculos matemáticos
  const initialAmount = Math.round((propertyPrice * initialPct) / 100);
  const loanAmount = Math.max(0, propertyPrice - initialAmount);
  const monthlyPayment = months > 0 ? Math.round(loanAmount / months) : 0;

  const handleSendToWhatsApp = () => {
    const currSymbol = activeCurrency === 'S/' ? 'S/' : 'USD $';
    const msg = `¡Hola! Hice una simulación en la web para un inmueble de ${currSymbol} ${propertyPrice.toLocaleString('en-US')}.\n- Inicial (${initialPct}%): ${currSymbol} ${initialAmount.toLocaleString('en-US')}\n- Saldo a financiar: ${currSymbol} ${loanAmount.toLocaleString('en-US')}\n- Plazo: ${months} cuotas de ${currSymbol} ${monthlyPayment.toLocaleString('en-US')}/mes.\n¿Cómo podemos iniciar la evaluación y disponibilidad?`;
    onSendSimulation(msg);
  };

  return (
    <section id="financiamiento" className="scroll-mt-20 w-full max-w-5xl mx-auto px-3 sm:px-4 py-10 sm:py-14 font-sans">
      <div className="rounded-3xl bg-white dark:bg-[#12151E] border border-[#E5E7EB] dark:border-white/[0.08] p-5 sm:p-8 text-[#202020] dark:text-white transition-colors shadow-sm">
        
        {/* Header del Simulador con Selector de Moneda */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#F1F3F5] dark:border-white/[0.08]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F7F8FA] dark:bg-[#181C27] text-[#1154FF] dark:text-[#38BDF8] border border-[#E5E7EB] dark:border-white/[0.08]">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador de Financiamiento</span>
            </div>
            <h2 className="font-manrope font-bold text-xl sm:text-2xl tracking-tight text-[#202020] dark:text-white">
              Calcula tu Cuota Mensual Sin Intereses
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
              Facilidades de pago directo con cuotas fijas a tu medida.
            </p>
          </div>

          {/* Toggle de Moneda S/ vs USD */}
          <div className="flex items-center gap-1 bg-[#F1F3F5] dark:bg-[#181C27] p-1 rounded-xl border border-[#E5E7EB] dark:border-white/[0.08] shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleCurrencyChange('S/')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCurrency === 'S/'
                  ? 'bg-white dark:bg-[#1154FF] text-[#1154FF] dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#202020] dark:hover:text-white'
              }`}
            >
              Soles (S/)
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyChange('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCurrency === 'USD'
                  ? 'bg-white dark:bg-[#1154FF] text-[#1154FF] dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#202020] dark:hover:text-white'
              }`}
            >
              Dólares (USD)
            </button>
          </div>
        </div>

        {/* Grid de 2 Columnas Compacto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          
          {/* Controles (7 cols) */}
          <div className="lg:col-span-7 space-y-4 bg-[#F7F8FA] dark:bg-[#181C27] p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] dark:border-white/[0.08]">
            
            {/* 1. Valor del Inmueble */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Valor del Inmueble</span>
                <div className="flex items-center gap-1">
                  <span className="font-manrope font-bold text-[15px] sm:text-[17px] text-[#202020] dark:text-white">
                    {activeCurrency} {propertyPrice.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={stepPrice}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-[#252B3E] rounded-lg appearance-none cursor-pointer accent-[#1154FF] dark:accent-[#38BDF8]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Mín: {activeCurrency} {minPrice.toLocaleString('en-US')}</span>
                <span>Máx: {activeCurrency} {maxPrice.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* 2. Porcentaje de Inicial */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Cuota Inicial ({initialPct}%)
                </span>
                <span className="font-manrope font-bold text-xs sm:text-sm text-[#1154FF] dark:text-[#38BDF8]">
                  {activeCurrency} {initialAmount.toLocaleString('en-US')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 20, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setInitialPct(pct)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      initialPct === pct
                        ? 'bg-[#1154FF] text-white shadow-sm'
                        : 'bg-white dark:bg-[#1E2333] text-[#202020] dark:text-slate-300 border border-[#E5E7EB] dark:border-white/[0.08] hover:bg-[#F1F3F5] dark:hover:bg-[#252B3E]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Plazo de Financiamiento con Opción Personalizada */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Plazo de Financiamiento</span>
                <span className="font-manrope font-bold text-xs sm:text-sm text-[#202020] dark:text-white">
                  {months} {months === 1 ? 'Mes' : 'Meses'} ({Number((months / 12).toFixed(1))} años)
                </span>
              </div>

              {/* Botones rápidos + Botón Personalizado */}
              <div className="grid grid-cols-4 gap-1.5">
                {[12, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMonths(m); setIsCustomMonths(false); }}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !isCustomMonths && months === m
                        ? 'bg-[#1154FF] text-white shadow-sm'
                        : 'bg-white dark:bg-[#1E2333] text-[#202020] dark:text-slate-300 border border-[#E5E7EB] dark:border-white/[0.08] hover:bg-[#F1F3F5] dark:hover:bg-[#252B3E]'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={() => setIsCustomMonths(!isCustomMonths)}
                  className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isCustomMonths
                      ? 'bg-[#1154FF] text-white shadow-sm'
                      : 'bg-white dark:bg-[#1E2333] text-[#202020] dark:text-slate-300 border border-[#E5E7EB] dark:border-white/[0.08] hover:bg-[#F1F3F5] dark:hover:bg-[#252B3E]'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>Ajustar</span>
                </button>
              </div>

              {/* Slider de Plazo Personalizado (1 a 60 meses) */}
              {isCustomMonths && (
                <div className="pt-2 space-y-1 animate-fade-in">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-[#252B3E] rounded-lg appearance-none cursor-pointer accent-[#1154FF] dark:accent-[#38BDF8]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1 mes</span>
                    <span>60 meses (5 años)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-[#E5E7EB] dark:border-white/[0.08]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1154FF] dark:text-[#38BDF8] shrink-0" />
              <span>Financiamiento directo con cuotas fijas en {isSoles ? 'Soles' : 'Dólares'}</span>
            </div>
          </div>

          {/* Tarjeta de Resumen (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#F7F8FA] dark:bg-[#181C27] border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm space-y-5">
            <div>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">
                Cuota Mensual Estimada
              </span>
              <div className="font-manrope font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1154FF] dark:text-[#38BDF8] mt-1 leading-tight">
                {activeCurrency} {monthlyPayment.toLocaleString('en-US')}
                <span className="text-xs font-medium text-slate-400"> / mes</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-[#E5E7EB] dark:border-white/[0.08] text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Inicial Requerida ({initialPct}%):</span>
                <span className="font-manrope font-bold text-[#202020] dark:text-white">
                  {activeCurrency} {initialAmount.toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Saldo a Financiar:</span>
                <span className="font-manrope font-bold text-[#202020] dark:text-white">
                  {activeCurrency} {loanAmount.toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Número de Cuotas:</span>
                <span className="font-manrope font-bold text-[#202020] dark:text-white">
                  {months} fijas
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-[#1154FF] hover:bg-[#0c43cc] text-white font-semibold text-xs sm:text-[13px] flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all transform active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#1154FF]" />
              <span>Solicitar este Cronograma por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
