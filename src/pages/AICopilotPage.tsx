import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Sparkles, 
  Copy, 
  Check,
  TrendingUp,
  Target,
  BarChart3,
  LineChart
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { generateCopy } from '../lib/aiService';

export const AICopilotPage: React.FC = () => {
  const { properties, aiConfig, addNotification } = useCRM();

  const [activeTab, setActiveTab] = useState<'copywriter' | 'matching' | 'objections' | 'predictive'>('predictive');

  // Copywriter State
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [platform, setPlatform] = useState<'portal' | 'instagram' | 'whatsapp' | 'email'>('portal');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  // Generador de copy inteligente
  const handleGenerateCopy = async () => {
    if (!selectedProperty) return;
    setIsGenerating(true);
    setGeneratedText('');

    try {
      const priceFormatted = `$${selectedProperty.price.toLocaleString()} ${selectedProperty.currency}`;
      
      const prompt = `Eres un experto copywriter inmobiliario. Por favor, genera un texto persuasivo para promocionar la siguiente propiedad en la plataforma: ${platform}.
      
Detalles de la propiedad:
- Título: ${selectedProperty.title}
- Ubicación: ${selectedProperty.zone}, ${selectedProperty.city}
- Precio: ${priceFormatted}
- Área Total: ${selectedProperty.areaTotal} m²
- Área Construida: ${selectedProperty.areaBuilt} m²
- Habitaciones: ${selectedProperty.bedrooms}
- Baños: ${selectedProperty.bathrooms}
- Estacionamientos: ${selectedProperty.parkingSpots}
- Amenidades: ${selectedProperty.features.join(', ')}
- Descripción original: ${selectedProperty.description}

Instrucciones:
1. Adapta el tono y longitud a la plataforma seleccionada (${platform}).
2. Si es Instagram, incluye emojis y hashtags relevantes al final.
3. Si es WhatsApp, que sea un mensaje conversacional, corto y directo, con emojis.
4. Si es Email, formato profesional con asunto.
5. Si es Portal Inmobiliario, detallado y persuasivo destacando los beneficios.
6. Devuelve únicamente el texto generado, sin comentarios adicionales.`;

      const aiText = await generateCopy(prompt, aiConfig);
      setGeneratedText(aiText);
    } catch (error: any) {
      console.error(error);
      addNotification('Error al generar copy', error.message || 'Error desconocido', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      {/* Header */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#004aad]" />
            Copilot comercial con inteligencia artificial
          </h2>
          <p className="text-[11px] text-slate-400 font-normal">
            Generador de fichas, redacción comercial y sugerencias de inmuebles
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {[
            { id: 'predictive', label: 'Análisis Predictivo' },
            { id: 'copywriter', label: 'Redactor de fichas' },
            { id: 'matching', label: 'Emparejador' },
            { id: 'objections', label: 'Objeciones' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-[#004aad] shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: AI Copywriter */}
      {activeTab === 'copywriter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Controls Panel */}
          <div className="lg:col-span-5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Selecciona la propiedad
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Canal de publicación
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'portal', label: 'Portales inmobiliarios' },
                  { id: 'instagram', label: 'Instagram / Redes' },
                  { id: 'whatsapp', label: 'Mensaje WhatsApp' },
                  { id: 'email', label: 'Correo formal' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                      platform === p.id
                        ? 'bg-[#004aad] text-white border-[#004aad]'
                        : 'bg-[#f1f1f1] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateCopy}
              disabled={isGenerating}
              className="w-full py-2 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generando redacción...' : 'Generar texto comercial'}</span>
            </button>
          </div>

          {/* Result Output Panel */}
          <div className="lg:col-span-7 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-semibold text-slate-800 dark:text-white">Resultado generado</span>
              {generatedText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar texto'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed overflow-y-auto max-h-[350px]">
              {generatedText || 'Haz clic en "Generar texto comercial" para obtener la redacción lista para publicar.'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Smart Matching */}
      {activeTab === 'matching' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Sugerencias de inmuebles para prospectos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {properties.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 dark:text-white">{p.title}</div>
                  <div className="text-[11px] text-slate-500">{p.zone} · ${p.price.toLocaleString()} {p.currency}</div>
                </div>

                <Badge variant="emerald" size="sm">
                  94% afinidad
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Objections */}
      {activeTab === 'objections' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Guía de respuestas comerciales recomendadas
          </h3>

          <div className="space-y-2.5">
            {[
              {
                q: 'El precio por metro cuadrado está muy alto en comparación a la zona',
                a: 'El valor refleja amenidades exclusivas, acabados de importación y plusvalía proyectada del 12% anual en este sector.',
              },
              {
                q: 'Prefiero esperar a ver cómo evoluciona la tasa de interés bancaria',
                a: 'En preventa aseguramos el precio de lista actual con cuota inicial flexible, protegiéndolo de los incrementos futuros por avance de obra.',
              },
            ].map((obj, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-semibold text-[#004aad]">Objeción: "{obj.q}"</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">Respuesta: {obj.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Predictive Analysis */}
      {activeTab === 'predictive' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Sales Forecast */}
          <div className="lg:col-span-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <BarChart3 className="w-4 h-4 text-[#004aad]" />
              Pronóstico de Ingresos (Próximos 90 días)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">30 Días (Alta prob.)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$45,200</div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% vs mes anterior
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">60 Días (Media prob.)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$128,500</div>
                <div className="text-[10px] text-slate-500 mt-1">Basado en 8 prospectos</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">90 Días (Total pipeline)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$315,000</div>
                <div className="text-[10px] text-slate-500 mt-1">Valor potencial bruto</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                <span>Progreso hacia meta trimestral ($500k)</span>
                <span>63%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#004aad] w-[45%]" title="Cerrado" />
                <div className="h-full bg-blue-300 w-[18%]" title="Pronosticado (30d)" />
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <LineChart className="w-4 h-4 text-[#004aad]" />
              Tendencias del Mercado
            </h3>
            
            <div className="space-y-3">
              <div className="p-2.5 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <div className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">Pico de interés en "San Isidro"</div>
                <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">Las búsquedas de departamentos 2 dorm. aumentaron un 34% esta semana.</div>
              </div>
              <div className="p-2.5 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-300">Estancamiento en Casas</div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">El tiempo promedio en mercado subió a 45 días. Sugerimos revisar precios.</div>
              </div>
            </div>
          </div>

          {/* Lead Scoring Predictivo */}
          <div className="lg:col-span-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
             <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Target className="w-4 h-4 text-[#004aad]" />
              Leads con mayor probabilidad de cierre (Top 3)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               {[
                 { name: 'Carlos Mendoza', score: 92, reason: 'Abrió 4 correos recientes, presupuestos alineados, visita completada.' },
                 { name: 'Elena Ramírez', score: 87, reason: 'Interacción alta en WhatsApp, solicitó contrato borrador.' },
                 { name: 'Roberto Díaz', score: 81, reason: 'Cliente recurrente (inversionista), revisó portafolio ayer.' }
               ].map((lead, i) => (
                 <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                      <Badge variant="emerald" size="sm">Score: {lead.score}</Badge>
                    </div>
                    <div className="text-[10px] text-slate-500">{lead.reason}</div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
