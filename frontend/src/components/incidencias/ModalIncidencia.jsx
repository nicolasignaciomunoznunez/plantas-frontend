import { useState, useEffect } from 'react';
import { useIncidenciasStore } from '../../stores/incidenciasStore';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';

export default function ModalIncidencia({ isOpen, onClose, incidencia, plantaPreSeleccionada }) {
  const { 
    crearIncidencia, 
    actualizarIncidencia,
    loading 
  } = useIncidenciasStore();
  
  const { plantas, obtenerPlantas, obtenerPlantasPorCliente } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [plantasPermitidas, setPlantasPermitidas] = useState([]);
  const [cargandoPlantas, setCargandoPlantas] = useState(false);
  
  const [formData, setFormData] = useState({
    plantId: plantaPreSeleccionada || '',
    titulo: '',
    descripcion: '',
    estado: 'pendiente'
  });
  const [errors, setErrors] = useState({});

  // ✅ CORREGIDO: Cargar plantas según el rol del usuario
  useEffect(() => {
    const cargarPlantasPermitidas = async () => {
      if (!isOpen || !user) return;
      
      setCargandoPlantas(true);
      try {
        if (user.rol === 'cliente') {
          // Para cliente: obtener solo sus plantas asignadas
          console.log('🔍 Cargando plantas para cliente:', user.id);
          const plantasCliente = await obtenerPlantasPorCliente(user.id);
          setPlantasPermitidas(plantasCliente);
          console.log('📊 Plantas del cliente:', plantasCliente);
          
          // Si solo tiene una planta, seleccionarla automáticamente
          if (plantasCliente.length === 1 && !plantaPreSeleccionada) {
            setFormData(prev => ({ ...prev, plantId: plantasCliente[0].id }));
          }
        } else {
          // Para admin/superadmin/tecnico: cargar todas las plantas
          console.log('🔍 Cargando todas las plantas para:', user.rol);
          await obtenerPlantas(50);
          setPlantasPermitidas(plantas);
        }
      } catch (error) {
        console.error('❌ Error cargando plantas:', error);
        // Fallback: usar plantas ya cargadas
        setPlantasPermitidas(plantas);
      } finally {
        setCargandoPlantas(false);
      }
    };

    cargarPlantasPermitidas();
  }, [isOpen, user]);

  // ✅ Actualizar plantasPermitidas cuando cambian las plantas (para roles no-cliente)
  useEffect(() => {
    if (user?.rol !== 'cliente' && plantas.length > 0) {
      setPlantasPermitidas(plantas);
    }
  }, [plantas, user]);

  useEffect(() => {
    if (incidencia) {
      setFormData({
        plantId: incidencia.plantId || '',
        titulo: incidencia.titulo || '',
        descripcion: incidencia.descripcion || '',
        estado: incidencia.estado || 'pendiente'
      });
    } else {
      setFormData({
        plantId: plantaPreSeleccionada || '',
        titulo: '',
        descripcion: '',
        estado: 'pendiente'
      });
    }
    setErrors({});
  }, [incidencia, plantaPreSeleccionada, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.plantId) {
      newErrors.plantId = 'Selecciona una planta';
    }
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (incidencia) {
        await actualizarIncidencia(incidencia.id, {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          plantId: formData.plantId,
          estado: formData.estado
        });
      } else {
        await crearIncidencia(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar incidencia:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const puedeGestionarEstado = user?.rol === 'superadmin' || user?.rol === 'admin' || user?.rol === 'tecnico';
  const esEdicion = !!incidencia;

  const estados = {
    pendiente: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    en_progreso: { label: 'En Progreso', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    resuelto: { label: 'Resuelto', color: 'text-green-600 bg-green-50 border-green-200' }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - RESPONSIVE */}
        <div className="flex justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {esEdicion ? 'Editar Incidencia' : 'Reportar Nueva Incidencia'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">
                {esEdicion ? 'Actualiza la información de la incidencia' : 'Completa los detalles del problema'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario - RESPONSIVE */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Campo Planta - CORREGIDO */}
          <div className="space-y-2">
            <label htmlFor="plantId" className="block text-sm font-medium text-gray-700">
              Planta *
            </label>
            
            {cargandoPlantas ? (
              // Loading state
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg sm:rounded-xl text-gray-500 text-sm sm:text-base text-center">
                Cargando plantas...
              </div>
            ) : user?.rol === 'cliente' && plantasPermitidas.length === 0 ? (
              // Cliente sin plantas asignadas
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl text-yellow-700 text-sm sm:text-base">
                No tienes plantas asignadas. Contacta al administrador.
              </div>
            ) : user?.rol === 'cliente' && plantasPermitidas.length === 1 ? (
              // Cliente con una sola planta - mostrar fija
              <div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg sm:rounded-xl text-gray-700 text-sm sm:text-base">
                  {plantasPermitidas[0]?.nombre} - {plantasPermitidas[0]?.ubicacion}
                </div>
                <input 
                  type="hidden" 
                  name="plantId" 
                  value={plantasPermitidas[0]?.id} 
                  onChange={handleChange}
                />
              </div>
            ) : (
              // Select normal para múltiples plantas o otros roles
              <select
                id="plantId"
                name="plantId"
                required
                value={formData.plantId}
                onChange={handleChange}
                disabled={cargandoPlantas}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.plantId 
                    ? 'border-red-300 bg-red-50' 
                    : cargandoPlantas
                    ? 'border-gray-300 bg-gray-100 text-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">{cargandoPlantas ? 'Cargando...' : 'Seleccionar planta...'}</option>
                {plantasPermitidas.map((planta) => (
                  <option key={planta.id} value={planta.id}>
                    {planta.nombre} - {planta.ubicacion}
                  </option>
                ))}
              </select>
            )}
            
            {errors.plantId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.plantId}
              </p>
            )}
          </div>

          {/* Resto de los campos se mantienen igual */}
          {/* Campo Título */}
          <div className="space-y-2">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título del Problema *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              value={formData.titulo}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                errors.titulo 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ej: Bomba principal presentando fallos intermitentes"
            />
            {errors.titulo && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción Detallada *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base ${
                errors.descripcion 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Describe el problema en detalle..."
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.descripcion}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Mínimo 10 caracteres. Incluye todos los detalles relevantes para una atención eficiente.
            </p>
          </div>

          {/* Campo Estado (solo para admin/tecnico) */}
          {puedeGestionarEstado && (
            <div className="space-y-2">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado de la Incidencia
              </label>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
                <span className={`px-3 py-2 rounded-lg text-sm font-medium border text-center xs:text-left ${estados[formData.estado]?.color || estados.pendiente.color}`}>
                  {estados[formData.estado]?.label || 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Solo administradores y técnicos pueden modificar el estado.
              </p>
            </div>
          )}

          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-xs sm:text-sm min-w-0">
                <p className="text-gray-900 font-medium truncate">{user?.nombre || 'Usuario'}</p>
                <p className="text-gray-500 capitalize">{user?.rol || 'sin rol'}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción - RESPONSIVE */}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 xs:flex-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || cargandoPlantas}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center flex-1 xs:flex-none"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden xs:inline">Guardando...</span>
                  <span className="xs:hidden">Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden xs:inline">
                    {esEdicion ? 'Actualizar' : 'Reportar'} Incidencia
                  </span>
                  <span className="xs:hidden">
                    {esEdicion ? 'Actualizar' : 'Reportar'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}