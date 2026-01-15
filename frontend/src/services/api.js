import axios from 'axios';

// ⚠️ TEMPORAL: URL absoluta para debug - fuerza la correcta
const API_URL = 'https://api.infraexpert.cl/api';

console.log('🎯 [API] URL configurada:', API_URL);
console.log('🔧 [API] Entorno:', import.meta.env.MODE);
console.log('🔧 [API] VITE_API_URL:', import.meta.env.VITE_API_URL);

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000, // 60 segundos para uploads
});

// ✅ DEBUG MEJORADO: Obtener token de la estructura de Zustand
const obtenerToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    
    if (!authStorage) {
      console.warn('⚠️ [API] No hay auth-storage en localStorage');
      return null;
    }

    const authState = JSON.parse(authStorage);
    
    // ✅ CORRECCIÓN: Zustand guarda el estado en authState.state
    const token = authState?.state?.token;
    
    if (token) {
      console.log('🔐 [API] Token encontrado, longitud:', token.length);
    } else {
      console.warn('⚠️ [API] Token NO encontrado en authState');
    }
    
    return token || null;
  } catch (error) {
    console.error('❌ [obtenerToken] Error:', error);
    return null;
  }
};

// ✅ INTERCEPTOR DE REQUEST CON DEBUG COMPLETO
api.interceptors.request.use(
  (config) => {
    const token = obtenerToken();
    
    console.group('🚀 [API Request]');
    console.log('📋 URL:', config.url);
    console.log('🔧 Método:', config.method?.toUpperCase());
    console.log('🔐 Token presente:', !!token);
    console.log('📦 Es FormData:', config.data instanceof FormData);
    console.log('🌐 Headers iniciales:', config.headers);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Header Authorization agregado');
    }
    
    // ✅ CRÍTICO: Manejo especial para FormData
    if (config.data instanceof FormData) {
      console.log('📤 Detalle FormData:');
      
      // Mostrar contenido del FormData (solo en desarrollo)
      if (import.meta.env.DEV) {
        for (let pair of config.data.entries()) {
          const key = pair[0];
          const value = pair[1];
          
          if (value instanceof File) {
            console.log(`  📄 ${key}: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)} MB, ${value.type})`);
          } else if (value instanceof Blob) {
            console.log(`  📦 ${key}: Blob (${(value.size / 1024).toFixed(2)} KB, ${value.type})`);
          } else {
            console.log(`  📝 ${key}:`, value);
          }
        }
      }
      
      // ✅ ELIMINAR Content-Type - DEJAR que el navegador lo establezca
      delete config.headers['Content-Type'];
      console.log('✅ Content-Type eliminado (será establecido por el navegador)');
      
      // ✅ IMPORTANTE: También verificar otros headers problemáticos
      if (config.headers['Content-Type']) {
        console.warn('⚠️ Content-Type todavía presente después de delete');
      }
    }
    
    console.log('🔧 Headers finales:', config.headers);
    console.groupEnd();
    
    return config;
  },
  (error) => {
    console.error('❌ [API Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR DE RESPONSE CON DEBUG MEJORADO
api.interceptors.response.use(
  (response) => {
    console.group('✅ [API Response]');
    console.log('📋 URL:', response.config.url);
    console.log('🔧 Método:', response.config.method?.toUpperCase());
    console.log('🎯 Status:', response.status);
    console.log('📦 Data:', response.data);
    console.log('🔧 Headers de respuesta:', response.headers);
    console.groupEnd();
    
    return response;
  },
  (error) => {
    console.group('❌ [API Response Error]');
    console.log('📋 URL:', error.config?.url);
    console.log('🔧 Método:', error.config?.method?.toUpperCase());
    console.log('🎯 Status:', error.response?.status);
    console.log('📝 Status Text:', error.response?.statusText);
    console.log('📦 Data:', error.response?.data);
    console.log('🔧 Headers:', error.response?.headers);
    
    // ✅ INSPECCIÓN ESPECIAL PARA CORS
    if (error.message?.includes('CORS') || error.message?.includes('Access-Control')) {
      console.error('🚨 ERROR CORS DETECTADO');
      console.log('🌐 Origin del request:', window.location.origin);
      console.log('🔧 Headers de request enviados:', error.config?.headers);
    }
    
    if (error.response?.status === 401) {
      console.warn('🔐 Token expirado o inválido');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    console.groupEnd();
    return Promise.reject(error);
  }
);

// ✅ NUEVO: Función helper para subida de archivos con progreso
export const uploadWithProgress = (url, formData, onProgress) => {
  console.log('📤 [uploadWithProgress] Iniciando upload con progreso');
  
  return api.post(url, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`📊 Progreso upload: ${percentCompleted}%`);
        onProgress(percentCompleted);
      }
    },
    timeout: 300000, // 5 minutos para uploads muy grandes
  });
};

// ✅ NUEVO: Función para testear CORS manualmente
export const testCorsConnection = async () => {
  console.log('🌐 [testCorsConnection] Probando conexión CORS...');
  
  try {
    // Prueba simple sin axios
    const response = await fetch(`${API_URL}/incidencias/test/cors`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('🌐 Test fetch directo:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    return await response.json();
  } catch (fetchError) {
    console.error('❌ Error en test fetch directo:', fetchError);
    throw fetchError;
  }
};