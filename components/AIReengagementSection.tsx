
import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

const AIReengagementSection: React.FC = () => {
    return (
        <section className="py-24 bg-[#1C3166] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">AI-Powered</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
                        Powerful AI-Driven Re-engagement
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Let our AI craft personalized messages that resonate with each subscriber's history and preferences.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Screenshot container */}
                    <div className="relative group">
                        {/* Browser chrome styling */}
                        <div className="bg-slate-800 rounded-t-xl px-4 py-3 flex items-center space-x-2 border-b border-slate-700 relative">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex-1 ml-4">
                                <div className="bg-slate-700 rounded-md px-4 py-1.5 text-xs text-slate-400 max-w-xs mx-auto text-center flex items-center justify-center space-x-2">
                                    <Wand2 className="w-3 h-3" />
                                    <span>Activity & Transparency</span>
                                </div>
                            </div>

                            {/* Immutable logs annotation - positioned to the left of center label */}
                            <div className="screenshot-highlight absolute left-[15%] top-1/2 -translate-y-1/2 animate-bounce-arrow z-10">
                                <div className="bg-emerald-500 text-white px-3 py-2 rounded-xl shadow-xl max-w-[260px] text-center relative">
                                    <p className="text-xs font-bold leading-snug">
                                        Trust your data with immutable action logs permanently recorded and impossible to change.
                                    </p>
                                    {/* Arrow pointing down */}
                                    <div className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-emerald-500"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-b-xl overflow-hidden shadow-2xl shadow-black/50 relative">
                            <img
                                src="/screenshots/SCR-20260107-opld.png"
                                alt="AI-powered email campaign creation with personalized messaging"
                                className="w-full h-auto transform group-hover:scale-[1.01] transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </div>

                    {/* Caption */}
                    <div className="mt-10 text-center">
                        <p className="text-lg text-slate-300 font-medium flex items-center justify-center space-x-3">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            <span>AI crafts personalized messages that bring subscribers back</span>
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIReengagementSection;
