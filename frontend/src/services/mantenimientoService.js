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

  // ✅ NUEVO: Obtener mantenimiento COMPLETO con fotos y materiales
  obtenerMantenimientoCompleto: async (id) => {
    const response = await api.get(`/api/mantenimientos/${id}/completo`);
    return response.data;
  },

crearMantenimiento: async (data) => {
    // Determinar si es FormData o objeto normal
    const isFormData = data instanceof FormData;
    
    const config = isFormData ? {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    } : {};

    const response = await api.post('/api/mantenimientos', data, config);
    return response.data;
},
  actualizarMantenimiento: async (id, mantenimientoData) => {
    const response = await api.put(`/api/mantenimientos/${id}`, mantenimientoData);
    return response.data;
  },

  cambiarEstadoMantenimiento: async (id, estado) => {
    const response = await api.patch(`/api/mantenimientos/${id}/estado`, { estado });
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

  // ✅ NUEVO: Obtener resumen para dashboard
  obtenerResumenDashboard: async () => {
    const response = await api.get('/api/mantenimientos/resumen/dashboard');
    return response.data;
  },

iniciarMantenimiento: async (id, formData) => {
    const response = await api.post(`/api/mantenimientos/${id}/iniciar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
},

  // ✅ NUEVO: Completar mantenimiento con fotos, materiales y checklist
completarMantenimiento: async (id, formData) => {
    const response = await api.post(`/api/mantenimientos/${id}/completar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
},
  // ✅ NUEVO: Subir fotos a mantenimiento
  subirFotos: async (id, fotos, tipo) => {
    const formData = new FormData();
    formData.append('tipo', tipo);
    
    fotos.forEach((foto) => {
      formData.append('fotos', foto);
    });

    const response = await api.post(`/api/mantenimientos/${id}/fotos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ✅ NUEVO: Agregar materiales a mantenimiento
  agregarMateriales: async (id, materiales) => {
    const response = await api.post(`/api/mantenimientos/${id}/materiales`, { materiales });
    return response.data;
  },

  // ✅ NUEVO: Generar reporte PDF
  generarReportePDF: async (id) => {
    const response = await api.get(`/api/mantenimientos/${id}/reporte-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ✅ NUEVO: Eliminar foto
  eliminarFoto: async (id, fotoId) => {
    const response = await api.delete(`/api/mantenimientos/${id}/fotos/${fotoId}`);
    return response.data;
  },

  // ✅ NUEVO: Eliminar material
  eliminarMaterial: async (id, materialId) => {
    const response = await api.delete(`/api/mantenimientos/${id}/materiales/${materialId}`);
    return response.data;
  },

  // Checklist
  obtenerChecklistMantenimiento: async (mantenimientoId) => {
    const response = await api.get(`/api/mantenimientos/${mantenimientoId}/checklist`);
    return response.data;
  },

  agregarItemChecklist: async (mantenimientoId, item) => {
    const response = await api.post(`/api/mantenimientos/${mantenimientoId}/checklist`, { item });
    return response.data;
  },

  actualizarItemChecklist: async (itemId, itemData) => {
    const response = await api.put(`/api/mantenimientos/checklist/${itemId}`, itemData);
    return response.data;
  },

  eliminarChecklist: async (mantenimientoId, checklistId) => {
    const response = await api.delete(`/api/mantenimientos/${mantenimientoId}/checklist/${checklistId}`);
    return response.data;
  },

  // Reportes (mantener existentes)
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
    const response = await api.get(`/api/reportes/planta/${plantId}`);
    return response.data;
  },

  descargarReporte: async (rutaArchivo) => {
    const response = await api.get(`/api/reportes/descargar/${encodeURIComponent(rutaArchivo)}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};