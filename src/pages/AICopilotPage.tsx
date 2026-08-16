import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Sparkles, 
  Copy, 
  Check,
  Target,
  BarChart3,
  LineChart,
  Trash2,
  PenTool,
  Plus
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { generateCopy } from '../lib/aiService';

export const AICopilotPage: React.FC = () => {
  const { properties, projects, aiConfig, addNotification } = useCRM();

  const [activeTab, setActiveTab] = useState<'copywriter' | 'matching' | 'objections' | 'predictive'>('predictive');

  // Copywriter State
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [platform, setPlatform] = useState<'portal' | 'instagram' | 'whatsapp' | 'email'>('portal');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Predictive Analysis State
  const { deals, contacts } = useCRM();
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<{
    forecast30: string;
    forecast60: string;
    forecast90: string;
    trend1Title: string;
    trend1Desc: string;
    trend2Title: string;
    trend2Desc: string;
    topLeads: { name: string, score: number, desc: string }[];
    lastUpdated: string;
  } | null>(() => {
    const saved = localStorage.getItem('prexup_predictive_v1');
    return saved ? JSON.parse(saved) : null;
  });
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false);

  const handleUpdateAnalysis = async () => {
    setIsUpdatingAnalysis(true);
    try {
      const activeDeals = deals.filter(d => d.stage !== 'ganado' && d.stage !== 'perdido');
      const wonDeals = deals.filter(d => d.stage === 'ganado');
      const prompt = `Analiza los siguientes datos del CRM y devuelve un análisis predictivo en formato JSON estrictamente con la siguiente estructura:
{
  "forecast30": "Monto numérico o texto corto (ej. $45,200)",
  "forecast60": "Monto numérico o texto corto",
  "forecast90": "Monto numérico o texto corto",
  "trend1Title": "Título tendencia 1",
  "trend1Desc": "Descripción tendencia 1",
  "trend2Title": "Título tendencia 2",
  "trend2Desc": "Descripción tendencia 2",
  "topLeads": [
    { "name": "Nombre lead 1", "score": 95, "desc": "Por qué es top lead" },
    { "name": "Nombre lead 2", "score": 88, "desc": "Por qué es top lead" },
    { "name": "Nombre lead 3", "score": 82, "desc": "Por qué es top lead" }
  ]
}

Datos actuales:
- Deals activos: ${activeDeals.length}
- Monto total Deals activos: ${activeDeals.reduce((sum, d) => sum + d.value, 0)}
- Deals ganados: ${wonDeals.length}
- Contactos totales: ${contacts.length}

Genera un pronóstico realista usando los datos. Devuelve SOLO el JSON sin markdown tags ni texto adicional.`;

      const aiText = await generateCopy(prompt, aiConfig);
      const cleaned = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const newData = { ...parsed, lastUpdated: new Date().toISOString() };
      setPredictiveAnalysis(newData);
      localStorage.setItem('prexup_predictive_v1', JSON.stringify(newData));
      addNotification('Análisis actualizado', 'El pronóstico y tendencias han sido calculados.', 'info');
    } catch (error: any) {
      console.error("Error generating predictive analysis:", error);
      addNotification('Error AI', 'No se pudo generar el análisis. Verifica tu configuración de IA.', 'warning');
    } finally {
      setIsUpdatingAnalysis(false);
    }
  };

  // Objeciones State
  const [objections, setObjections] = useState<{id: string, q: string, a: string}[]>(() => {
    const saved = localStorage.getItem('prexup_objections_v1');
    return saved ? JSON.parse(saved) : [
      { id: '1', q: 'El precio por metro cuadrado está muy alto en comparación a la zona', a: 'El valor refleja amenidades exclusivas, acabados de importación y plusvalía proyectada del 12% anual en este sector.' },
      { id: '2', q: 'Prefiero esperar a ver cómo evoluciona la tasa de interés bancaria', a: 'En preventa aseguramos el precio de lista actual con cuota inicial flexible, protegiéndolo de los incrementos futuros por avance de obra.' }
    ];
  });
  const [editingObjId, setEditingObjId] = useState<string | null>(null);
  const [newObjQ, setNewObjQ] = useState('');
  const [newObjA, setNewObjA] = useState('');
  const [showObjForm, setShowObjForm] = useState(false);

  const handleSaveObjection = () => {
    if (!newObjQ || !newObjA) return;
    let updated;
    if (editingObjId) {
      updated = objections.map(o => o.id === editingObjId ? { ...o, q: newObjQ, a: newObjA } : o);
    } else {
      updated = [...objections, { id: Date.now().toString(), q: newObjQ, a: newObjA }];
    }
    setObjections(updated);
    localStorage.setItem('prexup_objections_v1', JSON.stringify(updated));
    setEditingObjId(null);
    setNewObjQ('');
    setNewObjA('');
    setShowObjForm(false);
  };

  const handleDeleteObjection = (id: string) => {
    if(!confirm("¿Estás seguro de eliminar esta objeción?")) return;
    const updated = objections.filter(o => o.id !== id);
    setObjections(updated);
    localStorage.setItem('prexup_objections_v1', JSON.stringify(updated));
  };

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  // Generador de copy inteligente
  const handleGenerateCopy = async () => {
    if (!selectedProperty) return;
    setIsGenerating(true);
    setGeneratedText('');

    try {
      const priceFormatted = `$${selectedProperty.price.toLocaleString()} ${selectedProperty.currency}`;
      
      let prompt = `Eres un experto copywriter inmobiliario. Por favor, genera un texto persuasivo para promocionar la siguiente propiedad en la plataforma: ${platform}.
      
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

      // Inyectar contexto de la base de conocimiento si existe
      try {
        const savedAssistants = JSON.parse(localStorage.getItem('prexup_ai_assistants_v1') || '[]');
        const contexts = savedAssistants.filter((a: any) => a.active && a.manualContext).map((a: any) => a.manualContext).join('\n\n');
        if (contexts) {
          prompt += `\n\n--- BASE DE CONOCIMIENTO (Reglas y Contexto) ---\nPor favor, ten en cuenta esta información al redactar:\n${contexts}`;
        }
      } catch (e) {}

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
                {properties.map((p) => {
                  const proj = projects.find((pr) => pr.id === p.projectName);
                  const projName = proj ? proj.name : p.projectName || '';
                  return (
                    <option key={p.id} value={p.id}>
                      {projName ? `${projName} - ` : ''}{p.title}
                    </option>
                  );
                })}
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

      {/* Tab 3: Objections */}
      {activeTab === 'objections' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Guía de respuestas comerciales recomendadas
            </h3>
            <button
              onClick={() => { setShowObjForm(true); setEditingObjId(null); setNewObjQ(''); setNewObjA(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004aad] text-white text-xs font-medium shadow-xs hover:bg-[#003b8a] transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Objeción
            </button>
          </div>

          {showObjForm && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Pregunta / Objeción</label>
                <input 
                  type="text"
                  value={newObjQ}
                  onChange={e => setNewObjQ(e.target.value)}
                  placeholder="Ej: El precio está muy alto"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Respuesta recomendada</label>
                <textarea 
                  value={newObjA}
                  onChange={e => setNewObjA(e.target.value)}
                  placeholder="Ej: El valor refleja las amenidades exclusivas..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs min-h-[60px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowObjForm(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >Cancelar</button>
                <button 
                  onClick={handleSaveObjection}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#004aad] text-white hover:bg-[#003b8a]"
                >Guardar Objeción</button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {objections.map((obj) => (
              <div key={obj.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-start gap-4 hover:border-[#004aad]/30 transition-colors group">
                <div className="space-y-1">
                  <div className="font-semibold text-[#004aad]">Objeción: "{obj.q}"</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">Respuesta: {obj.a}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setShowObjForm(true); setEditingObjId(obj.id); setNewObjQ(obj.q); setNewObjA(obj.a); }}
                    className="p-1.5 text-slate-400 hover:text-[#004aad] rounded-md hover:bg-[#004aad]/10"
                    title="Editar"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteObjection(obj.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {objections.length === 0 && !showObjForm && (
              <div className="text-center p-6 text-slate-400 text-xs">No hay objeciones registradas.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Predictive Analysis */}
      {activeTab === 'predictive' && (
        <div className="space-y-4">
          <div className="flex justify-end">
             <button
              onClick={handleUpdateAnalysis}
              disabled={isUpdatingAnalysis}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#004aad] text-white text-xs font-medium shadow-xs hover:bg-[#003b8a] transition-all disabled:opacity-50"
             >
               <Sparkles className="w-3.5 h-3.5" />
               {isUpdatingAnalysis ? 'Calculando...' : 'Actualizar Análisis'}
             </button>
          </div>

          {!predictiveAnalysis && !isUpdatingAnalysis ? (
             <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card">
               <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 text-xs">Aún no hay análisis generado. Haz clic en "Actualizar Análisis" para analizar los datos actuales del CRM.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Sales Forecast */}
              <div className="lg:col-span-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#004aad]" />
                    Pronóstico de Ingresos (Próximos 90 días)
                  </h3>
                  <span className="text-[10px] text-slate-400">Actualizado: {predictiveAnalysis?.lastUpdated ? new Date(predictiveAnalysis.lastUpdated).toLocaleString() : ''}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">30 Días (Alta prob.)</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{predictiveAnalysis?.forecast30 || '---'}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">60 Días (Media prob.)</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{predictiveAnalysis?.forecast60 || '---'}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">90 Días (Total pipeline)</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{predictiveAnalysis?.forecast90 || '---'}</div>
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
                    <div className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">{predictiveAnalysis?.trend1Title || 'Cargando...'}</div>
                    <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">{predictiveAnalysis?.trend1Desc || '...'}</div>
                  </div>
                  <div className="p-2.5 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-300">{predictiveAnalysis?.trend2Title || 'Cargando...'}</div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">{predictiveAnalysis?.trend2Desc || '...'}</div>
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
                   {(predictiveAnalysis?.topLeads || []).map((lead: any, i: number) => (
                     <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                          <Badge variant="emerald" size="sm">Score: {lead.score}</Badge>
                        </div>
                        <div className="text-[10px] text-slate-500">{lead.desc}</div>
                     </div>
                   ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};
