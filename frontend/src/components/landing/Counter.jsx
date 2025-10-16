// components/landing/Counter.jsx
import React, { useState, useEffect, useRef } from 'react';

const Counter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const sectionRef = useRef(null);

  const stats = [
    { 
      number: 30, 
      label: "Clientes satisfechos", 
      icon: "👥",
      suffix: "+",
      duration: 1800,
      gradient: "from-primary-400 to-primary-500",
      delay: 100
    },
    { 
      number: 60, 
      label: "Soluciones implementadas", 
      icon: "⚙️",
      suffix: "+",
      duration: 2200,
      gradient: "from-primary-500 to-primary-600",
      delay: 200
    },
    { 
      number: 8, 
      label: "Clientes actuales", 
      icon: "💼",
      suffix: "+",
      duration: 1500,
      gradient: "from-primary-300 to-primary-400",
      delay: 300
    },
    { 
      number: 33, 
      label: "Proyectos completados", 
      icon: "✅",
      suffix: "+",
      duration: 2000,
      gradient: "from-primary-600 to-primary-700",
      delay: 400
    }
  ];

  // Observer para animar cuando sea visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 lg:py-24 bg-gradient-primary text-white relative overflow-hidden"
    >
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Patrón de ondas sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header mejorado */}
        <div className="text-center mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white/90 mb-4 border border-white/30">
            Nuestro Impacto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-heading">
            Resultados que <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">hablan por sí solos</span>
          </h2>
          <p className="text-primary-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Años de experiencia respaldados por números concretos y clientes satisfechos en el sector hídrico
          </p>
        </div>

        {/* Grid de estadísticas mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group bg-white/10 hover:bg-white/15 rounded-3xl p-6 lg:p-8 backdrop-blur-md transition-all duration-700 border border-white/20 hover:border-white/30 hover:-translate-y-3 hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              {/* Icono con contenedor gradiente */}
              <div className="relative mb-6 lg:mb-8">
                <div 
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-3xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-large`}
                  role="img"
                  aria-label={stat.label}
                >
                  {stat.icon}
                </div>
                <div className="absolute -inset-3 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
              
              {/* Número animado */}
              <div className="mb-3 lg:mb-4">
                {isVisible ? (
                  <AnimatedCounter 
                    value={stat.number}
                    duration={stat.duration}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white/30 font-heading">
                    0
                  </span>
                )}
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-200 ml-1">
                  {stat.suffix}
                </span>
              </div>
              
              {/* Label */}
              <div className="text-lg sm:text-xl text-primary-100 font-medium leading-tight group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>

              {/* Línea decorativa */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-white/50 to-transparent mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* CTA adicional mejorado */}
        <div className="text-center mt-16 lg:mt-20 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 lg:p-10 border border-white/20 max-w-2xl mx-auto">
            <p className="text-primary-100 text-lg sm:text-xl mb-6 lg:mb-8">
              ¿Listo para agregar tu proyecto a nuestras estadísticas de éxito?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-large hover:shadow-xl relative overflow-hidden"
              >
                <span className="relative z-10">Comenzar Proyecto</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
              >
                Ver Servicios
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente para animación de números mejorado
const AnimatedCounter = ({ value, duration, className }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      
      let start = 0;
      const increment = value / (duration / 16);
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(value * easeOutQuart);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, duration, hasAnimated]);

  return <span className={className}>{count}</span>;
};

export default Counter;