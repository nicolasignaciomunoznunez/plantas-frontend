// services/mantenimientoService.js
import { api } from './api';

export const mantenimientoService = {
  // Mantenimientos
  obtenerMantenimientos: async (limite = 50, pagina = 1) => {
    const response = await api.get(`/mantenimientos?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  obtenerMantenimiento: async (id) => {
    const response = await api.get(`/mantenimientos/${id}`);
    return response.data;
  },

  // ✅ NUEVO: Obtener mantenimiento COMPLETO con fotos y materiales
  obtenerMantenimientoCompleto: async (id) => {
    const response = await api.get(`/mantenimientos/${id}/completo`);
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

    const response = await api.post('/mantenimientos', data, config);
    return response.data;
},
  actualizarMantenimiento: async (id, mantenimientoData) => {
    const response = await api.put(`/mantenimientos/${id}`, mantenimientoData);
    return response.data;
  },

  cambiarEstadoMantenimiento: async (id, estado) => {
    const response = await api.patch(`/mantenimientos/${id}/estado`, { estado });
    return response.data;
  },

  eliminarMantenimiento: async (id) => {
    const response = await api.delete(`/mantenimientos/${id}`);
    return response.data;
  },

  obtenerMantenimientosPlanta: async (plantId) => {
    const response = await api.get(`/mantenimientos/planta/${plantId}`);
    return response.data;
  },

  // ✅ NUEVO: Obtener resumen para dashboard
  obtenerResumenDashboard: async () => {
    const response = await api.get('/mantenimientos/resumen/dashboard');
    return response.data;
  },

iniciarMantenimiento: async (id) => {
    const response = await api.post(`/mantenimientos/${id}/iniciar`);
    return response.data;
},

  // ✅ NUEVO: Completar mantenimiento con fotos, materiales y checklist
completarMantenimiento: async (id, datosCompletar) => {
    const response = await api.post(`/mantenimientos/${id}/completar`, datosCompletar);
    return response.data;
},
  // ✅ NUEVO: Subir fotos a mantenimiento
  subirFotosMantenimiento: async (id, fotos, tipo) => {
    const formData = new FormData();
    formData.append('tipo', tipo);
    
    console.log('📸 Archivos recibidos para subir:', fotos);
    
    // ✅ Manejar diferentes formatos de entrada
    fotos.forEach((foto, index) => {
        if (foto instanceof File) {
            // Si es directamente un File object
            formData.append('fotos', foto);
        } else if (foto.file && foto.file instanceof File) {
            // Si es un objeto con propiedad 'file'
            formData.append('fotos', foto.file);
        } else {
            console.warn('❌ Formato de archivo no válido:', foto);
        }
    });

    // ✅ Verificar que hay archivos antes de enviar
    if (formData.getAll('fotos').length === 0) {
        throw new Error('No hay archivos válidos para subir');
    }

    console.log('📤 Enviando archivos al servidor:', formData.getAll('fotos').length);

    const response = await api.post(`/mantenimientos/${id}/fotos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
},




  // ✅ NUEVO: Agregar materiales a mantenimiento
  agregarMateriales: async (id, materiales) => {
    const response = await api.post(`/mantenimientos/${id}/materiales`, { materiales });
    return response.data;
  },

  // ✅ NUEVO: Generar reporte PDF
  generarReportePDF: async (id) => {
    const response = await api.get(`/mantenimientos/${id}/reporte-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ✅ NUEVO: Eliminar foto
  eliminarFoto: async (id, fotoId) => {
    const response = await api.delete(`/mantenimientos/${id}/fotos/${fotoId}`);
    return response.data;
  },

  // ✅ NUEVO: Eliminar material
  eliminarMaterial: async (id, materialId) => {
    const response = await api.delete(`/mantenimientos/${id}/materiales/${materialId}`);
    return response.data;
  },

  // Checklist
  obtenerChecklistMantenimiento: async (mantenimientoId) => {
    const response = await api.get(`/mantenimientos/${mantenimientoId}/checklist`);
    return response.data;
  },

  agregarItemChecklist: async (mantenimientoId, item) => {
    const response = await api.post(`/mantenimientos/${mantenimientoId}/checklist`, { item });
    return response.data;
  },

  actualizarItemChecklist: async (itemId, itemData) => {
    const response = await api.put(`/mantenimientos/checklist/${itemId}`, itemData);
    return response.data;
  },

  eliminarChecklist: async (mantenimientoId, checklistId) => {
    const response = await api.delete(`/mantenimientos/${mantenimientoId}/checklist/${checklistId}`);
    return response.data;
  },

  // Reportes (mantener existentes)
  obtenerReportes: async (limite = 50, pagina = 1) => {
    const response = await api.get(`/reportes?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  obtenerReporte: async (id) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data;
  },

  crearReporte: async (reporteData) => {
    const response = await api.post('/reportes', reporteData);
    return response.data;
  },

  eliminarReporte: async (id) => {
    const response = await api.delete(`/reportes/${id}`);
    return response.data;
  },

  obtenerReportesPlanta: async (plantId) => {
    const response = await api.get(`/reportes/planta/${plantId}`);
    return response.data;
  },

  descargarReporte: async (rutaArchivo) => {
    const response = await api.get(`/reportes/descargar/${encodeURIComponent(rutaArchivo)}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};