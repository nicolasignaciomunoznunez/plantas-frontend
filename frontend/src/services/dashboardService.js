import { api } from './api';

export const dashboardService = {
  // ✅ MANTENER endpoints existentes (compatibilidad)
  obtenerMetricas: async () => {
    const response = await api.get('/dashboard/metricas');
    return response.data;
  },

  obtenerUltimosDatos: async () => {
    const response = await api.get('/datos-planta/ultimos');
    return response.data;
  },

  obtenerEstadisticasIncidencias: async () => {
    const response = await api.get('/incidencias/estadisticas');
    return response.data;
  },

  obtenerPlantasConDatos: async () => {
    const response = await api.get('/plantas?limite=50');
    return response.data;
  },

  // ✅ NUEVO endpoint consolidado
  obtenerDashboardCompleto: async () => {
    const response = await api.get('/dashboard/completo');
    return response.data;
  }
};