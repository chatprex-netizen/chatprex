const BACKEND_API_BASE = ((import.meta as any).env?.VITE_BACKEND_URL || '') + '/api/whatsapp';

/**
 * Save configuration to the backend database.
 */
export async function saveIntegrationConfig(config: {
  phone_number_id: string;
  waba_id?: string;
  access_token: string;
  verify_token?: string;
  app_secret?: string;
  app_id?: string;
}) {
  const res = await fetch(`${BACKEND_API_BASE}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del servidor: ${res.status}`);
  }

  return res.json();
}

/**
 * Test WhatsApp configuration against Meta without persisting changes.
 */
export async function testBackendConnection(config: {
  phone_number_id: string;
  access_token: string;
}) {
  const res = await fetch(`${BACKEND_API_BASE}/config/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del servidor: ${res.status}`);
  }

  return res.json();
}

/**
 * Get active configuration from the backend (masked values).
 */
export async function getIntegrationConfig() {
  const res = await fetch(`${BACKEND_API_BASE}/config`);
  if (!res.ok) throw new Error('Error al obtener la configuración');
  return res.json();
}

/**
 * Send a message via our backend server (persists to SQLite, retries sandbox allowed list, triggers webhook updates).
 */
export async function sendMessageViaBackend(params: {
  conversation_id: string;
  message_type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'template';
  content_text?: string;
  media_url?: string;
  filename?: string;
  template_name?: string;
  template_params?: string[];
}) {
  const res = await fetch(`${BACKEND_API_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del servidor: ${res.status}`);
  }

  return res.json();
}
