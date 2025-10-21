// components/administracion/AsignacionPlantas.jsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { plantasService } from '../../services/plantasService';
import { authService } from '../../services/authService';

export default function AsignacionPlantas() {
  const { user } = useAuthStore();
  const [plantas, setPlantas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [plantasCompletas, setPlantasCompletas] = useState({});
  const [loading, setLoading] = useState(true);
  const [asignando, setAsignando] = useState(false);
  const [filtros, setFiltros] = useState({
    rol: 'tecnico',
    plantaId: '',
    vista: 'por-usuario'
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

      // Cargar usuarios
      const usuariosResponse = await authService.obtenerUsuarios();
      setUsuarios(usuariosResponse.usuarios || []);

      // Cargar datos completos de cada planta
      const plantasCompletasData = {};
      for (const planta of plantasResponse.plantas || []) {
        try {
          const plantaCompleta = await plantasService.obtenerPlantaCompleta(planta.id);
          plantasCompletasData[planta.id] = plantaCompleta.planta;
        } catch (error) {
          console.error(`Error cargando planta ${planta.id}:`, error);
          plantasCompletasData[planta.id] = planta;
        }
      }
      setPlantasCompletas(plantasCompletasData);

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVA LÓGICA: Plantas asignadas a usuario (muchos-a-muchos)
  const obtenerPlantasAsignadasUsuario = (usuarioId, rol) => {
    return plantas.filter(planta => {
      const plantaCompleta = plantasCompletas[planta.id];
      if (!plantaCompleta) return false;
      
      if (rol === 'tecnico') {
        return plantaCompleta.tecnicos?.some(t => t.id === usuarioId) || planta.tecnicoId === usuarioId;
      } else if (rol === 'cliente') {
        return plantaCompleta.clientes?.some(c => c.id === usuarioId) || planta.clienteId === usuarioId;
      }
      return false;
    });
  };

  // ✅ NUEVA LÓGICA: Asignar múltiples
  const asignarPlantaUsuario = async (usuarioId, plantaId, asignar = true) => {
    try {
      setAsignando(true);
      
      const usuario = usuarios.find(u => u.id === usuarioId);
      
      if (asignar) {
        // Para asignar: usar los nuevos métodos muchos-a-muchos
        if (usuario.rol === 'tecnico') {
          // Obtener técnicos actuales y agregar el nuevo
          const plantaCompleta = plantasCompletas[plantaId];
          const tecnicosActuales = plantaCompleta?.tecnicos?.map(t => t.id) || [];
          // Si todavía usa el sistema antiguo, incluir tecnicoId
          if (plantaCompleta.tecnicoId && !tecnicosActuales.includes(plantaCompleta.tecnicoId)) {
            tecnicosActuales.push(plantaCompleta.tecnicoId);
          }
          const nuevosTecnicos = [...tecnicosActuales, usuarioId];
          
          await plantasService.asignarMultiplesTecnicos(plantaId, nuevosTecnicos);
        } else if (usuario.rol === 'cliente') {
          // Para clientes, mantener lógica 1-a-1 por ahora (pueden tener solo 1 planta)
          const response = await plantasService.asignarPlantaUsuario({
            usuarioId,
            plantaId,
            accion: 'asignar'
          });
        }
      } else {
        // Para desasignar
        const response = await plantasService.asignarPlantaUsuario({
          usuarioId,
          plantaId,
          accion: 'desasignar'
        });
      }

      // Recargar datos
      await cargarDatos();

    } catch (error) {
      console.error('Error asignando planta:', error);
    } finally {
      setAsignando(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900">
          Asignación de Plantas
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gestiona las asignaciones de plantas entre técnicos y clientes del sistema
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tipo de Usuario
            </label>
            <select
              value={filtros.rol}
              onChange={(e) => setFiltros({...filtros, rol: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
            >
              <option value="tecnico">👨‍🔧 Técnicos</option>
              <option value="cliente">👥 Clientes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Filtrar Planta
            </label>
            <select
              value={filtros.plantaId}
              onChange={(e) => setFiltros({...filtros, plantaId: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
            >
              <option value="">🌿 Todas las plantas</option>
              {plantas.map(planta => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre} - {planta.ubicacion}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Vista
            </label>
            <select
              value={filtros.vista}
              onChange={(e) => setFiltros({...filtros, vista: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
            >
              <option value="por-usuario">👤 Por Usuario</option>
              <option value="por-planta">🏭 Por Planta</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={cargarDatos}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Plantas</p>
              <p className="text-3xl font-bold mt-2">{plantas.length}</p>
            </div>
            <div className="text-3xl">🏭</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Técnicos Activos</p>
              <p className="text-3xl font-bold mt-2">
                {usuarios.filter(u => u.rol === 'tecnico').length}
              </p>
            </div>
            <div className="text-3xl">👨‍🔧</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Clientes Activos</p>
              <p className="text-3xl font-bold mt-2">
                {usuarios.filter(u => u.rol === 'cliente').length}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {filtros.vista === 'por-usuario' ? (
        <VistaPorUsuario
          usuarios={usuariosFiltrados}
          plantas={plantas}
          plantasCompletas={plantasCompletas}
          onAsignar={asignarPlantaUsuario}
          asignando={asignando}
          obtenerPlantasAsignadas={obtenerPlantasAsignadasUsuario}
          filtros={filtros}
        />
      ) : (
        <VistaPorPlanta
          plantas={plantas}
          plantasCompletas={plantasCompletas}
          usuarios={usuarios}
          onAsignar={asignarPlantaUsuario}
          asignando={asignando}
          filtros={filtros}
        />
      )}
    </div>
  );
}

// ✅ VISTA POR USUARIO
function VistaPorUsuario({ usuarios, plantas, plantasCompletas, onAsignar, asignando, obtenerPlantasAsignadas, filtros }) {
  if (usuarios.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-soft border border-gray-100">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay {filtros.rol === 'tecnico' ? 'técnicos' : 'clientes'} disponibles
        </h3>
        <p className="text-gray-600">
          No se encontraron {filtros.rol === 'tecnico' ? 'técnicos' : 'clientes'} para mostrar con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading font-bold text-gray-900">
        {filtros.rol === 'tecnico' ? '👨‍🔧 Técnicos' : '👥 Clientes'} del Sistema
      </h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {usuarios.map(usuario => (
          <UsuarioAsignacion
            key={usuario.id}
            usuario={usuario}
            plantas={plantas}
            plantasCompletas={plantasCompletas}
            onAsignar={onAsignar}
            asignando={asignando}
            obtenerPlantasAsignadas={obtenerPlantasAsignadas}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ VISTA POR PLANTA
function VistaPorPlanta({ plantas, plantasCompletas, usuarios, onAsignar, asignando, filtros }) {
  const plantasFiltradas = plantas.filter(planta => 
    !filtros.plantaId || planta.id === parseInt(filtros.plantaId)
  );

  if (plantasFiltradas.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-soft border border-gray-100">
        <div className="text-6xl mb-4">🏭</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay plantas disponibles
        </h3>
        <p className="text-gray-600">
          No se encontraron plantas para mostrar con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading font-bold text-gray-900">🏭 Plantas del Sistema</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {plantasFiltradas.map(planta => (
          <PlantaAsignacion
            key={planta.id}
            planta={planta}
            plantaCompleta={plantasCompletas[planta.id]}
            usuarios={usuarios}
            onAsignar={onAsignar}
            asignando={asignando}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ COMPONENTE USUARIO INDIVIDUAL
function UsuarioAsignacion({ usuario, plantas, plantasCompletas, onAsignar, asignando, obtenerPlantasAsignadas }) {
  const [mostrarPlantas, setMostrarPlantas] = useState(false);

  // Plantas asignadas a este usuario (muchos-a-muchos)
  const plantasAsignadas = obtenerPlantasAsignadas(usuario.id, usuario.rol);

  // Plantas disponibles para asignar
  const plantasParaAsignar = plantas.filter(planta => 
    !plantasAsignadas.some(pa => pa.id === planta.id)
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {usuario.nombre.charAt(0)}
          </div>
          <div>
            <h4 className="font-heading font-semibold text-gray-900 text-lg">{usuario.nombre}</h4>
            <p className="text-gray-600 text-sm">{usuario.email}</p>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                usuario.rol === 'tecnico' 
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {usuario.rol === 'tecnico' ? '👨‍🔧 Técnico' : '👥 Cliente'}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                {plantasAsignadas.length} planta(s) asignada(s)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarPlantas(!mostrarPlantas)}
          disabled={asignando}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          <span>{mostrarPlantas ? '▲' : '▼'}</span>
          {mostrarPlantas ? 'Ocultar' : 'Gestionar'}
        </button>
      </div>

      {/* Panel de asignación */}
      {mostrarPlantas && (
        <div className="mt-6 border-t border-gray-200 pt-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plantas Asignadas */}
            <div>
              <h5 className="font-heading font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span>✅</span>
                Plantas Asignadas
              </h5>
              <div className="space-y-3">
                {plantasAsignadas.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-sm">No hay plantas asignadas</p>
                  </div>
                ) : (
                  plantasAsignadas.map(planta => (
                    <div key={planta.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 block">{planta.nombre}</span>
                          <p className="text-gray-600 text-sm">{planta.ubicacion}</p>
                        </div>
                        <button
                          onClick={() => onAsignar(usuario.id, planta.id, false)}
                          disabled={asignando}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                        >
                          <span>🗑️</span>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Asignar Nueva Planta */}
            <div>
              <h5 className="font-heading font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span>⭐</span>
                Asignar Nueva Planta
              </h5>
              <div className="space-y-3">
                {plantasParaAsignar.length === 0 ? (
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                    <p className="text-blue-700 text-sm">No hay plantas disponibles</p>
                  </div>
                ) : (
                  plantasParaAsignar.map(planta => (
                    <div key={planta.id} className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 block">{planta.nombre}</span>
                          <p className="text-gray-600 text-sm">{planta.ubicacion}</p>
                        </div>
                        <button
                          onClick={() => onAsignar(usuario.id, planta.id, true)}
                          disabled={asignando}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                        >
                          <span>➕</span>
                          Asignar
                        </button>
                      </div>
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

// ✅ COMPONENTE PLANTA INDIVIDUAL (Para vista por planta)
function PlantaAsignacion({ planta, plantaCompleta, usuarios, onAsignar, asignando }) {
  const [mostrarAsignaciones, setMostrarAsignaciones] = useState(false);

  const tecnicosAsignados = plantaCompleta?.tecnicos || [];
  const clientesAsignados = plantaCompleta?.clientes || [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            🏭
          </div>
          <div>
            <h4 className="font-heading font-semibold text-gray-900 text-lg">{planta.nombre}</h4>
            <p className="text-gray-600 text-sm">{planta.ubicacion}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-500 text-sm font-medium">
                👨‍🔧 {tecnicosAsignados.length} técnico(s)
              </span>
              <span className="text-gray-500 text-sm font-medium">
                👥 {clientesAsignados.length} cliente(s)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarAsignaciones(!mostrarAsignaciones)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <span>{mostrarAsignaciones ? '▲' : '▼'}</span>
          {mostrarAsignaciones ? 'Ocultar' : 'Ver Asignaciones'}
        </button>
      </div>

      {mostrarAsignaciones && (
        <div className="mt-6 border-t border-gray-200 pt-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Técnicos Asignados */}
            <div>
              <h5 className="font-heading font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span>👨‍🔧</span>
                Técnicos Asignados
              </h5>
              <div className="space-y-3">
                {tecnicosAsignados.length === 0 ? (
                  <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                    <p className="text-orange-700 text-sm">No hay técnicos asignados</p>
                  </div>
                ) : (
                  tecnicosAsignados.map(tecnico => (
                    <div key={tecnico.id} className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 block">{tecnico.nombre}</span>
                          <p className="text-gray-600 text-sm">{tecnico.email}</p>
                        </div>
                        <button
                          onClick={() => onAsignar(tecnico.id, planta.id, false)}
                          disabled={asignando}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Clientes Asignados */}
            <div>
              <h5 className="font-heading font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span>👥</span>
                Clientes Asignados
              </h5>
              <div className="space-y-3">
                {clientesAsignados.length === 0 ? (
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <p className="text-green-700 text-sm">No hay clientes asignados</p>
                  </div>
                ) : (
                  clientesAsignados.map(cliente => (
                    <div key={cliente.id} className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 block">{cliente.nombre}</span>
                          <p className="text-gray-600 text-sm">{cliente.email}</p>
                        </div>
                        <button
                          onClick={() => onAsignar(cliente.id, planta.id, false)}
                          disabled={asignando}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          Quitar
                        </button>
                      </div>
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