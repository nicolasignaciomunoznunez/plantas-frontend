// components/administracion/GestionUsuarios.jsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

export default function GestionUsuarios() {
  const { user } = useAuthStore();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [filtros, setFiltros] = useState({
    rol: '',
    busqueda: ''
  });

  // Cargar usuarios
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await authService.obtenerUsuarios();
      
      if (response.success) {
        // Filtrar el usuario actual de la lista
        const usuariosFiltrados = response.usuarios.filter(u => u.id !== user.id);
        setUsuarios(usuariosFiltrados);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarRolUsuario = async (usuarioId, nuevoRol) => {
    try {
      setActualizando(true);
      
      const response = await authService.actualizarRolUsuario(usuarioId, nuevoRol);
      
      if (response.success) {
        // Actualizar lista local
        setUsuarios(prev => prev.map(u => 
          u.id === usuarioId ? { ...u, rol: nuevoRol } : u
        ));
      }
      
      return response;
    } catch (error) {
      console.error('Error cambiando rol:', error);
      return { success: false, message: error.message };
    } finally {
      setActualizando(false);
    }
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideRol = !filtros.rol || usuario.rol === filtros.rol;
    const coincideBusqueda = !filtros.busqueda || 
      usuario.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    return coincideRol && coincideBusqueda;
  });

  // Estadísticas
  const estadisticas = {
    total: usuarios.length,
    superadmin: usuarios.filter(u => u.rol === 'superadmin').length,
    admin: usuarios.filter(u => u.rol === 'admin').length,
    tecnico: usuarios.filter(u => u.rol === 'tecnico').length,
    cliente: usuarios.filter(u => u.rol === 'cliente').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900">
          Gestión de Usuarios
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Administra los roles y permisos de todos los usuarios del sistema
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 md:p-6 shadow-lg text-center">
          <div className="text-2xl md:text-3xl font-bold">{estadisticas.total}</div>
          <div className="text-blue-100 text-xs md:text-sm font-medium mt-1 md:mt-2">Total</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 md:p-6 shadow-lg text-center">
          <div className="text-2xl md:text-3xl font-bold">{estadisticas.superadmin}</div>
          <div className="text-purple-100 text-xs md:text-sm font-medium mt-1 md:mt-2">Super Admin</div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-2xl p-4 md:p-6 shadow-lg text-center">
          <div className="text-2xl md:text-3xl font-bold">{estadisticas.admin}</div>
          <div className="text-cyan-100 text-xs md:text-sm font-medium mt-1 md:mt-2">Administrador</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-4 md:p-6 shadow-lg text-center">
          <div className="text-2xl md:text-3xl font-bold">{estadisticas.tecnico}</div>
          <div className="text-orange-100 text-xs md:text-sm font-medium mt-1 md:mt-2">Técnicos</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 md:p-6 shadow-lg text-center">
          <div className="text-2xl md:text-3xl font-bold">{estadisticas.cliente}</div>
          <div className="text-green-100 text-xs md:text-sm font-medium mt-1 md:mt-2">Clientes</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Filtrar por Rol
            </label>
            <select
              value={filtros.rol}
              onChange={(e) => setFiltros({...filtros, rol: e.target.value})}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white text-sm md:text-base"
            >
              <option value="">🎭 Todos los roles</option>
              <option value="superadmin">👑 Super Admin</option>
              <option value="admin">⚡ Administrador</option>
              <option value="tecnico">👨‍🔧 Técnico</option>
              <option value="cliente">👥 Cliente</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Buscar Usuario
            </label>
            <input
              type="text"
              placeholder="🔍 Nombre o email..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white text-sm md:text-base"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={cargarUsuarios}
              className="w-full bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <span>🔄</span>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900">
            👥 Usuarios del Sistema ({usuariosFiltrados.length})
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {user.rol === 'superadmin' ? '⚡ Puedes cambiar todos los roles' : '👀 Solo modo lectura'}
          </span>
        </div>

        {usuariosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-soft border border-gray-100">
            <div className="text-4xl md:text-6xl mb-4">🔍</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              No hay usuarios que coincidan con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {usuariosFiltrados.map(usuario => (
              <UsuarioItem
                key={usuario.id}
                usuario={usuario}
                onCambiarRol={cambiarRolUsuario}
                actualizando={actualizando}
                puedeEditar={user.rol === 'superadmin' && usuario.rol !== 'superadmin'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ COMPONENTE USUARIO INDIVIDUAL - RESPONSIVE
function UsuarioItem({ usuario, onCambiarRol, actualizando, puedeEditar }) {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [cambiandoRol, setCambiandoRol] = useState(false);

  const handleCambiarRol = async (nuevoRol) => {
    if (!puedeEditar) return;
    
    setCambiandoRol(true);
    const resultado = await onCambiarRol(usuario.id, nuevoRol);
    setCambiandoRol(false);
    setMostrarOpciones(false);
    
    if (!resultado.success) {
      alert(`❌ Error: ${resultado.message}`);
    } else {
      alert('✅ Rol actualizado correctamente');
    }
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'superadmin': return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-200';
      case 'admin': return 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-cyan-200';
      case 'tecnico': return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-200';
      case 'cliente': return 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-200';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600 text-white border-gray-200';
    }
  };

  const getRolIcono = (rol) => {
    switch (rol) {
      case 'superadmin': return '👑';
      case 'admin': return '⚡';
      case 'tecnico': return '👨‍🔧';
      case 'cliente': return '👥';
      default: return '👤';
    }
  };

  const getRolNombre = (rol) => {
    switch (rol) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Administrador';
      case 'tecnico': return 'Técnico';
      case 'cliente': return 'Cliente';
      default: return rol;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
            {usuario.nombre.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-semibold text-gray-900 text-base md:text-lg truncate">
              {usuario.nombre}
            </h4>
            <p className="text-gray-600 text-xs md:text-sm truncate">{usuario.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRolColor(usuario.rol)}`}>
                {getRolIcono(usuario.rol)} {getRolNombre(usuario.rol)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                usuario.estaVerificado 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {usuario.estaVerificado ? '✅ Verificado' : '⏳ Pendiente'}
              </span>
              {usuario.ultimoInicioSesion && (
                <span className="text-gray-500 text-xs">
                  📅 {new Date(usuario.ultimoInicioSesion).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          {puedeEditar ? (
            <button
              onClick={() => setMostrarOpciones(!mostrarOpciones)}
              disabled={actualizando || cambiandoRol}
              className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
            >
              {cambiandoRol ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Cambiando...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Cambiar Rol
                </>
              )}
            </button>
          ) : (
            <span className="text-gray-500 text-sm bg-gray-100 px-3 py-2 rounded-lg inline-block">
              👀 Solo lectura
            </span>
          )}

          {/* Menú desplegable de roles */}
          {mostrarOpciones && puedeEditar && (
            <>
              {/* Overlay para cerrar al hacer click fuera */}
              <div 
                className="fixed inset-0 z-20"
                onClick={() => setMostrarOpciones(false)}
              />
              
              <div className="absolute right-0 top-12 md:top-14 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 min-w-48 md:min-w-56 animate-fade-in-up">
                <div className="p-3 md:p-4">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-2">Cambiar rol a:</div>
                  {['admin', 'tecnico', 'cliente'].map(rol => (
                    <button
                      key={rol}
                      onClick={() => handleCambiarRol(rol)}
                      disabled={cambiandoRol}
                      className={`w-full text-left px-3 py-2 md:px-4 md:py-3 text-sm md:text-base hover:bg-gray-50 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-between ${
                        usuario.rol === rol ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{getRolIcono(rol)}</span>
                        <span>{getRolNombre(rol)}</span>
                      </div>
                      {usuario.rol === rol && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
          <div className="bg-gray-50 rounded-lg p-2 md:p-3">
            <strong className="text-gray-700">🆔 ID:</strong> {usuario.id}
          </div>
          <div className="bg-gray-50 rounded-lg p-2 md:p-3">
            <strong className="text-gray-700">📅 Registrado:</strong> {new Date(usuario.createdAt).toLocaleDateString()}
          </div>
          <div className="bg-gray-50 rounded-lg p-2 md:p-3">
            <strong className="text-gray-700">🎯 Estado:</strong> 
            <span className={usuario.estaVerificado ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
              {usuario.estaVerificado ? ' Activo' : ' Pendiente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}