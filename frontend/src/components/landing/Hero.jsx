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
      ctaLink: "servicios" // ✅ CORREGIDO: sin #
    },
    {
      image: "/images/portada1.jpg",
      title: "Expertos en",
      highlighted: "mantenimiento industrial",
      subtitle: "Calidad y eficiencia en cada proyecto que emprendemos", 
      ctaText: "Contáctanos",
      ctaLink: "contacto" // ✅ CORREGIDO: sin #
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
            <div className="absolute inset-0 flex items-center justify-center lg:justify-start z-10"> {/* ✅ z-10 agregado */}
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl lg:max-w-4xl text-center lg:text-left">
                  {/* Badge */}
                  <div className="mb-4 lg:mb-6">
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30">
                      R&V SPA
                    </span>
                  </div>
                  
                  {/* Título PRINCIPAL */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight text-white"> {/* ✅ Texto más pequeño en móvil */}
                    {slide.title}{' '}
                    <span className="block text-white font-heading mt-2">
                      {slide.highlighted}
                    </span>
                  </h1>
                  
                  {/* Subtítulo */}
                  <p className="text-lg sm:text-xl lg:text-2xl mb-6 lg:mb-8 leading-relaxed text-white max-w-3xl mx-auto lg:mx-0"> {/* ✅ Texto más pequeño */}
                    {slide.subtitle}
                  </p>
                  
                  {/* Botones */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start"> {/* ✅ Gap más pequeño */}
                    <button
                      onClick={() => scrollToSection(slide.ctaLink)} 
                      className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg" 
                    >
                      {slide.ctaText}
                    </button>
                    
                    <button
                      onClick={() => scrollToSection('servicios')}
                      className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold text-base lg:text-lg transition-all duration-300" 
                    >
                      Conocer Más
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Controles de navegación - SOLO EN DESKTOP */}
        <button
          onClick={prevSlide}
          className="hidden lg:block absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all duration-300 backdrop-blur-sm z-20" 
        >
          ‹
        </button>
        
        <button
          onClick={nextSlide}
          className="hidden lg:block absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all duration-300 backdrop-blur-sm z-20" 
        >
          ›
        </button>

        {/* Dots de navegación - MÁS PEQUEÑOS EN MÓVIL */}
        <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 lg:space-x-3 backdrop-blur-sm bg-white/10 rounded-xl lg:rounded-2xl p-2 lg:p-3 z-20"> {/* ✅ Bottom ajustado */}
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all ${
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