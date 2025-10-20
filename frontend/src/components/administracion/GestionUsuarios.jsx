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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        <p className="text-gray-600 mt-1">
          Gestiona los roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{estadisticas.superadmin}</div>
          <div className="text-sm text-purple-600">Super Admin</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{estadisticas.admin}</div>
          <div className="text-sm text-blue-600">Admin</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{estadisticas.tecnico}</div>
          <div className="text-sm text-orange-600">Técnicos</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{estadisticas.cliente}</div>
          <div className="text-sm text-green-600">Clientes</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Rol
            </label>
            <select
              value={filtros.rol}
              onChange={(e) => setFiltros({...filtros, rol: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Administrador</option>
              <option value="tecnico">Técnico</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Usuario
            </label>
            <input
              type="text"
              placeholder="Nombre o email..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={cargarUsuarios}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Actualizar Lista
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Usuarios del Sistema ({usuariosFiltrados.length})
          </h3>
          <span className="text-sm text-gray-500">
            {user.rol === 'superadmin' ? 'Puedes cambiar todos los roles' : 'Solo puedes ver usuarios'}
          </span>
        </div>

        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay usuarios que coincidan con los filtros
          </div>
        ) : (
          usuariosFiltrados.map(usuario => (
            <UsuarioItem
              key={usuario.id}
              usuario={usuario}
              onCambiarRol={cambiarRolUsuario}
              actualizando={actualizando}
              puedeEditar={user.rol === 'superadmin' && usuario.rol !== 'superadmin'}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Componente individual de usuario
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
      alert(`Error: ${resultado.message}`);
    }
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'tecnico': return 'bg-orange-100 text-orange-800';
      case 'cliente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {usuario.nombre.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{usuario.nombre}</h4>
            <p className="text-gray-600 text-sm">{usuario.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
                {getRolNombre(usuario.rol)}
              </span>
              <span className="text-gray-500 text-sm">
                {usuario.estaVerificado ? '✅ Verificado' : '⏳ Pendiente'}
              </span>
              {usuario.ultimoInicioSesion && (
                <span className="text-gray-500 text-sm">
                  Último acceso: {new Date(usuario.ultimoInicioSesion).toLocaleDateString()}
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {cambiandoRol ? 'Cambiando...' : 'Cambiar Rol'}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">Solo lectura</span>
          )}

          {/* Menú desplegable de roles */}
          {mostrarOpciones && puedeEditar && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 px-2 py-1">Cambiar a:</div>
                {['admin', 'tecnico', 'cliente'].map(rol => (
                  <button
                    key={rol}
                    onClick={() => handleCambiarRol(rol)}
                    disabled={cambiandoRol}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center justify-between"
                  >
                    <span>{getRolNombre(rol)}</span>
                    {usuario.rol === rol && <span className="text-blue-600">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <strong>ID:</strong> {usuario.id}
          </div>
          <div>
            <strong>Registrado:</strong> {new Date(usuario.createdAt).toLocaleDateString()}
          </div>
          <div>
            <strong>Estado:</strong> {usuario.estaVerificado ? 'Activo' : 'Pendiente de verificación'}
          </div>
        </div>
      </div>
    </div>
  );
}