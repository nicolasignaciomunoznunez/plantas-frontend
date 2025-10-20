// components/administracion/AsignacionPlantas.jsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { plantasService } from '../../services/plantasService';
import { authService } from '../../services/authService';

export default function AsignacionPlantas() {
  const { user } = useAuthStore();
  const [plantas, setPlantas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [asignando, setAsignando] = useState(false);
  const [filtros, setFiltros] = useState({
    rol: 'tecnico',
    plantaId: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar plantas
      const plantasResponse = await plantasService.obtenerPlantas(100, 1);
      setPlantas(plantasResponse.plantas || []);

      // Cargar usuarios (necesitarás crear este servicio)
      const usuariosResponse = await authService.obtenerUsuarios();
      setUsuarios(usuariosResponse.usuarios || []);

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios por rol
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.rol === filtros.rol && usuario.id !== user.id
  );

  // Filtrar plantas disponibles
  const plantasDisponibles = plantas.filter(planta => 
    !filtros.plantaId || planta.id === parseInt(filtros.plantaId)
  );

  const asignarPlanta = async (usuarioId, plantaId, asignar = true) => {
    try {
      setAsignando(true);
      
      // Aquí necesitarás crear este servicio
      const response = await plantasService.asignarPlantaUsuario({
        usuarioId,
        plantaId,
        accion: asignar ? 'asignar' : 'desasignar'
      });

      if (response.success) {
        // Actualizar lista de plantas
        await cargarDatos();
      }

    } catch (error) {
      console.error('Error asignando planta:', error);
    } finally {
      setAsignando(false);
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Asignación de Plantas</h2>
        <p className="text-gray-600 mt-1">
          Asigna plantas a técnicos y clientes del sistema
        </p>
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
              <option value="tecnico">Técnicos</option>
              <option value="cliente">Clientes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Planta
            </label>
            <select
              value={filtros.plantaId}
              onChange={(e) => setFiltros({...filtros, plantaId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las plantas</option>
              {plantas.map(planta => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={cargarDatos}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {filtros.rol === 'tecnico' ? 'Técnicos' : 'Clientes'} del Sistema
        </h3>

        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay {filtros.rol === 'tecnico' ? 'técnicos' : 'clientes'} para mostrar
          </div>
        ) : (
          usuariosFiltrados.map(usuario => (
            <UsuarioAsignacion
              key={usuario.id}
              usuario={usuario}
              plantas={plantas}
              plantasDisponibles={plantasDisponibles}
              onAsignar={asignarPlanta}
              asignando={asignando}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Componente individual de usuario
function UsuarioAsignacion({ usuario, plantas, plantasDisponibles, onAsignar, asignando }) {
  const [mostrarPlantas, setMostrarPlantas] = useState(false);

  // Plantas asignadas a este usuario
  const plantasAsignadas = plantas.filter(planta => 
    usuario.rol === 'tecnico' 
      ? planta.tecnicoId === usuario.id
      : planta.clienteId === usuario.id
  );

  // Plantas disponibles para asignar
  const plantasParaAsignar = plantasDisponibles.filter(planta => 
    !plantasAsignadas.some(pa => pa.id === planta.id)
  );

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
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                usuario.rol === 'tecnico' 
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {usuario.rol}
              </span>
              <span className="text-gray-500 text-sm">
                {plantasAsignadas.length} planta(s) asignada(s)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarPlantas(!mostrarPlantas)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mostrarPlantas ? 'Ocultar' : 'Gestionar Plantas'}
        </button>
      </div>

      {/* Panel de asignación */}
      {mostrarPlantas && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plantas Asignadas */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Plantas Asignadas</h5>
              <div className="space-y-2">
                {plantasAsignadas.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay plantas asignadas</p>
                ) : (
                  plantasAsignadas.map(planta => (
                    <div key={planta.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <span className="font-medium text-gray-900">{planta.nombre}</span>
                        <p className="text-gray-600 text-sm">{planta.ubicacion}</p>
                      </div>
                      <button
                        onClick={() => onAsignar(usuario.id, planta.id, false)}
                        disabled={asignando}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        Quitar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Asignar Nueva Planta */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Asignar Nueva Planta</h5>
              <div className="space-y-2">
                {plantasParaAsignar.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay plantas disponibles</p>
                ) : (
                  plantasParaAsignar.map(planta => (
                    <div key={planta.id} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                      <div>
                        <span className="font-medium text-gray-900">{planta.nombre}</span>
                        <p className="text-gray-600 text-sm">{planta.ubicacion}</p>
                      </div>
                      <button
                        onClick={() => onAsignar(usuario.id, planta.id, true)}
                        disabled={asignando}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        Asignar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}