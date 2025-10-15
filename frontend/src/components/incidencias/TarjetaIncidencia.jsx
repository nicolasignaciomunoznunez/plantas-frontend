import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function TarjetaIncidencia({ incidencia, onEditar, onCambiarEstado, actualizando = false }) {
  const { user } = useAuthStore();
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const obtenerNombrePlanta = () => {
    if (incidencia.plantaNombre) {
      return incidencia.plantaNombre;
    }
    return `Planta ${incidencia.plantId}`;
  };

  const estados = {
    pendiente: { 
      label: 'Pendiente', 
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    en_progreso: { 
      label: 'En Progreso', 
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    resuelto: { 
      label: 'Resuelto', 
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  };

  const estadoActual = estados[incidencia.estado] || estados.pendiente;

  const handleCambioEstado = async (nuevoEstado) => {
    if (!onCambiarEstado) return;
    
    setCambiandoEstado(true);
    try {
      await onCambiarEstado(incidencia.id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setCambiandoEstado(false);
    }
  };

  const puedeEditar = user?.rol === 'admin' || user?.rol === 'tecnico';

  const getRolBadgeColor = () => {
    switch (user?.rol) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'tecnico': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cliente': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all duration-300 ${
      actualizando ? 'opacity-50 pointer-events-none' : 'hover:shadow-md hover:border-gray-200'
    }`}>
      {/* Header con información de estado y acciones - RESPONSIVE */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${estadoActual.color} flex-shrink-0`}>
            {estadoActual.icon}
            <span className="hidden xs:inline">{estadoActual.label}</span>
            <span className="xs:hidden">
              {estadoActual.label === 'Pendiente' ? 'Pend.' : 
               estadoActual.label === 'En Progreso' ? 'En Prog.' : 'Resuelto'}
            </span>
          </span>
          <span className="text-xs text-gray-500 font-mono bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:block">
            #{incidencia.id}
          </span>
        </div>
        
        {puedeEditar && (
          <div className="flex space-x-1 flex-shrink-0 ml-2">
            <button
              onClick={onEditar}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/btn"
              title="Editar incidencia"
              disabled={actualizando}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Contenido principal - RESPONSIVE */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">
          {incidencia.titulo}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
          {incidencia.descripcion}
        </p>
      </div>

      {/* Información de la planta y fechas - RESPONSIVE */}
      <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-medium truncate max-w-[120px] sm:max-w-none">{obtenerNombrePlanta()}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="truncate">Reportada: {new Date(incidencia.fechaReporte).toLocaleDateString()}</span>
        </div>

        {incidencia.fechaResolucion && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate">Resuelta: {new Date(incidencia.fechaResolucion).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Footer con información de usuario y controles - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
        {/* Información del usuario */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {user.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-xs min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600 truncate max-w-[80px] sm:max-w-none">{user.nombre}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${getRolBadgeColor()} flex-shrink-0 hidden xs:inline-block`}>
                    {user.rol || 'sin rol'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selector de estado o mensaje de permisos - RESPONSIVE */}
        {puedeEditar ? (
          <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-blue-200 flex-1 sm:flex-none">
              <span className="text-xs text-blue-700 font-medium whitespace-nowrap hidden xs:inline">Cambiar estado:</span>
              <span className="text-xs text-blue-700 font-medium whitespace-nowrap xs:hidden">Estado:</span>
              <div className="relative min-w-[100px] sm:min-w-[120px]">
                <select
                  value={incidencia.estado}
                  onChange={(e) => handleCambioEstado(e.target.value)}
                  disabled={cambiandoEstado || actualizando}
                  className="text-xs sm:text-sm border border-blue-300 rounded sm:rounded-lg px-2 sm:px-3 py-1 disabled:opacity-50 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-6 sm:pr-8 w-full"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2 text-blue-600">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            {cambiandoEstado && (
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
            <span className="text-xs text-gray-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden xs:inline">Sin permisos para editar</span>
              <span className="xs:hidden">Sin permisos</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}