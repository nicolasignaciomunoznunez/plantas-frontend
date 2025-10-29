const Services = () => {
  const services = [
    // ✅ SERVICIOS EXISTENTES (Optimizados)
    {
      title: "Gestión Integral de Plantas de Agua",
      description: "Control, mantenimiento y optimización de plantas de agua potable rurales e industriales. Tu expertise principal reforzado.",
      icon: "💧",
      gradient: "from-blue-500 to-cyan-600",
      category: "agua"
    },
    {
      title: "Mantenimiento Eléctrico Integral",
      description: "Desde plantas industriales hasta edificios residenciales. Instalaciones, reparaciones y optimización de sistemas eléctricos.",
      icon: "⚡",
      gradient: "from-amber-500 to-orange-500",
      category: "electricidad"
    },
    {
      title: "Sistemas de Climatización",
      description: "Mantenimiento e instalación de aires acondicionados para edificios corporativos, industriales y residenciales.",
      icon: "❄️",
      gradient: "from-cyan-400 to-blue-500",
      category: "climatización"
    },
    {
      title: "Seguridad en Sistemas de Gas",
      description: "Instalación, mantenimiento y certificación de redes de gas para cocinas, calefacción y procesos industriales.",
      icon: "🔥",
      gradient: "from-red-500 to-orange-500",
      category: "gas"
    },

    // ✅ NUEVOS SERVICIOS - GESTIÓN DE EDIFICIOS
    {
      title: "Mantenimiento de Edificios",
      description: "Gestión completa de infraestructura: áreas comunes, ascensores, sistemas hidráulicos y eléctricos de edificios.",
      icon: "🏢",
      gradient: "from-gray-600 to-gray-700",
      category: "edificios"
    },
    {
      title: "Automatización Residencial",
      description: "Sistemas inteligentes para hogares y edificios: control de iluminación, climatización y seguridad automatizada.",
      icon: "🏠",
      gradient: "from-purple-500 to-pink-500",
      category: "automatización"
    },
    {
      title: "Eficiencia Energética Integral",
      description: "Auditorías y optimización energética para industrias, comercios y edificios residenciales.",
      icon: "💡",
      gradient: "from-green-500 to-emerald-600",
      category: "energía"
    },
    {
      title: "Paneles Solares Multisector",
      description: "Instalación y mantenimiento de sistemas fotovoltaicos para industrias, comercios y viviendas.",
      icon: "☀️",
      gradient: "from-yellow-500 to-amber-500",
      category: "solar"
    }
  ];

  const getIconLabel = (icon) => {
    const labels = {
      "💧": "Gestión de agua",
      "⚡": "Energía eléctrica", 
      "❄️": "Climatización",
      "🔥": "Seguridad en gas",
      "🏢": "Edificios y condominios",
      "🏠": "Hogares inteligentes",
      "💡": "Eficiencia energética",
      "☀️": "Energía solar"
    };
    return labels[icon] || "Servicio especializado";
  };

  return (
    <section id="servicios" className="py-16 lg:py-24 bg-gradient-to-br from-secondary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Actualizado */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 shadow-soft">
            Servicios Integrales
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 leading-tight font-heading">
            De Plantas Industriales a <span className="text-primary-600">Edificios Inteligentes</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            Combinamos tu expertise en plantas de agua con gestión integral de infraestructura: electricidad, climatización, gas y automatización para todos los sectores.
          </p>
        </div>

        {/* Grid de Servicios Actualizado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 p-6 lg:p-8 border border-secondary-100 hover:border-primary-200 hover:-translate-y-2 animate-fade-in-up ${
                // Destacar servicios de expansión
                service.category === "edificios" || service.category === "climatización" || service.category === "gas"
                  ? 'ring-2 ring-primary-200 ring-opacity-50' 
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
                
                {/* Badge para nuevos servicios */}
                {(service.category === "edificios" || service.category === "climatización" || service.category === "gas") && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    NUEVO
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

              {/* Categoría segmentada */}
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <span className={`text-xs font-medium uppercase tracking-wide ${
                  service.category === "agua" ? "text-blue-600" :
                  service.category === "electricidad" ? "text-amber-600" :
                  service.category === "climatización" ? "text-cyan-600" :
                  service.category === "gas" ? "text-orange-600" :
                  service.category === "edificios" ? "text-gray-600" :
                  service.category === "automatización" ? "text-purple-600" :
                  "text-secondary-500"
                }`}>
                  {service.category === "agua" ? "Agua Potable" :
                   service.category === "electricidad" ? "Energía Eléctrica" :
                   service.category === "climatización" ? "Aire Acondicionado" :
                   service.category === "gas" ? "Gas y Seguridad" :
                   service.category === "edificios" ? "Gestión de Edificios" :
                   service.category === "automatización" ? "Automatización" :
                   service.category === "energía" ? "Eficiencia Energética" :
                   "Energía Solar"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Especialización Actualizada */}
        <div className="mt-16 lg:mt-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 lg:p-12 text-white text-center animate-fade-in-up">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-heading">
            Un Solo Proveedor para Todas Tus Necesidades
          </h3>
          <p className="text-lg lg:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Desde <strong>plantas de agua industriales</strong> hasta <strong>gestión completa de edificios</strong>. 
            Electricidad, climatización, gas y automatización en un solo servicio confiable.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">💧 Plantas de Agua</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">⚡ Electricidad</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">❄️ Climatización</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">🔥 Gas</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">🏢 Edificios</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">☀️ Solar</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;