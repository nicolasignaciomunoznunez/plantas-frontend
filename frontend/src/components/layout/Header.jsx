import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Header({ onToggleSidebar, sidebarCollapsed, className = '' }) {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      logout();
      window.location.href = '#/login';
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  return (
    <header className={clsx(
      'bg-white/80 backdrop-blur-sm border-b border-secondary-100',
      'sticky top-0 z-40 transition-all duration-300',
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* ✅ Lado Izquierdo - Logo y Botón Sidebar */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Botón para toggle sidebar - Solo en móvil */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo y Branding - Optimizado para espacio */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
              <img 
                src="/images/finalogo.jpeg" 
                alt="RYV SPA" 
                className="h-8 w-8 object-contain"
              />
            </div>
            
            {/* Texto que se adapta al espacio */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-secondary-800 to-primary-600 bg-clip-text text-transparent font-heading">
                RYV SPA
              </h1>
              <p className="text-xs text-secondary-500 font-medium">
                Gestión Integral
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Centro - Información del sistema (Desktop only) */}
        <div className="hidden xl:flex items-center justify-center flex-1">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-success-50 text-success-700 rounded-full">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Sistema activo</span>
            </div>
            
            {/* Información adicional opcional */}
            {user?.rol === 'admin' && (
              <div className="flex items-center gap-2 text-secondary-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs font-medium">Modo Administrador</span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Lado Derecho - User Menu */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notificaciones - Solo en desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 5.5 3.366M3.75 21h13.5a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5z" />
              </svg>
              {/* Indicador de notificaciones */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full"></div>
            </button>
          </div>

          {/* User Dropdown - Optimizado */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-primary-50 transition-all duration-200 group min-w-0 border border-transparent hover:border-primary-200"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-200">
                  <span className="text-white text-sm font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
                {/* Indicador de estado */}
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-success-400 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Texto del usuario - Solo desktop */}
              <div className="text-right hidden lg:block max-w-32">
                <p className="text-sm font-semibold text-secondary-800 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-secondary-500 capitalize truncate">
                  {user?.rol || 'Usuario'}
                </p>
              </div>
              
              {/* Flecha indicadora */}
              <svg 
                className={clsx(
                  "w-4 h-4 text-secondary-400 transition-transform duration-200 flex-shrink-0",
                  isDropdownOpen ? "rotate-180" : ""
                )} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-large border border-secondary-100 py-2 z-50 animate-fade-in-up">
                {/* Header del dropdown */}
                <div className="px-4 py-3 border-b border-secondary-100">
                  <p className="text-sm font-semibold text-secondary-800 truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-sm text-secondary-600 truncate mt-1">
                    {user?.email || 'No email'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={clsx(
                      "px-2 py-1 text-xs font-medium rounded-full capitalize",
                      user?.rol === 'admin' 
                        ? "bg-primary-100 text-primary-700"
                        : user?.rol === 'tecnico'
                        ? "bg-warning-100 text-warning-700"
                        : "bg-success-100 text-success-700"
                    )}>
                      {user?.rol || 'Usuario'}
                    </span>
                  </div>
                </div>

                {/* Opciones del menú */}
                <div className="py-2">
                  <Link
                    to="/perfil"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 text-secondary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>
                  
                  <Link
                    to="/configuracion"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 text-secondary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configuración</span>
                  </Link>
                </div>

                {/* Separador */}
                <div className="border-t border-secondary-100 my-2"></div>

                {/* Cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}