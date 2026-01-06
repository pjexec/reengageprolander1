
import React from 'react';
import { XCircle, Trash2, ArrowRight } from 'lucide-react';

const DilemmaSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#1C3166]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Email them or delete them?</h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">The classic marketer's dilemma that leads to stalled growth and wasted database potential.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/[0.07] transition group">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-white/10">
              <XCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-5">Option 1 – Email them</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              Risk complaints, bounces, and reputation damage that spills across your entire program. The aggressive approach that often ends in global spam filters.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/[0.07] transition group">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-white/10">
              <Trash2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-5">Option 2 – Delete them</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              Throw away potential revenue from people who might re-engage safely. You lose the acquisition cost already spent on these high-intent leads.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-8 flex items-center justify-center space-x-6">
            <span className="h-px w-16 bg-white/10"></span>
            <span>What if there was a third option?</span>
            <span className="h-px w-16 bg-white/10"></span>
          </p>
          <a 
            href="https://app.reengage.pro/register" 
            className="text-emerald-400 font-black text-lg flex items-center space-x-3 mx-auto hover:text-emerald-300 transition group tracking-wide"
          >
            <span>DISCOVER THE REENGAGE PRO WAY</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DilemmaSection;
