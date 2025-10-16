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
  }
};

// 🎯 Hook personalizado para datos de gráficos - CORREGIDO CON ESTRUCTURA REAL
const useDatosGraficos = ({ datos, incidencias }) => {
  // ✅ Datos de rendimiento memoizados
  const datosRendimientoReales = useMemo(() => 
    datos?.plantas || [], 
    [datos?.plantas]
  );

  // ✅ Datos de incidencias por día - CORREGIDO CON ESTRUCTURA REAL
  const datosIncidenciasReales = useMemo(() => {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    const pendientesPorDia = Array(7).fill(0);
    const resueltasPorDia = Array(7).fill(0);
    const enProgresoPorDia = Array(7).fill(0);
    
    // Si no hay incidencias, retornar estructura vacía
    if (!incidencias || incidencias.length === 0) {
      return {
        labels: dias,
        pendientes: pendientesPorDia,
        enProgreso: enProgresoPorDia,
        resueltas: resueltasPorDia,
        total: 0
      };
    }
    
    console.log('🔍 DEBUG - Procesando incidencias:', incidencias);
    
    // Procesar cada incidencia - CORREGIDO: usar estructura real de BD
    incidencias.forEach(incidencia => {
      try {
        // ✅ CORRECCIÓN: Usar fechaReporte que sí existe en tu BD
        let fechaIncidencia;
        if (incidencia.fechaReporte) {
          fechaIncidencia = new Date(incidencia.fechaReporte);
        } else {
          // Si no hay fechaReporte, usar fecha actual como fallback
          fechaIncidencia = new Date();
        }
        
        // Validar fecha
        if (isNaN(fechaIncidencia.getTime())) {
          console.warn('Fecha inválida para incidencia:', incidencia.id, incidencia.fechaReporte);
          fechaIncidencia = new Date(); // Fallback a fecha actual
        }
        
        // Solo incluir incidencias de la última semana
        const unaSemanaAtras = new Date();
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
        
        if (fechaIncidencia >= unaSemanaAtras) {
          const diaSemana = fechaIncidencia.getDay(); // 0=Domingo, 1=Lunes...
          const index = diaSemana === 0 ? 6 : diaSemana - 1; // Ajustar para Lunes=0
          
          // ✅ CORRECCIÓN: Usar el campo 'estado' que sí existe en tu BD
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
            default:
              console.warn('Estado no reconocido:', incidencia.estado, 'en incidencia:', incidencia.id);
              // Contar como pendiente por defecto
              pendientesPorDia[index]++;
          }
        }
      } catch (error) {
        console.warn('Error procesando incidencia:', incidencia.id, error);
      }
    });
    
    const total = pendientesPorDia.reduce((a, b) => a + b, 0) +
                 enProgresoPorDia.reduce((a, b) => a + b, 0) +
                 resueltasPorDia.reduce((a, b) => a + b, 0);
    
    const resultado = {
      labels: dias,
      pendientes: pendientesPorDia,
      enProgreso: enProgresoPorDia,
      resueltas: resueltasPorDia,
      total
    };
    
    console.log('📊 DEBUG - Resultado final del gráfico:', resultado);
    
    return resultado;
  }, [incidencias]);

  // ✅ Altura máxima dinámica para gráficos de barras
  const maxIncidencias = useMemo(() => {
    if (datosIncidenciasReales.total === 0) return 1;
    
    const todosLosValores = [
      ...datosIncidenciasReales.pendientes,
      ...datosIncidenciasReales.enProgreso,
      ...datosIncidenciasReales.resueltas
    ];
    
    const maxValor = Math.max(...todosLosValores);
    
    // Escala adaptativa
    if (maxValor <= 2) return 2;
    if (maxValor <= 5) return 5;
    
    return Math.max(maxValor, 3);
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

// 🎯 Componente de Tarjeta de Métrica - CORREGIDO PARA MÓVIL
const TarjetaMetrica = ({ titulo, valor, subtitulo, color = 'primary', icono }) => (
  <div className={clsx(
    'rounded-xl p-3 sm:p-4 text-center transition-all duration-200 hover:shadow-medium min-w-0',
    GRAFICO_CONFIG.colores[color]?.bg || 'bg-secondary-50'
  )}>
    {icono && <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{icono}</div>}
    <div className={clsx(
      'text-lg sm:text-2xl font-bold font-heading mb-1 truncate',
      GRAFICO_CONFIG.colores[color]?.text || 'text-secondary-700'
    )}>
      {valor}
    </div>
    <div className="text-xs sm:text-sm font-medium text-secondary-600 mb-1 truncate">{titulo}</div>
    {subtitulo && (
      <div className="text-xs text-secondary-500 truncate">{subtitulo}</div>
    )}
  </div>
);

export default function GraficosDashboard({ datos, plantas, incidencias, metricasReales }) {
  const [tipoGrafico, setTipoGrafico] = useState('rendimiento');
  
  // ✅ DEBUG: Ver datos que llegan
  console.log('🔍 DEBUG - Datos recibidos en GraficosDashboard:', {
    incidenciasCount: incidencias?.length,
    primeraIncidencia: incidencias?.[0],
    datos,
    plantasCount: plantas?.length
  });

  // ✅ Usar hook personalizado para datos
  const { 
    datosRendimientoReales, 
    datosIncidenciasReales, 
    maxIncidencias 
  } = useDatosGraficos({ datos, incidencias });

  // ✅ DEBUG: Ver datos procesados
  console.log('🔍 DEBUG - Datos procesados:', {
    datosIncidenciasReales,
    maxIncidencias,
    datosRendimientoReales
  });

  // ✅ Handlers optimizados con useCallback
  const handleCambiarGrafico = useCallback((tipo) => {
    setTipoGrafico(tipo);
  }, []);

  // ✅ Calcular métricas resumen
  const metricasResumen = useMemo(() => ({
    pendientes: incidencias?.filter(i => i.estado === 'pendiente').length || 0,
    enProgreso: incidencias?.filter(i => i.estado === 'en_progreso').length || 0,
    resueltas: incidencias?.filter(i => i.estado === 'resuelto').length || 0,
    totalPlantas: datosRendimientoReales.length
  }), [incidencias, datosRendimientoReales]);

  // ✅ FUNCIÓN CORREGIDA: Calcular altura de barras - GARANTIZADA VISIBLE
  const calcularAlturaBarra = (valor) => {
    if (valor === 0) return '8px';
    
    // Para valores 1-2, usar alturas fijas y visibles
    if (maxIncidencias <= 2) {
      const alturas = {
        1: '60%',   // 1 incidencia = 60% de altura
        2: '90%'    // 2 incidencias = 90% de altura
      };
      return alturas[valor] || '70%';
    }
    
    // Para más valores, escala normal
    const porcentaje = (valor / maxIncidencias) * 80 + 20;
    return `${Math.min(porcentaje, 100)}%`;
  };

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
          {datosRendimientoReales.length > 0 ? (
            datosRendimientoReales.map((planta, index) => (
              <div key={planta.id || index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600 truncate flex-1 pr-4">
                    {planta.nombre}
                  </span>
                  <span className="text-sm font-semibold text-secondary-800 whitespace-nowrap">
                    {planta.tasaResolucion || 0}%
                  </span>
                </div>
                <BarraProgreso 
                  porcentaje={planta.tasaResolucion || 0}
                  color={
                    (planta.tasaResolucion || 0) > 80 ? 'success' :
                    (planta.tasaResolucion || 0) > 60 ? 'primary' :
                    (planta.tasaResolucion || 0) > 40 ? 'warning' : 'error'
                  }
                  altura="h-2 sm:h-3"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-secondary-500">
              No hay datos de plantas disponibles
            </div>
          )}
        </div>
      </div>

      {/* Estado Operativo */}
      <div className="pt-6 border-t border-secondary-200">
        <h4 className="text-sm font-medium text-secondary-700 mb-4 font-sans">
          Estado Operativo por Planta
        </h4>
        {datosRendimientoReales.length > 0 ? (
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
                    {planta.nombre?.split(' ')[0] || 'Planta'}
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
        ) : (
          <div className="text-center py-8 text-secondary-500 bg-secondary-50 rounded-xl">
            <div className="text-3xl mb-2">🏭</div>
            <p className="text-sm">No hay plantas registradas</p>
          </div>
        )}
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
            <p className="text-xs text-secondary-400 mt-1">
              Las nuevas incidencias aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <>
            {/* DEBUG VISUAL TEMPORAL */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-semibold text-blue-800 mb-2">📊 DATOS DEL GRÁFICO</h5>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Total incidencias:</strong> {datosIncidenciasReales.total}</div>
                <div><strong>Máx por día:</strong> {maxIncidencias}</div>
                <div><strong>Datos por día:</strong></div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {datosIncidenciasReales.labels.map((dia, index) => (
                    <div key={dia} className="text-xs">
                      {dia}: P{datosIncidenciasReales.pendientes[index]}-E{datosIncidenciasReales.enProgreso[index]}-R{datosIncidenciasReales.resueltas[index]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenedor del gráfico con scroll horizontal en móvil */}
            <div className="overflow-x-auto pb-4 -mx-2 px-2">
              <div className="min-w-max flex items-end justify-between h-40 sm:h-48 px-2 sm:px-4 border-b border-l border-secondary-200 mb-2 relative">
                {/* Líneas de guía horizontales */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div key={line} className="border-t border-secondary-100"></div>
                  ))}
                </div>
                
                {datosIncidenciasReales.labels.map((dia, index) => (
                  <div 
                    key={dia} 
                    className={clsx(
                      "flex flex-col items-center space-y-2 flex-1 group min-w-0 px-1",
                      dia === 'Dom' && "pr-2"
                    )}
                  >
                    <div className="flex items-end space-x-[2px] sm:space-x-1 h-32 sm:h-36 w-full justify-center relative z-10">
                      {[
                        { tipo: 'pendientes', data: datosIncidenciasReales.pendientes, label: 'Pendientes' },
                        { tipo: 'enProgreso', data: datosIncidenciasReales.enProgreso, label: 'En Progreso' },
                        { tipo: 'resueltas', data: datosIncidenciasReales.resueltas, label: 'Resueltas' }
                      ].map(({ tipo, data, label }) => {
                        const valor = data[index];
                        const altura = calcularAlturaBarra(valor);
                        
                        return (
                          <div
                            key={tipo}
                            className={clsx(
                              'w-3 sm:w-4 rounded-t transition-all duration-500 hover:opacity-80 cursor-help relative',
                              GRAFICO_CONFIG.colores[tipo]?.bar
                            )}
                            style={{
                              height: altura,
                              minHeight: '8px',
                              opacity: valor > 0 ? 1 : 0
                            }}
                            title={`${valor} ${label}`}
                          >
                            {/* Etiqueta de valor - SIEMPRE visible */}
                            {valor > 0 && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-100 whitespace-nowrap pointer-events-none z-20 border border-gray-600">
                                {valor}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className={clsx(
                      "text-xs text-secondary-500 font-medium whitespace-nowrap",
                      dia === 'Dom' && "text-center w-full"
                    )}>
                      {dia}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 px-2">
              {[
                { tipo: 'pendientes', label: 'Pendientes' },
                { tipo: 'enProgreso', label: 'En Progreso' },
                { tipo: 'resueltas', label: 'Resueltas' }
              ].map(({ tipo, label }) => (
                <div key={tipo} className="flex items-center space-x-2">
                  <div className={clsx(
                    'w-3 h-3 rounded flex-shrink-0',
                    GRAFICO_CONFIG.colores[tipo]?.bar
                  )}></div>
                  <span className="text-xs text-secondary-600 whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Resumen de Incidencias */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 min-w-0">
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
    <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-4 sm:p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-secondary-800 font-heading truncate">
            Métricas del Sistema
          </h3>
          <p className="text-secondary-600 text-sm mt-1 truncate">
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
                'flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium min-w-0 flex-1 sm:flex-initial',
                tipoGrafico === key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-800'
              )}
            >
              <span className="text-base">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden text-xs">{label === 'Gestión' ? 'Gest.' : 'Incid.'}</span>
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
          <span className="text-center sm:text-left">
            {metricasResumen.totalPlantas} plantas • {incidencias?.length || 0} incidencias
          </span>
        </div>
      </div>
    </div>
  );
}