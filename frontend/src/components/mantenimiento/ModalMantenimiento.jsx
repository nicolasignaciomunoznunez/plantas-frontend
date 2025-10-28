import { useState, useEffect, useCallback, useRef } from 'react';
import { useMantenimientoStore } from '../../stores/mantenimientoStore';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';
import BadgeTipo from '../dashboard/BadgeTipo';
import BadgeEstado from '../dashboard/BadgeEstado';

// 🎨 Componente de Subida de Fotos (Mismo que incidencias)
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
          Fotos {tipo === 'antes' ? 'antes' : 'después'} del mantenimiento
        </label>
        <span className="text-xs text-gray-500">
          {fotos.length} / 10 fotos
        </span>
      </div>

      {/* Área de subida */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 bg-gray-50"
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

// 🎨 Componente de Formulario de Materiales (Mismo que incidencias)
const FormularioMateriales = ({ onMaterialesChange, materialesIniciales = [] }) => {
  const [materiales, setMateriales] = useState(materialesIniciales);

  const agregarMaterial = () => {
    const nuevoMaterial = { material_nombre: '', cantidad: 1, unidad: 'unidad', costo: 0 };
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
                  value={material.material_nombre}
                  onChange={(e) => actualizarMaterial(index, 'material_nombre', e.target.value)}
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

// ✅ MODAL PRINCIPAL ACTUALIZADO
export default function ModalMantenimiento({ 
  isOpen, 
  onClose, 
  mantenimiento, 
  plantaPreSeleccionada, 
  modoCompletar = false,
  onMantenimientoGuardado 
}) {
  const { 
    crearMantenimiento, 
    actualizarMantenimiento,
    completarMantenimiento,
    iniciarMantenimiento,
    subirFotosMantenimiento,
    generarReportePDF,
    loading 
  } = useMantenimientoStore();
  
  const { plantas, obtenerPlantas } = usePlantasStore();
  const { user } = useAuthStore();
  
  // ✅ NUEVOS ESTADOS PARA FOTOS Y MATERIALES
  const [fotosAntes, setFotosAntes] = useState([]);
  const [fotosDespues, setFotosDespues] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [resumenTrabajo, setResumenTrabajo] = useState('');
  
  const [formData, setFormData] = useState({
    plantId: plantaPreSeleccionada || '',
    tipo: 'preventivo',
    descripcion: '',
    fechaProgramada: '',
    estado: 'pendiente'
  });
  const [errors, setErrors] = useState({});

  // ✅ OPTIMIZACIÓN: useCallback para evitar recreación
  const handleClose = useCallback(() => {
    // Limpiar estados al cerrar
    setFotosAntes([]);
    setFotosDespues([]);
    setMateriales([]);
    setResumenTrabajo('');
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      obtenerPlantas(50);
    }
  }, [isOpen, obtenerPlantas]);

  // ✅ OPTIMIZACIÓN: Reset más eficiente
  useEffect(() => {
    if (!isOpen) return;

    if (mantenimiento) {
      setFormData({
        plantId: mantenimiento.plantId || '',
        tipo: mantenimiento.tipo || 'preventivo',
        descripcion: mantenimiento.descripcion || '',
        fechaProgramada: mantenimiento.fechaProgramada ? 
          new Date(mantenimiento.fechaProgramada).toISOString().split('T')[0] : '',
        estado: mantenimiento.estado || 'pendiente'
      });

      // Cargar datos adicionales si estamos en modo completar
      if (modoCompletar) {
        setResumenTrabajo(mantenimiento.descripcion || '');
        setMateriales(mantenimiento.materiales || []);
      }
    } else {
      setFormData({
        plantId: plantaPreSeleccionada || '',
        tipo: 'preventivo',
        descripcion: '',
        fechaProgramada: '',
        estado: 'pendiente'
      });
    }
    setErrors({});
  }, [mantenimiento, plantaPreSeleccionada, modoCompletar, isOpen]);

  // ✅ VALIDACIÓN ACTUALIZADA PARA MODO COMPLETAR
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.plantId) {
      newErrors.plantId = 'Selecciona una planta';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!formData.fechaProgramada) {
      newErrors.fechaProgramada = 'La fecha programada es requerida';
    } else {
      const selectedDate = new Date(formData.fechaProgramada);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fechaProgramada = 'La fecha no puede ser en el pasado';
      }
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
  }, [formData, modoCompletar, resumenTrabajo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ✅ MEJORA: Limpiar error solo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

  // ✅ MANEJADOR DE SUBMIT ACTUALIZADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let resultado;

      if (modoCompletar && mantenimiento) {
        console.log('🔄 Completando mantenimiento:', mantenimiento.id);
        
        // ✅ COMPLETAR MANTENIMIENTO
        resultado = await completarMantenimiento(mantenimiento.id, {
          resumenTrabajo,
          materiales,
          fotos: fotosDespues.map(foto => ({
            tipo: 'despues',
            datos_imagen: foto,
            ruta_archivo: foto.name,
            descripcion: `Foto después - ${foto.name}`
          }))
        });

        // ✅ OFRECER DESCARGAR PDF INMEDIATAMENTE
        setTimeout(() => {
          const descargarPDF = window.confirm(
            '✅ Mantenimiento completado exitosamente!\n\n' +
            '¿Deseas descargar el reporte PDF ahora?\n\n' +
            'El PDF incluirá:\n' +
            '• Información completa del mantenimiento\n' +
            '• Fotos antes/después del trabajo\n' +
            '• Materiales utilizados\n' +
            '• Resumen del trabajo realizado'
          );
          
          if (descargarPDF) {
            generarReportePDF(mantenimiento.id);
          }
        }, 500);

      } else if (mantenimiento && formData.estado === 'en_progreso') {
        // ✅ INICIAR MANTENIMIENTO
        resultado = await iniciarMantenimiento(mantenimiento.id, fotosAntes.map(foto => ({
          tipo: 'antes',
          datos_imagen: foto,
          ruta_archivo: foto.name,
          descripcion: `Foto antes - ${foto.name}`
        })));

        console.log('✅ Mantenimiento iniciado correctamente');

      } else if (mantenimiento) {
        // Edición normal
        resultado = await actualizarMantenimiento(mantenimiento.id, formData);
        console.log('✅ Mantenimiento actualizado correctamente');
        
      } else {
        // Nuevo mantenimiento
        resultado = await crearMantenimiento({
          ...formData,
          userId: user?.id
        });
        
        // Subir fotos antes si existen
        if (fotosAntes.length > 0 && resultado?.mantenimiento?.id) {
          await subirFotosMantenimiento(resultado.mantenimiento.id, fotosAntes, 'antes');
        }
        console.log('✅ Mantenimiento creado correctamente');
      }
      
      // ✅ CERRAR MODAL AUTOMÁTICAMENTE después de éxito
      if (onMantenimientoGuardado) {
        onMantenimientoGuardada();
      }
      handleClose();
      
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Error al guardar el mantenimiento. Intenta nuevamente.'
      }));
    }
  };

  // ✅ MEJORA: Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const esEdicion = !!mantenimiento;
  const puedeGestionarEstado = user?.rol === 'superadmin' || user?.rol === 'admin' || user?.rol === 'tecnico';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              modoCompletar ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <svg className={`w-5 h-5 ${
                modoCompletar ? 'text-green-600' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {modoCompletar ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                )}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {modoCompletar ? 'Completar Mantenimiento' : 
                 esEdicion ? 'Editar Mantenimiento' : 'Programar Mantenimiento'}
              </h2>
              <p className="text-sm text-gray-500">
                {modoCompletar ? 'Documenta el trabajo realizado y materiales usados' : 
                 esEdicion ? 'Actualiza la información del mantenimiento' : 'Programa un nuevo mantenimiento para la planta'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error general de submit */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          {/* ✅ SECCIÓN FOTOS ANTES (solo para nuevo mantenimiento o iniciar) */}
          {!modoCompletar && !esEdicion && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <SubidaFotos
                tipo="antes"
                onFotosChange={handleFotosAntesChange}
                fotosExistentes={[]}
              />
            </div>
          )}

          {/* Campo Planta */}
          <div className="space-y-2">
            <label htmlFor="plantId" className="block text-sm font-medium text-gray-700">
              Planta *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              value={formData.plantId}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.plantId 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Seleccionar planta...</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre} - {planta.ubicacion}
                </option>
              ))}
            </select>
            {errors.plantId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.plantId}
              </p>
            )}
          </div>

          {/* Campo Tipo */}
          <div className="space-y-2">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo de Mantenimiento *
            </label>
            <div className="flex gap-3">
              <select
                id="tipo"
                name="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
              <BadgeTipo tipo={formData.tipo} />
            </div>
            <p className="text-xs text-gray-500">
              {formData.tipo === 'preventivo' 
                ? 'Mantenimiento programado para prevenir fallos' 
                : 'Mantenimiento para corregir fallos existentes'
              }
            </p>
          </div>

          {/* Campo Fecha Programada */}
          <div className="space-y-2">
            <label htmlFor="fechaProgramada" className="block text-sm font-medium text-gray-700">
              Fecha Programada *
            </label>
            <input
              type="date"
              id="fechaProgramada"
              name="fechaProgramada"
              required
              value={formData.fechaProgramada}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.fechaProgramada 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.fechaProgramada && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.fechaProgramada}
              </p>
            )}
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción del Mantenimiento *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.descripcion 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Describe en detalle las tareas de mantenimiento a realizar, herramientas necesarias y procedimientos..."
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.descripcion}
              </p>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mínimo 10 caracteres</span>
              <span className={formData.descripcion.length < 10 ? 'text-red-500' : 'text-green-500'}>
                {formData.descripcion.length}/10
              </span>
            </div>
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
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
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
                Estado del Mantenimiento
              </label>
              <div className="flex gap-3">
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                </select>
                <BadgeEstado estado={formData.estado} />
              </div>
              <p className="text-xs text-gray-500">
                Solo administradores y técnicos pueden modificar el estado.
              </p>
            </div>
          )}

          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{user?.nombre || 'Usuario'}</p>
                <p className="text-gray-500 capitalize">{user?.rol || 'sin rol'}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-sm font-medium text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                modoCompletar 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {modoCompletar ? 'Completar Mantenimiento' : 
                   esEdicion ? 'Actualizar' : 'Programar'} Mantenimiento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}