import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../stores/dashboardStore';
import { usePlantasStore } from '../stores/plantasStore';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useMantenimientoStore } from '../stores/mantenimientoStore';
import { useReportesStore } from '../stores/reportesStore';
import { useAuthStore } from '../stores/authStore';
import GraficosDashboard from '../components/dashboard/GraficosDashboard';
import ResumenActividad from '../components/dashboard/ResumenActividad';

// 🎨 Constantes para mantener consistencia
const DASHBOARD_CONFIG = {
  limites: {
    plantas: 12,
    incidencias: 15,
    mantenimientos: 12,
    reportes: 50
  },
  colores: {
    optimal: 'bg-success-500',
    attention: 'bg-warning-500', 
    critical: 'bg-error-500',
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-200'
  }
};

export default function Dashboard() {
  // ✅ Stores optimizados
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { metricas, loading: dashboardLoading, error, obtenerMetricas } = useDashboardStore();
  const { plantas, loading: plantasLoading, obtenerPlantas } = usePlantasStore();
  const { incidencias, obtenerIncidencias } = useIncidenciasStore();
  const { mantenimientos, obtenerMantenimientos } = useMantenimientoStore();
  const { reportes, obtenerReportes } = useReportesStore();
  
  const [periodo, setPeriodo] = useState('hoy');
  const [cargandoSecciones, setCargandoSecciones] = useState({
    metricas: true,
    plantas: true,
    incidencias: false,
    mantenimientos: false,
    reportes: false
  });

  // ✅ Roles memoizados
  const { esCliente, esTecnico, esAdmin, puedeVerDashboard } = useMemo(() => ({
    esCliente: user?.rol === 'cliente',
    esTecnico: user?.rol === 'tecnico',
    esAdmin: user?.rol === 'admin',
    puedeVerDashboard: ['tecnico', 'admin'].includes(user?.rol)
  }), [user?.rol]);

  // ✅ Cálculo de métricas optimizado
  const calcularMetricasPlanta = useCallback((plantaId) => {
    const incidenciasPlanta = incidencias.filter(i => i.plantId === plantaId);
    const mantenimientosPlanta = mantenimientos.filter(m => m.plantId === plantaId);
    const reportesPlanta = reportes?.filter(r => r.plantId === plantaId) || [];

    const incidenciasResueltas = incidenciasPlanta.filter(i => i.estado === 'resuelto').length;
    const mantenimientosPreventivos = mantenimientosPlanta.filter(m => m.tipo === 'preventivo').length;
    const mantenimientosCompletados = mantenimientosPlanta.filter(m => m.estado === 'completado').length;
    
    // Cálculos optimizados
    const totalIncidencias = incidenciasPlanta.length;
    const totalMantenimientos = mantenimientosPlanta.length;
    
    const tasaResolucion = totalIncidencias > 0 
      ? Math.round((incidenciasResueltas / totalIncidencias) * 100)
      : 100;

    const ratioMantenimientoPreventivo = totalMantenimientos > 0
      ? Math.round((mantenimientosPreventivos / totalMantenimientos) * 100)
      : 0;

    const tasaCumplimientoMantenimiento = totalMantenimientos > 0
      ? Math.round((mantenimientosCompletados / totalMantenimientos) * 100)
      : 100;

    // Estado general optimizado
    const incidenciasPendientes = incidenciasPlanta.filter(i => i.estado !== 'resuelto').length;
    const mantenimientosAtrasados = mantenimientosPlanta.filter(m => 
      m.estado !== 'completado' && new Date(m.fechaProgramada) < new Date()
    ).length;

    let estadoGeneral = 'optimal';
    if (incidenciasPendientes > 2 || mantenimientosAtrasados > 1) estadoGeneral = 'critical';
    else if (incidenciasPendientes > 0 || mantenimientosAtrasados > 0) estadoGeneral = 'attention';

    return {
      incidenciasActivas: incidenciasPendientes,
      totalIncidencias,
      incidenciasResueltas,
      tasaResolucion,
      mantenimientosPendientes: mantenimientosPlanta.filter(m => m.estado !== 'completado').length,
      totalMantenimientos,
      mantenimientosPreventivos,
      mantenimientosCorrectivos: totalMantenimientos - mantenimientosPreventivos,
      mantenimientosCompletados,
      ratioMantenimientoPreventivo,
      ratioMantenimientoCorrectivo: 100 - ratioMantenimientoPreventivo,
      tasaCumplimientoMantenimiento,
      reportesGenerados: reportesPlanta.length,
      estadoGeneral,
      nivelActividad: Math.min((totalIncidencias + totalMantenimientos + reportesPlanta.length) / 10 * 100, 100)
    };
  }, [incidencias, mantenimientos, reportes]);

  // ✅ Datos optimizados con cálculos más eficientes
  const datosOptimizados = useMemo(() => {
    const incidenciasPendientes = incidencias.filter(i => i.estado === 'pendiente').length;
    const incidenciasEnProgreso = incidencias.filter(i => i.estado === 'en_progreso').length;
    const incidenciasResueltas = incidencias.filter(i => i.estado === 'resuelto').length;
    const mantenimientosPendientes = mantenimientos.filter(m => m.estado !== 'completado').length;
    
    const mantenimientosAtrasados = mantenimientos.filter(m => 
      m.estado !== 'completado' && new Date(m.fechaProgramada) < new Date()
    ).length;

    // Plantas únicas optimizado
    const plantasUnicas = [...new Map(plantas.map(planta => [planta.id, planta])).values()];
    const plantasConMetricas = plantasUnicas
      .slice(0, 5)
      .map(planta => ({
        ...planta,
        ...calcularMetricasPlanta(planta.id)
      }));

    return {
      metricasRapidas: {
        incidenciasPendientes,
        incidenciasEnProgreso,
        incidenciasResueltas,
        mantenimientosPendientes,
        mantenimientosAtrasados,
        totalReportes: reportes?.length || 0,
        totalPlantas: plantasUnicas.length
      },
      
      graficos: {
        plantas: plantasConMetricas,
        incidencias: { pendientes: incidenciasPendientes, enProgreso: incidenciasEnProgreso, resueltas: incidenciasResueltas },
        metricasReales: metricas?.metricas
      },
      
      plantasOptimizadas: plantasUnica.slice(0, 8),
      plantasResumen: plantasConMetricas
    };
  }, [plantas, incidencias, mantenimientos, reportes, metricas, calcularMetricasPlanta]);

  // ✅ Carga de datos optimizada
  useEffect(() => {
    if (esCliente) return;

    const cargarDatosCompletos = async () => {
      setCargandoSecciones(prev => ({ 
        ...prev, 
        metricas: true, 
        plantas: true,
        incidencias: true,
        mantenimientos: true,
        reportes: true 
      }));
      
      try {
        await Promise.allSettled([
          obtenerMetricas(),
          obtenerPlantas(DASHBOARD_CONFIG.limites.plantas),
          obtenerIncidencias(DASHBOARD_CONFIG.limites.incidencias),
          obtenerMantenimientos(DASHBOARD_CONFIG.limites.mantenimientos),
          obtenerReportes(DASHBOARD_CONFIG.limites.reportes, 1, true)
        ]);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setCargandoSecciones({
          metricas: false,
          plantas: false,
          incidencias: false,
          mantenimientos: false,
          reportes: false
        });
      }
    };

    cargarDatosCompletos();
  }, [esCliente, obtenerMetricas, obtenerPlantas, obtenerIncidencias, obtenerMantenimientos, obtenerReportes]);

  // ✅ Estados de loading optimizados
  const loadingPrincipal = useMemo(() => 
    authLoading || cargandoSecciones.metricas || cargandoSecciones.plantas,
    [authLoading, cargandoSecciones.metricas, cargandoSecciones.plantas]
  );

  const loadingContenido = useMemo(() =>
    cargandoSecciones.incidencias || cargandoSecciones.mantenimientos || cargandoSecciones.reportes,
    [cargandoSecciones.incidencias, cargandoSecciones.mantenimientos, cargandoSecciones.reportes]
  );

  // ✅ Componente de Acceso Denegado
  const AccesoDenegado = () => (
    <div className="min-h-screen bg-gradient-light p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-center max-w-md w-full shadow-soft border border-secondary-100">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl sm:text-2xl font-bold text-secondary-800 mb-2 font-heading">
          Acceso Restringido
        </h2>
        <p className="text-secondary-600 mb-6 text-sm sm:text-base leading-relaxed">
          Como cliente, puedes gestionar tus incidencias desde la sección correspondiente.
        </p>
        <Link 
          to="/incidencias"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium w-full sm:w-auto text-sm sm:text-base"
        >
          Ir a Mis Incidencias
        </Link>
      </div>
    </div>
  );

  // ✅ Componente de Loading Mejorado
  const SkeletonLoading = () => (
    <div className="min-h-screen bg-gradient-light p-4 sm:p-6 animate-fade-in">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <div className="space-y-3">
            <div className="h-8 bg-secondary-200 rounded-2xl w-48 sm:w-64"></div>
            <div className="h-4 bg-secondary-200 rounded-2xl w-64 sm:w-96"></div>
          </div>
        </div>
        
        {/* Grid de Tarjetas Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-pulse">
              <div className="h-4 bg-secondary-200 rounded-xl w-1/2 mb-4"></div>
              <div className="h-8 bg-secondary-200 rounded-xl w-3/4 mb-3"></div>
              <div className="h-3 bg-secondary-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
        
        {/* Contenido Principal Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 h-80"></div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 h-64"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 h-64"></div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 h-80"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ Renderizado condicional temprano
  if (esCliente) return <AccesoDenegado />;
  if (!puedeVerDashboard && !authLoading) return <AccesoDenegado />;
  if (loadingPrincipal) return <SkeletonLoading />;

  // ✅ Componente de Tarjetas Métricas
  const TarjetasMetricas = () => {
    const tarjetas = [
      {
        valor: datosOptimizados.metricasRapidas.incidenciasPendientes,
        titulo: "Incidencias Pendientes",
        descripcion: "Requieren atención inmediata",
        color: "bg-error-50 border-error-200 text-error-600",
        icono: "⚠️"
      },
      {
        valor: datosOptimizados.metricasRapidas.mantenimientosPendientes,
        titulo: "Mantenimientos",
        descripcion: "Programados esta semana",
        color: "bg-primary-50 border-primary-200 text-primary-600",
        icono: "🔧"
      },
      {
        valor: datosOptimizados.metricasRapidas.mantenimientosAtrasados,
        titulo: "Atrasados",
        descripcion: "Resolver urgentemente",
        color: "bg-warning-50 border-warning-200 text-warning-600",
        icono: "⏰"
      },
      {
        valor: datosOptimizados.metricasRapidas.totalReportes,
        titulo: "Reportes",
        descripcion: "Generados este mes",
        color: "bg-success-50 border-success-200 text-success-600",
        icono: "📊"
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {tarjetas.map((tarjeta, index) => (
          <div 
            key={index}
            className={`${tarjeta.color} rounded-2xl p-4 sm:p-6 shadow-soft border-2 transition-all duration-300 hover:shadow-medium hover:scale-105 animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{tarjeta.icono}</div>
              <div className="text-2xl sm:text-3xl font-bold font-heading">
                {tarjeta.valor}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-sm sm:text-base">{tarjeta.titulo}</div>
              <div className="text-xs sm:text-sm opacity-80">{tarjeta.descripcion}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-light p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* ✅ HEADER MEJORADO */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-fade-in-down">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary-800 to-primary-600 bg-clip-text text-transparent font-heading">
              {esAdmin ? 'Centro de Operaciones' : 'Panel Técnico'}
            </h1>
            <p className="text-secondary-600 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
              {esAdmin ? 'Gestión completa del sistema' : 'Gestión técnica de plantas'}
              {user?.nombre && ` • ${user.nombre}`}
            </p>
          </div>
          
          {esAdmin && (
            <Link
              to="/plantas/crear"
              className="bg-gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-large transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg w-full lg:w-auto justify-center"
            >
              <span className="text-lg">+</span>
              Crear Nueva Planta
            </Link>
          )}
        </div>
      </div>

      {/* ✅ TARJETAS DE MÉTRICAS */}
      <TarjetasMetricas />

      {/* ✅ MENSAJE DE ERROR MEJORADO */}
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 p-4 sm:p-6 rounded-2xl flex items-center gap-4 shadow-soft animate-fade-in">
          <div className="w-8 h-8 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-error-500 text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">Error al cargar datos</p>
            <p className="text-error-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ✅ CONTENIDO PRINCIPAL */}
      {loadingContenido ? (
        <div className="bg-white rounded-2xl p-8 shadow-soft border border-secondary-100 text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Cargando datos del sistema...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* COLUMNA PRINCIPAL */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-scale-in">
              <GraficosDashboard 
                datos={datosOptimizados.graficos}
                plantas={datosOptimizados.plantasOptimizadas}
                incidencias={incidencias}
                metricasReales={metricas?.metricas}
              />
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-fade-in-up">
              <ResumenActividad 
                incidencias={incidencias}
                mantenimientos={mantenimientos}
              />
            </div>
          </div>

          {/* ✅ SIDEBAR MEJORADO */}
          <div className="space-y-6">
            {/* PLANTAS ACTIVAS */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-slide-in-right">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-secondary-800 font-heading">
                  Plantas Activas
                </h3>
                <Link
                  to="/plantas"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                >
                  Ver todas →
                </Link>
              </div>
              
              <div className="space-y-4">
                {datosOptimizados.plantasResumen.map((planta, index) => (
                  <Link 
                    key={planta.id} 
                    to={`/plantas/${planta.id}`}
                    className="flex items-center p-4 border border-secondary-100 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-medium">
                      {planta.nombre.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="font-semibold text-secondary-800 group-hover:text-primary-700 transition-colors truncate">
                        {planta.nombre}
                      </h4>
                      <p className="text-secondary-600 text-sm truncate">{planta.ubicacion}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      DASHBOARD_CONFIG.colores[planta.estadoGeneral]
                    }`}></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* RESUMEN RÁPIDO */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-fade-in-up">
              <h3 className="text-lg font-semibold text-secondary-800 mb-6 font-heading">
                Resumen Rápido
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Plantas totales', valor: datosOptimizados.metricasRapidas.totalPlantas, color: 'text-secondary-800' },
                  { label: 'Incidencias resueltas', valor: datosOptimizados.metricasRapidas.incidenciasResueltas, color: 'text-success-600' },
                  { label: 'Reportes generados', valor: datosOptimizados.metricasRapidas.totalReportes, color: 'text-primary-600' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg transition-all duration-200 hover:bg-secondary-100"
                  >
                    <span className="text-secondary-700 font-medium">{item.label}</span>
                    <span className={`font-bold text-lg ${item.color}`}>{item.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}