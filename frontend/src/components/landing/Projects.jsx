// components/landing/Projects.jsx
import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: "Fusión HDPE",
      image: "/images/fusionppr.jpg",
      category: "Sistema de unión",
      description: "Tecnología de fusión para tuberías de polietileno de alta densidad",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Fusión PPR", 
      image: "/images/hdpe.jpg",
      category: "Sistema de tuberías",
      description: "Unión térmica para sistemas de polipropileno random",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Termografías",
      image: "/images/calor.jpg",
      category: "Análisis térmico",
      description: "Diagnóstico por infrarrojos para mantenimiento predictivo",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      title: "Automatización de procesos",
      image: "/images/automatizacion.webp", 
      category: "Control industrial",
      description: "Sistemas SCADA y PLC para optimización operacional",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Planes de mitigación y contingencia",
      image: "/images/mitigacion.jpg",
      category: "Gestión de riesgos", 
      description: "Estrategias preventivas para continuidad operativa",
      gradient: "from-red-500 to-red-600"
    }
  ];

  return (
    <section id="proyectos" className="py-16 lg:py-24 bg-gradient-to-br from-secondary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Mejorado */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 shadow-soft">
            Nuestros Proyectos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 font-heading">
            Tecnología Aplicada a <span className="text-primary-600">Soluciones Reales</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            Descubre cómo implementamos soluciones innovadoras que optimizan el funcionamiento de plantas de agua potable
          </p>
        </div>

        {/* Grid de Proyectos Mejorado */}
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
                
                {/* Línea decorativa */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary-500 to-transparent mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Botón de acción sutil */}
                <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors duration-300 flex items-center gap-2 group/btn">
                  
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

   
      </div>
    </section>
  );
};

export default Projects;