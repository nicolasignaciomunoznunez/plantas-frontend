import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ FUNCIÓN CORREGIDA: Obtener token de la estructura de Zustand
const obtenerToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    
    if (!authStorage) {
      return null;
    }

    const authState = JSON.parse(authStorage);
    
    // ✅ CORRECCIÓN: Zustand guarda el estado en authState.state
    const token = authState?.state?.token;
    
    return token || null;
  } catch (error) {
    console.error('❌ [obtenerToken] Error:', error);
    return null;
  }
};

// Interceptor para agregar token a las requests - CORREGIDO
api.interceptors.request.use(
  (config) => {
    const token = obtenerToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ NUEVO: Manejo especial para FormData (subida de archivos)
    // Si es FormData, NO establecer Content-Type (dejar que el navegador lo haga)
    if (config.data instanceof FormData) {
      // Eliminar Content-Type para que el navegador establezca el boundary automáticamente
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ NUEVO: Función helper para subida de archivos con progreso
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