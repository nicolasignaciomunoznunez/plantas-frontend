import { useState } from 'react';
import { useIncidenciasStore } from '../../stores/incidenciasStore';
import TarjetaIncidencia from './TarjetaIncidencia';

export default function ListaIncidencias({ incidencias, onEditarIncidencia, loading }) {
  const { cambiarEstadoIncidencia } = useIncidenciasStore();
  const [incidenciaActualizando, setIncidenciaActualizando] = useState(null);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setIncidenciaActualizando(id);
    try {
      await cambiarEstadoIncidencia(id, nuevoEstado);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado de la incidencia');
    } finally {
      setIncidenciaActualizando(null);
    }
  };

  // Agrupar incidencias por estado para mejor organización
  const incidenciasPendientes = incidencias.filter(i => i.estado === 'pendiente');
  const incidenciasEnProgreso = incidencias.filter(i => i.estado === 'en_progreso');
  const incidenciasResueltas = incidencias.filter(i => i.estado === 'resuelto');

  if (incidencias.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-12 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No hay incidencias reportadas</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
          Todas las plantas están operando normalmente. ¡Buen trabajo!
        </p>
        <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full mx-auto"></div>
      </div>
    );
  }

  const renderSeccionIncidencias = (incidencias, titulo, descripcion, color = 'gray') => {
    if (incidencias.length === 0) return null;

    const colorClasses = {
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', accent: 'bg-yellow-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'bg-blue-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', accent: 'bg-green-500' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', accent: 'bg-gray-500' }
    };

    const colors = colorClasses[color] || colorClasses.gray;

    return (
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`w-1.5 h-6 sm:w-2 sm:h-8 ${colors.accent} rounded-full flex-shrink-0 mt-1 sm:mt-0`}></div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mb-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{titulo}</h3>
              <span className={`px-2 py-1 ${colors.bg} ${colors.text} border ${colors.border} text-xs font-medium rounded-full flex-shrink-0 w-fit`}>
                {incidencias.length} {incidencias.length === 1 ? 'incidencia' : 'incidencias'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">{descripcion}</p>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {incidencias.map((incidencia) => (
            <TarjetaIncidencia
              key={incidencia.id}
              incidencia={incidencia}
              onEditar={() => onEditarIncidencia(incidencia)}
              onCambiarEstado={handleCambiarEstado}
              actualizando={incidenciaActualizando === incidencia.id}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      {/* Sección de Incidencias Pendientes */}
      {renderSeccionIncidencias(
        incidenciasPendientes,
        'Pendientes de Revisión',
        'Incidencias que requieren atención inmediata',
        'yellow'
      )}

      {/* Sección de Incidencias en Progreso */}
      {renderSeccionIncidencias(
        incidenciasEnProgreso,
        'En Progreso',
        'Incidencias siendo atendidas por el equipo',
        'blue'
      )}

      {/* Sección de Incidencias Resueltas */}
      {renderSeccionIncidencias(
        incidenciasResueltas,
        'Resueltas',
        'Incidencias que han sido solucionadas',
        'green'
      )}

      {/* Si no hay agrupación por estado, mostrar todas juntas */}
      {incidenciasPendientes.length === 0 && 
       incidenciasEnProgreso.length === 0 && 
       incidenciasResueltas.length === 0 && 
       incidencias.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {incidencias.map((incidencia) => (
            <TarjetaIncidencia
              key={incidencia.id}
              incidencia={incidencia}
              onEditar={() => onEditarIncidencia(incidencia)}
              onCambiarEstado={handleCambiarEstado}
              actualizando={incidenciaActualizando === incidencia.id}
            />
          ))}
        </div>
      )}

      {/* Estado de carga global - RESPONSIVE */}
      {loading && (
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 sm:w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 sm:w-1/3"></div>
                </div>
                <div className="h-7 sm:h-8 bg-gray-200 rounded w-16 sm:w-20"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}