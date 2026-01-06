
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RiskSection from './components/RiskSection';
import DilemmaSection from './components/DilemmaSection';
import HowItWorks from './components/HowItWorks';
import SafetySystem from './components/SafetySystem';
import DataInsights from './components/DataInsights';
import FAQ from './components/FAQ';
import Credibility from './components/Credibility';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ComparisonSection from './components/ComparisonSection';
import IntegrationSection from './components/IntegrationSection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Observer for side progress indicator
  useEffect(() => {
    if (currentPage !== 'home') return;
    
    const sections = ['hero', 'risk', 'calculator', 'how-it-works', 'comparison', 'safety', 'faq'];
    const observerOptions = { rootMargin: '-20% 0px -70% 0px' };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  const navigateTo = (page: 'home' | 'about') => {
    setCurrentPage(page);
  };

  const progressDots = [
    { id: 'hero', label: 'Top' },
    { id: 'risk', label: 'Problem' },
    { id: 'calculator', label: 'ROI' },
    { id: 'how-it-works', label: 'Process' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'safety', label: 'Safety' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-[#1C3166] selection:bg-emerald-500 selection:text-white">
      <Navbar navigateTo={navigateTo} currentPage={currentPage} />
      
      {/* Side Progress Indicator */}
      {currentPage === 'home' && (
        <div id="side-progress" className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-4">
          {progressDots.map((dot) => (
            <a 
              key={dot.id}
              href={`#${dot.id}`}
              className="group relative flex items-center justify-end"
            >
              <span className={`mr-4 text-[10px] font-black uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition duration-300 ${activeSection === dot.id ? 'opacity-100 text-emerald-400' : ''}`}>
                {dot.label}
              </span>
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                activeSection === dot.id 
                  ? 'bg-emerald-400 border-emerald-400 scale-125' 
                  : 'bg-transparent border-white/20 group-hover:border-white/60'
              }`}></div>
            </a>
          ))}
        </div>
      )}

      <main>
        {currentPage === 'home' ? (
          <>
            <div id="hero"><Hero /></div>
            <div id="risk"><RiskSection /></div>
            <DataInsights /> {/* ID is inside component */}
            <HowItWorks /> {/* ID is inside component */}
            <IntegrationSection />
            <div id="comparison"><ComparisonSection /></div>
            <SafetySystem /> {/* ID is inside component */}
            <FAQ /> {/* ID is inside component */}
            <Credibility />
            <FinalCTA />
          </>
        ) : (
          <AboutPage />
        )}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
};

export default App;