import { AIConfig } from '../types';

export const generateCopy = async (prompt: string, aiConfig: AIConfig): Promise<string> => {
  if (!aiConfig.apiKey) {
    throw new Error('API Key no configurada. Por favor, configúrala en Administración > Modelos IA.');
  }

  let endpoint = '';
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${aiConfig.apiKey}`
  };

  let body: any = {
    model: aiConfig.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  };

  if (aiConfig.provider === 'deepseek') {
    endpoint = 'https://api.deepseek.com/chat/completions'; // the correct deepseek endpoint is api.deepseek.com/chat/completions
  } else if (aiConfig.provider === 'openai') {
    endpoint = 'https://api.openai.com/v1/chat/completions';
  } else if (aiConfig.provider === 'groq') {
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  } else {
    throw new Error('Proveedor de IA no soportado.');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Error en la API de ${aiConfig.provider}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No se pudo generar respuesta.';
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    throw new Error(error.message || 'Error desconocido al generar copy.');
  }
};
