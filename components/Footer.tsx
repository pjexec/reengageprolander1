
import React from 'react';

interface FooterProps {
  navigateTo: (page: 'home' | 'about' | 'terms' | 'privacy') => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-white text-slate-600 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => navigateTo('home')}>
              <img
                src="https://app.reengage.pro/_next/image?url=%2Flogo.png&w=384&q=75"
                alt="ReEngage Pro Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm max-w-xs leading-relaxed font-medium text-slate-500">
              Automating the careful re-engagement of dormant subscribers to protect deliverability and recover lost revenue.
            </p>
          </div>
          <div>
            <h5 className="text-slate-900 font-bold text-sm mb-6 uppercase tracking-widest">Platform</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition">Features</button></li>
              <li><button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition text-left">Security</button></li>
              <li><button className="hover:text-slate-900 transition text-left">Integrations</button></li>
              <li><button className="hover:text-slate-900 transition text-left">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-slate-900 font-bold text-sm mb-6 uppercase tracking-widest">Company</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigateTo('about')} className="hover:text-slate-900 transition text-left">About Us</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-slate-900 transition text-left">Terms of Service</button></li>
              <li><button onClick={() => navigateTo('privacy')} className="hover:text-slate-900 transition text-left">Privacy Policy</button></li>
              <li><button className="hover:text-slate-900 transition text-left">Support</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs font-semibold">
          <p>&copy; {new Date().getFullYear()} ReEngage Pro. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-slate-400">
            <span>Built by deliverability veterans.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
