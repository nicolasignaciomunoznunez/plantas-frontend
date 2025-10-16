import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Planes de contingencia y mitigación",
      description: "Elaboramos estrategias integrales para anticipar y responder de manera efectiva a situaciones imprevistas, minimizando riesgos y asegurando la continuidad operativa.",
      icon: "🛡️",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Mantenimiento eléctrico",
      description: "Realizamos inspecciones, reparaciones y optimización de sistemas eléctricos para garantizar su funcionamiento, prevenir fallas y extender su vida útil.",
      icon: "⚡",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Mantenimiento Industrial",
      description: "Garantizamos la operatividad y seguridad de equipos y sistemas mediante inspecciones, reparaciones y mejoras, optimizando su rendimiento y vida útil.",
      icon: "🔧",
      gradient: "from-gray-600 to-gray-700"
    },
    {
      title: "Automatización de procesos",
      description: "Diseñamos e implementamos soluciones tecnológicas para optimizar tareas, mejorar la eficiencia, reducir costos y aumentar la productividad operativa.",
      icon: "🤖",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Control y gestión de la planta",
      description: "Implementamos sistemas para supervisar, optimizar y coordinar procesos productivos, garantizando eficiencia, seguridad y mejores resultados operativos.",
      icon: "📊",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Análisis y Gestión Energética",
      description: "Realizamos auditorías energéticas, identificamos oportunidades de ahorro y diseñamos estrategias para optimizar el consumo y mejorar la eficiencia energética.",
      icon: "💡",
      gradient: "from-amber-500 to-yellow-500"
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
    <section id="servicios" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Mejorado */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Soluciones integrales para 
            <span className="text-blue-600"> optimizar tus operaciones</span> industriales
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Desarrollamos estrategias personalizadas que garantizan eficiencia, seguridad y continuidad operativa en cada proyecto.
          </p>
        </div>

        {/* Grid de Servicios Mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
            >
              {/* Icono con Gradiente */}
              <div className="relative mb-6">
                <div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                  role="img"
                  aria-label={getIconLabel(service.icon)}
                >
                  {service.icon}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Contenido */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                {service.description}
              </p>

              {/* Link sutil */}
              <div className="mt-6 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-semibold">Más información</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              ¿Necesitas una solución personalizada?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contáctanos para analizar tus requerimientos específicos y desarrollar una propuesta a medida.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
              Solicitar Cotización
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;