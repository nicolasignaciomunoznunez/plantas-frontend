// services/mantenimientoService.js
import { api } from './api';

export const mantenimientoService = {
  // Mantenimientos
  obtenerMantenimientos: async (limite = 50, pagina = 1) => {
    const response = await api.get(`/api/mantenimientos?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  obtenerMantenimiento: async (id) => {
    const response = await api.get(`/api/mantenimientos/${id}`);
    return response.data;
  },

  crearMantenimiento: async (mantenimientoData) => {
    const response = await api.post('/api/mantenimientos', mantenimientoData);
    return response.data;
  },

  actualizarMantenimiento: async (id, mantenimientoData) => {
    const response = await api.put(`/api/mantenimientos/${id}`, mantenimientoData);
    return response.data;
  },

  eliminarMantenimiento: async (id) => {
    const response = await api.delete(`/api/mantenimientos/${id}`);
    return response.data;
  },

  obtenerMantenimientosPlanta: async (plantId) => {
    const response = await api.get(`/api/mantenimientos/planta/${plantId}`);
    return response.data;
  },

  // Checklist
  obtenerChecklistMantenimiento: async (mantenimientoId) => {
    const response = await api.get(`/api/mantenimientos/${mantenimientoId}/checklist`);
    return response.data;
  },

  crearChecklist: async (mantenimientoId, checklistData) => {
    const response = await api.post(`/api/mantenimientos/${mantenimientoId}/checklist`, checklistData);
    return response.data;
  },

  actualizarItemChecklist: async (mantenimientoId, checklistId, itemData) => {
    const response = await api.put(`/api/mantenimientos/${mantenimientoId}/checklist/${checklistId}`, itemData);
    return response.data;
  },

  eliminarChecklist: async (mantenimientoId, checklistId) => {
    const response = await api.delete(`/api/mantenimientos/${mantenimientoId}/checklist/${checklistId}`);
    return response.data;
  },

  // Reportes
  obtenerReportes: async (limite = 50, pagina = 1) => {
    const response = await api.get(`/api/reportes?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  obtenerReporte: async (id) => {
    const response = await api.get(`/api/reportes/${id}`);
    return response.data;
  },

  crearReporte: async (reporteData) => {
    const response = await api.post('/api/reportes', reporteData);
    return response.data;
  },

  eliminarReporte: async (id) => {
    const response = await api.delete(`/api/reportes/${id}`);
    return response.data;
  },

  obtenerReportesPlanta: async (plantId) => {
    const response = await api.get(`/reportes/planta/${plantId}`);
    return response.data;
  },

  // Descargar reporte
  descargarReporte: async (rutaArchivo) => {
    const response = await api.get(`/reportes/descargar/${encodeURIComponent(rutaArchivo)}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};