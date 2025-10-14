// components/mantenimiento/ListaMantenimientos.jsx
import { useState, useEffect } from 'react';
import { useMantenimientoStore } from '../../stores/mantenimientoStore';
import ModalMantenimiento from './ModalMantenimiento';
import ChecklistMantenimiento from './ChecklistMantenimiento';

export default function ListaMantenimientos({ plantaId, soloLectura = false }) {
  const { mantenimientos, loading, obtenerMantenimientosPlanta, cambiarEstadoMantenimiento } = useMantenimientoStore();
  const [showModal, setShowModal] = useState(false);
  const [mantenimientoEdit, setMantenimientoEdit] = useState(null);
  const [showChecklist, setShowChecklist] = useState(null);
  const [mantenimientoActualizando, setMantenimientoActualizando] = useState(null);

  useEffect(() => {
    if (plantaId) {
      obtenerMantenimientosPlanta(plantaId);
    }
  }, [plantaId, obtenerMantenimientosPlanta]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setMantenimientoActualizando(id);
    try {
      await cambiarEstadoMantenimiento(id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setMantenimientoActualizando(null);
    }
  };

  const getEstadoConfig = (estado) => {
    const estados = {
      pendiente: { 
        label: 'Pendiente', 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      en_progreso: { 
        label: 'En Progreso', 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      completado: { 
        label: 'Completado', 
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      }
    };
    return estados[estado] || estados.pendiente;
  };

  const getTipoConfig = (tipo) => {
    return tipo === 'preventivo' 
      ? { 
          label: 'Preventivo', 
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: '🛡️'
        }
      : { 
          label: 'Correctivo', 
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: '🔧'
        };
  };

  // Agrupar mantenimientos por estado
  const mantenimientosPendientes = mantenimientos.filter(m => m.estado === 'pendiente');
  const mantenimientosEnProgreso = mantenimientos.filter(m => m.estado === 'en_progreso');
  const mantenimientosCompletados = mantenimientos.filter(m => m.estado === 'completado');

  const renderSeccionMantenimientos = (mantenimientos, titulo, descripcion, color = 'gray') => {
    if (mantenimientos.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2 h-8 bg-${color}-500 rounded-full`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-gray-900">{titulo}</h4>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                {mantenimientos.length} {mantenimientos.length === 1 ? 'mantenimiento' : 'mantenimientos'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{descripcion}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {mantenimientos.map((mantenimiento) => {
            const estado = getEstadoConfig(mantenimiento.estado);
            const tipo = getTipoConfig(mantenimiento.tipo);
            const estaActualizando = mantenimientoActualizando === mantenimiento.id;

            return (
              <div 
                key={mantenimiento.id} 
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-300 ${
                  estaActualizando ? 'opacity-50 pointer-events-none' : 'hover:shadow-md hover:border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tipo.color}`}>
                        {tipo.icon} {tipo.label}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${estado.color}`}>
                        {estado.icon}
                        {estado.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 font-medium text-sm mb-2">{mantenimiento.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Programado: {new Date(mantenimiento.fechaProgramada).toLocaleDateString()}</span>
                      </div>
                      
                      {mantenimiento.fechaRealizada && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Realizado: {new Date(mantenimiento.fechaRealizada).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!soloLectura && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setShowChecklist(mantenimiento.id === showChecklist ? null : mantenimiento.id)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Ver checklist"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setMantenimientoEdit(mantenimiento)}
                        className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                        title="Editar mantenimiento"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Controles de estado */}
                {!soloLectura && (mantenimiento.estado === 'pendiente' || mantenimiento.estado === 'en_progreso') && (
                  <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                    {mantenimiento.estado === 'pendiente' && (
                      <button
                        onClick={() => handleCambiarEstado(mantenimiento.id, 'en_progreso')}
                        disabled={estaActualizando}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {estaActualizando ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        Iniciar Mantenimiento
                      </button>
                    )}
                    {mantenimiento.estado === 'en_progreso' && (
                      <button
                        onClick={() => handleCambiarEstado(mantenimiento.id, 'completado')}
                        disabled={estaActualizando}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {estaActualizando ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Marcar como Completado
                      </button>
                    )}
                  </div>
                )}

                {/* Checklist expandible */}
                {showChecklist === mantenimiento.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ChecklistMantenimiento 
                      mantenimientoId={mantenimiento.id} 
                      readonly={mantenimiento.estado === 'completado'}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading && mantenimientos.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de agregar */}
      {!soloLectura && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Mantenimientos Programados</h3>
            <p className="text-sm text-gray-500 mt-1">Gestiona los mantenimientos de esta planta</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Programar Mantenimiento
          </button>
        </div>
      )}

      {/* Lista de mantenimientos agrupados por estado */}
      <div className="space-y-6">
        {renderSeccionMantenimientos(
          mantenimientosPendientes,
          'Pendientes de Inicio',
          'Mantenimientos programados que requieren atención',
          'yellow'
        )}

        {renderSeccionMantenimientos(
          mantenimientosEnProgreso,
          'En Progreso',
          'Mantenimientos actualmente en ejecución',
          'blue'
        )}

        {renderSeccionMantenimientos(
          mantenimientosCompletados,
          'Completados',
          'Mantenimientos finalizados exitosamente',
          'green'
        )}

    
      </div>

      {mantenimientos.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No hay mantenimientos programados</p>
          {!soloLectura && (
            <p className="text-sm text-gray-500 mt-1">Programa el primer mantenimiento para esta planta</p>
          )}
        </div>
      )}

      {/* Modal */}
      <ModalMantenimiento
        isOpen={showModal || !!mantenimientoEdit}
        onClose={() => {
          setShowModal(false);
          setMantenimientoEdit(null);
        }}
        mantenimiento={mantenimientoEdit}
        plantaPreSeleccionada={plantaId}
      />
    </div>
  );
};
