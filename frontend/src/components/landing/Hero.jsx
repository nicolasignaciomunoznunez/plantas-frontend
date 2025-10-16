// components/landing/Hero.jsx
import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      image: "/images/portada4.webp",
      title: "Ingeniería para un",
      highlighted: "futuro sostenible",
      subtitle: "Soluciones innovadoras para plantas de agua potable rural",
      ctaText: "Ver Servicios",
      ctaLink: "#servicios",
      gradient: "from-primary-700/70 via-primary-600/50 to-primary-800/70" // Más transparente
    },
    {
      image: "/images/portada1.jpg", 
      title: "Expertos en",
      highlighted: "mantenimiento industrial",
      subtitle: "Calidad y eficiencia en cada proyecto que emprendemos",
      ctaText: "Contáctanos",
      ctaLink: "#contacto",
      gradient: "from-secondary-900/60 via-primary-800/50 to-primary-900/60" // Más transparente
    }
  ];

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePromises = slides.map(slide => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = slide.image;
            img.onload = resolve;
            img.onerror = () => {
              console.warn(`Image failed to load: ${slide.image}`);
              resolve(); // Continuar incluso si falla
            };
          });
        });
        
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  // Auto-slide with smooth transitions
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [isLoading, slides.length]);

  const goToSlide = (index) => {
    if (index === currentSlide || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="pt-16 lg:pt-20 relative">
      {/* Loading State Mejorado */}
      {isLoading && (
        <div className="h-screen bg-gradient-primary flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">RYV SPA</h2>
            <p className="text-white/80">Cargando experiencia...</p>
          </div>
        </div>
      )}

      <div className={`relative h-screen overflow-hidden ${isLoading ? 'hidden' : 'block'}`}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            } ${isTransitioning ? 'transitioning' : ''}`}
            aria-hidden={index !== currentSlide}
          >
            {/* Imagen de fondo con fallback */}
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url('${slide.image}')`,
                backgroundColor: '#1e40af' // Fallback color si la imagen no carga
              }}
            >
              {/* Overlay con gradiente más transparente */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
              
              {/* Patrón de textura sutil */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
            </div>
            
            {/* Contenido del slide */}
            <div className="relative h-full flex items-center justify-center lg:justify-start">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
                <div className="max-w-2xl lg:max-w-4xl text-center lg:text-left animate-fade-in-up">
                  <div className="mb-4 lg:mb-6">
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white/90 border border-white/30">
                      R&V SPA
                    </span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight font-heading">
                    {slide.title}{' '}
                    <span className="block bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                      {slide.highlighted}
                    </span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl lg:text-3xl mb-8 lg:mb-10 leading-relaxed text-white/90 max-w-3xl mx-auto lg:mx-0">
                    {slide.subtitle}
                  </p>
                  
                  {/* CTA Buttons Mejorados */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                    <button
                      onClick={() => scrollToSection(slide.ctaLink.replace('#', ''))}
                      className="group bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 lg:px-10 lg:py-5 rounded-xl font-semibold text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-large hover:shadow-xl relative overflow-hidden"
                    >
                      <span className="relative z-10">{slide.ctaText}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button
                      onClick={() => scrollToSection('servicios')}
                      className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 lg:px-10 lg:py-5 rounded-xl font-semibold text-lg lg:text-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Conocer Más
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Siguiente slide"
        >
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Navigation Dots - ÚNICO indicador */}
        <div className="absolute bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 backdrop-blur-md bg-white/10 rounded-2xl p-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70 hover:scale-110'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;