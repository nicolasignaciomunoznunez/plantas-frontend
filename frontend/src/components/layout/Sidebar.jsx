import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { clsx } from 'clsx';

// 🎨 Configuración centralizada
const SIDEBAR_CONFIG = {
  sizes: {
    collapsed: {
      width: 'w-20',
      padding: 'px-3'
    },
    expanded: {
      width: 'w-72 lg:w-64',
      padding: 'px-4'
    },
    mobile: {
      width: 'w-80'
    }
  },
  transitions: {
    duration: 'duration-300',
    timing: 'ease-in-out'
  },
  breakpoints: {
    mobile: 1024
  }
};

export default function Sidebar({ isCollapsed, onToggleCollapse, className = '' }) {
  const { user } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detectar móvil optimizado
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < SIDEBAR_CONFIG.breakpoints.mobile;
      setIsMobile(mobile);
      if (mobile) {
        onToggleCollapse(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [onToggleCollapse]);

  // ✅ Roles memoizados
  const { esCliente, esTecnico, esAdmin } = useMemo(() => ({
    esCliente: user?.rol === 'cliente',
    esTecnico: user?.rol === 'tecnico',
    esAdmin: user?.rol === 'admin'
  }), [user?.rol]);

  // ✅ Navegación optimizada
  const navigation = useMemo(() => [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      visible: !esCliente
    },
    { 
      name: 'Plantas', 
      href: '/plantas', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      visible: !esCliente
    },
    { 
      name: 'Incidencias', 
      href: '/incidencias', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      visible: true
    },
    { 
      name: 'Mantenimiento', 
      href: '/mantenimientos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      visible: !esCliente
    },
    { 
      name: 'Reportes', 
      href: '/reportes', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      visible: !esCliente
    },
  ], [esCliente]);

  const navigationFiltrada = useMemo(() => 
    navigation.filter(item => item.visible),
    [navigation]
  );

  // ✅ Handlers optimizados
  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleToggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const handleToggleCollapse = useCallback(() => {
    onToggleCollapse(!isCollapsed);
  }, [isCollapsed, onToggleCollapse]);

  // ✅ Clases dinámicas optimizadas
  const sidebarClasses = clsx(
    'bg-white shadow-soft border-r border-secondary-100',
    'transition-all duration-300 ease-in-out',
    'fixed lg:relative z-50 h-screen lg:h-full',
    'flex flex-col',
    isMobileOpen ? 'translate-x-0 shadow-large' : '-translate-x-full lg:translate-x-0',
    isCollapsed ? SIDEBAR_CONFIG.sizes.collapsed.width : SIDEBAR_CONFIG.sizes.expanded.width,
    className
  );

  return (
    <>
      {/* ✅ Overlay para móvil */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
          onClick={handleCloseMobile}
        />
      )}

      {/* ✅ Sidebar Principal */}
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-100 flex-shrink-0">
            {/* Logo y Branding */}
            <div className={clsx(
              "flex items-center gap-3 transition-all duration-300",
              (isCollapsed && !isMobileOpen) ? "justify-center w-full" : "flex-1 min-w-0"
            )}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {(!isCollapsed || isMobileOpen) && (
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-secondary-800 to-primary-600 bg-clip-text text-transparent truncate font-heading">
                    RYV SPA
                  </h1>
                  <p className="text-xs text-secondary-500 truncate">
                    {esCliente ? 'Portal Cliente' : 
                     esTecnico ? 'Panel Técnico' : 
                     'Gestión Plantas'}
                  </p>
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Botón cerrar móvil */}
              {isMobileOpen && (
                <button
                  onClick={handleCloseMobile}
                  className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 lg:hidden"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Botón colapsar (solo desktop) */}
              <button
                onClick={handleToggleCollapse}
                className="hidden lg:flex p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
              >
                <svg 
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200",
                    isCollapsed ? "rotate-180" : ""
                  )} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationFiltrada.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  clsx(
                    "group flex items-center rounded-xl transition-all duration-200 mx-1 relative",
                    "hover:bg-primary-50 hover:text-primary-700",
                    isActive 
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 shadow-sm' 
                      : 'text-secondary-600',
                    (isCollapsed && !isMobileOpen) ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                  )
                }
              >
                <div className={clsx(
                  "flex items-center transition-all duration-200",
                  (isCollapsed && !isMobileOpen) ? "justify-center" : ""
                )}>
                  <div className={clsx(
                    "transition-colors duration-200 flex-shrink-0",
                    (isCollapsed && !isMobileOpen) ? "" : "mr-3"
                  )}>
                    {item.icon}
                  </div>
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="font-medium text-sm whitespace-nowrap truncate">
                      {item.name}
                    </span>
                  )}
                </div>
                
                {/* Tooltip para modo colapsado */}
                {(isCollapsed && !isMobileOpen) && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-secondary-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-large">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-secondary-800"></div>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer del Sidebar */}
          <div className={clsx(
            "p-4 border-t border-secondary-100 flex-shrink-0",
            (isCollapsed && !isMobileOpen) ? "text-center" : ""
          )}>
            <div className={clsx(
              "flex items-center",
              (isCollapsed && !isMobileOpen) ? "justify-center" : "justify-between"
            )}>
              {(!isCollapsed || isMobileOpen) && (
                <div className="text-xs text-secondary-500 min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <span className="truncate font-medium">
                      {esCliente ? 'Portal activo' : 'Sistema activo'}
                    </span>
                  </div>
                  {user?.nombre && (
                    <div className="truncate text-secondary-600">
                      Hola, {user.nombre}
                    </div>
                  )}
                </div>
              )}
              
              {(isCollapsed && !isMobileOpen) && (
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}