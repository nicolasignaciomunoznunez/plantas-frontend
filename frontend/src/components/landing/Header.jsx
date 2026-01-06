// components/landing/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Efecto para header sticky y detección de sección activa
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detectar sección activa
      const sections = ['inicio', 'nosotros', 'servicios', 'proyectos', 'contacto'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Sobre Nosotros' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'proyectos', label: 'Proyectos' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 transition-all duration-500 ${
      isScrolled ? 'shadow-large py-3' : 'shadow-medium py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Mejorado */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center group"
              onClick={() => scrollToSection('inicio')}
            >
              {/* Logo para desktop */}
              <img 
                src="/images/infraexpertlogotr.png" 
                alt="RYV SPA - Gestión integral de infraestructura: agua, electricidad, climatización y gas" 
                className={`transition-all duration-500 ${
                  isScrolled ? 'h-14' : 'h-18'
                } w-auto hidden md:block group-hover:scale-105`}
              />
              {/* Logo para móvil */}
              <img 
                src="/images/infraexpertlogotr.png" 
                alt="RYV SPA - Soluciones integrales" 
                className="h-12 w-auto md:hidden transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation Mejorada */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                  activeSection === item.id
                    ? 'text-primary-600 bg-primary-50 shadow-soft'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-25'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-primary rounded-full"></div>
                )}
              </button>
            ))}
            
            {/* Botones de acción mejorados */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-secondary-200">
              <Link 
                to="/login"
                className="px-6 py-3 rounded-xl font-medium border border-secondary-300 text-secondary-700 hover:bg-secondary-50 hover:border-secondary-400 transition-all duration-300 hover:shadow-soft"
              >
                Acceso Clientes
              </Link>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-primary text-white hover:shadow-large transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Cotizar Proyecto</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </nav>

          {/* Tablet Navigation Mejorada */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2">
            {navItems.slice(0, 3).map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-25'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contacto')}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 ml-2"
            >
              Cotizar
            </button>
          </nav>

          {/* Mobile Menu Button Mejorado */}
          <button 
            className="md:hidden p-3 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-secondary-700 transition-all duration-300 relative group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'top-3 rotate-45' : 'top-2'
              }`}></span>
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-3'
              }`}></span>
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'top-3 opacity-0' : 'top-4'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Mejorado */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-secondary-200 mt-3 rounded-2xl shadow-large animate-fade-in-down">
            <div className="flex flex-col space-y-1 p-2">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-4 rounded-xl font-medium text-left transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-primary-600 bg-primary-50 border border-primary-200'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-25'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Divider */}
              <div className="border-t border-secondary-200 my-2"></div>
              
              {/* Botones de acción en móvil mejorados */}
              <div className="flex flex-col space-y-2 p-2">
                <Link 
                  to="/login"
                  className="px-4 py-4 rounded-xl font-medium text-center border border-secondary-300 text-secondary-700 hover:bg-secondary-50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Acceso Clientes
                </Link>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="px-4 py-4 rounded-xl font-medium text-center bg-gradient-primary text-white hover:shadow-large transition-all duration-300"
                >
                  Cotizar Proyecto
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