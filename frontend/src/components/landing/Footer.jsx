// components/landing/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleEmailClick = () => {
    window.location.href = 'mailto:contacto@ryvspa.com';
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleAddressClick = () => {
    window.open('https://maps.google.com/?q=Quinta+Normal+4830', '_blank');
  };

  // ✅ BOTONERA DE REDES SOCIALES CON ICONOS REALES
  const socialMedia = [
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: "https://linkedin.com/company/ryv-spa",
      color: "hover:bg-blue-500 hover:border-blue-500"
    },
    {
      name: "Instagram", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.202 14.816 3.712 13.665 3.712 12.368s.49-2.448 1.414-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.924.875 1.414 2.026 1.414 3.323s-.49 2.448-1.414 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
          <path d="M8.449 7.753c-2.532 0-4.615 2.083-4.615 4.615s2.083 4.615 4.615 4.615 4.615-2.083 4.615-4.615-2.083-4.615-4.615-4.615zm7.718-1.803c-.596 0-1.087.49-1.087 1.087s.49 1.087 1.087 1.087 1.087-.49 1.087-1.087-.49-1.087-1.087-1.087z"/>
        </svg>
      ),
      url: "https://instagram.com/ryvspa",
      color: "hover:bg-pink-500 hover:border-pink-500"
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: "https://facebook.com/ryvspa",
      color: "hover:bg-blue-600 hover:border-blue-600"
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.416"/>
        </svg>
      ),
      url: "https://wa.me/56937492604",
      color: "hover:bg-green-500 hover:border-green-500"
    },
    {
      name: "YouTube",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: "https://youtube.com/@ryvspa",
      color: "hover:bg-red-500 hover:border-red-500"
    }
  ];

  const contactInfo = [
    {
      icon: "📍",
      label: "Ubicación",
      content: "Quinta Normal 4830",
      action: handleAddressClick,
      subtitle: "Santiago, Chile"
    },
    {
      icon: "📞", 
      label: "Teléfono",
      content: "+56 937492604",
      action: () => handlePhoneClick('+56937492604')
    },
    {
      icon: "✉️",
      label: "Email", 
      content: "contacto@ryvspa.com",
      action: handleEmailClick
    }
  ];

  const schedule = [
    { days: "Lunes - Miércoles", hours: "08:00 - 20:00" },
    { days: "Jueves - Viernes", hours: "09:00 - 18:00" },
    { days: "Sábados - Domingos", hours: "10:00 - 14:00" }
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo y Descripción */}
          <div className="text-center md:text-left">
            <img 
              src="/images/finalogotr.png" 
              alt="RYV SPA - Gestión integral de infraestructura: agua, electricidad, climatización y gas" 
              className="h-28 lg:h-32 w-auto mx-auto md:mx-0 mb-6 transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/finalogo.jpeg';
              }}
            />
            <p className="text-secondary-300 text-lg leading-relaxed mb-6">
              Especialistas en gestión integral de infraestructura: desde plantas de agua hasta edificios residenciales. Más de 5 años de experiencia multisector.
            </p>
            
            {/* ✅ BOTONERA DE REDES SOCIALES MEJORADA */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-4 text-lg">Síguenos en Redes</h4>
              <div className="flex justify-center md:justify-start space-x-3">
                {socialMedia.map((social, index) => (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(social.url)}
                    className={`w-12 h-12 rounded-xl bg-secondary-800 border border-secondary-700 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${social.color}`}
                    aria-label={`Síguenos en ${social.name}`}
                    title={social.name}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de Contacto */}
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full md:w-auto text-center shadow-lg hover:shadow-xl"
            >
              Solicitar Cotización
            </button>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white font-heading">Contacto</h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <button 
                  key={index}
                  onClick={item.action}
                  className="flex items-start w-full text-left hover:bg-secondary-800 p-4 rounded-xl transition-all duration-300 group"
                >
                  <span className="text-primary-400 mr-4 mt-1 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div>
                    <span className="text-secondary-300 text-lg block group-hover:text-white transition-colors font-medium">
                      {item.content}
                    </span>
                    <span className="text-primary-400 text-sm mt-1 block">
                      {item.subtitle || item.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Horario de Atención */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white font-heading">Horario de Atención</h3>
            <div className="bg-secondary-800 rounded-xl p-6 space-y-4 border border-secondary-700">
              {schedule.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-secondary-700 last:border-b-0">
                  <span className="text-secondary-300 text-lg">{item.days}</span>
                  <span className="text-white font-semibold bg-primary-600/20 px-3 py-1 rounded-lg border border-primary-500/30">
                    {item.hours}
                  </span>
                </div>
              ))}
              
              {/* Soporte destacado */}
              <div className="mt-6 pt-4 border-t border-primary-500 bg-primary-900/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-primary-300 text-lg">🚨</span>
                  <span className="text-primary-300 font-semibold text-lg">Soporte 24/7</span>
                </div>
                <button 
                  onClick={() => handlePhoneClick('+56965368132')}
                  className="text-primary-300 hover:text-white font-bold text-lg transition-colors"
                >
                  +56 965368132
                </button>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white font-heading">Enlaces Rápidos</h3>
            <div className="space-y-3">
              {[
                { label: "Inicio", target: "inicio" },
                { label: "Servicios", target: "servicios" },
                { label: "Proyectos", target: "proyectos" },
                { label: "Sobre Nosotros", target: "nosotros" },
                { label: "Contacto", target: "contacto" }
              ].map((link, index) => (
                <button
                  key={index}
                  onClick={() => document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' })}
                  className="block w-full text-left text-secondary-300 hover:text-primary-400 transition-colors duration-300 py-2 text-lg font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* ✅ SECCIÓN DE ESPECIALIDADES ELIMINADA */}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-secondary-800 py-8 bg-secondary-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-lg text-center md:text-left">
              &copy; {currentYear} R&V SPA. Todos los derechos reservados.
            </p>
            
            {/* Enlaces legales */}
            <div className="flex space-x-6">
              <button className="text-secondary-400 hover:text-primary-400 transition-colors duration-300 text-lg font-medium">
                Política de Privacidad
              </button>
              <button className="text-secondary-400 hover:text-primary-400 transition-colors duration-300 text-lg font-medium">
                Términos de Servicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;