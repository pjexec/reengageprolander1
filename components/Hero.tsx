
import React from 'react';
import { ArrowRight, TrendingUp, DollarSign } from 'lucide-react';

interface HeroProps {
  onOpenSignup: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenSignup }) => {
  return (
    <section className="relative pt-32 sm:pt-40 lg:pt-56 pb-16 sm:pb-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 to-[#1C3166]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-10">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Attention Email Marketers</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto mb-10 leading-[1.05]">
          Stop Paying for Dead Subscribers That <span className="text-red-500 italic">Kill Your Performance</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300/80 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          <span className="font-black text-2xl sm:text-3xl text-white">ReEngage Pro</span> identifies and revives cold subscribers, saving you money while protecting your sender reputation automatically.
        </p>

        <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <div className="flex items-center space-x-3 text-emerald-400 font-black text-sm bg-emerald-400/5 px-6 py-3 rounded-2xl border border-emerald-400/10 backdrop-blur-sm">
            <TrendingUp size={20} />
            <span className="tracking-wide">+42% Avg. Open Rate Lift</span>
          </div>
          <div className="flex items-center space-x-3 text-emerald-400 font-black text-sm bg-emerald-400/5 px-6 py-3 rounded-2xl border border-emerald-400/10 backdrop-blur-sm">
            <DollarSign size={20} />
            <span className="tracking-wide">Save $400 - $2k+ / Month</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button
              onClick={onOpenSignup}
              className="group flex items-center space-x-2 sm:space-x-4 bg-white text-[#1C3166] px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-xl font-black hover:bg-slate-50 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.1)] transform hover:-translate-y-1"
            >
              <span>See Your Potential - Free</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-white font-black px-6 sm:px-10 py-4 sm:py-5 border border-white/20 rounded-xl sm:rounded-2xl text-sm sm:text-base hover:bg-white/5 transition-colors duration-300">
              Watch 2-Min Demo
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-400 max-w-md mx-auto font-bold uppercase tracking-widest leading-relaxed">
              <span className="text-orange-400">Every month you wait costs you hundreds in wasted email fees.</span>
            </p>
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[58%]"></div>
                </div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">7 Beta Slots Left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Radial Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"></div>
      </div>
    </section>
  );
};

export default Hero;

