// pages/LandingPage.jsx
import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Services from '../components/landing/Services';
import Projects from '../components/landing/Projects';
import Counter from '../components/landing/Counter';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Header />
      <main className="w-full overflow-hidden">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Counter />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;