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

function App() {
  const { 
    isAuthenticated, 
    login, 
    setLoading, 
    isLoading, 
    syncFromCache 
  } = useAuthStore();
  
  const [authChecked, setAuthChecked] = useState(false);

  console.log('🔄 [APP] Render - authChecked:', authChecked, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('🔄 [APP] useEffect montado - verificando autenticación inicial');
    
    const verifyInitialAuth = async () => {
      try {
        setLoading(true);
        
        const fromCache = syncFromCache();
        if (fromCache) {
          console.log('✅ [APP] Autenticación restaurada desde cache');
          setAuthChecked(true);
          return;
        }

        console.log('🔐 [APP] Verificando autenticación con backend...');
        const result = await authService.checkAuth();
        
        if (result.success && result.usuario) {
          console.log('✅ [APP] Usuario autenticado via backend');
          login(result.usuario);
        } else {
          console.log('❌ [APP] Usuario NO autenticado');
        }
      } catch (error) {
        console.error('❌ [APP] Error en verifyInitialAuth:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
        console.log('✅ [APP] Verificación inicial completada');
      }
    };

    if (!authChecked) {
      verifyInitialAuth();
    }
  }, [authChecked, login, setLoading, syncFromCache]);

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
        {/* ✅ RUTA PÚBLICA PRINCIPAL: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* ✅ RUTAS PÚBLICAS: Login y Register */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        
        {/* ✅ RUTAS PROTEGIDAS CON LAYOUT (SIDEBAR) - ESTRUCTURA CORREGIDA */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* ✅ TODAS las rutas del sidebar aquí */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/plantas" element={
            <ProtectedRoute roles={['superadmin', 'admin', 'tecnico']}>
              <Plantas />
            </ProtectedRoute>
          } />
          
          <Route path="/plantas/:id" element={
            <ProtectedRoute roles={['superadmin', 'admin', 'tecnico']}>
              <PlantaDetalle />
            </ProtectedRoute>
          } />
          
          <Route path="/incidencias" element={
            <ProtectedRoute roles={['superadmin', 'admin', 'tecnico', 'cliente']}>
              <Incidencias />
            </ProtectedRoute>
          } />
          
          <Route path="/mantenimientos" element={
            <ProtectedRoute roles={['superadmin', 'admin', 'tecnico']}>
              <Mantenimiento />
            </ProtectedRoute>
          } />
          
          <Route path="/reportes" element={
            <ProtectedRoute roles={['superadmin', 'admin', 'tecnico']}>
              <Reportes />
            </ProtectedRoute>
          } />
          
          <Route path="/perfil" element={
            <ProtectedRoute roles={['superadmin', 'admin', 'tecnico', 'cliente']}>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* ✅ RUTA DE ADMINISTRACIÓN TAMBIÉN DENTRO DEL LAYOUT */}
          <Route path="/administracion" element={
            <ProtectedRoute roles={['superadmin', 'admin']}>
              <Administracion />
            </ProtectedRoute>
          } />
        </Route>

        {/* ✅ REDIRECCIÓN GLOBAL */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;