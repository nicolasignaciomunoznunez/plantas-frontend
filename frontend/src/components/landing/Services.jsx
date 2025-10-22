import React from 'react';

const Services = () => {
  const services = [
    // ✅ SERVICIOS EXISTENTES (Mantenidos)
    {
      title: "Planes de contingencia y mitigación",
      description: "Elaboramos estrategias integrales para anticipar y responder de manera efectiva a situaciones imprevistas, minimizando riesgos y asegurando la continuidad operativa.",
      icon: "🛡️",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      title: "Mantenimiento eléctrico",
      description: "Realizamos inspecciones, reparaciones y optimización de sistemas eléctricos para garantizar su funcionamiento, prevenir fallas y extender su vida útil.",
      icon: "⚡",
      gradient: "from-primary-400 to-primary-500"
    },
    {
      title: "Mantenimiento Industrial",
      description: "Garantizamos la operatividad y seguridad de equipos y sistemas mediante inspecciones, reparaciones y mejoras, optimizando su rendimiento y vida útil.",
      icon: "🔧",
      gradient: "from-primary-600 to-primary-700"
    },
    {
      title: "Automatización de procesos",
      description: "Diseñamos e implementamos soluciones tecnológicas para optimizar tareas, mejorar la eficiencia, reducir costos y aumentar la productividad operativa.",
      icon: "🤖",
      gradient: "from-primary-300 to-primary-400"
    },
    {
      title: "Control y gestión de la planta",
      description: "Implementamos sistemas para supervisar, optimizar y coordinar procesos productivos, garantizando eficiencia, seguridad y mejores resultados operativos.",
      icon: "📊",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      title: "Análisis y Gestión Energética",
      description: "Realizamos auditorías energéticas, identificamos oportunidades de ahorro y diseñamos estrategias para optimizar el consumo y mejorar la eficiencia energética.",
      icon: "💡",
      gradient: "from-primary-400 to-primary-500"
    },
    
    // ✅ NUEVOS SERVICIOS - ENERGÍA SOLAR (Relacionados con plantas)
    {
      title: "Instalación de Paneles Solares Industriales",
      description: "Diseñamos e implementamos sistemas fotovoltaicos para plantas industriales, reduciendo costos energéticos y promoviendo sostenibilidad operativa.",
      icon: "☀️",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Monitoreo de Eficiencia Energética Solar",
      description: "Sistemas inteligentes de seguimiento para optimizar el rendimiento de instalaciones solares en plantas industriales y comerciales.",
      icon: "📈",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Mantenimiento de Sistemas Fotovoltaicos",
      description: "Servicios especializados de limpieza, revisión y reparación de paneles solares para garantizar máximo rendimiento en plantas industriales.",
      icon: "🧹",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  const getIconLabel = (icon) => {
    const labels = {
      "🛡️": "Protección y seguridad",
      "⚡": "Energía eléctrica", 
      "🔧": "Herramientas industriales",
      "🤖": "Automatización robótica",
      "📊": "Análisis de datos",
      "💡": "Eficiencia energética",
      "☀️": "Energía solar",
      "📈": "Monitoreo y análisis",
      "🧹": "Limpieza y mantenimiento"
    };
    return labels[icon] || "Servicio industrial";
  };

  return (
    <section id="servicios" className="py-16 lg:py-24 bg-gradient-to-br from-secondary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Mejorado */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 shadow-soft">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 leading-tight font-heading">
            Soluciones Integrales para <span className="text-primary-600">Plantas Industriales</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            Desde mantenimiento industrial hasta energía solar, desarrollamos estrategias personalizadas que garantizan eficiencia, seguridad y sostenibilidad operativa.
          </p>
        </div>

        {/* Grid de Servicios Mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 p-6 lg:p-8 border border-secondary-100 hover:border-primary-200 hover:-translate-y-2 animate-fade-in-up ${
                // Destacar servicios solares
                service.icon === "☀️" || service.icon === "📈" || service.icon === "🧹" 
                  ? 'ring-2 ring-amber-200 ring-opacity-50' 
                  : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icono con Gradiente */}
              <div className="relative mb-6">
                <div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300 shadow-medium`}
                  role="img"
                  aria-label={getIconLabel(service.icon)}
                >
                  {service.icon}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                
                {/* Badge para servicios solares */}
                {(service.icon === "☀️" || service.icon === "📈" || service.icon === "🧹") && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    SOLAR
                  </div>
                )}
              </div>

              {/* Contenido */}
              <h3 className="text-xl lg:text-2xl font-bold text-secondary-800 mb-4 group-hover:text-primary-600 transition-colors duration-300 leading-tight font-heading">
                {service.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed text-lg">
                {service.description}
              </p>

              {/* Categoría sutil */}
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <span className="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  {service.icon === "☀️" || service.icon === "📈" || service.icon === "🧹" 
                    ? "Energía Solar" 
                    : "Plantas Industriales"
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Especialización */}
        <div className="mt-16 lg:mt-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 lg:p-12 text-white text-center animate-fade-in-up">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-heading">
            Especialistas en Optimización de Plantas
          </h3>
          <p className="text-lg lg:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Combinamos <strong>mantenimiento industrial tradicional</strong> con <strong>soluciones de energía solar modernas </strong> 
            para crear plantas más eficientes, sostenibles y rentables.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">⚡ Energía</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">🔧 Mantenimiento</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">☀️ Solar</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">📊 Control</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;