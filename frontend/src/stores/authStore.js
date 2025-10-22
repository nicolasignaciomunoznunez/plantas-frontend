// stores/authStore.js - VERSIÓN CORREGIDA
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

// ✅ Cache local dentro del mismo archivo (solución temporal)
let authCache = {
  user: null,
  lastCheck: null,
  CACHE_TTL: 10 * 60 * 1000, // 10 minutos
};

// ✅ Funciones de cache locales
const clearAuthCache = () => {
  authCache.user = null;
  authCache.lastCheck = null;
  console.log('✅ [AUTH STORE] Cache limpiado');
};

const updateAuthCache = (userData) => {
  authCache.user = userData;
  authCache.lastCheck = Date.now();
  console.log('✅ [AUTH STORE] Cache actualizado');
};

const getAuthCache = () => {
  if (authCache.user && authCache.lastCheck && 
      (Date.now() - authCache.lastCheck) < authCache.CACHE_TTL) {
    return authCache.user;
  }
  return null;
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // ✅ LOGIN OPTIMIZADO - SINCRONIZA CACHE + STORE
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