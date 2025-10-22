import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { authService } from './services/authService';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plantas from './pages/Plantas';
import PlantaDetalle from './pages/PlantaDetalle';
import Incidencias from './pages/Incidencias';
import Mantenimiento from './pages/Mantenimiento';
import Reportes from './pages/Reportes';
import LandingPage from './pages/LandingPage'; 
import ProfilePage from './pages/Profile'; 
import Administracion from './pages/Administracion';

// ✅ Cache simple en memoria (CORREGIDO - mismo módulo)
let authCache = {
  lastCheck: null,
  user: null,
  CACHE_TTL: 10 * 60 * 1000, // 10 minutos
};

// ✅ FUNCIONES PARA GESTIONAR CACHE DESDE OTROS COMPONENTES (EXPORTADAS)
export const clearAuthCache = () => {
  authCache.user = null;
  authCache.lastCheck = null;
  console.log('✅ [AUTH CACHE] Cache limpiado');
};

export const updateAuthCache = (userData) => {
  authCache.user = userData;
  authCache.lastCheck = Date.now();
  console.log('✅ [AUTH CACHE] Cache actualizado');
};

export const getAuthCache = () => {
  if (authCache.user && authCache.lastCheck && 
      (Date.now() - authCache.lastCheck) < authCache.CACHE_TTL) {
    return authCache.user;
  }
  return null;
};

function App() {
  const { isAuthenticated, login, setLoading, isLoading } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  console.log('🔄 [APP] Render - authChecked:', authChecked, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('🔄 [APP] useEffect montado - verificando autenticación inicial');
    
    const verifyInitialAuth = async () => {
      try {
        setLoading(true);
        
        // ✅ OPTIMIZACIÓN 1: PRIMERO VERIFICAR CACHE (INSTANTÁNEO)
        const cachedUser = getAuthCache();
        if (cachedUser) {
          console.log('✅ [APP] Usuario encontrado en cache, haciendo login...');
          login(cachedUser);
          setAuthChecked(true);
          return;
        }

        // ✅ OPTIMIZACIÓN 2: SOLO SI NO HAY CACHE, LLAMAR AL BACKEND
        console.log('🔐 [APP] No hay cache, llamando a checkAuth...');
        
        const result = await authService.checkAuth();
        console.log('🔐 [APP] Resultado de checkAuth:', result);
        
        if (result.success && result.usuario) {
          console.log('✅ [APP] Usuario autenticado, guardando en cache...');
          
          // ✅ GUARDAR EN CACHE PARA PRÓXIMAS VECES
          updateAuthCache(result.usuario);
          login(result.usuario);
        } else {
          console.log('❌ [APP] Usuario NO autenticado, limpiando cache');
          clearAuthCache();
        }
      } catch (error) {
        console.error('❌ [APP] Error crítico en verifyInitialAuth:', error);
        clearAuthCache();
      } finally {
        setLoading(false);
        setAuthChecked(true);
        console.log('✅ [APP] Verificación inicial completada');
      }
    };

    // ✅ OPTIMIZACIÓN 3: Solo verificar si no hemos verificado antes
    if (!authChecked) {
      verifyInitialAuth();
    }
  }, [authChecked, login, setLoading]);

  // ✅ MEJOR EXPERIENCIA: Loading no bloqueante
  if (!authChecked || isLoading) {
    console.log('🔄 [APP] Mostrando loading inicial...');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  console.log('✅ [APP] Renderizando aplicación - isAuthenticated:', isAuthenticated);

  return (
    <HashRouter>
      <Routes>
        {/* ✅ RUTA PÚBLICA PRINCIPAL: Landing Page (siempre accesible) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* ✅ RUTAS PÚBLICAS: Login y Register */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        
        {/* ✅ RUTAS PROTEGIDAS CON PROTECTEDROUTE Y CONTROL DE ROLES */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* PLANTAS: Admin y Técnico pueden ver */}
          <Route path="plantas" element={
            <ProtectedRoute roles={['superadmin']}>
              <Plantas />
            </ProtectedRoute>
          } />
          
          <Route path="plantas/:id" element={
            <ProtectedRoute roles={['superadmin','admin', 'tecnico']}>
              <PlantaDetalle />
            </ProtectedRoute>
          } />
          
          {/* INCIDENCIAS: Todos los roles pueden ver */}
          <Route path="incidencias" element={
            <ProtectedRoute roles={['superadmin','admin', 'tecnico', 'cliente']}>
              <Incidencias />
            </ProtectedRoute>
          } />
          
          {/* MANTENIMIENTOS: Admin y Técnico */}
          <Route path="mantenimientos" element={
            <ProtectedRoute roles={['superadmin','admin', 'tecnico']}>
              <Mantenimiento />
            </ProtectedRoute>
          } />
          
          {/* REPORTES: Admin y Técnico */}
          <Route path="reportes" element={
            <ProtectedRoute roles={['superadmin','admin', 'tecnico']}>
              <Reportes />
            </ProtectedRoute>
          } />
          
          {/* ✅ PERFIL: Todos los usuarios autenticados pueden ver */}
          <Route path="perfil" element={
            <ProtectedRoute roles={['superadmin','admin', 'tecnico', 'cliente']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Route>

        {/* ✅ RUTA DE ADMINISTRACIÓN (FUERA de /dashboard) */}
        <Route path="/administracion" element={
          <ProtectedRoute roles={['superadmin', 'admin']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Administracion />} />
        </Route>

        {/* ✅ REDIRECCIONES PARA RUTAS DIRECTAS */}
        {isAuthenticated && (
          <>
            <Route path="/plantas" element={<Navigate to="/dashboard/plantas" replace />} />
            <Route path="/incidencias" element={<Navigate to="/dashboard/incidencias" replace />} />
            <Route path="/mantenimientos" element={<Navigate to="/dashboard/mantenimientos" replace />} />
            <Route path="/reportes" element={<Navigate to="/dashboard/reportes" replace />} />
            <Route path="/perfil" element={<Navigate to="/dashboard/perfil" replace />} />
          </>
        )}

        {/* ✅ REDIRECCIÓN GLOBAL */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;