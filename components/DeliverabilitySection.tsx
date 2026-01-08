
import React from 'react';
import { Shield, Activity } from 'lucide-react';

const DeliverabilitySection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Reputation Protection</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-[#1C3166] mb-6">
                        Protect Your Sender Reputation
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Monitor deliverability metrics in real-time while you re-engage. Our safety features ensure campaigns never hurt your sender reputation.
                    </p>
                </div>

                {/* Side by side screenshots */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left screenshot - Health Dashboard */}
                    <div className="group relative">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transform group-hover:-translate-y-1 transition-transform duration-300 animate-glow-green">
                            <div className="bg-[#1C3166] px-4 py-3 flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-white">Deliverability Health</span>
                            </div>
                            <img
                                src="/screenshots/Screenshot-2026-01-07-at-4.33.52-PM.png"
                                alt="Deliverability health dashboard showing email performance metrics"
                                className="w-full h-auto"
                                loading="lazy"
                            />
                        </div>
                        {/* Green checkmark badge */}
                        <div className="screenshot-highlight absolute top-4 right-4 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse-ring">
                            <span className="text-lg">✓</span>
                        </div>
                    </div>

                    {/* Right screenshot - Safety Monitor */}
                    <div className="group relative">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transform group-hover:-translate-y-1 transition-transform duration-300">
                            <div className="bg-[#1C3166] px-4 py-3 flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-white">Safety Monitor</span>
                            </div>
                            <img
                                src="/screenshots/SCR-20260107-opby.png"
                                alt="Safety monitoring page protecting sender reputation"
                                className="w-full h-auto"
                                loading="lazy"
                            />
                        </div>
                        {/* Warning indicator badge */}
                        <div className="screenshot-highlight absolute top-4 right-4 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-shake-warning">
                            <span className="text-lg font-bold">!</span>
                        </div>
                    </div>
                </div>

                {/* Caption */}
                <div className="mt-12 text-center">
                    <p className="text-lg text-slate-600 font-medium">
                        Our safety features ensure re-engagement doesn't hurt your sender reputation
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-6">
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Real-time bounce monitoring</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Automatic pause triggers</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Domain health tracking</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeliverabilitySection;
