
import React from 'react';
import { Eye, ShieldAlert, Sliders, Activity } from 'lucide-react';

const SafetySystem: React.FC = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      title: "Automatic monitoring",
      desc: "Bounces, complaints, and domain health tracked in real time across every major inbox provider."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-emerald-400" />,
      title: "Instant protection",
      desc: "Campaigns pause automatically before damage occurs. The system reacts faster than any human can."
    },
    {
      icon: <Sliders className="w-6 h-6 text-emerald-400" />,
      title: "You stay in control",
      desc: "Manual stop, start, or threshold adjustment at any time. We follow your rules, not the other way around."
    },
    {
      icon: <Eye className="w-6 h-6 text-emerald-400" />,
      title: "Immutable transparency",
      desc: "Every decision, pause, and change is permanently logged. View exactly why the system took action."
    }
  ];

  return (
    <section id="safety" className="py-24 bg-[#1C3166] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-8 leading-tight">
              Your reputation comes first. <br className="hidden sm:block" />
              <span className="text-white/40 font-medium">Revenue comes second.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-14 leading-relaxed">
              Our safety logic is built on conservative deliverability principles. We prioritize the health of your primary domain above all else.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-white text-lg">{feature.title}</h4>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-[#162752] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <h5 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Real-time Safety Log</h5>
                  <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.5)]"></span>
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">SECURE MONITORING</span>
                  </div>
               </div>
               
               <div className="space-y-5 font-mono text-[11px] leading-relaxed">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-start space-x-4 hover:border-white/10 transition">
                    <span className="text-white/20 font-bold">10:42:01</span>
                    <span className="text-slate-200">[STATUS] Campaign 'Q1 Winback' send initiated (Recipient: *******@gmail.com)</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-start space-x-4 hover:border-white/10 transition">
                    <span className="text-white/20 font-bold">10:58:34</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-tighter">[SAFEGUARD] Randomized delay injected (182s) for human cadence</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start space-x-4">
                    <span className="text-emerald-500/40 font-bold">11:15:12</span>
                    <span className="text-emerald-200 font-black tracking-tight">[VERIFIED] Engagement detected. Transferring to active segments.</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-start space-x-4 opacity-40">
                    <span className="text-white/20 font-bold">11:18:00</span>
                    <span className="text-slate-300">[MONITOR] Checking domain bounce threshold (Current: 0.12% / Max: 1.0%)</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySystem;
