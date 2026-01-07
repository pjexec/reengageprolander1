
import React from 'react';
import { FileText, ChevronDown } from 'lucide-react';

const TermsOfService: React.FC = () => {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing or using ReEngage Pro's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting."
        },
        {
            title: "2. Description of Service",
            content: "ReEngage Pro provides an automated email re-engagement platform that helps identify dormant subscribers, create re-engagement campaigns, and protect sender reputation. Our service integrates with email service providers (ESPs) to analyze subscriber engagement data and automate re-engagement workflows."
        },
        {
            title: "3. Account Registration",
            content: "To use our services, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
        },
        {
            title: "4. User Responsibilities",
            content: "You agree to use our services only for lawful purposes and in compliance with all applicable laws, including CAN-SPAM, GDPR, CCPA, and other email marketing regulations. You are solely responsible for the content of your emails and maintaining proper consent from your subscribers."
        },
        {
            title: "5. ESP Integration & Data Access",
            content: "By connecting your ESP account to ReEngage Pro, you authorize us to access your subscriber data, engagement metrics, and campaign information solely for the purpose of providing our services. We do not sell, share, or use your data for any purpose other than delivering our service."
        },
        {
            title: "6. Billing & Payments",
            content: "Paid features are billed according to the pricing plan selected. All fees are non-refundable except as expressly stated otherwise. We reserve the right to modify pricing with 30 days notice. Failure to pay may result in service suspension or termination."
        },
        {
            title: "7. Intellectual Property",
            content: "All content, features, and functionality of ReEngage Pro, including but not limited to software, algorithms, designs, and documentation, are owned by ReEngage Pro and protected by intellectual property laws. You may not copy, modify, or reverse engineer any part of our service."
        },
        {
            title: "8. Limitation of Liability",
            content: "ReEngage Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Our total liability shall not exceed the amount paid by you in the twelve months preceding the claim."
        },
        {
            title: "9. Service Availability",
            content: "We strive to maintain high availability but do not guarantee uninterrupted service. We may perform maintenance, updates, or modifications that temporarily affect service availability. We are not liable for any losses resulting from service interruptions."
        },
        {
            title: "10. Termination",
            content: "Either party may terminate this agreement at any time. Upon termination, your access to the service will cease, and we may delete your data after a reasonable retention period. Provisions that by their nature should survive termination will remain in effect."
        },
        {
            title: "11. Governing Law",
            content: "These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the courts of competent jurisdiction."
        },
        {
            title: "12. Contact Information",
            content: "For questions about these Terms of Service, please contact us at legal@reengage.pro. We will respond to inquiries within 5 business days."
        }
    ];

    return (
        <div className="bg-[#1C3166] min-h-screen pt-28">
            {/* Header Section */}
            <section className="py-20 border-b border-white/5 bg-gradient-to-b from-slate-900 to-[#1C3166]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-slate-500/10 border border-slate-500/20 px-6 py-2.5 rounded-full mb-10">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Legal</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
                        Please read these terms carefully before using ReEngage Pro.
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                        Last updated: January 7, 2026
                    </p>
                    <div className="flex justify-center mt-12">
                        <div className="flex flex-col items-center animate-bounce opacity-40">
                            <ChevronDown className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 sm:p-16 shadow-2xl">
                        <div className="space-y-12">
                            {sections.map((section, idx) => (
                                <div key={idx} className="group">
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/10">
                            <p className="text-sm text-slate-500 font-medium text-center">
                                By using ReEngage Pro, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
