import React from 'react';

const About = () => {
  const values = [
    {
      icon: "🎯",
      title: "Misión",
      description: "Garantizar el funcionamiento óptimo de plantas industriales mediante soluciones tecnológicas innovadoras y mantenimiento especializado en múltiples sectores.",
      gradient: "from-primary-500 to-primary-600",
      delay: "100"
    },
    {
      icon: "👁️",
      title: "Visión", 
      description: "Ser referentes en ingeniería aplicada al sector industrial, expandiendo nuestro expertise a diversos tipos de plantas y procesos productivos.",
      gradient: "from-primary-600 to-primary-700",
      delay: "200"
    },
    {
      icon: "⭐",
      title: "Valores",
      description: "Compromiso, innovación, calidad y adaptabilidad para enfrentar los desafíos únicos de cada proyecto industrial.",
      gradient: "from-primary-400 to-primary-500",
      delay: "300"
    }
  ];

  const stats = [
    { number: "5+", label: "Años de experiencia", suffix: "" },
    { number: "50+", label: "Clientes industriales", suffix: "" },
    { number: "60+", label: "Proyectos completados", suffix: "" },
    { number: "15+", label: "Sectores atendidos", suffix: "" }
  ];

  

  return (
    <section id="nosotros" className="py-16 lg:py-24 bg-gradient-light relative overflow-hidden">
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-100 rounded-full opacity-40 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-50 rounded-full opacity-30 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary-200 rounded-full opacity-20 animate-bounce-gentle"></div>
      
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-50/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Mejorado con Enfoque Industrial Amplio */}
        <div className="text-center max-w-5xl mx-auto mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 shadow-soft">
            Expertos en Soluciones Industriales
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 leading-tight font-heading">
            Especialistas en <span className="text-primary-600 bg-gradient-primary bg-clip-text text-transparent">Plantas Industriales</span> de Todo Tipo
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed max-w-4xl mx-auto">
            Con más de <strong className="text-primary-600">5 años de experiencia</strong> en múltiples sectores industriales, 
            integramos <strong className="text-primary-600">tecnológica de vanguardia y sólido</strong> con <strong className="text-primary-600">expertise para maximizar </strong> 
            la eficiencia operativa en plantas de agua y energía, entre otras..
          </p>
        </div>

   
        {/* Grid de Valores Mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {values.map((value, index) => (
            <div 
              key={index}
              className="animate-fade-in-up bg-white rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-large transition-all duration-500 border border-secondary-100 group hover:border-primary-200 hover:-translate-y-2"
              style={{ animationDelay: `${value.delay}ms` }}
            >
              {/* Icono con gradiente */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.gradient} flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300 shadow-medium`}>
                  {value.icon}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              
              <h3 className="text-xl lg:text-2xl font-bold text-secondary-800 mb-4 group-hover:text-primary-600 transition-colors duration-300 font-heading">
                {value.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed text-lg">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Estadísticas Destacadas - Enfoque Industrial */}
        <div className="bg-white rounded-2xl shadow-medium p-8 lg:p-12 border border-secondary-100 animate-scale-in mb-16 lg:mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-4 font-heading">
              Nuestro Impacto Industrial
            </h3>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              Resultados tangibles que respaldan nuestra versatilidad y compromiso con la excelencia industrial
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary-50 rounded-2xl p-6 lg:p-8 border border-primary-100 group-hover:border-primary-300 transition-all duration-300 group-hover:shadow-medium">
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}<span className="text-primary-400">{stat.suffix}</span>
                  </div>
                  <div className="text-secondary-600 font-medium text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section Mejorado - Enfoque Industrial Amplio */}
        <div className="text-center animate-fade-in-up">
          <div className="bg-gradient-primary rounded-2xl p-8 lg:p-12 text-white shadow-large max-w-4xl mx-auto relative overflow-hidden">
            {/* Elementos decorativos del CTA */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 relative z-10 font-heading">
              ¿Proyecto Industrial en Mente?
            </h3>
            <p className="text-primary-100 text-lg lg:text-xl mb-6 max-w-2xl mx-auto relative z-10">
              Desde plantas de agua hasta energía solar, tenemos la experiencia y tecnología para tu sector.
            </p>
            
            {/* Especialidades destacadas */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">💧 Plantas de Agua</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">☀️ Energía Solar</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">⚡ Automatización</span>
            </div>
            
       
          </div>
        </div>
      </div>
    </section>
  );
};


export default About;