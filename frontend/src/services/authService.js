// src/services/authService.js - VERSIÓN FINAL CORREGIDA
import { api } from './api';
import { getAuthCache, updateAuthCache, clearAuthCache } from '../utils/cache';

export const authService = {
  // Login
  login: async (email, password) => {
    console.log('🔐 [AUTH SERVICE] Iniciando sesión...');
    
    const response = await api.post('/auth/iniciar-sesion', {
      email,
      password,
    });

    console.log('📥 [AUTH SERVICE] Respuesta login:', response.data);

    // ✅ ACTUALIZAR CACHE AL LOGIN
    if (response.data.success && response.data.usuario) {
      updateAuthCache(response.data.usuario);
      console.log('✅ [AUTH SERVICE] Cache actualizado después de login');
    }

    return response.data;
  },

  // Registro
  register: async (userData) => {
    console.log('👤 [AUTH SERVICE] Registrando usuario...');
    
    const response = await api.post('/auth/registrar', userData);
    
    console.log('📥 [AUTH SERVICE] Respuesta registro:', response.data);
    
    return response.data;
  },

  // Verificar autenticación - VERSIÓN MEJORADA CON CACHE
  checkAuth: async () => {
    try {
      console.log('🔍 [AUTH SERVICE] Verificando autenticación...');
      
      // ✅ PRIMERO VERIFICAR CACHE
      const cachedUser = getAuthCache();
      if (cachedUser) {
        console.log('✅ [AUTH SERVICE] Usando cache para checkAuth');
        return { 
          success: true, 
          usuario: cachedUser,
          fromCache: true 
        };
      }

      console.log('🔐 [AUTH SERVICE] Llamando al backend para checkAuth');
      
      // ✅ RUTA CORREGIDA: sin /api duplicado
      const response = await api.get('/auth/verificar-autenticacion');
      
      console.log('📥 [AUTH SERVICE] Respuesta del backend:', response.data);

      // ✅ GUARDAR EN CACHE SI ES EXITOSO
      if (response.data.success && response.data.usuario) {
        updateAuthCache(response.data.usuario);
        console.log('✅ [AUTH SERVICE] Cache actualizado con datos del backend');
      }

      return response.data;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Error en checkAuth:', error);
      
      // Log detallado del error
      if (error.response) {
        console.error('📊 Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('🌐 Error request:', error.request);
      } else {
        console.error('⚙️ Error config:', error.config);
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de autenticación',
        error: error.message
      };
    }
  },

  // Obtener perfil
  getProfile: async () => {
    console.log('👤 [AUTH SERVICE] Obteniendo perfil...');
    
    const response = await api.get('/auth/perfil');
    
    console.log('📥 [AUTH SERVICE] Respuesta perfil:', response.data);
    
    // ✅ ACTUALIZAR CACHE CON PERFIL ACTUALIZADO
    if (response.data) {
      updateAuthCache(response.data);
    }
    
    return response.data;
  },

  // Olvidé contraseña
  forgotPassword: async (email) => {
    console.log('🔑 [AUTH SERVICE] Solicitando recuperación de contraseña...');
    
    const response = await api.post('/auth/olvide-contraseña', { email });
    
    console.log('📥 [AUTH SERVICE] Respuesta recuperación:', response.data);
    
    return response.data;
  },

  // Resetear contraseña
  resetPassword: async (token, password) => {
    console.log('🔄 [AUTH SERVICE] Restableciendo contraseña...');
    
    const response = await api.post(`/auth/restablecer-contraseña/${token}`, {
      password,
    });
    
    console.log('📥 [AUTH SERVICE] Respuesta restablecimiento:', response.data);
    
    return response.data;
  },

  // Verificar email
  verifyEmail: async (code) => {
    console.log('📧 [AUTH SERVICE] Verificando email...');
    
    const response = await api.post('/auth/verificar-email', {
      code,
    });
    
    console.log('📥 [AUTH SERVICE] Respuesta verificación email:', response.data);
    
    return response.data;
  },

  // Actualizar perfil
  actualizarPerfil: async (datosPerfil) => {
    console.log('✏️ [AUTH SERVICE] Actualizando perfil...');
    
    const response = await api.put('/auth/perfil', datosPerfil);

    console.log('📥 [AUTH SERVICE] Respuesta actualización:', response.data);

    // ✅ ACTUALIZAR CACHE CON NUEVOS DATOS
    if (response.data) {
      updateAuthCache(response.data);
      console.log('✅ [AUTH SERVICE] Cache actualizado con nuevo perfil');
    }

    return response.data;
  },

  // Cambiar contraseña
  cambiarContraseña: async (datosContraseña) => {
    console.log('🔐 [AUTH SERVICE] Cambiando contraseña...');
    
    const response = await api.post('/auth/cambiar-password', datosContraseña);
    
    console.log('📥 [AUTH SERVICE] Respuesta cambio contraseña:', response.data);
    
    return response.data;
  },

  // Obtener todos los usuarios (para superadmin/admin)
  obtenerUsuarios: async () => {
    console.log('👥 [AUTH SERVICE] Obteniendo lista de usuarios...');
    
    const response = await api.get('/auth/usuarios');
    
    console.log('📥 [AUTH SERVICE] Respuesta usuarios:', response.data);
    
    return response.data;
  },

  // Actualizar rol de usuario
  actualizarRolUsuario: async (usuarioId, nuevoRol) => {
    console.log('👑 [AUTH SERVICE] Actualizando rol de usuario:', usuarioId);
    
    const response = await api.put(`/auth/usuarios/${usuarioId}/rol`, { nuevoRol });
    
    console.log('📥 [AUTH SERVICE] Respuesta actualización rol:', response.data);
    
    return response.data;
  },

  // ✅ Cerrar sesión CON LIMPIEZA DE CACHE
  logout: async () => {
    try {
      console.log('🚪 [AUTH SERVICE] Cerrando sesión...');
      
      const response = await api.post('/auth/cerrar-sesion');
      
      // ✅ LIMPIAR CACHE AL LOGOUT
      clearAuthCache();
      
      console.log('✅ [AUTH SERVICE] Logout exitoso, cache limpiado');
      
      return response.data;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Error en logout:', error);
      
      // ✅ LIMPIAR CACHE INCLUSO SI HAY ERROR
      clearAuthCache();
      console.log('✅ [AUTH SERVICE] Cache limpiado a pesar del error');
      
      // Si es error de red o similar, devolvemos un objeto de éxito simulado
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        return { success: true, message: 'Sesión cerrada localmente' };
      }
      
      throw error;
    }
  },

  // ✅ MÉTODO ADICIONAL: Obtener token actual
  getCurrentToken: () => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        console.log('🔍 [getCurrentToken] No hay auth-storage en localStorage');
        return null;
      }
      
      const authState = JSON.parse(authStorage);
      const token = authState?.state?.token;
      
      console.log('🔑 [getCurrentToken] Token encontrado:', !!token);
      
      return token || null;
    } catch (error) {
      console.error('❌ [getCurrentToken] Error:', error);
      return null;
    }
  },

  // ✅ MÉTODO ADICIONAL: Verificar si usuario está autenticado (solo con cache)
  isAuthenticatedFromCache: () => {
    const cachedUser = getAuthCache();
    const token = authService.getCurrentToken();
    const isAuthenticated = !!(cachedUser && token);
    
    console.log('🔍 [isAuthenticatedFromCache]', {
      hasCache: !!cachedUser,
      hasToken: !!token,
      isAuthenticated
    });
    
    return isAuthenticated;
  },

  // ✅ MÉTODO ADICIONAL: Estado del cache
  getCacheStatus: () => {
    const cachedUser = getAuthCache();
    const token = authService.getCurrentToken();
    
    return {
      hasUserCache: !!cachedUser,
      hasToken: !!token,
      user: cachedUser,
      cacheValid: cachedUser !== null
    };
  }
};