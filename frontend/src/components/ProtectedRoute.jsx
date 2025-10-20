// components/ProtectedRoute.jsx - ACTUALIZADO CON UTILIDADES
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { esSuperAdmin, tieneAlgunRol } from '../utils/roles'; // ← IMPORTAR

export default function ProtectedRoute({ 
  children, 
  roles = [],
  redirectTo = '/login'
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // ✅ SUPERADMIN: Acceso total sin verificación de roles
  if (esSuperAdmin(user)) {
    return children;
  }

  // ✅ Para otros roles, verificar permisos
  if (roles.length > 0 && !tieneAlgunRol(user, roles)) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <strong>Ruta:</strong> {location.pathname}<br />
            <strong>Tu rol:</strong> <span className="capitalize">{user.rol}</span><br />
            <strong>Permiso requerido:</strong> {roles.join(', ')}
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}