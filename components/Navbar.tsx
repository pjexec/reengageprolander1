
import React, { useState } from 'react';
import logoUrl from '../public/reengage-logo.png';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  navigateTo: (page: 'home' | 'about' | 'terms' | 'privacy') => void;
  currentPage: 'home' | 'about' | 'terms' | 'privacy';
  onOpenSignup: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentPage, onOpenSignup }) => {
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

  const handleGetStartedClick = () => {
    onOpenSignup();
    setMobileMenuOpen(false);
  };

  // Scroll visibility logic
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Only apply this logic on the home page where the sequence exists
    if (currentPage !== 'home') {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // If mobile (width < 768), always show navbar since sequence is hidden
      if (window.innerWidth < 768) {
        setIsVisible(true);
        return;
      }

      // The sequence is 600vh tall. We want the navbar to appear after we scroll past it.
      // We can use window.innerHeight * 5 as a safe threshold (approaching end of sequence)
      const threshold = window.innerHeight * 5.5;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Also check on resize
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentPage]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 bg-white border-b border-slate-100 h-20 sm:h-24 lg:h-28 shadow-sm transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Area */}
            <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
              <img
                src={logoUrl}
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
              <button
                onClick={handleGetStartedClick}
                className="hidden sm:flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium bg-[#1C3166] text-white hover:bg-[#14244a] transition-all duration-300 shadow-xl shadow-[#1C3166]/10 hover:-translate-y-1"
              >
                <span>Get Started</span>
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

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
                <button
                  onClick={handleGetStartedClick}
                  className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm font-medium bg-[#1C3166] text-white hover:bg-[#14244a] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

