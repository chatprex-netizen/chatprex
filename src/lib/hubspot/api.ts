import { HUBSPOT_API_BASE } from '../../config';

const BACKEND_API_BASE = HUBSPOT_API_BASE;

export async function saveIntegrationConfig(config: {
  hubspot_portal_id: string;
  access_token: string;
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
  hubspot_portal_id: string;
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
