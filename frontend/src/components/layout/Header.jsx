import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';

export default function Header() {
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
      window.location.href = '/login';
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
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo y Branding - Mejorado para responsive */}
        <div className="flex items-center gap-3">
          {/* Logo optimizado para móvil */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <img 
              src="/images/finalogo.jpeg" 
              alt="RYV SPA" 
              className="h-10 sm:h-14 lg:h-20 w-auto object-contain"
            />
          </div>
          
          {/* Texto que se adapta */}
          <div className="hidden xs:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              RYV SPA
            </h1>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Sistema de Gestión
            </p>
          </div>
        </div>

        {/* Información del sistema - Solo en desktop */}
        <div className="hidden lg:flex items-center gap-6 text-sm flex-1 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Sistema activo</span>
          </div>
        </div>

        {/* User Menu - Optimizado para móvil */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notificaciones - Solo en tablet/desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 5.5 3.366M3.75 21h13.5a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5z" />
              </svg>
            </button>
          </div>

          {/* User Dropdown - Mejorado para touch */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 group min-w-0"
            >
              {/* Texto del usuario - Se oculta en móvil pequeño */}
              <div className="text-right hidden sm:block max-w-32">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 capitalize truncate">
                  {user?.rol || 'Usuario'}
                </p>
              </div>
              
              {/* Avatar responsive */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <span className="text-white text-xs sm:text-sm font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
                {/* Indicador de estado */}
                <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Flecha indicadora */}
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu - Responsive */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-80">
                {/* Header del dropdown */}
                <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || 'No email'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {user?.rol || 'Usuario'}
                  </p>
                </div>

                {/* Opciones del menú */}
              <div className="py-2">
  <Link
    to="/dashboard/perfil"
    className="flex items-center gap-3 px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
    onClick={() => setIsDropdownOpen(false)}
  >
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
    <span className="truncate">Mi Perfil</span>
  </Link>
</div>

                {/* Separador */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="truncate">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}