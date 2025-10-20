import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import GestionUsuarios from '../components/adminsitracion/GestionUsuarios';
import AsignacionPlantas from '../components/administracion/AsignacionPlantas';

export default function Administracion() {
  const { user } = useAuthStore();
  const [seccionActiva, setSeccionActiva] = useState('usuarios');

  const secciones = [
    { id: 'usuarios', nombre: 'Gestión de Usuarios', icono: '👥' },
    { id: 'asignacion', nombre: 'Asignación de Plantas', icono: '🏭' },
  ];

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
              onClick={() => setSeccionActiva(seccion.id)}
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

      {/* Contenido */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {seccionActiva === 'usuarios' && <GestionUsuarios />}
        {seccionActiva === 'asignacion' && <AsignacionPlantas />}
      </div>
    </div>
  );
}