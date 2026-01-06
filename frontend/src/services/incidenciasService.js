import { api } from './api';

export const incidenciasService = {
  // Obtener todas las incidencias
  obtenerIncidencias: async (limite = 10, pagina = 1) => {
    const response = await api.get(`/incidencias?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener incidencia por ID
  obtenerIncidencia: async (id) => {
    const response = await api.get(`/incidencias/${id}`);
    return response.data;
  },

  // ✅ NUEVO: Obtener incidencia COMPLETA con fotos y materiales
  obtenerIncidenciaCompleta: async (id) => {
    const response = await api.get(`/incidencias/${id}/completa`);
    return response.data;
  },

  // Crear nueva incidencia
  crearIncidencia: async (incidenciaData) => {
    const response = await api.post('/incidencias', incidenciaData);
    return response.data;
  },

  // Actualizar incidencia
  actualizarIncidencia: async (id, incidenciaData) => {
    const response = await api.put(`/incidencias/${id}`, incidenciaData);
    return response.data;
  },

  // Cambiar estado de incidencia
  cambiarEstadoIncidencia: async (id, estado) => {
    const response = await api.patch(`/incidencias/${id}/estado`, { estado });
    return response.data;
  },

  // ✅ NUEVO: Completar incidencia con resumen, materiales y fotos
  completarIncidencia: async (id, datosCompletar) => {
    const response = await api.put(`/incidencias/${id}/completar`, datosCompletar);
    return response.data;
  },

  // ✅ NUEVO: Subir fotos a incidencia
  subirFotos: async (id, fotos, tipo) => {
    const formData = new FormData();
    formData.append('tipo', tipo);
    
    // Agregar cada archivo al FormData
    fotos.forEach((foto) => {
      formData.append('fotos', foto);
    });

    const response = await api.post(`/incidencias/${id}/fotos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ✅ NUEVO: Agregar materiales a incidencia
  agregarMateriales: async (id, materiales) => {
    const response = await api.post(`/incidencias/${id}/materiales`, { materiales });
    return response.data;
  },

  // ✅ NUEVO: Generar reporte PDF
  generarReportePDF: async (id) => {
    const response = await api.get(`/incidencias/${id}/reporte-pdf`, {
      responseType: 'blob', // Importante para archivos binarios
    });
    return response.data;
  },

  // ✅ NUEVO: Eliminar foto
  eliminarFoto: async (id, fotoId) => {
    const response = await api.delete(`/incidencias/${id}/fotos/${fotoId}`);
    return response.data;
  },

  // ✅ NUEVO: Eliminar material
  eliminarMaterial: async (id, materialId) => {
    const response = await api.delete(`/incidencias/${id}/materiales/${materialId}`);
    return response.data;
  },

  // Eliminar incidencia
  eliminarIncidencia: async (id) => {
    const response = await api.delete(`/incidencias/${id}`);
    return response.data;
  },

  // Obtener incidencias por planta
  obtenerIncidenciasPlanta: async (plantId) => {
    const response = await api.get(`/incidencias/planta/${plantId}`);
    return response.data;
  },

  // Obtener incidencias por estado
  obtenerIncidenciasEstado: async (estado) => {
    const response = await api.get(`/incidencias/estado/${estado}`);
    return response.data;
  },

  // ✅ NUEVO: Obtener resumen para dashboard
  obtenerResumenDashboard: async () => {
    const response = await api.get('/incidencias/resumen/dashboard');
    return response.data;
  },

  // ✅ NUEVO: Obtener incidencias recientes
  obtenerIncidenciasRecientes: async (limite = 10) => {
    const response = await api.get(`/incidencias/recientes?limite=${limite}`);
    return response.data;
  }
};