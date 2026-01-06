
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AlertTriangle, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';

const ReputationAnalyzer: React.FC = () => {
  const [listSize, setListSize] = useState<string>('50000');
  const [monthsInactive, setMonthsInactive] = useState<string>('6');
  const [openRate, setOpenRate] = useState<string>('20');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeRisk = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        Act as an email deliverability expert. Analyze the following campaign profile:
        - Total List Size: ${listSize}
        - Months since last re-engagement of dormant segment: ${monthsInactive}
        - Average Open Rate: ${openRate}%

        Provide a "Risk Reputation Analysis" in exactly 3 bullet points. 
        Focus on potential damage to Gmail/Yahoo sender reputation and specific risks of re-engaging this profile with standard "blast" tools.
        Keep the tone professional and expert-led. Use bolding for emphasis.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || "Unable to generate analysis.");
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1C3166] border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl ring-1 ring-white/5">
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">List Size</label>
          <input 
            type="number" 
            value={listSize}
            onChange={(e) => setListSize(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-bold"
            placeholder="e.g. 50000"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Months Dormant</label>
          <input 
            type="number" 
            value={monthsInactive}
            onChange={(e) => setMonthsInactive(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-bold"
            placeholder="e.g. 6"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Open Rate (%)</label>
          <input 
            type="number" 
            value={openRate}
            onChange={(e) => setOpenRate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-bold"
            placeholder="e.g. 20"
          />
        </div>
      </div>

      <button 
        onClick={analyzeRisk}
        disabled={isLoading}
        className="w-full bg-white text-[#1C3166] font-black text-lg py-5 rounded-2xl hover:bg-slate-100 transition flex items-center justify-center space-x-3 disabled:opacity-50 shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>AI Risk Modeling...</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-6 h-6" />
            <span>RUN REPUTATION AUDIT</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-10 p-5 bg-red-500/10 text-red-400 text-sm rounded-2xl border border-red-500/20 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {analysis && !isLoading && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center space-x-3 text-emerald-400 font-black uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-6 text-xs">
            <ShieldCheck className="w-5 h-5" />
            <span>Audit Complete: Risk Profile Found</span>
          </div>
          <div className="text-slate-200 text-lg leading-relaxed space-y-6 prose-invert max-w-none">
            {analysis.split('\n').map((line, i) => (
              <p key={i} className="font-medium" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Proprietary Deliverability Model v3-Flash-Pro</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReputationAnalyzer;
