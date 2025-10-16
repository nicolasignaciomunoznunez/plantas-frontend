// components/landing/Counter.jsx
import React, { useState, useEffect, useRef } from 'react';

const Counter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { 
      number: 30, 
      label: "Clientes satisfechos", 
      icon: "👥",
      suffix: "+",
      duration: 2000
    },
    { 
      number: 60, 
      label: "Soluciones tecnológicas", 
      icon: "⚙️",
      suffix: "+",
      duration: 2500
    },
    { 
      number: 8, 
      label: "Clientes actuales", 
      icon: "💼",
      suffix: "+",
      duration: 1500
    },
    { 
      number: 33, 
      label: "Proyectos completados", 
      icon: "✅",
      suffix: "+",
      duration: 2200
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header opcional */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Nuestro Impacto en Números
          </h2>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto">
            Años de experiencia respaldados por resultados tangibles y clientes satisfechos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group bg-white/10 hover:bg-white/15 rounded-2xl p-6 lg:p-8 backdrop-blur-sm transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl border border-white/20"
            >
              {/* Icono con contenedor */}
              <div 
                className="text-4xl lg:text-5xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                role="img"
                aria-label={stat.label}
              >
                {stat.icon}
              </div>
              
              {/* Número animado */}
              <div className="mb-2 lg:mb-3">
                {isVisible ? (
                  <AnimatedCounter 
                    value={stat.number}
                    duration={stat.duration}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white/50">
                    0
                  </span>
                )}
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-200">
                  {stat.suffix}
                </span>
              </div>
              
              {/* Label */}
              <div className="text-lg sm:text-xl lg:text-xl text-blue-100 font-medium leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA adicional */}
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-blue-100 text-lg sm:text-xl mb-6">
            ¿Listo para agregar tu proyecto a nuestras estadísticas?
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Comenzar Proyecto
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente para animación de números
const AnimatedCounter = ({ value, duration, className }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      
      let start = 0;
      const increment = value / (duration / 16); // 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value, duration, hasAnimated]);

  return <span className={className}>{count}</span>;
};

export default Counter;