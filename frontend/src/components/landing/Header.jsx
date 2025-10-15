import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo más grande */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* Logo normal - más grande */}
              <img 
                src="/images/finalogo.jpeg" 
                alt="RYV SPA" 
                className="h-20 w-auto hidden md:block"
              />
              {/* Logo sticky para móvil - más grande */}
              <img 
                src="/images/finalogotr.png" 
                alt="RYV SPA" 
                className="h-14 w-auto md:hidden"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Inicio
            </a>
            <a href="#nosotros" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Sobre nosotros
            </a>
            <a href="#servicios" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Servicios
            </a>
            <a href="#proyectos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Proyectos
            </a>
            <Link 
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Iniciar Sesión
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a 
                href="#inicio" 
                className="text-gray-700 hover:text-blue-600 font-medium py-3 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="#nosotros" 
                className="text-gray-700 hover:text-blue-600 font-medium py-3 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre nosotros
              </a>
              <a 
                href="#servicios" 
                className="text-gray-700 hover:text-blue-600 font-medium py-3 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Servicios
              </a>
              <a 
                href="#proyectos" 
                className="text-gray-700 hover:text-blue-600 font-medium py-3 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Proyectos
              </a>
              <Link 
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;