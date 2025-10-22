import { api } from './api';

export const dashboardService = {
  // ✅ MANTENER endpoints existentes (compatibilidad)
  obtenerMetricas: async () => {
    const response = await api.get('/api/dashboard/metricas');
    return response.data;
  },

  obtenerUltimosDatos: async () => {
    const response = await api.get('/api/datos-planta/ultimos');
    return response.data;
  },

  obtenerEstadisticasIncidencias: async () => {
    const response = await api.get('/api/incidencias/estadisticas');
    return response.data;
  },

  obtenerPlantasConDatos: async () => {
    const response = await api.get('/api/plantas?limite=50');
    return response.data;
  },

  // ✅ NUEVO endpoint consolidado
  obtenerDashboardCompleto: async () => {
    const response = await api.get('/api/dashboard/completo');
    return response.data;
  }
};