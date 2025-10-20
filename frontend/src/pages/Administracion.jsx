import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import GestionUsuarios from '../components/administracion/GestionUsuarios';
import AsignacionPlantas from '../components/administracion/AsignacionPlantas';
import { useNavigate } from 'react-router-dom';

export default function Administracion() {
  const { user, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const [cargando, setCargando] = useState(true);

  const secciones = [
    { id: 'usuarios', nombre: 'Gestión de Usuarios', icono: '👥' },
    { id: 'asignacion', nombre: 'Asignación de Plantas', icono: '🏭' },
  ];

  // DEBUG: Logs para diagnóstico
  console.log('🔧 [Administracion] Componente montado');
  console.log('👤 [Administracion] Usuario:', user);
  console.log('📊 [Administracion] Sección activa:', seccionActiva);
  console.log('🔄 [Administracion] Cargando:', cargando);

  useEffect(() => {
    // Verificar autenticación y permisos
    if (!user) {
      console.log('🚫 [Administracion] Usuario no autenticado');
      navigate('/login');
      return;
    }

    if (!hasRole('superadmin') && !hasRole('admin')) {
      console.log('🚫 [Administracion] Sin permisos de administración');
      navigate('/dashboard');
      return;
    }

    console.log('✅ [Administracion] Permisos verificados');
    setCargando(false);
  }, [user, hasRole, navigate]);

  // Mostrar loading mientras se verifica
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-2">
              Gestiona usuarios y asigna plantas del sistema
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            {user?.rol === 'superadmin' ? 'Super Administrador' : 'Administrador'}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex space-x-4">
          {secciones.map((seccion) => (
            <button
              key={seccion.id}
              onClick={() => {
                console.log(`🔄 [Administracion] Cambiando a sección: ${seccion.id}`);
                setSeccionActiva(seccion.id);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                seccionActiva === seccion.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{seccion.icono}</span>
              {seccion.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Dinámico con Debug */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {seccionActiva === 'usuarios' && (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                🎯 Renderizando: <strong>GestionUsuarios</strong>
              </p>
            </div>
            <GestionUsuarios />
          </>
        )}
        
        {seccionActiva === 'asignacion' && (
          <>
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                🎯 Renderizando: <strong>AsignacionPlantas</strong>
              </p>
            </div>
            <AsignacionPlantas />
          </>
        )}
      </div>
    </div>
  );
}