
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface NavbarProps {
  navigateTo: (page: 'home' | 'about') => void;
  currentPage: 'home' | 'about';
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentPage }) => {
  const handleLogoClick = () => {
    if (currentPage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo('home');
    }
  };

  const navLinks = [
    { id: 'how-it-works', label: 'Features' },
    { id: 'calculator', label: 'ROI' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 h-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo Area */}
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <img 
              src="https://app.reengage.pro/_next/image?url=%2Flogo.png&w=384&q=75" 
              alt="ReEngage Pro Logo" 
              className="h-20 w-auto"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-12">
            {currentPage === 'home' && navLinks.map(link => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 hover:text-[#1C3166] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <button 
              onClick={() => navigateTo('about')} 
              className={`text-xs font-black uppercase tracking-[0.25em] transition-colors duration-300 ${
                currentPage === 'about' 
                  ? 'text-emerald-600' 
                  : 'text-slate-500 hover:text-[#1C3166]'
              }`}
            >
              About
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-8">
            <a 
              href="https://app.reengage.pro/login" 
              className="hidden sm:block text-xs font-black uppercase tracking-[0.25em] text-slate-600 hover:text-[#1C3166] transition-colors duration-300"
            >
              Login
            </a>
            <a 
              href="https://app.reengage.pro/register" 
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl text-sm font-black bg-[#1C3166] text-white hover:bg-[#14244a] transition-all duration-300 shadow-xl shadow-[#1C3166]/10 hover:-translate-y-1"
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
