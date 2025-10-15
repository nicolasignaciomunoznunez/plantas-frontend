import { api } from './api';

export const authService = {
  // Login con debug
  login: async (email, password) => {

    const response = await api.post('/api/auth/iniciar-sesion', {
      email,
      password,
    });

    return response.data;
  },

  // Registro
  register: async (userData) => {
    const response = await api.post('/api/auth/registrar', userData);
    return response.data;
  },

  // Verificar autenticación
    // Verificar autenticación - VERSIÓN MEJORADA
  checkAuth: async () => {
    try {

      const response = await api.get('/api/auth/verificar-autenticacion');

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

  // Cerrar sesión
  logout: async () => {
    const response = await api.post('/api/auth/cerrar-sesion');
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

  return response.data;
},

// Cambiar contraseña
cambiarContraseña: async (datosContraseña) => {

  const response = await api.post('/api/auth/cambiar-password', datosContraseña);

  return response.data;
},

};