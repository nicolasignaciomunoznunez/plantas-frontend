import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para header sticky con sombra
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg py-2' : 'shadow-md py-4'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* Logo para desktop */}
              <img 
                src="/images/finalogo.jpeg" 
                alt="RYV SPA" 
                className={`transition-all duration-300 ${
                  isScrolled ? 'h-16' : 'h-20'
                } w-auto hidden md:block`}
              />
              {/* Logo para móvil */}
              <img 
                src="/images/finalogotr.png" 
                alt="RYV SPA" 
                className="h-14 w-auto md:hidden"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('nosotros')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
            >
              Sobre nosotros
            </button>
            <button 
              onClick={() => scrollToSection('servicios')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('proyectos')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
            >
              Proyectos
            </button>
            
            {/* Botones de acción */}
            <div className="flex items-center space-x-4 ml-4">
              <Link 
                to="/login"
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
              >
                Iniciar Sesión
              </Link>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Contactar
              </button>
            </div>
          </nav>

          {/* Tablet Navigation (sin botones) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-6">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('servicios')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('proyectos')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
            >
              Proyectos
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menú móvil"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-left"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('nosotros')}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-left"
              >
                Sobre nosotros
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-left"
              >
                Servicios
              </button>
              <button 
                onClick={() => scrollToSection('proyectos')}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-left"
              >
                Proyectos
              </button>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Botones de acción en móvil */}
              <div className="flex flex-col space-y-2 px-4">
                <Link 
                  to="/login"
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-center border border-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-center shadow-lg"
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;