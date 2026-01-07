
import React, { useState } from 'react';
import { Plus, Minus, MessageSquare } from 'lucide-react';

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`mb-4 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'bg-white/5 shadow-xl' : 'bg-transparent hover:bg-white/[0.02]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 sm:p-8 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className="text-lg sm:text-xl font-bold text-white group-hover:text-slate-300 transition pr-8">{q}</span>
        <div className="flex-shrink-0 transition-transform duration-300 transform" style={{ transform: open ? 'rotate(0deg)' : 'rotate(0deg)' }}>
          {open ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Minus size={18} className="text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20">
              <Plus size={18} className="text-white/40 group-hover:text-white transition" />
            </div>
          )}
        </div>
      </button>
      {open && (
        <div className="px-6 sm:px-8 pb-8 text-slate-400 leading-relaxed text-lg animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-px w-12 bg-emerald-500/30 mb-6"></div>
          {a}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "How does ReEngage Pro integrate with my email platform?",
      a: "We use official API connections for all supported ESPs (Klaviyo, Mailchimp, etc.). Once connected, we sync your subscriber engagement metadata to identify dormant contacts. We never modify your existing automations without your permission."
    },
    {
      q: "Will re-engagement campaigns hurt my sender reputation?",
      a: "The opposite. Sending to inactive subscribers 'blindly' is what hurts reputation. ReEngage Pro uses randomized, human-cadence delays and real-time deliverability monitoring to ensure every send is treated as high-quality engagement by Gmail and Yahoo."
    },
    {
      q: "What happens to subscribers who don't re-engage?",
      a: "Subscribers who complete our re-engagement sequences without activity are flagged as 'High Risk'. We recommend moving these to a final suppression list to stop paying for them and protect your deliverability long-term."
    },
    {
      q: "Can I customize the re-engagement sequences?",
      a: "Absolutely. While we provide expert-vetted templates and cadences, you have full control over the copy, timing, and 'stop' thresholds. You can approve every single email before it goes out."
    },
    {
      q: "How quickly will I see results?",
      a: "Typically within 48-72 hours of starting your first campaign. Because we prioritize 'warm' dormant users first, you'll see a quick lift in recovered open rates and clicks."
    },
    {
      q: "Is my subscriber data secure?",
      a: "Your data is encrypted using AES-256 encryption for sensitive credentials, and all communications are secured via TLS. We provide GDPR data export and deletion capabilities, and are committed to protecting your privacy."
    }
  ];

  return (
    <section id="faq" className="py-32 bg-[#1C3166] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Knowledge Base</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Common Questions</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need to know about safely recovering your cold list.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => <FAQItem key={idx} q={faq.q} a={faq.a} />)}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 font-medium">
            Have other questions? <a href="#" className="text-emerald-400 hover:text-emerald-300 underline font-bold transition">Speak with an expert</a>
          </p>
        </div>

        {/* Team Feature Highlight */}
        <div className="mt-20 bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-2/3 w-full">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/screenshots/Screenshot-2026-01-07-at-4.35.54-PM.png"
                  alt="Invite team members to your ReEngage Pro account"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:w-1/3 text-center lg:text-left">
              <h4 className="text-2xl font-bold text-white mb-4">Built for Teams</h4>
              <p className="text-slate-400 leading-relaxed text-lg">
                Invite unlimited team members. Collaborate on campaigns, share insights, and keep everyone aligned.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15rem] font-black text-white/[0.02] pointer-events-none select-none">
        ANSWERS
      </div>
    </section>
  );
};

export default FAQ; // v2