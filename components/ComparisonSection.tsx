
import React from 'react';
import { XCircle, CheckCircle2, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ComparisonSectionProps {
   onOpenSignup: () => void;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onOpenSignup }) => {
   return (
      <section id="comparison" className="py-24 bg-white scroll-mt-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-3xl sm:text-5xl font-black text-[#1C3166] mb-6 tracking-tight">The High Cost of Doing Nothing</h2>
               <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Ignoring your dormant subscribers is an expensive mistake. Here's how we compare to the status quo.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-slate-200 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl">
               {/* Status Quo */}
               <div className="p-8 sm:p-16 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200">
                  <div className="flex items-center space-x-3 mb-10 sm:mb-12">
                     <XCircle className="text-red-500 w-8 h-8" />
                     <h3 className="text-xl sm:text-2xl font-black text-[#1C3166]">Doing Nothing</h3>
                  </div>

                  <ul className="space-y-8 sm:space-y-10">
                     <li className="flex items-start space-x-5 sm:space-x-6">
                        <TrendingDown className="text-red-400 w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold text-[#1C3166] mb-2">Steady List Decay</h4>
                           <p className="text-sm sm:text-base text-slate-500 leading-relaxed">3-5% of your list goes "cold" every month. Without a system, they stay there forever.</p>
                        </div>
                     </li>
                     <li className="flex items-start space-x-5 sm:space-x-6">
                        <AlertTriangle className="text-red-400 w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold text-[#1C3166] mb-2">Reputation Degradation</h4>
                           <p className="text-sm sm:text-base text-slate-500 leading-relaxed">ISPs see your lack of engagement and slowly push your active sends to the spam tab.</p>
                        </div>
                     </li>
                     <li className="flex items-start space-x-5 sm:space-x-6">
                        <TrendingDown className="text-red-400 w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold text-[#1C3166] mb-2">Wasted Marketing ROI</h4>
                           <p className="text-sm sm:text-base text-slate-500 leading-relaxed">You've already paid for these leads. Every day they stay dormant is acquisition budget lost.</p>
                        </div>
                     </li>
                  </ul>
               </div>

               {/* ReEngage Pro */}
               <div className="p-8 sm:p-16 bg-[#1C3166] text-white">
                  <div className="flex items-center space-x-3 mb-10 sm:mb-12">
                     <CheckCircle2 className="text-emerald-400 w-8 h-8" />
                     <h3 className="text-xl sm:text-2xl font-black">With ReEngage Pro</h3>
                  </div>

                  <ul className="space-y-8 sm:space-y-10">
                     <li className="flex items-start space-x-5 sm:space-x-6">
                        <TrendingUp className="text-emerald-400 w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold mb-2">Continuous List Revitalization</h4>
                           <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Cold subscribers are automatically identified and enter safe recovery paths daily.</p>
                        </div>
                     </li>
                     <li className="flex items-start space-x-5 sm:space-x-6">
                        <ShieldCheck className="text-emerald-400 w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold mb-2">Domain Protection</h4>
                           <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Positive engagement signals from re-engaged users boost your overall authority.</p>
                        </div>
                     </li>
                     <li className="flex items-start space-x-5 sm:space-x-6">
                        <TrendingUp className="text-emerald-400 w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold mb-2">Maximized Lead Value</h4>
                           <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Recover 5-15% of your dormant list and turn 'lost' leads back into revenue.</p>
                        </div>
                     </li>
                  </ul>

                  <div className="mt-12 sm:mt-16 text-center">
                     <button
                        onClick={onOpenSignup}
                        className="w-full sm:w-auto inline-block bg-white text-[#1C3166] font-black px-10 py-5 rounded-2xl hover:bg-slate-100 transition shadow-2xl"
                     >
                        Switch to Pro Today
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default ComparisonSection;