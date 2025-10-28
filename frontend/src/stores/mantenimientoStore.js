// stores/mantenimientoStore.js
import { create } from 'zustand';
import { mantenimientoService } from '../services/mantenimientoService';

export const useMantenimientoStore = create((set, get) => ({
  // Estado
  mantenimientos: [],
  mantenimientoSeleccionado: null,
  loading: false,
  error: null,
  mantenimientosCargados: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener todos los mantenimientos
  obtenerMantenimientos: async (limite = 50, pagina = 1) => {
    const state = get();
    if (state.loading || state.mantenimientosCargados) {
      return state.mantenimientos;
    }

    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimientos(limite, pagina);
      set({ 
        mantenimientos: response.mantenimientos, 
        loading: false,
        mantenimientosCargados: true
      });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimientos', loading: false });
      throw error;
    }
  },

  // Obtener mantenimiento por ID
  obtenerMantenimiento: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimiento(id);
      set({ mantenimientoSeleccionado: response.mantenimiento, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimiento', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Obtener mantenimiento COMPLETO con fotos y materiales
  obtenerMantenimientoCompleto: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimientoCompleto(id);
      set({ mantenimientoSeleccionado: response.mantenimiento, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimiento completo', loading: false });
      throw error;
    }
  },

 
 

  crearMantenimiento: async (mantenimientoData) => {
    set({ loading: true, error: null });
    try {
        const response = await mantenimientoService.crearMantenimiento(mantenimientoData);
        const nuevoMantenimiento = response.mantenimiento;
        set(state => ({
            mantenimientos: [nuevoMantenimiento, ...state.mantenimientos],
            loading: false
        }));
        return response;
    } catch (error) {
        set({ error: error.response?.data?.message || 'Error al crear mantenimiento', loading: false });
        throw error;
    }
},

iniciarMantenimiento: async (id) => {
    set({ loading: true, error: null });
    try {
        const response = await mantenimientoService.iniciarMantenimiento(id);
        
        // Actualizar estado del mantenimiento
        set(state => ({
            mantenimientos: state.mantenimientos.map(mant => 
                mant.id === id ? { ...mant, estado: 'en_progreso' } : mant
            ),
            mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id 
                ? { ...state.mantenimientoSeleccionado, estado: 'en_progreso' }
                : state.mantenimientoSeleccionado,
            loading: false
        }));
        
        return response;
    } catch (error) {
        set({ error: error.response?.data?.message || 'Error al iniciar mantenimiento', loading: false });
        throw error;
    }
},

completarMantenimiento: async (id, datosCompletar) => {
    set({ loading: true, error: null });
    try {
        const response = await mantenimientoService.completarMantenimiento(id, datosCompletar);
        
        // Actualizar en el estado local
        set(state => ({
            mantenimientos: state.mantenimientos.map(mant => 
                mant.id === id ? { 
                    ...mant, 
                    estado: 'completado',
                    fechaRealizada: new Date().toISOString(),
                    ...response.mantenimiento 
                } : mant
            ),
            mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id 
                ? { ...state.mantenimientoSeleccionado, ...response.mantenimiento }
                : state.mantenimientoSeleccionado,
            loading: false
        }));
        
        return response;
    } catch (error) {
        set({ error: error.response?.data?.message || 'Error al completar mantenimiento', loading: false });
        throw error;
    }
},


  // ✅ NUEVO: Subir fotos a mantenimiento
subirFotosMantenimiento: async (id, fotos, tipo) => {
    set({ loading: true, error: null });
    try {
        const response = await mantenimientoService.subirFotosMantenimiento(id, fotos, tipo);
        
        // Actualizar fotos en el mantenimiento seleccionado
        set(state => ({
            mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id 
                ? { 
                    ...state.mantenimientoSeleccionado, 
                    fotos: [...(state.mantenimientoSeleccionado.fotos || []), ...response.fotos]
                }
                : state.mantenimientoSeleccionado,
            loading: false
        }));
        
        return response;
    } catch (error) {
        set({ error: error.response?.data?.message || 'Error al subir fotos', loading: false });
        throw error;
    }
},
  // ✅ NUEVO: Agregar materiales a mantenimiento
  agregarMaterialesMantenimiento: async (id, materiales) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.agregarMateriales(id, materiales);
      
      // Actualizar materiales en el mantenimiento seleccionado
      set(state => ({
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id 
          ? { 
              ...state.mantenimientoSeleccionado, 
              materiales: [...(state.mantenimientoSeleccionado.materiales || []), ...response.materiales]
            }
          : state.mantenimientoSeleccionado,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al agregar materiales', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Generar reporte PDF
  generarReportePDF: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.generarReportePDF(id);
      
      // Crear enlace de descarga
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-mantenimiento-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      set({ loading: false });
      return { success: true, message: 'Reporte descargado correctamente' };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al generar reporte PDF', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Eliminar foto
  eliminarFoto: async (id, fotoId) => {
    set({ loading: true, error: null });
    try {
      await mantenimientoService.eliminarFoto(id, fotoId);
      
      // Actualizar en el estado local
      set(state => ({
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id 
          ? { 
              ...state.mantenimientoSeleccionado, 
              fotos: state.mantenimientoSeleccionado.fotos?.filter(foto => foto.id !== fotoId) || []
            }
          : state.mantenimientoSeleccionado,
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
      await mantenimientoService.eliminarMaterial(id, materialId);
      
      // Actualizar en el estado local
      set(state => ({
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id 
          ? { 
              ...state.mantenimientoSeleccionado, 
              materiales: state.mantenimientoSeleccionado.materiales?.filter(mat => mat.id !== materialId) || []
            }
          : state.mantenimientoSeleccionado,
        loading: false
      }));
      
      return { success: true, message: 'Material eliminado correctamente' };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar material', loading: false });
      throw error;
    }
  },

  // Actualizar mantenimiento
  actualizarMantenimiento: async (id, mantenimientoData) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.actualizarMantenimiento(id, mantenimientoData);
      set(state => ({
        mantenimientos: state.mantenimientos.map(mant => 
          mant.id === id ? response.mantenimiento : mant
        ),
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id ? response.mantenimiento : state.mantenimientoSeleccionado,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar mantenimiento', loading: false });
      throw error;
    }
  },

  // Cambiar estado de mantenimiento
  cambiarEstadoMantenimiento: async (id, estado) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.actualizarMantenimiento(id, { estado });
      set(state => ({
        mantenimientos: state.mantenimientos.map(mant => 
          mant.id === id ? { ...mant, estado } : mant
        ),
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id ? 
          { ...state.mantenimientoSeleccionado, estado } : state.mantenimientoSeleccionado,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cambiar estado', loading: false });
      throw error;
    }
  },

  // Eliminar mantenimiento
  eliminarMantenimiento: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.eliminarMantenimiento(id);
      set(state => ({
        mantenimientos: state.mantenimientos.filter(mant => mant.id !== id),
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id ? null : state.mantenimientoSeleccionado,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar mantenimiento', loading: false });
      throw error;
    }
  },

  // Obtener mantenimientos por planta
  obtenerMantenimientosPlanta: async (plantId) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimientosPlanta(plantId);
      set({ mantenimientos: response.mantenimientos, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimientos de planta', loading: false });
      throw error;
    }
  },

  // ✅ NUEVO: Obtener resumen para dashboard
  obtenerResumenDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerResumenDashboard();
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener resumen', loading: false });
      throw error;
    }
  },

  // Resetear estado
  resetearMantenimientosCargados: () => set({ mantenimientosCargados: false }),
  limpiarMantenimientoSeleccionado: () => set({ mantenimientoSeleccionado: null }),
  limpiarError: () => set({ error: null }),
}));