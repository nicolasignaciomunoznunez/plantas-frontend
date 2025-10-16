import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.verifyEmail(verificationCode);
      
      if (response.success) {
        setSuccess(true);
        // ✅ MOSTRAR MENSAJE DE ÉXITO Y REDIRIGIR AL LOGIN
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.',
              type: 'success'
            } 
          });
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Código de verificación inválido');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-8 text-center animate-fade-in-up">
            <div className="text-success-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2 font-heading">
              ¡Cuenta Verificada!
            </h2>
            <p className="text-secondary-600">Tu cuenta ha sido verificada exitosamente.</p>
            <p className="text-secondary-500 text-sm mt-2">Redirigiendo al login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white flex">
      {/* Sidebar con branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center lg:bg-gradient-primary lg:text-white lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <img 
              src="/images/finalogotr.png" 
              alt="RYV SPA" 
              className="h-20 w-auto mx-auto mb-6"
              onError={(e) => {
                e.target.src = '/images/finalogo.jpeg';
              }}
            />
            <h1 className="text-3xl font-bold mb-4 font-heading">RYV SPA</h1>
            <p className="text-primary-100 text-lg opacity-90">
              Verificación de Cuenta
            </p>
          </div>
          
          <div className="space-y-4 text-primary-100">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Cuenta creada exitosamente</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Revisa tu correo electrónico</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ingresa el código de verificación</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Verificación */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/images/finalogotr.png" 
              alt="RYV SPA" 
              className="h-16 w-auto mx-auto mb-4"
              onError={(e) => {
                e.target.src = '/images/finalogo.jpeg';
              }}
            />
            <h1 className="text-2xl font-bold text-secondary-900 font-heading">RYV SPA</h1>
            <p className="text-secondary-600 text-sm mt-2">Verificación de Cuenta</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 overflow-hidden animate-fade-in-up">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-secondary-900 font-heading">
                  Verificar Cuenta
                </h2>
                {email && (
                  <p className="text-secondary-600 mt-2">
                    Ingresa el código enviado a: <span className="font-medium text-primary-600">{email}</span>
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl flex items-center animate-fade-in">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-secondary-700">
                    Código de Verificación
                  </label>
                  <div className="relative">
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      placeholder="000000"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="block w-full px-4 py-3 border border-secondary-300 rounded-xl placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest font-mono bg-white"
                      maxLength={6}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verificando...
                    </>
                  ) : (
                    <>
                      <span>Verificar Cuenta</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-secondary-50 px-6 py-6 border-t border-secondary-200 sm:px-8">
              <div className="text-center">
                <p className="text-secondary-600">
                  ¿No recibiste el código?{' '}
                  <button
                    type="button"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Reenviar código
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}