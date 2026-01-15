import axios from 'axios';

// URL dinámica según entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://api.infraexpert.cl/api';

// Solo mostrar en desarrollo
if (import.meta.env.DEV) {
  console.log('🎯 [API] URL base configurada:', API_URL);
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Obtener token de forma segura
const obtenerToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    
    const authState = JSON.parse(authStorage);
    return authState?.state?.token || null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [API Token Error]', error);
    }
    return null;
  }
};

// Interceptor de request - VERSIÓN PRODUCCIÓN
api.interceptors.request.use(
  (config) => {
    // Solo logs en desarrollo
    if (import.meta.env.DEV) {
      console.log('🚀 [API Request]', {
        url: config.url,
        method: config.method,
        esFormData: config.data instanceof FormData
      });
    }
    
    // Obtener y agregar token
    const token = obtenerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // CRÍTICO: Para FormData, dejar que el navegador establezca Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ [API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Interceptor de response - VERSIÓN PRODUCCIÓN
api.interceptors.response.use(
  (response) => {
    // Solo logs en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ [API Response]', {
        url: response.config.url,
        status: response.status
      });
    }
    return response;
  },
  (error) => {
    // Solo logs detallados en desarrollo
    if (import.meta.env.DEV) {
      console.error('❌ [API Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else {
      // En producción, solo log básico para CORS
      if (error.message?.includes('CORS') || error.message?.includes('Access-Control')) {
        console.error('🚨 Error CORS en producción');
      }
    }
    
    // Manejo de token expirado (igual en dev/prod)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Función para uploads con progreso
export const uploadWithProgress = (url, formData, onProgress) => {
  return api.post(url, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
    timeout: 120000, // 2 minutos para uploads
  });
};

// Función de test CORS (solo desarrollo)
export const testCorsConnection = async () => {
  if (!import.meta.env.DEV) return null;
  
  try {
    const response = await fetch(`${API_URL}/incidencias/test/cors`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('🌐 Test CORS fetch:', {
      ok: response.ok,
      status: response.status
    });
    
    return await response.json();
  } catch (error) {
    console.error('❌ Test CORS error:', error);
    return null;
  }
};