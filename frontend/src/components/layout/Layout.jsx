import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ✅ Sidebar responsive - ya maneja su propio estado móvil */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={setSidebarCollapsed} 
      />
      
      {/* ✅ Contenido principal con márgenes responsive */}
      <div className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {/* Header */}
        <Header />
        
        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="h-full p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}