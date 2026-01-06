
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Users } from 'lucide-react';

const DataInsights: React.FC = () => {
  const [listSize, setListSize] = useState<number>(50000);
  const [monthlyCost, setMonthlyCost] = useState<number>(500);
  const [dormantPercent, setDormantPercent] = useState<number>(30);
  
  const [wastedAnnual, setWastedAnnual] = useState<number>(0);
  const [potentialLift, setPotentialLift] = useState<number>(0);

  useEffect(() => {
    const dormantCount = listSize * (dormantPercent / 100);
    const costPerUser = monthlyCost / listSize;
    const wastedMonthly = dormantCount * costPerUser;
    setWastedAnnual(Math.round(wastedMonthly * 12));
    
    // Estimate potential lift (rough heuristic for demonstration)
    setPotentialLift(Math.round(dormantCount * 0.05 * 45)); // 5% recovery at $45 LTV
  }, [listSize, monthlyCost, dormantPercent]);

  return (
    <section id="calculator" className="py-24 bg-slate-50 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-[#1C3166] mb-6">Calculate Your List's Hidden Cost</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Every "dead" subscriber is a silent tax on your marketing budget. See how much you could save (and recover) in 30 seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-0 rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-200">
          {/* Inputs */}
          <div className="lg:col-span-3 p-8 sm:p-14 bg-white">
            <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calculator className="text-[#1C3166] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1C3166]">Savings Calculator</h3>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Total List Size</label>
                  <span className="text-xl font-black text-[#1C3166]">{listSize.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="1000" max="1000000" step="1000" 
                  value={listSize} onChange={(e) => setListSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1C3166]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">ESP Monthly Bill ($)</label>
                  <span className="text-xl font-black text-[#1C3166]">${monthlyCost.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="50" max="10000" step="50" 
                  value={monthlyCost} onChange={(e) => setMonthlyCost(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1C3166]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dormant Segment (%)</label>
                  <span className="text-xl font-black text-red-500">{dormantPercent}%</span>
                </div>
                <input 
                  type="range" min="5" max="80" step="1" 
                  value={dormantPercent} onChange={(e) => setDormantPercent(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 p-8 sm:p-14 bg-[#1C3166] text-white flex flex-col justify-center">
            <div className="space-y-12">
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Annual Wasted Spend</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-black text-red-400">${wastedAnnual.toLocaleString()}</span>
                  <span className="text-white/40 text-sm font-bold">/ year</span>
                </div>
                <p className="text-xs text-white/40 mt-4 font-medium italic leading-relaxed">
                  *This is budget being spent on subscribers who never open your emails.
                </p>
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="text-[10px] font-black text-emerald-400/50 uppercase tracking-[0.3em] mb-4">Est. Recovery Revenue</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-400">${potentialLift.toLocaleString()}</span>
                  <span className="text-white/40 text-sm font-bold">/ potential</span>
                </div>
                <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                  By wining back <span className="text-emerald-400 font-bold">5%</span> of your cold list.
                </p>
              </div>

              <a 
                href="https://app.reengage.pro/register" 
                className="w-full block bg-emerald-500 text-center py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition shadow-xl shadow-emerald-900/40"
              >
                Claim This Revenue
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataInsights;