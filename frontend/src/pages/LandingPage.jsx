// pages/LandingPage.jsx
import React, { lazy, Suspense } from 'react';

// Componentes que se cargan bajo demanda
const Projects = lazy(() => import('../components/landing/Projects'));
const FAQ = lazy(() => import('../components/landing/FAQ'));

const LoadingFallback = () => (
  <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-gray-400">Cargando...</div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Header />
      <main className="w-full overflow-hidden">
        <Hero />
        <About />
        <Services />
        <Suspense fallback={<LoadingFallback />}>
          <Projects />
        </Suspense>
        <Counter />
        <Suspense fallback={<LoadingFallback />}>
          <FAQ />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};