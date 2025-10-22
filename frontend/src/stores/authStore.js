// stores/authStore.js - EXTENDIDA CON PERFIL
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { getAuthCache, updateAuthCache, clearAuthCache } from '../utils/cache';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: (userData, authToken) => {
        console.log('✅ [AUTH STORE] Login ejecutado', { 
          userData, 
          tieneRol: !!userData?.rol,
          rol: userData?.rol 
        });
        
        // ✅ SINCRONIZAR CACHE
        updateAuthCache(userData);
        
        set({ 
          user: userData, 
          token: authToken, 
          isAuthenticated: true,
          isLoading: false,
          error: null 
        });
      },

      logout: () => {
        console.log('✅ [AUTH STORE] Logout ejecutado');
        
        // ✅ LIMPIAR CACHE
        clearAuthCache();
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false,
          error: null 
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        
        // ✅ SINCRONIZAR CACHE
        updateAuthCache(updatedUser);
        
        set({ user: updatedUser });
      },

      tieneRol: (roles) => {
        const { user } = get();
        if (!user || !user.rol) return false;
        return Array.isArray(roles) ? roles.includes(user.rol) : user.rol === roles;
      },

      // ✅ NUEVAS ACCIONES PARA PERFIL
      actualizarPerfil: async (datosPerfil) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.actualizarPerfil(datosPerfil);
          
          if (response.success) {
            const { user } = get();
            const usuarioActualizado = { ...user, ...response.usuario };
            
            // ✅ SINCRONIZAR CACHE
            updateAuthCache(usuarioActualizado);
            
            set({ 
              user: usuarioActualizado, 
              isLoading: false 
            });
            
            return { 
              success: true, 
              message: response.message,
              usuario: usuarioActualizado 
            };
          } else {
            set({ 
              error: response.message, 
              isLoading: false 
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
            isLoading: false 
          });
          return { 
            success: false, 
            message: errorMessage 
          };
        }
      },

      cambiarContraseña: async (datosContraseña) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.cambiarContraseña(datosContraseña);
          
          set({ isLoading: false, error: null });
          return response;
        } catch (error) {
          console.error('❌ [AUTH STORE] Error completo cambiar contraseña:', error);
          
          const backendMessage = error.response?.data?.message;
          const errorMessage = backendMessage || 'Error de conexión al cambiar contraseña';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          return { 
            success: false, 
            message: errorMessage 
          };
        }
      },

      // ✅ Obtener perfil fresco del servidor
      obtenerPerfilActualizado: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.getProfile();
          
          if (response.success) {
            // ✅ SINCRONIZAR CACHE
            updateAuthCache(response.usuario);
            
            set({ 
              user: response.usuario, 
              isLoading: false 
            });
            
            return { 
              success: true, 
              usuario: response.usuario 
            };
          } else {
            set({ 
              error: response.message, 
              isLoading: false 
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
            isLoading: false 
          });
          return { 
            success: false, 
            message: errorMessage 
          };
        }
      },

      // ✅ NUEVA FUNCIÓN: Sincronizar desde cache
      syncFromCache: () => {
        const cachedUser = getAuthCache();
        if (cachedUser) {
          console.log('✅ [AUTH STORE] Sincronizando desde cache');
          set({ 
            user: cachedUser, 
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        console.log('🔄 [AUTH STORE] Iniciando rehidratación...');
        
        return (state) => {
          if (state) {
            console.log('✅ [AUTH STORE] Rehidratación completada', { 
              user: state.user?.email,
              isAuthenticated: state.isAuthenticated 
            });
            
            // ✅ SINCRONIZAR CACHE CON STORE PERSISTIDO
            if (state.user && state.isAuthenticated) {
              updateAuthCache(state.user);
            }
          }
        };
      }
    }
  )
);