// components/landing/FAQ.jsx
import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cómo se manejan las emergencias, como cortes o fallas en el sistema de distribución?",
      answer: "Tenemos un protocolo de emergencia para actuar de manera inmediata ante cualquier fallo en el sistema, asegurando la pronta restauración del servicio."
    },
    {
      question: "¿Cuáles son los costos asociados al mantenimiento de sistemas de agua potable rural?",
      answer: "Los costos varían según el tipo de servicio requerido, el tamaño de la planta y la frecuencia de mantenimiento, por lo que ofrecemos presupuestos personalizados."
    },
    {
      question: "¿Qué tipos de servicios de mantenimiento ofrecen para sistemas de agua potable rural?",
      answer: "Ofrecemos mantenimiento preventivo y correctivo de bombas, tuberías, filtros y sistemas de distribución. También brindamos automatización de procesos, análisis y gestión energética, y control y gestión de planta."
    }
  ];

  const commitments = [
    { 
      label: "Trabajo Calificado", 
      percent: 100,
      description: "Personal especializado con certificaciones"
    },
    { 
      label: "Servicio de Calidad", 
      percent: 100,
      description: "Estándares internacionales en cada proyecto"
    },
    { 
      label: "Mantenimiento Continuo", 
      percent: 100,
      description: "Soporte técnico permanente"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Unificado */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
            FAQ & Compromisos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 font-heading">
            Preguntas <span className="text-primary-600">Frecuentes</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            Resolvemos tus dudas sobre nuestros servicios de mantenimiento de sistemas de agua potable rural
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Sección de Compromisos - Simplificada */}
          <div className="lg:sticky lg:top-8 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-medium border border-secondary-100">
              <h3 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-8 text-center font-heading">
                Nuestros Compromisos
              </h3>
              
              <div className="space-y-8">
                {commitments.map((item, index) => (
                  <div 
                    key={index}
                    className="group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors duration-300 text-lg">
                          {item.label}
                        </h4>
                        <p className="text-secondary-500 text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-lg text-sm border border-primary-200">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-primary h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

             
            </div>
          </div>

          {/* Sección FAQ - Mejorada */}
          <div className="order-1 lg:order-2">
            <div className="space-y-4 lg:space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all duration-500 shadow-soft hover:shadow-large overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <button
                    className="w-full px-6 lg:px-8 py-6 lg:py-7 text-left transition-all duration-500 flex justify-between items-start gap-4 group-hover:bg-primary-25"
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    aria-expanded={activeIndex === index}
                  >
                    <span className="text-lg lg:text-xl font-semibold text-secondary-800 group-hover:text-primary-700 transition-colors duration-300 text-left leading-relaxed flex-1">
                      {faq.question}
                    </span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 mt-1 ${
                      activeIndex === index 
                        ? 'bg-primary-600 border-primary-600 text-white rotate-180' 
                        : 'border-primary-400 text-primary-500 group-hover:border-primary-500 group-hover:text-primary-600'
                    }`}>
                      <svg className="w-4 h-4 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  <div className={`transition-all duration-500 overflow-hidden ${
                    activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 lg:px-8 pb-6 lg:pb-7 border-t border-secondary-100">
                      <p className="text-secondary-600 leading-relaxed text-lg pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

    
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;