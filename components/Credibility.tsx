
import React from 'react';
import { Award, ShieldCheck, Lock, Globe } from 'lucide-react';

const Credibility: React.FC = () => {
  const certifications = [
    { icon: <ShieldCheck size={20} />, label: "GDPR Compliant" },
    { icon: <Lock size={20} />, label: "SOC2 Type II Ready" },
    { icon: <Award size={20} />, label: "Expert Certified" },
    { icon: <Globe size={20} />, label: "CCPA Compliant" }
  ];

  return (
    <section className="py-32 bg-[#1C3166] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 tracking-tight">Built by email deliverability veterans</h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
          Created by operators who've managed millions of sends and navigated every major deliverability shift from Gmail, Yahoo, and Apple over the last 15 years. No theory. No shortcuts. Just disciplined execution.
        </p>

        <div className="inline-flex flex-wrap justify-center gap-4 sm:gap-6 mb-16">
          {certifications.map((cert, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-white/5 border border-white/10 px-5 sm:px-6 py-3 rounded-2xl shadow-sm">
              <div className="text-emerald-400">{cert.icon}</div>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{cert.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col items-center">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-4">
            Security & Compliance Infrastructure
          </p>
          <div className="flex items-center space-x-2 text-emerald-400/40">
            <Lock size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">End-to-End ESP Data Encryption</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credibility;

