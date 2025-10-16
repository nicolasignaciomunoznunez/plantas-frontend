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

  const progressItems = [
    { label: "Trabajo Calificado", percent: 100 },
    { label: "Servicio de calidad", percent: 100 },
    { label: "Mantenimiento continuo", percent: 100 }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título Principal */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Resolvemos tus dudas sobre nuestros servicios de mantenimiento de sistemas de agua potable rural
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Progress Bars Section - Orden cambiado en móvil */}
          <div className="lg:sticky lg:top-8 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
                Nuestros Compromisos
              </h3>
              
              <div className="space-y-6 sm:space-y-8">
                {progressItems.map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                        {item.label}
                      </span>
                      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md text-xs sm:text-sm min-w-12 text-center">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">
                  ¿No encontraste tu respuesta?
                </h4>
                <p className="text-blue-700 text-xs sm:text-sm mb-3 sm:mb-4">
                  Contáctanos directamente para resolver cualquier duda específica.
                </p>
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-center">
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Section - Orden primero en móvil */}
          <div className="order-1 lg:order-2">
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-300 hover:shadow-sm"
                >
                  <button
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left bg-white hover:bg-blue-50 transition-all duration-300 font-semibold text-gray-800 flex justify-between items-start gap-3 sm:gap-4"
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  >
                    <span className="text-left text-sm sm:text-lg leading-relaxed flex-1">
                      {faq.question}
                    </span>
                    <span className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-blue-500 flex items-center justify-center transition-all duration-300 mt-0.5 ${
                      activeIndex === index ? 'bg-blue-500 text-white' : 'text-blue-500'
                    }`}>
                      {activeIndex === index ? 
                        <span className="text-xs sm:text-sm">−</span> : 
                        <span className="text-xs sm:text-sm">+</span>
                      }
                    </span>
                  </button>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${
                    activeIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-lg">
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