
import React from 'react';
import { Target, Search, Rocket, CheckCircle2 } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Know exactly who's costing you money",
      desc: "Instantly identify every subscriber worth saving—and every 'dead' address damaging your score.",
      outcome: "Immediate List Transparency"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Automatically identify subscribers worth saving",
      desc: "Our AI maps inactivity patterns to separate high-intent dormant leads from true spam traps.",
      outcome: "High-Precision Segments"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Win back subscribers on autopilot",
      desc: "Execute the 'slow-send' re-engagement paths deliverability experts use, without lifting a finger.",
      outcome: "Automated Revenue Recovery"
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-[#1C3166] text-white relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">Recover Lost Revenue in <br/>3 Simple Steps</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            We've automated complex deliverability logic into a plug-and-play recovery engine.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col group hover:bg-white/[0.08] transition shadow-2xl">
              <div className="mb-10 w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:scale-110 transition duration-500">
                {step.icon}
              </div>
              
              <div className="absolute top-10 right-10 text-white/5 text-8xl font-black select-none pointer-events-none">
                0{idx + 1}
              </div>
              
              <h3 className="text-2xl font-black mb-6 leading-tight pr-10">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg mb-8 flex-grow">
                {step.desc}
              </p>
              
              <div className="pt-6 border-t border-white/10 flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 size={18} />
                <span className="text-xs font-black uppercase tracking-widest">{step.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HowItWorks;