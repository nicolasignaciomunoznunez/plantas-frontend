import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../stores/dashboardStore';
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
  // ✅ Stores optimizados - SOLO 2 stores necesarios
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { 
    datosCompletos, 
    loading: dashboardLoading, 
    error, 
    obtenerDashboardCompleto,
    fromCache 
  } = useDashboardStore();
  
  const [periodo, setPeriodo] = useState('hoy');
  const [cargandoSecciones, setCargandoSecciones] = useState({
    metricas: true,
    plantas: true,
    incidencias: false,
    mantenimientos: false,
    reportes: false
  });

  // ✅ ROLES optimizados
  const { esCliente, esTecnico, esAdmin, esSuperAdmin, puedeVerDashboard } = useMemo(() => ({
    esCliente: user?.rol === 'cliente',
    esTecnico: user?.rol === 'tecnico',
    esAdmin: user?.rol === 'admin',
    esSuperAdmin: user?.rol === 'superadmin',
    puedeVerDashboard: ['superadmin', 'admin', 'tecnico'].includes(user?.rol)
  }), [user?.rol]);

  // ✅ DATOS OPTIMIZADOS - Sin cálculos complejos en frontend
  const datosOptimizados = useMemo(() => {
    if (!datosCompletos) {
      return {
        metricasRapidas: {
          incidenciasPendientes: 0,
          incidenciasEnProgreso: 0,
          incidenciasResueltas: 0,
          mantenimientosPendientes: 0,
          mantenimientosAtrasados: 0,
          totalReportes: 0,
          totalPlantas: 0
        },
        graficos: {
          plantas: [],
          incidencias: { pendientes: 0, enProgreso: 0, resueltas: 0 },
          metricasReales: null
        },
        plantasOptimizadas: [],
        plantasResumen: []
      };
    }

    // ✅ Datos ya vienen procesados del backend
    const metricas = datosCompletos.metricas || {};
    const plantas = datosCompletos.plantas || [];
    const incidenciasRecientes = datosCompletos.incidenciasRecientes || [];
    const mantenimientosPendientes = datosCompletos.mantenimientosPendientes || [];

    // ✅ Cálculos simples con datos ya filtrados
    const incidenciasPendientes = incidenciasRecientes.filter(i => i.estado === 'pendiente').length;
    const incidenciasEnProgreso = incidenciasRecientes.filter(i => i.estado === 'en_progreso').length;
    const incidenciasResueltas = incidenciasRecientes.filter(i => i.estado === 'resuelto').length;
    
    const mantenimientosAtrasados = mantenimientosPendientes.filter(m => 
      new Date(m.fechaProgramada) < new Date()
    ).length;

    return {
      metricasRapidas: {
        incidenciasPendientes,
        incidenciasEnProgreso,
        incidenciasResueltas,
        mantenimientosPendientes: metricas.mantenimientosPendientes || 0,
        mantenimientosAtrasados,
        totalReportes: 0, // Agregar si se necesitan reportes
        totalPlantas: metricas.totalPlantas || 0
      },
      
      graficos: {
        plantas: plantas,
        incidencias: { 
          pendientes: incidenciasPendientes, 
          enProgreso: incidenciasEnProgreso, 
          resueltas: incidenciasResueltas 
        },
        metricasReales: metricas
      },
      
      plantasOptimizadas: plantas.slice(0, 8),
      plantasResumen: plantas.slice(0, 5)
    };
  }, [datosCompletos]);

  // ✅ CARGA OPTIMIZADA - UNA SOLA LLAMADA
  useEffect(() => {
    if (esCliente) return;

    const cargarDashboard = async () => {
      setCargandoSecciones({
        metricas: true,
        plantas: true,
        incidencias: true,
        mantenimientos: true,
        reportes: true
      });
      
      try {
        // ✅ SOLO UNA LLAMADA AL BACKEND
        await obtenerDashboardCompleto();
      } catch (err) {
        console.error('Error cargando dashboard:', err);
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

    cargarDashboard();
  }, [esCliente, obtenerDashboardCompleto]);

  // ✅ ESTADOS DE LOADING optimizados
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
        descripcion: fromCache ? "Desde cache" : "Requieren atención inmediata",
        color: "bg-error-50 border-error-200 text-error-600",
        icono: "⚠️"
      },
      {
        valor: datosOptimizados.metricasRapidas.mantenimientosPendientes,
        titulo: "Mantenimientos",
        descripcion: fromCache ? "Desde cache" : "Programados esta semana",
        color: "bg-primary-50 border-primary-200 text-primary-600",
        icono: "🔧"
      },
      {
        valor: datosOptimizados.metricasRapidas.mantenimientosAtrasados,
        titulo: "Atrasados",
        descripcion: fromCache ? "Desde cache" : "Resolver urgentemente",
        color: "bg-warning-50 border-warning-200 text-warning-600",
        icono: "⏰"
      },
      {
        valor: datosOptimizados.metricasRapidas.totalReportes,
        titulo: "Reportes",
        descripcion: fromCache ? "Desde cache" : "Generados este mes",
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
      {/* ✅ HEADER MEJORADO CON INDICADOR DE CACHE */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-fade-in-down">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary-800 to-primary-600 bg-clip-text text-transparent font-heading">
              {esSuperAdmin ? 'Panel Super Admin' :  
               esAdmin ? 'Centro de Operaciones' : 'Panel Técnico'}
            </h1>
            <p className="text-secondary-600 flex items-center gap-2 text-sm sm:text-base">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                fromCache ? 'bg-warning-500' : 'bg-success-500'
              }`}></span>
              {fromCache ? 'Datos en cache • ' : 'Datos en tiempo real • '}
              {esSuperAdmin ? 'Gestión total del sistema' : 
               esAdmin ? 'Gestión completa del sistema' : 'Gestión técnica de plantas'}
              {user?.nombre && ` • ${user.nombre}`}
            </p>
          </div>
          
          {/* ✅ BOTÓN CREAR PLANTA */}
          {(esSuperAdmin || esAdmin) && (
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

      {/* ✅ CONTENIDO PRINCIPAL OPTIMIZADO */}
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
                datos={{ plantas: datosOptimizados.graficos.plantas }}
                plantas={datosOptimizados.graficos.plantas}
                incidencias={datosCompletos?.incidenciasRecientes || []}
                metricasReales={datosOptimizados.graficos.metricasReales}
              />
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100 animate-fade-in-up">
              <ResumenActividad 
                incidencias={datosCompletos?.incidenciasRecientes || []}
                mantenimientos={datosCompletos?.mantenimientosPendientes || []}
              />
            </div>
          </div>

          {/* ✅ SIDEBAR OPTIMIZADO */}
          <div className="space-y-6">
            {/* PLANTAS ACTIVAS */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-secondary-100 animate-slide-in-right">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-secondary-800 font-heading truncate">
                  Plantas Activas
                </h3>
                <Link
                  to="/plantas"
                  className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 ml-2"
                >
                  Ver todas →
                </Link>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {datosOptimizados.plantasResumen.map((planta, index) => (
                  <Link 
                    key={planta.id} 
                    to={`/plantas/${planta.id}`}
                    className="flex items-center p-3 sm:p-4 border border-secondary-100 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group animate-fade-in-up min-w-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-medium flex-shrink-0">
                      {planta.nombre.charAt(0)}
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <h4 className="font-semibold text-secondary-800 group-hover:text-primary-700 transition-colors truncate text-sm sm:text-base">
                        {planta.nombre}
                      </h4>
                      <p className="text-secondary-600 text-xs sm:text-sm truncate">{planta.ubicacion}</p>
                    </div>
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                      DASHBOARD_CONFIG.colores[planta.estados?.estado || 'optimal']
                    }`}></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* RESUMEN RÁPIDO */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-secondary-100 animate-fade-in-up">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-4 sm:mb-6 font-heading">
                Resumen Rápido
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: 'Plantas totales', valor: datosOptimizados.metricasRapidas.totalPlantas, color: 'text-secondary-800' },
                  { label: 'Incidencias resueltas', valor: datosOptimizados.metricasRapidas.incidenciasResueltas, color: 'text-success-600' },
                  { label: 'Eficiencia promedio', valor: `${datosOptimizados.graficos.metricasReales?.eficienciaPromedio || 0}%`, color: 'text-primary-600' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-2 sm:p-3 bg-secondary-50 rounded-lg transition-all duration-200 hover:bg-secondary-100 min-w-0"
                  >
                    <span className="text-secondary-700 font-medium text-xs sm:text-sm truncate">{item.label}</span>
                    <span className={`font-bold text-base sm:text-lg ${item.color} flex-shrink-0 ml-2`}>{item.valor}</span>
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