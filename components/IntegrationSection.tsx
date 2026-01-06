
import React from 'react';

const IntegrationSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Works Seamlessly With Your Email Platform</h3>
        </div>

        <div className="flex justify-center items-center">
          <img
            src="/esp-logos.png"
            alt="Klaviyo, Kit, HubSpot, Mailchimp, ActiveCampaign"
            className="max-w-full h-auto w-full sm:w-auto sm:max-h-12 md:max-h-16 object-contain"
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plus more platforms via direct API integration</p>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;