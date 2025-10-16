// components/dashboard/BadgeTipo.jsx
import React from 'react';
import { clsx } from 'clsx';

// 🎨 Configuración centralizada usando tu Design System
const BADGE_TIPO_CONFIG = {
  sizes: {
    sm: {
      text: 'text-xs',
      padding: 'px-2 py-0.5',
      icon: 'text-xs'
    },
    md: {
      text: 'text-xs sm:text-sm',
      padding: 'px-2.5 py-1',
      icon: 'text-sm'
    },
    lg: {
      text: 'text-sm sm:text-base',
      padding: 'px-3 py-1.5',
      icon: 'text-base'
    }
  },

  tipos: {
    // ✅ Tipos de mantenimiento
    preventivo: {
      clase: 'bg-primary-50 text-primary-700 border-primary-200 shadow-soft',
      texto: 'Preventivo',
      icono: '🛡️',
      descripcion: 'Mantenimiento planificado para prevenir fallos'
    },
    correctivo: {
      clase: 'bg-warning-50 text-warning-700 border-warning-200 shadow-soft',
      texto: 'Correctivo',
      icono: '🔧',
      descripcion: 'Reparación tras una falla identificada'
    },
    emergencia: {
      clase: 'bg-error-50 text-error-700 border-error-200 shadow-soft',
      texto: 'Emergencia',
      icono: '🚨',
      descripcion: 'Intervención urgente por fallo crítico'
    },
    programado: {
      clase: 'bg-secondary-50 text-secondary-700 border-secondary-200 shadow-soft',
      texto: 'Programado',
      icono: '📅',
      descripcion: 'Actividad agendada en el calendario'
    },
    rutinario: {
      clase: 'bg-success-50 text-success-700 border-success-200 shadow-soft',
      texto: 'Rutinario',
      icono: '🔄',
      descripcion: 'Tarea periódica de operación'
    },
    
    // ✅ Tipos adicionales para incidencias
    electrico: {
      clase: 'bg-purple-50 text-purple-700 border-purple-200 shadow-soft',
      texto: 'Eléctrico',
      icono: '⚡',
      descripcion: 'Problema en sistema eléctrico'
    },
    mecanico: {
      clase: 'bg-orange-50 text-orange-700 border-orange-200 shadow-soft',
      texto: 'Mecánico',
      icono: '⚙️',
      descripcion: 'Falla en componentes mecánicos'
    },
    hidraulico: {
      clase: 'bg-blue-50 text-blue-700 border-blue-200 shadow-soft',
      texto: 'Hidráulico',
      icono: '💧',
      descripcion: 'Problema en sistema de agua'
    },
    electronico: {
      clase: 'bg-cyan-50 text-cyan-700 border-cyan-200 shadow-soft',
      texto: 'Electrónico',
      icono: '🔌',
      descripcion: 'Falla en componentes electrónicos'
    },

    // ✅ Estado por defecto
    desconocido: {
      clase: 'bg-secondary-100 text-secondary-600 border-secondary-200 shadow-soft',
      texto: 'Desconocido',
      icono: '❓',
      descripcion: 'Tipo no especificado'
    }
  }
};

// 🎯 Interface de props para mejor autocompletado
/**
 * @typedef {Object} BadgeTipoProps
 * @property {'preventivo'|'correctivo'|'emergencia'|'programado'|'rutinario'|'electrico'|'mecanico'|'hidraulico'|'electronico'} tipo
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {boolean} [showIcon=true]
 * @property {boolean} [showTooltip=false]
 * @property {string} [className]
 * @property {React.ReactNode} [customIcon]
 */

/**
 * Componente BadgeTipo - Muestra tipos de mantenimiento/incidencias con iconos y colores
 * @param {BadgeTipoProps} props
 */
export default function BadgeTipo({ 
  tipo, 
  size = 'md', 
  showIcon = true,
  showTooltip = false,
  className = '',
  customIcon
}) {
  // 🛡️ Validación de tipo
  const tipoValido = BADGE_TIPO_CONFIG.tipos[tipo] || BADGE_TIPO_CONFIG.tipos.desconocido;
  const tamañoConfig = BADGE_TIPO_CONFIG.sizes[size];

  // 🎨 Clases base responsivas
  const baseClasses = clsx(
    'inline-flex items-center gap-1.5 rounded-full font-medium border transition-all duration-200 hover:shadow-medium',
    tamañoConfig.text,
    tamañoConfig.padding,
    tipoValido.clase,
    className
  );

  // 🎯 Contenido del badge
  const badgeContent = (
    <span className={baseClasses}>
      {showIcon && (
        <span className={`flex-shrink-0 ${tamañoConfig.icon}`}>
          {customIcon || tipoValido.icono}
        </span>
      )}
      <span className="whitespace-nowrap font-sans font-medium">
        {tipoValido.texto}
      </span>
    </span>
  );

  // 🎯 Tooltip opcional
  if (showTooltip) {
    return (
      <div className="relative group">
        {badgeContent}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-large">
          {tipoValido.descripcion}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-secondary-800"></div>
        </div>
      </div>
    );
  }

  return badgeContent;
}

// 🎯 Componente adicional: BadgeTipoConPrioridad
/**
 * Badge especial que muestra tipo con indicador de prioridad
 */
export function BadgeTipoConPrioridad({ 
  tipo, 
  prioridad = 'media',
  size = 'md' 
}) {
  const prioridadConfig = {
    baja: 'border-l-4 border-l-success-400',
    media: 'border-l-4 border-l-warning-400',
    alta: 'border-l-4 border-l-error-400',
    critica: 'border-l-4 border-l-error-600 animate-pulse'
  };

  return (
    <div className="relative">
      <BadgeTipo 
        tipo={tipo} 
        size={size}
        className={prioridadConfig[prioridad]}
      />
    </div>
  );
}

// 🎯 Componente para grupo de badges
export function GrupoBadgesTipos({ tipos, size = 'sm', maxMostrar = 3 }) {
  const tiposMostrados = tipos.slice(0, maxMostrar);
  const tiposOcultos = tipos.slice(maxMostrar);

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {tiposMostrados.map((tipo, index) => (
        <BadgeTipo
          key={tipo}
          tipo={tipo}
          size={size}
          showTooltip={true}
        />
      ))}
      
      {tiposOcultos.length > 0 && (
        <span className={clsx(
          'bg-secondary-100 text-secondary-600 rounded-full font-medium border border-secondary-200',
          BADGE_TIPO_CONFIG.sizes[size].text,
          BADGE_TIPO_CONFIG.sizes[size].padding
        )}>
          +{tiposOcultos.length}
        </span>
      )}
    </div>
  );
}

// 🎯 Hook personalizado para usar tipos del badge
export function useBadgeTipos() {
  const obtenerConfigTipo = (tipo) => {
    return BADGE_TIPO_CONFIG.tipos[tipo] || BADGE_TIPO_CONFIG.tipos.desconocido;
  };

  const obtenerTiposPorCategoria = (categoria) => {
    const categorias = {
      mantenimiento: ['preventivo', 'correctivo', 'emergencia', 'programado', 'rutinario'],
      incidencias: ['electrico', 'mecanico', 'hidraulico', 'electronico']
    };
    
    return categorias[categoria] || [];
  };

  const filtrarTiposDisponibles = (tipos) => {
    return tipos.filter(tipo => BADGE_TIPO_CONFIG.tipos[tipo]);
  };

  return {
    obtenerConfigTipo,
    obtenerTiposPorCategoria,
    filtrarTiposDisponibles,
    todosLosTipos: Object.keys(BADGE_TIPO_CONFIG.tipos).filter(tipo => tipo !== 'desconocido')
  };
}

// 🎯 Utilidad para obtener colores consistentes
export const obtenerColorTipo = (tipo) => {
  const config = BADGE_TIPO_CONFIG.tipos[tipo] || BADGE_TIPO_CONFIG.tipos.desconocido;
  const clases = config.clase.split(' ');
  const bgColor = clases.find(clase => clase.startsWith('bg-'));
  const textColor = clases.find(clase => clase.startsWith('text-'));
  
  return {
    fondo: bgColor || 'bg-secondary-100',
    texto: textColor || 'text-secondary-600'
  };
};