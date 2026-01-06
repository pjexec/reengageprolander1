
import React from 'react';

const IntegrationSection: React.FC = () => {
  const platforms = [
    "Mailchimp", "Kit", "ActiveCampaign", "Klaviyo", 
    "MailerLite", "GetResponse", "HubSpot", "Brevo",
    "AWeber", "Campaign Monitor", "Constant Contact"
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Works Seamlessly With Your Email Platform</h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          {platforms.map((name) => (
            <div key={name} className="group cursor-default flex items-center justify-center grayscale-hover">
               <span className="text-xl md:text-2xl font-black text-slate-400 group-hover:text-[#1C3166] tracking-tighter transition duration-300">
                {name}
               </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plus 20+ more platforms via direct API integration</p>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;