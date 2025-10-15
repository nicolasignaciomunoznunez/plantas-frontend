// components/dashboard/BadgeEstado.jsx
export default function BadgeEstado({ estado, size = 'md' }) {
  // ✅ CONFIGURACIÓN RESPONSIVE
  const sizeConfig = {
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
  };

  const { text: textSize, padding, icon: iconSize } = sizeConfig[size];

  const config = {
    pendiente: { 
      clase: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      texto: 'Pendiente',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    en_progreso: { 
      clase: 'bg-blue-100 text-blue-800 border-blue-200', 
      texto: 'En Progreso',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    resuelto: { 
      clase: 'bg-green-100 text-green-800 border-green-200', 
      texto: 'Resuelto',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    completado: { 
      clase: 'bg-green-100 text-green-800 border-green-200', 
      texto: 'Completado',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    // ✅ ESTADOS ADICIONALES PARA MÁS FLEXIBILIDAD
    critical: {
      clase: 'bg-red-100 text-red-800 border-red-200',
      texto: 'Crítico',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    optimal: {
      clase: 'bg-green-100 text-green-800 border-green-200',
      texto: 'Óptimo',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    attention: {
      clase: 'bg-orange-100 text-orange-800 border-orange-200',
      texto: 'Atención',
      icono: (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  };

  const { clase, texto, icono } = config[estado] || { 
    clase: 'bg-gray-100 text-gray-800 border-gray-200', 
    texto: estado?.charAt(0).toUpperCase() + estado?.slice(1) || 'Desconocido',
    icono: <div className={`${iconSize} bg-current rounded-full`}></div>
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${clase} ${textSize} ${padding}`}>
      {icono}
      {texto}
    </span>
  );
}