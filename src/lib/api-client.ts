import { CRM_API_BASE } from '../config';

const API_BASE_URL = CRM_API_BASE;

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inyectar token JWT automáticamente
  const token = localStorage.getItem('prexup_auth_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
    config.body = options.body;
  }

  try {
    const response = await fetch(url, config);
    
    // Si la respuesta no es OK, arrojar error con mensaje del servidor o status
    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.details && Array.isArray(errorData.details)) {
          errorMessage = errorData.details.join(', ');
        } else {
          errorMessage = errorData.error || errorData.message || errorMessage;
        }
      } catch (e) {
        // Fallback to plain text if possible
        const text = await response.text();
        if (text) errorMessage = text;
      }
      throw new ApiError(response.status, errorMessage);
    }

    // Comprobar si la respuesta está vacía (e.g. DELETE)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T; // Return empty object for non-json (e.g., 204 No Content)
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(error instanceof Error ? error.message : 'Error desconocido de red');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'POST', body: data }),
    
  put: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'PUT', body: data }),
    
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
