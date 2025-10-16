// components/landing/Contact.jsx
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.');
      setFormData({ name: '', email: '', phone: '', comment: '' });
    } catch (error) {
      setSubmitMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contacto@ryvspa.com';
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleAddressClick = () => {
    window.open('https://maps.google.com/?q=Quinta+Normal+4830', '_blank');
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Ubicación",
      content: "Quinta Normal 4830",
      description: "Santiago, Chile",
      action: handleAddressClick,
      gradient: "from-primary-500 to-primary-600"
    },
    {
      icon: "📞",
      title: "Teléfono",
      content: "+56 937492604",
      description: "Horario de atención",
      action: () => handlePhoneClick('+56937492604'),
      gradient: "from-primary-400 to-primary-500"
    },
    {
      icon: "✉️",
      title: "Email",
      content: "contacto@ryvspa.com",
      description: "Respondemos en 24h",
      action: handleEmailClick,
      gradient: "from-primary-600 to-primary-700"
    }
  ];

  return (
    <section id="contacto" className="py-16 lg:py-24 bg-gradient-to-br from-white to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 shadow-soft">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-800 mb-6 font-heading">
            Ponte en <span className="text-primary-600">Contacto</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
            ¿Tienes un proyecto en mente o necesitas asesoría especializada? Estamos aquí para ayudarte a encontrar la mejor solución para tus necesidades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information Mejorada */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-large transition-all duration-500 border border-secondary-100 group hover:border-primary-200 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button 
                  onClick={item.action}
                  className="w-full text-left group"
                >
                  {/* Icono con gradiente */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300 shadow-medium mx-auto lg:mx-0`}>
                      {item.icon}
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors duration-300 text-center lg:text-left font-heading">
                    {item.title}
                  </h3>
                  <p className="text-secondary-700 text-lg font-medium mb-2 text-center lg:text-left">
                    {item.content}
                  </p>
                  <p className="text-secondary-500 text-center lg:text-left">
                    {item.description}
                  </p>
                </button>
              </div>
            ))}

            {/* Emergency Banner Integrado */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center hover:shadow-medium transition-all duration-300 group">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🚨</span>
                <h3 className="text-xl font-bold text-red-800 font-heading">Emergencias 24/7</h3>
              </div>
              <p className="text-red-700 text-lg mb-3">
                Para urgencias técnicas fuera del horario de atención
              </p>
              <button 
                onClick={() => handlePhoneClick('+56965368132')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full"
              >
                +56 965368132
              </button>
            </div>
          </div>

          {/* Contact Form Mejorado */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-medium border border-secondary-100 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-8 text-center font-heading">
                Envíanos un Mensaje
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                {/* Comentario */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-secondary-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white resize-none"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      'Enviar Mensaje'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Mensaje de estado */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg text-center border transition-all duration-300 ${
                    submitMessage.includes('éxito') 
                      ? 'bg-success-50 text-success-700 border-success-200' 
                      : 'bg-error-50 text-error-700 border-error-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;