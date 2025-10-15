export default function BadgeTipo({ tipo, size = 'md' }) {
 
  const sizeConfig = {
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
  };

  const { text: textSize, padding, icon: iconSize } = sizeConfig[size];

  const config = {
    preventivo: { 
      clase: 'bg-purple-50 text-purple-700 border-purple-200', 
      texto: 'Preventivo',
      icono: '🛡️'
    },
    correctivo: { 
      clase: 'bg-orange-50 text-orange-700 border-orange-200', 
      texto: 'Correctivo',
      icono: '🔧'
    },
    
    emergencia: {
      clase: 'bg-red-50 text-red-700 border-red-200',
      texto: 'Emergencia',
      icono: '🚨'
    },
    programado: {
      clase: 'bg-blue-50 text-blue-700 border-blue-200',
      texto: 'Programado',
      icono: '📅'
    },
    rutinario: {
      clase: 'bg-green-50 text-green-700 border-green-200',
      texto: 'Rutinario',
      icono: '🔄'
    }
  };

  const { clase, texto, icono } = config[tipo] || { 
    clase: 'bg-gray-100 text-gray-800 border-gray-200', 
    texto: tipo?.charAt(0).toUpperCase() + tipo?.slice(1) || 'Desconocido',
    icono: '⚪'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${clase} ${textSize} ${padding}`}>
      <span className={iconSize}>{icono}</span>
      {texto}
    </span>
  );
}