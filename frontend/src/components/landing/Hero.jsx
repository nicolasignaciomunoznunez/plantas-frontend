// components/landing/Hero.jsx
import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const slides = [
    {
      image: "/images/portada4.webp",
      imageMobile: "/images/portada4-mobile.webp", // Versión optimizada para móvil
      title: "Ingeniería para un",
      highlighted: "futuro sostenible",
      subtitle: "Soluciones innovadoras para plantas de agua potable",
      ctaText: "Ver Servicios",
      ctaLink: "#servicios"
    },
    {
      image: "/images/portada1.jpg", 
      imageMobile: "/images/portada1-mobile.jpg",
      title: "Tu planta de agua",
      highlighted: "Nuestro Compromiso",
      subtitle: "Calidad y eficiencia en cada proyecto",
      ctaText: "Contáctanos",
      ctaLink: "#contacto"
    }
  ];

  // Preload images para mejor UX
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides.flatMap(slide => 
        [slide.image, slide.imageMobile].filter(Boolean).map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        })
      );
      
      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Aumentado a 6s para mejor UX

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="inicio" className="pt-16 lg:pt-24 relative">
      {/* Loading State */}
      {isLoading && (
        <div className="h-screen bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      )}

      <div className={`relative h-screen overflow-hidden ${isLoading ? 'hidden' : 'block'}`}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentSlide}
          >
            {/* Imágenes optimizadas con picture element */}
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={slide.imageMobile || slide.image}
              />
              <source
                media="(min-width: 769px)"
                srcSet={slide.image}
              />
              <img
                src={slide.image}
                alt={`${slide.title} ${slide.highlighted}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </picture>
            
            {/* Overlay con gradiente para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
                <div className="max-w-2xl lg:max-w-3xl">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight">
                    {slide.title}{' '}
                    <span className="text-blue-400 block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {slide.highlighted}
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl lg:text-3xl mb-6 lg:mb-8 opacity-90 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  {slide.ctaText && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={slide.ctaLink}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                      >
                        {slide.ctaText}
                      </a>
                      <a
                        href="#servicios"
                        className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 text-center"
                      >
                        Conocer Más
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Siguiente slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Navigation Docks Mejorados */}
        <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-blue-400 transition-all duration-100 ease-linear"
            style={{ 
              width: `${(currentSlide + 1) * (100 / slides.length)}%` 
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;