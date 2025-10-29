// components/landing/Projects.jsx
import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: "Gestión de Plantas de Agua",
      image: "/images/fusionppr.jpg",
      category: "Infraestructura Hídrica",
      description: "Sistemas completos de agua potable rural e industrial con tecnología de fusión HDPE y PPR",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Sistemas Eléctricos Integrales", 
      image: "/images/hdpe.jpg",
      category: "Energía y Electricidad",
      description: "Instalación y mantenimiento eléctrico para plantas industriales y edificios comerciales",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Climatización y HVAC",
      image: "/images/calor.jpg",
      category: "Confort Térmico",
      description: "Sistemas de aire acondicionado y calefacción con análisis termográfico predictivo",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "Automatización de Edificios", 
      image: "/images/automatizacion.webp", 
      category: "Control Inteligente",
      description: "Sistemas SCADA y PLC para automatización residencial, comercial e industrial",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Seguridad en Sistemas de Gas",
      image: "/images/mitigacion.jpg",
      category: "Infraestructura Crítica", 
      description: "Instalación y certificación de redes de gas con planes de contingencia avanzados",
      gradient: "from-red-500 to-orange-500"
    },
    {
      title: "Gestión de Edificios",
      image: "/images/placeholder-project.jpg", // Puedes cambiar esta imagen
      category: "Infraestructura Comercial",
      description: "Mantenimiento integral de condominios y edificios corporativos multiservicio",
      gradient: "from-gray-600 to-gray-700"
    }
  ];

  return (
    <section id="proyectos" className="py-16 lg:py-24 bg-gradient-to-br from-secondary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Actualizado */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 shadow-soft">
            Proyectos Destacados
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 font-heading">
            De Plantas Industriales a <span className="text-primary-600">Edificios Residenciales</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            Implementamos soluciones integrales que optimizan infraestructuras críticas: desde plantas de agua hasta sistemas completos de edificios
          </p>
        </div>

        {/* Grid de Proyectos Actualizado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 overflow-hidden border border-secondary-100 hover:border-primary-200 hover:-translate-y-3 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Imagen con overlay */}
              <div className="relative h-64 lg:h-72 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-project.jpg';
                  }}
                />
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badge de categoría */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${project.gradient} backdrop-blur-sm border border-white/20`}>
                    {project.category}
                  </span>
                </div>

                {/* Icono de hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors duration-300 font-heading">
                  {project.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed mb-4">
                  {project.description}
                </p>
                
                {/* Etiqueta de especialidad */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.category === "Infraestructura Hídrica" && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">💧 Agua</span>
                  )}
                  {project.category === "Energía y Electricidad" && (
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-lg">⚡ Electricidad</span>
                  )}
                  {project.category === "Confort Térmico" && (
                    <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-1 rounded-lg">❄️ Climatización</span>
                  )}
                  {project.category === "Control Inteligente" && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg">🏠 Automatización</span>
                  )}
                  {project.category === "Infraestructura Crítica" && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg">🔥 Gas</span>
                  )}
                  {project.category === "Infraestructura Comercial" && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">🏢 Edificios</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section Actualizado */}
        <div className="text-center mt-16 lg:mt-20 animate-fade-in-up">
          <div className="bg-gradient-primary rounded-2xl p-8 lg:p-12 text-white shadow-large max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-heading">
              ¿Tienes un Proyecto en Mente?
            </h3>
            <p className="text-primary-100 text-lg lg:text-xl mb-6 max-w-2xl mx-auto">
              Desde plantas industriales hasta gestión de edificios, tenemos la experiencia y tecnología para hacerlo realidad.
            </p>
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Consultar Proyecto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;