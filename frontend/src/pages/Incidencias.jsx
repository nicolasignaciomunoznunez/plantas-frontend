import { useEffect, useState, useMemo, useCallback } from 'react';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useAuthStore } from '../stores/authStore';
import ModalIncidencia from '../components/incidencias/ModalIncidencia';
import ListaIncidencias from '../components/incidencias/ListaIncidencias';

export default function Incidencias() {
  const { 
    incidencias, 
    loading, 
    error, 
    obtenerIncidencias, 
    cambiarEstadoIncidencia,
    limpiarError
  } = useIncidenciasStore();
  
  const { user } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [incidenciaEditando, setIncidenciaEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modoCompletar, setModoCompletar] = useState(false);

  // Carga inicial optimizada
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await obtenerIncidencias(50);
      } catch (error) {
        console.error('Error cargando incidencias:', error);
      }
    };
    
    cargarDatos();
  }, [obtenerIncidencias]);

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) limpiarError();
        if (successMessage) setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, limpiarError]);

  // Handlers optimizados con useCallback
  const handleNuevaIncidencia = useCallback(() => {
    setIncidenciaEditando(null);
    setShowModal(true);
  }, []);

  const handleEditarIncidencia = useCallback((incidencia) => {
    setIncidenciaEditando(incidencia);
    setShowModal(true);
  }, []);

  const handleCompletarIncidencia = useCallback((incidencia) => {
  setIncidenciaEditando(incidencia);
  setModoCompletar(true); // ✅ Activar modo completar
  setShowModal(true);
}, []);

  const handleCerrarModal = useCallback(() => {
    setShowModal(false);
    setIncidenciaEditando(null);
    setModoCompletar(false); // ✅ AGREGAR ESTA LÍNEA
  }, []);

  const handleCambiarEstado = useCallback(async (id, nuevoEstado) => {
    try {
      await cambiarEstadoIncidencia(id, nuevoEstado);
      setSuccessMessage(`Estado cambiado a ${nuevoEstado} correctamente`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  }, [cambiarEstadoIncidencia]);

  // Refresh manual
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await obtenerIncidencias(50);
      setSuccessMessage('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error refrescando incidencias:', error);
    } finally {
      setRefreshing(false);
    }
  }, [obtenerIncidencias]);

  // Optimizar cálculos de estadísticas
  const estadisticas = useMemo(() => {
    return {
      total: incidencias.length,
      pendientes: incidencias.filter(i => i.estado === 'pendiente').length,
      enProgreso: incidencias.filter(i => i.estado === 'en_progreso').length,
      resueltas: incidencias.filter(i => i.estado === 'resuelto').length,
      criticas: incidencias.filter(i => i.prioridad === 'critica' && i.estado !== 'resuelto').length,
    };
  }, [incidencias]);

  // Optimizar filtrado
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter(incidencia => {
      const coincideEstado = filtroEstado === 'todos' || incidencia.estado === filtroEstado;
      const coincideBusqueda = filtroBusqueda === '' || 
        incidencia.titulo?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        incidencia.descripcion?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        incidencia.plantaNombre?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        incidencia.prioridad?.toLowerCase().includes(filtroBusqueda.toLowerCase());
      
      return coincideEstado && coincideBusqueda;
    });
  }, [incidencias, filtroEstado, filtroBusqueda]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltroEstado('todos');
    setFiltroBusqueda('');
  }, []);

  const puedeGestionar = user?.rol === 'superadmin' || user?.rol === 'admin' || user?.rol === 'tecnico';
  const hayFiltrosActivos = filtroEstado !== 'todos' || filtroBusqueda !== '';

  // Función para exportar incidencias
  const handleExportarIncidencias = useCallback(() => {
    if (incidenciasFiltradas.length === 0) return;

    const datosExportar = incidenciasFiltradas.map(incidencia => ({
      'ID': incidencia.id,
      'Título': incidencia.titulo,
      'Descripción': incidencia.descripcion,
      'Estado': incidencia.estado,
      'Prioridad': incidencia.prioridad,
      'Planta': incidencia.plantaNombre,
      'Fecha Reporte': incidencia.fechaReporte,
      'Fecha Resolución': incidencia.fechaResolucion || 'N/A',
      'Reportado Por': incidencia.reportadoPor || 'N/A'
    }));

    const csv = [
      Object.keys(datosExportar[0]).join(','),
      ...datosExportar.map(row => Object.values(row).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidencias-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSuccessMessage(`Exportadas ${incidenciasFiltradas.length} incidencias correctamente`);
  }, [incidenciasFiltradas]);

  // Handler para cuando se guarda una incidencia
  const handleIncidenciaGuardada = useCallback(() => {
    handleCerrarModal();
    obtenerIncidencias(50);
    setSuccessMessage(incidenciaEditando ? 'Incidencia actualizada correctamente' : 'Incidencia creada correctamente');
  }, [handleCerrarModal, obtenerIncidencias, incidenciaEditando]);

  if (loading && incidencias.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 sm:w-96"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full lg:w-40"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          
          {/* Filters skeleton */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="h-10 sm:h-12 bg-gray-200 rounded"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm h-24 sm:h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Mejorado - RESPONSIVE */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
              Gestión de Incidencias
            </h1>
            {refreshing && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>
          <p className="text-gray-500 flex items-center gap-2 text-sm sm:text-base">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
            Monitorea y gestiona los problemas reportados en las plantas
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full lg:w-auto mt-3 lg:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed justify-center text-sm sm:text-base flex-1 xs:flex-none"
          >
            <svg 
              className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden xs:inline">Actualizar</span>
            <span className="xs:hidden">Refrescar</span>
          </button>

          <button
            onClick={handleExportarIncidencias}
            disabled={incidenciasFiltradas.length === 0}
            className="px-3 sm:px-4 py-2 sm:py-3 border border-green-300 text-green-700 rounded-lg sm:rounded-xl font-medium hover:bg-green-50 transition-all duration-200 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed justify-center text-sm sm:text-base flex-1 xs:flex-none"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden xs:inline">Exportar</span>
            <span className="xs:hidden">Exportar</span>
          </button>
          
          <button
            onClick={handleNuevaIncidencia}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 justify-center text-sm sm:text-base flex-1 xs:flex-none"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden xs:inline">Reportar Incidencia</span>
            <span className="xs:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {/* Mensaje de Error Mejorado - RESPONSIVE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-sm">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-xs sm:text-sm font-bold">!</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base">Error al cargar incidencias</p>
            <p className="text-xs sm:text-sm text-red-600 truncate">{error}</p>
          </div>
          <button
            onClick={() => limpiarError()}
            className="text-red-700 hover:text-red-800 font-medium text-xs sm:text-sm flex-shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Mensaje de Éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-sm">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base">¡Éxito!</p>
            <p className="text-xs sm:text-sm text-green-600 truncate">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-700 hover:text-green-800 font-medium text-xs sm:text-sm flex-shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Tarjetas de Estadísticas Mejoradas - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div 
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('todos')}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600">Total Incidencias</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{estadisticas.total}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('pendiente')}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">{estadisticas.pendientes}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('en_progreso')}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{estadisticas.enProgreso}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('resuelto')}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600">Resueltas</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{estadisticas.resueltas}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{estadisticas.criticas}</p>
              <p className="text-xs text-red-500 mt-1 hidden sm:block">Requieren atención inmediata</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda Mejorados - RESPONSIVE */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 w-full">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar incidencias..."
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-colors hover:border-gray-300 text-sm sm:text-base"
              />
            </div>

            {/* Filtro por estado */}
            <div className="relative min-w-[140px] sm:min-w-[180px]">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-colors w-full text-sm sm:text-base"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_progreso">En Progreso</option>
                <option value="resuelto">Resueltos</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap justify-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden xs:inline">Limpiar Filtros</span>
                <span className="xs:hidden">Limpiar</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-3 lg:mt-0">
            <span className="hidden sm:inline">Mostrando</span>
            <span className="font-semibold text-gray-700">{incidenciasFiltradas.length}</span>
            <span>de</span>
            <span className="font-semibold text-gray-700">{incidencias.length}</span>
            <span className="hidden xs:inline">incidencias</span>
            {hayFiltrosActivos && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Filtrado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Incidencias */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
       <ListaIncidencias 
  incidencias={incidenciasFiltradas}
  onEditarIncidencia={handleEditarIncidencia}
  onCompletarIncidencia={handleCompletarIncidencia} // ✅ AGREGAR ESTA LÍNEA
  onCambiarEstado={handleCambiarEstado}
  loading={loading && incidencias.length > 0}
  puedeGestionar={puedeGestionar}
/>
      </div>

      {/* Empty State cuando no hay resultados */}
      {incidenciasFiltradas.length === 0 && incidencias.length > 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron incidencias</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
            {hayFiltrosActivos 
              ? 'Intenta ajustar los filtros de búsqueda o limpiar los filtros activos.'
              : 'No hay incidencias que coincidan con los criterios actuales.'
            }
          </p>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Empty State cuando no hay incidencias */}
      {incidencias.length === 0 && !loading && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡No hay incidencias reportadas!</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
            Todas las plantas están funcionando correctamente. Puedes reportar una nueva incidencia cuando sea necesario.
          </p>
          <button
            onClick={handleNuevaIncidencia}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
          >
            Reportar Primera Incidencia
          </button>
        </div>
      )}

      {/* Modal */}
<ModalIncidencia
  isOpen={showModal}
  onClose={handleCerrarModal}
  incidencia={incidenciaEditando}
  modoCompletar={modoCompletar} // ✅ AGREGAR ESTA LÍNEA
  onIncidenciaGuardada={handleIncidenciaGuardada}
/>

      {/* Debug Info - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
          <h3 className="font-medium text-blue-800 text-sm mb-2">Debug Info:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Incidencias: {incidenciasFiltradas.length} filtradas de {incidencias.length} totales</p>
            <p>Usuario: {user?.nombre} ({user?.rol})</p>
            <p>Filtros: estado="{filtroEstado}", búsqueda="{filtroBusqueda}"</p>
            <p>Puede gestionar: {puedeGestionar ? 'Sí' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}