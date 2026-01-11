
import React from 'react';
import { ArrowRight, Lock, ShieldCheck, Zap } from 'lucide-react';

interface FinalCTAProps {
  onOpenSignup: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenSignup }) => {
  return (
    <section className="py-32 bg-slate-900 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-6xl font-black text-white mb-10 leading-[1.1]">
          Stop Wasting Your <br />Marketing Budget.
        </h2>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join the beta today and start recovering revenue from your unengaged subscribers.
        </p>

        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={onOpenSignup}
            className="group flex items-center space-x-4 bg-emerald-500 text-white px-12 py-6 rounded-[2rem] text-2xl font-black hover:bg-emerald-400 transition shadow-[0_20px_50px_rgba(16,185,129,0.3)] transform hover:-translate-y-2 active:translate-y-0"
          >
            <span>Request Beta Access</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition" />
          </button>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
            <span className="flex items-center space-x-2 font-bold">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>No credit card required</span>
            </span>
            <span className="flex items-center space-x-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GDPR Compliant</span>
            </span>
            <span className="flex items-center space-x-2 font-bold">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Bank-grade ESP encryption</span>
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl max-w-md mx-auto">
            <p className="text-xs text-slate-400 font-medium">
              <span className="text-red-400 font-black uppercase tracking-widest block mb-2">Limited Availability</span>
              Only <span className="text-white font-bold">7 beta spots</span> remaining for this month's intake.
            </p>
          </div>
        </div>
      </div>

      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
};

export default FinalCTA;

