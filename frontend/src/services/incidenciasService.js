// api.js - VERSIÓN CORREGIDA
import axios from 'axios';

// ⚠️ TEMPORAL: URL absoluta para debug
const API_URL = 'https://api.infraexpert.cl/api';

console.log('🎯 [API] URL base configurada:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    console.log('🚀 [API Request]', {
      url: config.url,
      method: config.method,
      esFormData: config.data instanceof FormData
    });
    
    // Obtener token
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
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API Response]', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    console.error('❌ [API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Función para obtener token
const obtenerToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    
    const authState = JSON.parse(authStorage);
    return authState?.state?.token || null;
  } catch (error) {
    console.error('❌ [API Token Error]', error);
    return null;
  }
};

export const uploadWithProgress = (url, formData, onProgress) => {
  return api.post(url, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
};