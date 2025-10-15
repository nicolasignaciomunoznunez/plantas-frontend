import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useState, useEffect } from 'react';

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const { user } = useAuthStore();
  const esCliente = user?.rol === 'cliente';
  const esTecnico = user?.rol === 'tecnico';
  const esAdmin = user?.rol === 'admin';

  // ✅ ESTADO PARA MÓVIL
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ DETECTAR SI ES MÓVIL
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // En móvil, forzar colapsado
      if (window.innerWidth < 1024) {
        onToggleCollapse(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [onToggleCollapse]);

  // ✅ NAVEGACIÓN ORIGINAL (sin cambios)
  const navigation = [
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
  ];

  const navigationFiltrada = navigation.filter(item => item.visible);

  return (
    <>
      {/* ✅ BOTÓN HAMBURGUESA PARA MÓVIL */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ✅ OVERLAY PARA MÓVIL */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR PRINCIPAL - RESPONSIVE */}
      <div className={`
        bg-white shadow-lg border-r border-gray-100 transition-all duration-300
        fixed lg:relative z-40 h-full
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    RYV SPA
                  </h1>
                  <p className="text-xs text-gray-500">
                    {esCliente ? 'Portal Cliente' : 
                     esTecnico ? 'Panel Técnico' : 
                     'Gestión Plantas'}
                  </p>
                </div>
              </div>
            )}
            
            {(isCollapsed && !isMobileOpen) && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}

            {/* Botón de colapsar/cerrar */}
            <div className="flex items-center gap-2">
              {/* Botón cerrar móvil */}
              {isMobileOpen && (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Botón colapsar (solo desktop) */}
              <button
                onClick={() => onToggleCollapse(!isCollapsed)}
                className="hidden lg:block p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCollapsed ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navegación FILTRADA */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigationFiltrada.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${(isCollapsed && !isMobileOpen) ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`
                }
              >
                <div className={`flex items-center ${(isCollapsed && !isMobileOpen) ? 'justify-center' : ''}`}>
                  <div className={`transition-colors duration-200 ${
                    (isCollapsed && !isMobileOpen) ? '' : 'mr-3'
                  }`}>
                    {item.icon}
                  </div>
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </div>
                
                {/* Tooltip para modo colapsado desktop */}
                {(isCollapsed && !isMobileOpen) && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer del Sidebar */}
          <div className={`p-4 border-t border-gray-100 ${(isCollapsed && !isMobileOpen) ? 'text-center' : ''}`}>
            <div className={`flex items-center ${(isCollapsed && !isMobileOpen) ? 'justify-center' : 'justify-between'}`}>
              {(!isCollapsed || isMobileOpen) && (
                <div className="text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>
                      {esCliente ? 'Portal activo' : 'Sistema activo'}
                    </span>
                  </div>
                  <div>
                    {user?.nombre && `Hola, ${user.nombre}`}
                  </div>
                </div>
              )}
              
              {(isCollapsed && !isMobileOpen) && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}