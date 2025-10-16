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

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo y Descripción */}
          <div className="text-center md:text-left">
            <img 
              src="/images/finalogotr.png" 
              alt="RYV SPA - Soluciones integrales para plantas de agua potable" 
              className="h-28 lg:h-32 w-auto mx-auto md:mx-0 mb-6 transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/finalogo.jpeg';
              }}
            />
            <p className="text-secondary-300 text-lg leading-relaxed mb-6">
              Soluciones integrales para plantas de agua potable con más de 5 años de experiencia en el sector industrial.
            </p>
            
            {/* Botón de Contacto */}
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full md:w-auto text-center shadow-lg hover:shadow-xl"
            >
              Contactar Ahora
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