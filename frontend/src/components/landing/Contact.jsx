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
      // Aquí iría la lógica real de envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.');
      setFormData({ name: '', email: '', phone: '', comment: '' });
    } catch (error) {
      setSubmitMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Ubicación",
      content: "Quinta Normal 4830, Santiago",
      description: "Estamos ubicados en el corazón de Santiago"
    },
    {
      icon: "🕒",
      title: "Horario de atención",
      content: "Lunes - Domingo: 09:00 - 18:00",
      description: "+56 937492604"
    },
    {
      icon: "✉️",
      title: "Escríbenos",
      content: "contacto@ryvspa.com",
      description: "juanito@ryvspa.com"
    }
  ];

  return (
    <section id="contacto" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Contáctanos
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Si tienes algún inconveniente o necesitas asesoría especializada, no dudes en comunicarte con nosotros a través de un mensaje.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="text-center lg:text-left">
                  <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-lg font-medium mb-2">
                    {item.content}
                  </p>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                {/* Comentario */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>

                {/* Mensaje de estado */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg text-center ${
                    submitMessage.includes('éxito') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 lg:mt-20 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            className="w-full h-64 sm:h-80 lg:h-96"
            src="https://maps.google.com/maps?q=Quinta%20Normal%204830%2C%20Santiago%2C%20Chile&t=m&z=15&output=embed&iwloc=near"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Ubicación de R&V SPA en Quinta Normal 4830, Santiago"
          />
        </div>

        {/* Emergency Banner */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-2xl">🚨</span>
            <h3 className="text-xl font-bold text-red-800">Emergencias 24/7</h3>
          </div>
          <p className="text-red-700 text-lg">
            Para emergencias técnicas fuera del horario de atención:{" "}
            <a 
              href="tel:+56965368132" 
              className="font-bold hover:text-red-800 transition-colors"
            >
              +56 965368132
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;