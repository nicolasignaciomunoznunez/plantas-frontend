// incidenciasService.js - VERSIÓN PRODUCCIÓN
import { api } from './api';

// Helper para logs condicionales
const log = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

const incidenciasService = {
  // Obtener todas las incidencias
  obtenerIncidencias: async (limite = 10, pagina = 1) => {
    log('🔍 [Service] Obteniendo incidencias');
    const response = await api.get(`/incidencias?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener incidencia por ID
  obtenerIncidencia: async (id) => {
    log('🔍 [Service] Obteniendo incidencia:', id);
    const response = await api.get(`/incidencias/${id}`);
    return response.data;
  },

  // Obtener incidencia completa
  obtenerIncidenciaCompleta: async (id) => {
    log('🔍 [Service] Obteniendo incidencia completa:', id);
    const response = await api.get(`/incidencias/${id}/completa`);
    return response.data;
  },

  // Crear nueva incidencia
  crearIncidencia: async (incidenciaData) => {
    log('➕ [Service] Creando incidencia');
    const response = await api.post('/incidencias', incidenciaData);
    return response.data;
  },

  // Actualizar incidencia
  actualizarIncidencia: async (id, incidenciaData) => {
    log('✏️ [Service] Actualizando incidencia:', id);
    const response = await api.put(`/incidencias/${id}`, incidenciaData);
    return response.data;
  },

  // Cambiar estado
  cambiarEstadoIncidencia: async (id, estado) => {
    log('🔄 [Service] Cambiando estado:', { id, estado });
    const response = await api.patch(`/incidencias/${id}/estado`, { estado });
    return response.data;
  },

  // Completar incidencia
  completarIncidencia: async (id, datosCompletar) => {
    log('✅ [Service] Completando incidencia:', id);
    const response = await api.put(`/incidencias/${id}/completar`, datosCompletar);
    return response.data;
  },

  // ✅ CORREGIDO: Subir fotos - SIN HEADERS
  subirFotos: async (id, fotos, tipo) => {
    if (import.meta.env.DEV) {
      console.group('📤 [Service] Subida de fotos');
      console.log('📋 Datos:', { incidenciaId: id, tipo, cantidad: fotos.length });
    }
    
    const formData = new FormData();
    formData.append('tipo', tipo);
    
    fotos.forEach((foto) => {
      formData.append('fotos', foto);
    });
    
    try {
      const response = await api.post(`/incidencias/${id}/fotos`, formData, {
        timeout: 120000
      });
      
      if (import.meta.env.DEV) {
        console.log('✅ [Service] Fotos subidas exitosamente');
        console.groupEnd();
      }
      
      return response.data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ [Service] Error subiendo fotos:', error.message);
        console.groupEnd();
      }
      throw error;
    }
  },

  // Agregar materiales
  agregarMateriales: async (id, materiales) => {
    log('🔧 [Service] Agregando materiales');
    const response = await api.post(`/incidencias/${id}/materiales`, { materiales });
    return response.data;
  },

  // Generar reporte PDF
  generarReportePDF: async (id) => {
    log('📄 [Service] Generando reporte PDF');
    const response = await api.get(`/incidencias/${id}/reporte-pdf`, {
      responseType: 'blob',
      timeout: 60000
    });
    return response.data;
  },

  // Eliminar foto
  eliminarFoto: async (id, fotoId) => {
    log('🗑️ [Service] Eliminando foto');
    const response = await api.delete(`/incidencias/${id}/fotos/${fotoId}`);
    return response.data;
  },

  // Eliminar material
  eliminarMaterial: async (id, materialId) => {
    log('🗑️ [Service] Eliminando material');
    const response = await api.delete(`/incidencias/${id}/materiales/${materialId}`);
    return response.data;
  },

  // Eliminar incidencia
  eliminarIncidencia: async (id) => {
    log('🗑️ [Service] Eliminando incidencia');
    const response = await api.delete(`/incidencias/${id}`);
    return response.data;
  },

  // Obtener por planta
  obtenerIncidenciasPlanta: async (plantId) => {
    log('🏭 [Service] Obteniendo incidencias de planta');
    const response = await api.get(`/incidencias/planta/${plantId}`);
    return response.data;
  },

  // Obtener por estado
  obtenerIncidenciasEstado: async (estado) => {
    log('🏷️ [Service] Obteniendo incidencias por estado');
    const response = await api.get(`/incidencias/estado/${estado}`);
    return response.data;
  },

  // Obtener resumen dashboard
  obtenerResumenDashboard: async () => {
    log('📊 [Service] Obteniendo resumen dashboard');
    const response = await api.get('/incidencias/resumen/dashboard');
    return response.data;
  }
};

export { incidenciasService };