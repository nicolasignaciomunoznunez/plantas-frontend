// components/landing/Hero.jsx
import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const slides = [
    {
      image: "/images/portada4.webp",
      title: "Ingeniería para un",
      highlighted: "futuro sostenible", 
      subtitle: "Soluciones innovadoras para plantas de agua potable rural",
      ctaText: "Ver Servicios",
      ctaLink: "#servicios"
    },
    {
      image: "/images/portada1.jpg",
      title: "Expertos en",
      highlighted: "mantenimiento industrial",
      subtitle: "Calidad y eficiencia en cada proyecto que emprendemos", 
      ctaText: "Contáctanos",
      ctaLink: "#contacto"
    }
  ];

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePromises = slides.map(slide => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = slide.image;
            img.onload = resolve;
            img.onerror = resolve;
          });
        });
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    preloadImages();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLoading, slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="pt-16 lg:pt-20 relative">
      {isLoading && (
        <div className="h-screen bg-primary-600 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">RYV SPA</h2>
            <p className="text-white/80">Cargando...</p>
          </div>
        </div>
      )}

      <div className={`relative h-screen overflow-hidden ${isLoading ? 'hidden' : 'block'}`}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Imagen de fondo con OVERLAY OSCURO FIJO */}
            <div className="relative w-full h-full">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              {/* OVERLAY OSCURO PARA CONTRASTE - SIEMPRE VISIBLE */}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            
            {/* Contenido del texto */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-start">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl lg:max-w-4xl text-center lg:text-left">
                  {/* Badge */}
                  <div className="mb-4 lg:mb-6">
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30">
                      R&V SPA
                    </span>
                  </div>
                  
                  {/* Título PRINCIPAL - TEXTO BLANCO SOBRE OVERLAY OSCURO */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight text-white">
                    {slide.title}{' '}
                    <span className="block text-white font-heading">
                      {slide.highlighted}
                    </span>
                  </h1>
                  
                  {/* Subtítulo */}
                  <p className="text-xl sm:text-2xl lg:text-3xl mb-8 lg:mb-10 leading-relaxed text-white max-w-3xl mx-auto lg:mx-0">
                    {slide.subtitle}
                  </p>
                  
                  {/* Botones */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                    <button
                      onClick={() => scrollToSection(slide.ctaLink.replace('#', ''))}
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {slide.ctaText}
                    </button>
                    
                    <button
                      onClick={() => scrollToSection('servicios')}
                      className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                    >
                      Conocer Más
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Controles de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all duration-300 backdrop-blur-sm"
        >
          ‹
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all duration-300 backdrop-blur-sm"
        >
          ›
        </button>

        {/* Dots de navegación */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 backdrop-blur-sm bg-white/10 rounded-2xl p-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;