import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function ProfilePage() {
  const { 
    user, 
    actualizarPerfil, 
    cambiarContraseña, 
    obtenerPerfilActualizado 
  } = useAuthStore();
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCambioContraseña, setModoCambioContraseña] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    contraseñaActual: '',
    nuevaContraseña: '',
    confirmarContraseña: ''
  });

  // ✅ FUNCIÓN MEJORADA PARA FORMATEAR FECHAS
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Nunca';
    
    try {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha inválida';
      }
      
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // ✅ FUNCIÓN PARA OBTENER ICONO SEGÚN ROL
  const obtenerIconoRol = (rol) => {
    switch(rol) {
      case 'admin': return '👑';
      case 'tecnico': return '🔧';
      case 'cliente': return '👤';
      default: return '👤';
    }
  };

  const actualizarDatosPerfil = async () => {
    try {
      
      const resultado = await obtenerPerfilActualizado();
      
      if (resultado.success) {
       
      } else {

      }
    } catch (error) {
      console.error('❌ [PROFILE] Error actualizando perfil:', error);
    }
  };

  // Llamar esta función cuando se monte el componente
  useEffect(() => {
    if (user && (!user.estaVerificado || !user.creadoEn)) {
    
      actualizarDatosPerfil();
    }
  }, [user, obtenerPerfilActualizado]);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (mensaje.texto) {
      const timer = setTimeout(() => {
        setMensaje({ tipo: '', texto: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
  };

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultado = await actualizarPerfil(formData);
      
      if (resultado.success) {
        mostrarMensaje('success', 'Perfil actualizado correctamente');
        setModoEdicion(false);
      } else {
        mostrarMensaje('error', resultado.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      mostrarMensaje('error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarContraseña = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.nuevaContraseña !== passwordData.confirmarContraseña) {
      mostrarMensaje('error', 'Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (passwordData.nuevaContraseña.length < 6) {
      mostrarMensaje('error', 'La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const resultado = await cambiarContraseña({
        contraseñaActual: passwordData.contraseñaActual,
        nuevaContraseña: passwordData.nuevaContraseña
      });

      if (resultado.success) {
        mostrarMensaje('success', 'Contraseña cambiada correctamente');
        setModoCambioContraseña(false);
        setPasswordData({
          contraseñaActual: '',
          nuevaContraseña: '',
          confirmarContraseña: ''
        });
      } else {
        mostrarMensaje('error', resultado.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      mostrarMensaje('error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const cancelarEdicion = () => {
    setFormData({
      nombre: user?.nombre || '',
      email: user?.email || ''
    });
    setModoEdicion(false);
  };

  const cancelarCambioContraseña = () => {
    setPasswordData({
      contraseñaActual: '',
      nuevaContraseña: '',
      confirmarContraseña: ''
    });
    setModoCambioContraseña(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-gray-100 max-w-md w-full">
          <div className="text-4xl sm:text-6xl mb-4">🔒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No autenticado</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Inicia sesión para ver tu perfil</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* ✅ HEADER MEJORADO - RESPONSIVE */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold shadow-lg">
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1 sm:space-y-2 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Mi Perfil
                </h1>
                <p className="text-gray-500 flex items-center gap-2 text-xs sm:text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Gestiona tu información personal y seguridad
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              {!modoEdicion && !modoCambioContraseña && (
                <>
                  <button
                    onClick={() => setModoEdicion(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 flex-1 lg:flex-none justify-center text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden xs:inline">Editar</span>
                    <span className="xs:hidden">Editar</span>
                  </button>
                  <button
                    onClick={() => setModoCambioContraseña(true)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 flex-1 lg:flex-none justify-center text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="hidden xs:inline">Contraseña</span>
                    <span className="xs:hidden">Pass</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ✅ MENSAJES MEJORADOS - RESPONSIVE */}
        {mensaje.texto && (
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border backdrop-blur-sm ${
            mensaje.tipo === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                mensaje.tipo === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-xs sm:text-sm font-bold ${
                  mensaje.tipo === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {mensaje.tipo === 'success' ? '✓' : '!'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">{mensaje.texto}</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ INFORMACIÓN DEL PERFIL MEJORADA - RESPONSIVE */}
        {!modoEdicion && !modoCambioContraseña && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Información Personal */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Información Personal</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100">
                  <div className="min-w-0">
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">Nombre:</span>
                    <span className="text-gray-900 text-base sm:text-lg font-semibold truncate">{user.nombre}</span>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-100">
                  <div className="min-w-0">
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">Email:</span>
                    <span className="text-gray-900 text-base sm:text-lg font-semibold truncate">{user.email}</span>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg sm:rounded-xl border border-purple-100">
                  <div className="min-w-0">
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">Rol:</span>
                    <span className="text-base sm:text-lg font-semibold truncate">{obtenerIconoRol(user.rol)} {user.rol}</span>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm flex-shrink-0 ml-2 ${
                    user.rol === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                    user.rol === 'tecnico' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    {user.rol}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Cuenta */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Información de Cuenta</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg sm:rounded-xl border border-yellow-100">
                  <div className="min-w-0">
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">Estado:</span>
                    <span className={`flex items-center gap-2 text-base sm:text-lg font-semibold ${
                      user.estaVerificado ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        user.estaVerificado ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></span>
                      {user.estaVerificado ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    {user.estaVerificado ? (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl border border-indigo-100">
                  <div className="min-w-0">
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">Miembro desde:</span>
                    <span className="text-gray-900 text-base sm:text-lg font-semibold">
                      {formatearFecha(user.creadoEn)}
                    </span>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg sm:rounded-xl border border-rose-100">
                  <div className="min-w-0">
                    <span className="text-gray-700 font-medium block text-sm sm:text-base">Último acceso:</span>
                    <span className="text-gray-900 text-base sm:text-lg font-semibold">
                      {formatearFecha(user.ultimoInicioSesion)}
                    </span>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ FORMULARIO EDITAR PERFIL - RESPONSIVE */}
        {modoEdicion && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Editar Perfil</h3>
            </div>
            
            <form onSubmit={handleActualizarPerfil} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4 flex-col xs:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 justify-center text-sm sm:text-base flex-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden xs:inline">Guardando...</span>
                      <span className="xs:hidden">Guardando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden xs:inline">Guardar Cambios</span>
                      <span className="xs:hidden">Guardar</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1 sm:gap-2 justify-center text-sm sm:text-base flex-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden xs:inline">Cancelar</span>
                  <span className="xs:hidden">Cancelar</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ✅ FORMULARIO CAMBIAR CONTRASEÑA - RESPONSIVE */}
        {modoCambioContraseña && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Cambiar Contraseña</h3>
            </div>
            
            <form onSubmit={handleCambiarContraseña} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    name="contraseñaActual"
                    value={passwordData.contraseñaActual}
                    onChange={handlePasswordChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="nuevaContraseña"
                    value={passwordData.nuevaContraseña}
                    onChange={handlePasswordChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                    required
                    minLength="6"
                  />
                  <p className="text-xs sm:text-sm text-gray-500">Mínimo 6 caracteres</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmarContraseña"
                    value={passwordData.confirmarContraseña}
                    onChange={handlePasswordChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4 flex-col xs:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 justify-center text-sm sm:text-base flex-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden xs:inline">Cambiando...</span>
                      <span className="xs:hidden">Cambiando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden xs:inline">Cambiar Contraseña</span>
                      <span className="xs:hidden">Cambiar</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelarCambioContraseña}
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1 sm:gap-2 justify-center text-sm sm:text-base flex-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden xs:inline">Cancelar</span>
                  <span className="xs:hidden">Cancelar</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}