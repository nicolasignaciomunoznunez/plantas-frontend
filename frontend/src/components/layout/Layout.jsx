import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ Configuración responsive centralizada MEJORADA
  const layoutConfig = useMemo(() => ({
    sidebar: {
      collapsed: {
        width: 'w-20', // 80px
        margin: 'lg:ml-20'
      },
      expanded: {
        width: 'w-64', // 256px  
        margin: 'lg:ml-64'
      }
    },
    header: {
      height: 'h-16',
      zIndex: 'z-40'
    },
    main: {
      padding: 'p-4 sm:p-6',
      maxWidth: 'max-w-full'
    },
    transitions: {
      duration: 'duration-300',
      timing: 'ease-in-out'
    }
  }), []);

  // ✅ Clases dinámicas optimizadas CON CLSX
  const mainContentClasses = useMemo(() => 
    clsx(
      'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
      sidebarCollapsed ? layoutConfig.sidebar.collapsed.margin : layoutConfig.sidebar.expanded.margin
    ),
    [sidebarCollapsed, layoutConfig]
  );

  const sidebarClasses = useMemo(() =>
    clsx(
      'fixed lg:relative z-50 transition-all duration-300 ease-in-out',
      sidebarCollapsed ? layoutConfig.sidebar.collapsed.width : layoutConfig.sidebar.expanded.width
    ),
    [sidebarCollapsed, layoutConfig]
  );

  const headerClasses = useMemo(() =>
    clsx(
      'sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-sm border-b border-secondary-100',
      'transition-all duration-300'
    ),
    []
  );

  // ✅ Handlers optimizados
  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleCloseSidebarMobile = () => {
    setSidebarCollapsed(true);
  };

  return (
    <div className="flex h-screen bg-gradient-light">
      {/* ✅ Sidebar integrado */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={setSidebarCollapsed}
        className={sidebarClasses}
      />
      
      {/* ✅ Contenido principal */}
      <div className={mainContentClasses}>
        {/* Overlay para móvil - MEJORADO */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={handleCloseSidebarMobile}
          />
        )}
        
        {/* ✅ Header integrado */}
        <Header 
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          className={headerClasses}
        />
        
        {/* ✅ Área principal de contenido */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className={clsx(
            'h-full',
            layoutConfig.main.padding,
            layoutConfig.main.maxWidth
          )}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// 🎯 Hook personalizado para gestión del layout (OPCIONAL)
export function useLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarCollapsed(true);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarCollapsed(false);
  }, []);

  return {
    sidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    openSidebar
  };
}