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

  const handleEmergencyClick = () => {
    window.location.href = 'tel:+56965368132';
  };

  const handleAddressClick = () => {
    // Abrir Google Maps con la dirección
    window.open('https://maps.google.com/?q=Quinta+Normal+4830', '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white">
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
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Soluciones integrales para plantas de agua potable con más de 10 años de experiencia en el sector industrial.
            </p>
            
            {/* Botón de Contacto Rápido */}
            <button
              onClick={handleEmailClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full md:w-auto text-center"
            >
              Contactar Ahora
            </button>
          </div>

          {/* Soporte 24/7 */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Soporte 24/7</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              Estamos disponibles para emergencias las 24 horas del día, los 7 días de la semana.
            </p>
            <button
              onClick={handleEmergencyClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full text-center flex items-center justify-center space-x-2"
            >
              <span>🚨</span>
              <span>Emergencia: +56 965368132</span>
            </button>
          </div>

          {/* Contact Info Mejorado */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Contacto</h3>
            <div className="space-y-4">
              <button 
                onClick={handleAddressClick}
                className="flex items-start w-full text-left hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-blue-400 mr-4 mt-1 text-xl flex-shrink-0" aria-hidden="true">📍</span>
                <div>
                  <span className="text-gray-400 text-lg block group-hover:text-white transition-colors">
                    Quinta Normal 4830
                  </span>
                  <span className="text-blue-400 text-sm mt-1">Ver en mapa</span>
                </div>
              </button>
              
              <button 
                onClick={() => handlePhoneClick('+56937492604')}
                className="flex items-center w-full text-left hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-blue-400 mr-4 text-xl flex-shrink-0" aria-hidden="true">📞</span>
                <span className="text-gray-400 text-lg group-hover:text-white transition-colors">
                  +56 937492604
                </span>
              </button>
              
              <button 
                onClick={handleEmailClick}
                className="flex items-center w-full text-left hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-blue-400 mr-4 text-xl flex-shrink-0" aria-hidden="true">✉️</span>
                <span className="text-gray-400 text-lg group-hover:text-white transition-colors">
                  contacto@ryvspa.com
                </span>
              </button>
            </div>
          </div>

          {/* Horario Mejorado */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Horario de Atención</h3>
            <div className="space-y-3 text-gray-400 bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-lg">Lunes - Miércoles</span>
                <span className="text-white font-semibold">08:00 - 20:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-lg">Jueves - Viernes</span>
                <span className="text-white font-semibold">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-lg">Sábados - Domingos</span>
                <span className="text-white font-semibold">10:00 - 14:00</span>
              </div>
              
              {/* Emergencias destacada */}
              <div className="mt-4 pt-4 border-t border-red-500 bg-red-900/20 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-300 font-semibold text-lg">Emergencias 24/7</span>
                  <button 
                    onClick={handleEmergencyClick}
                    className="text-red-300 hover:text-white font-bold text-lg transition-colors"
                  >
                    +56 965368132
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Mejorado */}
      <div className="border-t border-gray-800 py-6 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-lg text-center md:text-left">
              &copy; {currentYear} R&V SPA. Todos los derechos reservados.
            </p>
            
            {/* Enlaces legales */}
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-white transition-colors duration-200 text-lg">
                Política de Privacidad
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-200 text-lg">
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