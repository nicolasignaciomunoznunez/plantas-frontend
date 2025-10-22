// services/authService.js - VERSIÓN CORREGIDA
import { api } from './api';
import { getAuthCache, updateAuthCache, clearAuthCache } from '../App'; // ✅ Importar desde App

export const authService = {
  // Login con debug
  login: async (email, password) => {
    const response = await api.post('/api/auth/iniciar-sesion', {
      email,
      password,
    });

    // ✅ ACTUALIZAR CACHE AL LOGIN
    if (response.data.success && response.data.usuario) {
      updateAuthCache(response.data.usuario);
    }

    return response.data;
  },

  // Registro
  register: async (userData) => {
    const response = await api.post('/api/auth/registrar', userData);
    return response.data;
  },

  // Verificar autenticación - VERSIÓN MEJORADA CON CACHE
  checkAuth: async () => {
    try {
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
      const response = await api.get('/api/auth/verificar-autenticacion');

      // ✅ GUARDAR EN CACHE SI ES EXITOSO
      if (response.data.success && response.data.usuario) {
        updateAuthCache(response.data.usuario);
      }

      return response.data;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Error en checkAuth:', error);
      // ⚠️ IMPORTANTE: Si hay error, retornamos success: false
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de autenticación' 
      };
    }
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/api/auth/perfil');
    
    // ✅ ACTUALIZAR CACHE CON PERFIL ACTUALIZADO
    if (response.data) {
      updateAuthCache(response.data);
    }
    
    return response.data;
  },

  // Olvidé contraseña
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/olvide-contraseña', { email });
    return response.data;
  },

  // Resetear contraseña
  resetPassword: async (token, password) => {
    const response = await api.post(`/api/auth/restablecer-contraseña/${token}`, {
      password,
    });
    return response.data;
  },

  // Verificar email
  verifyEmail: async (code) => {
    const response = await api.post('/api/auth/verificar-email', {
      code,
    });
    return response.data;
  },

  // Actualizar perfil
  actualizarPerfil: async (datosPerfil) => {
    const response = await api.put('/api/auth/perfil', datosPerfil);

    // ✅ ACTUALIZAR CACHE CON NUEVOS DATOS
    if (response.data) {
      updateAuthCache(response.data);
    }

    return response.data;
  },

  // Cambiar contraseña
  cambiarContraseña: async (datosContraseña) => {
    const response = await api.post('/api/auth/cambiar-password', datosContraseña);
    return response.data;
  },

  // Obtener todos los usuarios (para superadmin/admin)
  obtenerUsuarios: async () => {
    const response = await api.get('/api/auth/usuarios');
    return response.data;
  },

  // Actualizar rol de usuario
  actualizarRolUsuario: async (usuarioId, nuevoRol) => {
    const response = await api.put(`/api/auth/usuarios/${usuarioId}/rol`, { nuevoRol });
    return response.data;
  },

  // ✅ Cerrar sesión CON LIMPIEZA DE CACHE
  logout: async () => {
    try {
      const response = await api.post('/api/auth/cerrar-sesion');
      
      // ✅ LIMPIAR CACHE AL LOGOUT
      clearAuthCache();
      
      console.log('✅ [AUTH SERVICE] Logout exitoso, cache limpiado');
      return response.data;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Error en logout:', error);
      
      // ✅ LIMPIAR CACHE INCLUSO SI HAY ERROR
      clearAuthCache();
      
      throw error;
    }
  },

  // ✅ Funciones de cache para uso externo
  clearAuthCache,
  updateAuthCache,
  getAuthCache
};