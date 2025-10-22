import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

// ✅ Cache en memoria (mismo patrón que auth)
let dashboardCache = {
  completo: null,
  lastFetch: null,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
};

export const useDashboardStore = create((set, get) => ({
  // ✅ ESTADO EXISTENTE (mantener compatibilidad)
  metricas: null,
  ultimosDatos: [],
  plantasConDatos: [],
  loading: false,
  error: null,

  // ✅ NUEVO ESTADO PARA DATOS CONSOLIDADOS
  datosCompletos: null,
  fromCache: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // ✅ MÉTODO EXISTENTE (mantener para compatibilidad)
  obtenerMetricas: async () => {
    set({ loading: true, error: null });
    try {
      const [metricasResponse, datosResponse, plantasResponse] = await Promise.all([
        dashboardService.obtenerMetricas(),
        dashboardService.obtenerUltimosDatos(),
        dashboardService.obtenerPlantasConDatos()
      ]);

      set({
        metricas: metricasResponse,
        ultimosDatos: datosResponse.datos || [],
        plantasConDatos: plantasResponse.plantas || [],
        loading: false
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar métricas', 
        loading: false 
      });
    }
  },

  // ✅ NUEVO MÉTODO OPTIMIZADO
  obtenerDashboardCompleto: async () => {
    // ✅ PRIMERO VERIFICAR CACHE
    if (dashboardCache.completo && dashboardCache.lastFetch && 
        (Date.now() - dashboardCache.lastFetch) < dashboardCache.CACHE_TTL) {
      console.log('✅ [DASHBOARD STORE] Usando cache');
      set({ 
        datosCompletos: dashboardCache.completo,
        fromCache: true,
        loading: false 
      });
      return;
    }

    set({ loading: true, error: null, fromCache: false });
    
    try {
      console.log('🔄 [DASHBOARD STORE] Llamando al backend...');
      const response = await dashboardService.obtenerDashboardCompleto();
      
      // ✅ ACTUALIZAR CACHE
      dashboardCache.completo = response;
      dashboardCache.lastFetch = Date.now();

      set({
        datosCompletos: response,
        loading: false,
        fromCache: response.fromCache || false
      });

      console.log('✅ [DASHBOARD STORE] Datos completos cargados');
    } catch (error) {
      console.error('❌ [DASHBOARD STORE] Error:', error);
      set({ 
        error: error.response?.data?.message || 'Error al cargar dashboard completo', 
        loading: false 
      });
    }
  },

  // ✅ MÉTODO PARA INVALIDAR CACHE
  invalidarCache: () => {
    dashboardCache.completo = null;
    dashboardCache.lastFetch = null;
    console.log('🔄 [DASHBOARD STORE] Cache invalidado');
  },

  // ✅ MÉTODO EXISTENTE (mantener)
  obtenerUltimosDatos: async () => {
    try {
      const response = await dashboardService.obtenerUltimosDatos();
      set({ ultimosDatos: response.datos || [] });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cargar datos' });
      throw error;
    }
  }
}));