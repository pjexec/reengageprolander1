
import React from 'react';
import { AlertCircle, UserX, UserMinus, ShieldAlert, TrendingDown, DollarSign } from 'lucide-react';

const RiskSection: React.FC = () => {
  const stats = [
    { label: "List Decay", value: "63%", sub: "Subscribers inactive for 6+ months", icon: <TrendingDown className="text-red-400" /> },
    { label: "Wasted Spend", value: "$4.2k", sub: "Avg. annual cost for 'dead' contacts", icon: <DollarSign className="text-orange-400" /> },
    { label: "Deliverability", value: "Spam", sub: "Risk profile of poor engagement", icon: <AlertCircle className="text-red-500" /> }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             {/* Red Glow for problem amplification */}
            <div className="absolute -inset-10 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-[#1C3166] mb-8 leading-tight">
              The $X,XXX Problem <br/>Hiding in Your ESP
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Every month, you're paying for people who have effectively "left" your list. These dormant subscribers don't just cost you money—they actively damage your sender reputation.
            </p>
            
            <div className="space-y-8 mb-12">
               {stats.map((stat, i) => (
                 <div key={i} className="flex items-start space-x-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#1C3166] leading-none mb-1">{stat.value}</div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                      <p className="text-sm text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-[#1C3166] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xl font-bold leading-relaxed mb-6">
                  "Poor engagement rates push you closer to the spam folder for your entire list. Google and Yahoo treat cold subscribers as signals of poor content quality."
                </p>
                <div className="flex items-center space-x-3 text-red-400 text-xs font-black uppercase tracking-widest">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Critical Domain Exposure Alert</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-[#162752] p-8 sm:p-12 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
               <div className="mb-10 flex justify-between items-center">
                  <div>
                    <h4 className="text-white text-xl font-bold mb-1">Reputation Death Spiral</h4>
                    <p className="text-slate-400 text-sm">Real-time engagement impact simulation</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <TrendingDown className="text-red-500 w-6 h-6" />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Sender Score</span>
                      <span className="text-red-400">42 / 100</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[42%]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                       <div className="text-xs font-bold text-red-300 mb-1">Inbox Placement</div>
                       <div className="text-2xl font-black text-white">12%</div>
                    </div>
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                       <div className="text-xs font-bold text-orange-300 mb-1">Spam Rate</div>
                       <div className="text-2xl font-black text-white">8.4%</div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                    <div className="text-xs font-black text-white/20 uppercase tracking-[0.3em] mb-4 text-center">Outcome Projection</div>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Primary domain blacklisting risk</span>
                      </li>
                      <li className="flex items-center space-x-3 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Wasted acquisition spend: $12,400</span>
                      </li>
                      <li className="flex items-center space-x-3 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Revenue loss from "safe" segments</span>
                      </li>
                    </ul>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskSection;
