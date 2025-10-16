// components/dashboard/BadgeEstado.jsx
import React from 'react';
import { clsx } from 'clsx';

// 🎨 Configuración centralizada para consistencia
const BADGE_CONFIG = {
  sizes: {
    sm: {
      text: 'text-xs',
      padding: 'px-2 py-0.5',
      icon: 'w-2.5 h-2.5'
    },
    md: {
      text: 'text-xs sm:text-sm',
      padding: 'px-2.5 py-1',
      icon: 'w-3 h-3'
    },
    lg: {
      text: 'text-sm sm:text-base',
      padding: 'px-3 py-1.5',
      icon: 'w-3.5 h-3.5 sm:w-4 sm:h-4'
    }
  },

  estados: {
    // ✅ Estados de incidencias
    pendiente: {
      clase: 'bg-warning-50 text-warning-700 border-warning-200',
      texto: 'Pendiente',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    en_progreso: {
      clase: 'bg-primary-50 text-primary-700 border-primary-200',
      texto: 'En Progreso',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    resuelto: {
      clase: 'bg-success-50 text-success-700 border-success-200',
      texto: 'Resuelto',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    },

    // ✅ Estados de mantenimiento
    completado: {
      clase: 'bg-success-50 text-success-700 border-success-200',
      texto: 'Completado',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    },
    programado: {
      clase: 'bg-secondary-50 text-secondary-700 border-secondary-200',
      texto: 'Programado',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    },

    // ✅ Estados del sistema
    optimal: {
      clase: 'bg-success-50 text-success-700 border-success-200',
      texto: 'Óptimo',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    attention: {
      clase: 'bg-warning-50 text-warning-700 border-warning-200',
      texto: 'Atención',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    critical: {
      clase: 'bg-error-50 text-error-700 border-error-200',
      texto: 'Crítico',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },

    // ✅ Estado por defecto
    desconocido: {
      clase: 'bg-secondary-50 text-secondary-600 border-secondary-200',
      texto: 'Desconocido',
      icono: (
        <svg className="fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
  }
};

// 🎯 Interface de props para mejor autocompletado
/**
 * @typedef {Object} BadgeEstadoProps
 * @property {'pendiente'|'en_progreso'|'resuelto'|'completado'|'programado'|'optimal'|'attention'|'critical'} estado
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {boolean} [showIcon=true]
 * @property {string} [className]
 */

/**
 * Componente BadgeEstado - Muestra estados con iconos y colores consistentes
 * @param {BadgeEstadoProps} props
 */
export default function BadgeEstado({ 
  estado, 
  size = 'md', 
  showIcon = true,
  className = ''
}) {
  // 🛡️ Validación de estado
  const estadoValido = BADGE_CONFIG.estados[estado] || BADGE_CONFIG.estados.desconocido;
  const tamañoConfig = BADGE_CONFIG.sizes[size];

  // 🎨 Clases base responsivas
  const baseClasses = clsx(
    'inline-flex items-center gap-1.5 rounded-full font-medium border transition-all duration-200',
    tamañoConfig.text,
    tamañoConfig.padding,
    estadoValido.clase,
    className
  );

  return (
    <span className={baseClasses}>
      {showIcon && (
        <span className={`flex-shrink-0 ${tamañoConfig.icon}`}>
          {estadoValido.icono}
        </span>
      )}
      <span className="whitespace-nowrap">
        {estadoValido.texto}
      </span>
    </span>
  );
}

// 🎯 Componente adicional: BadgeContador para estados con números
/**
 * Badge especial para mostrar conteos con estado
 */
export function BadgeContador({ 
  estado, 
  count, 
  size = 'md',
  showZero = false 
}) {
  if (!showZero && (!count || count === 0)) return null;

  const estadoValido = BADGE_CONFIG.estados[estado] || BADGE_CONFIG.estados.desconocido;
  const tamañoConfig = BADGE_CONFIG.sizes[size];

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 rounded-full font-medium border transition-all duration-200',
      tamañoConfig.text,
      tamañoConfig.padding,
      estadoValido.clase
    )}>
      <span className={tamañoConfig.icon}>
        {estadoValido.icono}
      </span>
      <span className="font-semibold">
        {count}
      </span>
    </span>
  );
}

// 🎯 Hook personalizado para usar estados del badge
export function useBadgeEstados() {
  const obtenerConfigEstado = (estado) => {
    return BADGE_CONFIG.estados[estado] || BADGE_CONFIG.estados.desconocido;
  };

  const obtenerClaseEstado = (estado) => {
    return obtenerConfigEstado(estado).clase;
  };

  const listaEstadosDisponibles = () => {
    return Object.keys(BADGE_CONFIG.estados).filter(estado => estado !== 'desconocido');
  };

  return {
    obtenerConfigEstado,
    obtenerClaseEstado,
    listaEstadosDisponibles
  };
}