
import React from 'react';
import { ShieldCheck, XCircle, FileText, ChevronDown } from 'lucide-react';

const AboutPage: React.FC = () => {
  const manifesto = [
    {
      title: "We refuse to send email blindly.",
      body: "Re-engagement is not a volume problem—it’s a signal problem—and any system that pushes volume without live feedback is reckless by design. If the data isn’t there, the campaign doesn’t move. If the signals degrade, it stops. Period."
    },
    {
      title: "We refuse to pretend that one-size-fits-all best practices work.",
      body: "Every domain, list, and sender history is different. Static rules, preset cadences, and copy-paste playbooks ignore reality and destroy reputations quietly over time. ReEngage Pro adapts to the sender—not the other way around."
    },
    {
      title: "We refuse to prioritize short-term revenue over sender health.",
      body: "Inflated “wins” that spike revenue today at the cost of inbox placement tomorrow are failures, not successes. If lift can’t be proven safely with holdouts and controlled pacing, it doesn’t ship."
    },
    {
      title: "We refuse to hide risk behind automation.",
      body: "Automation without brakes is just faster failure. That’s why safety systems, throttling governors, audit logs, and auto-pause mechanisms are not optional features—they’re structural requirements."
    },
    {
      title: "We refuse to treat deliverability as a black box.",
      body: "Domain reputation, DNS health, complaint rates, and Postmaster signals should be visible, measurable, and actionable. If you can’t see it, you can’t protect it."
    },
    {
      title: "We refuse to build “growth hacks.”",
      body: "No gray-area tactics. No exploitative tricks. No sending strategies that only work until they don’t. ReEngage Pro is designed to survive scrutiny—from inbox providers, compliance teams, and experienced operators—because long-term trust is the only advantage that compounds."
    }
  ];

  return (
    <div className="bg-[#1C3166] min-h-screen pt-28">
      {/* Header Section */}
      <section className="py-20 border-b border-white/5 bg-gradient-to-b from-slate-900 to-[#1C3166]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2.5 rounded-full mb-10">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Principles & Governance</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
            The Reputation-First <br className="hidden md:block" /> Operating Standard.
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            ReEngage Pro was founded to solve the tension between revenue growth and deliverability risk.
            We operate by a strict code of ethics designed to protect your most valuable digital asset.
          </p>
          <div className="flex justify-center">
            <div className="flex flex-col items-center animate-bounce opacity-40">
              <ChevronDown className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-8 sm:p-20 shadow-2xl relative">
            <div className="relative mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">What We Refuse to Do</h2>
              <div className="h-1.5 w-24 bg-red-500 rounded-full mb-8"></div>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                In an industry obsessed with short-term metrics, we distinguish ourselves by what we choose <span className="text-white font-bold italic underline decoration-red-500">not</span> to do. These are our non-negotiables.
              </p>
            </div>

            <div className="space-y-16">
              {manifesto.map((item, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row sm:space-x-10">
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg font-medium italic group-hover:text-slate-300 transition-colors">
                      "{item.body}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
