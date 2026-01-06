
import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  navigateTo: (page: 'home' | 'about') => void;
  currentPage: 'home' | 'about';
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (currentPage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo('home');
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'how-it-works', label: 'Features' },
    { id: 'calculator', label: 'ROI' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (linkId: string) => {
    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const element = document.getElementById(linkId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll to the anchor
      const element = document.getElementById(linkId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleAboutClick = () => {
    navigateTo('about');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 h-20 sm:h-24 lg:h-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Area */}
            <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
              <img
                src="https://app.reengage.pro/_next/image?url=%2Flogo.png&w=384&q=75"
                alt="ReEngage Pro Logo"
                className="h-12 sm:h-16 lg:h-20 w-auto"
              />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-12">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    if (currentPage !== 'home') {
                      e.preventDefault();
                      handleNavClick(link.id);
                    }
                  }}
                  className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 hover:text-[#1C3166] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleAboutClick}
                className={`text-xs font-black uppercase tracking-[0.25em] transition-colors duration-300 ${currentPage === 'about'
                  ? 'text-emerald-600'
                  : 'text-slate-500 hover:text-[#1C3166]'
                  }`}
              >
                About
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <a
                href="https://app.reengage.pro/login"
                className="hidden sm:block text-xs font-black uppercase tracking-[0.25em] text-slate-600 hover:text-[#1C3166] transition-colors duration-300"
              >
                Login
              </a>
              <a
                href="https://app.reengage.pro/register"
                className="hidden sm:flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium bg-[#1C3166] text-white hover:bg-[#14244a] transition-all duration-300 shadow-xl shadow-[#1C3166]/10 hover:-translate-y-1"
              >
                <span>Get Started</span>
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-[#1C3166] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-20 sm:top-24 left-0 right-0 bg-white border-b border-slate-200 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id);
                  }}
                  className="block py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#1C3166] transition-colors border-b border-slate-100"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleAboutClick}
                className={`block w-full text-left py-3 text-sm font-black uppercase tracking-[0.2em] transition-colors border-b border-slate-100 ${currentPage === 'about' ? 'text-emerald-600' : 'text-slate-600 hover:text-[#1C3166]'
                  }`}
              >
                About
              </button>
              <div className="pt-4 space-y-3">
                <a
                  href="https://app.reengage.pro/login"
                  className="block text-center py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#1C3166] transition-colors border border-slate-200 rounded-xl"
                >
                  Login
                </a>
                <a
                  href="https://app.reengage.pro/register"
                  className="flex items-center justify-center space-x-2 py-4 rounded-xl text-sm font-medium bg-[#1C3166] text-white hover:bg-[#14244a] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
