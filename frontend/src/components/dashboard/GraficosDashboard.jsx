import { useState, useMemo, useCallback } from 'react';
import { clsx } from 'clsx';

// 🎨 Constantes para consistencia visual
const GRAFICO_CONFIG = {
  colores: {
    optimal: {
      bg: 'bg-success-50 border-success-200',
      text: 'text-success-600',
      bar: 'bg-success-500',
      indicator: 'bg-success-400'
    },
    stable: {
      bg: 'bg-primary-50 border-primary-200', 
      text: 'text-primary-600',
      bar: 'bg-primary-500',
      indicator: 'bg-primary-400'
    },
    attention: {
      bg: 'bg-warning-50 border-warning-200',
      text: 'text-warning-600',
      bar: 'bg-warning-500',
      indicator: 'bg-warning-400'
    },
    critical: {
      bg: 'bg-error-50 border-error-200',
      text: 'text-error-600',
      bar: 'bg-error-500',
      indicator: 'bg-error-400'
    },
    pendiente: {
      bg: 'bg-error-50',
      bar: 'bg-error-400',
      text: 'text-error-600'
    },
    resuelta: {
      bg: 'bg-success-50', 
      bar: 'bg-success-400',
      text: 'text-success-600'
    },
    en_progreso: {
      bg: 'bg-primary-50',
      bar: 'bg-primary-400',
      text: 'text-primary-600'
    }
  },
  breakpoints: {
    mobile: 640,
    tablet: 1024
  }
};

// 🎯 Hook personalizado para datos de gráficos
const useDatosGraficos = ({ datos, incidencias }) => {
  // ✅ Datos de rendimiento memoizados
  const datosRendimientoReales = useMemo(() => 
    datos?.plantas || [], 
    [datos?.plantas]
  );

  // ✅ Datos de incidencias por día optimizados
  const datosIncidenciasReales = useMemo(() => {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
    
    const incidenciasRecientes = incidencias.filter(incidencia => {
      if (!incidencia.fechaReporte) return false;
      return new Date(incidencia.fechaReporte) >= unaSemanaAtras;
    });
    
    const pendientesPorDia = Array(7).fill(0);
    const resueltasPorDia = Array(7).fill(0);
    const enProgresoPorDia = Array(7).fill(0);
    
    incidenciasRecientes.forEach(incidencia => {
      const fecha = new Date(incidencia.fechaReporte);
      const diaSemana = fecha.getDay();
      const index = diaSemana === 0 ? 6 : diaSemana - 1;
      
      switch(incidencia.estado) {
        case 'pendiente':
          pendientesPorDia[index]++;
          break;
        case 'en_progreso':
          enProgresoPorDia[index]++;
          break;
        case 'resuelto':
          resueltasPorDia[index]++;
          break;
      }
    });
    
    return {
      labels: dias,
      pendientes: pendientesPorDia,
      enProgreso: enProgresoPorDia,
      resueltas: resueltasPorDia,
      total: incidenciasRecientes.length
    };
  }, [incidencias]);

  // ✅ Altura máxima dinámica para gráficos de barras
  const maxIncidencias = useMemo(() => {
    const todosLosValores = [
      ...datosIncidenciasReales.pendientes,
      ...datosIncidenciasReales.enProgreso,
      ...datosIncidenciasReales.resueltas
    ];
    return Math.max(...todosLosValores, 1);
  }, [datosIncidenciasReales]);

  return {
    datosRendimientoReales,
    datosIncidenciasReales,
    maxIncidencias
  };
};

// 🎯 Componente de Barra de Progreso Reutilizable
const BarraProgreso = ({ 
  porcentaje, 
  color = 'primary', 
  altura = 'h-2',
  mostrarValor = false,
  etiqueta 
}) => {
  const colores = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  };

  return (
    <div className="space-y-1">
      {etiqueta && (
        <div className="flex justify-between text-xs text-secondary-600">
          <span>{etiqueta}</span>
          {mostrarValor && <span>{porcentaje}%</span>}
        </div>
      )}
      <div className={`w-full bg-secondary-200 rounded-full ${altura}`}>
        <div 
          className={`${colores[color]} rounded-full transition-all duration-500 ease-out ${altura}`}
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

// 🎯 Componente de Tarjeta de Métrica
const TarjetaMetrica = ({ titulo, valor, subtitulo, color = 'primary', icono }) => (
  <div className={clsx(
    'rounded-xl p-4 text-center transition-all duration-200 hover:shadow-medium',
    GRAFICO_CONFIG.colores[color]?.bg || 'bg-secondary-50'
  )}>
    {icono && <div className="text-2xl mb-2">{icono}</div>}
    <div className={clsx(
      'text-2xl font-bold font-heading mb-1',
      GRAFICO_CONFIG.colores[color]?.text || 'text-secondary-700'
    )}>
      {valor}
    </div>
    <div className="text-sm font-medium text-secondary-600 mb-1">{titulo}</div>
    {subtitulo && (
      <div className="text-xs text-secondary-500">{subtitulo}</div>
    )}
  </div>
);

export default function GraficosDashboard({ datos, plantas, incidencias, metricasReales }) {
  const [tipoGrafico, setTipoGrafico] = useState('rendimiento');
  
  // ✅ Usar hook personalizado para datos
  const { 
    datosRendimientoReales, 
    datosIncidenciasReales, 
    maxIncidencias 
  } = useDatosGraficos({ datos, incidencias });

  // ✅ Handlers optimizados con useCallback
  const handleCambiarGrafico = useCallback((tipo) => {
    setTipoGrafico(tipo);
  }, []);

  // ✅ Calcular métricas resumen
  const metricasResumen = useMemo(() => ({
    pendientes: incidencias.filter(i => i.estado === 'pendiente').length,
    enProgreso: incidencias.filter(i => i.estado === 'en_progreso').length,
    resueltas: incidencias.filter(i => i.estado === 'resuelto').length,
    totalPlantas: datosRendimientoReales.length
  }), [incidencias, datosRendimientoReales]);

  // ✅ Renderizado condicional de gráficos
  const renderGraficoRendimiento = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Tasa de Resolución */}
      <div>
        <h4 className="text-sm font-medium text-secondary-700 mb-4 font-sans">
          Tasa de Resolución de Incidencias
          {metricasReales && (
            <span className="text-xs text-secondary-500 ml-2 hidden sm:inline">
              (Promedio del sistema)
            </span>
          )}
        </h4>
        <div className="space-y-4">
          {datosRendimientoReales.map((planta, index) => (
            <div key={planta.id || index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600 truncate flex-1 pr-4">
                  {planta.nombre}
                </span>
                <span className="text-sm font-semibold text-secondary-800 whitespace-nowrap">
                  {planta.tasaResolucion}%
                </span>
              </div>
              <BarraProgreso 
                porcentaje={planta.tasaResolucion}
                color={
                  planta.tasaResolucion > 80 ? 'success' :
                  planta.tasaResolucion > 60 ? 'primary' :
                  planta.tasaResolucion > 40 ? 'warning' : 'error'
                }
                altura="h-2 sm:h-3"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Estado Operativo */}
      <div className="pt-6 border-t border-secondary-200">
        <h4 className="text-sm font-medium text-secondary-700 mb-4 font-sans">
          Estado Operativo por Planta
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {datosRendimientoReales.map((planta, index) => (
            <div key={planta.id || index} className="text-center group">
              <div className={clsx(
                'relative h-20 sm:h-24 rounded-xl border-2 transition-all duration-300 group-hover:scale-105',
                GRAFICO_CONFIG.colores[planta.estadoGeneral]?.bg || 'bg-secondary-50 border-secondary-200'
              )}>
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <div>
                    <div className={clsx(
                      'text-lg sm:text-xl font-bold font-heading',
                      GRAFICO_CONFIG.colores[planta.estadoGeneral]?.text || 'text-secondary-600'
                    )}>
                      {planta.incidenciasActivas || 0}
                    </div>
                    <div className="text-xs text-secondary-500 mt-1 hidden sm:block">
                      Activas
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-xs text-secondary-600 truncate px-1">
                  {planta.nombre.split(' ')[0]}
                </div>
                <div className={clsx(
                  'text-xs font-semibold',
                  GRAFICO_CONFIG.colores[planta.estadoGeneral]?.text || 'text-secondary-600'
                )}>
                  {planta.estadoGeneral === 'optimal' ? 'Óptimo' :
                   planta.estadoGeneral === 'attention' ? 'Atención' :
                   planta.estadoGeneral === 'critical' ? 'Crítico' : 'Estable'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGraficoIncidencias = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Gráfico de Barras */}
      <div>
        <h4 className="text-sm font-medium text-secondary-700 mb-4 font-sans">
          Incidencias de la Última Semana
          <span className="text-xs text-secondary-500 ml-2">
            (Total: {datosIncidenciasReales.total})
          </span>
        </h4>

        {datosIncidenciasReales.total === 0 ? (
          <div className="text-center py-8 text-secondary-500 bg-secondary-50 rounded-xl">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm">No hay incidencias en la última semana</p>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between h-40 sm:h-48 px-2 sm:px-4 border-b border-l border-secondary-200 mb-4">
              {datosIncidenciasReales.labels.map((dia, index) => (
                <div key={dia} className="flex flex-col items-center space-y-2 flex-1 group">
                  <div className="flex items-end space-x-1 h-32 sm:h-36 w-full justify-center">
                    {['pendientes', 'enProgreso', 'resueltas'].map((tipo) => (
                      <div
                        key={tipo}
                        className={clsx(
                          'w-3 sm:w-4 rounded-t transition-all duration-500 hover:opacity-80 cursor-help',
                          GRAFICO_CONFIG.colores[tipo]?.bar,
                          datosIncidenciasReales[tipo][index] === 0 && 'opacity-0'
                        )}
                        style={{
                          height: `${(datosIncidenciasReales[tipo][index] / maxIncidencias) * 100}%`,
                          minHeight: datosIncidenciasReales[tipo][index] > 0 ? '4px' : '0px'
                        }}
                        title={`${datosIncidenciasReales[tipo][index]} ${tipo}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-secondary-500 font-medium">{dia}</div>
                </div>
              ))}
            </div>

            {/* Leyenda */}
            <div className="flex justify-center space-x-6 mt-4">
              {[
                { tipo: 'pendientes', label: 'Pendientes' },
                { tipo: 'enProgreso', label: 'En Progreso' },
                { tipo: 'resueltas', label: 'Resueltas' }
              ].map(({ tipo, label }) => (
                <div key={tipo} className="flex items-center space-x-2">
                  <div className={clsx(
                    'w-3 h-3 rounded',
                    GRAFICO_CONFIG.colores[tipo]?.bar
                  )}></div>
                  <span className="text-xs text-secondary-600">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Resumen de Incidencias */}
      <div className="grid grid-cols-3 gap-4">
        <TarjetaMetrica
          titulo="Pendientes"
          valor={metricasResumen.pendientes}
          color="pendiente"
          icono="⏳"
        />
        <TarjetaMetrica
          titulo="En Progreso"
          valor={metricasResumen.enProgreso}
          color="en_progreso"
          icono="🔄"
        />
        <TarjetaMetrica
          titulo="Resueltas"
          valor={metricasResumen.resueltas}
          color="resuelta"
          icono="✅"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-secondary-800 font-heading">
            Métricas del Sistema
          </h3>
          <p className="text-secondary-600 text-sm mt-1">
            {tipoGrafico === 'rendimiento' ? 'Rendimiento y estado de plantas' : 'Seguimiento de incidencias'}
          </p>
        </div>
        
        <div className="flex space-x-1 bg-secondary-100 rounded-lg p-1 w-full sm:w-auto">
          {[
            { key: 'rendimiento', label: 'Gestión', icon: '📊' },
            { key: 'incidencias', label: 'Incidencias', icon: '🚨' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleCambiarGrafico(key)}
              className={clsx(
                'flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                tipoGrafico === key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-800'
              )}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del Gráfico */}
      {tipoGrafico === 'rendimiento' ? renderGraficoRendimiento() : renderGraficoIncidencias()}

      {/* Footer Informativo */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-secondary-500">
          <span>
            Actualizado {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <span>
            {metricasResumen.totalPlantas} plantas monitorizadas • {incidencias.length} incidencias totales
          </span>
        </div>
      </div>
    </div>
  );
}