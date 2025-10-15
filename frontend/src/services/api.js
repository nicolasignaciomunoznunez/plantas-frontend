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