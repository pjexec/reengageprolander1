
import React from 'react';
import { AlertTriangle, DollarSign } from 'lucide-react';

const UnengagedSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Hidden Cost Alert</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-[#1C3166] mb-6">
                        See Exactly Who's Costing You Money
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Instantly identify which subscribers are draining your budget without ever opening your emails.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Screenshot with annotation */}
                    <div className="relative group">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <img
                                src="/screenshots/Screenshot-2026-01-07-at-4.34.04-PM.png"
                                alt="ReEngage Pro subscriber segmentation - identify unengaged subscribers"
                                className="w-full h-auto"
                                loading="lazy"
                            />
                        </div>

                        {/* Annotation bubble */}
                        <div className="absolute top-1/4 -right-4 sm:right-4 lg:-right-8 transform translate-x-0 bg-red-500 text-white px-4 py-3 rounded-xl shadow-xl max-w-[200px] sm:max-w-[240px] animate-pulse-slow">
                            <div className="flex items-start space-x-2">
                                <DollarSign className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-bold leading-snug">
                                    These subscribers are draining your budget every month
                                </p>
                            </div>
                            {/* Arrow */}
                            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-red-500"></div>
                        </div>
                    </div>

                    {/* Stats callout */}
                    <div className="mt-10 flex flex-wrap justify-center gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-black text-red-500">30%</div>
                            <div className="text-sm text-slate-500 font-medium">Average dormant rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-[#1C3166]">$0.01-0.05</div>
                            <div className="text-sm text-slate-500 font-medium">Cost per dead subscriber/mo</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-emerald-500">$1000s</div>
                            <div className="text-sm text-slate-500 font-medium">Wasted annually</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UnengagedSection;
