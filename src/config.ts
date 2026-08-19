/**
 * Configuración centralizada de URLs y endpoints para CasaYa CRM
 */

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://api.casaya.pe')
    : 'https://api.casaya.pe');

export const CRM_API_BASE = `${BACKEND_URL}/api/crm`;
export const WHATSAPP_API_BASE = `${BACKEND_URL}/api/whatsapp`;
export const INSTAGRAM_API_BASE = `${BACKEND_URL}/api/instagram`;
export const MESSENGER_API_BASE = `${BACKEND_URL}/api/messenger`;
export const HUBSPOT_API_BASE = `${BACKEND_URL}/api/hubspot`;
