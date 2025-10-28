import { useState, useEffect, useRef } from 'react';
import { useIncidenciasStore } from '../../stores/incidenciasStore';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';
import { clsx } from 'clsx';
import { useIncidenciasStore } from '../../stores/incidenciasStore';

// 🎨 Componente de Subida de Fotos
const SubidaFotos = ({ tipo, onFotosChange, fotosExistentes = [] }) => {
  const [fotos, setFotos] = useState(fotosExistentes);
  const fileInputRef = useRef();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const nuevasFotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      nombre: file.name,
      tamaño: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    
    const todasFotos = [...fotos, ...nuevasFotos];
    setFotos(todasFotos);
    onFotosChange(todasFotos.map(f => f.file));
  };

  const eliminarFoto = (index) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    setFotos(nuevasFotos);
    onFotosChange(nuevasFotos.map(f => f.file));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Fotos {tipo === 'antes' ? 'antes' : 'después'} del trabajo
        </label>
        <span className="text-xs text-gray-500">
          {fotos.length} / 10 fotos
        </span>
      </div>

      {/* Área de subida */}
      <div
        className={clsx(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
          "hover:border-primary-400 hover:bg-primary-50",
          "border-gray-300 bg-gray-50"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-900">
            Haz clic para subir fotos
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP hasta 10MB cada una
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Vista previa de fotos */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, index) => (
            <div key={index} className="relative group">
              <img
                src={foto.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => eliminarFoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ×
              </button>
              <div className="text-xs text-gray-500 truncate mt-1">
                {foto.nombre}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 🎨 Componente de Formulario de Materiales
const FormularioMateriales = ({ onMaterialesChange, materialesIniciales = [] }) => {
  const [materiales, setMateriales] = useState(materialesIniciales);

  const agregarMaterial = () => {
    const nuevoMaterial = { nombre: '', cantidad: 1, unidad: 'unidad', costo: 0 };
    const nuevosMateriales = [...materiales, nuevoMaterial];
    setMateriales(nuevosMateriales);
    onMaterialesChange(nuevosMateriales);
  };

  const actualizarMaterial = (index, campo, valor) => {
    const nuevosMateriales = materiales.map((material, i) => 
      i === index ? { ...material, [campo]: valor } : material
    );
    setMateriales(nuevosMateriales);
    onMaterialesChange(nuevosMateriales);
  };

  const eliminarMaterial = (index) => {
    const nuevosMateriales = materiales.filter((_, i) => i !== index);
    setMateriales(nuevosMateriales);
    onMaterialesChange(nuevosMateriales);
  };

  const calcularTotal = () => {
    return materiales.reduce((total, material) => {
      return total + (material.cantidad * material.costo);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Materiales utilizados
        </label>
        <button
          type="button"
          onClick={agregarMaterial}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Agregar
        </button>
      </div>

      {materiales.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No hay materiales agregados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materiales.map((material, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Nombre del material"
                  value={material.nombre}
                  onChange={(e) => actualizarMaterial(index, 'nombre', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={material.cantidad}
                    onChange={(e) => actualizarMaterial(index, 'cantidad', parseFloat(e.target.value) || 0)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                  />
                  <select
                    value={material.unidad}
                    onChange={(e) => actualizarMaterial(index, 'unidad', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unidad">Unidad</option>
                    <option value="metro">Metro</option>
                    <option value="litro">Litro</option>
                    <option value="kg">Kilogramo</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="Costo unitario"
                  value={material.costo}
                  onChange={(e) => actualizarMaterial(index, 'costo', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    ${(material.cantidad * material.costo).toLocaleString('es-CL')}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarMaterial(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Total */}
          {materiales.length > 0 && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Total materiales:</span>
              <span className="text-lg font-bold text-blue-600">
                ${calcularTotal().toLocaleString('es-CL')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 🎯 MODAL PRINCIPAL CORREGIDO
export default function ModalIncidencia({ isOpen, onClose, incidencia, plantaPreSeleccionada, modoCompletar = false, onIncidenciaGuardada }) {
  const { 
    crearIncidencia, 
    actualizarIncidencia,
    completarIncidencia,
    subirFotosIncidencia,
    loading 
  } = useIncidenciasStore();
  
  const { plantas, obtenerPlantas, obtenerPlantasPorCliente } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [plantasPermitidas, setPlantasPermitidas] = useState([]);
  const [cargandoPlantas, setCargandoPlantas] = useState(false);
  
  // ✅ NUEVOS ESTADOS PARA FOTOS Y MATERIALES
  const [fotosAntes, setFotosAntes] = useState([]);
  const [fotosDespues, setFotosDespues] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [resumenTrabajo, setResumenTrabajo] = useState('');
  
  const [formData, setFormData] = useState({
    plantId: plantaPreSeleccionada || '',
    titulo: '',
    descripcion: '',
    estado: 'pendiente'
  });
  const [errors, setErrors] = useState({});

  // ✅ Cargar plantas según el rol del usuario - CORREGIDO
useEffect(() => {
  const cargarPlantasPermitidas = async () => {
    if (!isOpen || !user) return;
    
    setCargandoPlantas(true);
    try {
      if (user.rol === 'cliente') {
        console.log('🔍 Cargando plantas para cliente:', user.id);
        const plantasCliente = await obtenerPlantasPorCliente(user.id);
        console.log('📊 Plantas del cliente cargadas:', plantasCliente);
        setPlantasPermitidas(plantasCliente || []);
        
        if (plantasCliente && plantasCliente.length === 1 && !plantaPreSeleccionada && !incidencia) {
          setFormData(prev => ({ ...prev, plantId: plantasCliente[0].id }));
        }
      } else {
        // ✅ PARA SUPERADMIN/ADMIN/TECNICO - SOLUCIÓN CORREGIDA
        console.log('🔍 Cargando todas las plantas para:', user.rol);
        
        // Esperar a que las plantas se carguen completamente
        const resultado = await obtenerPlantas(100);
        console.log('📊 Resultado de obtenerPlantas:', resultado);
        
        // Usar las plantas directamente del resultado o del store
        if (resultado && resultado.plantas) {
          setPlantasPermitidas(resultado.plantas);
          console.log('✅ Plantas cargadas desde resultado:', resultado.plantas.length);
        } else {
          // Fallback: usar el store después de un pequeño delay
          setTimeout(() => {
            console.log('🔄 Plantas desde store (fallback):', plantas);
            setPlantasPermitidas(plantas);
          }, 100);
        }
      }
    } catch (error) {
      console.error('❌ Error cargando plantas:', error);
      setPlantasPermitidas([]);
    } finally {
      setCargandoPlantas(false);
    }
  };

  cargarPlantasPermitidas();
}, [isOpen, user, obtenerPlantas, obtenerPlantasPorCliente]);

// ✅ EFECTO ADICIONAL para sincronizar plantas cuando el store se actualice
useEffect(() => {
  if (user?.rol !== 'cliente' && plantas.length > 0 && isOpen) {
    console.log('🔄 Sincronizando plantas desde store:', plantas.length);
    setPlantasPermitidas(plantas);
  }
}, [plantas, user, isOpen]);

  // ✅ Cargar datos de la incidencia existente
  useEffect(() => {
    if (incidencia) {
      console.log('📝 Cargando datos de incidencia existente:', incidencia);
      setFormData({
        plantId: incidencia.plantId || '',
        titulo: incidencia.titulo || '',
        descripcion: incidencia.descripcion || '',
        estado: incidencia.estado || 'pendiente'
      });

      // Cargar datos adicionales si estamos en modo completar
      if (modoCompletar) {
        setResumenTrabajo(incidencia.resumenTrabajo || '');
        setMateriales(incidencia.materiales || []);
      }
    } else {
      // Nueva incidencia
      setFormData({
        plantId: plantaPreSeleccionada || '',
        titulo: '',
        descripcion: '',
        estado: 'pendiente'
      });
    }
    setErrors({});
  }, [incidencia, plantaPreSeleccionada, modoCompletar]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.plantId) {
      newErrors.plantId = 'Selecciona una planta';
    }
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    // ✅ VALIDACIONES PARA MODO COMPLETAR
    if (modoCompletar) {
      if (!resumenTrabajo.trim()) {
        newErrors.resumenTrabajo = 'El resumen del trabajo es requerido';
      } else if (resumenTrabajo.trim().length < 20) {
        newErrors.resumenTrabajo = 'El resumen debe tener al menos 20 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // ✅ MANEJADORES PARA FOTOS Y MATERIALES
  const handleFotosAntesChange = (nuevasFotos) => {
    setFotosAntes(nuevasFotos);
  };

  const handleFotosDespuesChange = (nuevasFotos) => {
    setFotosDespues(nuevasFotos);
  };

  const handleMaterialesChange = (nuevosMateriales) => {
    setMateriales(nuevosMateriales);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    try {
        let resultado;

        if (modoCompletar && incidencia) {
            console.log('🔄 Completando incidencia:', incidencia.id);
            
            // ✅ COMPLETAR INCIDENCIA
            resultado = await completarIncidencia(incidencia.id, {
                resumenTrabajo,
                materiales
            });

            // ✅ SUBIR FOTOS DESPUÉS si existen
            if (fotosDespues.length > 0) {
                console.log('📸 Subiendo fotos después:', fotosDespues.length);
                await subirFotosIncidencia(incidencia.id, fotosDespues, 'despues');
            }

            // ✅ MANEJAR RESPUESTA EXITOSA - SIN setSuccessMessage
            if (resultado.success) {
                console.log('✅ Incidencia completada - PDF disponible');
                
                // ✅ OFRECER DESCARGAR PDF INMEDIATAMENTE
                setTimeout(() => {
                    const descargarPDF = window.confirm(
                        '✅ Incidencia completada exitosamente!\n\n' +
                        '¿Deseas descargar el reporte PDF ahora?\n\n' +
                        'El PDF incluirá:\n' +
                        '• Información completa de la incidencia\n' +
                        '• Fotos antes/después del trabajo\n' +
                        '• Materiales utilizados\n' +
                        '• Resumen del trabajo realizado'
                    );
                    
                    if (descargarPDF) {
                        // Generar y descargar PDF
                        generarReportePDF(incidencia.id);
                    }
                }, 500);
            }

        } else if (incidencia) {
            // Edición normal
            resultado = await actualizarIncidencia(incidencia.id, {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                plantId: formData.plantId,
                estado: formData.estado
            });
            console.log('✅ Incidencia actualizada correctamente');
            
        } else {
            // Nueva incidencia
            resultado = await crearIncidencia(formData);
            
            // Subir fotos antes si existen
            if (fotosAntes.length > 0 && resultado?.incidencia?.id) {
                await subirFotosIncidencia(resultado.incidencia.id, fotosAntes, 'antes');
            }
            console.log('✅ Incidencia creada correctamente');
        }
        
        // ✅ CERRAR MODAL AUTOMÁTICAMENTE después de éxito
        if (onIncidenciaGuardada) {
            onIncidenciaGuardada();
        }
        handleClose(); // ✅ Esto cierra el modal
        
    } catch (error) {
        console.error('❌ Error al guardar incidencia:', error);
        setErrors({ submit: error.message });
    }
};

  const handleClose = () => {
    // Limpiar estados al cerrar
    setFotosAntes([]);
    setFotosDespues([]);
    setMateriales([]);
    setResumenTrabajo('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const puedeGestionarEstado = user?.rol === 'superadmin' || user?.rol === 'admin' || user?.rol === 'tecnico';
  const esEdicion = !!incidencia;

  const estados = {
    pendiente: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    en_progreso: { label: 'En Progreso', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    resuelto: { label: 'Resuelto', color: 'text-green-600 bg-green-50 border-green-200' }
  };

  // Obtener nombre de la planta seleccionada para mostrar
  const plantaSeleccionada = plantasPermitidas.find(p => p.id === formData.plantId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
              modoCompletar ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${
                modoCompletar ? 'text-green-600' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {modoCompletar ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {modoCompletar ? 'Completar Incidencia' : esEdicion ? 'Editar Incidencia' : 'Reportar Nueva Incidencia'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">
                {modoCompletar ? 'Documenta el trabajo realizado y materiales usados' : 
                 esEdicion ? 'Actualiza la información de la incidencia' : 'Completa los detalles del problema'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* ✅ SECCIÓN FOTOS ANTES (solo para nueva incidencia) */}
          {!modoCompletar && !esEdicion && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <SubidaFotos
                tipo="antes"
                onFotosChange={handleFotosAntesChange}
                fotosExistentes={[]}
              />
            </div>
          )}

          {/* Campo Planta - MEJORADO */}
          <div className="space-y-2">
            <label htmlFor="plantId" className="block text-sm font-medium text-gray-700">
              Planta *
            </label>
            
            {cargandoPlantas ? (
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg sm:rounded-xl text-gray-500 text-sm sm:text-base text-center">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando plantas...
                </div>
              </div>
            ) : user?.rol === 'cliente' && plantasPermitidas.length === 0 ? (
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl text-yellow-700 text-sm sm:text-base">
                No tienes plantas asignadas. Contacta al administrador.
              </div>
            ) : user?.rol === 'cliente' && plantasPermitidas.length === 1 ? (
              <div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl text-blue-700 text-sm sm:text-base">
                  <div className="font-medium">{plantasPermitidas[0]?.nombre}</div>
                  <div className="text-xs text-blue-600">{plantasPermitidas[0]?.ubicacion}</div>
                </div>
                <input 
                  type="hidden" 
                  name="plantId" 
                  value={plantasPermitidas[0]?.id} 
                  onChange={handleChange}
                />
                <p className="text-xs text-blue-600 mt-1">
                  Esta es tu única planta asignada
                </p>
              </div>
            ) : (
              <select
                id="plantId"
                name="plantId"
                required
                value={formData.plantId}
                onChange={handleChange}
                disabled={cargandoPlantas}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.plantId 
                    ? 'border-red-300 bg-red-50' 
                    : cargandoPlantas
                    ? 'border-gray-300 bg-gray-100 text-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">{cargandoPlantas ? 'Cargando...' : 'Seleccionar planta...'}</option>
                {plantasPermitidas.map((planta) => (
                  <option key={planta.id} value={planta.id}>
                    {planta.nombre} - {planta.ubicacion}
                  </option>
                ))}
              </select>
            )}
            
            {errors.plantId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.plantId}
              </p>
            )}

            {/* Mostrar información de la planta seleccionada */}
            {plantaSeleccionada && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>{plantaSeleccionada.nombre}</strong> - {plantaSeleccionada.ubicacion}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resto del formulario (mantener igual) */}
          {/* Campo Título */}
          <div className="space-y-2">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título del Problema *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              value={formData.titulo}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                errors.titulo 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ej: Bomba principal presentando fallos intermitentes"
            />
            {errors.titulo && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción Detallada *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base ${
                errors.descripcion 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Describe el problema en detalle..."
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.descripcion}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Mínimo 10 caracteres. Incluye todos los detalles relevantes para una atención eficiente.
            </p>
          </div>

          {/* ✅ SECCIÓN COMPLETAR TRABAJO */}
          {modoCompletar && (
            <>
              {/* Resumen del Trabajo */}
              <div className="space-y-2">
                <label htmlFor="resumenTrabajo" className="block text-sm font-medium text-gray-700">
                  Resumen del Trabajo Realizado *
                </label>
                <textarea
                  id="resumenTrabajo"
                  name="resumenTrabajo"
                  required
                  rows={4}
                  value={resumenTrabajo}
                  onChange={(e) => setResumenTrabajo(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base ${
                    errors.resumenTrabajo 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Describe detalladamente el trabajo realizado, pasos seguidos, soluciones implementadas..."
                />
                {errors.resumenTrabajo && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.resumenTrabajo}
                  </p>
                )}
              </div>

              {/* Fotos Después */}
              <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
                <SubidaFotos
                  tipo="despues"
                  onFotosChange={handleFotosDespuesChange}
                  fotosExistentes={[]}
                />
              </div>

              {/* Materiales Utilizados */}
              <div className="border border-gray-200 rounded-xl p-4 bg-blue-50">
                <FormularioMateriales
                  onMaterialesChange={handleMaterialesChange}
                  materialesIniciales={materiales}
                />
              </div>
            </>
          )}

          {/* Campo Estado (solo para admin/tecnico) */}
          {puedeGestionarEstado && (
            <div className="space-y-2">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado de la Incidencia
              </label>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
                <span className={`px-3 py-2 rounded-lg text-sm font-medium border text-center xs:text-left ${estados[formData.estado]?.color || estados.pendiente.color}`}>
                  {estados[formData.estado]?.label || 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Solo administradores y técnicos pueden modificar el estado.
              </p>
            </div>
          )}

          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-xs sm:text-sm min-w-0">
                <p className="text-gray-900 font-medium truncate">{user?.nombre || 'Usuario'}</p>
                <p className="text-gray-500 capitalize">{user?.rol || 'sin rol'}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 xs:flex-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || cargandoPlantas}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center flex-1 xs:flex-none ${
                modoCompletar 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              }`}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {modoCompletar ? 'Completar Incidencia' : 
                     esEdicion ? 'Actualizar Incidencia' : 'Reportar Incidencia'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}