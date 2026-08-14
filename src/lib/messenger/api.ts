const BACKEND_API_BASE = ((import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000') + '/api/messenger';

export async function saveIntegrationConfig(config: {
  page_id: string;
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

export async function testBackendConnection(config: {
  page_id: string;
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

export async function getIntegrationConfig() {
  const res = await fetch(`${BACKEND_API_BASE}/config`);
  if (!res.ok) throw new Error('Error al obtener la configuración');
  return res.json();
}
