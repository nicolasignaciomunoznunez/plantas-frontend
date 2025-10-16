// components/landing/About.jsx
import React from 'react';

const About = () => {
  const values = [
    {
      icon: "🎯",
      title: "Misión",
      description: "Garantizar el funcionamiento óptimo de plantas de agua potable mediante soluciones tecnológicas innovadoras y mantenimiento especializado."
    },
    {
      icon: "👁️",
      title: "Visión",
      description: "Ser referentes en ingeniería aplicada al sector hídrico, contribuyendo al desarrollo sostenible de comunidades."
    },
    {
      icon: "⭐",
      title: "Valores",
      description: "Compromiso, innovación, calidad y responsabilidad ambiental en cada proyecto que emprendemos."
    }
  ];

  const milestones = [
    { year: "2019", event: "Fundación de R&V SPA" },
    { year: "2020", event: "Primer proyecto de automatización" },
    { year: "2021", event: "Expansión a mantenimiento industrial" },
    { year: "2022", event: "+10 plantas optimizadas" },
    { year: "2023", event: "Certificación de calidad" },
    { year: "2024", event: "Líderes en soluciones hídricas" }
  ];

  return (
    <section id="nosotros" className="py-16 lg:py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full translate-y-48 -translate-x-48 opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Mejorado */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Sobre Nosotros
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Más de <span className="text-blue-600">5 años</span> innovando en 
            <span className="text-blue-600"> soluciones hídricas</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Especialistas en soluciones integrales para el óptimo funcionamiento de plantas de agua potable. 
            Combinamos <strong>innovación tecnológica</strong> con <strong>experiencia probada</strong> para servir 
            a comunidades y garantizar acceso al agua de calidad.
          </p>
        </div>

        {/* Grid de Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:border-blue-200"
            >
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {value.icon}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Línea de Tiempo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
            Nuestra Trayectoria
          </h3>
          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full hidden lg:block"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'
                  }`}
                >
                  <div className={`bg-white border-2 border-blue-100 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 max-w-md ${
                    index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                  }`}>
                    <div className="text-blue-600 font-bold text-lg lg:text-xl mb-2">
                      {milestone.year}
                    </div>
                    <div className="text-gray-700 text-lg">
                      {milestone.event}
                    </div>
                  </div>
                  
                  {/* Punto en la línea */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 lg:p-12 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              ¿Listo para optimizar tu planta de agua?
            </h3>
            <p className="text-blue-100 text-lg lg:text-xl mb-6 max-w-2xl mx-auto">
              Contamos con la experiencia y tecnología para llevar tu operación al siguiente nivel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                Solicitar Auditoría
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Conocer Casos de Éxito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;