import { create } from 'zustand';
import { incidenciasService } from '../services/incidenciasService';

export const useIncidenciasStore = create((set, get) => ({
  // Estado
  incidencias: [],
  incidenciaSeleccionada: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener todas las incidencias
  obtenerIncidencias: async (limite = 10, pagina = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidencias(limite, pagina);
      set({ incidencias: response.incidencias, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencias', loading: false });
      throw error;
    }
  },

  // Obtener incidencia por ID
  obtenerIncidencia: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidencia(id);
      set({ incidenciaSeleccionada: response.incidencia, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencia', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Obtener incidencia COMPLETA con fotos y materiales
  obtenerIncidenciaCompleta: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidenciaCompleta(id);
      set({ incidenciaSeleccionada: response.incidencia, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencia completa', loading: false });
      throw error;
    }
  },

  // Crear incidencia
  crearIncidencia: async (incidenciaData) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.crearIncidencia(incidenciaData);

      const nuevaIncidencia = response.incidencia;
      set(state => ({ 
        incidencias: [nuevaIncidencia, ...state.incidencias],
        loading: false 
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear incidencia', loading: false });
      throw error;
    }
  },

  // Cambiar estado de incidencia
  cambiarEstadoIncidencia: async (id, estado) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.cambiarEstadoIncidencia(id, estado);
      set(state => ({
        incidencias: state.incidencias.map(inc => 
          inc.id === id ? { ...inc, estado } : inc
        ),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cambiar estado', loading: false });
      throw error;
    }
  },
  
  // Actualizar incidencia (título, descripción, etc.)
  actualizarIncidencia: async (id, datosActualizacion) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.actualizarIncidencia(id, datosActualizacion);
      
      set(state => ({
        incidencias: state.incidencias.map(inc => 
          inc.id === id ? { ...inc, ...datosActualizacion } : inc
        ),
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { ...state.incidenciaSeleccionada, ...datosActualizacion }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar incidencia', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Completar incidencia con resumen, fotos y materiales
  completarIncidencia: async (id, datosCompletar) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.completarIncidencia(id, datosCompletar);
      
      // Actualizar en el estado local
      set(state => ({
        incidencias: state.incidencias.map(inc => 
          inc.id === id ? { 
            ...inc, 
            estado: 'resuelto',
            fechaResolucion: new Date().toISOString(),
            ...response.incidencia 
          } : inc
        ),
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { ...state.incidenciaSeleccionada, ...response.incidencia }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al completar incidencia', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Subir fotos a incidencia
  subirFotosIncidencia: async (id, fotos, tipo) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.subirFotos(id, fotos, tipo);
      
      // Si tenemos la incidencia seleccionada, actualizar sus fotos
      set(state => ({
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { 
              ...state.incidenciaSeleccionada, 
              fotos: [...(state.incidenciaSeleccionada.fotos || []), ...response.fotos]
            }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al subir fotos', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Agregar materiales a incidencia
  agregarMaterialesIncidencia: async (id, materiales) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.agregarMateriales(id, materiales);
      
      // Actualizar en el estado local
      set(state => ({
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { 
              ...state.incidenciaSeleccionada, 
              materiales: [...(state.incidenciaSeleccionada.materiales || []), ...response.materiales]
            }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al agregar materiales', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Generar reporte PDF (método del service)
  generarReportePDF: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.generarReportePDF(id);
      
      // Crear enlace de descarga
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-incidencia-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      set({ loading: false });
      return { success: true, message: 'Reporte descargado correctamente' };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al generar reporte PDF', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Generar reporte PDF (método directo con fetch)


  // ✅ NUEVO: Eliminar foto
  eliminarFoto: async (id, fotoId) => {
    set({ loading: true, error: null });
    try {
      await incidenciasService.eliminarFoto(id, fotoId);
      
      // Actualizar en el estado local
      set(state => ({
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { 
              ...state.incidenciaSeleccionada, 
              fotos: state.incidenciaSeleccionada.fotos?.filter(foto => foto.id !== fotoId) || []
            }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return { success: true, message: 'Foto eliminada correctamente' };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar foto', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Eliminar material
  eliminarMaterial: async (id, materialId) => {
    set({ loading: true, error: null });
    try {
      await incidenciasService.eliminarMaterial(id, materialId);
      
      // Actualizar en el estado local
      set(state => ({
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { 
              ...state.incidenciaSeleccionada, 
              materiales: state.incidenciaSeleccionada.materiales?.filter(mat => mat.id !== materialId) || []
            }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return { success: true, message: 'Material eliminado correctamente' };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar material', loading: false });
      throw error;
    }
  },

  // Obtener incidencias por planta
  obtenerIncidenciasPlanta: async (plantId) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidenciasPlanta(plantId);
      set({ incidencias: response.incidencias, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencias de planta', loading: false });
      throw error;
    }
  },

  // Limpiar incidencia seleccionada
  limpiarIncidenciaSeleccionada: () => set({ incidenciaSeleccionada: null }),

  // ✅ NUEVO: Limpiar errores
  limpiarError: () => set({ error: null }),

  // ✅ NUEVO: Actualizar incidencia en lista
  actualizarIncidenciaEnLista: (id, datosActualizados) => {
    set(state => ({
      incidencias: state.incidencias.map(inc => 
        inc.id === id ? { ...inc, ...datosActualizados } : inc
      )
    }));
  }
}));