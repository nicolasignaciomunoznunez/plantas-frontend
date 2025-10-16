import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import BadgeEstado from './BadgeEstado';

// 🎨 Configuración centralizada
const ACTIVIDAD_CONFIG = {
  tipos: {
    incidencia: {
      icono: '⚠️',
      color: 'error',
      ruta: '/incidencias',
      label: 'Incidencias'
    },
    mantenimiento: {
      icono: '🔧', 
      color: 'primary',
      ruta: '/mantenimientos',
      label: 'Mantenimientos'
    }
  },
  filtros: [
    { key: 'reciente', label: 'Todo', icon: '🕒' },
    { key: 'incidencias', label: 'Incidencias', icon: '⚠️' },
    { key: 'mantenimientos', label: 'Mantenimientos', icon: '🔧' }
  ]
};

// 🎯 Hook personalizado para lógica de actividades
const useActividades = ({ incidencias, mantenimientos }) => {
  // ✅ Actividades optimizadas
  const actividadesOptimizadas = useMemo(() => {
    const mapearActividad = (item, tipo) => {
      const esIncidencia = tipo === 'incidencia';
      
      // Manejo robusto de fechas
      let fecha;
      try {
        if (esIncidencia) {
          fecha = new Date(item.fechaReporte || item.createdAt);
        } else {
          fecha = new Date(item.fechaProgramada || item.createdAt);
          if (fecha > new Date() && item.createdAt) {
            fecha = new Date(item.createdAt);
          }
        }
        
        // Validar fecha
        if (isNaN(fecha.getTime())) {
          fecha = new Date(); // Fallback a fecha actual
        }
      } catch {
        fecha = new Date(); // Fallback en caso de error
      }

      return {
        id: `${tipo}-${item.id}`,
        tipo,
        titulo: esIncidencia ? item.titulo : `Mantenimiento ${item.tipo}`,
        descripcion: item.descripcion || 'Sin descripción',
        fecha,
        estado: item.estado,
        icono: ACTIVIDAD_CONFIG.tipos[tipo].icono,
        color: ACTIVIDAD_CONFIG.tipos[tipo].color,
        usuario: item.userId ? `Usuario ${item.userId}` : 'Sistema',
        metadata: {
          plantaId: item.plantId,
          prioridad: item.prioridad
        }
      };
    };

    const actividades = [
      ...incidencias.map(inc => mapearActividad(inc, 'incidencia')),
      ...mantenimientos.map(mant => mapearActividad(mant, 'mantenimiento'))
    ];

    return actividades
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 8); // Mostrar más actividades
  }, [incidencias, mantenimientos]);

  // ✅ Formatear tiempo mejorado
  const formatearTiempo = useCallback((fecha) => {
    const ahora = new Date();
    const diffMs = Math.abs(ahora - fecha);
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const esFuturo = fecha > ahora;
    const prefijo = esFuturo ? 'En ' : 'Hace ';

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `${prefijo}${diffMins} min`;
    if (diffHours < 24) return `${prefijo}${diffHours} h`;
    if (diffDays < 7) return `${prefijo}${diffDays} d`;
    
    if (esFuturo) {
      return `Programado: ${fecha.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      })}`;
    }
    
    return fecha.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  }, []);

  return {
    actividadesOptimizadas,
    formatearTiempo
  };
};

// 🎯 Componente de Tarjeta de Actividad
const TarjetaActividad = ({ actividad, formatearTiempo }) => {
  const configTipo = ACTIVIDAD_CONFIG.tipos[actividad.tipo];
  
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-secondary-100 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group animate-fade-in-up">
      {/* Icono con fondo del tipo */}
      <div className={clsx(
        'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base border-2 transition-all duration-200 group-hover:scale-110',
        actividad.tipo === 'incidencia' 
          ? 'bg-error-50 border-error-200 text-error-600' 
          : 'bg-primary-50 border-primary-200 text-primary-600'
      )}>
        {actividad.icono}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-1">
          <h4 className="font-semibold text-secondary-800 group-hover:text-primary-700 transition-colors line-clamp-1 text-sm leading-tight">
            {actividad.titulo}
          </h4>
          <span className="text-xs text-secondary-500 whitespace-nowrap flex-shrink-0">
            {formatearTiempo(actividad.fecha)}
          </span>
        </div>
        
        {/* Descripción */}
        <p className="text-xs text-secondary-600 line-clamp-2 leading-relaxed">
          {actividad.descripcion}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          <BadgeEstado estado={actividad.estado} size="sm" />
          <span className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full capitalize',
            actividad.tipo === 'incidencia'
              ? 'bg-error-100 text-error-700'
              : 'bg-primary-100 text-primary-700'
          )}>
            {actividad.tipo}
          </span>
        </div>
      </div>
    </div>
  );
};

// 🎯 Componente de Filtros
const FiltrosActividad = ({ tipoActivo, onChange }) => (
  <div className="flex space-x-1 bg-secondary-100 rounded-lg p-1 w-full sm:w-auto">
    {ACTIVIDAD_CONFIG.filtros.map((filtro) => (
      <button
        key={filtro.key}
        onClick={() => onChange(filtro.key)}
        className={clsx(
          'flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium capitalize',
          tipoActivo === filtro.key
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-secondary-600 hover:text-secondary-800'
        )}
      >
        <span className="text-base">{filtro.icon}</span>
        <span className="hidden sm:inline">{filtro.label}</span>
        <span className="sm:hidden">
          {filtro.key === 'reciente' ? 'Todo' : 
           filtro.key === 'incidencias' ? 'Inc.' : 'Mant.'}
        </span>
      </button>
    ))}
  </div>
);

export default function ResumenActividad({ incidencias, mantenimientos }) {
  const [tipoActividad, setTipoActividad] = useState('reciente');
  
  // ✅ Usar hook personalizado
  const { actividadesOptimizadas, formatearTiempo } = useActividades({
    incidencias,
    mantenimientos
  });

  // ✅ Filtrar actividades
  const actividadesFiltradas = useMemo(() => {
    switch (tipoActividad) {
      case 'incidencias':
        return actividadesOptimizadas.filter(a => a.tipo === 'incidencia');
      case 'mantenimientos':
        return actividadesOptimizadas.filter(a => a.tipo === 'mantenimiento');
      default:
        return actividadesOptimizadas;
    }
  }, [tipoActividad, actividadesOptimizadas]);

  // ✅ Handler optimizado
  const handleCambiarFiltro = useCallback((tipo) => {
    setTipoActividad(tipo);
  }, []);

  // ✅ Estadísticas
  const estadisticas = useMemo(() => ({
    total: actividadesOptimizadas.length,
    incidencias: actividadesOptimizadas.filter(a => a.tipo === 'incidencia').length,
    mantenimientos: actividadesOptimizadas.filter(a => a.tipo === 'mantenimiento').length
  }), [actividadesOptimizadas]);

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-secondary-800 font-heading">
            Actividad Reciente
          </h3>
          <p className="text-secondary-600 text-sm mt-1">
            Últimas actualizaciones del sistema
          </p>
        </div>
        
        <FiltrosActividad 
          tipoActivo={tipoActividad}
          onChange={handleCambiarFiltro}
        />
      </div>

      {/* Lista de Actividades */}
      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-secondary-50 rounded-xl animate-fade-in">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-secondary-600 text-sm font-medium mb-2">
            No hay actividad {tipoActividad !== 'reciente' ? `de ${tipoActividad}` : 'reciente'}
          </p>
          <p className="text-secondary-500 text-xs">
            Las nuevas actividades aparecerán aquí automáticamente
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {actividadesFiltradas.map((actividad, index) => (
            <TarjetaActividad
              key={actividad.id}
              actividad={actividad}
              formatearTiempo={formatearTiempo}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3">
          <div className="flex items-center space-x-4 text-sm text-secondary-600">
            <span className="font-medium">
              {actividadesFiltradas.length} de {estadisticas.total} actividades
            </span>
            <div className="flex space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-error-400 rounded-full"></div>
                <span>{estadisticas.incidencias} incidencias</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span>{estadisticas.mantenimientos} mantenimientos</span>
              </span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/incidencias" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Incidencias</span>
              <span>→</span>
            </Link>
            <Link 
              to="/mantenimientos" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Mantenimientos</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}