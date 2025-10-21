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

  // ✅ Obtener planta completa con técnicos y clientes
  obtenerPlantaCompleta: async (plantaId) => {
    if (!plantaId) {
      throw new Error('ID de planta no proporcionado');
    }
    
    try {
      const response = await api.get(`/api/plantas/${plantaId}/completa`);
      return response.data;
    } catch (error) {
      console.error('❌ [PLANTAS SERVICE] Error al obtener planta completa:', error);
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
  
  // Asignar/desasignar planta a usuario (1-a-1)
  asignarPlantaUsuario: async (datos) => {
    const response = await api.post('/api/plantas/asignar', datos);
    return response.data;
  },

  // ✅ ASIGNAR MÚLTIPLES TÉCNICOS A UNA PLANTA
  asignarMultiplesTecnicos: async (plantaId, tecnicosIds) => {
    if (!plantaId || !tecnicosIds) {
      throw new Error('Planta ID y técnicos IDs son requeridos');
    }
    
    try {
      const response = await api.post(`/api/plantas/${plantaId}/asignar-tecnicos`, {
        tecnicosIds
      });
      return response.data;
    } catch (error) {
      console.error('❌ [PLANTAS SERVICE] Error asignando múltiples técnicos:', error);
      throw error;
    }
  },

  // ✅ ASIGNAR MÚLTIPLES CLIENTES A UNA PLANTA
  asignarMultiplesClientes: async (plantaId, clientesIds) => {
    if (!plantaId || !clientesIds) {
      throw new Error('Planta ID y clientes IDs son requeridos');
    }
    
    try {
      const response = await api.post(`/api/plantas/${plantaId}/asignar-clientes`, {
        clientesIds
      });
      return response.data;
    } catch (error) {
      console.error('❌ [PLANTAS SERVICE] Error asignando múltiples clientes:', error);
      throw error;
    }
  },

  // ✅ OBTENER PLANTAS POR USUARIO (muchos-a-muchos)
  obtenerPlantasUsuario: async (usuarioId) => {
    if (!usuarioId) {
      throw new Error('ID de usuario no proporcionado');
    }
    
    try {
      const response = await api.get(`/api/plantas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [PLANTAS SERVICE] Error obteniendo plantas del usuario:', error);
      throw error;
    }
  },

  // ✅ OBTENER TODAS LAS PLANTAS COMPLETAS (para administración)
  obtenerPlantasCompletas: async (limite = 50, pagina = 1) => {
    try {
      const response = await api.get(`/api/plantas/completas?limite=${limite}&pagina=${pagina}`);
      return response.data;
    } catch (error) {
      console.error('❌ [PLANTAS SERVICE] Error obteniendo plantas completas:', error);
      throw error;
    }
  }
};