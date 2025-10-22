// stores/authStore.js - VERSIÓN OPTIMIZADA
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, updateAuthCache, clearAuthCache, getAuthCache } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // ✅ LOGIN OPTIMIZADO - SINCRONIZA CACHE + STORE + PERSISTENCE
      login: (userData, authToken) => {
        console.log('✅ [AUTH STORE] Login ejecutado', { 
          userData, 
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

      // ✅ LOGOUT OPTIMIZADO - LIMPIA TODO
      logout: async () => {
        console.log('✅ [AUTH STORE] Logout ejecutado');
        
        try {
          // Llamar al backend para logout
          await authService.logout();
        } catch (error) {
          console.log('⚠️ [AUTH STORE] Error en logout backend, continuando...');
        } finally {
          // ✅ LIMPIAR CACHE Y STORE SIEMPRE
          clearAuthCache();
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false,
            error: null 
          });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // ✅ UPDATE USER SINCRONIZADO
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

      // ✅ ACTUALIZAR PERFIL OPTIMIZADO
      actualizarPerfil: async (datosPerfil) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 [AUTH STORE] Actualizando perfil...');
          
          const response = await authService.actualizarPerfil(datosPerfil);
          
          if (response.success) {
            const { user } = get();
            const usuarioActualizado = { ...user, ...response.usuario };
            
            // ✅ SINCRONIZAR CACHE
            updateAuthCache(usuarioActualizado);
            
            set({ 
              user: usuarioActualizado, 
              isLoading: false,
              error: null 
            });
            
            console.log('✅ [AUTH STORE] Perfil actualizado exitosamente');
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

      // ✅ CAMBIAR CONTRASEÑA OPTIMIZADO
      cambiarContraseña: async (datosContraseña) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 [AUTH STORE] Cambiando contraseña...');
          
          const response = await authService.cambiarContraseña(datosContraseña);
          
          set({ isLoading: false, error: null });
          return response;
        } catch (error) {
          console.error('❌ [AUTH STORE] Error cambiar contraseña:', error);
          
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

      // ✅ OBTENER PERFIL ACTUALIZADO OPTIMIZADO
      obtenerPerfilActualizado: async () => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 [AUTH STORE] Obteniendo perfil actualizado...');
          
          const response = await authService.getProfile();
          
          if (response.success) {
            // ✅ SINCRONIZAR CACHE Y STORE
            updateAuthCache(response.usuario);
            
            set({ 
              user: response.usuario, 
              isLoading: false,
              error: null 
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

      // ✅ NUEVA FUNCIÓN: Sincronizar desde cache (para App.jsx)
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