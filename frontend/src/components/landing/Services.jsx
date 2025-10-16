import React from 'react';

const Services = () => {
  const services = [
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
    }
  ];

  const getIconLabel = (icon) => {
    const labels = {
      "🛡️": "Protección y seguridad",
      "⚡": "Energía eléctrica", 
      "🔧": "Herramientas industriales",
      "🤖": "Automatización robótica",
      "📊": "Análisis de datos",
      "💡": "Eficiencia energética"
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
            Soluciones para <span className="text-primary-600">Optimizar tus Operaciones</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            Desarrollamos estrategias personalizadas que garantizan eficiencia, seguridad y continuidad operativa en cada proyecto industrial.
          </p>
        </div>

        {/* Grid de Servicios Mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 p-6 lg:p-8 border border-secondary-100 hover:border-primary-200 hover:-translate-y-2 animate-fade-in-up"
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
              </div>

              {/* Contenido */}
              <h3 className="text-xl lg:text-2xl font-bold text-secondary-800 mb-4 group-hover:text-primary-600 transition-colors duration-300 leading-tight font-heading">
                {service.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed text-lg">
                {service.description}
              </p>

              {/* Link sutil mejorado */}
              <div className="mt-6 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-500 group/link">
                <span className="text-sm font-semibold">Conocer más</span>
                <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section Mejorado */}
        <div className="text-center mt-16 lg:mt-20 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-medium border border-secondary-100 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-4 font-heading">
              ¿Necesitas una solución personalizada?
            </h3>
            <p className="text-secondary-600 text-lg mb-6 lg:mb-8 max-w-2xl mx-auto">
              Contáctanos para analizar tus requerimientos específicos y desarrollar una propuesta a medida para tu operación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Solicitar Cotización
              </button>
              <button 
                onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Ver Proyectos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;