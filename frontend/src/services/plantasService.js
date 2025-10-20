import { api } from './api';

export const plantasService = {
  // Obtener todas las plantas
  obtenerPlantas: async (limite = 10, pagina = 1) => {
    const response = await api.get(`/api/plantas?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener planta por ID - VERSIÓN LIMPIA
  obtenerPlanta: async (id) => {

    
    // Validación básica
    if (!id) {
      throw new Error('ID de planta no proporcionado');
    }
    
    try {
      const response = await api.get(`/api/plantas/${id}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ [PLANTAS SERVICE] Error al obtener planta:', error);
      throw error;
    }
  },

  // Crear nueva planta
  crearPlanta: async (plantaData) => {
    const response = await api.post('/api/plantas', plantaData);
    return response.data;
  },

  // Actualizar planta
  actualizarPlanta: async (id, plantaData) => {
    if (!id) {
      throw new Error('ID de planta no proporcionado');
    }
    
    const response = await api.put(`/api/plantas/${id}`, plantaData);
    return response.data;
  },

  // Eliminar planta
  eliminarPlanta: async (id) => {
    if (!id) {
      throw new Error('ID de planta no proporcionado');
    }
    
    const response = await api.delete(`/api/plantas/${id}`);
    return response.data;
  },

  // Obtener plantas por cliente
  obtenerPlantasCliente: async (clienteId) => {
    if (!clienteId) {
      throw new Error('ID de cliente no proporcionado');
    }
    
    const response = await api.get(`/api/plantas/cliente/${clienteId}`);
    return response.data;
  },
};