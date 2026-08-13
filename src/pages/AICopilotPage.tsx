import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Sparkles, 
  Copy, 
  Check
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AICopilotPage: React.FC = () => {
  const { properties } = useCRM();

  const [activeTab, setActiveTab] = useState<'copywriter' | 'matching' | 'objections'>('copywriter');

  // Copywriter State
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [platform, setPlatform] = useState<'portal' | 'instagram' | 'whatsapp' | 'email'>('portal');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  // Generador de copy inteligente
  const handleGenerateCopy = () => {
    if (!selectedProperty) return;
    setIsGenerating(true);
    setGeneratedText('');

    setTimeout(() => {
      let copy = '';
      const priceFormatted = `$${selectedProperty.price.toLocaleString()} ${selectedProperty.currency}`;

      if (platform === 'portal') {
        copy = `${selectedProperty.title} en ${selectedProperty.zone}\n\n` +
          `Descubre esta magnífica oportunidad inmobiliaria en la cotizada zona de ${selectedProperty.zone}, ${selectedProperty.city}.\n\n` +
          `Características principales:\n` +
          `• Superficie: ${selectedProperty.areaTotal} m² totales (${selectedProperty.areaBuilt} m² construidos)\n` +
          `• Habitaciones: ${selectedProperty.bedrooms} amplias recámaras con excelente iluminación natural\n` +
          `• Baños: ${selectedProperty.bathrooms} baños completos\n` +
          `• Estacionamiento: ${selectedProperty.parkingSpots} cocheras privadas\n\n` +
          `Amenidades:\n` +
          selectedProperty.features.map(f => `• ${f}`).join('\n') + '\n\n' +
          `Precio: ${priceFormatted}\n\n` +
          `Descripción: ${selectedProperty.description}\n\n` +
          `Agenda tu visita privada hoy mismo.`;
      } else if (platform === 'instagram') {
        copy = `Nuevo ingreso exclusivo en ${selectedProperty.zone}\n\n` +
          `${selectedProperty.title} (${selectedProperty.city})\n\n` +
          `Una propiedad diseñada para quienes buscan confort, seguridad y alta plusvalía.\n\n` +
          `• ${selectedProperty.bedrooms} recámaras | ${selectedProperty.bathrooms} baños | ${selectedProperty.parkingSpots} autos | ${selectedProperty.areaTotal} m²\n\n` +
          `Amenidades: ${selectedProperty.features.slice(0, 4).join(', ')}\n\n` +
          `Precio: ${priceFormatted}\n\n` +
          `Escríbenos un mensaje para enviarte el brochure y planos.\n\n` +
          `#BienesRaices #Inmobiliaria #RealEstate #${selectedProperty.zone.replace(/\s+/g, '')}`;
      } else if (platform === 'whatsapp') {
        copy = `Hola! Te comparto los detalles de esta opción disponible en ${selectedProperty.zone}:\n\n` +
          `🏡 *${selectedProperty.title}*\n` +
          `💵 *Precio:* ${priceFormatted}\n` +
          `📐 *Metraje:* ${selectedProperty.areaTotal} m² (${selectedProperty.bedrooms} recámaras / ${selectedProperty.bathrooms} baños)\n` +
          `🌟 *Amenidades:* ${selectedProperty.features.slice(0, 3).join(' • ')}\n\n` +
          `¿Te gustaría coordinar una visita para esta semana?`;
      } else {
        copy = `Asunto: Presentación de oportunidad inmobiliaria - ${selectedProperty.title}\n\n` +
          `Estimado/a,\n\n` +
          `Es un gusto saludarle. Queremos presentarle una propiedad destacada en nuestro catálogo ubicada en ${selectedProperty.zone}.\n\n` +
          `Resumen del inmueble:\n` +
          `- Propiedad: ${selectedProperty.title} (${selectedProperty.code})\n` +
          `- Valor: ${priceFormatted}\n` +
          `- Área: ${selectedProperty.areaTotal} m²\n` +
          `- Distribución: ${selectedProperty.bedrooms} recámaras, ${selectedProperty.bathrooms} baños, ${selectedProperty.parkingSpots} estacionamientos.\n\n` +
          `Quedamos a su disposición para coordinar una reunión o visita.\n\n` +
          `Atentamente,\nEquipo comercial`;
      }

      setGeneratedText(copy);
      setIsGenerating(false);
    }, 400);
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
            { id: 'copywriter', label: 'Redactor de fichas' },
            { id: 'matching', label: 'Emparejador de clientes' },
            { id: 'objections', label: 'Manejo de objeciones' },
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
    </div>
  );
};
