import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado';

export default function ResumenActividad({ incidencias, mantenimientos }) {
  const [tipoActividad, setTipoActividad] = useState('reciente');

  // ✅ ACTIVIDADES OPTIMIZADAS CON USEMEMO - SIN CAMBIOS
  const actividadesOptimizadas = useMemo(() => {
    const mapearActividad = (item, tipo) => {
      const esIncidencia = tipo === 'incidencia';
      
      // ✅ USAR FECHA CORRECTA Y MANEJAR FUTURO
      let fecha;
      if (esIncidencia) {
        fecha = new Date(item.fechaReporte);
      } else {
        fecha = new Date(item.fechaProgramada);
        // Para mantenimientos, si la fecha es futura, usar fecha de creación
        if (fecha > new Date() && item.createdAt) {
          fecha = new Date(item.createdAt);
        }
      }
      
      // ✅ ESTADOS SIMPLIFICADOS
      let estado = item.estado;
      let color = 'gray';
      
      if (estado === 'resuelto' || estado === 'completado') color = 'green';
      else if (estado === 'en_progreso') color = 'blue';
      else if (estado === 'pendiente') color = 'yellow';
      
      return {
        id: `${tipo}-${item.id}`,
        tipo,
        titulo: esIncidencia ? item.titulo : `Mantenimiento ${item.tipo}`,
        descripcion: item.descripcion,
        fecha,
        estado,
        color,
        icono: esIncidencia ? '⚠️' : '🔧',
        usuario: item.userId ? `Usuario ${item.userId}` : 'Sistema'
      };
    };

    return [
      ...incidencias.map(inc => mapearActividad(inc, 'incidencia')),
      ...mantenimientos.map(mant => mapearActividad(mant, 'mantenimiento'))
    ]
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 6);
  }, [incidencias, mantenimientos]);

  // ✅ FILTRADO MEMOIZADO - SIN CAMBIOS
  const actividadesFiltradas = useMemo(() => {
    if (tipoActividad === 'todas') return actividadesOptimizadas;
    if (tipoActividad === 'incidencias') 
      return actividadesOptimizadas.filter(a => a.tipo === 'incidencia');
    if (tipoActividad === 'mantenimientos') 
      return actividadesOptimizadas.filter(a => a.tipo === 'mantenimiento');
    return actividadesOptimizadas;
  }, [tipoActividad, actividadesOptimizadas]);

  // ✅ FORMATO TIEMPO CORREGIDO (SIN NEGATIVOS) - SIN CAMBIOS
  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const diffMs = Math.abs(ahora - fecha); // ✅ MATH.ABS PARA EVITAR NEGATIVOS
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // ✅ DIFERENCIAR ENTRE PASADO Y FUTURO
    const esFuturo = fecha > ahora;
    const prefijo = esFuturo ? 'En ' : 'Hace ';

    if (diffMins < 60) return `${prefijo}${diffMins} min`;
    if (diffHours < 24) return `${prefijo}${diffHours} h`;
    if (diffDays < 7) return `${prefijo}${diffDays} d`;
    
    // ✅ PARA FECHAS LEJANAS, MOSTRAR FECHA COMPLETA
    if (esFuturo) {
      return `Programado: ${fecha.toLocaleDateString('es-ES')}`;
    }
    return fecha.toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* ✅ HEADER RESPONSIVE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        
        {/* ✅ FILTROS MÁS COMPACTOS Y RESPONSIVE */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
          {['reciente', 'incidencias', 'mantenimientos'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoActividad(tipo)}
              className={`px-2 sm:px-3 py-1 text-xs rounded-md transition-colors capitalize flex-1 sm:flex-none ${
                tipoActividad === tipo 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden xs:inline">{tipo}</span>
              <span className="xs:hidden">
                {tipo === 'reciente' ? 'Todo' : 
                 tipo === 'incidencias' ? 'Inc.' : 'Mant.'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ LISTA OPTIMIZADA Y RESPONSIVE */}
      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📝</div>
          <p className="text-gray-600 text-sm sm:text-base">No hay actividad reciente</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {actividadesFiltradas.map((actividad) => (
            <div
              key={actividad.id}
              className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-xs sm:text-sm group-hover:border-blue-400 transition-colors">
                {actividad.icono}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-1 xs:gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1 text-sm">
                    {actividad.titulo}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatearTiempo(actividad.fecha)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                  {actividad.descripcion}
                </p>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <BadgeEstado estado={actividad.estado} size="sm" />
                  <span className="text-xs text-gray-500 capitalize hidden xs:inline">
                    {actividad.tipo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ FOOTER COMPACTO Y RESPONSIVE */}
      <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 xs:gap-0 text-sm">
          <span className="text-gray-500 text-xs sm:text-sm">
            {actividadesFiltradas.length} actividades
          </span>
          <div className="flex gap-3 sm:gap-4">
            <Link 
              to="/incidencias" 
              className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
            >
              Incidencias →
            </Link>
            <Link 
              to="/mantenimientos" 
              className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
            >
              Mantenimientos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}