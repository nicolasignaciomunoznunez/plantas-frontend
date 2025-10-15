// stores/authStore.js - EXTENDIDA CON PERFIL
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (userData, authToken) => {
        console.log('', { 
          userData, 
          tieneRol: !!userData?.rol,
          rol: userData?.rol 
        });
        
        set({ 
          user: userData, 
          token: authToken, 
          isAuthenticated: true,
          isLoading: false 
        });
        
     
      },

      logout: () => {
        console.log('');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      setLoading: (loading) => {
        
        set({ isLoading: loading });
      },

      updateUser: (userData) => {
  
        set({ user: { ...get().user, ...userData } });
      },

      tieneRol: (roles) => {
        const { user } = get();
        if (!user || !user.rol) return false;
        return Array.isArray(roles) ? roles.includes(user.rol) : user.rol === roles;
      },

      // ✅ NUEVAS ACCIONES PARA PERFIL
    actualizarPerfil: async (datosPerfil) => {
        set({ loading: true, error: null });
        try {
          
          
          const response = await authService.actualizarPerfil(datosPerfil);
          
          if (response.success) {
            const { user } = get();
            const usuarioActualizado = { ...user, ...response.usuario };
            
            set({ 
              user: usuarioActualizado, 
              loading: false 
            });
            
           
            return { 
              success: true, 
              message: response.message,
              usuario: usuarioActualizado 
            };
          } else {
            set({ 
              error: response.message, 
              loading: false 
            });
            return { 
              success: false, 
              message: response.message 
            };
          }
        } catch (error) {
          console.error('❌ [AUTH STORE] Error actualizando perfil:', error);
          const errorMessage = error.response?.data?.message || 'Error de conexión al actualizar perfil';
          set({ 
            error: errorMessage, 
            loading: false 
          });
          return { 
            success: false, 
            message: errorMessage 
          };
        }
      },

  cambiarContraseña: async (datosContraseña) => {
  set({ loading: true, error: null });
  try {
    
    
    const response = await authService.cambiarContraseña(datosContraseña);
    
    
    
    set({ loading: false, error: null });
    return response;
  } catch (error) {
    console.error('❌ [AUTH STORE] Error completo cambiar contraseña:', error);
    
    // ✅ MOSTRAR EL MENSAJE ESPECÍFICO DEL BACKEND
    const backendMessage = error.response?.data?.message;
    console.error('❌ [AUTH STORE] Mensaje del backend:', backendMessage);
    
    const errorMessage = backendMessage || 'Error de conexión al cambiar contraseña';
    set({ 
      error: errorMessage, 
      loading: false 
    });
    return { 
      success: false, 
      message: errorMessage 
    };
  }
},
      // ✅ Obtener perfil fresco del servidor
   obtenerPerfilActualizado: async () => {
  set({ loading: true, error: null });
  try {
   
    
    const response = await authService.getProfile();
    
    if (response.success) {
      // ✅ GUARDAR TODOS LOS CAMPOS EN EL STORE
      set({ 
        user: response.usuario, 
        loading: false 
      });
    
      return { 
        success: true, 
        usuario: response.usuario 
      };
    } else {
      set({ 
        error: response.message, 
        loading: false 
      });
      return { 
        success: false, 
        message: response.message 
      };
    }
  } catch (error) {
    console.error('❌ [AUTH STORE] Error obteniendo perfil:', error);
    const errorMessage = error.response?.data?.message || 'Error de conexión al obtener perfil';
    set({ 
      error: errorMessage, 
      loading: false 
    });
    return { 
      success: false, 
      message: errorMessage 
    };
  }
}
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
       
        return (state) => {
          console.log('', state);
        };
      }
    }
  )
);